import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        user: {}
    },
    mutations: {
        userChange (state, newData) {
            state.user = newData
        }
    }
})
