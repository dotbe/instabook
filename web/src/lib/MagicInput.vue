<template>
  <span>
    <v-select
      v-if="field.type == 'select'"
      v-model="value"
      :items="options"
      :label="field.text"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :filled="field.readonly"
      :rules="fieldRules(field)"
      :autofocus="field.autofocus"
    />
    <v-checkbox
      v-else-if="field.type == 'checkbox'"
      v-model="value"
      :label="field.text"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :filled="field.readonly"
      :rules="fieldRules(field)"
    />
    <input v-else-if="field.type == 'hidden'" type="hidden" :value="value" />
    <v-textarea
      v-else-if="field.type == 'textarea'"
      v-model="value"
      :label="field.text"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :filled="field.readonly"
      :rules="fieldRules(field)"
      @keyup.enter="save"
      :autofocus="field.autofocus"
    />
    <v-text-field
      v-else
      v-model="value"
      :label="field.text"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :filled="field.readonly"
      :rules="fieldRules(field)"
      :autofocus="field.autofocus"
      @keyup.enter="save"
    />
  </span>
</template>

<script>
export default {
  props: []
};
</script>