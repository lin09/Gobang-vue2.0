import { date } from '../tools'
import datas from '../constant/data'

let funs = {}

for (const key in datas) {
  funs[key] = (value) => {
    const data = datas[key]
    let tag = toString.call(data)

    if (tag === '[object Array]') {
      return toString.call(value) !== '[object Number]'
        ? value
        : value > data.length
          ? value
          : data[value]
    }
    else if (tag === '[object Object]') {
      for (const k in data) {
        let item = data[k]
        if (value === item.value) {
          return item.text
        }
      }
      return value
    }
  }
}

export default {
  ...funs,
  dateFormat: (value, format) => {
    return value ? date.unix(value).format(format) : value
  },
  time: (value) => {
    let m = Math.floor(value / 60)
    if (m < 10) {
      m = `0${m}`
    }

    let s = value % 60
    if (s < 10) {
      s = `0${s}`
    }
    return `${m} : ${s}`
  }
}
