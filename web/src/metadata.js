let metadata = {
    title: "InstaBook",
    file: {
        api: "http://localhost:5000/api/files",
        refetch: false,
        actions: {
            del: true,
            edit: true,
            custom: [{
                icon: "mdi-folder-open",
                fct: (el) => alert(el.name),
                color: "orange",
            }],
        },
        labels: {
            list: "Files",
            add: "New File",
            edit: "Edit File"
        },
        form:{
           // width: "500px",
        },
        fields: [
            {
                value: 'name',
                text: 'Name',
                disabled: true,
                required:true,
                max: 30,
                min: 3,
                regexp: [/^\S*$/, "No space!"]
                // width: "30em",
                // email: true,
            },
            {
                value: 'taxRef',
                text: 'VAT',
                required:false,
                // width: "30em"
            },
            {
                value: 'countDoc',
                text: '# Docs',
                type: 'integer',
                readonly: true,
                width: "10em",
            },
            {
                value: 'lastRegDate',
                type: 'date',
                text: 'Last',
                readonly: true,
                width: "10em"
            },
        ]
    }
}

export default metadata