# instabook

What?
---
An easy accounting webapp using fo the back-end: mysql, node, express, sequelize
and for the front-end: vue.js, vuex, vuetity

Main entities: 
- file (a File is an entity - company...)
  - jnl (a File has many Journals)
    - doc (a Journal has many Documents)
      - line (a Document has many Lines)
- account (Chart of Accounts is common to all Files)

Why?
---

SequelizeHelper
---
A tool to simplify usage of Sequelize

define Sequelize entity:
```
       (...)
        id:{
          // for text primary key, UUID is generated
        }
        accName:{
            label: "VAT Account", //to  improve error message
            calculated: true, // select only!
        },
    },
    {
        viewName: "v_vat", // for select only... with calculated fields
        freezeTableName: true,
    }
```

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
    {{baseurl}}api/files?name.start=Hello&taxRef.is=null&updatedAt.between=2020-03-21,
    {{baseurl}}api/files?name.start=Hello&taxRef.is=null&updatedAt.between=2020-03-21,&grid.order=name asc
```
returns a structure
```
{
    "status": 200, // or 500 or 404
    "message": "Success", // or "Not Found" or and error message
    "operation": "R" // or "C", "U", "D" (for CRUD)
    "data": [], // search result
    "parameters": { // parameter 
        "findAttr": {}, // attributes injected in the find() method
        "grid": {
            "order": null, // sort order as a string
            "max": 10000, // max result
            "page": 1,
            "count": true, // do count and set "records" values
            "records": 19 // number of records if count is true
            "pages": 1
        },
        "filters": {
          "someField":{"operator":"between", "value":"1,100"}
          "someOtherField":{"operator":"like", "value":"XYZ"}
        }
    }
}
```

Example:
```
app.get('/api/files/:id?', (req, res) => {
    req.params.attributes = {include: Doc}
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

```

Grid - Vue.js component
---
````
const metadata = {
  file: {
    api: "http://localhost:5000/api/files",
    label: {
      list: "Files",
      add: "New File",
      edit: "Edit File"
    },
    fields: [
      name: { text: "Name", required:true },
      taxRef: { text: "VAT" },
      "user.name": { form:false, text: "User" },
      userId: { grid:false, text: "User" },
      type: { type:"autocomplete", options:[], value: "id", label: "label", text: "Type" },
      status: { type:"select", options:["ACTIVE", "INACTIVE"], text: "Status" },
      other: { type:"number", min:0, max:10, required: true },
      code: { regexpx: [//]},
    ]
  }
};
       <!--- custom edit form --->
      <Grid v-bind:config="metadata.file" v-slot:default="slotProps"> 
       <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="slotProps.editedItem.name" label="Name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="slotProps.editedItem.taxRef" label="VAT"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
       </Grid>

        <!--- default edit form --->
       <Grid v-bind:config="metadata.file" />

       <!--- add custom actions --->
        <Grid v-bind:config="metadata.file">
        <template v-slot:custom-actions="slotProps" >
          <v-icon @click="open(slotProps.item.name)" class="mx-2">mdi-folder-open</v-icon>
        </template>
      </Grid>

<!--- another way to custom actions => metadata[entity].action.custom array {icon, fct}--->
  let metadata = {
    file: {
        api: "http://localhost:5000/api/files",
        actions: {
            del: true,
            edit: true,
            custom: [{
                icon: "mdi-folder-open",
                fct: (el) => alert(el.name),
                maxwidth: "30em",
            }],
        },

````

First setup
---
* Rest API
```
/instabook/api>npm init
/instabook/api>npm i express sequelize mysql2 body-parser uuid
/instabook/api>npm i -D nodemon
/instabook/api>npm i sequelize-cli -g
/instabook/api/package.json
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
    }
/instabook/api>npm sequelize init
/instabook/api>npm run dev

npm install cors --save
```
* Front-end
````
/instabook>npm i -g @vue-cli
/instabook>vue create web
/web>vue add vuetify
/web>npm install --save vue-router
/web>npm install --save vuex
/web>npm run serve
````
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