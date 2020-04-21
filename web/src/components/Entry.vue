<template>
  <div v-if="filter.jnl">
    <div class="headline">
      <v-icon class="mb-1">{{metadata.icons[filter.jnl.type]}}</v-icon>
      {{filter.jnl.name}}
      <v-icon class="mb-1">{{metadata.icons.date}}</v-icon>
      {{filter.from.value}}
      <v-icon class="mb-1">mdi-arrow-right</v-icon>
      {{filter.till.value}}
    </div>
    <hr class="mb-5" />
    <v-form ref="entryForm" v-model="valid" :lazy-validation="true">
      <table class="t">
        <tr>
          <td class="ref">
            <v-text-field
              class="title mb-3"
              v-model="entry.ref"
              ref="ref"
              label="Reference"
              :prepend-icon="metadata.icons.ref"
              @blur="refChecker()"
              :error-messages="errors.ref"
              dense
            />
          </td>
          <td class="date">
            <v-text-field
              v-model="entry.regDate"
              class="title mb-3 narrow"
              ref="regDate"
              label="Date"
              :prepend-icon="metadata.icons.date"
              @blur="dateChecker()"
              :error-messages="errors.regDate"
              dense
            />
          </td>
          <td class="acc">
            <!-- IF JNL = BUY/SELL(CN) -->
            <v-text-field
              v-if="filter.jnl.type.match(/BUY|SELL/)"
              class="title mb-3"
              v-model="entry.acc"
              ref="acc"
              :label="filter.jnl.type.match(/BUY/)?'Supplier':'Customer'"
              :prepend-icon="metadata.icons.people"
              @blur="accChecker()"
              :error-messages="errors.acc"
              dense
            />
          </td>
          <td class="vatinc">
            <v-text-field
              v-if="filter.jnl.type.match(/BUY|SELL/)"
              ref="amount"
              class="title mb-3 num"
              style="text-align:right"
              v-model="entry.amount"
              label="VAT incl."
              :prepend-icon="metadata.icons.amount"
              @blur="amountChecker()"
              :error-messages="errors.amount"
              dense
            />
          </td>
        </tr>
      </table>
      <hr />
      {{jnlCat()}}
    </v-form>
    {{filter}}
    <hr />
    {{config}}
    <hr />
    <Lines :lines="lastDoc.v_lines" />
  </div>
</template>

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
.num input{
  text-align: right;
}
td.acc {
  width: 300px;
}
.t {
  /*border: 1px solid black;*/
}
</style>

<script>
// import { VueMaskFilter } from 'v-mask'
import MagicTools from "../lib/MagicTools";
import Lines from "./Lines";
import { appBus } from "../main";

export default {
  data() {
    return {
      previousRef: null,
      valid: false,
      lastDoc: {},
      entry: {
        ref: null,
        regDate: null,
        acc: null,
        amount: null
      },
      newEntry: {
        ref: null,
        regDate: null,
        acc: null,
        amount: 4546.65
      },
      errors: {
        ref: null,
        regDate: null,
        acc: null,
        amount: null
      }
    };
  },
  props: ["metadata", "config", "file", "accs", "filter"],
  components: { Lines },
  // filters: {
  //   num(val) {
  //     return MagicTools.formatNumber(val)
  //   },
  //   ref(val) {
  //       return val.toString().substring(0, 4) + "-" + val.toString().substring(4)
  //   }
  // },
  computed: {
    nextRef() {
      if (this.entry.ref == null) {
        return this.filter.jnl.nextRef == null ? 1 : this.filter.jnl.nextRef;
      }
      return this.entry.ref;
    }
  },
  watch: {
    "filter.jnl"(o, n) {
      this.initEntry();

      o;
      n;
      //alert('changed' + o + n)
    }
  },
  methods: {
    refChecker() {
      this.errors.ref = null;
      if (this.entry.ref.toString().match(/^\d{8}$/)) {
        this.entry.ref = this.entry.ref
          .toString()
          .replace(/^(\d{4})(\d{4})$/, "$1/$2");
      } else if (!this.entry.ref.toString().match(/^\d{4}\/?\d{4}$/)) {
        this.errors.ref = `Invalid format. Should be ${this.config.docRef}`;
      }
    },
    dateChecker() {
      this.errors.regDate = null;
      let dv = MagicTools.dateValidator(this.entry.regDate, true);
      // console.log("dv", dv);
      this.entry.regDate = dv.date;
      this.errors.regDate = dv.errors;
      if (
        this.errors.regDate == null &&
        (this.errors.regDate < this.filter.from.value ||
          this.errors.regDate > this.filter.till.value)
      )
        this.errors.regDate = "Date is out of range";
    },
    accChecker() {},
    amountChecker() {
      this.errors.amount = null;
      let test = MagicTools.toNumber(this.entry.amount, 2, true)
      if(test ==  null ) {
        this.errors.amount = `Invalid Number`;
      }
      else this.entry.amount = MagicTools.formatNumber(test);
    },
    async initEntry() {
      this.entry = this.newEntry;
      this.lastDoc = {};
      // TODO
      if (!this.filter.jnl) return;
      let docs = await MagicTools.get(
        `${this.metadata.doc.api}?jnlId.eq=${this.filter.jnl.id}&grid.order=ref%20desc&grid.max=1`
      );
      if (!docs.ok) {
        appBus.$emit("feedback", docs);
      }
      if (docs.data.length > 0) {
        this.lastDoc = docs.data[0];
        this.entry.ref = this.lastDoc.ref + 1;
        this.entry.regDate = this.lastDoc.regDate;
      } else {
        this.entry.ref = new Date().getFullYear() * 10000 + 1;
        this.entry.regDate = MagicTools.date.today();
      }
      this.refChecker();
      this.$refs.ref.focus();
      // fetch last ref
      // MagicTools.get(`${this.metadata.doc.api}?jnlId.eq=${this.filter.jnl.id}" + )
    },
    jnlCat() {
      if (this.filter.jnl.type.match(/BUY/)) return "BUY";
      if (this.filter.jnl.type.match(/SELL/)) return "SELL";
      return this.filter.jnl.type;
    }
  },
  mounted() {
    this.initEntry();
    //if(this.previousRef == null) alert(this.filter.jnl.name)
  }
};
</script>