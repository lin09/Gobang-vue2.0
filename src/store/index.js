import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: [],
    isStart: false,
    opponent: {},
    fall: {},
    countDown: 0
  },
  mutations: {
    setUsers (state, users) {
      state.users = users
    },
    setIsStart (state, isStart) {
      state.isStart = isStart
    },
    setOpponent (state, opponent) {
      state.opponent = opponent
    },
    setFall (state, fall) {
      state.fall = fall
    },
    setCountDown (state, countDown) {
      state.countDown = countDown
    }
  }
})