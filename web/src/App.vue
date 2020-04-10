<template>
  <v-app>
    <v-app-bar app >
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
  </v-app>
</template>



<script>
export default {

};
</script>
