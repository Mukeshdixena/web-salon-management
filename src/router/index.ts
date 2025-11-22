import { createRouter, createWebHistory } from 'vue-router'

// PUBLIC ROUTES
const Home = () => import('@/views/public/Home.vue')
const SalonDetail = () => import('@/views/public/SalonDetail.vue')
const BookingConfirm = () => import('@/views/public/BookingConfirm.vue')
const BookingSuccess = () => import('@/views/public/BookingSuccess.vue')

// UNIFIED AUTH
const Login = () => import('@/views/auth/Login.vue')
const Register = () => import('@/views/auth/Register.vue')

// CUSTOMER
const MyBookings = () => import('@/views/customer/bookings/MyBookings.vue')

// PROVIDER
const ProviderLayout = () => import('@/views/provider/ProviderLayout.vue')
const ProviderDashboardHome = () => import('@/views/provider/dashboard/DashboardHome.vue')
const ProviderQueue = () => import('@/views/provider/queue/Queue.vue')
const ProviderServices = () => import('@/views/provider/services/Services.vue')
const ProviderBookings = () => import('@/views/provider/bookings/Bookings.vue')
const ProviderEarnings = () => import('@/views/provider/earnings/Earnings.vue')

// ADMIN
const AdminLayout = () => import('@/views/admin/AdminLayout.vue')
const AdminDashboard = () => import('@/views/admin/dashboard/Dashboard.vue')
const AdminSalons = () => import('@/views/admin/salons/SalonsList.vue')
const AdminRevenue = () => import('@/views/admin/revenue/Revenue.vue')


const router = createRouter({
    history: createWebHistory(),

    routes: [

        // ----------------------
        // PUBLIC
        // ----------------------
        { path: '/', component: Home },
        { path: '/salon/:id', component: SalonDetail },
        { path: '/booking/confirm', component: BookingConfirm },
        { path: '/booking/success', component: BookingSuccess },

        // ----------------------
        // UNIFIED AUTH
        // ----------------------
        { path: '/login', component: Login },
        { path: '/register', component: Register },

        // ----------------------
        // CUSTOMER (Protected)
        // ----------------------
        {
            path: '/customer/bookings',
            component: MyBookings,
            meta: { requiresAuth: true, role: 'CUSTOMER' }
        },

        // ----------------------
        // PROVIDER (Protected)
        // ----------------------
        {
            path: '/provider',
            component: ProviderLayout,
            meta: { requiresAuth: true, role: 'PROVIDER' },
            children: [
                { path: 'dashboard', component: ProviderDashboardHome },
                { path: 'queue', component: ProviderQueue },
                { path: 'services', component: ProviderServices },
                { path: 'bookings', component: ProviderBookings },
                { path: 'earnings', component: ProviderEarnings },
                { path: '', redirect: 'dashboard' }
            ]
        },

        // ----------------------
        // ADMIN (Protected)
        // ----------------------
        {
            path: '/admin',
            component: AdminLayout,
            meta: { requiresAuth: true, role: 'ADMIN' },
            children: [
                { path: 'dashboard', component: AdminDashboard },
                { path: 'salons', component: AdminSalons },
                { path: 'revenue', component: AdminRevenue },
                { path: '', redirect: 'dashboard' }
            ]
        },

        // FALLBACK
        { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
})


// ---------------------------------
// GLOBAL AUTH GUARD (FINAL & FIXED)
// ---------------------------------

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (to.meta.requiresAuth) {

        // No token → redirect to correct login page
        if (!token) {
            if (to.meta.role === 'ADMIN') return next('/login?role=admin')
            if (to.meta.role === 'PROVIDER') return next('/login?role=provider')
            return next('/login?role=customer')
        }

        // Wrong role
        if (to.meta.role !== role) {
            if (role === 'ADMIN') return next('/admin/dashboard')
            if (role === 'PROVIDER') return next('/provider/dashboard')
            if (role === 'CUSTOMER') return next('/customer/bookings')
            return next('/')
        }
    }

    next()
})

export default router
