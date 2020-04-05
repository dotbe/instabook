const { Op } = require("sequelize")
const { v4: uuidv4 } = require('uuid');

class SequelizeHelper {
    constructor(entity) {
        this.entity = entity
        this.resp = { ok: true, status: 200, message: "Success", data: null }
    }
    errorHandler(err) {
        this.resp.message = err.message
        this.resp.status = 500
        this.resp.ok = false
        if (err.original && err.original.sqlMessage) this.resp.message += ": " + err.original.sqlMessage
        this.resp.message = "Error! " + this.fieldToLabel(this.resp.message)
        console.error("*ERROR*", new Date(), "\n", err)
    }
    fieldToLabel(msg) {
        if (!msg.includes(this.entity.tableName + ".")) return msg
        // improve error message, replace field by label
        for (let prop in this.entity.rawAttributes) {
            if (this.entity.rawAttributes[prop].label) {
                let re = new RegExp(this.entity.tableName + "\." + prop + "[^']*", 'gi')
                msg = msg.replace(re, this.entity.rawAttributes[prop].label)
            }
        }
        return msg
    }
    async find(params) {
        // console.log("this.entity.tableName: ", this.entity.tableName, "->", this.entity.options)
        let tmpTableName
        if(this.entity.options.viewName) {
            tmpTableName = this.entity.tableName
            this.entity.tableName = this.entity.options.viewName
        }
        const parameters = this.parseParams(params)
        if (params[this.entity.primaryKeyAttributes]) {
            await this.entity.findByPk(params[this.entity.primaryKeyAttributes], parameters.attributes)
            .then((result) => {
                if (result && result.dataValues) this.resp.data = result.dataValues
                else {
                    this.resp.message = "Not Found"
                    this.resp.status = 404
                    this.resp.ok = false
                }
            })
            .catch(err => this.errorHandler(err))
        }
        else {
            const where = this.where(parameters.filters)
            // console.log("parameters**", parameters, entity.order)
            if (parameters.grid.count) {
                parameters.grid.records = await this.entity.count({ where: { [Op.and]: where } })
            }
            await this.entity.findAll({
                ...parameters.attributes,
                where: { [Op.and]: where },
                order: this.order(parameters.grid.order),
                //attributes: {exclude: ['createdAt', 'updatedAt']}
            })
            .then(result => {
                this.resp.data = result
                this.resp.parameters = parameters
            })
            .catch(err => this.errorHandler(err))
        }
        this.entity.tableName = tmpTableName
        return this.resp
    }
    parseParams(params) {
        // grid.order=field asc,...
        // grid.max=100
        // grid.page=1
        // grid.pages=10
        // grid.records=200
        // grid.count = true/false
        let result = {
            attributes: {},
            grid: {
                order: null,
                max: 10000,
                page: 1,
                count: true
            },
            filters: {}
        }
        if (params.attributes) result.attributes = params.attributes
        for (let param in params) {
            const aParam = param.split(".")
            if (aParam.length == 2) {
                switch (aParam[0]) {
                    case "grid":
                        result.grid[aParam[1]] = params[param]
                        break
                    default:
                        result.filters[aParam[0]] = { operator: aParam[1], value: params[param] }
                }
            }
        }
        return result
    }
    order(order) {
        // order "field, otherfield desc
        let result = []
        if (order) {
            order.split(",").forEach(o => {
                let a = o.split(" ")
                result.push([a[0], a.length > 1 ? a[1] : "ASC"])
            })
            return result
        }
        else if (this.entity.options.order) return this.entity.options.order
        return null

    }
    where(filters) {
        // build where clause
        /*
                any.eq=xx: exact search all fields string/number
                any.start=xx:  start with in all fields (string only)
                any.like=xx: contain in all fields (string only)
                
                field.eq=xx: exact search
                field.neq=xx: not eq
                field.is=null/notnull/true/false
 
                ** string **
                field.start=xxx: start with (string only)
                field.like=xxx: contain (string only)
 
                ** number and date ** 
                field.lt/lte/gt/gte: value <, <=, >, >= than (date, number)
        */
        let result = {}
        // console.log("***", filters)
        for (const field in filters) {
            if (this.entity.rawAttributes[field]) {
                switch (filters[field].operator) {
                    case "start":
                        result[field] = { [Op.like]: filters[field].value + "%" }
                        break
                    case "like":
                        result[field] = { [Op.like]: "%" + filters[field].value + "%" }
                        break
                    case "is":
                        switch (filters[field].value) {
                            case "null":
                                result[field] = { [Op.is]: null }
                                break
                            case "notnull":
                                result[field] = { [Op.not]: null }
                                break
                            case "true", true:
                                result[field] = { [Op.is]: true }
                                break
                            case "false", false:
                                result[field] = { [Op.is]: false }
                                break
                        }
                        break
                    case "between":
                        const vals = filters[field].value.split(",")
                        if (type(this.entity.rawAttributes[field].type) == "date") {
                            vals[0] = vals[0].length > 0 ? new Date(vals[0]) : ""
                            vals[1] = vals[1].length > 0 ? new Date(vals[1]) : ""
                        }
                        if (vals.length == 2) {
                            if (vals[0].toString().length > 0 && vals[1].toString().length > 0) {
                                result[field] = { [Op.between]: [vals[0], davals[1]] }
                            }
                            else if (vals[0].toString().length > 0) {
                                result[field] = { [Op.gte]: vals[0] }
                            }
                            else {
                                result[field] = { [Op.lte]: vals[1] }
                            }
                        }
                        break
                    default: // eq, ne, lt, lte, gt, gte, like, notLike
                        result[field] = { [Op[filters[field].operator]]: filters[field].value }
                }
            }
        }
        // console.log("where**", result)
        return result
    }
    async restFind(req, res) {
        let resp = await this.find({ ...req.body, ...req.params, ...req.query })
        res.status(resp.status).json(resp)
        return this
    }
    async create(values) {
        // UUID as default ID if string and not provided
        if (this.type(this.entity.rawAttributes[this.entity.primaryKeyAttributes]) == "string" &&
            !values[this.entity.primaryKeyAttributes]) {
            values[this.entity.primaryKeyAttributes] = uuidv4()
        }
        this.dataCleaning(values)
        console.log("values", values)
        await this.entity.create(values)
            .then(result => this.resp.data = result)
            .catch(err => this.errorHandler(err))
        return this.resp
    }
    async restCreate(req, res) {
        let resp = await this.create(req.body)
        res.status(resp.status).json(resp)
        return this
    }
    async update(values) {
        this.dataCleaning(values)
        const where = { [this.entity.primaryKeyAttributes]: values[this.entity.primaryKeyAttributes] }
        this.removePK(values)
        await this.entity.update(values, { where: where })
            .catch(err => this.errorHandler(err))
        if (this.resp.ok)
            return await this.find(where)
        return this.resp
    }
    async restUpdate(req, res) {
        let values = req.body
        if (!values[this.entity.primaryKeyAttributes])
            values[this.entity.primaryKeyAttributes] = req.params[this.entity.primaryKeyAttributes]
        let resp = await this.update(values)
        res.status(resp.status).json(resp)
        return this
    }
    async delete(values) {
        this.resp = await this.find(values)
        if (this.resp.data == null) {
            this.resp.ok = false
            this.resp.status = 404
            this.resp.message = "Not Found"
        }
        else {
            await this.entity.destroy({ where: { [this.entity.primaryKeyAttributes]: values[this.entity.primaryKeyAttributes] } })
                .then()
                .catch(err => this.errorHandler(err))
        }
        return this.resp
    }
    async restDelete(req, res) {
        let values = req.body
        if (!values[this.entity.primaryKeyAttributes])
            values[this.entity.primaryKeyAttributes] = req.params[this.entity.primaryKeyAttributes]
        let resp = await this.delete(values)
        res.status(resp.status).json(resp)
        return this
    }
    dataCleaning(values) {
        // clean data for insert or update
        for (const fieldName in values) {
            // console.log("dataCleaning: ",fieldName, this.entity.rawAttributes[fieldName].calculated)
            if (!(this.entity.rawAttributes[fieldName] && this.entity.rawAttributes[fieldName].calculated != true)) {
                delete values[fieldName]
            }
            else if (values[fieldName] === "") values[fieldName] = null
        }
        console.log("values: ",values)
    }
    removePK(data) {
        delete data[this.entity.primaryKeyAttributes]
    }
    type(field) {
        let s = field.type.toString()
        if (s.match(/NUM|INT|DOUBLE|FLOAT/)) return "number"
        if (s.match(/DATE/)) return "date"
        if (s.match(/BOOLEAN/)) return "boolean"
        return "string"
    }
}

module.exports = SequelizeHelper