import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuth } from '@/composables/useAuth'
import { useUserStore } from '@/stores/userStore'

const isAuth = async (to, from, next) => {
  const { getSession } = useAuth()
  const userStore = useUserStore()
  const session = await getSession()
  if (!session) {
    next({ name: 'login' })
  }

  userStore.setUser(session.user)

  let userProfile = userStore.profile

  if (!userProfile) {
    try {
      userProfile = await userStore.getProfile()
    } catch (error) {
      userProfile = null
    }
  }

  if (!userProfile) {
    if (to.name !== 'createProfile') {
      next({ name: 'createProfile' })
    } else {
      next()
    }
  } else {
    next()
  }
}

const isLoginAuth = async (to, from, next) => {
  const { getSession } = useAuth()
  const session = await getSession()
  if (session) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
}

const isCreateProfile = async (to, from, next) => {
  const { getSession } = useAuth()
  const userStore = useUserStore()
  const session = await getSession()
  if (!session) {
    next({ name: 'login' })
    return
  }
  userStore.setUser(session.user)
  let userProfile = userStore.profile
  if (!userProfile) {
    try {
      userProfile = await userStore.getProfile()
    } catch (error) {
      userProfile = null
    }
  }
  // Si ya tiene perfil, redirige a /dashboard
  if (userProfile) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
}

const isDirector = async (to, from, next) => {
  const { getSession } = useAuth()
  const userStore = useUserStore()
  const session = await getSession()
  if (!session) {
    next({ name: 'login' })
    return
  }

  const hasRole = await userStore.hasRole('Director')
  if (hasRole) {
    next()
  } else {
    next({ name: 'dashboard' })
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { showSidebar: false },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: { showSidebar: false },
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue'),
      meta: { showSidebar: false },
      beforeEnter: isLoginAuth,
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RegisterView.vue'),
      meta: { showSidebar: false },
      beforeEnter: isLoginAuth,
    },
    {
      path: '/createProfile',
      name: 'createProfile',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/createProfileView.vue'),
      meta: { showSidebar: false },
      beforeEnter: isCreateProfile,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DashboardView.vue'),
      meta: { showSidebar: true },
      beforeEnter: isAuth,
    },
    {
      path: '/request-event',
      name: 'request-event',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RequestEventView.vue'),
      meta: { showSidebar: true },
      beforeEnter: isAuth,
    },
    {
      path: '/inbox',
      name: 'inbox',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/InboxView.vue'),
      meta: { showSidebar: true },
      beforeEnter: isDirector,
    },
    {
      path: '/modify-event',
      name: 'modify-event',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ModifyEventView.vue'),
      meta: { showSidebar: true },
      beforeEnter: isDirector,
    },
    {
      path: '/delete-event',
      name: 'delete-event',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/DeleteEventView.vue'),
      meta: { showSidebar: true },
      beforeEnter: isDirector,
    },
    {
      path: '/calendar',
      name: 'calendar',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/CalendarView.vue'),
      meta: { showSidebar: true },
      beforeEnter: isAuth,
    },
    {
      path: '/users-search',
      name: 'users-search',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/UsersView.vue'),
      meta: { showSidebar: true },
      beforeEnter: isDirector,
    },
    {
      path: '/profile',
      name: 'profile',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ProfileView.vue'),
      meta: { showSidebar: true },
      beforeEnter: isAuth,
    },
  ],
})

export default router
