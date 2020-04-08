import Vue from 'vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
    { path: "/", component: App },
    { path: "/files", component: App },
    { path: "/accounts", component: App },
    { path: "/journals", component: App },
    { path: "/files/:id", component: App },
]
const router = new VueRouter({
    routes,
    mode: "history"
})
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
