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
    this.pieceBaseKey = {}
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
  updateItem (key, direction, dIndex, newValues, oldValues) {
    let newTypeKey = this.getTypeKeys(newValues)
    let oldTypeKey = this.getTypeKeys(oldValues)
    let keys = this.pieceBaseKey[key][direction][dIndex]
    forEach(oldTypeKey, (typkeys, index) => {
      if (!typkeys || typkeys.length === 0) {
        return true
      }
      let type = !index ? 'black' : 'white'
      forEach(oldValues, (val, i) => {
        let typekey = typkeys[i]
        if (typekey && typekey !== newTypeKey[index][i]) {
          let k = keys[i]
          if (k !== key) {
            let item = this.pieceKey[k][type][typekey][direction]
            let indexOf = item.indexOf(keys)
            if (indexOf !== -1) {
              item.splice(indexOf, 1)
              item.length === 0 && this[type][typekey][k] && delete this[type][typekey][k][direction]
              JSON.stringify(this[type][typekey][k]) === '{}' && delete this[type][typekey][k]
              JSON.stringify(this.pieceKey[k]) === JSON.stringify(this.toObject({})) && delete this.pieceKey[k]
            }
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
        let item = this.pieceKey[k] || this.toObject({})
        item[type][typekey][direction] = item[type][typekey][direction] || []
        item[type][typekey][direction].indexOf(keys) === -1 && item[type][typekey][direction].push(keys)
        this.pieceKey[k] = item
        this[type][typekey][k] = item[type][typekey]
      })
    })
    forEach(this.pieceKey[key], (kss, type) => {
      forEach(kss, (ks, typeKey) => {
        forEach(this[type][typeKey][key], (keys, drie) => {
          delete this.pieceKey[key][type][typeKey][drie]
        })
        delete this[type][typeKey][key]
      })
    })
    JSON.stringify(this.pieceKey[key]) === JSON.stringify(this.toObject({})) && delete this.pieceKey[key]
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
    return this.simpleComputer(value)
  }
  getBestKey (keys, type) {
    let maxVal = -99999
    let result = []
    forEach(keys, (key) => {
      let fraction = this.getFraction(key, type)
      if (fraction > maxVal) {
        result = [key]
        maxVal = fraction
      } else if (fraction === maxVal) {
        result.push(key)
      }
    })
    return result
  }
  getFraction (key, type) {
    let value = 0
    forEach(this.pieceKey[key], (typeObj, tp) => {
      forEach(typeObj, (item, typeKey) => {
        let typeInde = this.priorities.indexOf(typeKey)
        let f = (7 - typeInde) * (typeInde % 2 + 1)
        f = !type || tp === type ? f : -f
        forEach(item, (keys) => {
          value += f * keys.length
        })
      })
    })
    return value
  }
  simpleComputer (value) {
    let result = []
    let type1 = value === 1 ? 'black' : 'white'
    let type2 = value === 2 ? 'black' : 'white'

    // 四 一步必胜
    // 下方四
    result = this.getKeys(type1, this.priorities[0])
    if (result.length) {
      return result
    }
    // 另一方四
    result = this.getKeys(type2, this.priorities[0])
    if (result.length) {
      return result
    }

    // 活三、双眠三、两步必胜
    // 眠三：m3=[[下方key, ...], [另一方key, ...]]
    let m3 = [[], []]
    forEach([type1, type2], (type, index) => {
      // 活三
      result = this.getKeys(type, this.priorities[1])
      if (result.length) {
        if (index === 1) {
          result = this.getBestKey(result, type)
        }
        return false
      }
      // 眠三
      m3[index] = this.getKeys(type, this.priorities[2])
      // 双眠三
      result = this.get2M3Keys(m3[index], type)
      if (result.length) {
        return false
      }
      // 眠三+活二（还没做：眠三下后另一个空还检查是不是对方的眠三）
      result = this.getM3OKeys(m3[index], type, this.priorities[3])
      if (result.length) {
        if (index === 1) {
          result = this.getBestKey(result, type)
        }
        return false
      }
    })
    if (result.length) {
      return this.getBestKey(result)
    }

    // 活二 + 活二
    // 活二：h2=[[下方key, ...], [另一方key, ...]]
    let h2 = [[], []]
    forEach([type1, type2], (type, index) => {
      h2[index] = this.getKeys(type, this.priorities[3])
      result = this.get2HKeys(h2[index], type, this.priorities[3])
      if (result.length) {
        return false
      }
    })
    if (result.length) {
      return this.getBestKey(result)
    }

    // 防对方眠三+活一
    if (m3[1].length) {
      // 眠三+活一
      result = this.getM3OKeys(m3[1], type2, this.priorities[5])
      if (result.length) {
        return this.getBestKey(result, type2)
      }
    }

    // 活二 + 活一
    forEach([type2, type1], (type, index) => {
      result = this.getH2H1Keys(h2[index ? 0 : 1], type)
      if (result.length) {
        if (index === 0) {
          result = this.getBestKey(result, type)
        }
        return false
      }
    })
    if (result.length) {
      return this.getBestKey(result)
    }

    // 眠三+活一
    if (m3[0].length) {
      // 眠三+活一
      result = this.getM3OKeys(m3[0], type1, this.priorities[5])
      if (result.length) {
        return this.getBestKey(result)
      }
    }

    // 活一
    let h1 = [[], []]
    // 活一 + 活一
    let h11 = [[], []]
    // 眠二
    let m2 = [[], []]
    // 眠一
    let m1 = [[], []]
    forEach([type1, type2], (type, index) => {
      h1[index] = this.getKeys(type, this.priorities[5])
      h11[index] = this.get2HKeys(h1[index], type, this.priorities[5])
      m2[index] = this.getKeys(type, this.priorities[4])
      m1[index] = this.getKeys(type, this.priorities[6])
    })

    result = h11[0].length && this.getBestKey(h11[0], type1)
      || m3[1].length && m3[1]
      || h11[1].length && this.getBestKey(h11[1], type2)
      || h2[1].length && this.getBestKey(h2[1], type2)
      || h2[0].length && h2[0]
      || h1[0].length && this.getBestKey(h1[0], type2)
      || h1[1].length && this.getBestKey(h1[1])
      || m2[0].length && m2[0]
      || m1[0].length && m1[0]
      || m3[0].length && m3[0]
      || m2[1].length && m2[1]
      || m1[1].length && m1[1]
      || result

    return result
  }
  getKeys(type, typeKey) {
    let maxVal = 1
    let result = []
    forEach(this[type][typeKey], (item, key) => {
      let num = 0
      forEach(item, () => {
        num ++
      })
      if (num > maxVal) {
        maxVal = num
        result = [key]
      } else if (num === maxVal) {
        result.push(key)
      }
    })
    return result
  }
  // 双眠三
  get2M3Keys(m3, type) {
    let result = []
    forEach(m3, (key) => {
      let num = 0
      let start = false
      let end = false
      forEach(this.pieceKey[key][type][this.priorities[2]], (kss) => {
        // 同方向key所在排的位有个开头和一个结尾
        forEach(kss, (keys) => {
          if (keys.length === 6) {
            let index = keys.indexOf(key)
            start = start || index === 0
            end = end || index === 5
          }
        })
        if (start && end) {
          result = [key]
          return false
        }
        num ++
      })
      // 多方向有眠三
      if (num > 1) {
        result = [key]
        return false
      }
    })
    return result
  }
  // 眠三+其它
  getM3OKeys (m3, type, typeKey) {
    let result = []
    forEach(m3, (key) => {
      forEach(this.pieceKey[key][type][this.priorities[2]], (kss, m3d) => {
        let isTrue = false
        forEach(this.pieceKey[key][type][typeKey], (v, od) => {
          // 不在同方即可
          if (m3d !== od) {
            isTrue = true
            return false
          }
        })
        if (isTrue) {
          result.push(key)
        }
      })
    })
    return result
  }
  // 双活二、一
  get2HKeys (h, type, typeKey) {
    let result = []
    forEach(h, (key) => {
      let num = 0
      forEach(this.pieceKey[key][type][typeKey], () => {
        num ++
      })
      // 多方向有活二、一
      if (num > 1) {
        result.push(key)
      }
    })
    return result
  }
  // 活二 + 活一
  getH2H1Keys (h2, type) {
    let result = []
    forEach(h2, (key) => {
      let num = 0
      forEach(this.pieceKey[key][type][this.priorities[3]], (v, h2d) => {
        forEach(this.pieceKey[key][type][this.priorities[5]], (v2, h1d) => {
          // 不在同方即可
          if (h2d !== h1d) {
            num ++
          }
        })
      })
      // 不同方向有活一
      if (num > 0) {
        result.push(key)
      }
    })
    return result
  }
  setPieceBaseKeys (kObj) {
    // kObj = { tbk: [['1-1', ...], ...], lrk: [...], ltrbk: [...]}
    forEach(kObj, (kss, direction) => {
      forEach(kss, (keys) => {
        if (keys.length === 5) {
          forEach(keys, (key) => {
            this.setPieceBaseKey(key, direction, keys)
          })
        } else if (keys.length > 5) {
          for (let i = 0; i < keys.length - 5; i++) {
            let ks = keys.slice(i, i + 6)
            forEach(ks, (key) => {
            this.setPieceBaseKey(key, direction, ks)
            })
          }
        }
      })
    })
  }
  setPieceBaseKey(key, direction, keys) {
    this.pieceBaseKey[key] = this.pieceBaseKey[key] || {}
    this.pieceBaseKey[key][direction] = [].concat(this.pieceBaseKey[key][direction] || []).concat([keys])
  }
}
export default priority
