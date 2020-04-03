<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img contain src="./assets/logo.png" transition="scale-transition" width="40" />
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <Grid v-bind:config="metadata.file" />
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
  components: {
    Grid,
  },
  mounted() {
    document.title = metadata.title;
  }

  // methods:{
  //   open(item){alert(item)}
  // }
};
</script>
