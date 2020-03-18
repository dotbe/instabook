const express = require('express');

const Joi = require('joi');
const Sequelize = require('Sequelize');

const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');
const util = require('util')

global.Joi = Joi;
global.Sequelize = Sequelize;
global.util = util;

const db = require('./config/db');
const Tools = require('./services/Tools');
const File = require('./models/File');

db.authenticate()
    .then(() => console.log('DB authenticated'))
    .catch(err => console.error('ERROR', err));

console.log("File: ", Object.keys(File.tableAttributes))
const app = express();
const tools = new Tools();
app.use(bodyParser.json());

app.get("/", (req, res) => res.json(File))


app.get('/api/files/:fileId?', (req, res) => {
    tools.restFind(File, req, res);
});
app.post('/api/files', (req, res) => {
    tools.restCreate( File, req, res);
});
app.put('/api/files/:fileId?', (req, res) => {
    tools.restUpdate(File, req , res);
});
app.delete('/api/files/:fileId', (req, res) => {
    tools.restDelete(File, req , res);
});


app.get('/api/docs/', (req, res) => res.send(req.query));
app.get('/api/docs/:docId', (req, res) => res.send(req.params));

app.get('/api/jnls/', (req, res) => res.send(req.query));
app.get('/api/jnls/:jnlId', (req, res) => res.send(req.params));

app.get('/api/accounts/', (req, res) => res.send(req.query));
app.get('/api/accounts/:accId', (req, res) => res.send(req.params));

const port = process.env.PORT || 5000;

app.listen(port, console.log(`server started on port ${port}`));