<template>
    <div class="d-flex min-vh-100 bg-dark text-white">
        <!-- Sidebar -->
        <div class="sidebar bg-black border-end border-secondary" style="width: 280px;">
            <div class="p-4 text-center border-bottom border-secondary">
                <h3 class="fw-bold text-pink">BeautyBook <small class="text-muted fs-6">Admin</small></h3>
            </div>
            <nav class="nav flex-column p-3">
                <router-link to="/admin/dashboard" class="nav-link text-white py-3 px-4 rounded mb-2">
                    Dashboard
                </router-link>
                <router-link to="/admin/salons" class="nav-link text-white py-3 px-4 rounded mb-2">
                    Salons
                </router-link>
                <router-link to="/admin/providers" class="nav-link text-white py-3 px-4 rounded mb-2">
                    Providers
                </router-link>
                <router-link to="/admin/bookings" class="nav-link text-white py-3 px-4 rounded mb-2">
                    All Bookings
                </router-link>
                <router-link to="/admin/revenue" class="nav-link text-white py-3 px-4 rounded mb-2">
                    Revenue
                </router-link>
            </nav>
            <div class="p-4 mt-auto">
                <button @click="adminStore.logout(); $router.push('/admin/login')"
                    class="btn btn-outline-light w-100 rounded-pill">
                    Logout
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-grow-1 overflow-auto">
            <div class="bg-gradient-pink text-white py-4 px-5 shadow-sm">
                <h2 class="fw-bold mb-0">{{ route.meta.title || 'Admin Panel' }}</h2>
            </div>
            <div class="p-5">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '@/stores/admin'
import { useRoute, useRouter } from 'vue-router'

const adminStore = useAdminStore()
const route = useRoute()
const $router = useRouter()

const navLinkActive = (path: string) => route.path === path ? 'bg-pink text-white' : ''
</script>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
}

.nav-link:hover,
.router-link-active {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab) !important;
    color: white !important;
}

.bg-gradient-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab);
}
</style>