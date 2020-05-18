import Vuex from 'vuex'
import Vue from 'vue'

// import { appBus } from "../main";
import MagicTools from '../lib/MagicTools'
import metadata from '../metadata'

Vue.use(Vuex)



const state = {
    config: {},
    accs: {},
    vats: {},
    jnlTypes: ["BUY", "SELL", "BUY_CN", "SELL_CN", "FINANCE", "DIVERSE"],
}
const getters = {
    config(state) {
        return state.config
    },
    accs(state) {
        return state.accs
    },
    vats(state) {
        return state.vats
    },
    jnlTypes(state) {
        console.log("getters.jnlTypes", state.jnlTypes)
        return state.jnlTypes
    }
}
const mutations = {
    setConfig(state, config) {
        state.config = config
        state.config.forEach(el => (state.config[el.id] = el.val));
    },
    setAccs(state, accs) {
        state.accs.all = accs
        state.accs.all.forEach(el => (el.label = el.code + " (" + el.name + ")"));
        let re = new RegExp("^" + state.config.accS);
        state.accs.suppliers = state.accs.all.filter(el => el.code.match(re));
        re = new RegExp("^" + state.config.accC);
        state.accs.customers = state.accs.all.filter(el => el.code.match(re));
    },
    setVats(state, vats) {
        console.log("setVats", state.vats)
        state.vats.codes = []
        state.jnlTypes.forEach(el => state.vats[el] = { codes: [] })
        vats.forEach(el => {
            if (state.vats[el.jnlType].codes.indexOf(el.code) == -1) {
                state.vats[el.jnlType].codes.push(el.code)
                state.vats[el.jnlType][el.code] = []
                if (state.vats.codes.indexOf(el.code) == -1)
                    state.vats.codes.push(el.code)
            }
            state.vats[el.jnlType][el.code].push(el)
        })
    },
}
const actions = {
    test({ commit }) {
        console.log("test")
        commit
    },
    async fetchAccs(context, force = true) {
        console.log('actions.fetchAccs.state/before', context.state.accs)
        if (force || context.state.accs === {}) {

            const resp = await MagicTools.get(metadata.acc.api)
            console.log('actions.fetchAccs', resp)
            context.commit('setAccs', resp.data);
        }
    },
    async fetchConfig(context) {
        const resp = await MagicTools.get(metadata.conf.api)
        console.log('actions.fetchConfig', resp)
        context.commit('setConfig', resp.data);
    },
    async fetchVats(context) {
        const resp = await MagicTools.get(metadata.vat.api)
        console.log('actions.fetchVats', resp)
        context.commit('setVats', resp.data);
    },

}

export default new Vuex.Store({ state, mutations, getters, actions })