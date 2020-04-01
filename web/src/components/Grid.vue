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
                ></v-text-field>
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
  </div>
</template>

<script>
export default {
  props: ["config"],
  components: {},
  data() {
    return {
      config2: {},
      items: [],
      fetched: false,
      editedItem: {},
      dialog: false,
      editedIndex: -1
    };
  },
  computed: {
    dialogMaxWidth: function(){
      if("form" in this.config) return this.config.form.width
      return ""
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
      confirm("Confirm?") && this.items.splice(index, 1);
    },
    close() {
      this.dialog = false;
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
    add() {
      this.editedItem = {};
      this.editedIndex = -1;
      this.dialog = true;
    }
  },
  mounted() {
    this.config.fields.push({ value: "actions", sortable: false });
    if (this.config.action === undefined) {
      this.config.action = { editable: true, deletable: true };
    }
    fetch(this.config.api)
      .then(r => r.json())
      .then(payload => {
        //console.log("payload:", payload);
        this.items = payload.data;
        this.fetched = true;
      })
      .catch();
  }
};
</script>