import Vue from 'vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router'
import App from './App.vue'
import File from './components/File.vue'
import GC from './components/GenericCRUD.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

const routes = [
    { path: "/", component: GC },
    { path: "/files", component: GC },
    { path: "/accounts", component: GC },
    { path: "/journals", component: GC },
    { path: "/files/:id", component: File },
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
