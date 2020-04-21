<template>
  <div v-if="lines">
    <table>
      <thead>
        <th>Num</th>
        <th>Date</th>
        <th>Account</th>
        <th>Account name</th>
        <th>Label</th>
        <th>Debit</th>
        <th>Credit</th>
      </thead>
      <tbody>
        <tr v-for="line in lines" :key="line.id">
          <td>{{line.docRef | ref}}</td>
          <td>{{line.docRegDate}}</td>
          <td>{{line.accCode}}</td>
          <td>{{line.accName}}</td>
          <td>{{line.lineName}}</td>
          <td>{{line.lineD | num}}</td>
          <td>{{line.lineC | num}}</td>
        </tr>
      </tbody>
      <tfoot>
        <th>Total</th>
        <th colspan="4">{{tot.label}}: {{tot.S | num}}</th>
        <th>{{tot.D | num}}</th>
        <th>{{tot.C | num}}</th>
      </tfoot>
    </table>
  </div>
</template>
<style scoped>
table {
  border-collapse: collapse;
}
thead :nth-child(1),
thead :nth-child(2),
thead :nth-child(6),
thead :nth-child(7) {
  width: 90px;
}
thead :nth-child(3) {
  width: 100px;
}
thead :nth-child(4),
thead :nth-child(5) {
  width: 150px;
}
tfoot :nth-child(2),
tfoot :nth-child(3),
tfoot :nth-child(4),
tr :nth-child(6),
tr :nth-child(7) {
  text-align: right;
}
tr :nth-child(1),
tr :nth-child(2) {
  text-align: center;
}
th,
td {
  border: 1px solid #aaaaaa;
  padding: 3px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.8em;
}
</style>
<script>
// import { VueMaskFilter } from 'v-mask'
export default {
  props: ["lines"],
  filters: {
    num(val) {
      return new Intl.NumberFormat("fr-BE", {
        minimumFractionDigits: 2
      }).format(val);
    },
    ref(val){
      return val.toString().replace(/^(.{4})(.+)$/, "$1/$2")
    },
  },
  computed: {
    tot() {
      let result = { label: null, D: 0, C: 0, S: 0 };
      this.lines.forEach(el => {
        result.D += el.lineD;
        result.C += el.lineC;
        result.S += el.lineAmount;
      });
      result.label = result.S > 0 ? "D" : "C";
      return result;
    }
  }
};
</script>