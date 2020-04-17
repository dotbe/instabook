<template>
  <MagicGrid v-bind:config="metadatum" @feedback="feedback"/>
</template>

<script>
import MagicGrid from "../lib/MagicGrid";
import metadata from "../metadata";
import {appBus} from '../main'

export default {
  data() {
    return { metadata };
  },
  computed: {
    metadatum() {
      if (this.$route.path.match(/\/$/)) return metadata.file;
      if (this.$route.path.match(/\/files\/?$/)) return metadata.file;
      if (this.$route.path.match(/\/files\/[0-9a-fA-F-]*\/parameters\/?$/)) return metadata.jnl;
      if (this.$route.path.match(/\/accounts\/?$/)) return metadata.acc;
      if (this.$route.path.match(/\/parameters\/?$/)) return metadata.conf;
      return null;
    }
  },
  methods:{
    feedback(data){
      appBus.$emit("feedback", data)
    }
  },
  components: {
    MagicGrid
  },
  mounted() {
    document.title = metadata.title;
  }
};
</script>