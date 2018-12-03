<template>
  <div class="log-checkerboard">
    <CheckerboardBase :baseData="baseData" :isClick="false" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { piecesInitData } from '../constant'
import CheckerboardBase from './CheckerboardBase.vue'

export default {
  name: 'logCheckerboard',
  components: {
    CheckerboardBase
  },
  data () {
    return {
      // 棋子数据
      baseData: {}
    }
  },
  computed: {
    ...mapState({
      downPiece: state => state.downPiece
    })
  },
  watch: {
    downPiece (val) {
      let item = this.baseData[val.key]
      item.value = val.value
      item.index = val.index
    }
  },
  created () {
    window.lcb = this

    let { baseData } = new piecesInitData()
    this.baseData = baseData
  }
}
</script>

<style lang="scss" scoped>
.checkerboard {
  position: relative;
  margin: 20px;
  flex-shrink: 0;
  width: 600px;
  height: 600px;
  background-color: #E7C29C;
  font-size: 12px;
  box-shadow: 3px 3px 12px;
}

.line-row{
  position: absolute;
  top: 0;
  left: 0;
  width: 561px;
  height: 1px;
  box-shadow: 20px 20px, 20px 60px, 20px 100px, 20px 140px, 20px 180px, 20px 220px, 20px 260px, 20px 300px, 20px 340px, 20px 380px, 20px 420px, 20px 460px, 20px 500px, 20px 540px, 20px 580px;
}

.line-col{
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 560px;
  box-shadow: 20px 20px, 60px 20px, 100px 20px, 140px 20px, 180px 20px, 220px 20px, 260px 20px, 300px 20px, 340px 20px, 380px 20px, 420px 20px, 460px 20px, 500px 20px, 540px 20px, 580px 20px;
}

.star {
  position: absolute;
  top: 137px;
  left: 137px;
  width: 7px;
  height: 7px;
  background-color: black;
  box-shadow: 320px 0, 160px 160px, 320px 320px, 0 320px;
}

.num {
  position: absolute;
  top: 0;
  left: -20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 20px;
  height: 100%;
}

.letter {
  position: absolute;
  top: -20px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 20px;
}

.pieces {
  position: absolute;
  top: 0;
  left: 0;

  .row {
    display: flex;
  }
}

</style>

