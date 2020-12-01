/**
 * 创建由选定对象属性组成的对象
 * fun({ a: 123, b: 345, c: 678 }, ['a', b]) => { a: 123, b: 345 }
 */
export default (object = {}, paths = []) => {
  const result = {}

  for (let i = 0; i < paths.length; i ++) {
    const key = paths[i]

    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = object[key]
    }
  }

  return result
}
