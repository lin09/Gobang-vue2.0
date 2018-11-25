<template>
  <div class="home">
    <div class="opponent">
      <button class="btn"
        v-for="(item, key) in opponent"
        :key="key"
        :disabled="active.indexOf(item.value) === -1"
        @click="handleOpponent(item)">
        {{ item.text }}
      </button>
      <router-link class="btn" to="/log">对战记录</router-link>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { opponent, piece } from '../constant'
import { cloneDeep } from '../tools'

export default {
  name: 'home',
  data () {
    return {
      opponent: cloneDeep(opponent),
      active: [opponent.site.value]
    }
  },
  created () {
    window.home = this
  },
  methods: {
    ...mapMutations(['setUser', 'setOpponent', 'setMode', 'setCountDown']),
    handleOpponent (data) {
      this.setMode(data)

      if (data.value === opponent.site.value) {
        this.setCountDown(0)
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
      }

      this.$router.push('game')
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
}

.opponent {
  display: flex;
  flex-direction: column;
  align-items: center;

  .btn {
    margin-top: 20px;
  }
}
</style>

