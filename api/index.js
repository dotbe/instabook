const express = require('express')
const Sequelize = require('Sequelize')
const util = require('util')
const bodyParser = require('body-parser')

global.Sequelize = Sequelize;
global.util = util;

const db = require('./models/db')
const SequelizeHelper = require('./services/SequelizeHelper')

db.authenticate()
    .then(() => console.log('DB authenticated'))
    .catch(err => console.error('ERROR', err))

const app = express()
const helper = new SequelizeHelper()
app.use(bodyParser.json())

app.get("/", (req, res) => res.json(File))

// FILE
app.get('/api/files/:id?', (req, res) => {
    req.params.findAttr = {include: Doc}
    helper.restFind(File, req, res)
});
app.post('/api/files', (req, res) => {
    helper.restCreate(File, req, res)
});
app.put('/api/files/:id?', (req, res) => {
    helper.restUpdate(File, req, res)
});
app.delete('/api/files/:id', (req, res) => {
    helper.restDelete(File, req, res)
});

// DOC
app.get('/api/docs/:id?', (req, res) => {
    helper.restFind(Doc, req, res)
});
app.post('/api/docs', (req, res) => {
    helper.restCreate(Doc, req, res)
});
app.put('/api/docs/:id?', (req, res) => {
    helper.restUpdate(Doc, req, res)
});
app.delete('/api/docs/:id', (req, res) => {
    helper.restDelete(Doc, req, res)
});

// JNL
app.get('/api/jnls/:id?', (req, res) => {
    helper.restFind(Jnl, req, res)
});
app.post('/api/jnls', (req, res) => {
    helper.restCreate(Jnl, req, res)
});
app.put('/api/jnls/:id?', (req, res) => {
    helper.restUpdate(Jnl, req, res)
});
app.delete('/api/jnls/:id', (req, res) => {
    helper.restDelete(Jnl, req, res)
});

// ACC
app.get('/api/accs/:id?', (req, res) => {
    helper.restFind(Acc, req, res)
});
app.post('/api/accs', (req, res) => {
    helper.restCreate(Acc, req, res)
});
app.put('/api/accs/:id?', (req, res) => {
    helper.restUpdate(Acc, req, res)
});
app.delete('/api/accs/:id', (req, res) => {
    helper.restDelete(Acc, req, res)
});

const port = process.env.PORT || 5000
app.listen(port, console.log(`server started on port ${port}`))