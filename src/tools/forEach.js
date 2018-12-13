export default (val, callBack) => {
  let tag = toString.call(val)

  if (tag === '[object Array]') {
    for (let i = 0; i < val.length; i ++) {
      if (callBack(val[i], i) === false) {
        break
      }
    }
  } else {
    for (let key in val) {
      if (callBack(val[key], key) === false) {
        break
      }
    }
  }

}
