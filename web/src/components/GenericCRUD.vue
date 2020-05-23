<template>
  <MagicGrid v-bind:config="metadatum" @feedback="feedback" />
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import MagicGrid from "../lib/MagicGrid";
import { appBus } from "../main";

export default {
  computed: {
    ...mapGetters(["accs", "config", "metadata", "vats"]),
    metadatum() {
      if (this.$route.path.match(/\/$/)) return this.metadata.file;
      if (this.$route.path.match(/\/files\/?$/)) return this.metadata.file;
      if (this.$route.path.match(/\/files\/[0-9a-fA-F-]*\/parameters\/?$/)) {
        return this.metadata.jnl;
      }
      if (this.$route.path.match(/\/accounts\/?$/)) {
        return this.metadata.acc;
      }
      if (this.$route.path.match(/\/vats\/?$/)) {
        return this.metadata.vat;
      }
      if (this.$route.path.match(/\/parameters\/?$/)) return this.metadata.conf;
      return null;
    }
  },
  methods: {
    ...mapActions(["fetchAccs", "fetchVats", "fetchConfig"]),

    async feedback(data) {
      console.log("GC.feedback", data);
      appBus.$emit("feedback", data);
      if (data.operation.match(/C|U|D/))
        switch (data.entity) {
          case "Acc":
            await this.fetchAccs();
            break;
          case "Vat":
            await this.fetchVats();
            break;
          case "Conf":
            await this.fetchConfig();
            break;
        }
    }
  },
  components: {
    MagicGrid
  },
  mounted() {
    console.log("accs", this.accs);
    document.title = this.metadata.title;
  }
};
</script>