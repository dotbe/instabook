import Vue from 'vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'
import App from './App.vue'
import File from './components/File'
import GC from './components/GenericCRUD'
import Jnl from './components/Jnl'
import Balance from './components/Balance'
import Ledger from './components/Ledger'
import Entry from './components/Entry'

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
    { path: "/", component: GC },
    { path: "/files", component: GC },
    { path: "/accounts", component: GC },
    { path: "/journals", component: GC },
    {
        path: "/files/:fileId", component: File,
        children: [
            { path: "entry", component: Entry },
            { path: "journal", component: Jnl },
            { path: "balance", component: Balance },
            { path: "ledger", component: Ledger },
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
    vuetify,
    router,
    render: h => h(App)
})//.$mount('#app')
