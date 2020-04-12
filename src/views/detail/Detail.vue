<template>
  <div id="detail">
    <detail-nar-bar class="detail-nav"
                    @titleClick="titleClick"
                    ref="nav"/>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @itemImageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>

    </scroll>
    <detail-bottom-bar @addCar="addToCar"/>

    <back-top @click.native="backTop" v-show="isShowBackTop"/>
<!--    <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
  import DetailNarBar from "./childComps/DetailNarBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "../../components/common/scroll/Scroll";
  import GoodsList from "../../components/content/goods/GoodsList";
  // import Toast from "../../components/common/toast/Toast";

  import {getDetail, Goods, Shop, GoodsParam, showDate, getRecommend} from "../../network/detail";
  import {debounce} from "../../common/utils";
  import {itemListMixin,backTop} from "../../common/mixin";

  import {mapActions} from 'vuex'


  export default {
    name: "Detail",
    components: {
      DetailBottomBar,
      DetailCommentInfo,
      DetailParamInfo,
      DetailGoodsInfo,
      DetailShopInfo,
      DetailSwiper,
      DetailNarBar,
      DetailBaseInfo,
      Scroll,
      GoodsList,
      // Toast
    },
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [],
        getThemeTopY: null,
        currentIndex: 0,
        // message: '',
        // show: false
      }
    },
    mixins: [itemListMixin,backTop],
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid

      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 0.获取顶部的图片轮播数据
        // console.log(res);
        const data =res.result
        this.topImages = data.itemInfo.topImages

        // 3.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        // 4.创建店铺信息对象
        this.shop = new Shop(data.shopInfo);

        // 5.保存商品详情数据
        this.detailInfo = data.detailInfo

        // 6.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)

        // 7.取出评论的信息
        if(data.rate.cRate !=0 ){
          this.commentInfo = data.rate.list[0]
        }


        /*
        // 如果不用$nextTick前面调用完直接执行下面代码，因为页面的异步加载的，
        // 所以拿到的是undefined，异步，没有加载出来就执行了，所以是undefined
        // $el根本就没有渲染
        // this.themeTopYs.push(0)
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        // console.log(this.themeTopYs);

        // 根据最新的数据，对应的DOM是已经被渲染出来
        // 但是图片依然是没有加载完的
        // offsetTop值不对的时候，都是图片的问题
        // 值不对的原因: 图片没有计算在内
        // 等上面所有的对象渲染完，才会调用的函数
        this.$nextTick(() => {
          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          console.log(this.themeTopYs);
        })
        */

      })
      // 3.请求推荐数据
      getRecommend().then(res => {
        this.recommends = res.data.list
      })

      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(-44+this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(-44+this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(-44+this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      })
    },
    mounted() {

    },
    destroyed() {
      this.$bus.$off('itemImageLoad',this.itemImgListener)
    },
    methods: {
      ...mapActions(['addCar']),
      imageLoad() {
        this.newRefresh()
        this.getThemeTopY()
      },
      titleClick(index){
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      contentScroll(position){
        // 1.获取y值
        const positionY = -position.y
        // 2.positionY和主题中的值进行对比
        // [0, 6902, 7537, 7848, Number.MAX_VALUE]
        // positionY 在 0 和 6902 之间, index = 0
        // positionY 在 0 和 7537 之间, index = 1
        // positionY 在 0 和 7848 之间, index = 2
        // positionY 在 7848 和 非常大的值之间， index = 3
        // Number.MAX_VALUE 最大值
        // positionY 大于等于 7848 值， index = 3
        let length = this.themeTopYs.length
        for(let i = 0; i < length - 1; i++){
          // 条件成立:this.currentIndex = 1
          // 条件一： 防止赋值的过程过于频繁
          /*
             条件二:
             (i < length - 1 && positionY >= this.themeTopYs[i] && positionY <
             this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i])

             条件1：(i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])
             * 判断区间： 在 0 和 某个数字之间 (i < length - 1)
             条件2：(i === length - 1 && positionY >= this.themeTopYs[i])
             * 判断大于等于 : i === length - 1

           if(this.currentIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY <
            this.themeTopYs[i+1]) || (i === length - 1 && positionY >= this.themeTopYs[i]))){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }

          */
          // hack做法 : 多加了一个Number.MAX_VALUE
          if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
        // 1。判断tabControl是否显示
        this.listenShoBackTop(position)
      },
      addToCar() {
        // 1.获取到购物车需要展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title;
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid
        // 2.将商品添加到购物车里面(1.Promise 2.mapActions)
        // this.$store.commit('addCar',product)
        this.addCar(product).then(res => {
          // this.show = true
          // this.message = res
          //
          // setTimeout(() => {
          //   this.show = false
          //   this.message = ''
          // },1500)

          this.$toast.show(res,1500)
          console.log(this.$toast);
        })
        // this.$store.dispatch('addCar',product).then(res => {
        //   console.log(res);
        // })

      }
    },
  }
</script>

<style scoped>

  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 49px);
  }
</style>
