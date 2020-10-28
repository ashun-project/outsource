<template>
  <div id="app">
        <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {

  }
}
</script>

<style>
@import url(./common/style.css);
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
}
html,body{
  
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
