<template src="./MagicGrid.template.vue"></template>
  
<script>
// import {appBus} from '../main'
import MagicTools from "./MagicTools";

export default {
  props:   {
    config: {},
    params: {},
    showGrid: { type: Boolean, default: true }
  },
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
        if (f.type !== "hidden" && f.grid !== false) fl.push(f);
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
      this.$emit("feedback", payload);
      if (payload.ok) return true;
      return false;
    },
    fieldRules(field) {
      return MagicTools.fieldRules(field);
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