import Vuex from 'vuex'
import Vue from 'vue'

import MagicTools from '../lib/MagicTools'
import metadata from '../metadata'

Vue.use(Vuex)

const state = {
    metadata: metadata,
    config: {},
    accs: {},
    vats: {},
}
const getters = {
    metadata(state) {
        return state.metadata
    },
    config(state) {
        return state.config
    },
    accs(state) {
        return state.accs
    },
    vats(state) {
        return state.vats
    },
}
const mutations = {
    setConfig(state, config) {
        state.config = config
        state.config.forEach(el => (state.config[el.id] = el.val));
        state.metadata.vat.fields.jnlType.options = state.metadata.ref.jnlTypes;
        state.metadata.jnl.fields.type.options = state.metadata.ref.jnlTypes;
    },
    setAccs(state, accs) {
        state.accs.all = accs
        state.accs.all.forEach(el => (el.label = el.code + " (" + el.name + ")"));
        let re = new RegExp("^" + state.config.accS);
        state.accs.suppliers = state.accs.all.filter(el => el.code.match(re));
        re = new RegExp("^" + state.config.accC);
        state.accs.customers = state.accs.all.filter(el => el.code.match(re));
        state.metadata.acc.fields.accId.options = state.accs.all;
        state.metadata.vat.fields.accId.options = state.accs.all;
    },
    setVats(state, vats) {
        state.vats.codes = []
        state.metadata.ref.jnlTypes.forEach(el => state.vats[el] = { codes: [] })
        vats.forEach(el => {
            if (state.vats[el.jnlType].codes.indexOf(el.code) == -1) {
                state.vats[el.jnlType].codes.push(el.code)
                state.vats[el.jnlType][el.code] = []
                if (state.vats.codes.indexOf(el.code) == -1)
                    state.vats.codes.push(el.code)
            }
            state.vats[el.jnlType][el.code].push(el)
        })
        state.metadata.acc.fields.vatCode.options = state.vats.codes;
    },
}
const actions = {
    async fetchAccs(context, force = true) {
        if (force || context.state.accs === {}) {
            const resp = await MagicTools.get(state.metadata.acc.api)
            console.log('actions.fetchAccs', resp)
            context.commit('setAccs', resp.data);
        }
    },
    async fetchConfig(context) {
        const resp = await MagicTools.get(state.metadata.conf.api)
        console.log('actions.fetchConfig', resp)
        context.commit('setConfig', resp.data);
    },
    async fetchVats(context) {
        const resp = await MagicTools.get(state.metadata.vat.api)
        console.log('actions.fetchVats', resp)
        context.commit('setVats', resp.data);
    },

}

export default new Vuex.Store({ state, mutations, getters, actions })