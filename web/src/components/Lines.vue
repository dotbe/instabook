<template>
  <div v-if="lines">
    <table>
      <thead>
        <th>Num</th>
        <th>Date</th>
        <th>Account</th>
        <th>Label</th>
        <th>Comment</th>
        <th>Debit</th>
        <th>Credit</th>
      </thead>
      <tbody>
        <tr v-for="line in lines" :key="line.id">
          <td>{{line.ref | ref}}</td>
          <td>{{line.regDate}}</td>
          <td>{{line.accCode}}</td>
          <td>{{line.accName}}</td>
          <td>{{line.comment}}</td>
          <td>{{line.d | num}}</td>
          <td>{{line.c | num}}</td>
        </tr>
      </tbody>
      <tfoot>
        <th>Total</th>
        <th colspan="4">{{tot.label}} {{tot.s | num}}</th>
        <th>{{tot.d | num}}</th>
        <th>{{tot.c | num}}</th>
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
  padding-left: 3px;
  padding-right: 3px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 0.8em;
}
</style>
<script>
// import { VueMaskFilter } from 'v-mask'
import MagicTools from "../lib/MagicTools";

export default {
  props: ["lines"],
  filters: {
    num(val) {
      return MagicTools.formatNumber(val);
      // return new Intl.NumberFormat("fr-BE", {
      //   minimumFractionDigits: 2
      // }).format(val);
    },
    ref(val) {
      return MagicTools.formatRef(val);
    }
  },
  computed: {
    tot() {
      let result = { label: null, d: 0, c: 0, s: 0 };
      this.lines.forEach(el => {
        result.d += el.d;
        result.c += el.c;
      });
      result.s = result.d - result.c;
      result.label = result.s == 0 ? "" : result.s > 0 ? "D" : "C";
      return result;
    }
  }
};
</script>