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

First setup
---
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