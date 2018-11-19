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
    </div>
  </div>
</template>

<script>
import { opponent } from '../constant'
import { cloneDeep } from '../tools'

export default {
  name: 'welcome',
  data () {
    return {
      opponent: cloneDeep(opponent)
    }
  },
  methods: {
    handleOpponent (data) {
      this.$emit('handleOpponent', data)
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
    border-radius: 4px;
    padding: 5px 10px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;

    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>

