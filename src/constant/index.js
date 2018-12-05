import constant from './const'
import data from './data'

export const {
  LOGS,
  LOG,
  USER_NAME,
  OPPONENT_NAME
} = constant

export const {
  letter,
  pieceColor,
  opponent
} = data

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
          ...pieceColor.none,
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
  CONSTANT: {
    ...constant,
    ...data
  },
  piecesInitData
}
