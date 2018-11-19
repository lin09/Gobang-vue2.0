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
