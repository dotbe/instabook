const Joi = require('joi');

class Tools {
    validate(entity, values) {
        const validation = Joi.validate(values, entity.schema);
        if (validation.error) {
            res.status(400).send(validation.error.details[0].message);
            return false;
        }
        return true;
    }
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
    async find(entity, criteria) {
        console.log("criteria**", criteria)
        let resp = { status: 200, message: "Success", data: null };
        if (criteria[entity.primaryKeyAttributes]) {
            await entity.findByPk(criteria[entity.primaryKeyAttributes])
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
            // build where clause
            /*
                criteria:
                    grid.sort=field asc,...
                    grid.max=100
                    grid.page=1
                    grid.pages=10
                    grid.count=200
                    
                    AND...
                    eq.any: exact search all fields string/number
                    start.any:  start with in all fields (string only)
                    find.any: contain in all fields (string only)

                    eq.field: exact search
                    start.field: start with (string only)
                    find.field: contain (string only)

                    lt.field: value less than (date, number)
                    lte.field: value less than or equal (date, number)
                    gt.field
                    gte.field

                    in.field: list of values
                    
            */
            await entity.findAll()
                .then(result => resp.data = result)
                .catch(err => this.errorHandler(entity, err, resp))
        }
        return resp;
    }
    async restFind(entity, req, res) {
        let resp = await this.find(entity, { ...req.body, ...req.params, ...req.query })
        res.status(resp.status).json(resp);
    }
    async create(entity, values) {
        let resp = { status: 200, message: "Success", data: null };
        this.removeUnknown(entity, values);
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
        this.removeUnknown(entity, values);
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
    removeUnknown(entity, data) {
        for (const prop in data) {
            if (prop in entity.rawAttributes == false) {
                delete data[prop]
            }
        }
    }
    removePK(entity, data) {
        delete data[entity.primaryKeyAttributes]
    }
};

module.exports = Tools;