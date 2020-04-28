<template src="./File.template.vue"></template>
<style>
.vertical {
  flex-direction: column;
}
.vertical .v-btn__content {
  justify-content: left;
}
</style>
<script>
import { appBus } from "../main";
import MagicTools from "../lib/MagicTools";
import metadata from "../metadata";

export default {
  data() {
    return {
      MagicTools,
      metadata,
      config: {},
      file: null,
      accs: {
        all: [],
        suppliers: [],
        customers: []
      },
      filter: {
        jnl: null,
        period: "ty",
        from: { value: null, errors: [] },
        till: { value: null, errors: [] },
        acc: {
          select: "all",
          selected: [],
          from: null,
          to: null
        },
        valid: false
      },
      tab: this.$route.path
    };
  },
  methods: {
    refresh() {
      alert("ok");
    },
    changeDates() {
      switch (this.filter.period) {
        case "ty":
          this.filter.from.value = MagicTools.date.boy();
          this.filter.till.value = MagicTools.date.eoy();
          break;
        case "ly":
          this.filter.from.value = MagicTools.date.boy(-1);
          this.filter.till.value = MagicTools.date.eoy(-1);
          break;
        case "tq":
          this.filter.from.value = MagicTools.date.boq();
          this.filter.till.value = MagicTools.date.eoq();
          break;
        case "lq":
          this.filter.from.value = MagicTools.date.boq(-1);
          this.filter.till.value = MagicTools.date.eoq(-1);
          break;
        case "tm":
          this.filter.from.value = MagicTools.date.bom();
          this.filter.till.value = MagicTools.date.eom();
          break;
        case "lm":
          this.filter.from.value = MagicTools.date.bom(-1);
          this.filter.till.value = MagicTools.date.eom(-1);
          break;
      }
    },
    dateChecker(data, required = true) {
      let dv = MagicTools.dateValidator(data.value, required);
      console.log("dv", dv);
      data.value = dv.date;
      data.errors = dv.errors;
    },
    sortJnls() {
      this.file.jnls.sort((a, b) => {
        let n1 = this.metadata.jnl.fields.type.options.indexOf(a.type);
        let n2 = this.metadata.jnl.fields.type.options.indexOf(b.type);
        return n1 < n2 ? -1 : 1;
      });
    },
    async fetchFile() {
      this.file = await MagicTools.get(
        this.metadata.file.api + "/" + this.$route.params.fileId
      );
      appBus.$emit("feedback", this.file);
      this.file = this.file.data;
      this.sortJnls();
      this.filter.jnl = this.file.jnls[0] ? this.file.jnls[0] : null;
    },
    async fetchAccs() {
      let payload = await MagicTools.get(this.metadata.acc.api);
      appBus.$emit("feedback", payload);
      this.accs.all = payload.data;
      this.accs.all.forEach(el => (el.label = el.code + " (" + el.name + ")"));
      let reS = new RegExp("^" + this.config.accS);
      let reC = new RegExp("^" + this.config.accC);
      this.accs.suppliers = this.accs.all.filter(el => el.code.match(reS));
      this.accs.customers = this.accs.all.filter(el => el.code.match(reC));
      console.log("fetchAccs", this.accs)
    },
    async fetchConfig() {
      let confs = await MagicTools.get(this.metadata.conf.api);
      appBus.$emit("feedback", confs);
      confs.data.forEach(el => (this.config[el.id] = el.val));
    }
  },
  mounted() {
    console.log("route", this.$route.params);
    this.fetchConfig();
    this.fetchFile();
    this.fetchAccs();
    this.changeDates();
  }
};
</script>