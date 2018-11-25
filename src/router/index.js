import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueRouter)
export default new VueRouter({
  mode: 'history',
  base: window.location.hostname === 'lin09.github.io' ? '/Gobang-vue2.0/dist/index.html' : '/',
  routes
})
