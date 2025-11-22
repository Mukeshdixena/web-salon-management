// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: () => import('@/views/public/Home.vue') },
        { path: '/login', component: () => import('@/views/auth/Login.vue') },
        {
            path: '/provider/dashboard',
            component: () => import('@/views/provider/Dashboard.vue'),
            meta: { requiresAuth: true, role: 'PROVIDER' }
        },
        {
            path: '/admin/dashboard',
            component: () => import('@/views/admin/Dashboard.vue'),
            meta: { requiresAuth: true, role: 'ADMIN' }
        },
        // Add this route
        {
            path: '/register',
            component: () => import('@/views/auth/Register.vue')
        },
    ]
})

// Global guard — protects provider & admin routes
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (to.meta.requiresAuth) {
        if (!token) return next('/login')
        if (to.meta.role && role !== to.meta.role) return next('/')
    }
    next()
})

export default router