<template>
  <div v-if="jnls && file">
    <v-card class="d-flex flex-row mb-2" flat tile>
      <v-card class="ma-2" max-width="300">
        <div class="headline mt-2 ml-5">{{file.name}}</div>
        <!-- JOURNALS -->
        <v-list dense>
          <v-list-item-group v-model="jnlIndex" color="primary">
            <v-list-item v-for="(jnl, i) in jnls" :key="i">
              <v-list-item-content>
                <v-list-item-title v-text="jnl.name"></v-list-item-title>
                <v-list-item-subtitle v-text="jnl.type"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon :disabled="!jnl.active" :to="`/files/${file.id}/journal/${jnl.id}`">
                  <v-icon color="primary">mdi-file-plus</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
        <!-- OTHER CRITERIA -->
        <v-form ref="form" v-model="formValid" :lazy-validation="true">
          <!-- DATE -->
          <v-card class="d-flex flex-row pl-2 pr-2" flat>
            <v-card flat width="50%">
              <v-text-field
                v-model="from.value"
                label="From"
                prepend-icon="mdi-calendar"
                @blur="dateChecker(from)"
                :error-messages="from.errors"
              ></v-text-field>
            </v-card>
            <v-card flat width="50%">
              <v-text-field
                v-model="till.value"
                label="Till"
                prepend-icon="mdi-calendar"
                @blur="dateChecker(till)"
                :error-messages="till.errors"
              ></v-text-field>
            </v-card>
          </v-card>
          <!-- ACCOUNT -->
          <v-card flat class="ml-2 mr-2 mt-n3">
            <v-radio-group v-model="account" row>
              <v-radio label="All accounts" value="all"></v-radio>
              <v-radio label="Some" value="some"></v-radio>
            </v-radio-group>
          </v-card>
          <v-card-actions>
            <v-btn text :to="`/files/${file.id}/balance`">Balance</v-btn>
            <v-btn text :to="`/files/${file.id}/ledger`">Ledger</v-btn>
            <v-btn text :to="`/files/${file.id}/journal`">Journal</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>

      <v-card class="mt-2 mr-2 mb-2" width="100%">
        <router-view></router-view>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import MagicTools from "../lib/MagicTools";
import metadata from "../metadata";

export default {
  data() {
    return {
      MagicTools,
      metadata,
      file: null,
      from: { value: null, errors: [] },
      till: { value: null, errors: [] },
      account: "all",
      accounts: [],
      formValid: false,
      jnls: null,
      jnlIndex: -1
    };
  },
  methods: {
    dateChecker(data, required = true) {
      let dv = MagicTools.dateValidator(data.value, required);
      console.log("dv", dv);
      data.value = dv.date;
      data.errors = dv.errors;
    },
    fetchFile() {
      fetch(this.metadata.file.api + "/" + this.$route.params.fileId)
        .then(payload => payload.json())
        .then(payload => {
          if (payload.ok) {
            console.log("fetch:", payload);
            this.file = payload.data;
          }
        })
        .catch(err => console.log(err));
    },
    fetchJnls() {
      fetch(this.metadata.jnl.api)
        .then(payload => payload.json())
        .then(payload => {
          if (payload.ok) {
            console.log("fetch:", payload);
            this.jnls = payload.data;
          }
        })
        .catch(err => console.log(err));
    }
  },
  mounted() {
    console.log("route", this.$route.params);
    this.fetchJnls();
    this.fetchFile();
  }
};
</script>