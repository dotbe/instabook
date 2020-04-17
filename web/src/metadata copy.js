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
        fields: [
            {
                value: 'name',
                text: 'Name',
                disabled: true,
                required: true,
                max: 30,
                min: 3,
                regexp: [/^\S*$/, "No space!"]
                // width: "30em",
                // email: true,
            },
            {
                value: 'taxRef',
                text: 'VAT',
                required: false,
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
    },
    acc: {
        api: "http://localhost:5000/api/accs",
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
        fields: [
            {
                value: 'code',
                text: 'Code',
                disabled: true,
                required: true,
                max: 20,
                min: 6,
                regexp: [/^\S*$/, "No space!"],
                // width: "30em",
                // email: true,
            },
            {
                value: 'name',
                text: 'Name',
                required: true,
                // width: "30em"
            },
            {
                value: 'active',
                text: 'Active',
                type: 'checkbox',
                width: "10em",
                default: true,
            },
        ],
    },
    jnl: {
        api: "http://localhost:5000/api/jnls",
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
        fields: [
            {
                value: 'type',
                text: 'Type',
                disabled: true,
                required: true,
                options:["BUY", "SELL", "BUY-CN", "SELL-CN", "FINANCE", "DIVERSE"],
                type: 'select',
                // width: "30em",
                // email: true,
            },
            {
                value: 'name',
                text: 'Name',
                required: true,
                // width: "30em"
            },
            {
                value: 'active',
                text: 'Active',
                type: 'checkbox',
                width: "10em",
                required: true,
                default: true,
            },
        ],
    },
}

export default metadata