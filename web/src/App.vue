<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <router-link to="/">
          <v-img contain src="./assets/logo.png" transition="scale-transition" width="40" />
        </router-link>
      </div>
      <!-- <router-view></router-view> -->
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn light to="/files">Files</v-btn>
        <v-btn light to="/accounts">Accounts</v-btn>
        <v-btn light to="/journals">Journals</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <Grid v-if="metadatum" v-bind:config="metadatum" />
    </v-content>
  </v-app>
</template>



<script>
import Grid from "./components/Grid";
import metadata from "./metadata";

export default {
  name: "App",
  data() {
    return { metadata };
  },
  watch: {
    $route(to, from) {
      to;
      from;
    }
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
    Grid
  },
  mounted() {
    document.title = metadata.title;
  }

  // methods:{
  //   open(item){alert(item)}
  // }
};
</script>
