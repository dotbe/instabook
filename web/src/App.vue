<template>
  <v-app>
    <v-app-bar app>
      <div class="d-flex align-center mr-4">
        <router-link to="/">
          <v-img contain src="./assets/logo.png" transition="scale-transition" width="40" />
        </router-link>
      </div>
      <!-- <router-view></router-view> -->
      <v-toolbar-items>
        <v-btn light to="/files">Files</v-btn>
        <v-btn light to="/accounts">Accounts</v-btn>
        <v-btn light to="/journals">Journals</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-snackbar top v-model="feedback" :color="feedbackColor">
      {{ feedbackMsg }}
      <v-icon @click="feedback = false">mdi-close-thick</v-icon>
    </v-snackbar>
  </v-app>
</template>



<script>
// import Vue from "vue"
import {appBus} from "./main";
// import MagicBus from './lib/MagicBus'
// Vue.mixin(MagicBus)

export default {
  data() {
    return {
      feedback: false,
      feedbackMsg: null,
      feedbackColor: ""
    };
  },
  created() {
    // MagicBus.$on("feedback", data => {
    //   this.feedback = true;
    //   this.feedbackMsg = data;
    // });
    appBus.$on("feedback", data => {
      if(!data.ok){
        this.feedback = true;
        this.feedbackMsg = data.message;
        if(!isNaN(data.status) && data.status >=500) this.feedbackColor="red"
        else this.feedbackColor="orange"
      }
    });
  }
};
</script>
