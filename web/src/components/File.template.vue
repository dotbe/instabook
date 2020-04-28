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
            <v-btn v-for="jnl in file.jnls" :key="jnl.id" :value="jnl">
              <v-icon>{{metadata.icons[jnl.type]}}</v-icon>
              {{jnl.name}}
            </v-btn>
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
              :items="accs.all"
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
                  :prepend-icon="metadata.icons.account"
                />
              </v-card>
              <v-card flat width="120">
                <v-text-field
                  v-show="filter.acc.select=='between'"
                  v-model="filter.acc.to"
                  label="To"
                  :prepend-icon="metadata.icons.account"
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
          <v-tab :to="`/files/${file.id}/doc`" :disabled="!filter.jnl"><v-icon>mdi-pencil</v-icon></v-tab>
          <v-tab :to="`/files/${file.id}/journal`">Journal</v-tab>
          <v-tab :to="`/files/${file.id}/balance`">Balance</v-tab>
          <v-tab :to="`/files/${file.id}/ledger`">Ledger</v-tab>
          <v-tab :to="`/files/${file.id}/parameters`">
            <v-icon>mdi-wrench</v-icon>
          </v-tab>
        </v-tabs>
        <router-view
          :metadata="metadata"
          :config="config"
          :file="file"
          :accs="accs"
          :filter="filter"
          @accAdded="fetchAccs()"
          @jnlUpdated="fetchFile()"
        ></router-view>
      </v-card>
    </v-card>
  </div>
</template>