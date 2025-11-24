<template>
    <div class="d-flex min-vh-100 bg-light">
        <!-- Sidebar -->
        <div class="sidebar bg-white shadow-sm border-end">
            <div class="p-4 text-center border-bottom">
                <h4 class="fw-bold text-pink mb-0">{{ authStore.salon?.name || 'My Salon' }}</h4>
                <small class="text-muted">Provider Dashboard</small>
            </div>

            <nav class="nav flex-column p-3">
                <router-link to="/provider/dashboard"
                    class="nav-link px-4 py-3 rounded-pill mb-2 d-flex align-items-center gap-3">
                    <i class="bi bi-speedometer2"></i> Dashboard
                </router-link>
                <router-link to="/provider/queue"
                    class="nav-link px-4 py-3 rounded-pill mb-2 d-flex align-items-center gap-3">
                    <i class="bi bi-clock-history"></i> Today's Queue
                </router-link>
                <router-link to="/provider/services"
                    class="nav-link px-4 py-3 rounded-pill mb-2 d-flex align-items-center gap-3">
                    <i class="bi bi-scissors"></i> Services
                </router-link>
                <router-link to="/provider/bookings"
                    class="nav-link px-4 py-3 rounded-pill mb-2 d-flex align-items-center gap-3">
                    <i class="bi bi-calendar-check"></i> All Bookings
                </router-link>
                <router-link to="/provider/earnings"
                    class="nav-link px-4 py-3 rounded-pill mb-2 d-flex align-items-center gap-3">
                    <i class="bi bi-currency-rupee"></i> Earnings
                </router-link>
            </nav>

            <div class="p-4 mt-auto border-top">
                <button @click="authStore.logout(); $router.push('/login')"
                    class="btn btn-outline-danger w-100 rounded-pill">
                    Logout
                </button>
            </div>
        </div>

        <!-- Main Content Area -->
        <div class="flex-grow-1 d-flex flex-column">
            <!-- Top Bar -->
            <div class="bg-white shadow-sm border-bottom sticky-top">
                <div class="container-fluid py-3 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">{{ pageTitle }}</h5>
                    <span class="badge bg-success fs-6 px-3">Open Now</span>
                </div>
            </div>

            <!-- Page Content -->
            <div class="flex-grow-1 overflow-auto bg-light">
                <div class="container-fluid py-4">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const $router = useRouter()
const authStore = useAuthStore()

// Dynamic page title from route.meta.title
const pageTitle = computed(() => {
    return (route.meta.title as string) || 'Dashboard'
})
</script>

<style scoped>
.sidebar {
    width: 280px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    overflow-y: auto;
}

.nav-link {
    color: #555;
    font-weight: 500;
    transition: all 0.3s;
}

.nav-link:hover,
.router-link-active {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(255, 107, 214, 0.3);
}

.text-pink {
    color: #ff6bd6;
}
</style>