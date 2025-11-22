<template>
    <div class="d-flex min-vh-100 bg-light">
        <!-- Sidebar -->
        <div class="sidebar bg-white shadow-sm border-end">
            <div class="p-4 text-center border-bottom">
                <h4 class="fw-bold text-pink mb-0">{{ providerStore.salon?.name || 'My Salon' }}</h4>
                <small class="text-muted">Provider Dashboard</small>
            </div>
            <nav class="nav flex-column p-3">
                <router-link to="/provider/dashboard" class="nav-link px-4 py-3 rounded-pill mb-2">
                    <i class="bi bi-speedometer2 me-3"></i> Dashboard
                </router-link>
                <router-link to="/provider/queue" class="nav-link px-4 py-3 rounded-pill mb-2">
                    <i class="bi bi-clock-history me-3"></i> Today's Queue
                </router-link>
                <router-link to="/provider/services" class="nav-link px-4 py-3 rounded-pill mb-2">
                    <i class="bi bi-scissors me-3"></i> Services
                </router-link>
                <router-link to="/provider/bookings" class="nav-link px-4 py-3 rounded-pill mb-2">
                    <i class="bi bi-calendar-check me-3"></i> All Bookings
                </router-link>
                <router-link to="/provider/earnings" class="nav-link px-4 py-3 rounded-pill mb-2">
                    <i class="bi bi-currency-rupee me-3"></i> Earnings
                </router-link>
            </nav>
            <div class="p-4 mt-auto border-top">
                <button @click="providerStore.logout(); $router.push('/provider/login')"
                    class="btn btn-outline-danger w-100 rounded-pill">
                    Logout
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-grow-1 overflow-auto">
            <div class="bg-white shadow-sm border-bottom sticky-top">
                <div class="container-fluid py-3 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">{{ route.meta.title || 'Dashboard' }}</h5>
                    <span class="badge bg-success fs-6">Open Now</span>
                </div>
            </div>
            <div class="container-fluid py-4">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useProviderStore } from '@/stores/provider'
import { useRoute, useRouter } from 'vue-router'

const providerStore = useProviderStore()
const route = useRoute()
const $router = useRouter()
</script>

<style scoped>
.sidebar {
    width: 280px;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
}

.nav-link {
    color: #555;
    font-weight: 500;
}

.nav-link:hover,
.router-link-active {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab);
    color: white !important;
}

.text-pink {
    color: #ff6bd6;
}
</style>