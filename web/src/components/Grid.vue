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
          <v-icon @click="fetch(true)" class="mx-2" color="green">mdi-refresh-circle</v-icon>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mb-2" @click="add">{{config.labels.add}}</v-btn>
        </v-toolbar>
      </template>

      <template slot="item" slot-scope="myprops">
        <tr>
          <td v-for="field in config.fields" :key="field.value">
            <span v-if="field.value=='actions'">
              <slot name="custom-actions" v-bind:item="myprops.item"></slot>
              <span v-if="config.actions">
                <span v-if="config.actions.custom">
                  <v-icon
                    v-for="action in config.actions.custom"
                    v-bind:key="action.icon"
                    @click="action.fct(myprops.item, $router)"
                    class="mx-2"
                    v-bind:color="action.color"
                  >{{action.icon}}</v-icon>
                </span>
                <v-icon
                  v-if="config.actions.edit"
                  @click="edit(myprops.item)"
                  class="mx-2"
                  color="blue"
                >mdi-pencil</v-icon>
                <v-icon
                  v-if="config.actions.del"
                  @click="del(myprops.item)"
                  class="mx-2"
                  color="red"
                >mdi-delete</v-icon>
              </span>
            </span>
            <span v-else>{{ format(myprops.item[field.value], field) }}</span>
          </td>
        </tr>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" :max-width="dialogMaxWidth">
      <v-card>
        <v-card-title>
          <span class="headline">{{editedIndex==-1?config.labels.add:config.labels.edit}}</span>
        </v-card-title>

        <v-card-text>
          <slot v-bind:item="editedItem">
            <v-form ref="form" v-model="valid" :lazy-validation="true">
              <v-row v-for="(field, index) in config.fields" :key="field.value">
                <v-text-field
                  :autofocus="!index"
                  v-if="field.text"
                  v-model="editedItem[field.value]"
                  :label="field.text"
                  :disabled="editedIndex!=-1 && field.disabled"
                  :readonly="field.readonly"
                  :filled="field.readonly"
                  :rules="fieldRules(field)"
                  @keyup.enter="save"
                ></v-text-field>
              </v-row>
            </v-form>
          </slot>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="close">Cancel</v-btn>
          <v-btn color="primary" text @click="save" :disabled="!valid">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="feedback" :color="feedbackColor">
      {{ feedbackMsg }}
      <v-icon @click="feedback = false">mdi-close-thick</v-icon>
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
      feedback: false,
      feedbackMsg: null,
      feedbackColor: "",
      valid: false
    };
  },
  computed: {
    dialogMaxWidth () {
      return this.config.form && this.config.form.width
        ? this.config.form.width
        : "40em";
    }
  },
  methods: {
    fetch(force = false) {
      if (force === true || this.config.refetch) this.items = [];
      if (this.items.length == 0) {
        this.fetched = false;
        fetch(this.config.api)
          .then(payload => payload.json())
          .then(payload => {
            if (this.isOk(payload)) {
              console.log("fetch:", payload);
              this.items = payload.data;
              this.fetched = true;
            }
          })
          .catch(err => this.catch(err));
      }
    },

    del(item) {
      const index = this.items.indexOf(item);
      console.log("delete", item);
      if (confirm(`Confirm delete "${item[this.config.fields[0].value]}"?`)) {
        fetch(this.config.api + "/" + item.id, { method: "DELETE" })
          .then(payload => payload.json())
          .then(payload => {
            if (this.isOk(payload)) {
              console.log("deleted: ", payload);
              this.items.splice(index, 1);
              this.fetch();
            }
          })
          .catch(err => this.catch(err));
      }
    },
    save() {
      if (!this.valid) {
        return false;
      }
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
            if (this.isOk(payload)) {
              this.items.splice(this.editedIndex, 1, payload.data);
              console.log("updated: ", payload.data);
              this.fetch();
            }
          })
          .catch(err => this.catch(err));
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
            if (this.isOk(payload)) {
              this.items.push(payload.data);
              console.log("added: ", payload.data);
              this.fetch();
            }
          })
          .catch(err => this.catch(err));
      }

      // this.items[this.editedIndex] = f
      this.close();
      return true;
    },
    close() {
      this.dialog = false;
    },
    edit(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    add() {
      this.editedItem = {};
      this.editedIndex = -1;
      this.dialog = true;
    },
    catch(err) {
      this.feedback = true;
      this.feedbackMsg = err.message;
      this.feedbackColor = "red";
    },
    isOk(payload) {
      if (payload.ok) return true;
      this.feedback = true;
      this.feedbackMsg = payload.message;
      this.feedbackColor = payload.status < 500 ? "yellow" : "orange";
      return false;
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
    },
    format(value, field) {
      if (value != null && field.type) {
        switch (field.type) {
          case "date":
            value = value.split("-");
            value = value[2] + "/" + value[1] + "/" + value[0];
            break;
          case "decimal":
            value = value.toLocaleString(undefined, {
              minimumFractionDigits: 2
            });
            break;
          case "integer":
            value = value.toLocaleString();
        }
      }
      return value;
    }
  },
  mounted() {
    this.config.fields.push({ value: "actions", sortable: false });
    this.fetch();
  }
};
</script>