<template>
  <div v-if="detail.user" class="info-tool">
    <div class="item">时间：{{ logDetail.date | dateFormat('YYYY-MM-DD') }}</div>
    <div class="item">第{{ detail.roundNum }}局 （总{{ logDetail.list.length }}局）</div>
    <div class="item">比分：{{ fraction }}</div>
    <div class="item">
      <button @click="handleUpRound" :disabled="logDetail.list.length === 0 || detail.roundNum === 1">上一局</button>
      <button @click="handleDnRound" :disabled="logDetail.list.length === 0 || detail.roundNum === logDetail.list.length">下一局</button>
      <button @click="handleUp" :disabled="pieceIndex === 0">上一棋</button>
      <button @click="handleDn" :disabled="pieceIndex >= detail.pieces.length">下一棋</button>
      <button @click="handleQuit">退出</button>
    </div>
    <div class="item">
      <Piece :data="{ value: detail.user.color.value }"/>
      <span>{{ blank }}{{ detail.user.name }}</span>
    </div>
    <div class="item">
      <Piece :data="{ value: detail.opponent.color.value }"/>
      <span>{{ blank }}{{ detail.opponent.name }}</span>
    </div>
    <div v-if="logDetail.countDown" class="item">倒计时：{{ logDetail.countDown | time }}</div>
    <div class="log">
      <div v-for="(item, index) in logTexts" :key="index">
        <span class="time">{{ item.date | dateFormat('h:mm:ss') }}</span>{{ item.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { pieceColor } from '../constant'
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
      // 当前局详情
      detail: {},
      // 比分文案
      fraction: '0 - 0',
      // 下到第几个棋子
      pieceIndex: 0,
      // 信息输出
      logTexts: []
    }
  },
  computed: mapState({
    logDetail: state => state.log.log
  }),
  watch: {
    logDetail (val) {
      this.detail = val.list[0]
    },
    detail (val) {
      this.fraction = `${ val.user.fraction } - ${ val.opponent.fraction }`
      this.pieceIndex = 0
      // 更新局数使棋盘初始化
      this.setLogRoundNum(this.detail.roundNum)

      this.logTexts = [{
        date: val.startDate,
        text: '开始'
      }]

      // 是否结束
      if (!val.pieces || val.pieces.length === 0) {
        this.handleEnd()
      }
    }
  },
  created () {
    window.lit = this

    // 获取详情
    this.getLog(this.$route.params.id)
  },
  methods: {
    ...mapActions(['getLog']),
    ...mapMutations(['setDownPiece', 'setLogRoundNum']),
    // 上一局
    handleUpRound () {
      if (this.detail.roundNum > 1) {
        this.detail = this.logDetail.list[this.detail.roundNum - 2]
      }
    },
    // 下一局
    handleDnRound () {
      let length = this.logDetail.list.length

      if (length > 1 && this.detail.roundNum < length) {
        this.detail = this.logDetail.list[this.detail.roundNum]
      }
    },
    // 上一个棋子
    handleUp () {
      // 删除结束文案
      this.pieceIndex === this.detail.pieces.length && this.logTexts.shift()

      // 上一个
      this.pieceIndex --
      // 组装棋子数据
      let piece = {
        ...this.detail.pieces[this.pieceIndex],
        value: pieceColor.none.value,
        isLog: true
      }
      piece.key = `${piece.x}-${piece.y}`
      // 更新棋子
      this.setDownPiece(piece)
      // 删除信息输出
      this.logTexts.shift()
      // 比分
      this.fraction = `${ this.detail.user.fraction } - ${ this.detail.opponent.fraction }`
    },
    // 下一个棋子
    handleDn () {
      if (this.pieceIndex >= this.detail.pieces.length) {
        return
      }

      // 根据下标定颜色
      let color = this.pieceIndex % 2 ? pieceColor.white : pieceColor.black
      // 组装棋子数据
      let piece = {
        ...this.detail.pieces[this.pieceIndex],
        value: color.value,
        index: this.pieceIndex + 1,
        isLog: true
      }
      piece.key = `${piece.x}-${piece.y}`
      // 更新棋子
      this.setDownPiece(piece)

      // 信息输出
      this.logTexts = [].concat([{
        date: piece.date,
        text: `${this.$options.filters.letter(piece.x - 1)}${piece.y}${color.text}`
      }], this.logTexts)

      this.pieceIndex ++

      // 结束
      if (this.pieceIndex === this.detail.pieces.length) {
        this.handleEnd(piece)
      }
    },
    handleEnd (endPiece) {
      let fraction, user, opponent
      let text = ''
      // 结束后，比分更新为下一局，无下一局读最终比赛结果数据
      if (this.detail.roundNum < this.logDetail.list.length) {
        let nextRound = this.logDetail.list[this.detail.roundNum]
        user = nextRound.user
        opponent = nextRound.opponent
      } else {
        user = this.logDetail.user
        opponent = this.logDetail.opponent
      }
      fraction = `${ user.fraction } - ${ opponent.fraction }`

      if (this.fraction === fraction) {
        text += '和局'
      } else {
        if (!this.detail.isDefeat) {
          let color = this.pieceIndex % 2 ? pieceColor.black : pieceColor.white
          text += color.text + '方胜'
        } else {
          let color = this.pieceIndex % 2 ? pieceColor.white : pieceColor.black

          let startTime = this.detail.startDate
          let endTime = this.detail.endDate
          if (endPiece) {
            startTime = endPiece.date
          }
          if (this.logDetail.countDown === endTime - startTime) {
            text = '倒计时结束，' + color.text + '方输'
          } else {
            text += color.text + '方认输'
          }
        }
      }

      this.logTexts = [].concat({
        date: this.detail.endDate,
        text
      }, this.logTexts)

      this.fraction = fraction
    },
    handleQuit () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="stylus" scoped>
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
