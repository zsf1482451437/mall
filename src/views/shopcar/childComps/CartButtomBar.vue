<template>
  <div class="buttom-bar">
    <div class="check-content">
      <check-buttom class="check-buttom" :is-checked="isSelectedAll" @click.native="checkClick"></check-buttom>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{ totalPrice }}
    </div>
    <div class="calculate" @click="calcClick">
      去计算({{ cartListLength }})
    </div>
  </div>
</template>

<script>
import CheckButtom from 'components/content/checkButtom/CheckButtom'
export default {
  components: {
    CheckButtom
  },
  computed: {
    totalPrice () {
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    cartListLength () {
      return this.$store.state.cartList.filter(item => {
        return item.checked
      }).length
    },
    isSelectedAll () {
      if (this.$store.state.cartList.length === 0) return false
      return !this.$store.state.cartList.find(item => !item.checked)
    }
  },
  methods: {
    checkClick () {
      if (this.isSelectedAll) {
        // 全部选中的情况
        // eslint-disable-next-line no-return-assign
        this.$store.state.cartList.forEach(item => item.checked = false)
      } else {
        // 部分选中的情况
        // eslint-disable-next-line no-return-assign
        this.$store.state.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick () {
      if (!this.isSelectedAll) {
        this.$toast.showTip('请选择商品再结算', 2000)
      }
    }
  }
}
</script>

<style scoped>
.buttom-bar {
  display: flex;
  position: absolute;
  height: 40px;
  width: 100vw;
  bottom: 40px;
  background-color: #eee;
  line-height: 40px;
  font-size: 14px;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-buttom {
  width: 20px;
  height: 20px;
  line-height: 20px;
}
.price {
  flex: 1;
  margin-left: 10px;
}
.calculate {
  text-align: center;
  width: 90px;
  background-color: rgb(248, 24, 24);
  color: #eee;
}
</style>
