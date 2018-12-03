import moment from 'moment'

export default {
  dateFormat: (value, format = 'YYYY-MM-DD h:mm:ss') => {
    return moment.unix(value).format(format)
  }
}
