import Toast from './Toast'
const obj = {}
obj.install = function (Vue) {
  // 1.创建组件构造器
  const ToastConstructor = Vue.extend(Toast)
  // 2.new的方式，根据组件构造器，可以构造出来一个组件对象
  const toast = new ToastConstructor()
  // 3.将一个组件对象，手动地挂载到某一个元素上
  toast.$mount(document.createElement('div'))
  // 4.toast.$el对应的就是div了
  document.body.appendChild(toast.$el)

  Vue.prototype.$toast = toast
}
export default obj
