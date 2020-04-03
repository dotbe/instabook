<template>
  <div>
    <v-data-table
      v-bind:items="items"
      v-bind:headers="config.fields"
      :calculate-widths="true"
      :dense="false"
      loading="!fetched"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>{{config.labels.list}}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>

          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2" @click="add">{{config.labels.add}}</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <slot name="custom-actions" v-bind:item="item"></slot>
        <span v-if="config.actions">
          <span v-if="config.actions.custom">
            <v-icon
              v-for="action in config.actions.custom"
              v-bind:key="action.icon"
              @click="action.fct(item)"
              class="mx-2"
              v-bind:color="action.color"
            >{{action.icon}}</v-icon>
          </span>
          <v-icon
            v-if="config.actions.edit"
            @click="edit(item)"
            class="mx-2"
            color="blue"
          >mdi-pencil</v-icon>
          <v-icon v-if="config.actions.del" @click="del(item)" class="mx-2" color="red">mdi-delete</v-icon>
        </span>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" :max-width="dialogMaxWidth">
      <v-card>
        <v-card-title>
          <span class="headline">{{editedIndex==-1?config.labels.add:config.labels.edit}}</span>
        </v-card-title>

        <v-card-text>
          <slot v-bind:item="editedItem">
            <v-container>
              <v-row v-for="(field, index) in config.fields" :key="field.value">
                <v-text-field
                  :autofocus="!index"
                  v-if="field.text"
                  v-model="editedItem[field.value]"
                  :label="field.text"
                  :disabled="editedIndex!=-1 && field.disabled"
                  :rules="fieldRules(field)"
                ></v-text-field>
                <!---
                <div>{{field.value}}+{{editedIndex}}*{{field.required}}</div>
                --->
              </v-row>
            </v-container>
          </slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar">
      {{ snackbarText }}
      <v-icon @click="snackbar = false">mdi-close-thick</v-icon>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  props: ["config"],
  components: {},
  data() {
    return {
      items: [],
      editedIndex: -1,
      editedItem: {},
      fetched: false,
      dialog: false,
      snackbar: false,
      snackbarText: null
    };
  },
  computed: {
    dialogMaxWidth: function() {
      return this.config.form && this.config.form.width
        ? this.config.form.width
        : "40em";
    }
  },
  methods: {
    edit(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    del(item) {
      const index = this.items.indexOf(item);
      console.log("delete", item);
      if (confirm(`Confirm delete "${item[this.config.fields[0].value]}"?`)) {
        fetch(this.config.api + "/" + item.id, { method: "DELETE" })
          .then(payload => {
            console.log("deleted: ", payload);
            this.items.splice(index, 1);
            this.fetch();
          })
          .catch();
      }
    },
    close() {
      this.dialog = false;
    },
    save() {
      if (this.editedIndex > -1) {
        //update
        fetch(this.config.api + "/" + this.editedItem.id, {
          method: "PUT",
          body: JSON.stringify(this.editedItem),
          headers: {
            "content-type": "application/json"
          }
        })
          .then(payload => payload.json())
          .then(payload => {
            this.items.splice(this.editedIndex, 1, payload.data);
            console.log("updated: ", payload.data);
            this.fetch();
          })
          .catch();
      } else {
        // add
        fetch(this.config.api, {
          method: "POST",
          body: JSON.stringify(this.editedItem),
          headers: {
            "content-type": "application/json"
          }
        })
          .then(payload => payload.json())
          .then(payload => {
            if(payload.ok){
              this.items.push(payload.data);
              console.log("added: ", payload.data);
              this.fetch();
            }
            else{
              this.snackbar = true
              this.snackbarText = payload.message
            }
          })
          .catch(err => console.log("error on add: ", err));
      }

      // this.items[this.editedIndex] = f
      this.close();
    },
    add() {
      this.editedItem = {};
      this.editedIndex = -1;
      this.dialog = true;
    },
    fetch() {
      if (this.config.refetch) this.items = [];
      if (this.items.length == 0) {
        this.fetched = false;
        fetch(this.config.api)
          .then(payload => payload.json())
          .then(payload => {
            console.log("fetch:", payload);
            this.items = payload.data;
            this.fetched = true;
          })
          .catch();
      }
    },
    fieldRules(field) {
      let rules = [];
      if (field.required) rules.push(value => !!value || "Required!");
      if (field.max)
        rules.push(
          value =>
            (value && value.length <= field.max) ||
            `Max ${field.max} characters!`
        );
      if (field.min)
        rules.push(
          value =>
            (value && value.length >= field.min) ||
            `Min ${field.min} characters!`
        );
      if (field.email)
        rules.push(value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        });
      if (field.regexp)
        rules.push(value => field.regexp[0].test(value) || field.regexp[1]);
      if (field.rules) rules.push(...field.rules);
      return rules;
    }
  },
  mounted() {
    this.config.fields.push({ value: "actions", sortable: false });
    this.fetch();
  }
};
</script>