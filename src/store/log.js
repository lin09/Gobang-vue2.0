import { LOGS, LOG } from '../constant'

// 设置列表
export const setLogs = (data) => {
  localStorage.setItem(LOGS, JSON.stringify(data))
}

// 获取列表
export const getLogs = () => {
  let logs = localStorage.getItem(LOGS)
  try {
    logs = JSON.parse(logs) || []
  } catch {
    logs = []
  }

  return logs
}

// 删除列表
export const delLogs = () => {
  localStorage.removeItem(LOGS)
}

// 设置详情
export const setLog = (data) => {
  localStorage.setItem(`${LOG}${data.date}`, JSON.stringify(data))
}

// 获取详情
export const getLog = (id) => {
  let log = localStorage.getItem(`${LOG}${id}`)
  try {
    log = JSON.parse(log) || {}
  } catch {
    log = {}
  }

  return log
}

// 删除详情
export const delLog = (id) => {
  localStorage.removeItem(`${LOG}${id}`)
}

export default {
  state: {
    // 记录列表
    logs: [],
    // 记录详细
    log: {},
    // 查看第几局
    roundNum: 1
  },
  mutations: {
    setLogs (state, logs) {
      state.logs = logs
    },
    setLog (state, log) {
      state.log = log
    },
    setLogRoundNum (state, roundNum) {
      state.roundNum = roundNum
    }
  },
  actions: {
    getLogs ({ commit }) {
      let logs = getLogs()
      commit('setLogs', logs)
    },
    getLog ({ commit }, date) {
      let log = getLog(date)
      commit('setLog', log)
    },
    delLog ({ commit, state }, index) {
      let delItem = state.logs[index]
      delLog(delItem.date)

      state.logs.splice(index, 1)
      setLogs(state.logs)
      commit('setLogs', state.logs)
    },
    delAllLog ({ commit, state }) {
      for (let i = 0; i < state.logs.length; i ++) {
        let delItem = state.logs[i]
        delLog(delItem.date)
      }

      setLogs([])
      commit('setLogs', [])
    }
  }
}
