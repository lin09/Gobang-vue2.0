<template>
  <div class="checkerboard">
    <div class="line-row"></div>
    <div class="line-col"></div>
    <div class="star"></div>
    <div class="num">
      <div v-for="n in 15" :key="n">{{ n }}</div>
    </div>
    <div class="letter">
      <div v-for="n in letter" :key="n">{{ n }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'checkerboard',
  data () {
    return {
      letter: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 'M', 'O']
    }
  }
}
</script>

<style lang="scss" scoped>
.checkerboard {
  position: relative;
  width: 600px;
  height: 600px;
  background-color: #DC9550;
  font-size: 12px;
}

.line-row{
  position: absolute;
  top: 0;
  left: 0;
  width: 561px;
  height: 1px;
  box-shadow: 20px 20px, 20px 60px, 20px 100px, 20px 140px, 20px 180px, 20px 220px, 20px 260px, 20px 300px, 20px 340px, 20px 380px, 20px 420px, 20px 460px, 20px 500px, 20px 540px, 20px 580px;
}

.line-col{
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 560px;
  box-shadow: 20px 20px, 60px 20px, 100px 20px, 140px 20px, 180px 20px, 220px 20px, 260px 20px, 300px 20px, 340px 20px, 380px 20px, 420px 20px, 460px 20px, 500px 20px, 540px 20px, 580px 20px;
}

.star {
  position: absolute;
  top: 137px;
  left: 137px;
  width: 7px;
  height: 7px;
  background-color: black;
  box-shadow: 320px 0, 320px 320px, 0 320px;
}

.num {
  position: absolute;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  width: 20px;
  height: 100%;
}

.letter {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 20px;
}

</style>
