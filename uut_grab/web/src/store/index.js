import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let user = localStorage.getItem('user');
let store = localStorage.getItem('store');
export default new Vuex.Store({
    state: {
        user: user ? JSON.parse(user) : {},
        store: store ? JSON.parse(store) : [],
        frozenAmount: 0,
        direction: 'in',
    },
    mutations: {
        userChange (state, newData) {
            state.user = newData
        },
        storeChange (state, newData) {
            state.store = newData
        },
        frozenChange (state, newData) {
            state.frozenAmount = newData
        },
        directionChange(state, newData) {
            state.direction = newData
        }
    }
})
