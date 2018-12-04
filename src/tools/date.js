/**
 * 时间工具
 * @param {Date} val
 */
const result = (val) => {
  return {
    _d: val,
    __proto__: {
      unix () {
        return Math.floor(this._d / 1000)
      },
      year () {
        return this._d.getFullYear()
      },
      month () {
        return this._d.getMonth() + 1
      },
      date () {
        return this._d.getDate()
      },
      hour () {
        return this._d.getHours()
      },
      minute () {
        return this._d.getMinutes()
      },
      seconds () {
        return this._d.getSeconds()
      },
      format (str = 'YYYY-MM-DD h:mm:ss') {
        const year = this.year()
        const month = this.month()
        const date = this.date()
        const hour = this.hour()
        const minute = this.minute()
        const seconds = this.seconds()
        str = str.replace(/YYYY/g, year)
        str = str.replace(/YY/g, year % 100)
        str = str.replace(/MM/g, month < 10 ? `0${month}` : month)
        str = str.replace(/M/g, month)
        str = str.replace(/DD/g, date < 10 ? `0${date}` : date)
        str = str.replace(/D/g, date)
        str = str.replace(/hh/g, hour < 10 ? `0${hour}` : hour)
        str = str.replace(/h/g, hour)
        str = str.replace(/mm/g, minute < 10 ? `0${minute}` : minute)
        str = str.replace(/m/g, minute)
        str = str.replace(/ss/g, seconds < 10 ? `0${seconds}` : seconds)
        str = str.replace(/s/g, seconds)
        return str
      }
    }
  }
}

// 创建时间
function date (val) {
  return result(val ? new Date(val) : new Date())
}

// 使用unix值创建时间
date.unix = (val) => {
  return result(new Date(val * 1000))
}

export default date
