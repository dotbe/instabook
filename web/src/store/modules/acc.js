import MagicTools from '../../lib/MagicTools'
import metadata from '../../metadata'


const state = {
    accounts: [],
}
const getters = {
    accs(state) {
        return state.accs
    }
}
const mutations = {
    setAccs(state, accs) { 
        state.accs = accs
        state.accs.all.forEach(el => (el.label = el.code + " (" + el.name + ")"));
      let reS = new RegExp("^" + this.config.accS);
      let reC = new RegExp("^" + this.config.accC);
      this.accs.suppliers = this.accs.all.filter(el => el.code.match(reS));
      this.accs.customers = this.accs.all.filter(el => el.code.match(reC));
      
    },
}
const actions = {
    async fetchAccs({ commit }) {
        const resp = await MagicTools.get(metadata.acc.api)
        console.log('store.accs', resp)
        commit('setAccs', resp.data);
    }
}

export default { state, mutations, getters, actions }