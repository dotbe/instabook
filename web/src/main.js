import Vue from 'vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'
import underscore from 'vue-underscore';

import store from './store'

import App from './App.vue'
import File from './components/File'
import GC from './components/GenericCRUD'
import Jnl from './components/Jnl'
import Balance from './components/Balance'
import Ledger from './components/Ledger'
import Journal from './components/Journal'
import Doc from './components/Doc'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(underscore);

const routes = [
    { path: "/", component: GC },
    { path: "/files", component: GC },
    { path: "/accounts", component: GC },
    { path: "/vats", component: GC },
    { path: "/parameters", component: GC },
    {
        path: "/files/:fileId", component: File,
        children: [
            { path: "doc", component: Doc },
            { path: "doc/:docId", component: Doc },
            { path: "journal", component: Journal },
            { path: "balance", component: Balance },
            { path: "ledger", component: Ledger },
            { path: "parameters", component: Jnl },
        ]
    },
]
const router = new VueRouter({
    routes,
    mode: "history"
})
export const appBus = new Vue()

// metadata is a global variable
// Vue.mixin({
//     data: function () { return { metadata } }
// })
new Vue({
    el: '#app',
    store,
    router,
    vuetify,
    render: h => h(App)
})//.$mount('#app')
