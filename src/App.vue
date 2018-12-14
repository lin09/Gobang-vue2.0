<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style lang="scss">
* {
  box-sizing: border-box;
}

a {
  color: #333;
  text-decoration: none;
}

.btn,
button {
  border: 0;
  border-radius: 4px;
  padding: 5px 10px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    cursor: not-allowed;
  }
}

.btn-orange {
  background: #ff8000;
  color: #fff;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  width: 640px;
}
</style>
