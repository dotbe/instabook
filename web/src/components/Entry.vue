<template>
  <div class v-if="filter.jnl">
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
      <v-text-field
        v-model="entry.ref"
        label="Reference"
        prepend-icon="mdi-label"
        @blur="refChecker()"
        :error-messages="errors.ref"
        dense
      />
      <v-text-field
        width="10em"
        v-model="entry.regDate"
        label="Date"
        prepend-icon="mdi-calendar"
        @blur="dateChecker()"
        :error-messages="errors.regDate"
        dense
      />
      <!-- IF JNL = BUY/SELL(CN) -->
      <v-text-field
        v-if="filter.jnl.type.match(/BUY|SELL/)"
        width="10em"
        v-model="entry.acc"
        :label="filter.jnl.type.match(/BUY/)?'Supplier':'Customer'"
        prepend-icon="mdi-face"
        @blur="accChecker()"
        :error-messages="errors.acc"
        dense
      />
      {{jnlCat()}}
    </v-form>
    {{filter}}
    <hr />
    {{config}}
  </div>
</template>
<script>
import MagicTools from "../lib/MagicTools";
export default {
  data() {
    return {
      previousRef: null,
      valid: false,
      lastDoc:{},
      entry: {
        ref: null,
        regDate: null,
        acc: null
      },
      newEntry: {
        ref: null,
        regDate: null,
        acc: null
      },
      errors: {
        ref: null,
        regDate: null,
        acc: null
      }
    };
  },
  props: ["metadata", "config", "file", "accs", "filter"],
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
      this.entry = this.newEntry;
      // TODO
      if (!this.filter.jnl) return;
      let docs = MagicTools.get(
        `${this.metadata.doc.api}?jnl.eq=${this.filter.jnl.id}&grid.order=ref%20desc&grid.max=1`
      );
      
      this.lastDoc = docs[0]
      this.entry.ref =
        this.filter.jnl.nextRef == null ? 1 : this.filter.jnl.nextRef;
      o;
      n;
      //alert('changed' + o + n)
    }
  },
  methods: {
    dateChecker() {
      let dv = MagicTools.dateValidator(this.entry.regDate, true);
      console.log("dv", dv);
      this.entry.regDate = dv.date;
      this.errors.regDate = dv.errors;
    },
    refChecker() {
      if (this.entry.ref == null) {
        this.entry.ref =
          this.filter.jnl.nextRef == null ? 1 : this.filter.jnl.nextRef;
      }

      // fetch last ref
      // MagicTools.get(`${this.metadata.doc.api}?jnlId.eq=${this.filter.jnl.id}" + )
    },
    accChecker() {},
    jnlCat() {
      if (this.filter.jnl.type.match(/BUY/)) return "BUY";
      if (this.filter.jnl.type.match(/SELL/)) return "SELL";
      return this.filter.jnl.type;
    }
  },
  mounted() {
    this.refChecker();
    //if(this.previousRef == null) alert(this.filter.jnl.name)
  }
};
</script>