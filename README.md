# instabook

What?
---
An easy accounting webapp using mysql, node, express, sequelize, vue.js

Main entities: 
- file
- jnl
- account
- doc
    - line

Why?
---

SequelizeHelper
---
A tool to simplify usage of Sequelize

Add parameters to select records (in request.body or .params or .query):
- "grid.order": field asc,...
- "grid.max": 100
- "grid.page": 1
- "grid.count": true/false
- "field.eq": xx: exact search
- "field.neq": xx: not eq
- "field.is": null/notnull/true/false
- "field.start" :xxx: start with (string only)
- "field.like": xxx: contain (string only)
- "field.lt/lte/gt/gte": value <, <=, >, >= than (date, number)
- "field.between": value1,value2 (date, number)

Helper checks field name validity

Example URL:
```
    {{baseurl}}api/files?fileName.start=Hello&fileVAT.is=null&updatedAt.between=2020-03-21,
```

Example:
```
    const helper = new SequelizeHelper()
    app.get('/api/docs/:docId?', (req, res) => {
        helper.restFind(Doc, req, res)
    });
    app.post('/api/docs', (req, res) => {
        helper.restCreate(Doc, req, res)
    });
    app.put('/api/docs/:docId?', (req, res) => {
        helper.restUpdate(Doc, req, res)
    });
    app.delete('/api/docs/:docId', (req, res) => {
        helper.restDelete(Doc, req, res)
    });
```


First setup
---
```
/api>npm init
/api>npm i express sequelize mysql2 joi express-handlebars body-parser
/api>npm i -D nodemon
/api>npm i sequelize-cli -g
/package.json
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
    }
/api>npm sequelize init
/api>npm run dev
```

Status
---
- 404 not found
- 500 error

Tips
---

```
const service = async() => {
    const sub1 = await getSub()
    const sub2 = await getSub(sub2) // sequential - dependency
    return [sub1, sub2]
}

const service = async() => {
    try{
        const sub1 = getSub()
        const sub2 = getSub() // parallel and join
        const subs = await Promise.all([sub1, sub2])
        throw "ERROR" // custom error
        return subs
    }
    catch(e){
        return "error" // catch (custom) error
    }
}
```