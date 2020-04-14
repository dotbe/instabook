const express = require('express')
const Sequelize = require('Sequelize')
const util = require('util')
const bodyParser = require('body-parser')
const cors = require('cors');


global.Sequelize = Sequelize
global.util = util

const db = require('./models/db')
const SequelizeHelper = require('./services/SequelizeHelper')

db.authenticate()
    .then(() => console.log('DB authenticated'))
    .catch(err => console.error('ERROR', err))

const app = express()
app.use(bodyParser.json())

app.get("/", (req, res) => res.json(File))
// CORS (Cross Origin Resource Sharing) -> Access-Control-Allow-Origin
app.options('*', cors())
app.use(function(req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
}); 
// FILE
app.get('/api/files/:id?', (req, res) => {
    switch (req.query.include){
        case "docs":
            req.params.attributes = {include: Doc}
            break
    }
    new SequelizeHelper(File).restFind(req, res)
})
app.post('/api/files', (req, res) => {
    new SequelizeHelper(File).restCreate(req, res)
})
app.put('/api/files/:id?', (req, res) => {
    new SequelizeHelper(File).restUpdate(req, res)
})
app.delete('/api/files/:id', (req, res) => {
    new SequelizeHelper(File).restDelete(req, res)
})

// DOC
app.get('/api/docs/:id?', (req, res) => {
    new SequelizeHelper(Doc).restFind(req, res)
})
app.post('/api/docs', (req, res) => {
    new SequelizeHelper(Doc).restCreate(req, res)
})
app.put('/api/docs/:id?', (req, res) => {
    new SequelizeHelper(Doc).restUpdate(req, res)
})
app.delete('/api/docs/:id', (req, res) => {
    new SequelizeHelper(Doc).restDelete(req, res)
})

// JNL
app.get('/api/jnls/:id?', (req, res) => {
    new SequelizeHelper(Jnl).restFind(req, res)
})
app.post('/api/jnls', (req, res) => {
    new SequelizeHelper(Jnl).restCreate(req, res)
})
app.put('/api/jnls/:id?', (req, res) => {
    new SequelizeHelper(Jnl).restUpdate(req, res)
})
app.delete('/api/jnls/:id', (req, res) => {
    new SequelizeHelper(Jnl).restDelete(req, res)
})

// ACC
app.get('/api/accs/:id?', (req, res) => {
    new SequelizeHelper(Acc).restFind(req, res)
})
app.post('/api/accs', (req, res) => {
    new SequelizeHelper(Acc).restCreate(req, res)
})
app.put('/api/accs/:id?', (req, res) => {
    new SequelizeHelper(Acc).restUpdate(req, res)
})
app.delete('/api/accs/:id', (req, res) => {
    new SequelizeHelper(Acc).restDelete(req, res)
})

const port = process.env.PORT || 5000
app.listen(port, console.log(`server started on port ${port}`))