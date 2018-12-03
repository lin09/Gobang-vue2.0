
module.exports = {
  // 基本路径
  baseUrl: process.env.NODE_ENV === "production" ? '/Gobang-vue2.0/dist/' : '/',
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // 服务器端口号
  devServer: {
    port: 8080,
  },
}