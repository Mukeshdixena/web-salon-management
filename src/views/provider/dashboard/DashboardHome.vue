<template>
    <div>
        <h2 class="fw-bold mb-4">Welcome back, {{ providerStore.salon?.name }}!</h2>

        <!-- Stats Cards -->
        <div class="row g-4 mb-5">
            <div class="col-md-3">
                <div class="card border-0 shadow-sm rounded-4 text-center p-4 hover-lift">
                    <i class="bi bi-calendar-check fs-1 text-pink mb-3"></i>
                    <h3 class="fw-bold">{{ stats.todayBookings }}</h3>
                    <p class="text-muted">Today's Bookings</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-0 shadow-sm rounded-4 text-center p-4 hover-lift">
                    <i class="bi bi-clock-history fs-1 text-success mb-3"></i>
                    <h3 class="fw-bold">{{ stats.inProgress }}</h3>
                    <p class="text-muted">In Progress</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-0 shadow-sm rounded-4 text-center p-4 hover-lift">
                    <i class="bi bi-currency-rupee fs-1 text-warning mb-3"></i>
                    <h3 class="fw-bold">₹{{ stats.todayEarnings }}</h3>
                    <p class="text-muted">Today's Earnings</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card border-0 shadow-sm rounded-4 text-center p-4 hover-lift">
                    <i class="bi bi-star-fill fs-1 text-primary mb-3"></i>
                    <h3 class="fw-bold">{{ stats.rating || '4.8' }}</h3>
                    <p class="text-muted">Average Rating</p>
                </div>
            </div>
        </div>

        <!-- Next 3 Bookings -->
        <h4 class="fw-bold mb-3">Next Up</h4>
        <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body">
                <div v-for="b in nextBookings" :key="b.id"
                    class="d-flex align-items-center py-3 border-bottom last:border-0">
                    <div class="me-3">
                        <div class="bg-pink text-white rounded-circle d-flex align-items-center justify-content-center"
                            style="width:50px;height:50px;">
                            {{ b.customerName.charAt(0) }}
                        </div>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1">{{ b.customerName }}</h6>
                        <p class="text-muted small mb-0">{{ b.serviceName }} • {{ b.time }}</p>
                    </div>
                    <span class="badge" :class="b.status === 'pending' ? 'bg-warning' : 'bg-success'">
                        {{ b.status }}
                    </span>
                </div>
                <div v-if="nextBookings.length === 0" class="text-center py-4 text-muted">
                    No upcoming bookings today
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProviderStore } from '@/stores/provider'
import api from '@/api'

const providerStore = useProviderStore()
const stats = ref({
    todayBookings: 0,
    inProgress: 0,
    todayEarnings: 0,
    rating: '4.8'
})
const nextBookings = ref<any[]>([])

const loadData = async () => {
    const [statsRes, queueRes] = await Promise.all([
        api.get('/api/provider/stats'),
        api.get('/api/provider/today-queue')
    ])
    stats.value = statsRes.data
    nextBookings.value = queueRes.data.slice(0, 5)
}

onMounted(loadData)
</script>

<style scoped>
.hover-lift {
    transition: all 0.3s;
}

.hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
}

.bg-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab) !important;
}
</style>