import constant from './const'

export const CONSTANT = constant
export const LOGS = constant.LOGS
export const LOG = constant.LOG
export const LETTER = constant.LETTER

// 对手
export const opponent = {
  site: {
    value: 0,
    text: '现场对战'
  },
  simpleComputer: {
    value: 1,
    text: '简单电脑'
  },
  difficultComputer: {
    value: 2,
    text: '困难电脑'
  },
  crazyComputer: {
    value: 3,
    text: '疯狂电脑'
  },
  network: {
    value: 4,
    text: '网络对战'
  }
}

// 棋子
export const piece = {
  color: {
    none: {
      value: 0,
      text: '空'
    },
    black: {
      value: 1,
      text: '黑棋'
    },
    white: {
      value: 2,
      text: '白棋'
    }
  }
}

// 全部棋子的初始化数据
export class piecesInitData {
  constructor () {
    this.baseData = {}
    this.countData = {}
    this.init()
  }

  init () {
    for (let x = 1; x < 16; x ++) {
      for (let y = 1; y < 16; y ++) {
        let key = `${ x }-${ y }`
        let item = {
          ...piece.color.none,
          x,
          y,
          key,
          active: false
        }

        this.baseData[key] = item

        for (let i = 0; i < 4; i ++) {
          let n = i + 1
          let t = y - n
          let r = x + n
          let b = y + n
          let l = x - n

          if (t > 0) {
            // 上一个棋子下标
            let k = `${ x }-${ t }`
            // 'b' : 当前棋子相对上一个棋子，为上一个棋子的下面
            this.setCountItem(k, 'b', i, item)
          }

          if (t > 0 && r < 16) {
            let k = `${ r }-${ t }`
            this.setCountItem(k, 'lb', i, item)
          }

          if (r < 16) {
            let k = `${ r }-${ y }`
            this.setCountItem(k, 'l', i, item)
          }

          if (r < 16 && b < 16) {
            let k = `${ r }-${ b }`
            this.setCountItem(k, 'lt', i, item)
          }

          if (b < 16) {
            let k = `${ x }-${ b }`
            this.setCountItem(k, 't', i, item)
          }

          if (b < 16 && l > 0) {
            let k = `${ l }-${ b }`
            this.setCountItem(k, 'rt', i, item)
          }

          if (l > 0) {
            let k = `${ l }-${ y }`
            this.setCountItem(k, 'r', i, item)
          }

          if (l > 0 && t > 0) {
            let k = `${ l }-${ t }`
            this.setCountItem(k, 'rb', i, item)
          }
        }
      }
    }
  }

  // 设置棋子方向的数据
  setCountItem (k, d, i, v) {
    let data = this.countData[k] || {}
    let dk = d + 'k'
    let dkv = data[dk] || []
    dkv[i] = v.key
    this.countData[k] = {
      ...data,
      [d]: {
        ...data[d],
        [v.key]: v
      },
      [dk]: dkv
    }
  }
}

export default {
  CONSTANT,
  opponent,
  piece,
  piecesInitData
}
