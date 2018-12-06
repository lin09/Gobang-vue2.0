<template>
  <div class="home">
    <div class="opponent">
      <button class="btn"
        v-for="(item, key) in opponent"
        :key="key"
        :disabled="active.indexOf(item.value) === -1"
        @click="handleOpponent(item)">
        {{ item.text }}
      </button>
      <router-link class="btn" to="/log">对战记录</router-link>
    </div>

    <Modal v-model="showSiteModal" title="设置信息" okText='确认' @ok="goGage">
      <cForm ref="siteForm" @submit="goGage" :formData="siteFormData" :rules="siteRules">
        <FormGroup v-model="siteFormData.userName" label="黑棋：" placeholder="请输入玩家名字" />
        <FormGroup v-model="siteFormData.opponentName" label="白棋：" placeholder="请输入玩家名字" />
        <FormGroup v-model="siteFormData.countDown" label="倒计时（秒，0为不计时）：" placeholder="请输入正整数" type="number" :min="0" />
      </cForm>
    </Modal>

    <Modal v-model="showComputerModal" title="设置信息" okText='确认' @ok="goComputer">
      <cForm ref="computerForm" @submit="goComputer" :formData="computerFormData" :rules="computerRules">
        <FormGroup v-model="computerFormData.userName" label="黑棋：" placeholder="请输入玩家名字" />
        <FormGroup v-model="computerFormData.selectedColor" label="选择：" type="radio" :values="[pieceColor.black, pieceColor.white]"/>
      </cForm>
    </Modal>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { opponent, pieceColor, USER_NAME, OPPONENT_NAME } from '../constant'
import { cloneDeep, pick } from '../tools'
import Modal from '../components/Modal'
import FormGroup from '../components/FormGroup'
import cForm from '../components/Form'

export default {
  name: 'home',
  components: {
    Modal,
    FormGroup,
    cForm
  },
  data () {
    return {
      // 全部对手
      opponent: cloneDeep(opponent),
      pieceColor: cloneDeep(pieceColor),
      // 可选择对手
      active: [opponent.site.value, opponent.simpleComputer.value],
      // 全部正则，在 created 再组装
      rules: {
        userName: [
          { required: true, message: '黑棋玩家名字不能为空' }
        ],
        opponentName: [
          { required: true, message: '白棋玩家名字不能为空' }
        ],
        selectedColor: [
          { rgx: `^(${pieceColor.black.value}|${pieceColor.white.value})$`, message: '选择颜色错误' }
        ],
        countDown: [
          { rgx: `^([0-9]+)$`, message: '倒计时为正整数' }
        ]
      },

      // 现场数据
      showSiteModal: false,
      siteFormData: {
        userName: localStorage.getItem(USER_NAME) || '我',
        opponentName: localStorage.getItem(OPPONENT_NAME) || '你',
        countDown: 0
      },
      siteRules: [],

      // 选择电脑数据
      showComputerModal: false,
      computerFormData: {
        userName: localStorage.getItem(USER_NAME) || '我',
        selectedColor: pieceColor.black.value,
        countDown: 0
      },
      computerRules: [],
    }
  },
  created () {
    window.home = this

    // 重置state
    this.reset()

    this.siteRules = pick(this.rules, ['userName', 'opponentName', 'countDown'])
    this.computerRules = pick(this.rules, ['userName', 'selectedColor'])
  },
  methods: {
    ...mapMutations(['setUser', 'setOpponent', 'setMode', 'setCountDown', 'reset']),
    // 选择
    handleOpponent (data) {
      this.setMode(data)

      if (data.value === opponent.site.value) {
        this.showSiteModal = true
      } else {
        this.showComputerModal = true
      }
    },
    // 现在对局
    goGage () {
      // 验证表单
      if (!this.$refs['siteForm'].validate()) {
        return
      }

      // 保存信息
      localStorage.setItem(USER_NAME, this.siteFormData.userName)
      localStorage.setItem(OPPONENT_NAME, this.siteFormData.opponentName)

      // 倒计时
      this.setCountDown(this.siteFormData.countDown)
      // 更新玩家
      this.setUser({
        name: this.siteFormData.userName,
        color: pieceColor.black,
        fraction: 0
      })
      this.setOpponent({
        name: this.siteFormData.opponentName,
        color: pieceColor.white,
        fraction: 0
      })

      this.$router.push('game')
    },
    // 选择电脑
    goComputer () {
      // 验证表单
      if (!this.$refs['computerForm'].validate()) {
        return
      }

      // 保存信息
      localStorage.setItem(USER_NAME, this.computerFormData.userName)

      // 倒计时
      this.setCountDown(this.computerFormData.countDown)
      // 更新玩家
      this.setUser({
        name: this.computerFormData.userName,
        color: this.computerFormData.selectedColor === pieceColor.black.value ? pieceColor.black : pieceColor.white,
        fraction: 0
      })
      this.setOpponent({
        name: opponent.simpleComputer.text,
        color: this.computerFormData.selectedColor === pieceColor.black.value ? pieceColor.white : pieceColor.black,
        fraction: 0
      })

      this.$router.push('computer')
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
}

.opponent {
  display: flex;
  flex-direction: column;
  align-items: center;

  .btn {
    margin-top: 20px;
  }
}
</style>

