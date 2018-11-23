<template>
  <div class="info-tool">
    <div class="item">
      <div class="col-3">
        第{{ roundNum }}局
        <button v-if="countDown > 0">开始</button>
      </div>
      <div class="col-3">
        <div>比分</div>
        <div class="score">{{ users[0].fraction }} : {{ users[1].fraction }}</div>
      </div>
      <div class="col-3">
        <button>认输</button>
        <button>平局</button>
        <button @click="setIsStart(false)">退出</button>
      </div>
    </div>
    <div class="item">
      <div class="user">
        <span>{{ users[0].name }}{{ blank }}</span>
        <Piece :data="{ value: users[0].color.value }"/>
        <div v-if="countDown > 0" class="time">
          <div>局{{ blank }}时：01:00</div>
          <div>倒计时：01:00</div>
        </div>
      </div>
      <div>轮到{{ fall.text }}下</div>
      <div class="user">
        <div v-if="countDown > 0" class="time">
          <div>局{{ blank }}时：01:00</div>
          <div>倒计时：01:00</div>
        </div>
        <Piece :data="{ value: users[1].color.value }"/>
        <span>{{ blank }}{{ users[1].name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { piece } from '../constant'
import { cloneDeep } from '../tools'
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
      piece: cloneDeep(piece),
      roundNum: 1
    }
  },
  computed: mapState({
    users: state => state.users,
    fall: state => state.fall,
    countDown: state => state.countDown
  }),
  methods: {
    ...mapMutations(['setIsStart'])
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

