<template>
  <div id="home" class="wrapper">
    <!-- 头 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl1"
        class="tab-control"
        v-show="isTabFixed"
      >
    </tab-control>
    <!-- 页签 -->
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
      >
      <!-- 轮播图 -->
      <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"></home-swiper>
      <!-- 推荐 -->
      <recommend-view :recommends="recommends"></recommend-view>
      <!-- 本周流行 -->
      <feature-view></feature-view>
      <!-- 页签 -->
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      >
      </tab-control>
      <!-- 商品列表 -->
      <goods-list :goods="tabList"></goods-list>
    </scroll>
    <back-top @click.native="backClick()" v-show="isShow"></back-top>
  </div>
</template>

<script>
import HomeSwiper from './childComps/HomeSwiper.vue'
import RecommendView from './childComps/RecommendView.vue'
import FeatureView from './childComps/FeatureView.vue'

import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import { getHomeMultidata, getHomeGoods } from 'network/home'

import { itemListenerMixin, backTopMixin } from 'common/mixin'

export default {
  name: 'Home',
  components: {
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll
  },
  mixins: [itemListenerMixin, backTopMixin],
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] }
      },
      currentType: 'pop',
      // 轮播图的加载完之后需要的offsetTop
      swiperImgOffsetTop: 0,
      // 控制上面的tab-control是否显示
      isTabFixed: false,
      // 记录原来滚动位置
      saveY: 0
    }
  },
  created () {
    // 1.请求多个数据
    this.getHomeMultidata()

    // 2.请求商品数据
    this.getHomeGoods('pop')
    this.getHomeGoods('new')
    this.getHomeGoods('sell')
  },
  activated () {
    // 进来时设置
    this.$refs.scroll.scrollTo(0, this.saveY, 0)
    // 预防出现bug
    this.$refs.scroll.refresh()
  },
  deactivated () {
    // 离开时保存
    this.saveY = this.$refs.scroll.getScrollY()
    // 取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  mounted () {
  },
  computed: {
    tabList () {
      return this.goods[this.currentType].list
    }
  },
  methods: {
    // 事件监听相关
    // 监听页签
    tabClick (index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    // 下拉一定长度显示回顶
    contentScroll (position) {
      // 1.判断backTop是否显示
      this.isShow = (-position.y) > 1000
      // 2.判断上面的tab-control是否显示
      this.isTabFixed = (-position.y) > 956
    },
    // 上拉加载更多
    loadMore () {
      this.getHomeGoods(this.currentType)
    },
    // 轮播图加载完成，可以获取吸顶效果的offsetTop了
    swiperImgLoad () {
      this.swiperImgOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },
    // 网络请求相关
    getHomeMultidata () {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list
        this.recommends = res.data.recommend.list
      })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        // 完成上拉加载更多
        this.$refs.scroll.finishedPullUp()
      })
    }
  }
}
</script>

<style scoped>
#home {
  height: 100%;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;
}
.tab-control {
  position: relative;
  z-index: 9;
}
.content {
  /* 方案一 */
  position: absolute;
  overflow: hidden;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  /* 方案二 */
  /* height: calc(100% - 96px);
  overflow: hidden;
  margin-top: 44px; */
}
</style>
