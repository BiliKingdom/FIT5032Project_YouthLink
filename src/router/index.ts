import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import components
import Home from '@/views/Home.vue'
import InfoList from '@/views/InfoList.vue'
import InfoTopic from '@/views/InfoTopic.vue'
import SupportMap from '@/views/SupportMap.vue'
import CourseBooking from '@/views/CourseBooking.vue'
import ResourcesList from '@/views/ResourcesList.vue'
import ResourceDetail from '@/views/ResourceDetail.vue'
import GetInvolved from '@/views/GetInvolved.vue'
import About from '@/views/About.vue'
import Contact from '@/views/Contact.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import Profile from '@/views/Profile.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import CourseManagement from '@/views/admin/CourseManagement.vue'
import UsersTable from '@/views/admin/UsersTable.vue'
import AppointmentsTable from '@/views/admin/AppointmentsTable.vue'

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
      path: '/support/map',
      name: 'SupportMap',
      component: SupportMap
    },
    {
      path: '/courses/book',
      name: 'CourseBooking',
      component: CourseBooking,
      meta: { requiresAuth: true }
    },
    {
      path: '/resources/list',
      name: 'ResourcesList',
      component: ResourcesList
    },
    {
      path: '/resources/:id',
      name: 'ResourceDetail',
      component: ResourceDetail
    },
    {
      path: '/involved',
      name: 'GetInvolved',
      component: GetInvolved
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
    {
      path: '/account',
      name: 'Profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: AdminDashboard,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/courses',
      name: 'CourseManagement',
      component: CourseManagement,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/users',
      name: 'UsersTable',
      component: UsersTable,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/appointments',
      name: 'AppointmentsTable',
      component: AppointmentsTable,
      meta: { requiresAdmin: true }
    }
  ]
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check auth requirements
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/auth/login')
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next('/')
  } else if (to.meta.guestOnly && authStore.isLoggedIn) {
    // Redirect logged-in users away from auth pages
    if (authStore.isAdmin) {
      next('/admin')
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router