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
              this.message = ruleItem.message
              // 回调
              typeof callBack === 'function' && callBack(false)
              return false
            }
          }

          // 检查其它，以后添加
        }
      }

      // 回调
      typeof callBack === 'function' && callBack(true)
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  color: red;
}
</style>
