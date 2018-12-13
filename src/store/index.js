import Vue from 'vue'
import Vuex from 'vuex'
import { pieceColor } from '../constant'
import { pick, date, cloneDeep } from '../tools'
import log from './log'
import { setLogs, getLogs, getLog, setLog } from './log'

Vue.use(Vuex)

const defaultState = {
  // 玩家
  user: {},
  // 对手
  opponent: {},
  // 比赛模式，选择对手是电脑、网友
  mode: {},
  // 轮到什么颜色下
  fall: 0,
  // 倒计时
  countDown: 0,
  // 局数
  roundNum: 0,
  // 结束1局
  isOver: true,
  // 认输
  isDefeat: false,
  // 和局
  isDraw: false,
  // 开始时间
  startDate: 0,
  // 当前局开始时间
  currentDate: 0,
  // 下棋子数据
  downPiece: {},
  // 下棋子坐标记录
  logPieces: [],
  // 自动下
  automatic: false
}

export default new Vuex.Store({
  state: cloneDeep(defaultState),
  mutations: {
    setUser (state, user) {
      state.user = user

      // 更新记录
      if (user.fraction) {
        let logs = getLogs()
        let correntlog = logs[logs.length -1] || {}
        // 已记录
        if (correntlog.date === state.startDate) {
          correntlog.user = pick(user, ['name', 'fraction'])
          setLogs(logs)

          // 更新详情
          let logDetail = getLog(state.startDate) || {}
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
        if (correntlog.date === state.startDate) {
          correntlog.opponent = pick(opponent, ['name', 'fraction'])
          setLogs(logs)

          // 更新详情
          let logDetail = getLog(state.startDate) || {}
          logDetail.opponent = opponent
          setLog(logDetail)
        }
      }
    },
    setMode (state, mode) {
      state.mode = mode
    },
    setFall (state, fall) {
      state.fall = fall
    },
    setCountDown (state, countDown) {
      state.countDown = countDown
    },
    incrementRoundNum (state) {
      let startDate = date().unix()
      state.currentDate = startDate
      state.isDefeat = false
      state.isDraw = false
      state.logPieces = []
      state.fall = 0
      state.roundNum ++

      if (state.roundNum === 1) {
        state.startDate = startDate
      }
    },
    setIsDefeat (state, isDefeat) {
      state.isDefeat = isDefeat
    },
    setIsDraw (state, isDraw) {
      state.isDraw = isDraw
    },
    setIsOver (state, isOver) {
      state.isOver = isOver

      if (isOver === true) {
        // 结束一局，保存记录
        // 记录列表
        let logs = getLogs()

        let log = {
          date: state.startDate,
          roundNum: state.roundNum,
          user: pick(state.user, ['name', 'fraction']),
          opponent: pick(state.opponent, ['name', 'fraction'])
        }

        if ((logs[logs.length -1] || {}).date !== state.startDate) {
          logs.push(log)
        } else {
          logs[logs.length -1] = log
        }

        setLogs(logs)

        // 记录详情
        let logDetail = getLog(state.startDate)
        setLog({
          ...logDetail,
          date: state.startDate,
          user: state.user,
          opponent: state.opponent,
          countDown: state.countDown,
          list: [
            ...(logDetail.list || []),
            {
              roundNum: state.roundNum,
              user: state.user,
              opponent: state.opponent,
              startDate: state.currentDate,
              endDate: date().unix(),
              pieces: state.logPieces,
              isDefeat: state.isDefeat
            }
          ]
        })
      }
    },
    setDownPiece (state, downPiece) {
      state.downPiece = downPiece

      if (!downPiece.isLog) {
        state.logPieces.push({
          date: date().unix(),
          x: downPiece.x,
          y: downPiece.y
        })
      }
    },
    getAutomatic (state) {
      state.automatic = !state.automatic
    },
    // 重置数据
    reset (state) {
      let dState = cloneDeep(defaultState)
      for (const key in dState) {
        state[key] = dState[key]
      }
    }
  },
  actions: {
    // 开始
    start ({ commit }) {
      commit('incrementRoundNum')
      commit('setIsOver', false)
    },
    // 认输
    defeat ({ commit, state }) {
      commit('setIsDefeat', true)
      commit('setIsOver', true)
      if (state.fall !== state.user.color.value) {
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
    // 胜
    victory ({ commit, state }) {
      commit('setIsOver', true)
      if (state.fall === state.user.color.value) {
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
    // 和局
    draw ({ commit }) {
      commit('setIsOver', true)
      commit('setIsDraw', true)
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
      commit('incrementRoundNum')
      commit('setIsOver', false)
    }
  },
  modules: {
    log
  }
})
