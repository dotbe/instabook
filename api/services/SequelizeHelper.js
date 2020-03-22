const { Op } = require("sequelize");

class SequelizeHelper {
    errorHandler(entity, err, resp) {
        resp.message = err.message
        resp.status = 500
        if (err.original && err.original.sqlMessage) resp.message += ": " + err.original.sqlMessage;
        resp.message = "Error! " + this.fieldLabel(entity, resp.message)
        console.error("*ERROR*", new Date(), "\n", err);
    }
    fieldLabel(entity, msg) {
        if (!msg.includes(entity.tableName + ".")) return msg
        // improve error message, replace field by label
        for (let prop in entity.rawAttributes) {
            if (entity.rawAttributes[prop].label) {
                let re = new RegExp(entity.tableName + "\." + prop + "[^']*", 'gi')
                msg = msg.replace(re, entity.rawAttributes[prop].label)
            }
        }
        return msg
    }
    async find(entity, params) {
        console.log("criteria**", params)
        let resp = { status: 200, message: "Success", data: null };
        const parameters = this.parseParams(params)
        if (params[entity.primaryKeyAttributes]) {
            await entity.findByPk(params[entity.primaryKeyAttributes], parameters.findAttr)
                .then((result) => {
                    if (result && result.dataValues) resp.data = result.dataValues;
                    else {
                        resp.message = "Not Found";
                        resp.status = 404;
                    }
                })
                .catch(err => this.errorHandler(entity, err, resp))
        }
        else {
           
            const where = this.where(entity, parameters.filters)
            // console.log("parameters**", parameters, entity.order)
            if (parameters.grid.count) {
                parameters.grid.records = await entity.count({ where: { [Op.and]: where } })
            }
            await entity.findAll({
                ...parameters.findAttr,
                where: { [Op.and]: where },
                order: this.order(entity, parameters.grid.order),
                //attributes: {exclude: ['createdAt', 'updatedAt']}
            })
                .then(result => {
                    resp.data = result;
                    resp.parameters = parameters
                })
                .catch(err => this.errorHandler(entity, err, resp))
        }
        return resp;
    }
    parseParams(params) {
        // grid.order=field asc,...
        // grid.max=100
        // grid.page=1
        // grid.pages=10
        // grid.records=200
        // grid.count = true/false
        let result = {
            findAttr: {},
            grid: {
                order: null,
                max: 10000,
                page: 1,
                count: true
            },
            filters: {}
        }
        if (params.findAttr) result.findAttr = params.findAttr
        for (let param in params) {
            const aParam = param.split(".");
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
    order(entity, order) {
        // order "field, otherfield desc
        let result = []
        if (order) {
            order.split(",").forEach(o => {
                let a = o.split(" ")
                result.push([a[0], a.length > 1 ? a[1] : "ASC"])
            })
            return result
        }
        else if (entity.options.order) return entity.options.order
        return null

    }
    where(entity, filters) {
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
            if (entity.rawAttributes[field]) {
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
                        // console.log("vals", vals, entity.rawAttributes[field].type)
                        if (entity.rawAttributes[field].type.toString().search("DATE") >= 0) {
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
    async restFind(entity, req, res) {
        let resp = await this.find(entity, { ...req.body, ...req.params, ...req.query })
        res.status(resp.status).json(resp);
    }
    async create(entity, values) {
        let resp = { status: 200, message: "Success", data: null };
        this.dataCleaning(entity, values);
        await entity.create(values)
            .then(result => resp.data = result)
            .catch(err => this.errorHandler(entity, err, resp));
        return resp;
    }

    async restCreate(entity, req, res) {
        let resp = await this.create(entity, req.body)
        res.status(resp.status).json(resp);
    }
    async update(entity, values) {
        let resp = { status: 200, message: "Success", data: null };
        this.dataCleaning(entity, values);
        const id = values[entity.primaryKeyAttributes];
        const where = { [entity.primaryKeyAttributes]: id };
        this.removePK(entity, values)
        await entity.update(values, { where: where })
            .catch(err => this.errorHandler(entity, err, resp));
        if (resp.status == 200)
            return await this.find(entity, where);
        return resp;
    }
    async restUpdate(entity, req, res) {
        let values = req.body
        if (!values[entity.primaryKeyAttributes])
            values[entity.primaryKeyAttributes] = req.params[entity.primaryKeyAttributes];
        let resp = await this.update(entity, values)
        res.status(resp.status).json(resp);
    }
    async delete(entity, values) {
        let resp = { status: 200, message: "Success", data: null };
        await entity.findByPk(values[entity.primaryKeyAttributes])
            .then((result) => resp.data = result)
            .catch(err => this.errorHandler(entity, err, resp))
        if (resp.data == null) {
            resp.status = 404
            resp.message = "Not Found";
        }
        else {
            await entity.destroy({ where: { [entity.primaryKeyAttributes]: values[entity.primaryKeyAttributes] } })
                .then()
                .catch(err => this.errorHandler(entity, err, resp))
        }
        return resp;
    }
    async restDelete(entity, req, res) {
        let values = req.body
        if (!values[entity.primaryKeyAttributes])
            values[entity.primaryKeyAttributes] = req.params[entity.primaryKeyAttributes];
        let resp = await this.delete(entity, values)
        res.status(resp.status).json(resp);
    }
    dataCleaning(entity, data) {
        // clean data for insert or update
        for (const prop in data) {
            //console.log("****",prop,"=",data[prop], data[prop] === "")
            if (prop in entity.rawAttributes == false) {
                delete data[prop]
            }
            else if (data[prop] === "") data[prop] = null
        }
    }
    removePK(entity, data) {
        delete data[entity.primaryKeyAttributes]
    }
};

module.exports = SequelizeHelper;