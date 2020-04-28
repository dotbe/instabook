<template>
  <div>
    <v-data-table
      v-if="showGrid"
      :items="items"
      :headers="headers"
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
      <v-card v-if="dialog">
        <v-card-title>
          <span class="headline">{{editedIndex==-1?config.labels.add:config.labels.edit}}</span>
        </v-card-title>

        <v-card-text>
          <slot v-bind:item="editedItem">
            <v-form ref="form" v-model="valid" :lazy-validation="false">
              <v-row v-for="(fieldName, index) in fieldNames" :key="fieldName">
                <template v-if="config.fields[fieldName].form !== false">
                  <v-select
                    v-if="config.fields[fieldName].type == 'select'"
                    v-model="editedItem[fieldName]"
                    :items="config.fields[fieldName].options"
                    :label="config.fields[fieldName].text"
                    :disabled="editedIndex!=-1 && config.fields[fieldName].disabled"
                    :readonly="config.fields[fieldName].readonly"
                    :filled="config.fields[fieldName].readonly"
                    :rules="fieldRules(config.fields[fieldName])"
                    :autofocus="index==0"
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
                  <v-textarea
                    v-else-if="config.fields[fieldName].type == 'textarea'"
                    v-model="editedItem[fieldName]"
                    :label="config.fields[fieldName].text"
                    :disabled="editedIndex!=-1 && config.fields[fieldName].disabled"
                    :readonly="config.fields[fieldName].readonly"
                    :filled="config.fields[fieldName].readonly"
                    :rules="fieldRules(config.fields[fieldName])"
                    @keyup.enter="save"
                    :autofocus="index==0"
                  />
                  <v-select
                    autocomplete
                    v-else-if="config.fields[fieldName].type == 'autocomplete'"
                    v-model="editedItem[fieldName]"
                    :label="config.fields[fieldName].text"
                    :disabled="editedIndex!=-1 && config.fields[fieldName].disabled"
                    :readonly="config.fields[fieldName].readonly"
                    :filled="config.fields[fieldName].readonly"
                    :rules="fieldRules(config.fields[fieldName])"
                    :items="config.fields[fieldName].options"
                    :item-value="config.fields[fieldName].value"
                    :item-text="config.fields[fieldName].label"
                    @keyup.enter="save"
                    :autofocus="index==0"
                  />
                  <v-text-field
                    v-else-if="fieldName != 'actions'"
                    v-model="editedItem[fieldName]"
                    :label="config.fields[fieldName].text"
                    :disabled="editedIndex!=-1 && config.fields[fieldName].disabled"
                    :readonly="config.fields[fieldName].readonly"
                    :filled="config.fields[fieldName].readonly"
                    :rules="fieldRules(config.fields[fieldName])"
                    :autofocus="index==0"
                    @keyup.enter="save"
                  />
                </template>
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