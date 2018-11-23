/**
 * 非全功能克隆，只针对 array 和 object 做了简单处理
 */

const cloneDeep = (value) => {
  let tag = toString.call(value)

  if (!(tag === '[object Object]' || tag === '[object Array]')) {
    return value
  }

  let rValue

  if (tag === '[object Object]') {
    rValue = { ...value }
  } else if (tag === '[object Array]') {
    rValue = [ ...value ]
  }

  for (let key in rValue) {
    rValue[key] = cloneDeep(rValue[key])
  }

  return rValue
}

export default cloneDeep
