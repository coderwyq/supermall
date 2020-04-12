import {debounce} from "./utils";
import BackTop from "../components/content/backTop/BackTop";
import {POP, NEW, SELL} from "./const";

export const itemListMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh: null
    }
  },
  mounted() {
    this.newRefresh = debounce(this.$refs.scroll.refresh, 100)
    this.itemImgListener = () => {
      this.newRefresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener);
  }
}

export const backTop = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTop(){
      this.$refs.scroll.scrollTo(0, 0);
    },
    listenShoBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000
      // 2.决定tabControl是否吸顶(position: fiexd)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    }
  }
}

export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
    }
  }
}
