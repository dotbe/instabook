<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img contain src="./assets/logo.png" transition="scale-transition" width="40" />
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <!-- <router-view></router-view> -->
      <router-link to="/">Home</router-link>
      <router-link to="/files">Files</router-link>
      <router-link to="/accounts">Accounts</router-link>
      <router-link to="/journals">Journals</router-link>
      <router-link to="/files/10">File</router-link>
      <h1>ID {{$route.path}}</h1>
      +{{metadatum}}+
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
      if (this.$route.path.match(/\/$/)) return metadata.file
      if (this.$route.path.match(/\/files\/?$/)) return metadata.file
      if (this.$route.path.match(/\/accounts\/?$/)) return metadata.acc
      if (this.$route.path.match(/\/journals\/?$/)) return metadata.jnl
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
