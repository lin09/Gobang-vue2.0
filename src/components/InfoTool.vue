<template>
  <div class="info-tool" v-if="user.color">
    <div class="item">
      <div class="col-3">
        <span v-show="roundNum > 0">第{{ roundNum }}局</span>
        <button v-show="countDown > 0 && roundNum === 0" @click="handleStart">开始</button>
        <button v-show="roundNum > 0 && isOver" @click="handleNext">下一局</button>
      </div>
      <div class="col-3">
        <div>比分</div>
        <div class="score">{{ user.fraction }} : {{ opponent.fraction }}</div>
      </div>
      <div class="col-3">
        <button @click="handleDefeat" :disabled="isOver">认输</button>
        <button @click="handleDraw" :disabled="isOver">平局</button>
        <button @click="handleQuit">退出</button>
      </div>
    </div>
    <div class="item">
      <div class="user">
        <span>{{ user.name }}{{ blank }}</span>
        <Piece :data="{ value: user.color.value }"/>
        <div v-if="countDown > 0" class="time">
          <div>局{{ blank }}时：01:00</div>
          <div>倒计时：01:00</div>
        </div>
      </div>
      <div v-if="isDraw">平局</div>
      <div v-if="fall.color && !isDraw">{{ !isOver ? `轮到${ fall.color.text }下` : `${ fall.color.text }${ isDefeat ? '认输' : '赢' }` }}</div>
      <div class="user">
        <div v-if="countDown > 0" class="time">
          <div>局{{ blank }}时：01:00</div>
          <div>倒计时：01:00</div>
        </div>
        <Piece :data="{ value: opponent.color.value }"/>
        <span>{{ blank }}{{ opponent.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Piece from './Piece.vue'

export default {
  name: 'infoTool',
  components: {
    Piece
  },
  data () {
    return {
      // 直接写全角空格在 template 上会报 no-irregular-whitespace，使用 eslint-disable-next-line 无效果
      blank: '　'
    }
  },
  computed: mapState({
    user: state => state.user,
    opponent: state => state.opponent,
    fall: state => state.fall,
    countDown: state => state.countDown,
    roundNum: state => state.roundNum,
    isOver: state => state.isOver,
    isDefeat: state => state.isDefeat,
    isDraw: state => state.isDraw
  }),
  methods: {
    ...mapActions(['defeat', 'next', 'start', 'draw']),
    handleStart () {
      this.start()
    },
    handleDefeat () {
      this.defeat()
    },
    handleNext () {
      this.next()
    },
    handleDraw () {
      this.draw()
    },
    handleQuit () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.info-tool {
  margin: 40px 0;
  font-size: 16px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .col-3 {
    width: percentage(1/3);
  }

  button {
    margin-left: 10px;
  }
}

.score {
  font-size: 30px;
}

.user {
  display: flex;
  align-items: center;

  .time {
    margin: 0 20px;
  }
}
</style>

