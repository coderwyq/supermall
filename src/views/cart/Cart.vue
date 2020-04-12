<template>
  <div class="cart">
<!--  导航  -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{Length}})</div>
    </nav-bar>
<!--   商品的列表 -->
    <cart-list />
<!--   底部的汇总 -->
    <cart-bottom-bar/>
  </div>
</template>
4:36
<script>
  import NavBar from "components/common/navtaber/NavBar";
  import CartList from "./childComps/CartList";
  import CartBottomBar from "./childComps/CartBottomBar";

  import {mapGetters} from 'vuex'

  export default {
    name: "Cart",
    components: {
      CartBottomBar,
      NavBar,
      CartList
    },
    computed: {
      // 两种语法
      // 1.第一种
      // ...mapGetters(['cartLength', 'carList'])
      // 2.第二种
      ...mapGetters({
        Length: 'cartLength',
      })
    }
  }
</script>

<style scoped>

  .cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

</style>
