<template>
  <div v-if="filter.jnl">
    <!-- chrome bug with autocomplete -->
    <!-- <input style="display:none" />
    <input type="password" style="display:none" />-->
    <div class="headline">
      <v-icon class="mb-1">{{metadata.icons[filter.jnl.type]}}</v-icon>
      {{filter.jnl.name}}
      <v-icon class="mb-1">{{metadata.icons.date}}</v-icon>
      {{filter.from.value}}
      <v-icon class="mb-1">mdi-arrow-right</v-icon>
      {{filter.till.value}}
    </div>
    <hr class="mb-5" />
    <v-form ref="form" :lazy-validation="false">
      <table class="doc">
        <tr>
          <td class="ref">
            <v-text-field
              class="title"
              v-model="entry.ref"
              ref="ref"
              label="Reference"
              :prepend-icon="metadata.icons.ref"
              :rules="[v => !!v || 'Required']"
              @blur="refChecker()"
            />
          </td>
          <td class="date">
            <v-text-field
              v-model="entry.regDate"
              class="title"
              ref="regDate"
              label="Date"
              :prepend-icon="metadata.icons.date"
              :rules="[v => !!v || 'Required']"
              @blur="dateChecker()"
            />
          </td>
          <td class="acc">
            <!-- IF JNL = BUY/SELL(CN) -->
            <v-autocomplete
              v-if="filter.jnl.type.match(/BUY|SELL/)"
              v-model="entry.masterAccId"
              ref="masterAccId"
              :items="filter.jnl.type.match(/BUY/)?accs.suppliers:accs.customers"
              item-value="id"
              item-text="label"
              :rules="[v => !!v || 'Required']"
              @blur="masterAccIdChecker()"
              :prepend-icon="metadata.icons.people"
              :label="filter.jnl.type.match(/BUY/)?'Supplier':'Customer'"
              class="title"
            />
          </td>
        </tr>
        <tr>
          <td class="vatinc">
            <v-text-field
              v-if="filter.jnl.type.match(/BUY|SELL/)"
              ref="masterAmount"
              class="title num"
              v-model="entry.masterAmount"
              label="VAT incl."
              :prepend-icon="metadata.icons.amount"
              :rules="[v => !!v || 'Required']"
              @blur="masterAmountChecker()"
            />
          </td>
          <td colspan="2">
            <v-text-field
              v-if="filter.jnl.type.match(/BUY|SELL|DIVERSE/)"
              ref="masterComment"
              class="title"
              style="text-align:right"
              v-model="entry.masterComment"
              label="Comment"
              :prepend-icon="metadata.icons.comment"
            />
          </td>
        </tr>
      </table>

      <table class="lines mt-5">
        <thead>
          <th class="body-1 lineI">#</th>
          <th class="body-1 lineAccount">Account</th>
          <th class="body-1 lineD">Debit</th>
          <th class="body-1 lineC">Credit</th>
          <th class="body-1 lineComment">Comment</th>
          <th class="lineActions"></th>
          <th class="lineActions"></th>
        </thead>
        <tbody>
          <tr v-for="(line, index) in lines" :key="line.i">
            <td class="pb-2">
              <b>{{line.i}}.</b>
            </td>
            <td>
              <v-autocomplete
                v-model="line.accId"
                ref="accId"
                :items="accs.all"
                item-text="label"
                item-value="id"
                @blur="accIdChecker(index)"
                @keyup.enter="save()"
                :rules="[v => !!v || 'Required']"
                dense
              />
            </td>
            <td class="num">
              <v-text-field
                v-model="line.d"
                ref="d"
                :rules="[v => !!v || 'Required']"
                @blur="dChecker(index)"
                @keyup.enter="save()"
                dense
              />
            </td>
            <td class="num">
              <v-text-field
                v-model="line.c"
                ref="c"
                :rules="[v => !!v || 'Required']"
                @blur="cChecker(index)"
                @keyup.enter="save()"
                dense
              />
            </td>
            <td>
              <v-text-field ref="comment" v-model="line.comment" dense />
            </td>
            <td>
              <v-icon
                @click="delLine(index)"
                v-show="lines.length>1"
                color="red lighten-2"
                tabindex="-1"
              >{{metadata.icons.del}}</v-icon>
            </td>
            <td>
              <v-icon @click="addLine(index)" tabindex="-1">{{metadata.icons.addRow}}</v-icon>
            </td>
          </tr>
          <tr>
            <td></td>
            <td style="vertical-align:top">
              <v-btn class="primary" @click="save()" :disabled="!(valid)">Balance {{balance | bal}}</v-btn>
            </td>
            <td colspan="3" class="caption" style="color:IndianRed">
              <ul>
                <li v-for="error in errors" :key="error">{{error}}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </v-form>
    <div v-if="lastDoc.v_lines" class="body-1 mt-10">Last Document for "{{filter.jnl.name}}"</div>
    <Lines :lines="lastDoc.v_lines" />
    <hr class="mt-10" />
    <hr />
    {{filter}}
    <hr />
    {{config}}
    <hr />
    {{accs}}
    <hr />
    {{entry}}
    {{lines}}
  </div>
</template>



<script>
// import { VueMaskFilter } from 'v-mask'
import MagicTools from "../lib/MagicTools";
import Lines from "./Lines";
import { appBus } from "../main";

export default {
  data() {
    return {
      valid: false,
      previousRef: null,
      lastDoc: {},
      balance: false,
      errors: [],
      entry: {
        ref: null,
        regDate: null,
        masterAccId: null,
        masterAmount: 0,
        masterComment: null
      },
      lines: [
        {
          i: 1,
          accId: null,
          d: 0,
          c: 0,
          comment: "..."
        }
      ]
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
  computed: {
    nextRef() {
      if (this.entry.ref == null) {
        return this.filter.jnl.nextRef == null ? 1 : this.filter.jnl.nextRef;
      }
      return this.entry.ref;
    }
  },
  watch: {
    "filter.jnl"() {
      this.initEntry();
    }
  },
  methods: {
    elByRef(ref, i = 0) {
      let el = this.$refs[ref];
      if (Array.isArray(el)) return el[i];
      return el;
    },
    err(ref, msg = false, i = 0) {
      let el = this.elByRef(ref, i);
      if (msg) el.errorMessages.push(msg);
      else el.errorMessages.splice(0, el.errorMessages.length);
    },
    delLine(index) {
      if (this.lines.length == 1) return;
      this.lines.splice(index, 1);
      this.lines.forEach((el, index) => (el.i = index + 1));
      this.docChecker();
    },
    addLine(index = null) {
      let focus = true;
      if (index == null) {
        index = this.lines.length;
        focus = false;
      }
      this.lines.splice(index, 0, {
        i: index + 1,
        accId: null,
        d: MagicTools.formatNumber(0),
        c: MagicTools.formatNumber(0),
        comment: null
      });
      if (focus) this.$refs.accId[index].focus();
      if (index < this.lines.length)
        this.lines.forEach((el, index) => (el.i = index + 1));
      this.docChecker();
    },
    async save() {
      // re-validate
      let result;
      this.docChecker();
      if (!this.valid) return;

      this.doc = {
        jnlId: this.filter.jnl.id,
        ref: MagicTools.toNumber(this.entry.ref),
        regDate: this.entry.regDate,
        lines: []
      };
      let a = 0;
      // add line i=0 for BUY/SELL with master*
      if (this.filter.jnl.type.match(/BUY|SELL_CN/)) {
        a = MagicTools.toNumber(this.doc.masterAmount);
      } else if (this.filter.jnl.type.match(/BUY_CN|SELL/)) {
        a = -MagicTools.toNumber(this.doc.masterAmount);
      }
      if (a > 0) {
        this.doc.lines.push({
          accId: this.doc.masterAccId,
          i: 0,
          amount: a,
          comment: this.doc.masterComment
        });
      }
      // line operation: set line.amount = d-c and remove empty lines and renumber line.i
      this.lines.forEach((el, index) => {
        el.amount = MagicTools.toNumber(el.d) - MagicTools.toNumber(el.c);
        if (el.amount > 0) {
          this.doc.lines.push({
            accId: el.accId,
            i: index + (a == 0 ? 0 : 1),
            amount: a,
            comment: el.comment,
          });
        }
      });
      // submit
      console.log(this.metadata.doc.api);
      console.log(this.doc);
      if (this.doc.id) {
        result = await MagicTools.put(
          this.metadata.doc.api,
          this.doc,
          this.doc.id
        );
      } else {
        console.log("PUT");
        result = await MagicTools.post(this.metadata.doc.api, this.doc);
      }
      appBus.$emit("feedback", result);
      if (result.ok) {
        this.initEntry();
      } else {
        this.errors.push("ERROR! Document not saved: " + result.message);
      }
    },
    docChecker() {
      // set props: valid, balance, errors
      this.balance = 0;
      this.balanceMustZero = true;
      this.errors = [];
      if (!(this.entry.ref && this.entry.regDate && this.entry.masterAccId)) {
        this.errors.push("Check reference, date or account");
      }
      /*
        DIVERSE          sum(d) - sum(c) = 0 (a=0)
        FINANCE      a + sum(d) - sum(c) = x (end balance)
        BUY/SELL_CN -a + sum(d) - sum(c) = 0
        BUY_CN/SELL  a + sum(d) - sum(c) = 0
      */
      let a = MagicTools.toNumber(this.entry.masterAmount);
      if (this.filter.jnl.type.match(/BUY|SELL_CN/)) {
        if (a && a > 0) this.balance = -a;
        else this.errors.push("Check amount (not positive)");
      } else if (this.filter.jnl.type.match(/BUY_CN|SELL/)) {
        if (a && a > 0) this.balance = a;
        else this.errors.push("Check amount (not positive)");
      } else if (this.filter.jnl.type.match(/FINANCE/)) {
        this.balanceMustZero = false;
        if (MagicTools.isNumber(a)) this.balance = a;
        else this.errors.push("Check start balance");
      } else if (this.filter.jnl.type.match(/DIVERS/)) {
        this.balance = 0;
      }
      this.lines.forEach(line => {
        let d = MagicTools.toNumber(line.d);
        let c = MagicTools.toNumber(line.c);
        if (MagicTools.isNumber(d) && MagicTools.isNumber(c)) {
          if (line.accId && (c > 0) ^ (d > 0))
            this.balance = this.balance + d - c;
          else if (!line.accId && c + d != 0)
            this.errors.push(`Check amount on line "${line.i}"`);
        } else this.errors.push(`Check amount on line "${line.i}"`);
      });
      if (this.balanceMustZero && this.balance !== 0)
        this.errors.push("Check balance");
      this.valid = this.errors.length == 0;
      return this.valid;
    },
    refChecker() {
      this.err("ref");
      let test = MagicTools.toNumber(this.entry.ref, 0, true);
      if (test && test > 19000000 && test < 20999999) {
        this.entry.ref = MagicTools.formatRef(test);
      } else {
        this.err("ref", `Invalid format: ${this.config.docRef}`);
      }
      this.docChecker();
    },
    dateChecker() {
      this.err("regDate");
      let dv = MagicTools.dateValidator(this.entry.regDate, true);
      // console.log("dv", dv);
      this.entry.regDate = dv.date;
      if (dv.errors) this.err("regDate", dv.errors);
      else if (
        this.entry.regDate < this.filter.from.value ||
        this.entry.regDate > this.filter.till.value
      )
        this.err("regDate", "Out of range");
      this.docChecker();
    },
    masterAccIdChecker() {
      this.docChecker();
    },
    masterAmountChecker() {
      // console.log("this.entry.amount", this.entry.amount);
      this.err("masterAmount");
      let a = MagicTools.toNumber(this.entry.masterAmount, 2, true);
      if (a == null || a <= 0) this.err("masterAmount", "Invalid amount");
      else {
        this.entry.masterAmount = MagicTools.formatNumber(a);
      }
      this.docChecker();
    },
    accIdChecker(i) {
      // set master comment
      if (!this.entry.masterComment && this.lines[i].accId) {
        this.entry.masterComment = this.accs.all.find(
          el => el.id == this.lines[i].accId
        ).name;
      }
      // set comment
      if (this.entry.masterAccId && !this.lines[i].comment)
        this.lines[i].comment = this.accs.all.find(
          el => el.id == this.entry.masterAccId
        ).name;
      // set D/C
      if (
        this.lines[i].d == MagicTools.formatNumber(0) &&
        this.lines[i].c == MagicTools.formatNumber(0)
      ) {
        this.lines[i].d =
          this.balanceMustZero && this.balance > 0
            ? MagicTools.formatNumber(0)
            : MagicTools.formatNumber(-this.balance);
        this.lines[i].c =
          this.balanceMustZero && this.balance > 0
            ? MagicTools.formatNumber(this.balance)
            : MagicTools.formatNumber(0);
      }
      this.docChecker();
    },
    dChecker(i, src = "d") {
      // set c to 0
      let d = MagicTools.toNumber(this.lines[i].d);
      let c = MagicTools.toNumber(this.lines[i].c);
      let ok = true;
      this.err("d", false, i);
      this.err("c", false, i);
      if (!MagicTools.isNumber(d, true)) {
        this.err("d", "Invalid amount", i);
        ok = false;
      }
      if (!MagicTools.isNumber(c, true)) {
        this.err("c", "Invalid amount", i);
        ok = false;
      }
      if (ok) {
        if (src == "d" && d > 0) c = 0;
        else if (c > 0) d = 0;
        this.lines[i].d = MagicTools.formatNumber(d);
        this.lines[i].c = MagicTools.formatNumber(c);
        if (this.lines.length == i + 1 && c + d > 0) this.addLine();
      }
      this.docChecker();
    },
    cChecker(i) {
      this.dChecker(i, "c");
    },

    async initEntry() {
      this.balance = false;
      this.entry = {
        ref: null,
        regDate: null,
        masterAccId: null,
        masterAmount: MagicTools.formatNumber(0),
        masterComment: null
      };
      this.lines.splice(0, this.lines.length);
      this.addLine();
      this.lastDoc = {};
      // Get the doc for the jnl
      if (!this.filter.jnl) return;
      let docs = await MagicTools.get(
        `${this.metadata.doc.api}?jnlId.eq=${this.filter.jnl.id}&grid.order=ref%20desc&grid.max=1`
      );
      appBus.$emit("feedback", docs);
      // set the ref and date
      if (docs.data.length > 0) {
        this.lastDoc = docs.data[0];
        this.entry.ref = this.lastDoc.ref + 1;
        this.entry.regDate = this.lastDoc.regDate;
      } else {
        this.entry.ref = new Date().getFullYear() * 10000 + 1;
        this.entry.regDate = MagicTools.date.today();
      }
      this.refChecker();
      this.dateChecker();
      // cancel any validation error
      this.$refs.form.resetValidation();
      this.err("masterAmount");
      this.$refs.ref.focus();
      console.log("initEntry", this.entry);
    }
  },
  mounted() {
    this.initEntry();
  }
};
</script>

<style>
.v-label,
.v-text-field input {
  font-size: 0.9em;
}
td.date,
td.ref,
td.vatinc {
  width: 150px;
}
.num input {
  text-align: right;
}
td.acc {
  width: 300px;
}
.doc {
  border-collapse: collapse;
}
.lines {
  width: 700px;
  border-collapse: collapse;
}
.lines th {
  border-bottom: 1px solid silver;
}
.lineI {
  width: 10px;
}
.lineAccount,
.lineComment {
  width: 200px;
}
.lineC,
.lineD {
  width: 100px;
}
.lineActions {
  width: 50px;
}
td,
th {
  /* border: 1px solid black;  */
}
td {
  padding-right: 10px;
}
</style>