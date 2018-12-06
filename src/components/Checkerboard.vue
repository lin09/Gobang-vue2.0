<template>
  <div class="checkerboard">
    <CheckerboardBase :baseData="baseData" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { pieceColor, piecesInitData } from '../constant'
import CheckerboardBase from './CheckerboardBase.vue'

export default {
  name: 'checkerboard',
  components: {
    CheckerboardBase
  },
  data () {
    return {
      // 棋子数据
      baseData: {},
      // 统计棋子数据
      countData: {}
    }
  },
  computed: mapState({
    fall: state => state.fall,
    user: state => state.user,
    opponent: state => state.opponent,
    downPiece: state => state.downPiece,
    roundNum: state => state.roundNum,
    countDown: state => state.countDown
  }),
  watch: {
    roundNum () {
      this.initData()
    },
    downPiece (val) {
      this.handlePiece(val)
    }
  },
  created () {
    window.cb = this

    // 无计时，直接开始
    !this.countDown && this.start()
  },
  methods: {
    ...mapActions(['victory', 'start']),
    ...mapMutations(['setFall']),
    // 下棋子处理
    handlePiece (data) {
      let item = this.baseData[data.key]
      item.value = this.fall.color.value

      // 下棋子后是不是结束
      if (this.handleIsOver(item) === true) {
        this.victory()
        return
      }

      // 未结束，设置轮换
      if (this.fall.color.value === pieceColor.black.value) {
        item.text = pieceColor.black.text
        this.handleFall(pieceColor.white.value)
      } else {
        item.text = pieceColor.white.text
        this.handleFall(pieceColor.black.value)
      }
    },
    // 设置轮换
    handleFall (value) {
      if (this.user.color.value === value) {
        this.setFall(this.user)
      } else {
        this.setFall(this.opponent)
      }
    },
    // 检查是否是五子相连
    handleIsOver (data) {
      let isOver = false
      let item = this.countData[data.key]

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
        let item = this.baseData[itemKeys[i]]
        if (item.value === this.fall.color.value) {
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
      this.handleFall(pieceColor.black.value)

      let { baseData, countData } = new piecesInitData()
      this.baseData = baseData
      this.countData = countData
    }
  }
}
</script>
