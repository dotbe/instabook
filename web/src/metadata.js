let _api = "http://localhost:5000/api"
let metadata = {
    title: "InstaBook",
    api: _api,
    icons: {
        del: "mdi-delete",
        addRow: "mdi-table-row-plus-before",
        ref: "mdi-label",
        people: "mdi-account",
        date: "mdi-calendar",
        account: "mdi-tag",
        amount: "mdi-currency-eur",
        comment: "mdi-comment",
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
                fct: (el, router) => router.push("/files/" + (el.id) + "/doc").catch(e => e),
                color: "orange",
            }],
        },
        labels: {
            list: "Files",
            add: "New File",
            edit: "Edit File"
        },
        form: {
        },
        fields: {
            name: {
                text: 'Name',
                disabled: true,
                required: true,
                max: 30,
                min: 3,
                regexp: [/^\S*$/, "No space!"]
            },
            taxRef: {
                text: 'VAT',
                required: false,
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
        },
        fields: {
            code: {
                text: 'Code',
                disabled: true,
                required: true,
                max: 20,
                min: 6,
                regexp: [/^\S*$/, "No space!"],
            },
            name: {
                text: 'Name',
                required: true,
            },
            defAccId: {
                text: 'Counterpart Account',
                type: "autocomplete",
                options: "accs",
                value:"id",
                label:"label",
            },
            vatCode: {
                text: 'VAT Code',
                type: "select",
                options: "vatCodes",
            },
            active: {
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
            fileId: {
                type: "hidden"
            },
            type: {
                text: 'Type',
                disabled: true,
                required: true,
                options: ["BUY", "SELL", "BUY_CN", "SELL_CN", "FINANCE", "DIVERSE"],
                type: 'select',
            },
            name: {
                text: 'Name',
                required: true,
            },
            accId: {
                text: 'Counterpart',
                type: "autocomplete",
                options: "accs",
                value: "id",
                label:"label"
            },
            active: {
                text: 'Active',
                type: 'checkbox',
                width: "10em",
                default: true,
            },
        },
    },
    vat: {
        api: _api + "/vats",
        refetch: true,
        actions: {
            del: true,
            edit: true,
        },
        labels: {
            list: "VAT Codes",
            add: "New Code",
            edit: "Edit Code",
        },
        form: {
            // width: "500px",
        },
        fields: {
            jnlType: {
                text: 'Type',
                required: true,
                options: ["BUY", "SELL", "BUY_CN", "SELL_CN"],
                type: 'select',
            },
            code: {
                text: 'Code',
                required: true,
            },
            box: {
                text: 'VAT - declaration box',
                required: true,
            },
            baseBox: {
                text: 'Base - declaration box',
                required: true,
            },
            accId: {
                text: 'VAT Account',
                type: "autocomplete",
                options: [],
                value: "id",
                label: "label",
                required: true,
                grid: false,
            },
            accName: {
                text: 'VAT Account',
                type: "autocomplete",
                options: [],
                value: "id",
                label: "label",
                required: true,
                form: false,
            },
            pc: {
                text: 'VAT Percentage',
                tootip: "Negative for Credit; Positive for Debit",
                type: 'number',
                required: true,
                default: 0,
            },
        },
    },
    doc: {
        api: _api + "/docs",
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
        },
        fields: {
            id: {
                text: 'Name',
                required: true,
                disabled: true,
            },
            val: {
                text: 'Value',
            },
            descr: {
                text: 'Description',
                readonly: true,
                type: 'textarea'
            },
        },
    },
}

export default metadata