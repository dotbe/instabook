const { Op } = require("sequelize")
const { v4: uuidv4 } = require('uuid');

class SequelizeHelper {
    constructor(entity) {
        this.entity = entity
        this.resp = { ok: true, status: 200, message: "Success", operation: null, data: null }
    }
    errorHandler(err) {
        this.resp.message = err.message
        this.resp.status = 500
        this.resp.ok = false
        // if (err.original && err.original.sqlMessage) this.resp.message += ": " + err.original.sqlMessage
        this.resp.message = "Error! " + this.fieldToLabel(this.resp.message)
        console.error("*ERROR*", new Date(), "\n", err)
    }
    fieldToLabel(msg) {
        // improve error message, replace field by label
        for (let prop in this.entity.rawAttributes) {
            if (this.entity.rawAttributes[prop].label) {
                let re = new RegExp("(" + this.entity.tableName + "\.)?" + prop + "[^']*", 'gi')
                msg = msg.replace(re, this.entity.rawAttributes[prop].label)
            }
        }
        return msg
    }
    async find(params) {
        let tmpTableName
        this.resp.operation = this.resp.operation == null ? "R" : this.resp.operation
        if (this.entity.options.viewName) {
            tmpTableName = this.entity.tableName
            this.entity.tableName = this.entity.options.viewName
        }
        // console.log("this.entity.tableName: ", this.entity.tableName)
        const parameters = this.parseParams(params)
        // console.log("parameters: ", parameters)
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
            if (parameters.grid.count) {
                parameters.grid.records = await this.entity.count({ where: { [Op.and]: where } })
            }
            await this.entity.findAll({
                ...parameters.attributes,
                where: { [Op.and]: where },
                order: this.order(parameters.grid.order),
                limit: parameters.grid.max
                //attributes: {exclude: ['createdAt', 'updatedAt']}
            })
                .then(result => {
                    this.resp.data = result
                    this.resp.parameters = parameters
                })
                .catch(err => this.errorHandler(err))
        }
        if (tmpTableName) this.entity.tableName = tmpTableName
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
        // console.log("params", params)
        if (params.attributes) result.attributes = params.attributes
        for (let param in params) {
            const aParam = param.split(".")
            if (aParam.length == 2) {
                switch (aParam[0]) {
                    case "grid":
                        switch (aParam[1]) {
                            case "count":
                                result.grid[aParam[1]] = this.convert(params[param], "boolean")
                                break
                            case "max":
                                result.grid[aParam[1]] = this.convert(params[param], "number")
                                break
                            default:
                                result.grid[aParam[1]] = params[param]
                        }

                        break
                    default:
                        result.filters[aParam[0]] = { operator: aParam[1], value: params[param] }
                }
            }
        }
        // console.log("result", result)
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
                let type = this.type(this.entity.rawAttributes[field].type)
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
                        vals[0] = this.convert(vals[0], type)
                        vals[1] = this.convert(vals[1], type)
                        // if (this.type(this.entity.rawAttributes[field].type) == "date") {
                        //     vals[0] = vals[0].length > 0 ? new Date(vals[0]) : ""
                        //     vals[1] = vals[1].length > 0 ? new Date(vals[1]) : ""
                        // }
                        // else if (this.type(this.entity.rawAttributes[field].type) == "number") {
                        //     vals[0] = vals[0].length > 0 ? Number(vals[0]) : ""
                        //     vals[1] = vals[1].length > 0 ? Number(vals[1]) : ""
                        // }
                        // if (vals.length == 2) {
                        if (vals[0] && vals[1])
                            result[field] = { [Op.between]: [vals[0], vals[1]] }
                        else if (vals[0])
                            result[field] = { [Op.gte]: vals[0] }
                        else
                            result[field] = { [Op.lte]: vals[1] }
                        // }
                        break
                    default: // eq, ne, lt, lte, gt, gte, like, notLike
                        // let val = this.convert(filters[field].value, this.type(this.entity.rawAttributes[field].type))
                        // console.log("**",this.type(this.entity.rawAttributes[field].type))
                        result[field] = {
                            [Op[filters[field].operator]]: this.convert(filters[field].value, type)
                        }
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
        this.resp.operation = "C"
        // UUID as default ID if string and not provided
        if (this.type(this.entity.rawAttributes[this.entity.primaryKeyAttributes]) == "string" &&
            !values[this.entity.primaryKeyAttributes]) {
            values[this.entity.primaryKeyAttributes] = uuidv4()
        }
        let cleanedValues = this.dataCleaning(values)
        console.log("cleanedValues", cleanedValues)
        await this.entity.create(cleanedValues)
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
        this.resp.operation = "U"
        let cleanedValues = this.dataCleaning(values)
        const where = { [this.entity.primaryKeyAttributes]: cleanedValues[this.entity.primaryKeyAttributes] }
        this.removePK(cleanedValues)
        await this.entity.update(cleanedValues, { where: where })
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
        this.resp.operation = "D"
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
    restError(message, res) {
        this.errorHandler({ message })
        res.status(this.resp.status).json(this.resp)
        return this
    }
    dataCleaning(values) {
        // clean data for insert or update
        let result = {}
        for (const fieldName in values) {
            // console.log("dataCleaning: ",fieldName, this.entity.rawAttributes[fieldName].calculated)
            if (this.entity.rawAttributes[fieldName] && this.entity.rawAttributes[fieldName].calculated != true) {
                // delete values[fieldName]
                result[fieldName] = values[fieldName]
            }
            else if (values[fieldName] === "") result[fieldName] = null
        }
        console.log("values: ", values)
        return result
    }
    removePK(data) {
        delete data[this.entity.primaryKeyAttributes]
    }
    type(type) {
        // console.log("type: ", type)
        if (!type) return "string"
        let s = type.toString()
        if (s.match(/NUMBER|INTEGER|DOUBLE|FLOAT/)) return "number"
        if (s.match(/DATE/)) return "date"
        if (s.match(/BOOLEAN/)) return "boolean"
        return "string"
    }
    convert(val, type) {
        if (val == "") return null
        switch (type) {
            case "number": return Number(val)
            case "boolean": return (val == "true" || val == true || val == "on") ? true : false
            case "date": return new Date(val)
        }
        return val
    }
}

module.exports = SequelizeHelper