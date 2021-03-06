import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/games/discdestroyer',
    name: 'Disc Destroyer',
    meta: { category: 'game' },
    component: () => import('../games/disc_destroyer/DiscDestroyer.vue')
  },
  {
    path: '/games/tetris',
    name: 'Tetris',
    meta: { category: 'game', hidden: true },
    component: () => import('../games/disc_destroyer/DiscDestroyer.vue')
  },
  {
    path: '/demos/rectcollision',
    name: 'Rectangle Collision',
    meta: { category: 'demo' },
    component: () => import('../views/RectCollisionDemo.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
