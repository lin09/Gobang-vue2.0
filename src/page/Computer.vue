<template>
  <div class="game">
    <InfoTool />
    <Checkerboard />
  </div>
</template>

<script>
import InfoTool from '../components/InfoTool'
import Checkerboard from '../components/Checkerboard'

export default {
  name: 'game',
  components: {
    InfoTool,
    Checkerboard
  }
}
</script>
