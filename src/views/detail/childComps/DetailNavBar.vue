<template>
  <nav-bar>
    <div slot="left" class="backImg" @click="back()">
      <img src="~assets/img/common/back.svg" alt="">
    </div>
    <div slot="center" class="title">
      <div
        v-for="(item, index) in titles"
        :key="item.index" class="title-item"
        :class="{active: index === currentIndex}"
        @click="itemClick(index)"
      >
        {{ item }}
      </div>
    </div>
  </nav-bar>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
export default {
  components: {
    NavBar
  },
  data () {
    return {
      titles: ['商品', '参数', '评论', '推荐'],
      currentIndex: 0
    }
  },
  methods: {
    // 选中当前标题
    itemClick (index) {
      this.currentIndex = index
      this.$emit('itemClick', index)
    },
    // 返回
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.title {
  display: flex;
}
.title-item {
  flex: 1;
}
.active {
  color: var(--color-high-text);
}
.backImg {
  margin-top: 8px;
}
</style>
