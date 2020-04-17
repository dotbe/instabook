<template>
  <MagicGrid :config="metadatum" :params="params" @feedback="feedback" />
</template>
<script>
import MagicGrid from "../lib/MagicGrid";
import { appBus } from "../main";

export default {
  props: ["metadata", "file"],
  components: { MagicGrid },
  computed: {
    params(){
      return {"fileId.eq": this.file.id}
    },
    metadatum() {
      let md = Object.assign({}, this.metadata.jnl)
      md.fields.fileId.default = this.file.id
      return md;
    }
  },
  methods: {
    feedback(data) {
      appBus.$emit("feedback", data);
    }
  }
};
</script>