import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import components
import Home from '@/views/Home.vue'
import InfoList from '@/views/InfoList.vue'
import InfoTopic from '@/views/InfoTopic.vue'

import ResourcesList from '@/views/ResourcesList.vue'

import About from '@/views/About.vue'
import Contact from '@/views/Contact.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/info',
      name: 'InfoList',
      component: InfoList
    },
    {
      path: '/info/:slug',
      name: 'InfoTopic',
      component: InfoTopic
    },

    {
      path: '/resources/list',
      name: 'ResourcesList',
      component: ResourcesList
    },


    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: Login,
      meta: { guestOnly: true }
    },
    {
      path: '/auth/register',
      name: 'Register',
      component: Register,
      meta: { guestOnly: true }
    },

  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/auth/login')
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next('/')
  } else if (to.meta.guestOnly && authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router