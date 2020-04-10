<template>
  <GridMagic v-if="metadatum" v-bind:config="metadatum" />
</template>

<script>
import GridMagic from "../lib/GridMagic";
import metadata from "../metadata";
export default {
  data() {
    return { metadata };
  },
  computed: {
    metadatum() {
      if (this.$route.path.match(/\/$/)) return metadata.file;
      if (this.$route.path.match(/\/files\/?$/)) return metadata.file;
      if (this.$route.path.match(/\/accounts\/?$/)) return metadata.acc;
      if (this.$route.path.match(/\/journals\/?$/)) return metadata.jnl;
      return null;
    }
  },
  components: {
    GridMagic
  },
  mounted() {
    document.title = metadata.title;
  }
};
</script>