<template>
  <div class="checkerboard" @click.capture="handleStop">
    <div class="line-row"></div>
    <div class="line-col"></div>
    <div class="star"></div>
    <div class="num">
      <div v-for="n in 15" :key="n">{{ n }}</div>
    </div>
    <div class="letter">
      <div v-for="n in letter" :key="n">{{ n }}</div>
    </div>
    <div class="pieces">
      <div class="row" v-for="y in 15" :key="y">
        <Piece v-for="x in 15" :key="x" :data="baseData[`${ x }-${ y }`]" @handlePiece="handlePiece" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import { piece } from '../constant'
import Piece from './Piece.vue'

export default {
  name: 'checkerboard',
  components: {
    Piece
  },
  data () {
    return {
      letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M', 'O'],
      baseData: {},
      countData: {},
      color: piece.color.black.value,
      isOver: false
    }
  },
  computed: mapState({
    fall: state => state.fall,
    user: state => state.user,
    opponent: state => state.opponent,
    roundNum: state => state.roundNum
  }),
  watch: {
    // roundNum () {
    //   this.initData()
    // }
  },
  created () {
    window.cb = this

    this.setRoundNum(1)
    this.initData()
  },
  methods: {
    ...mapActions(['victory']),
    ...mapMutations(['setFall', 'setRoundNum']),
    handlePiece (data) {
      let item = this.baseData[data.key]
      item.value = this.fall.color.value

      if (this.handleIsOver(item) === true) {
        this.isOver = true
        this.victory()
        return
      }

      if (this.fall.color.value === piece.color.black.value) {
        item.text = piece.color.black.text
        this.handleFall(piece.color.white.value)
      } else {
        item.text = piece.color.white.text
        this.handleFall(piece.color.black.value)
      }
    },
    handleFall (value) {
      if (this.user.color.value === value) {
        this.setFall(this.user)
      } else {
        this.setFall(this.opponent)
      }
    },
    handleStop (event) {
      if (this.isOver) {
        event.stopPropagation && event.stopPropagation();
      }
    },
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

      if (1 + tItems.length + bItems > 4) {
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
    initData () {
      this.handleFall(piece.color.black.value)
      this.isOver = false

      let baseData = {}, countData = {}

      const getCountItem = (k, d, i, v) => {
        let data = countData[k] || {}
        let dk = d + 'k'
        let dkv = data[dk] || []
        dkv[i] = v.key
        return {
          ...data,
          [d]: {
            ...data[d],
            [v.key]: v
          },
          [dk]: dkv
        }
      }

      for (let x = 1; x < 16; x ++) {
        for (let y = 1; y < 16; y ++) {
          let key = `${ x }-${ y }`
          let item = {
            ...piece.color.none,
            x,
            y,
            key,
            active: false
          }

          baseData[key] = item

          for (let i = 0; i < 4; i ++) {
            let n = i + 1
            let t = y - n
            let r = x + n
            let b = y + n
            let l = x - n

            if (t > 0) {
              let k = `${ x }-${ t }`
              countData[k] = getCountItem(k, 'b', i, item)
            }

            if (t > 0 && r < 16) {
              let k = `${ r }-${ t }`
              countData[k] = getCountItem(k, 'lb', i, item)
            }

            if (r < 16) {
              let k = `${ r }-${ y }`
              countData[k] = getCountItem(k, 'l', i, item)
            }

            if (r < 16 && b < 16) {
              let k = `${ r }-${ b }`
              countData[k] = getCountItem(k, 'lt', i, item)
            }

            if (b < 16) {
              let k = `${ x }-${ b }`
              countData[k] = getCountItem(k, 't', i, item)
            }

            if (b < 16 && l > 0) {
              let k = `${ l }-${ b }`
              countData[k] = getCountItem(k, 'rt', i, item)
            }

            if (l > 0) {
              let k = `${ l }-${ y }`
              countData[k] = getCountItem(k, 'r', i, item)
            }

            if (l > 0 && t > 0) {
              let k = `${ l }-${ t }`
              countData[k] = getCountItem(k, 'rb', i, item)
            }
          }
        }
      }

      this.baseData = baseData
      this.countData = countData
    }
  }
}
</script>

<style lang="scss" scoped>
.checkerboard {
  position: relative;
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

