let metadata = {
    title: "InstaBook",
    file: {
        api: "http://localhost:5000/api/files",
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
            width: "500px",
        },
        fields: [
            {
                value: 'name',
                text: 'Name',
                // width: "30em"
            },
            {
                value: 'taxRef',
                text: 'VAT',
                // width: "30em"
            },
        ]
    }
}

export default metadata