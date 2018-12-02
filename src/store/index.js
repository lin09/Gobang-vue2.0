import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'

import { piece, LOGS, LOG } from '../constant'
const getLogs = () => {
  let logs = localStorage.getItem(LOGS)
  try {
    logs = JSON.parse(logs) || []
  } catch {
    logs = []
  }

  return logs
}
const getLog = (id) => {
  let log = localStorage.getItem(`${LOG}id`)
  try {
    log = JSON.parse(log) || {}
  } catch {
    log = {}
  }

  return log
}

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
    countDown: 0,
    // 局数
    roundNum: 1,
    // 结束1局
    isOver: false,
    // 开局时间
    date: 0,
    // 记录列表
    logs: [],
    // 记录详细
    log: {}
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
      state.fall = fall || {}
    },
    setCountDown (state, countDown) {
      state.countDown = countDown
    },
    setRoundNum (state, roundNum) {
      if (roundNum === 1) {
        state.date = moment().unix()
        state.roundNum = roundNum
      } else {
        state.roundNum += 1
      }
    },
    setIsOver (state, isOver) {
      state.isOver = isOver

      if (!isOver) {
        return state
      }

      let logs = getLogs()

      let log = {
        date: state.date,
        roundNum: state.roundNum,
        user: {
          ...state.user,
          color: piece.color.black
        },
        opponent: {
          ...state.opponent,
          color: piece.color.white
        }
      }

      if ((logs[logs.length -1] || {}).date !== state.date) {
        logs.push(log)
      } else {
        logs[logs.length -1] = log
      }

      localStorage.setItem(LOGS, JSON.stringify(logs))
    },
    setLogs (state, logs) {
      state.logs = logs
    },
    setLog (state, log) {
      state.log = log
    }
  },
  actions: {
    // 认输
    defeat ({ commit, state }) {
      commit('setUser', {
        ...state.user,
        color: state.user.color.value !== piece.color.black.value ? piece.color.black : piece.color.white,
        fraction: state.fall.color.value !== state.user.color.value ? state.user.fraction + 1 : state.user.fraction
      })
      commit('setOpponent', {
        ...state.opponent,
        color: state.opponent.color.value !== piece.color.black.value ? piece.color.black : piece.color.white,
        fraction: state.fall.color.value !== state.opponent.color.value ? state.opponent.fraction + 1 : state.opponent.fraction
      })
      commit('setRoundNum')
    },
    // 赢
    victory ({ commit, state }) {
      if (state.fall.color.value === state.user.color.value) {
        commit('setUser', {
          ...state.user,
          fraction: state.user.fraction + 1
        })
      } else {
        commit('setOpponent', {
          ...state.opponent,
          fraction: state.opponent.fraction + 1
        })
      }
    },
    // 下一局
    next ({ commit, state }) {
      commit('setUser', {
        ...state.user,
        color: state.user.color.value !== piece.color.black.value ? piece.color.black : piece.color.white
      })
      commit('setOpponent', {
        ...state.opponent,
        color: state.opponent.color.value !== piece.color.black.value ? piece.color.black : piece.color.white
      })
      commit('setRoundNum')
    },
    getLogs ({ commit }) {
      let logs = getLogs()
      commit('setLogs', logs)
    },
    getLog ({ commit }, date) {
      let log = getLog(date)
      commit('setLog', log)
    }
  }
})
