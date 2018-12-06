<template>
  <div class="log-checkerboard">
    <CheckerboardBase :baseData="baseData" />
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
      downPiece: state => state.downPiece,
      roundNum: state => state.log.roundNum
    })
  },
  watch: {
    downPiece (val) {
      let item = this.baseData[val.key]
      item.value = val.value
      item.index = val.index
    },
    roundNum () {
      this.init()
    }
  },
  created () {
    window.lcb = this

    this.init()
  },
  methods: {
    init () {
      let { baseData } = new piecesInitData()
      this.baseData = baseData
    }
  }
}
</script>
