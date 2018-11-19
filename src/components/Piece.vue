<template>
  <div class="piece">
    <div v-if="data.color === piece.color.black.value" class="black"></div>
    <div v-if="data.color === piece.color.white.value" class="white"></div>
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
          color: 0
        }
      }
    }
  },
  data () {
    return {
      piece: cloneDeep(piece)
    }
  }
}
</script>

<style lang="scss" scoped>
.piece {
  border-radius: 100%;
  width: 40px;
  height: 40px;

  .black,
  .white {
    width: 100%;
    height: 100%;
    border-radius: 100%;
  }

  .black {
    background: radial-gradient(farthest-corner at 13px 13px, white -60%, black 100%);
  }

  .white {
    background: radial-gradient(farthest-corner at 13px 13px, white 0, black 150%);
  }
}
</style>


