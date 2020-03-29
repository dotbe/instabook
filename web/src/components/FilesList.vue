<template>
  <div>
    <h1>Files</h1>
    <v-data-table v-bind:items="rows" v-bind:headers="metadata.file"></v-data-table>
    <ul>
      <li v-for="row in rows" v-bind:key="row.id">{{row.id}}**{{row.name}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      rows: [],
    };
  },
  mounted() {
    console.log("mounted");
    fetch("http://localhost:5000/api/files")
      .then(r => r.json())
      .then(payload => {
        console.log("payload:", payload);
        this.rows = payload.data;
      });
  }
};
</script>