import { debounce } from './utils'
import BackTop from 'components/content/backTop/BackTop'
export const itemListenerMixin = {
  data () {
    return {
      itemImgListener: null
    }
  },
  mounted () {
    const refresh = debounce(this.$refs.scroll.refresh)
    // 对监听事件进行保存
    this.itemImgListener = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)
  }
}
export const backTopMixin = {
  components: {
    BackTop
  },
  data () {
    return {
      // 回到顶部图片的显示与否
      isShow: false
    }
  },
  methods: {
    // 回到顶部
    backClick () {
      this.$refs.scroll.scrollTo(0, 0, 500)
    }
  }
}
