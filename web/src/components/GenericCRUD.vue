<template>
  <MagicGrid v-bind:config="metadatum" @feedback="feedback" />
</template>

<script>
import { mapGetters, mapActions } from "vuex";

// import MagicTools from "../lib/MagicTools";
import MagicGrid from "../lib/MagicGrid";
import metadata from "../metadata";
// import store from "../store"
import { appBus } from "../main";

export default {
  data() {
    return {
     // metadata,
      // accs: [],
    };
  },
  computed: {
    ...mapGetters(["accs", "config", "jnlTypes", "vats"]),
    metadatum() {
      if (this.$route.path.match(/\/$/)) return metadata.file;
      if (this.$route.path.match(/\/files\/?$/)) return metadata.file;
      if (this.$route.path.match(/\/files\/[0-9a-fA-F-]*\/parameters\/?$/)){
        return metadata.jnl;
      }
      if (this.$route.path.match(/\/accounts\/?$/)) {
        metadata.acc.fields.vatCode.options = this.vats.codes
        metadata.acc.fields.accId.options = this.accs.all
        console.log("metadata.acc.fields.vatCode",metadata.acc.fields.vatCode)
        return metadata.acc;
      }
      if (this.$route.path.match(/\/vats\/?$/)) {
        return metadata.vat;
      }
      if (this.$route.path.match(/\/parameters\/?$/)) return metadata.conf;
      return null;
    }
  },
  methods: {
    ...mapActions(["fetchAccs", "fetchConfig"]),
    feedback(data) {
      console.log("GC.feedback", data)
      appBus.$emit("feedback", data);
      if (data.operation.match(/C|U|D/) && data.entity == "Acc") {
        this.fetchAccs();
      }
    }
    // async fetchAccs() {
    //   let payload = await MagicTools.get(metadata.acc.api);
    //   appBus.$emit("feedback", payload);
    //   // console.log("accs", payload);
    //   if (payload.ok) {
    //     this.accs = payload.data;
    //     this.accs.forEach(el => (el.label = el.code + " (" + el.name + ")"));
    //     this.metadata.vat.fields.accId.options = this.accs;
    //     this.metadata.acc.fields.accId.options = this.accs;
    //     this.metadata.jnl.fields.accId.options = this.accs;
    //   }
    // }
  },
  components: {
    MagicGrid
  },
  mounted() {
    this.fetchConfig()
    // this.fetchAccs();
    console.log("accs",this.accs)
    document.title = metadata.title;
  }
};
</script>