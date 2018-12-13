// 对手
export const opponent = {
  site: {
    value: 0,
    text: '现场对战'
  },
  simpleComputer: {
    value: 1,
    text: '简单电脑'
  },
  difficultComputer: {
    value: 2,
    text: '困难电脑'
  },
  crazyComputer: {
    value: 3,
    text: '疯狂电脑'
  },
  network: {
    value: 4,
    text: '网络对战'
  }
}

// 棋子
export const pieceColor = {
  none: {
    value: 0,
    text: '空'
  },
  black: {
    value: 1,
    text: '黑'
  },
  white: {
    value: 2,
    text: '白'
  }
}

// 棋盘横行线标记
export const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M', 'O']

export default {
  opponent,
  pieceColor,
  letter
}
