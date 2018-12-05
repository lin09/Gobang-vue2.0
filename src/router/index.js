import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

// 个人仓信息
const isGithub = window.location.hostname === 'lin09.github.io'

Vue.use(VueRouter)
export default new VueRouter({
  mode: isGithub ? 'hash' : 'history',
  base: isGithub ? window.location.pathname : '/',
  routes
})
