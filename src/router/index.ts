// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

// PUBLIC ROUTES
const Home = () => import('@/views/public/Home.vue')
const SalonDetail = () => import('@/views/public/SalonDetail.vue')
const BookingConfirm = () => import('@/views/public/BookingConfirm.vue')
const BookingSuccess = () => import('@/views/public/BookingSuccess.vue')

// CUSTOMER AUTH
const CustomerLogin = () => import('@/views/customer/auth/Login.vue')
const CustomerRegister = () => import('@/views/customer/auth/Register.vue')

// PROVIDER
const ProviderLayout = () => import('@/views/provider/ProviderLayout.vue')
const ProviderLogin = () => import('@/views/provider/auth/Login.vue')
const ProviderRegister = () => import('@/views/provider/auth/Register.vue')

// Provider Pages
const ProviderDashboardHome = () => import('@/views/provider/dashboard/DashboardHome.vue')
const ProviderQueue = () => import('@/views/provider/queue/Queue.vue')
const ProviderServices = () => import('@/views/provider/services/Services.vue')
const ProviderBookings = () => import('@/views/provider/bookings/Bookings.vue')
const ProviderEarnings = () => import('@/views/provider/earnings/Earnings.vue')

// ADMIN
const AdminLayout = () => import('@/views/admin/AdminLayout.vue')
const AdminLogin = () => import('@/views/admin/auth/Login.vue')
const AdminDashboard = () => import('@/views/admin/dashboard/Dashboard.vue')
const AdminSalons = () => import('@/views/admin/salons/SalonsList.vue')
const AdminRevenue = () => import('@/views/admin/revenue/Revenue.vue')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // Customer-Facing
        { path: '/', component: Home },
        { path: '/salon/:id', component: SalonDetail },
        { path: '/booking/confirm', component: BookingConfirm },
        { path: '/booking/success', component: BookingSuccess },

        // Customer Auth
        { path: '/customer/login', component: CustomerLogin },
        { path: '/customer/signup', component: CustomerRegister },

        // Provider Auth
        { path: '/provider/login', component: ProviderLogin },
        { path: '/provider/register', component: ProviderRegister },

        // Provider Dashboard (Protected)
        {
            path: '/provider',
            component: ProviderLayout,
            meta: { requiresProvider: true },
            children: [
                { path: 'dashboard', component: ProviderDashboardHome, meta: { title: 'Dashboard' } },
                { path: 'queue', component: ProviderQueue, meta: { title: "Today's Queue" } },
                { path: 'services', component: ProviderServices, meta: { title: 'Services' } },
                { path: 'bookings', component: ProviderBookings, meta: { title: 'All Bookings' } },
                { path: 'earnings', component: ProviderEarnings, meta: { title: 'Earnings' } },
                { path: '', redirect: 'dashboard' }
            ]
        },

        // Admin Auth
        { path: '/admin/login', component: AdminLogin },

        // Admin Panel (Protected)
        {
            path: '/admin',
            component: AdminLayout,
            meta: { requiresAdmin: true },
            children: [
                { path: 'dashboard', component: AdminDashboard, meta: { title: 'Admin Dashboard' } },
                { path: 'salons', component: AdminSalons, meta: { title: 'Salons Management' } },
                { path: 'revenue', component: AdminRevenue, meta: { title: 'Revenue' } },
                { path: '', redirect: 'dashboard' }
            ]
        },

        // Fallback
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
})

// Global Auth Guard
router.beforeEach((to, from, next) => {
    const providerToken = localStorage.getItem('provider_token')
    const adminToken = localStorage.getItem('admin_token')

    if (to.meta.requiresProvider && !providerToken) {
        next('/provider/login')
    } else if (to.meta.requiresAdmin && !adminToken) {
        next('/admin/login')
    } else {
        next()
    }
})

export default router