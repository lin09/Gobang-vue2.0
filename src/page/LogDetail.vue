<template>
  <div class="log-detail">
    <div class="title">复盘</div>
    <div class="content">
      <LogCheckerboard />
      <LogInfoTool />
    </div>
  </div>
</template>

<script>
import LogInfoTool from '../components/LogInfoTool'
import LogCheckerboard from '../components/LogCheckerboard'

export default {
  name: 'logDeatil',
  components: {
    LogInfoTool,
    LogCheckerboard
  },
  created () {
    window.logDetail = this
  }
}
</script>

<style lang="stylus" scoped>
.log-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  display: flex;
  flex-wrap: wrap;
}

.title {
  margin-bottom: 40px;
  font-size: 24px;
}
</style>

