let Tools = {
    async get(api) {
        let result
        await fetch(api)
            .then(payload => payload.json())
            .then(payload => result = payload)
            .catch(err => result = err)
        return result
    },
    formatNumber(value, decimals = 2) {
        return parseFloat(value).toLocaleString(undefined, {
            minimumFractionDigits: decimals
        });
        // return new Intl.NumberFormat("fr-BE", {
        //   minimumFractionDigits: 2
        // }).format(val);
    },
    toNumber(val, decimals = 2, positive = false) {
        if (val == null) return null
        let test = this.formatNumber(1234.56)//1 234,56
        val = val.replace(new RegExp(test[1], "g"), "").replace(test[5], ".")
        if (this.isNumber(val, positive)) return Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals)
        return null
    },
    isNumber(val, positive = false) {
        if (val == null) return false
        if (isNaN(Number(val))) return false
        if (positive && val <= 0) return false
        return true
    },
    date: {
        today(i = 0) {
            let tmp = new Date()
            tmp.setDate(tmp.getDate() + i)
            return (tmp.getFullYear() + "-" + this.trail(tmp.getMonth() + 1) + "-" + tmp.getDate())
        },
        boy(i = 0) {
            return (new Date().getFullYear() + i) + '-01-01'
        },
        eoy(i = 0) {
            return (new Date().getFullYear() + i) + '-12-31'
        },
        bom(i = 0) {
            return (new Date().getFullYear()) + "-" + this.trail(new Date().getMonth() + 1 + i) + '-01'
        },
        eom(i = 0) {
            let tmp = new Date(new Date().getFullYear(), (new Date().getMonth() + 1 + i), 0)
            return tmp.getFullYear() + "-" + this.trail(tmp.getMonth() + 1) + "-" + tmp.getDate()
        },
        boq(i = 0) {
            let q = (Math.ceil(new Date().getMonth() + 1) % 3) + i
            let tmp = new Date(new Date().getFullYear(), q * 3 - 2, 0)
            return (tmp.getFullYear()) + "-" + this.trail(tmp.getMonth() + 1) + '-01'
        },
        eoq(i = 0) {
            let q = (Math.ceil(new Date().getMonth() + 1) % 3) + i
            let tmp = new Date(new Date().getFullYear(), q * 3, 0)
            return tmp.getFullYear() + "-" + this.trail(tmp.getMonth() + 1) + "-" + tmp.getDate()
        },
        trail(n) { return n < 10 ? "0" + n : n }

    },
    format(value, type) {
        if (value == null) return
        if (!type) return value
        switch (type) {
            case "date":
                return this.formatDate(value)
            case "decimal":
                return this.formatNumber(value, 2)
            case "integer":
                return this.formatNumber(value, 0)
        }
        return value;
    },
    formatDate(date, type = "/") {
        if (date == null) return null;
        let a = [];
        let y, m, d;
        if (date.match(/-/)) {
            a = date.split("-");
            console.log(date, "y-m-d");
            if (a.length == 3) {
                y = a[0];
                m = a[1];
                d = a[2];
            }
        } else if (date.match(/\//)) {
            a = date.split("/");
            if (a.length == 3) {
                console.log(date, "d/m/y");
                y = a[2];
                m = a[1];
                d = a[0];
            } else if (a.length == 2) {
                console.log(date, "d/m");
                y = new Date().getFullYear();
                m = a[1];
                d = a[0];
            }
        } else if (date.length == 4) {
            console.log(date, "ddmm");
            y = new Date().getFullYear();
            m = date.substring(2);
            d = date.substring(0, 2);
        } else if (date.length == 6 || date.length == 8) {
            console.log(date, "ddmmyy or ddmmyyyy");
            y = date.substring(4);
            m = date.substring(2, 4);
            d = date.substring(0, 2);
        }
        y = Number(y);
        m = Number(m);
        d = Number(d);
        if (y > 0 && m > 0 && d > 0) {
            if (y < 70) y = y + 2000;
            else if (y < 100) y = y + 1900;
            let test = new Date(y, m - 1, d);
            if (
                test.getDate() == d &&
                test.getMonth() == m - 1 &&
                test.getFullYear() == y
            ) {
                return type == "-" ?
                    y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d)
                    :
                    (d < 10 ? "0" + d : d) + "/" + (m < 10 ? "0" + m : m) + "/" + y
            }
        }
        return null;
    },
    dateValidator(date, required = true, type = "-") {
        let result = { formated: this.formatDate(date, type) }
        date = date == "" ? null : date
        result.ok = result.formated != null || !required
        result.errors = result.ok ? [] : (date == null ? ["Date is required!"] : ["Wrong date format!"])
        result.date = result.formated ? result.formated : date
        return result
    },
    url(url, params) {
        url = new URL(url)
        if (params) Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        return url
    },
    fieldRules(field) {
        let rules = [];
        if (field.required) rules.push(value => !!value || "Required!");
        if (field.max)
            rules.push(
                value =>
                    (value && value.length <= field.max) ||
                    `Max ${field.max} characters!`
            );
        if (field.min)
            rules.push(
                value =>
                    (value && value.length >= field.min) ||
                    `Min ${field.min} characters!`
            );
        if (field.email)
            rules.push(value => {
                const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return pattern.test(value) || "Invalid e-mail.";
            });
        if (field.type == "integer")
            rules.push(value => {
                const pattern = /^[-+]?\d*$/;
                return pattern.test(value) || "Invalid Integer";
            });
        if (field.type == "number")
            rules.push(value => {
                const pattern = /^[-+]?[0-9]*(\.[0-9]+)*$/;
                return pattern.test(value) || "Invalid Number";
            });
        if (field.regexp)
            rules.push(value => field.regexp[0].test(value) || field.regexp[1]);
        if (field.rules) rules.push(...field.rules);
        // console.log("rules: ", field.type, rules)
        return rules;
    },
}
export default Tools