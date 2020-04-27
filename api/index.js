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
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization");
    res.header("Content-Type", "application/json");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
// FILE
app.get('/api/files', (req, res) => {
    new SequelizeHelper(File).restFind(req, res)
})
app.get('/api/files/:id', (req, res) => {
    // switch (req.query.include) {
    //     case "jnls":
    //         break
    // }
    req.params.attributes = { include: Jnl }
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
    req.params.attributes = { include: [Line,V_Line] }
    new SequelizeHelper(Doc).restFind(req, res)
})
app.post('/api/docs', async(req, res) =>  {
    let doc = req.body
    let balance = doc.lines.reduce((acc, el) => acc + el.amount, 0)
    if (balance != 0) {
        new SequelizeHelper(Doc).restError(`Document ${doc.ref} is not balanced: ${balance}`, res)
    }
    else {
        try {
            let newDoc = await new SequelizeHelper(Doc).create(doc) // create adds the ID to the object
            console.log("doc: ", doc)
            doc.lines.forEach(async line => {
                line.docId = doc.id
                const r = await new SequelizeHelper(Line).create(line)
            })
            // console.log("newDoc: ", newDoc)
            res.status(newDoc.status).json(newDoc)
        } catch (error) {
            new SequelizeHelper(Doc).delete(doc.id)
            new SequelizeHelper(Doc).restError(error.message, res) 
        }
    }

})
app.put('/api/docs/:id?', (req, res) => {
    new SequelizeHelper(Doc).restUpdate(req, res)
})
app.delete('/api/docs/:id', (req, res) => {
    new SequelizeHelper(Doc).restDelete(req, res)
})

// LINE and V_LINE 
// app.get('/api/lines/:id?', (req, res) => {
//     new SequelizeHelper(Line).restFind(req, res)
// })
app.get('/api/v_lines/:id?', (req, res) => {
    new SequelizeHelper(Line).restCreate(req, res)
})
// app.put('/api/lines/:id?', (req, res) => {
//     new SequelizeHelper(Line).restUpdate(req, res)
// })
// app.delete('/api/lines/:id', (req, res) => {
//     new SequelizeHelper(Line).restDelete(req, res)
// })

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

// CONF
app.get('/api/confs/:id?', (req, res) => {
    new SequelizeHelper(Conf).restFind(req, res)
})
app.post('/api/confs', (req, res) => {
    new SequelizeHelper(Conf).restCreate(req, res)
})
app.put('/api/confs/:id?', (req, res) => {
    new SequelizeHelper(Conf).restUpdate(req, res)
})
app.delete('/api/confs/:id', (req, res) => {
    new SequelizeHelper(Conf).restDelete(req, res)
})

const port = process.env.PORT || 5000
app.listen(port, console.log(`server started on port ${port}`))