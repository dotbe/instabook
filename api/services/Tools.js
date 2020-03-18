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
    async find(entity, criteria) {
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
                .catch(err => {
                    console.error(err);
                    resp.message = err.message;
                    resp.status = 500;
                })
        }
        else {
            await entity.findAll()
                .then(result => resp.data = result)
                .catch(err => {
                    console.error(err);
                    resp.message = err.message;
                    resp.status = 500;
                })
        }
        return resp;
    }
    async restFind(entity, req, res) {
        let resp = await this.find(entity, { ...req.body, ...req.params })
        res.status(resp.status).json(resp);
    }
    async create(entity, values) {
        let resp = { status: 200, message: "Success", data: null };
        this.removeUnknown(entity, values);
        await entity.create(values)
            .then(result => resp.data = result)
            .catch(err => {
                resp.message = err.message
                resp.status = 500
                if (err.original && err.original.sqlMessage) resp.message += " (" + err.original.sqlMessage + ")";
                console.error("ERROR", new Date(), "\n", err);
            });
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
            .catch(err => {
                resp.message = err.message
                resp.status = 500
                if (err.original && err.original.sqlMessage)
                    resp.message += " (" + err.original.sqlMessage + ")";
                console.error("ERROR", new Date(), "\n", err);
            });
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
            .catch(err => {
                resp.status = 500
                resp.message = err.message
            })
        if (resp.data == null) {
            resp.status = 404
            resp.message = "Not Found";
        }
        else {
            await entity.destroy({ where: { [entity.primaryKeyAttributes]: values[entity.primaryKeyAttributes] } })
                .then()
                .catch(err => {
                    resp.status = 500;
                    resp.message = err.message
                    if (err.original && err.original.sqlMessage)
                        resp.message += " (" + err.original.sqlMessage + ")";
                    console.error("ERROR", new Date(), "\n", err);
                })
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