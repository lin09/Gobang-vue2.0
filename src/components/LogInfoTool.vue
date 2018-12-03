<template>
  <div class="info-tool">
    <div></div>
    <div class="item">时间：2018-12-02</div>
    <div class="item">第{{ roundNum }}局 （比分：{{ user.fraction }} : {{ opponent.fraction }}）</div>
    <div class="item">
      <button v-show="true" @click="handleNext">上一局</button>
      <button v-show="true" @click="handleNext">下一局</button>
      <button @click="handleUp" :disabled="false">上一棋</button>
      <button @click="handleDn" :disabled="true">下一棋</button>
      <button @click="handleQuit">退出</button>
    </div>
    <div class="item">
      <Piece :data="{ value: user.color.value }"/>
      <span>{{ blank }}{{ user.name }}</span>
    </div>
    <div class="item">
      <Piece :data="{ value: opponent.color.value }"/>
      <span>{{ blank }}{{ opponent.name }}</span>
    </div>
    <div class="log">
      <div>结束，黑棋赢</div>
      <div>结束，黑棋认输</div>
      <div>结束，平局</div>
      <div>F8黑</div>
      <div>F7白</div>
      <div>F6黑</div>
      <div>F5白</div>
      <div>F8黑</div>
      <div>F7白</div>
      <div>F6黑</div>
      <div>F5白</div>
      <div>F8黑</div>
      <div>F7白</div>
      <div>F6黑</div>
      <div>F5白</div>
      <div>F8黑</div>
      <div>F7白</div>
      <div>F6黑</div>
      <div>F5白</div>
      <div><span class="time">9:01:55</span> F8黑</div>
      <div><span class="time">9:01:55</span> F7白</div>
      <div><span class="time">9:01:55</span> F6黑</div>
      <div><span class="time">9:01:55</span> F5白</div>
      <div><span class="time">9:01:55</span> 开始</div>
    </div>
  </div>
</template>

<script>
// import { mapState, mapMutations, mapActions } from 'vuex'
import { mapState } from 'vuex'
import Piece from './Piece.vue'

export default {
  name: 'logInfoTool',
  components: {
    Piece
  },
  data () {
    return {
      // 直接写全角空格在 template 上会报 no-irregular-whitespace，使用 eslint-disable-next-line 无效果
      blank: '　',
      roundNum: 1
    }
  },
  computed: mapState({
    user: state => state.user,
    opponent: state => state.opponent
  }),
  methods: {
    handleNext () {
    },
    handleUp () {
    },
    handleDn () {
    },
    handleQuit () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.info-tool {
  display: flex;
  flex-direction: column;
  margin: 20px;
  width: 350px;
  height: 600px;
  font-size: 16px;
}

.item {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-bottom: 20px;

  button {
    margin-right: 10px;
  }
}

.score {
  font-size: 30px;
}

.log {
  border-radius: 5px;
  padding: 10px 20px;
  flex-grow: 1;
  overflow: auto;
  line-height: 1.5;
  background-color: white;

  > div {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .time {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    border-radius: 5px;
    padding: 0 10px;
    background-color: #efefef;
  }
}
</style>
