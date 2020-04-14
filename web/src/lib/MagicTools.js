let Tools = {
    async get(api) {
        let result
        await fetch(api)
            .then(payload => payload.json())
            .then(payload => result = payload)
            .catch(err => result = err)
        return result
    },
    date: {
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
    formatNumber(value, decimals = 2) {
        value = parseFloat(value)
        return value.toLocaleString(undefined, {
            minimumFractionDigits: decimals
        });
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
}
export default Tools