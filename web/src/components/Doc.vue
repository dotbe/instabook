<template src="./Doc.template.vue"></template>
<style src="./Doc.style.css"></style>
<script>
// import { VueMaskFilter } from 'v-mask'
import MagicTools from "../lib/MagicTools";
import Lines from "./Lines";
import { appBus } from "../main";
import { _ } from "vue-underscore";

export default {
  data() {
    return {
      balanced: false,
      balance: false,
      balanceMustZero: undefined,
      validForm: false,
      doc: {},
      lastDoc: {}
    };
  },
  props: ["metadata", "config", "file", "accs", "filter"],
  components: { Lines },
  filters: {
    num(val) {
      return MagicTools.formatNumber(val);
    },
    bal(val) {
      let n = MagicTools.toNumber(val);
      if (MagicTools.isNumber(n)) {
        return n > 0
          ? "D " + MagicTools.formatNumber(val)
          : "C " + MagicTools.formatNumber(-val);
      }
      return null;
    },
    ref(val) {
      return MagicTools.formatRef(val);
    }
  },
  // computed: {
  //   nextRef() {
  //     if (this.doc.ref == null) {
  //       return this.filter.jnl.nextRef == null ? 1 : this.filter.jnl.nextRef;
  //     }
  //     return this.doc.ref;
  //   }
  // },
  watch: {
    "filter.jnl"() {
      this.initDoc();
    },
    $route() {
      this.initDoc();
    }
  },
  methods: {
    elByRef(ref, i = 0) {
      let el = this.$refs[ref];
      if (Array.isArray(el)) return el[i];
      return el;
    },
    err(ref, msg = false, i = 0, condition = true) {
      let el = this.elByRef(ref, i);
      el.errorMessages.splice(0, el.errorMessages.length);
      if (msg && condition) {
        el.errorMessages.push(msg);
        return true;
      }
      return false;
    },
    delLine(index) {
      if (this.doc.lines.length == 1) return;
      this.doc.lines.splice(index, 1);
      this.doc.lines.forEach((el, index) => (el.i = index + 1));
      this.balanceChecker();
    },
    addLine(index = null) {
      let focus = true;
      if (index == null) {
        index = this.doc.lines.length;
        focus = false;
      }
      this.doc.lines.splice(index, 0, {
        i: index + 1,
        accId: null,
        d: MagicTools.formatNumber(0),
        c: MagicTools.formatNumber(0),
        comment: null
      });
      if (focus) this.$refs.accId[index].focus();
      if (index < this.doc.lines.length)
        this.doc.lines.forEach((el, index) => (el.i = index + 1));
    },
    async save() {
      // re-validate
      let result;
      this.balanceChecker();
      if (!this.validForm) return;
      this.doc.jnlId = this.filter.jnl.id;
      this.doc.ref = MagicTools.toNumber(this.doc.ref);
      let a = 0;
      // line operation: set line.amount = d-c and remove empty doc.lines and renumber line.i
      this.doc.lines.forEach(el => {
        el.amount = MagicTools.toNumber(el.d) - MagicTools.toNumber(el.c);
      });
      this.doc.lines = this.doc.lines.filter(el => el.amount != 0);
      this.doc.lines.forEach((el, index) => (el.i = index + 1));

      // add line i=0 for BUY/SELL with master*
      if (this.filter.jnl.type.match(/BUY|SELL_CN/)) {
        a = -MagicTools.toNumber(this.doc.masterAmount);
      } else if (this.filter.jnl.type.match(/BUY_CN|SELL/)) {
        a = MagicTools.toNumber(this.doc.masterAmount);
      }
      if (a != 0) {
        this.doc.lines.unshift({
          accId: this.doc.masterAccId,
          i: 0,
          amount: a,
          comment: this.doc.masterComment
        });
      }
      // submit
      console.log("doc: ", this.doc);
      if (this.doc.id) {
        result = await MagicTools.put(
          this.metadata.doc.api,
          this.doc,
          this.doc.id
        );
      } else {
        result = await MagicTools.post(this.metadata.doc.api, this.doc);
      }
      appBus.$emit("feedback", result);
      if (result.ok) {
        this.$router.push(`/files/${this.file.id}/doc`);
        this.initDoc();
      }
    },
    balanceChecker() {
      this.balanced = false;
      this.balance = 0;
      this.balanceMustZero = undefined;
      if (!this.validForm) return;
      /*
        DIVERSE          sum(d) - sum(c) = 0 (a=0)
        FINANCE      a + sum(d) - sum(c) = x (end balance)
        BUY/SELL_CN -a + sum(d) - sum(c) = 0
        BUY_CN/SELL  a + sum(d) - sum(c) = 0
      */
      this.balanceMustZero = true;
      let a = MagicTools.toNumber(this.doc.masterAmount);
      if (this.filter.jnl.type.match(/BUY|SELL_CN/)) {
        this.balance = -a;
      } else if (this.filter.jnl.type.match(/BUY_CN|SELL/)) {
        this.balance = a;
      } else if (this.filter.jnl.type.match(/FINANCE/)) {
        this.balanceMustZero = false;
        this.balance = a;
      } else if (this.filter.jnl.type.match(/DIVERS/)) {
        this.balance = 0;
      }
      this.doc.lines.forEach(line => {
        this.balance =
          this.balance +
          MagicTools.toNumber(line.d) -
          MagicTools.toNumber(line.c);
      });
      this.balanced = this.balanceMustZero ? this.balance == 0 : true;
    },
    refChecker() {
      let test = MagicTools.toNumber(this.doc.ref, 0, true);
      this.err("ref");
      if (test && test > 19000000 && test < 20999999)
        this.doc.ref = MagicTools.formatRef(test);
      else this.err("ref", `Invalid format: ${this.config.docRef}`);
      this.balanceChecker();
    },
    dateChecker() {
      this.err("regDate");
      let dv = MagicTools.dateValidator(this.doc.regDate, true);
      // console.log("dv", dv);
      this.doc.regDate = dv.date;
      if (dv.errors) this.err("regDate", dv.errors);
      else
        this.err(
          "regDate",
          "Out of range",
          0,
          this.doc.regDate < this.filter.from.value ||
            this.doc.regDate > this.filter.till.value
        );
      this.balanceChecker();
    },
    masterAccIdChecker() {
      null;
      this.balanceChecker();
    },
    masterAmountChecker() {
      let a = MagicTools.toNumber(this.doc.masterAmount, 2, true);
      this.err("masterAmount", "Invalid amount", 0, a == null || a <= 0);
      if (a >= 0) this.doc.masterAmount = MagicTools.formatNumber(a);
      this.balanceChecker();
    },
    accIdChecker(i) {
      // set master comment
      if (!this.doc.masterComment && this.doc.lines[i].accId) {
        this.doc.masterComment = this.accs.all.find(
          el => el.id == this.doc.lines[i].accId
        ).name;
      }
      // set comment
      if (this.doc.masterAccId && !this.doc.lines[i].comment)
        this.doc.lines[i].comment = this.accs.all.find(
          el => el.id == this.doc.masterAccId
        ).name;
      // required id c or d are not 0
      this.err(
        "accId",
        "Required",
        i,
        !this.doc.lines[i].accId &&
          (this.doc.lines[i].d != MagicTools.formatNumber(0) ||
            this.doc.lines[i].c != MagicTools.formatNumber(0))
      );
      // set D/C
      if (
        this.balanceMustZero &&
        this.doc.lines[i].d == MagicTools.formatNumber(0) &&
        this.doc.lines[i].c == MagicTools.formatNumber(0)
      ) {
        this.doc.lines[i].d =
          this.balance > 0
            ? MagicTools.formatNumber(0)
            : MagicTools.formatNumber(-this.balance);
        this.doc.lines[i].c =
          this.balance > 0
            ? MagicTools.formatNumber(this.balance)
            : MagicTools.formatNumber(0);
      }
      this.balanceChecker();
    },
    dChecker(i, src = "d") {
      // set c to 0
      this.err("d", false, i);
      this.err("c", false, i);
      let amount = MagicTools.toNumber(this.doc.lines[i][src]);
      if (
        !this.err(src, "Invalid amount", i, !MagicTools.isNumber(amount, true))
      ) {
        // if amount is correct, set alternative to zero, check account is set, format amount
        if (amount > 0) {
          this.doc.lines[i][src == "d" ? "c" : "d"] = MagicTools.formatNumber(
            0
          );
          this.err("accId", "Required", i, !this.doc.lines[i].accId);
        }
        this.doc.lines[i][src] = MagicTools.formatNumber(amount);
      }
      // add line if it's the last one
      if (this.doc.lines.length == i + 1) this.addLine();
      this.balanceChecker();
    },
    cChecker(i) {
      this.dChecker(i, "c");
    },

    async initDoc() {
      if (!this.filter.jnl) return;
      this.balanced = false;
      console.log("EDIT: ", this.$route.params);
      // Get the doc for the jnl
      this.lastDoc = {};
      let docs = await MagicTools.get(
        `${this.metadata.doc.api}?jnlId.eq=${this.filter.jnl.id}&grid.order=ref%20desc&grid.max=1`
      );
      appBus.$emit("feedback", docs);
      if (docs.data.length) {
        this.lastDoc = docs.data[0];
        this.lastDoc.v_lines.sort(MagicTools.sortBy("i"));
      }
      // create an empty doc
      this.doc = {
        ref: _.isEmpty(this.lastDoc)
          ? new Date().getFullYear() * 10000 + 1
          : this.lastDoc.ref + 1,
        regDate: _.isEmpty(this.lastDoc)
          ? MagicTools.date.today()
          : this.lastDoc.regDate,
        masterAccId: null,
        masterAmount: 0,
        masterComment: null,
        lines: []
      };
      this.doc.lines.splice(0, this.doc.lines.length);
      this.addLine();
      // load existing doc?
      if (this.$route.params.docId) {
        let resp = await MagicTools.get(
          this.metadata.doc.api,
          this.$route.params.docId
        );
        appBus.$emit("feedback", resp);
        this.doc = resp.data;
        if (this.doc.jnlId != this.filter.jnl.id) {
          this.$router.push(`/files/${this.file.id}/doc`);
          this.initDoc();
        } else {
          // good document, prepare it for edition
          this.doc.lines.sort(MagicTools.sortBy("i"));
          this.doc.lines.forEach(el => {
            el.d = el.amount > 0 ? el.amount : 0;
            el.c = el.amount < 0 ? el.amount : 0;
          });
          if (this.filter.jnl.type.match(/BUY.*|SELL.*/)) {
            this.doc.masterAccId = this.doc.lines[0].accId;
            this.doc.masterComment = this.doc.lines[0].comment;
            this.doc.masterAmount = this.filter.jnl.type.match(/BUY|SELL_CN/)
              ? -this.doc.lines[0].amount
              : +this.doc.lines[0].amount;
            this.doc.lines.splice(0, 1);
          }
        }
      }
      // format ref, date and amounts
      this.refChecker();
      this.dateChecker();
      this.masterAmountChecker();
      // cancel any validation error
      this.$refs.form.resetValidation();
      this.err("masterAmount");
      this.$refs.ref.focus();
      console.log("initDoc", this.doc);
    }
  },
  mounted() {
    this.initDoc();
  }
};
</script>