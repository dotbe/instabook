import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false


// metadata is a global variable
// Vue.mixin({
//     data: function () { return { metadata } }
// })
new Vue({
    el: '#app',
    vuetify,
    render: h => h(App)
})//.$mount('#app')
