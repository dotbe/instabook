<template>
  <div v-if="file">
    <v-card class="d-flex flex-row mb-2" flat tile>
      <v-card class="ma-2 pa-2" width="350">
        <div class="headline">
          {{file.name}}
          <hr />
        </div>
        <v-form ref="form" v-model="filter.valid" :lazy-validation="true">
          <!-- JOURNALS -->
          <div class="subtitle-1">Journal</div>
          <v-alert v-if="!file.jnls.length" type="warning">No Journal defined</v-alert>
          <v-btn-toggle v-model="filter.jnl" dense class="vertical">
            <v-btn v-for="jnl in file.jnls" :key="jnl.id" :value="jnl">{{jnl.type}} > {{jnl.name}}</v-btn>
          </v-btn-toggle>
          <!-- DATE -->
          <v-card flat>
            <div class="subtitle-1">Date</div>
            <v-btn-toggle v-model="filter.period" @change="changeDates" class="mb-3">
              <v-btn value="ty" width="10px">Y</v-btn>
              <v-btn value="ly">Y-</v-btn>
              <v-btn value="tq">Q</v-btn>
              <v-btn value="lq">Q-</v-btn>
              <v-btn value="tm">M</v-btn>
              <v-btn value="lm">M-</v-btn>
            </v-btn-toggle>
          </v-card>
          <v-card class="d-flex flex-row pl-10" flat>
            <v-card flat width="120">
              <v-text-field
                v-model="filter.from.value"
                label="From"
                prepend-icon="mdi-calendar"
                @blur="dateChecker(filter.from)"
                :error-messages="filter.from.errors"
                dense
              />
            </v-card>
            <v-card flat width="120">
              <v-text-field
                v-model="filter.till.value"
                label="Till"
                prepend-icon="mdi-calendar"
                @blur="dateChecker(filter.till)"
                :error-messages="filter.till.errors"
                dense
              />
            </v-card>
          </v-card>
          <!-- ACCOUNT -->
          <v-card flat>
            <div class="subtitle-1">Accounts</div>
            <v-btn-toggle v-model="filter.acc.select" @change="changeDates">
              <v-btn value="all">All</v-btn>
              <v-btn value="some">Some</v-btn>
              <v-btn value="between">Between</v-btn>
            </v-btn-toggle>

            <v-autocomplete
              class="pr-0 pl-0 mt-2"
              v-show="filter.acc.select=='some'"
              v-model="filter.acc.selected"
              :items="accs"
              item-text="label"
              item-value="id"
              dense
              chips
              small-chips
              deletable-chips
              label="Accounts"
              multiple
              solo
            />
            <v-card class="d-flex flex-row pl-10" flat>
              <v-card flat width="120">
                <v-text-field
                  v-show="filter.acc.select=='between'"
                  v-model="filter.acc.from"
                  label="From"
                  prepend-icon="mdi-pound-box"
                />
              </v-card>
              <v-card flat width="120">
                <v-text-field
                  v-show="filter.acc.select=='between'"
                  v-model="filter.acc.to"
                  label="To"
                  prepend-icon="mdi-pound-box"
                />
              </v-card>
            </v-card>
          </v-card>
          <v-btn class="secondary mt-2" :disabled="!filter.valid" @click="refresh">Apply Filter</v-btn>
        </v-form>
      </v-card>
      <!-- TABS -->
      <v-card class="ma-2 pa-2" width="100%">
        <v-tabs v-model="tab" class="mb-4">
          <v-tab :to="`/files/${file.id}/entry`" :disabled="!filter.jnl">Entry</v-tab>
          <v-tab :to="`/files/${file.id}/journal`">Journal</v-tab>
          <v-tab :to="`/files/${file.id}/balance`">Balance</v-tab>
          <v-tab :to="`/files/${file.id}/ledger`">Ledger</v-tab>
          <v-tab :to="`/files/${file.id}/parameters`"><v-icon>mdi-wrench</v-icon></v-tab>
        </v-tabs>
        <router-view :metadata="metadata" :file="file" :accs="accs" :filter="filter"></router-view>
      </v-card>
    </v-card>
  </div>
</template>

<style>
.vertical {
  flex-direction: column;
}
</style>
<script>
import { appBus } from "../main";
import MagicTools from "../lib/MagicTools";
import metadata from "../metadata";

export default {
  data() {
    return {
      MagicTools,
      metadata,
      file: null,
      accs: [],
      filter: {
        jnl: null,
        period: "ty",
        from: { value: null, errors: [] },
        till: { value: null, errors: [] },
        acc: {
          select: "all",
          selected: [],
          from: null,
          to: null
        },
        valid: false
      },
      tab: this.$route.path
    };
  },
  // watch: {
  //   tab(o, n) {
  //     console.log("tab:", o, "->", n);
  //   }
  // },
  methods: {
    refresh() {
      alert("ok");
    },
    changeDates() {
      switch (this.filter.period) {
        case "ty":
          this.filter.from.value = MagicTools.date.boy();
          this.filter.till.value = MagicTools.date.eoy();
          break;
        case "ly":
          this.filter.from.value = MagicTools.date.boy(-1);
          this.filter.till.value = MagicTools.date.eoy(-1);
          break;
        case "tq":
          this.filter.from.value = MagicTools.date.boq();
          this.filter.till.value = MagicTools.date.eoq();
          break;
        case "lq":
          this.filter.from.value = MagicTools.date.boq(-1);
          this.filter.till.value = MagicTools.date.eoq(-1);
          break;
        case "tm":
          this.filter.from.value = MagicTools.date.bom();
          this.filter.till.value = MagicTools.date.eom();
          break;
        case "lm":
          this.filter.from.value = MagicTools.date.bom(-1);
          this.filter.till.value = MagicTools.date.eom(-1);
          break;
      }
    },
    dateChecker(data, required = true) {
      let dv = MagicTools.dateValidator(data.value, required);
      console.log("dv", dv);
      data.value = dv.date;
      data.errors = dv.errors;
    },
    async fetchFile() {
      this.file = await MagicTools.get(
        this.metadata.file.api + "/" + this.$route.params.fileId
      );
      appBus.$emit("feedback", this.file);
      this.file = this.file.data;
    },
    async fetchAccs() {
      this.accs = await MagicTools.get(this.metadata.acc.api);
      appBus.$emit("feedback", this.accs);
      this.accs = this.accs.data;
      this.accs.forEach(el => (el.label = el.code + "-" + el.name));
    }
  },
  mounted() {
    console.log("route", this.$route.params);
    this.fetchFile();
    this.fetchAccs();
    this.changeDates();
    // console.log("boy", MagicTools.date.boy())
    // console.log("eoy", MagicTools.date.eoy())
    // console.log("bom", MagicTools.date.bom())
    // console.log("eom", MagicTools.date.eom())
    // console.log("boq", MagicTools.date.boq())
    // console.log("eoq", MagicTools.date.eoq())

    // console.log("boy-1", MagicTools.date.boy(-1))
    // console.log("eoy-1", MagicTools.date.eoy(-1))
    // console.log("bom-1", MagicTools.date.bom(-1))
    // console.log("eom-1", MagicTools.date.eom(-1))
    // console.log("boq-1", MagicTools.date.boq(-1))
    // console.log("eoq-1", MagicTools.date.eoq(-1))
  }
};
</script>