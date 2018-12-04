import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
import { pieceColor } from '../constant'
import { pick } from '../tools'
import log from './log'
import { setLogs, getLogs, getLog, setLog } from './log'

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
    // 认输
    isDefeat: false,
    // 开始时间
    date: 0,
    // 当前局开始时间
    currentDate: 0,
    // 下棋子数据
    downPiece: {},
    // 下棋子坐标记录
    logPieces: []
  },
  mutations: {
    setUser (state, user) {
      state.user = user

      // 更新记录
      if (user.fraction) {
        let logs = getLogs()
        let correntlog = logs[logs.length -1] || {}
        // 已记录
        if (correntlog.date === state.date) {
          correntlog.user = pick(user, ['name', 'fraction'])
          setLogs(logs)

          // 更新详情
          let logDetail = getLog(state.date) || {}
          logDetail.user = user
          setLog(logDetail)
        }
      }
    },
    setOpponent (state, opponent) {
      state.opponent = opponent

      // 更新记录
      if (opponent.fraction) {
        let logs = getLogs()
        let correntlog = logs[logs.length -1] || {}
        // 已记录
        if (correntlog.date === state.date) {
          correntlog.opponent = pick(opponent, ['name', 'fraction'])
          setLogs(logs)

          // 更新详情
          let logDetail = getLog(state.date) || {}
          logDetail.opponent = opponent
          setLog(logDetail)
        }
      }
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
      let date = moment().unix()
      state.currentDate = date

      if (roundNum === 1) {
        state.date = date
        state.roundNum = roundNum
      } else {
        state.roundNum += 1
      }
    },
    setIsDefeat (state, isDefeat) {
      state.isDefeat = isDefeat
    },
    setIsOver (state, isOver) {
      state.isOver = isOver

      if (!isOver) {
        return state
      }

      // 结束一局，保存记录
      // 记录列表
      let logs = getLogs()

      let log = {
        date: state.date,
        roundNum: state.roundNum,
        user: pick(state.user, ['name', 'fraction']),
        opponent: pick(state.opponent, ['name', 'fraction'])
      }

      if ((logs[logs.length -1] || {}).date !== state.date) {
        logs.push(log)
      } else {
        logs[logs.length -1] = log
      }

      setLogs(logs)

      // 记录详情
      let logDetail = getLog(state.date)
      setLog({
        ...logDetail,
        date: state.date,
        user: state.user,
        opponent: state.opponent,
        list: [
          ...(logDetail.list || []),
          {
            roundNum: state.roundNum,
            user: state.user,
            opponent: state.opponent,
            startDate: state.currentDate,
            endDate: moment().unix(),
            pieces: state.logPieces,
            isDefeat: state.isDefeat
          }
        ]
      })

      state.logPieces = []
    },
    setDownPiece (state, downPiece) {
      state.downPiece = downPiece

      if (!downPiece.isLog) {
        state.logPieces.push({
          date: moment().unix(),
          x: downPiece.x,
          y: downPiece.y
        })
      }
    }
  },
  actions: {
    // 认输
    defeat ({ commit, state }) {
      commit('setIsDefeat', true)
      commit('setIsOver', true)
      if (state.fall.color.value !== state.user.color.value) {
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
    // 赢
    victory ({ commit, state }) {
      commit('setIsOver', true)
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
        color: state.user.color.value !== pieceColor.black.value ? pieceColor.black : pieceColor.white
      })
      commit('setOpponent', {
        ...state.opponent,
        color: state.opponent.color.value !== pieceColor.black.value ? pieceColor.black : pieceColor.white
      })
      commit('setRoundNum')
    },
    // 退出
    quit ({ commit }) {
      commit('setUser', {})
      commit('setOpponent', {})
    }
  },
  modules: {
    log
  }
})
