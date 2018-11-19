<template>
  <div id="app">
    <div>五子棋</div>
    <div v-show="!isStart">
      <div>对战记录</div>
      <Welcome @handleOpponent="handleOpponent" />
    </div>
    <div v-show="isStart">
      <Site v-if="selectOpponent.value === opponent.site.value" />
    </div>
  </div>
</template>

<script>
import { opponent } from './constant'
import { cloneDeep } from './tools'
import Welcome from './components/Welcome.vue'
import Site from './components/Site.vue'

export default {
  name: 'app',
  data: () => {
    return {
      isStart: false,
      opponent: cloneDeep(opponent),
      selectOpponent: {}
    }
  },
  components: {
    Welcome,
    Site
  },
  methods: {
    handleOpponent (data) {
      this.isStart = true
      this.selectOpponent = { ...data }
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  width: 600px;
}
</style>
