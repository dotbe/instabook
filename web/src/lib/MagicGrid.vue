<template>
  <div>
    <v-data-table
      v-bind:items="items"
      v-bind:headers="headers"
      :calculate-widths="true"
      :dense="false"
      :loading="!fetched"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>{{config.labels.list}}</v-toolbar-title>
          <v-icon @click="fetch(true)" class="mx-2" color="secondary">mdi-refresh-circle</v-icon>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mb-2" @click="add">{{config.labels.add}}</v-btn>
        </v-toolbar>
      </template>

      <template slot="item" slot-scope="myprops">
        <tr>
          <td v-for="header in headers" :key="header.value">
            <span v-if="header.value=='actions'">
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
            <span v-if="header.type == 'checkbox'">
              <v-icon v-if="myprops.item[header.value]" class="mx-2">mdi-checkbox-marked-outline</v-icon>
              <v-icon v-else class="mx-2">mdi-checkbox-blank-outline</v-icon>
            </span>
            <span v-else>{{ MagicTools.format(myprops.item[header.value], header.type) }}</span>
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
            <v-form ref="form" v-model="valid" :lazy-validation="false">
              <v-row v-for="fieldName in fieldNames" :key="fieldName">
                <v-select
                  v-if="config.fields[fieldName].type == 'select'"
                  v-model="editedItem[fieldName]"
                  :items="config.fields[fieldName].options"
                  :label="config.fields[fieldName].text"
                  :disabled="editedIndex!=-1 && config.fields[fieldName].disabled"
                  :readonly="config.fields[fieldName].readonly"
                  :filled="config.fields[fieldName].readonly"
                  :rules="fieldRules(config.fields[fieldName])"
                />
                <v-checkbox
                  v-else-if="config.fields[fieldName].type == 'checkbox'"
                  v-model="editedItem[fieldName]"
                  :label="config.fields[fieldName].text"
                  :disabled="editedIndex!=-1 && config.fields[fieldName].disabled"
                  :readonly="config.fields[fieldName].readonly"
                  :filled="config.fields[fieldName].readonly"
                  :rules="fieldRules(config.fields[fieldName])"
                />
                <input
                  v-else-if="config.fields[fieldName].type == 'hidden'"
                  type="hidden"
                  :value="editedItem[fieldName]"
                />
                <v-text-field
                  v-else-if="fieldName != 'actions'"
                  v-model="editedItem[fieldName]"
                  :label="config.fields[fieldName].text"
                  :disabled="editedIndex!=-1 && config.fields[fieldName].disabled"
                  :readonly="config.fields[fieldName].readonly"
                  :filled="config.fields[fieldName].readonly"
                  :rules="fieldRules(config.fields[fieldName])"
                  @keyup.enter="save"
                />
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
  </div>
</template>

<script>
// import {appBus} from '../main'
import MagicTools from "./MagicTools";

export default {
  props: ["config", "params"],
  data() {
    return {
      MagicTools,
      items: [],
      editedIndex: -1,
      editedItem: {},
      fetched: false,
      dialog: false,
      valid: false
    };
  },
  computed: {
    dialogMaxWidth() {
      return this.config.form && this.config.form.width
        ? this.config.form.width
        : "40em";
    },
    headers() {
      let fl = [];
      for (const fn in this.config.fields) {
        let f = Object.assign({}, this.config.fields[fn]);
        f.value = fn;
        if (f.type != "hidden") fl.push(f);
      }
      fl.push({ value: "actions", sortable: false });
      console.log("headers", fl);
      return fl;
    },
    fieldNames() {
      return Object.keys(this.config.fields);
    }
  },
  methods: {
    fetch(force = false) {
      if (force === true || this.config.refetch) this.items = [];
      if (this.items.length == 0) {
        this.fetched = false;
        fetch(MagicTools.url(this.config.api, this.params))
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
      if (
        confirm(`Confirm delete "${item[Object.keys(this.config.fields)[0]]}"?`)
      ) {
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
      for (let fn in this.config.fields) {
        let field = this.config.fields[fn];
        this.editedItem[fn] = field.default ? field.default : null;
      }
      this.editedIndex = -1;
      this.dialog = true;
    },
    catch(err) {
      this.$emit("feedback", {
        ok: false,
        status: err.status,
        message: err.message
      });
    },
    isOk(payload) {
      if (payload.ok) return true;
      this.$emit("feedback", payload);
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
    }
  },
  mounted() {
    this.fetch();
  },
  watch: {
    config(newVal, oldVal) {
      console.log("Config: ", oldVal.api, " -> ", newVal.api);
      this.fetch(true);
    }
  }
};
</script>