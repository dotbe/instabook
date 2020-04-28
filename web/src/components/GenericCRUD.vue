<template>
  <MagicGrid v-bind:config="metadatum" @feedback="feedback" />
</template>

<script>
import MagicTools from "../lib/MagicTools";
import MagicGrid from "../lib/MagicGrid";
import metadata from "../metadata";
import { appBus } from "../main";

export default {
  data() {
    return { metadata, accs: [] };
  },
  computed: {
    metadatum() {
      if (this.$route.path.match(/\/$/)) return metadata.file;
      if (this.$route.path.match(/\/files\/?$/)) return metadata.file;
      if (this.$route.path.match(/\/files\/[0-9a-fA-F-]*\/parameters\/?$/))
        return metadata.jnl;
      if (this.$route.path.match(/\/accounts\/?$/)) return metadata.acc;
      if (this.$route.path.match(/\/vats\/?$/)) {
        return metadata.vat;
      }
      if (this.$route.path.match(/\/parameters\/?$/)) return metadata.conf;
      return null;
    }
  },
  methods: {
    feedback(data) {
      appBus.$emit("feedback", data);
    },
    async fetchAccs() {
      let payload = await MagicTools.get(metadata.acc.api);
      appBus.$emit("feedback", payload);
      console.log("accs", payload);
      if (payload.ok) {
        this.accs = payload.data;
        this.accs.forEach(el => (el.label = el.code + " (" + el.name + ")"));
        this.metadata.vat.fields.accId.options = this.accs;
      }
    }
  },
  components: {
    MagicGrid
  },
  mounted() {
    this.fetchAccs();
    document.title = metadata.title;
  }
};
</script>