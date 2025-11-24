// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const Home = () => import('@/views/public/Home.vue')
const SalonDetail = () => import('@/views/public/SalonDetail.vue')
const BookingConfirm = () => import('@/views/public/BookingConfirm.vue')
const BookingSuccess = () => import('@/views/public/BookingSuccess.vue')

const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')

const MyBookings = () => import('@/views/customer/bookings/MyBookings.vue')

const ProviderLayout = () => import('@/views/provider/ProviderLayout.vue')
const ProviderDashboardHome = () => import('@/views/provider/dashboard/DashboardHome.vue')
const ProviderQueue = () => import('@/views/provider/queue/Queue.vue')
const ProviderServices = () => import('@/views/provider/services/Services.vue')
const ProviderBookings = () => import('@/views/provider/bookings/Bookings.vue')
const ProviderEarnings = () => import('@/views/provider/earnings/Earnings.vue')

const AdminLayout = () => import('@/views/admin/AdminLayout.vue')
const AdminDashboard = () => import('@/views/admin/dashboard/Dashboard.vue')
const AdminSalons = () => import('@/views/admin/salons/SalonsList.vue')
const AdminRevenue = () => import('@/views/admin/revenue/Revenue.vue')

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior() {
        return { top: 0 }
    },
    routes: [
        { path: '/', name: 'home', component: Home },
        { path: '/salon/:id', name: 'salon-detail', component: SalonDetail },
        { path: '/booking/confirm', name: 'booking-confirm', component: BookingConfirm },
        { path: '/booking/success', name: 'booking-success', component: BookingSuccess },

        { path: '/login', name: 'login', component: Login },
        { path: '/register', name: 'register', component: Register },

        {
            path: '/customer/bookings',
            name: 'customer-bookings',
            component: MyBookings,
            meta: { requiresAuth: true, allowedRoles: ['CUSTOMER'] as const }
        },

        // src/router/index.ts → Replace the whole /provider block with this:
        {
            path: '/provider',
            component: () => import('@/views/provider/ProviderLayout.vue'),
            meta: { requiresAuth: true, allowedRoles: ['PROVIDER'] as const },
            children: [
                { path: '', redirect: { name: 'provider-dashboard' } },

                {
                    path: 'dashboard',
                    name: 'provider-dashboard',
                    component: () => import('@/views/provider/dashboard/DashboardHome.vue'),
                    meta: { title: 'Dashboard' }
                },
                {
                    path: 'queue',
                    name: 'provider-queue',
                    component: () => import('@/views/provider/queue/Queue.vue'),
                    meta: { title: "Today's Queue" }
                },
                {
                    path: 'services',
                    name: 'provider-services',
                    component: () => import('@/views/provider/services/Services.vue'),
                    meta: { title: 'Services' }
                },
                {
                    path: 'bookings',
                    name: 'provider-bookings',
                    component: () => import('@/views/provider/bookings/Bookings.vue'),
                    meta: { title: 'All Bookings' }
                },
                {
                    path: 'earnings',
                    name: 'provider-earnings',
                    component: () => import('@/views/provider/earnings/Earnings.vue'),
                    meta: { title: 'Earnings' }
                }
            ]
        },

        {
            path: '/admin',
            component: AdminLayout,
            meta: { requiresAuth: true, allowedRoles: ['ADMIN'] as const },
            children: [
                { path: '', redirect: { name: 'admin-dashboard' } },
                { path: 'dashboard', name: 'admin-dashboard', component: AdminDashboard },
                { path: 'salons', name: 'admin-salons', component: AdminSalons },
                { path: 'revenue', name: 'admin-revenue', component: AdminRevenue }
            ]
        },

        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
})

// GLOBAL GUARD — 100% TypeScript clean
router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    // Restore session on page refresh
    if (!authStore.isAuthenticated && localStorage.getItem('token')) {
        try {
            await authStore.initialize()
        } catch {
            authStore.logout()
        }
    }

    const isAuthenticated = authStore.isAuthenticated
    const userRole = authStore.role // ← This is now safely typed as UserRole | null

    // 1. Not logged in + trying to access protected route
    if (to.meta.requiresAuth && !isAuthenticated) {
        const firstAllowedRole = (to.meta.allowedRoles as readonly string[] | undefined)?.[0]
        const roleHint = firstAllowedRole?.toLowerCase() ?? 'customer'

        return next({
            path: '/login',
            query: { role: roleHint, redirect: to.fullPath }
        })
    }

    // 2. Wrong role for current route
    const allowedRoles = to.meta.allowedRoles as readonly string[] | undefined
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        if (userRole === 'ADMIN') return next('/admin/dashboard')
        if (userRole === 'PROVIDER') return next('/provider/dashboard')
        if (userRole === 'CUSTOMER') return next('/customer/bookings')
        return next('/')
    }

    // 3. Already logged in → block login/register pages
    if (isAuthenticated && ['login', 'register'].includes(to.name as string)) {
        if (userRole === 'ADMIN') return next('/admin/dashboard')
        if (userRole === 'PROVIDER') return next('/provider/dashboard')
        if (userRole === 'CUSTOMER') return next('/customer/bookings')
        return next('/')
    }

    next()
})

export default router