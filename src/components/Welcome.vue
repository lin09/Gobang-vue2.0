<template>
  <div class="welcome">
    <div class="opponent">
      <button
        v-for="(item, key) in opponent"
        :key="key"
        :disabled="item.value !== opponent.site.value"
        @click="handleOpponent(item)">
        {{ item.text }}
      </button>
      <button>对战记录</button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { opponent, piece } from '../constant'
import { cloneDeep } from '../tools'

export default {
  name: 'welcome',
  data () {
    return {
      opponent: cloneDeep(opponent)
    }
  },
  created () {
    this.setCountDown(0)
  },
  methods: {
    ...mapMutations(['setIsStart', 'setOpponent', 'setUsers', 'setCountDown']),
    handleOpponent (data) {
      this.setIsStart(true)
      this.setOpponent(data)

      if (data.value === opponent.site.value) {
        this.setUsers([
          {
            name: '我',
            color: piece.color.black,
            fraction: 0
          },
          {
            name: '你',
            color: piece.color.white,
            fraction: 0
          }
        ])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
}

.opponent {
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    margin-top: 20px;
  }
}
</style>

