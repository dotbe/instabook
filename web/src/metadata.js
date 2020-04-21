let _api  ="http://localhost:5000/api"
let metadata = {
    title: "InstaBook",
    api: _api,
    icons:{
        ref: "mdi-label",
        people: "mdi-face",
        date: "mdi-calendar",
        account: "mdi-pound-box",
        amount: "mdi-currency-eur",
        BUY: "mdi-inbox-arrow-down",
        BUY_CN: "mdi-inbox-arrow-down-outline",
        SELL: "mdi-inbox-arrow-up",
        SELL_CN: "mdi-inbox-arrow-up-outline",
        FINANCE: "mdi-currency-eur",
        DIVERSE: "mdi-inbox",
    },
    file: {
        api: _api + "/files",
        refetch: false,
        actions: {
            del: true,
            edit: true,
            custom: [{
                icon: "mdi-folder-open",
                fct: (el, router) => router.push("/files/" + (el.id) +  "/entry").catch(e => e),
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
                options:["BUY", "SELL", "BUY_CN", "SELL_CN", "FINANCE", "DIVERSE"],
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
            // nextRef:{
            //     // value: 'name',
            //     text: 'Next Doc Num',
            //     type: 'integer'
            //     // width: "30em"
            // },
            active:{
                // value: 'active',
                text: 'Active',
                type: 'checkbox',
                width: "10em",
                default: true,
            },
        },
    },
    doc: {
        api: _api + "/docs",
        refetch: false,
        actions: {
            del: true,
            edit: true,
        },
        labels: {
            list: "Documents",
            add: "New Document",
            edit: "Edit Document",
        },
        form: {
            // width: "500px",
        },
        fields: {
            
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
            descr:{
                // value: 'name',
                text: 'Description',
                readonly: true,
                type: 'textarea'
                // width: "30em"
            },
        },
    },
}

export default metadata