<template>
  <div>
    <v-card class="ma-5" max-width="344" outlined>
      <div class="headline ma-5">New Document</div>
      <v-card-actions>
        
        <v-list dense>
        <v-subheader>REPORTS</v-subheader>
        <v-list-item-group v-model="jnl" color="primary">
          <v-list-item v-for="(jnl, i) in jnls" :key="i">
            <v-list-item-content>
              <v-list-item-title v-text="jnl.name"></v-list-item-title>
               <v-list-item-subtitle v-text="jnl.type"></v-list-item-subtitle>

            </v-list-item-content>
               <v-list-item-action>
            <v-btn icon v-if="jnl.active">
              <v-icon color="grey">mdi-file-plus</v-icon>
            </v-btn>
          </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      </v-card-actions>
    </v-card>
    <v-form ref="form" v-model="formValid" :lazy-validation="true">
      <v-card class="ma-5" max-width="344" outlined>
        <div class="headline ma-5">Prints</div>
        <div class="ma-5">
          <v-text-field v-model="from.value" label="From" prepend-icon="mdi-calendar" @blur="dateChecker(from)" :error-messages="from.errors"></v-text-field>
          <v-text-field v-model="till.value" label="Till" prepend-icon="mdi-calendar" @blur="dateChecker(till)" :error-messages="till.errors"></v-text-field>
          <v-card-actions>
            <v-btn text>View</v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-form>
  </div>
</template>

<script>
import Tools from '../lib/Tools'
import metadata from '../metadata'
export default {
  data() {
    return {
    Tools,
    metadata,
    from:{value:null, errors:[]},
    till:{value:null, errors:[]},
    formValid: false,
    jnls:{},
    jnl:0
    }
  },
  methods: {
      dateChecker(data, required = true) {
         let dv = Tools.dateValidator(data.value, required)
         console.log("dv", dv)
         data.value = dv.date
         data.errors = dv.errors
    },
    fetchJnls(){
 let api = this.metadata.jnl.api
      fetch(api)
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
  mounted(){
this.fetchJnls()
     
  }
};
</script>