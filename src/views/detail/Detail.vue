<template>
  <div id="detail">
    <!-- 导航栏 -->
    <detail-nav-bar class="nav-bar" @itemClick="itemClick" ref="nav"></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!-- 轮播图 -->
      <detail-swiper :top-images="topImages"></detail-swiper>
      <!-- 商品基础信息 -->
      <detail-base-info :goods="goods"></detail-base-info>
      <!-- 商品店铺信息 -->
      <detail-shop-info :shop="shop"></detail-shop-info>
      <!-- 详情信息 -->
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <!-- 参数信息 -->
      <detail-param-info :paramInfo="paramInfo" ref="param"></detail-param-info>
      <!-- 评论信息 -->
      <detail-comment-info :commentInfo="commentInfo" ref="comment"></detail-comment-info>
      <!-- 推荐信息 -->
      <goods-list :goods="recommends" ref="recommend"></goods-list>
    </scroll>
    <!-- 回到顶部 -->
    <back-top @click.native="backClick()" v-show="isShow"></back-top>
    <!-- 底部工具栏 -->
    <detail-bottom-bar class="bottom-bar" @addToCart="addToCart"></detail-bottom-bar>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar.vue'
import DetailSwiper from './childComps/DetailSwiper.vue'
import DetailBaseInfo from './childComps/DetailBaseInfo.vue'
import DetailShopInfo from './childComps/DetailShopInfo.vue'
import DetailGoodsInfo from './childComps/DetailGoodsInfo.vue'
import DetailParamInfo from './childComps/DetailParamInfo.vue'
import DetailCommentInfo from './childComps/DetailCommentInfo.vue'
import DetailBottomBar from './childComps/DetailBottomBar.vue'

import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'

import { getDetailData, Goods, Shop, GoodsParam, getRecommend } from 'network/detail'

import { itemListenerMixin, backTopMixin } from 'common/mixin'
import { debounce } from 'common/utils'

import { mapActions } from 'vuex'
export default {
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    Scroll,
    GoodsList
  },
  mixins: [itemListenerMixin, backTopMixin],
  data () {
    return {
      // 记录跳转过来的参数
      iid: '',
      // 轮播图片
      topImages: [],
      // 商品信息
      goods: {},
      // 店铺信息
      shop: {},
      // 商品详情数据
      detailInfo: {},
      // 参数信息
      paramInfo: {},
      // 评论信息
      commentInfo: {},
      // 推荐信息
      recommends: [],
      // 标题对应联动位置
      titleTopY: [],
      getTitleTopY: null,
      // 当前位置对应的标题
      currentIndex: 0
    }
  },
  watch: {
    // 对路由参数的变化作出响应, 重新发起请求
    $route (to, from) {
      if (to.fullPath !== '/home') {
        this.regetData()
      }
    }
  },
  created () {
    this.regetData()
  },
  destroyed () {
    // 取消全局事件的监听
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  },
  methods: {
    // 请求相关
    getDetailData () {
      getDetailData(this.iid).then((res) => {
      // 1.获取顶部轮播图片
        const data = res.result
        this.topImages = data.itemInfo.topImages
        // 2.获取商品基础信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        // 3.获取商品店铺信息
        this.shop = new Shop(data.shopInfo)
        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo
        // 5.获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
        // 6.获取评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
      })
    },
    getRecommend () {
      getRecommend().then((res) => {
        this.recommends = res.data.list
      })
    },
    // 监听动态路由的变化，重新获取数据
    regetData () {
      // 1.保存传入的iid
      this.iid = this.$route.params.iid
      // 2.根据iid发送请求
      this.getDetailData()
      // 3.请求推荐数据
      this.getRecommend()
      // 4.给getTitleTopY赋值(进行防抖)
      this.getTitleTopY = debounce(() => {
        this.titleTopY = []
        this.titleTopY.push(0)
        this.titleTopY.push(this.$refs.param.$el.offsetTop)
        this.titleTopY.push(this.$refs.comment.$el.offsetTop)
        this.titleTopY.push(this.$refs.recommend.$el.offsetTop)
        this.titleTopY.push(Number.MAX_VALUE)
      })
    },
    // 非请求
    // 映射vuex里的actions中的方法
    ...mapActions(['addCart']),
    // 监听图片加载完成
    imageLoad () {
      this.$refs.scroll.refresh()
      this.getTitleTopY()
    },
    // 点击导航栏标题跳转到对应内容
    itemClick (index) {
      this.$refs.scroll.scrollTo(0, -this.titleTopY[index], 500)
    },
    // 监听滚动位置
    contentScroll (position) {
      // 内容滚动，对应标题高亮
      // 1.获取y值
      const positionY = -position.y
      // 2.positionY和标题中的值对比
      const length = this.titleTopY.length
      for (let i = 0; i < length; i++) {
        const iPos = this.titleTopY[i]
        if (positionY >= iPos && positionY < this.titleTopY[i + 1]) {
          // 如果currentIndex没有发生改变就不要赋值，避免频繁赋值
          if (this.currentIndex !== i) {
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }
      }
      // 判断backTop是否显示
      this.isShow = (-position.y) > 1000
    },
    // 加入购物车
    addToCart () {
      // 1.获取购物车需要的数据
      // eslint-disable-next-line prefer-const
      let product = {}
      product.iid = this.iid
      product.imgURL = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      // 2.加入购物车store
      this.addCart(product).then((res) => {
        // 提示窗口
        this.$toast.showTip(res, 2000)
      })
    }
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.content {
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 58px;
}
.nav-bar {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>
