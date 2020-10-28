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
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
}
html,body{
  min-height: 100%;
}
html {
  background: #f5f5f5;
}
body{
  max-width: 750px;
  width: 100%;
  margin: 0 auto;
  background: #fff;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-family: Arial,"微软雅黑";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
img{
  width: 100%;
}
.h10{
  height: 10px;
  font-size: 0;
  line-height: 0;
  clear: both;
  background: #f5f5f5;
}
.lotto-blue{
  background: url(./assets/img/blue.png) 0 0 no-repeat;
}
.lotto-red{
  background: url(./assets/img/red.png) 0 0 no-repeat;
}
.lotto-green{
  background: url(./assets/img/green.png) 0 0 no-repeat;
}

/* mint-ui */
.mint-header{
  overflow: hidden;
}
.mint-indexsection-index{
  color: #0084ff;
  font-weight: 600;
}
.mint-header{
  background: #0084ff;
}
.mint-header .mint-header-title{
    font-size: 16px;
    font-weight: 600;
}
.mint-toast{
  z-index: 30000;
}
</style>
