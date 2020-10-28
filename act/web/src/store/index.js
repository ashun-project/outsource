import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
var user = localStorage.getItem('user');
export default new Vuex.Store({
    state: {
        user: user ? JSON.parse(user) : {}
    },
    mutations: {
        userChange (state, newData) {
            state.user = newData
        }
    }
})
