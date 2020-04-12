<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1" class="tab-control" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
     <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
     <recommend-view :recommends="recommends"/>
     <featuer-view/>
     <tab-control :titles="['流行','新款','精选']"
                  @tabClick="tabClick"
                  ref="tabControl2"/>
     <goods-list :goods="showGoods"/>
    </scroll>

    <back-top @click.native="backTop" v-show="isShowBackTop"/>

  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatuerView from "./childComps/FeatuerView";

  import NavBar from "../../components/common/navtaber/NavBar";
  import TabControl from "../../components/content/tabControl/TabControl";
  import GoodsList from "../../components/content/goods/GoodsList";
  import Scroll from "../../components/common/scroll/Scroll";


  import {
    getHomeMultidata,
    getHomeGoods
  } from "../../network/home";
  import {debounce} from "../../common/utils"
  import {itemListMixin,backTop} from "../../common/mixin";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatuerView,
      TabControl,
      GoodsList,
      Scroll,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    mixins: [itemListMixin,backTop],
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidatas();

      // 2. 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted() {
      // // 1.图片加载完成的事件监听
      // const refresh = debounce(this.$refs.scroll.refresh, 100)
      //
      // //对监听事件进行保存
      // this.itemImgListener = () => {
      //   refresh()
      // };
      //
      // this.$bus.$on('itemImageLoad',this.itemImgListener)
      // // 2.获取tabControl的offsetTop
      // // 所有组件都有一个属性$el: 用于获取组件中的元素
      // // this.tabOffsetTop = this.$refs.tabControl
    },
    methods: {
      /**
       *  事件监听相关的方法
       */
      tabClick(index){
        switch (index) {
        case 0:
          this.currentType = 'pop'
            break
        case 1:
          this.currentType = 'new'
            break
         case 2:
           this.currentType = 'sell'
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll(position) {
        this.listenShoBackTop(position)
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /**
      * 网络请求相关的方法d
      * */
      getHomeMultidatas(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1;

          // 完成了上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      },
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      // 1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()

      // 2.取消全局事件的监听
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    destroyed() {
      console.log('销毁');
    }
  }
</script>

<style scoped>
  #home{
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  .content{
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
  /*.content {*/
  /*  height: calc(100% - 93px );*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
