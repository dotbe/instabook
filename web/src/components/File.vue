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
import {mapGetters} from 'vuex'
import { appBus } from "../main";
import MagicTools from "../lib/MagicTools";

export default {
  data() {
    return {
      MagicTools,
      file: null,
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
  computed: mapGetters(["metadata", "accs", "config", "vats"]),
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
        let n1 = this.metadata.ref.jnlTypes.indexOf(a.type);
        let n2 = this.metadata.ref.jnlTypes.indexOf(b.type);
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
  },
  mounted() {
    this.fetchFile();
    this.changeDates();
  }
};
</script>