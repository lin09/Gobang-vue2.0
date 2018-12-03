<template>
  <div class="log-detail">
    <div class="title">对战记录</div>
    <div class="content">
      <LogCheckerboard />
      <LogInfoTool />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import LogInfoTool from '../components/LogInfoTool'
import LogCheckerboard from '../components/LogCheckerboard'
import { piece, piecesInitData } from '../constant'

export default {
  name: 'logDeatil',
  components: {
    LogInfoTool,
    LogCheckerboard
  },
  created () {
    window.logDetail = this
    window.piecesInitData = piecesInitData
    this.setUser({
      name: '我',
      color: piece.color.black,
      fraction: 0
    })
    this.setOpponent({
      name: '你',
      color: piece.color.white,
      fraction: 0
    })
  },
  methods: {
    ...mapMutations(['setUser', 'setOpponent', 'setMode', 'setDownPiece']),
  }
}
</script>

<style lang="scss" scoped>
.log-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  display: flex;
}

.title {
  margin-bottom: 40px;
  font-size: 24px;
}
</style>

