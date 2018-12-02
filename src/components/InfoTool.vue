<template>
  <div class="info-tool">
    <div class="item">
      <div class="col-3">
        第{{ roundNum }}局
        <button v-show="countDown > 0 && isOver">开始</button>
        <button v-show="countDown === 0 && isOver" @click="handleNext">下一局</button>
      </div>
      <div class="col-3">
        <div>比分</div>
        <div class="score">{{ user.fraction }} : {{ opponent.fraction }}</div>
      </div>
      <div class="col-3">
        <button @click="handleDefeat" :disabled="isOver">认输</button>
        <button @click="handleAgain" :disabled="isOver">平局</button>
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
      <div>{{ !isOver ? `轮到${ fall.color.text }下` : `${ fall.color.text }赢` }}</div>
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
import { mapState, mapMutations, mapActions } from 'vuex'
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
    isOver: state => state.isOver
  }),
  methods: {
    ...mapActions(['defeat', 'next']),
    ...mapMutations(['setRoundNum', 'setIsOver']),
    handleDefeat () {
      this.setIsOver(true)
      this.defeat()
    },
    handleNext () {
      this.next()
    },
    handleAgain () {
      this.setIsOver(true)
      this.next()
    },
    handleQuit () {
      this.setIsOver(true)
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

