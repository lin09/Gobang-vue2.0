<template>
  <div class="checkerboard">
    <CheckerboardBase :baseData="piecesData.baseData" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { pieceColor, piecesData, opponent, priority } from '../constant'
import { forEach, pick } from '../tools'
import CheckerboardBase from './CheckerboardBase.vue'

export default {
  name: 'checkerboard',
  components: {
    CheckerboardBase
  },
  data () {
    return {
      // 棋子数据
      piecesData: {},
      // 优先排序
      priority: {}
    }
  },
  computed: mapState({
    fall: state => state.fall,
    user: state => state.user,
    opponent: state => state.opponent,
    downPiece: state => state.downPiece,
    roundNum: state => state.roundNum,
    countDown: state => state.countDown,
    mode: state => state.mode,
    automatic: state => state.automatic,
    logPieces: state => state.logPieces
  }),
  watch: {
    roundNum () {
      this.initData()
    },
    downPiece (val) {
      this.handlePiece(val)
    },
    automatic (val) {
      val && this.logPieces.length === 0 && this.setDownPiece(this.piecesData.baseData['8-8'])
    }
  },
  created () {
    window.cb = this

    // 无计时，直接开始
    !this.countDown && this.start()
  },
  methods: {
    ...mapActions(['victory', 'start']),
    ...mapMutations(['setFall', 'setDownPiece']),
    // 下棋子处理
    handlePiece (data) {
      let item = this.piecesData.baseData[data.key]
      item.value = this.fall

      // 下棋子后是不是结束
      if (this.handleIsOver(item) === true) {
        this.victory()
        return
      }

      // 未结束，设置轮换
      if (this.fall === pieceColor.black.value) {
        // 当前下黑子
        // 棋子设为黑色
        item.text = pieceColor.black.text
        // 切换到白色下
        this.setFall(pieceColor.white.value)
      } else {
        item.text = pieceColor.white.text
        this.setFall(pieceColor.black.value)
      }

      // 电脑
      if (this.mode.value === opponent.simpleComputer.value) {
        // 处理棋子优先级
        this.handlePriority(item)

        if (this.automatic) {
          setTimeout(this.computerDownPiece, 1000)
        } else if (this.fall === this.opponent.color.value)  {
          // 轮到电脑自动下
          this.computerDownPiece()
        }
      }
    },
    handlePriority (data) {
      // 获取该棋子所在排的棋子值
      forEach(this.priority.pieceKey[data.key], (kss, direction) => {
        forEach(kss, (keys, index) => {
          // 当前值
          let newValues = []
          // 当前棋子值为空子值
          let oldValues = []
          forEach(keys, (key) => {
            let val = this.piecesData.baseData[key].value
            newValues.push(val)
            if (key === data.key) {
              oldValues.push(pieceColor.none.value)
            } else {
              oldValues.push(val)
            }
          })
          // 更新排数据
          this.priority.updateItem(data.key, direction, index, newValues, oldValues)
        })
      })
    },
    computerDownPiece () {
      // 获取优先棋子
      let keys = this.priority.getBestKeys(this.fall)
      // 当多个时随机
      this.setDownPiece(this.piecesData.baseData[keys[Math.floor(Math.random() * keys.length)]])
    },
    // 检查是否是五子相连
    handleIsOver (data) {
      let isOver = false
      let item = this.piecesData.countData[data.key]

      let tItems = this.getConnections(item.tk)
      let bItems = this.getConnections(item.bk)

      let rtItems = this.getConnections(item.rtk)
      let lbItems = this.getConnections(item.lbk)

      let rItems = this.getConnections(item.rk)
      let lItems = this.getConnections(item.lk)

      let rbItems = this.getConnections(item.rbk)
      let ltItems = this.getConnections(item.ltk)

      let connections = [data]

      if (1 + tItems.length + bItems.length > 4) {
        connections = connections.concat(tItems, bItems)
        isOver = true
      }
      if (1 + rtItems.length + lbItems.length > 4) {
        connections = connections.concat(rtItems, lbItems)
        isOver = true
      }
      if (1 + rItems.length + lItems.length > 4) {
        connections = connections.concat(rItems, lItems)
        isOver = true
      }
      if (1 + rbItems.length + ltItems.length > 4) {
        connections = connections.concat(rbItems, ltItems)
        isOver = true
      }

      if (isOver) {
        for (let i in connections) {
          connections[i].active = true
        }
      }

      return isOver
    },
    // 获取相连棋子
    getConnections (itemKeys) {
      let connections = []
      for (let i in itemKeys) {
        let item = this.piecesData.baseData[itemKeys[i]]
        if (item.value === this.fall) {
          connections.push(item)
        } else {
          break
        }
      }
      return connections
    },
    // 初始化
    initData () {
      // 黑子先手
      this.setFall(pieceColor.black.value)

      this.piecesData = new piecesData()

      // 电脑
      if (this.mode.value === opponent.simpleComputer.value) {
        this.priority = new priority()
        this.priority.setPieceKeys(pick(this.piecesData, ['tbk', 'lrk', 'ltrbk', 'rtlbk']))
        if (this.fall === this.opponent.color.value || this.automatic) {
          this.setDownPiece(this.piecesData.baseData['8-8'])
        }
      }
    }
  }
}
</script>
