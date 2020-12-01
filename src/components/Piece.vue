<template>
  <div class="piece">
    <div v-if="!isOver && !automatic && data.value === pieceColor.none.value" class="none" @click="handlePiece"></div>
    <div v-if="data.value === pieceColor.black.value" :class="data.active ? 'black acitve' : 'black'">{{ data.index }}</div>
    <div v-if="data.value === pieceColor.white.value" :class="data.active ? 'white acitve' : 'white'">{{ data.index }}</div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { pieceColor } from '../constant'
import { cloneDeep } from '../tools'

export default {
  name: 'piece',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          // 黑子白子的值
          value: pieceColor.none.value,
          // 五子相连，变更样式
          active: false
        }
      }
    }
  },
  data () {
    return {
      pieceColor: cloneDeep(pieceColor)
    }
  },
  computed: mapState({
    automatic: state => state.automatic,
    isOver: state => state.isOver
  }),
  methods: {
    ...mapMutations(['setDownPiece']),
    handlePiece () {
      this.setDownPiece(this.data)
    }
  }
}
</script>

<style lang="stylus" scoped>
.piece {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  width: 40px;
  height: 40px;

  > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 90%;
    border-radius: 100%;
    font-size: 16px;
  }

  .none {
    &:hover {
      background: radial-gradient(farthest-corner at 13px 13px, rgba(255,255,255,0.1) -60%, rgba(0,0,0,0.1) 100%);
    }
  }

  .black,
  .white {
    box-shadow: 1px 1px 4px black;
  }

  .black {
    color: white;
    background: radial-gradient(farthest-corner at 10px 10px, white -60%, black 100%);
  }

  .white {
    color: black;
    background: radial-gradient(farthest-corner at 10px 10px, white 0, black 150%);
  }

  .acitve {
    width: 93%;
    height: 93%;
    box-shadow: 0px 0px 6px 2px white;
  }
}
</style>


