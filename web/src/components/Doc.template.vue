<template>
  <div v-if="filter.jnl">
    <!-- chrome bug with autocomplete -->
    <!-- <input style="display:none" />
    <input type="password" style="display:none" />-->
    <div class="headline">
      <v-icon class="mb-1">{{metadata.icons[filter.jnl.type]}}</v-icon>
      {{filter.jnl.name}}
      <v-icon class="mb-1">{{metadata.icons.date}}</v-icon>
      {{filter.from.value}}
      <v-icon class="mb-1">mdi-arrow-right</v-icon>
      {{filter.till.value}}
    </div>
    <hr class="mb-5" />
    <v-form ref="form" v-model="validForm" :lazy-validation="false">
      <table class="doc">
        <tr>
          <td class="ref">
            <v-text-field
              class="title"
              v-model="doc.ref"
              ref="ref"
              label="Reference"
              :prepend-icon="metadata.icons.ref"
              :rules="[v => !!v || 'Required']"
              @blur="refChecker()"
            />
          </td>
          <td class="date">
            <v-text-field
              v-model="doc.regDate"
              class="title"
              ref="regDate"
              label="Date"
              :prepend-icon="metadata.icons.date"
              :rules="[v => !!v || 'Required']"
              @blur="dateChecker()"
            />
          </td>
          <td class="acc">
            <!-- IF JNL = BUY/SELL(CN) -->
            <v-autocomplete
              v-if="master.is"
              v-model="doc.masterAccId"
              ref="masterAccId"
              :key="componentKey"
              :items="master.accs"
              item-value="id"
              item-text="label"
              :rules="[v => !!v || 'Required']"
              @blur="masterAccIdChecker()"
              @keyup="searchedInput=searchInput"
              :prepend-icon="metadata.icons.people"
              :label="master.accLabel"
              class="title"
              :search-input.sync="searchInput"
              :no-data-text="noAccountText"
            />
          </td>
          <td>
            <!-- <v-btn @click="addAccount()" icon color="primary" v-if="master.is" tabindex="-1">
              <v-icon>{{metadata.icons.people}}-plus</v-icon>
            </v-btn> -->
          </td>
        </tr>
        <tr>
          <td class="vatinc">
            <v-text-field
              v-if="master.is"
              ref="masterAmount"
              class="title num"
              v-model="doc.masterAmount"
              label="VAT incl."
              :prepend-icon="metadata.icons.amount"
              :rules="[v => (!!v && v != master.zero )|| 'Required']"
              @blur="masterAmountChecker()"
            />
          </td>
          <td colspan="3">
            <v-text-field
              ref="masterComment"
              class="title"
              style="text-align:right"
              v-model="doc.masterComment"
              label="Comment"
              :prepend-icon="metadata.icons.comment"
            />
          </td>
        </tr>
      </table>

      <table class="lines mt-5">
        <thead>
          <th class="body-1 lineI">#</th>
          <th class="body-1 lineAccount">
            Account
            <v-btn @click="addAccount()" icon color="primary" tabindex="-1">
              <v-icon>{{metadata.icons.account}}-plus</v-icon>
            </v-btn>
          </th>
          <th class="body-1 lineD">Debit</th>
          <th class="body-1 lineC">Credit</th>
          <th class="body-1 lineComment">Comment</th>
          <th class="lineActions"></th>
          <th class="lineActions"></th>
        </thead>
        <tbody>
          <tr v-for="(line, index) in doc.lines" :key="line.i">
            <td class="pb-2">
              <b>{{line.i}}.</b>
            </td>
            <td>
              <v-combobox
                v-model="line.accId"
                ref="accId"
                :items="accs.all"
                item-text="label"
                item-value="id"
                @blur="accIdChecker(index)"
                @keyup.enter="save()"
                dense
              />
            </td>
            <td class="num">
              <v-text-field
                v-model="line.d"
                ref="d"
                :rules="[v => !!v || 'Required']"
                @blur="dChecker(index)"
                @keyup.enter="save()"
                dense
              />
            </td>
            <td class="num">
              <v-text-field
                v-model="line.c"
                ref="c"
                :rules="[v => !!v || 'Required']"
                @blur="cChecker(index)"
                @keyup.enter="save()"
                dense
              />
            </td>
            <td>
              <v-text-field ref="comment" v-model="line.comment" dense />
            </td>
            <td>
              <v-icon
                @click="delLine(index)"
                v-show="doc.lines.length>1"
                color="red lighten-2"
                tabindex="-1"
              >{{metadata.icons.del}}</v-icon>
            </td>
            <td>
              <v-icon @click="addLine(index)" tabindex="-1">{{metadata.icons.addRow}}</v-icon>
            </td>
          </tr>
          <tr>
            <td></td>
            <td style="vertical-align:top">
              <v-btn
                class="primary"
                @click="save()"
                :disabled="!(balance === 0 && validForm)"
              >Balance {{balance | bal}}</v-btn>
            </td>
            <td colspan="3" class="caption" style="color:IndianRed">
              <!-- <ul>
                <li v-for="error in errors" :key="error">{{error}}</li>
              </ul>-->
            </td>
          </tr>
        </tbody>
      </table>
    </v-form>
    <div v-if="lastDoc.v_lines" class="body-1 mt-10 mb-2">
      Last Document for "{{filter.jnl.name}}"
      <v-btn :to="`/files/${file.id}/doc/${lastDoc.id}`" icon>
        <v-icon color="primary">mdi-pencil</v-icon>
      </v-btn>
    </div>
    <Lines :lines="lastDoc.v_lines" />

    <MagicGrid :config="metadata.acc" @feedback="feedback" :showGrid="false" ref="magic" />

    <hr class="mt-10" />
    <hr />
    <h2>doc</h2>
    {{doc}}
    <hr />
    <h2>master</h2>
    {{master}}
    <hr />
    <h2>filter</h2>
    {{filter}}
    <hr />
    <h2>confif</h2>
    {{config}}
    <hr />
    <h2>lastdoc</h2>
    {{lastDoc}}
    <hr />
    <h2>accs</h2>
    {{accs}}
  </div>
  <div v-else class="title">Select a journal</div>
</template>