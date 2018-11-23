import ErrorPage from '../page/Error'
import Home from '../page/Home'
import Game from '../page/Game'
import Log from '../page/Log'

export default [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/game',
    name: 'game',
    component: Game
  },
  {
    path: '/log',
    name: 'log',
    component: Log
  },
  {
    path: '*',
    name: 'error',
    component: ErrorPage
  }
]