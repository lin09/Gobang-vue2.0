import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 玩家
    user: {},
    // 对手
    opponent: {},
    // 比赛模式，选择对手是电脑、网友
    mode: {},
    // 轮到谁下
    fall: { color: {} },
    // 倒计时
    countDown: 0
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setOpponent (state, opponent) {
      state.opponent = opponent
    },
    setMode (state, mode) {
      state.mode = mode
    },
    setFall (state, fall) {
      state.fall = fall
    },
    setCountDown (state, countDown) {
      state.countDown = countDown
    }
  }
})