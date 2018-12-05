import ErrorPage from '../page/Error'
import Home from '../page/Home'
import Game from '../page/Game'
import Computer from '../page/Computer'
import Log from '../page/Log'
import LogDetail from '../page/LogDetail'

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
    path: '/computer',
    name: 'computer',
    component: Computer
  },
  {
    path: '/log',
    name: 'log',
    component: Log
  },
  {
    path: '/log/:id',
    name: 'logDetail',
    component: LogDetail
  },
  {
    path: '*',
    name: 'error',
    component: ErrorPage
  }
]