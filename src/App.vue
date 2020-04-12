<template>
  <div id="app" class="wrapper">
    <keep-alive exclude="Detail">
      <router-view/>
    </keep-alive>
    <main-tab-bar/>
    <icon></icon>
    <svg-icon></svg-icon>
  </div>
</template>

<script>
  import MainTabBar from "./components/content/mainTabar/MainTabBar";
  import Icon from "./components/content/Icon/Icon";
  import SvgIcon from "./components/content/Icon/svg";


  export default {
    name: 'App',
    components: {
      MainTabBar,
      Icon,
      SvgIcon
  }
}
</script>

<style>
  @import "assets/css/base.css";

  #app {
    position: relative;
  }
</style>
