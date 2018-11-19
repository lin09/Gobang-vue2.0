
<template>
  <div class="site">
    <div class="info-tool">
      <div class="user">
        <span>我 </span>
        <Piece :data="{ color: piece.color.black.value }"/>
      </div>
      <div class="score">0 : 0</div>
      <div class="user">
        <Piece :data="{ color: piece.color.white.value }"/>
        <span> 你</span>
      </div>
    </div>
    <Checkerboard />
  </div>
</template>

<script>
import { piece } from '../constant'
import { cloneDeep } from '../tools'
import Piece from './Piece.vue'
import Checkerboard from './Checkerboard.vue'

export default {
  name: 'site',
  components: {
    Piece,
    Checkerboard
  },
  data () {
    return {
      piece: cloneDeep(piece)
    }
  }
}
</script>

<style lang="scss" scoped>
.site {
}

.info-tool {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 40px 0;
  font-size: 16px;
}

.score {
  font-size: 30px;
}

.user {
  display: flex;
  align-items: center;

  > span {
    margin: 0 20px;
  }
}
</style>

