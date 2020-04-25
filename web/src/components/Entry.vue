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
        <tr v-for="(line, index) in lines" :key="line.i">
          <td class="pb-2">
            <b>{{line.i}}.</b>
          </td>
          <td>
            <v-autocomplete
              v-model="lines[index].accId"
              ref="accId"
              :items="accs.all"
              item-text="label"
              item-value="id"
              @blur="accIdChecker(index)"
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
              dense
            />
          </td>
          <td class="num">
            <v-text-field
              v-model="lines[index].c"
              ref="c"
              :rules="[v => !!v || 'Required']"
              @blur="cChecker(index)"
              dense
            />
          </td>
          <td>
            <v-text-field ref="comment" v-model="lines[index].comment" dense />
          </td>
          <td>
            <v-icon @click="delLine(line.index)" color="red lighten-1">{{metadata.icons.del}}</v-icon>
          </td>
          <td>
            <v-icon @click="insertLine(line.index)">{{metadata.icons.addRow}}</v-icon>
          </td>
        </tr>
        <tr>
          <td></td>
          <td style="vertical-align:top">
            <v-btn class="primary" @click="save()" :disabled="!(valid)">Balance {{balance | bal}}</v-btn>
          </td>
          <td colspan="3" class="caption">
            <ul>
              <li v-for="error in errors" :key="error">{{error}}</li>
            </ul>
          </td>
        </tr>
      </table>
    </v-form>
    Valid: {{valid}} / Balance:
    {{balance}} / Errors: {{errors}}
    <div v-if="lastDoc.v_lines" class="body-1 mt-5">Last Document for "{{filter.jnl.name}}"</div>
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
    isValid() {
      // console.log("isValid");
      this.balance = 0;
      this.balanceMustZero = true;
      this.errors = [];
      if (!(this.entry.ref && this.entry.regDate && this.entry.masterAccId)) {
        this.errors.push("Invalid reference, date or account");
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
        else this.errors.push("Invalid amount (not positive)");
      } else if (this.filter.jnl.type.match(/BUY_CN|SELL/)) {
        if (a && a > 0) this.balance = a;
        else this.errors.push("Invalid amount (not positive)");
      } else if (this.filter.jnl.type.match(/FINANCE/)) {
        this.balanceMustZero = false;
        if (MagicTools.isNumber(a)) this.balance = a;
        else this.errors.push("Invalid start balance");
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
            this.errors.push(`Invalid amount on line "${line.i}"`);
        } else this.errors.push(`Invalid amount on line "${line.i}"`);
      });
      if (this.balanceMustZero && this.balance !== 0)
        this.errors.push("Not balanced");
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
      this.isValid();
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
      this.isValid();
    },
    masterAccIdChecker() {
      this.isValid();
    },
    masterAmountChecker() {
      // console.log("this.entry.amount", this.entry.amount);
      this.err("masterAmount");
      let a = MagicTools.toNumber(this.entry.masterAmount, 2, true);
      if (a == null || a <= 0) this.err("masterAmount", "Invalid amount");
      else {
        this.entry.masterAmount = MagicTools.formatNumber(a);
      }
      this.isValid();
    },
    accIdChecker(i) {
      // set master comment
      if (this.entry.masterComment == null || this.entry.masterComment == "") {
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
      if (this.filter.jnl.type.match(/BUY|SELL_CN/)) {
        //   case "SELL_CN": // 7xx à 400)
        this.lines[0].d = this.entry.masterAmount;
        this.lines[0].c = MagicTools.formatNumber(0);
      } else if (this.filter.jnl.type.match(/BUY_CN|SELL/)) {
        this.lines[0].c = MagicTools.formatNumber(0);
        this.lines[0].d = this.entry.masterAmount;
      }
      this.isValid();
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
      this.isValid();
    },
    cChecker(i) {
      this.dChecker(i, "c");
    },
    addLine() {
      this.lines.push({
        i: this.lines.length + 1,
        accId: null,
        d: MagicTools.formatNumber(0),
        c: MagicTools.formatNumber(0),
        comment: null
      });
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
  width: 650px;
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
td,
th {
  /* border: 1px solid black;  */
}
td {
  padding-right: 10px;
}
</style>