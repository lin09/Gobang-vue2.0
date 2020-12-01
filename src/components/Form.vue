<template>
  <form @submit.prevent @keyup="keyup">
    <div class="message">{{ message }}</div>
    <slot></slot>
  </form>
</template>

<script>
export default {
  props: {
    formData: Object,
    rules: Object
  },
  data () {
    return {
      message: '',
    }
  },
  methods: {
    keyup (event) {
      event.keyCode === 13 && this.$emit('submit')
    },
    validate (callBack) {
      this.message = ''

      for (let key in this.rules) {
        let ruleItems = this.rules[key]
        for (let index in ruleItems) {
          let ruleItem = ruleItems[index]

          // 检查是否为空
          if (ruleItem.required === true) {
            if (!this.formData[key] || this.formData[key] === '') {
              return this.callBack(ruleItem.message, callBack)
            }
          }

          // 正则
          if (ruleItem.rgx && RegExp(ruleItem.rgx).test(this.formData[key]) === false) {
            return this.callBack(ruleItem.message, callBack)
          }

          // 检查其它，以后添加
        }
      }

      // 回调
      typeof callBack === 'function' && callBack(true)
      return true
    },
    callBack(message, callBack) {
      this.message = message
      // 回调
      typeof callBack === 'function' && callBack(false)
      return false
    }
  }
}
</script>

<style lang="stylus" scoped>
.message {
  color: red;
}
</style>
