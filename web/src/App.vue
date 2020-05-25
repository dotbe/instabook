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
        <v-btn light to="/vats">VAT Codes</v-btn>
        <v-btn light to="/parameters">
          <v-icon>mdi-wrench</v-icon>
        </v-btn>
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
import { appBus } from "./main";
// import MagicBus from './lib/MagicBus'
// Vue.mixin(MagicBus)
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      feedback: false,
      feedbackMsg: null,
      feedbackColor: ""
    };
  },
  computed: mapGetters(["config", "accs", "vats"]),
  methods: mapActions(["fetchConfig", "fetchAccs", "fetchVats"]),
  created() {
    // MagicBus.$on("feedback", data => {
    //   this.feedback = true;
    //   this.feedbackMsg = data;
    // });
    appBus.$on("feedback", data => {
      if (data && data.ok == false) {
        // handled error
        this.feedback = true;
        this.feedbackMsg = data.message ? data.message : data;
        if (!isNaN(data.status) && data.status < 500)
          this.feedbackColor = "orange";
        else this.feedbackColor = "red";
      } else if (data && !data.ok) {
        // unhandled error
        this.feedback = true;
        this.feedbackMsg = "Unknow error: " + data;
        this.feedbackColor = "pink";
      } else if (data && data.ok && data.operation.match(/C|U|D/)) {
        // refresh ref data
        switch (data.entity) {
          case "Acc":
            this.fetchAccs();
            break;
          case "Vat":
            this.fetchVats();
            break;
          case "Conf":
            this.fetchConfig();
            break;
        }
      }
    });
    this.fetchConfig();
    this.fetchAccs();
    this.fetchVats();
  }
};
</script>

<style>
.v-label,
.v-text-field input {
  font-size: 0.9em;
}
</style>