<template>
  <div class="piece">
    <div v-if="data.value === piece.color.none.value" class="none" @click="handlePiece"></div>
    <div v-if="data.value === piece.color.black.value" class="black"></div>
    <div v-if="data.value === piece.color.white.value" class="white"></div>
  </div>
</template>

<script>
import { piece } from '../constant'
import { cloneDeep } from '../tools'

export default {
  name: 'piece',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          value: piece.color.none.value,
          x: 0,
          y: 0
        }
      }
    }
  },
  data () {
    return {
      piece: cloneDeep(piece)
    }
  },
  methods: {
    handlePiece () {
      this.$emit('handlePiece', this.data)
    }
  }
}
</script>

<style lang="scss" scoped>
.piece {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  width: 40px;
  height: 40px;

  .none,
  .black,
  .white {
    width: 90%;
    height: 90%;
    border-radius: 100%;
  }

  .none {
    &:hover {
      background: radial-gradient(farthest-corner at 13px 13px, rgba(255,255,255,0.1) -60%, rgba(0,0,0,0.1) 100%);
    }
  }

  .black,
  .white {
    box-shadow: 1px 1px 4px;
  }

  .black {
    background: radial-gradient(farthest-corner at 10px 10px, white -60%, black 100%);
  }

  .white {
    background: radial-gradient(farthest-corner at 10px 10px, white 0, black 150%);
  }
}
</style>


