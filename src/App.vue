<template>
  <div id="app">
    <div>五子棋</div>
    <div v-if="!isStart">
      <div>对战记录</div>
      <Welcome />
    </div>
    <div v-if="isStart">
      <InfoTool />
      <Checkerboard />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { opponent } from './constant'
import { cloneDeep } from './tools'
import Welcome from './components/Welcome.vue'
import Checkerboard from './components/Checkerboard.vue'
import InfoTool from './components/InfoTool.vue'

export default {
  name: 'app',
  data: () => {
    return {
      opponent: cloneDeep(opponent)
    }
  },
  computed: mapState({
    isStart: state => state.isStart,
    selectOpponent: 'opponent'
  }),
  components: {
    Welcome,
    InfoTool,
    Checkerboard
  }
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

button {
  border-radius: 4px;
  padding: 5px 10px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    cursor: not-allowed;
  }
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
