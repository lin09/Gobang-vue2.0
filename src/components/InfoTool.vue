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
        <!-- <button v-if="mode.value === 1"
          @click="handleAutomatic"
          :disabled="isOver"
          :class="automatic ? 'btn-orange' : '' ">自动</button> -->
        <button @click="handleDefeat" :disabled="isOver">认输</button>
        <button @click="handleDraw" :disabled="isOver">和局</button>
        <button @click="handleQuit">退出</button>
      </div>
    </div>
    <div class="item">
      <div class="user">
        <span>{{ user.name }}{{ blank }}</span>
        <Piece :data="{ value: user.color.value }"/>
        <div v-if="countDown > 0" class="time">
          <div>局{{ blank }}时：{{ userCountDownTotal | time }}</div>
          <div>倒计时：{{ userCountDown | time }}</div>
        </div>
      </div>
      <div v-if="isDraw">和局</div>
      <div v-else-if="fall && !isDraw">
        <span v-if="!isOver">轮到{{ fall | pieceColor }}方下</span>
        <span v-else>{{ fall | pieceColor }}方{{ `${ isDefeat ? '认输' : '胜' }` }}</span>
      </div>
      <div class="user">
        <div v-if="countDown > 0" class="time">
          <div>局{{ blank }}时：{{ opponentCountDownTotal | time }}</div>
          <div>倒计时：{{ opponentCountDown | time }}</div>
        </div>
        <Piece :data="{ value: opponent.color.value }"/>
        <span>{{ blank }}{{ opponent.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Piece from './Piece.vue'

export default {
  name: 'infoTool',
  components: {
    Piece
  },
  data () {
    return {
      // 直接写全角空格在 template 上会报 no-irregular-whitespace，使用 eslint-disable-next-line 无效果
      blank: '　',
      userCountDown: 0,
      userCountDownTotal: 0,
      opponentCountDown: 0,
      opponentCountDownTotal: 0,
      timeout: '',
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
    isDraw: state => state.isDraw,
    mode: state => state.mode,
    automatic: state => state.automatic
  }),
  watch: {
    fall (val) {
      if (val && this.countDown) {
        clearTimeout(this.timeout)

        if (this.fall === this.user.color.value) {
          this.opponentCountDownTotal += this.countDown - this.opponentCountDown
          this.opponentCountDown = 0

          // 玩家计时
          this.userCountDown = this.countDown
          let count = () => {
            this.timeout = setTimeout(() => {
              this.userCountDown --

              if (this.userCountDown === 0) {
                // 倒计时结束
                this.defeat()
                return
              }
              // 继续计时
              count()
            }, 1000)
          }
          // 开始计时
          count()
        } else {
          this.userCountDownTotal += this.countDown - this.userCountDown
          this.userCountDown = 0

          // 对手计时
          this.opponentCountDown = this.countDown
          let count = () => {
            this.timeout = setTimeout(() => {
              this.opponentCountDown --

              if (this.opponentCountDown === 0) {
                this.defeat()
                return
              }
              count()
            }, 1000)
          }
          count()
        }
      }
    },
    roundNum () {
      if (this.countDown) {
        this.userCountDownTotal = 0
        this.userCountDown = this.countDown
        this.opponentCountDownTotal = 0
        this.opponentCountDown = this.countDown
      }
    }
  },
  methods: {
    ...mapActions(['defeat', 'next', 'start', 'draw']),
    ...mapMutations(['getAutomatic']),
    handleStart () {
      this.start()
    },
    handleAutomatic () {
      this.getAutomatic()
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

<style lang="stylus" scoped>
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

  button + button {
    margin-left: 7px;
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

