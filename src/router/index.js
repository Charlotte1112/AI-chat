// 导入路由模块
import { createRouter, createWebHistory } from 'vue-router'

// 导入视图组件
import HomeView from '../views/HomeView.vue'
import TodoView from '../views/TodoView.vue'
import AboutView from '../views/AboutView.vue'
import AIVIew from '../views/AIVIew.vue'
import TourGuideView from '../views/TourGuideView.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    redirect: '/tour'
  },
  {
    path: '/todo',
    name: 'todo',
    component: TodoView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/tour',
    name: 'tour',
    component: TourGuideView
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
