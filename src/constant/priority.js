// ⚪⚫
// 〖四〗在一条阳线或阴线上连续相邻的5个点上只有四枚同色棋子的棋型。
// 〖活四〗有两个点可以成五的四。  +⚫⚫⚫⚫+
// 〖冲四〗只有一个点可以成五的四。 ⚪⚫⚫⚫⚫+    ⚪⚫⚫⚫+⚫   ｜⚫⚫⚫+⚫
// 〖死四〗不能成五的四。

// 〖三〗在一条阳线或阴线上连续相邻的5个点上只有三枚同色棋子的棋型。
// 〖活三〗再走一着可以形成活四的三。   _⚫⚫⚫+_   _⚫⚫+⚫_
//    〖连活三〗即：连的活三（同色棋子在一条阳线或阴线上相邻成一排的活三）。简称“连三”。  _⚫⚫⚫+_
//    〖跳活三〗中间隔有一个空点的活三。简称“跳三”。  _⚫⚫+⚫_
// 〖眠三〗再走一着可以形成冲四的三。⚪⚫⚫⚫++    ⚪⚫⚫+⚫+⚪    ⚫⚫++⚫    用于辅助
// 〖死三〗不能成五的三。

// 〖二〗在一条阳线或阴线上连续相邻的5个点上只有两枚同色棋子的棋型。
// 〖活二〗再走一着可以形成活三的二。    _⚫⚫++_
//    〖连活二〗即：连的活二（同色棋子在一条阳线或阴线上相邻成一排的活二）。简称“连二”。  _⚫⚫++_
//    〖跳活二〗中间隔有一个空点的活二。简称“跳二”。   _⚫+⚫__
//    〖大跳活二〗中间隔有两个空点的活二。简称“大跳二”。    _⚫++⚫_
// 〖眠二〗再走一着可以形成眠三的二。   ⚫+++⚫    ｜⚫++⚫_     用于辅助
// 〖死二〗不能成五的二。

import { forEach, cloneDeep } from '../tools'

// 优先级
class priority {
  constructor () {
    // 优先级，下标越小优先级越大； _(空)，+(下一步走棋)
    this.priorities = [
      // 活四、冲四
      '4+',
      // 活三   _3+_ , _+3_ , _1+2_ , _2+1_
      '_3+_',
      // 眠三，用于辅助    眠三 + 眠三（必胜）， 眠三 + 活二（眠三下子时要考虑另一个空格）
      // 3+_ , 3_+  , 2+1_ , 2_1+ , 1+1_1
      '3+_',
      // 活二    _2+__ , _1+1__ , _1+_1_
      '_2++_',
      // 眠二，用于辅助
      '2++_',

      // 1
      '_1+++_',
      '1+++_'
    ]
    this.init()
  }
  init () {
    this.pieceKey = {}
    let result = this.toObject({})
    this.black = result.black
    this.white = result.white
  }
  toObject (val) {
    let result = {}
    forEach(this.priorities, (kVal) => {
      result = {
        white: {
          ...result.white,
          [kVal]: cloneDeep(val)
        },
        black: {
          ...result.black,
          [kVal]: cloneDeep(val)
        }
      }
    })

    return result
  }
  updateItem (key, direction, index, newValues, oldValues) {
    let newTypeKey = this.getTypeKeys(newValues)
    let oldTypeKey = this.getTypeKeys(oldValues)
    let keys = this.pieceKey[key][direction][index]
    forEach(oldTypeKey, (typkeys, index) => {
      if (!typkeys || typkeys.length === 0) {
        return true
      }
      let type = !index ? 'black' : 'white'
      forEach(oldValues, (val, i) => {
        let typekey = typkeys[i]
        if (typekey && typekey !== newTypeKey[index][i]) {
          let k = keys[i]
          let item = this[k][type][typekey][direction]
          let indexOf = item.indexOf(keys)
          if (indexOf !== -1) {
            item.splice(indexOf, 1)
            item.length === 0 && this[type][typekey][k] && delete this[type][typekey][k][direction]
            JSON.stringify(this[type][typekey][k]) === '{}' && delete this[type][typekey][k]
          }
        }
      })
    })

    forEach(newTypeKey, (typkeys, index) => {
      let type = !index ? 'black' : 'white'
      forEach(typkeys, (typekey, i) => {
        if (!typekey) {
          return
        }

        let k = keys[i]
        let item = this[k] || this.toObject({})
        item[type][typekey][direction] = item[type][typekey][direction] || []
        item[type][typekey][direction].indexOf(keys) === -1 && item[type][typekey][direction].push(keys)
        this[k] = item
        this[type][typekey][k] = item[type][typekey]
      })
    })
    forEach(this[key], (kss, type) => {
      forEach(kss, (ks, typeKey) => {
        delete this[type][typeKey][key]
      })
    })
  }
  getTypeKeys (values) {
    // values = [0,1,...]
    // 返回棋子所属类型
    let result = [[], []]
    // 转成字符串
    let valStr = values.toString().replace(/,/g, '')

    // 1死： 无1 || 两最边是2或中间有2 || 长度5，有2
    if (!/1/.test(valStr) || /^(2.+2)$|^(.+2.+)$/.test(valStr) || (valStr.length === 5 && /2/.test(valStr))) {
      result[0] = false
    }
    // 2死： 无2 || 两最边是1或中间有1 || 长度5，有1
    if (!/2/.test(valStr) || /^(1.+1)$|^(.+1.+)$/.test(valStr) || (valStr.length === 5 && /1/.test(valStr))) {
      result[1] = false
    }
    if (!result[0] && !result[1]) {
      return result
    }


    // 长度5
    if (valStr.length === 5) {
      let res = result[0] || result[1]
      // 棋子数量
      let num = valStr.replace(/0/g, '').length
      let typeKey = this.priorities[(4 - num) * 2]
      forEach(values, (value, index) => {
        res[index] = !value ? typeKey : ''
      })
      return result
    }

    // 双存 /^100002$|^200001$/.test(valStr)
    if (result[0] && result[1]) {
      forEach(values, (value, index) => {
        result[0][index] = !value ? this.priorities[6] : ''
        result[1][index] = !value ? this.priorities[6] : ''
      })

      return result
    }

    // 单存
    if (result[0]) {
      // 存1删2
      valStr = valStr.replace('2', '')
    } else {
      // 存2删1
      valStr = valStr.replace('1', '')
    }

    // 棋子数量
    let num = valStr.replace(/0/g, '').length

    let res = result[0] || result[1]

    // 长度5
    if (valStr.length === 5) {
      let typeKey = this.priorities[(4 - num) * 2]
      forEach(values, (value, index) => {
        res[index] = !value ? typeKey : ''
      })
      return result
    }

    if (num === 5) {
      // 四
      let empty1 = valStr.search('0')
      res[empty1] = this.priorities[0]
    } else if (num === 4) {
      let empty1 = valStr.search('0')
      let empty2 = empty1 + 1 + valStr.slice(empty1 + 1, 6).search('0')
      if (empty1 === 0 && empty2 === 5) {
        // 四：两个在最边
        res[empty1] = this.priorities[0]
        res[empty2] = this.priorities[0]
      } else if (empty1 !== 0 && empty2 !== 5) {
        // 眠三：两个不在边
        res[empty1] = this.priorities[2]
        res[empty2] = this.priorities[2]
      } else {
        // 一个在边，在边眠三，另一四
        res[empty1] = empty1 === 0 ? this.priorities[2] : this.priorities[0]
        res[empty2] = empty2 === 5 ? this.priorities[2] : this.priorities[0]
      }
    } else if (num === 3) {
      let empty1 = valStr.search('0')
      let empty2 = empty1 + 1 + valStr.slice(empty1 + 1, 6).search('0')
      let empty3 = empty2 + 1 + valStr.slice(empty2 + 1, 6).search('0')
      if (empty1 === 0 && empty3 === 5) {
        // 两个在最边，中间：活三，两边：眠三
        res[empty1] = this.priorities[2]
        res[empty2] = this.priorities[1]
        res[empty3] = this.priorities[2]
      } else if (empty1 !== 0 && empty3 !== 5) {
        // 眠二：都不在边
        res[empty1] = this.priorities[4]
        res[empty2] = this.priorities[4]
        res[empty3] = this.priorities[4]
      } else {
        // 在边眠二，另两个眠三
        res[empty1] = empty1 === 0 ? this.priorities[4] : this.priorities[2]
        res[empty2] = this.priorities[2]
        res[empty3] = empty3 === 5 ? this.priorities[4] : this.priorities[2]
      }
    } else if (num === 2) {
      let empty1 = valStr.search('0')
      let empty2 = empty1 + 1 + valStr.slice(empty1 + 1, 6).search('0')
      let empty3 = empty2 + 1 + valStr.slice(empty2 + 1, 6).search('0')
      let empty4 = empty3 + 1 + valStr.slice(empty3 + 1, 6).search('0')
      if (empty1 === 0 && empty4 === 5) {
        // 两个在最边，中间：活二，两边：眠二
        res[empty1] = this.priorities[4]
        res[empty2] = this.priorities[3]
        res[empty3] = this.priorities[3]
        res[empty4] = this.priorities[4]
      } else if (empty1 !== 0 && empty4 !== 5) {
        // 眠一：都不在边
        res[empty1] = this.priorities[6]
        res[empty2] = this.priorities[6]
        res[empty3] = this.priorities[6]
        res[empty4] = this.priorities[6]
      } else {
        // 在边眠一，另三个眠二
        res[empty1] = empty1 === 0 ? this.priorities[6] : this.priorities[4]
        res[empty2] = this.priorities[4]
        res[empty3] = this.priorities[4]
        res[empty4] = empty4 === 5 ? this.priorities[6] : this.priorities[4]
      }
    } else {
      forEach(values, (value, index) => {
        if (value) {
          return true
        }

        if (index === 0 || index === 5) {
          res[index] = (value || values[index === 0 ? 5 : 0] !== 0) ? '' : this.priorities[6]
        } else if (values[0] === 0 && values[5] === 0) {
          res[index] = this.priorities[5]
        } else {
          res[index] = this.priorities[6]
        }
      })
    }

    return result
  }
  getBestKeys (value) {
    let result = []
    let type1 = value === 1 ? 'black' : 'white'
    let type2 = value === 2 ? 'black' : 'white'

    forEach(this.priorities, (typeKey) => {
      result = this.getKeys(type1, typeKey)
      if (result.length) {
        return false
      }

      result = this.getKeys(type2, typeKey)
      if (result.length) {
        return false
      }
    })

    if (result.length > 1) {
      let MaxVal = 0
      let newResult = []
      forEach(result, (key) => {
        let total = 0
        forEach(this[key], (ksss) => {
          forEach(ksss, (kss) => {
            forEach(kss, (keys) => {
              total += keys.length
            })
          })
        })
        if (total > MaxVal) {
          MaxVal = total
          newResult = [key]
        } else if (total === MaxVal) {
          newResult.push(key)
        }
      })

      result = newResult
    }
    return result
  }
  getKeys (type, typeKey) {
    let MaxVal = 0
    let result = []
    let keysNums = []
    forEach(this[type][typeKey], (item, key) => {
      let directionNum = 0
      let direction = ''
      let keysNum = 0
      forEach(item, (keys, k) => {
        direction = k
        directionNum ++
        keysNum += keys.length
      })

      if ([this.priorities[2], this.priorities[4]].indexOf(typeKey) > -1 && directionNum < 2) {
        let isAuxiliary = false
        forEach(this.priorities.slice(3, 7), (tpKey) => {
          let num = 0
          forEach(this[key][type][tpKey], (keys, k) => {
            if (direction != k) {
              num ++
            }
          })
          if (num) {
            isAuxiliary = true
            return false
          }
        })
        if (!isAuxiliary) {
          return false
        }
      }

      if (directionNum > MaxVal) {
        result = [key]
        keysNums = [keysNum]
        MaxVal = directionNum
      } else if (directionNum === MaxVal) {
        result.push(key)
        keysNums.push(keysNum)
      }
    })

    if (result.length > 1) {
      MaxVal = 0
      let newResult = []
      forEach(keysNums, (num, index) => {
        if (num > MaxVal) {
          MaxVal = num
          newResult = [result[index]]
        } else if (num === MaxVal) {
          newResult.push(result[index])
        }
      })

      result = newResult
    }

    return result
  }
  setPieceKeys (kObj) {
    // kObj = { tbk: [['1-1', ...], ...], lrk: [...], ltrbk: [...]}
    forEach(kObj, (kss, direction) => {
      forEach(kss, (keys) => {
        if (keys.length === 5) {
          forEach(keys, (key) => {
            this.setPieceKey(key, direction, keys)
          })
        } else if (keys.length > 5) {
          for (let i = 0; i < keys.length - 5; i++) {
            let ks = keys.slice(i, i + 6)
            forEach(ks, (key) => {
            this.setPieceKey(key, direction, ks)
            })
          }
        }
      })
    })
  }
  setPieceKey(key, direction, keys) {
    this.pieceKey[key] = this.pieceKey[key] || {}
    this.pieceKey[key][direction] = [].concat(this.pieceKey[key][direction] || []).concat([keys])
  }
}
export default priority
