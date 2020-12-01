<template>
  <div class="error">
    <div class="code">{{ $route.query.errorCode }}</div>
  </div>
</template>

<script>
export default {
  name: 'error',
  data () {
    return {
      errorCode: 0
    }
  },
  created () {
    this.errorCode = this.$route.query.errorCode || 404
  }
}
</script>

<style lang="stylus" scoped>
.code {
  font-size: 50px;
}
</style>

