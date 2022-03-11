import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutations-types'
export default {
  addCart (context, payload) {
    // 1.确认是新商品还是已有商品
    // eslint-disable-next-line prefer-const
    return new Promise((resolve, reject) => {
      const oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      // 2.处理商品数量
      if (oldProduct) {
      // 提交对数量的修改
        context.commit(ADD_COUNTER, oldProduct)
        resolve('数量+1')
      } else {
        payload.count = 1
        // 提交插入元素
        context.commit(ADD_TO_CART, payload)
        resolve('加入购物车成功√')
      }
    })
  }
}
