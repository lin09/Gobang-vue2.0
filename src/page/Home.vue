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

    <Modal v-model="showModal" title="设置信息" okText='确认' @ok="goGage">
      <cForm ref="form" @submit="goGage" :formData="formData" :rules="rules">
        <FormGroup v-model="formData.userName" label="黑棋：" placeholder="玩家名字" />
        <FormGroup v-model="formData.opponentName" label="白棋：" placeholder="玩家名字" />
      </cForm>
    </Modal>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { opponent, pieceColor } from '../constant'
import { cloneDeep } from '../tools'
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
      opponent: cloneDeep(opponent),
      active: [opponent.site.value],
      showModal: false,
      formData: {
        userName: '我',
        opponentName: '你'
      },
      rules: {
        userName: [
          { required: true, message: '黑棋玩家名字不能为空' }
        ],
        opponentName: [
          { required: true, message: '白棋玩家名字不能为空' }
        ]
      }
    }
  },
  created () {
    window.home = this
  },
  methods: {
    ...mapMutations(['setUser', 'setOpponent', 'setMode', 'setCountDown']),
    handleOpponent (data) {
      this.setMode(data)

      if (data.value === opponent.site.value) {
        this.showModal = true
      }
    },
    goGage () {
      if (!this.$refs['form'].validate()) {
        return
      }

      this.setCountDown(0)
      this.setUser({
        name: this.formData.userName,
        color: pieceColor.black,
        fraction: 0
      })
      this.setOpponent({
        name: this.formData.opponentName,
        color: pieceColor.white,
        fraction: 0
      })

      this.$router.push('game')
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

