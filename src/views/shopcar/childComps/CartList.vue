<template>
  <scroll class="content" ref="scroll">
    <cart-list-item v-for="(item, index) in cartList" :key="index" :item-info="item">{{ item }}</cart-list-item>
  </scroll>
</template>

<script>
import { mapGetters } from 'vuex'

import Scroll from 'components/common/scroll/Scroll'

import CartListItem from './CartListItem'
export default {
  components: {
    Scroll,
    CartListItem
  },
  computed: {
    ...mapGetters(['cartList'])
  }
}
</script>

<style scoped>
.content {
  height: calc(100% - 44px - 49px - 40px);
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 49px;
  overflow: hidden;
}
</style>
