// 1.导入
import Vue from 'vue'
import VueRouter from 'vue-router'
// 2.挂载
Vue.use(VueRouter)
// 懒加载
const Home = () => import('views/home/Home.vue')
const Category = () => import('views/category/Category.vue')
const ShopCar = () => import('views/shopcar/ShopCar.vue')
const Profile = () => import('views/profile/Profile.vue')
const Detail = () => import('views/detail/Detail.vue')
// 3.创建路由配置对象
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/shopcar',
    component: ShopCar
  },
  {
    path: '/profile',
    component: Profile
  },
  {
    path: '/detail/:iid',
    component: Detail
  }
]
// 4.实例化路由对象
const router = new VueRouter({
  routes
})
// 5.默认导出
export default router
