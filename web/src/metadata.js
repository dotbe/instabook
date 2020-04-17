let _api  ="http://localhost:5000/api"
let metadata = {
    title: "InstaBook",
    api: _api,
    file: {
        api: _api + "/files",
        refetch: false,
        actions: {
            del: true,
            edit: true,
            custom: [{
                icon: "mdi-folder-open",
                fct: (el, router) => router.push("/files/" + (el.id)).catch(e => e),
                color: "orange",
            }],
        },
        labels: {
            list: "Files",
            add: "New File",
            edit: "Edit File"
        },
        form: {
            // width: "500px",
        },
        fields: {
            name:{
                // value: 'name',
                text: 'Name',
                disabled: true,
                required: true,
                max: 30,
                min: 3,
                regexp: [/^\S*$/, "No space!"]
                // width: "30em",
                // email: true,
            },
            taxRef:{
                // value: 'taxRef',
                text: 'VAT',
                required: false,
                // width: "30em"
            },
        }
    },
    acc: {
        api: _api + "/accs",
        refetch: false,
        actions: {
            del: true,
            edit: true,
        },
        labels: {
            list: "Accounts",
            add: "New Account",
            edit: "Edit Account",
        },
        form: {
            // width: "500px",
        },
        fields: {
            code:{
                // value: 'code',
                text: 'Code',
                disabled: true,
                required: true,
                max: 20,
                min: 6,
                regexp: [/^\S*$/, "No space!"],
                // width: "30em",
                // email: true,
            },
            name:{
                // value: 'name',
                text: 'Name',
                required: true,
                // width: "30em"
            },
            active:{
                // value: 'active',
                text: 'Active',
                type: 'checkbox',
                width: "10em",
                default: true,
            },
        },
    },
    jnl: {
        api: _api + "/jnls",
        refetch: false,
        actions: {
            del: true,
            edit: true,
        },
        labels: {
            list: "Journals",
            add: "New Journal",
            edit: "Edit Journal",
        },
        form: {
            // width: "500px",
        },
        fields: {
            fileId:{
                type: "hidden"
            },
            type:{
                // value: 'type',
                text: 'Type',
                disabled: true,
                required: true,
                options:["BUY", "SELL", "BUY-CN", "SELL-CN", "FINANCE", "DIVERSE"],
                type: 'select',
                // width: "30em",
                // email: true,
            },
            name:{
                // value: 'name',
                text: 'Name',
                required: true,
                // width: "30em"
            },
            active:{
                // value: 'active',
                text: 'Active',
                type: 'checkbox',
                width: "10em",
                default: true,
            },
        },
    },
    conf: {
        api: _api + "/confs",
        refetch: false,
        actions: {
            del: true,
            edit: true,
        },
        labels: {
            list: "Configuration",
            add: "New Configuration",
            edit: "Edit Configuration",
        },
        form: {
            // width: "500px",
        },
        fields: {
            id:{
                // value: 'type',
                text: 'Name',
                required: true,
                disabled: true,
                // width: "30em",
                // email: true,
            },
            val:{
                // value: 'name',
                text: 'Value',
                // width: "30em"
            },
        },
    },
}

export default metadata