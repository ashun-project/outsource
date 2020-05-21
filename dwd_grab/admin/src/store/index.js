import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        withdraw: [],
        recharge: []
    },
    mutations: {
        withdrawChange (state, newData) {
            state.withdraw = newData
        },
        rechargeChange (state, newData) {
            state.recharge = newData
        }
    }
})
