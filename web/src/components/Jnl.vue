<template>
  <MagicGrid :config="metadatum" :params="params" @feedback="feedback" />
</template>
<script>
import {mapGetters} from 'vuex'

import MagicGrid from "../lib/MagicGrid";
import { appBus } from "../main";

export default {
  props: ["file"],
  components: { MagicGrid },
  computed: {
    ...mapGetters(["metadata"]),
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
      // alert(data.operation)
      if(data.operation != "R") this.$emit("jnlUpdated");
      appBus.$emit("feedback", data);
    }
  },
};
</script>