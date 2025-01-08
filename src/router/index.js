import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import Home from '../pages/Home.vue'
import ImageAdjust from '../components/ImageAdjust.vue'
import Character from '../components/Character.vue'

const routes = [
  {
    path: '/sexsex',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home
      },
      {
        path: '/image-adjust/:imageUrl/:description',
        name: 'ImageAdjust',
        component: ImageAdjust,
        props: true
      },      
      {
        path: '/character/:imageData',
        name: 'Character',
        component: Character,
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

