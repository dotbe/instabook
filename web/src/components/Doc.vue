<template src="./Doc.template.vue"></template>
<style src="./Doc.style.css"></style>
<script>
// import { VueMaskFilter } from 'v-mask'
import { mapGetters, mapActions } from "vuex";
import MagicGrid from "../lib/MagicGrid";
import MagicTools from "../lib/MagicTools";
import Lines from "./Lines";
import { appBus } from "../main";

export default {
  props: ["file", "filter"],
  data() {
    return {
      validForm: false,
      doc: {},
      lastDoc: {},
      addedAccIndex: null, //-1 = master
      searchInput: null,
      searchedInput: null,
      componentKey: 0
    };
  },
  components: { Lines, MagicGrid },
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
  watch: {
    "filter.jnl"() {
      this.initDoc();
    },
    $route() {
      this.initDoc();
    }
  },
  computed: {
    ...mapGetters(["metadata", "config", "accs"]),
    balance() {
      if (!this.validForm) return false;
      console.log("master num", MagicTools.isNumber(this.doc.masterAmount));
      if (this.master.is && !MagicTools.toNumber(this.doc.masterAmount))
        return false;
      let a = this.master.sign * MagicTools.toNumber(this.doc.masterAmount);
      let d = 0;
      let c = 0;
      this.doc.lines.forEach(line => {
        d += MagicTools.toNumber(line.d);
        c += MagicTools.toNumber(line.c);
      });
      if (d + c == 0) return false;
      return a + d - c;
    },
    master() {
      let master = {
        is: false,
        accs: null,
        accLabel: null,
        sign: 0,
        zero: MagicTools.formatNumber(0),
        startWith: ""
      };
      if (this.filter.jnl.type.match(/BUY|SELL/)) {
        master.is = true;
        if (this.filter.jnl.type.match(/BUY/)) {
          master.accs = this.accs.suppliers;
          master.accLabel = "Supplier";
          master.startWith = this.config.accS;
        } else {
          master.accs = this.accs.customers;
          master.accLabel = "Customer";
          master.startWith = this.config.accC;
        }
        if (this.filter.jnl.type.match(/BUY$|SELL_CN/)) master.sign = -1;
        else master.sign = 1;
      }
      return master;
    },
    noAccountText() {
      if (this.searchedInput && this.searchedInput.match(new RegExp("^" + this.master.startWith)))
        return `Press "Tab" to create "${this.searchedInput}"`;
      return `Must start with "${this.master.startWith}"`;
    }
  },
  methods: {
    ...mapActions(["addAcc"]),
    addAccount(account = {}, addedAccIndex) {
      // dialog of the MagicGrid
      this.$refs.magic.add(account);
      this.addedAccIndex = addedAccIndex;
    },
    feedback(payload) {
      appBus.$emit("feedback", payload);
      // set the new created account
      if (payload.entity == "Acc" && this.addedAccIndex != null) {
        // master ACC
        this.addAcc(payload.data);
        this.componentKey = this.componentKey + 1;
        if (this.addedAccIndex == -1) {
          this.doc.masterAccId = payload.data.id;
          this.masterAccIdChecker();
          this.$refs.masterAmount.focus();
          this.err("masterAmount")
        } else {
          // line ACC
          this.accIdChecker(this.addedAccIndex);
        }
        this.addedAccIndex = null;
      }
    },
    elByRef(ref, i = 0) {
      let el = this.$refs[ref];
      if (Array.isArray(el)) return el[i];
      return el;
    },
    err(ref, msg = false, i = 0, condition = true) {
      let el = this.elByRef(ref, i);
      if (!el) return;
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
        d: this.master.zero,
        c: this.master.zero,
        comment: null
      });
      if (focus) this.$refs.accId[index].focus();
      if (index < this.doc.lines.length)
        this.doc.lines.forEach((el, index) => (el.i = index + 1));
    },
    async save() {
      // re-validate
      let result;
      if (!this.validForm) return;
      this.doc.jnlId = this.filter.jnl.id;
      this.doc.ref = MagicTools.toNumber(this.doc.ref);
      let a = this.master.sign * MagicTools.toNumber(this.doc.masterAmount);
      // line operation: set line.amount = d-c and remove empty doc.lines and renumber line.i
      this.doc.lines.forEach(el => {
        el.amount = MagicTools.toNumber(el.d) - MagicTools.toNumber(el.c);
      });
      this.doc.lines = this.doc.lines.filter(el => el.amount != 0);
      this.doc.lines.forEach((el, index) => (el.i = index + 1));

      if (this.master.is) {
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
    refChecker() {
      let test = MagicTools.toNumber(this.doc.ref, 0, true);
      this.err("ref");
      if (test && test > 19000000 && test < 20999999)
        this.doc.ref = MagicTools.formatRef(test);
      else this.err("ref", `Invalid format: ${this.config.docRef}`);
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
    },
    masterAccIdChecker() {
      // existing account
      if (this.doc.masterAccId != null) return;
      // new wrong account
      if (
        this.searchedInput != null &&
        !this.searchedInput.match(new RegExp("^" + this.master.startWith))
      ) {
        this.err("masterAccId", `Must start with "${this.master.startWith}"`);
        this.doc.masterAccId = null;
        return;
      }
      // new correct account
      // on added, account is set ... cfr feedback())
      if (this.searchedInput != null) {
        this.addAccount(
          {
            code: this.searchedInput,
            name: this.searchedInput.substring(this.master.startWith.length)
          },
          -1
        );
        this.searchedInput = null;
      }
    },
    masterAmountChecker() {
      let a = MagicTools.toNumber(this.doc.masterAmount, 2, true);
      this.err("masterAmount", "Invalid amount", 0, a == null || a <= 0);
      if ((a || a == 0) && a >= 0)
        this.doc.masterAmount = MagicTools.formatNumber(a);
    },
    accIdChecker(i) {
      if (!this.doc.lines[i].accId.id) {
        // new account... on added, account is set ... cfr feedback())
        this.addAccount({ code: this.doc.lines[i] }, i);
        return; // continue check after account is added
      }
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
      // required if C or D are not 0
      this.err(
        "accId",
        "Required",
        i,
        !this.doc.lines[i].accId &&
          (this.doc.lines[i].d != this.master.zero ||
            this.doc.lines[i].c != this.master.zero)
      );
      // set D/C
      if (
        this.master.is &&
        this.doc.lines[i].d == this.master.zero &&
        this.doc.lines[i].c == this.master.zero
      ) {
        if (this.balance > 0)
          this.doc.lines[i].c = MagicTools.formatNumber(this.balance);
        else this.doc.lines[i].d = MagicTools.formatNumber(-this.balance);
        this.balance = 0;
      }
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
      if (amount > 0 && this.doc.lines.length == i + 1) this.addLine();
    },
    cChecker(i) {
      this.dChecker(i, "c");
    },
    async initDoc() {
      if (!this.filter.jnl) return;

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
        ref: this.lastDoc.id
          ? this.lastDoc.ref + 1
          : new Date().getFullYear() * 10000 + 1,
        regDate: this.lastDoc.id
          ? this.lastDoc.regDate
          : MagicTools.date.today(),
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
          if (this.master.is) {
            this.doc.masterAccId = this.doc.lines[0].accId;
            this.doc.masterComment = this.doc.lines[0].comment;
            this.doc.masterAmount = Math.abs(this.doc.lines[0].amount);
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