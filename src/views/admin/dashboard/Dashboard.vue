<template>
    <div>
        <div class="row g-4">
            <div class="col-md-3">
                <div class="card bg-dark border-pink text-white p-4 rounded-4 shadow">
                    <h3 class="fw-bold">₹{{ stats.totalRevenue }}</h3>
                    <p>Total Revenue</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-dark border-success text-white p-4 rounded-4 shadow">
                    <h3 class="fw-bold">{{ stats.totalBookings }}</h3>
                    <p>Total Bookings</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-dark border-warning text-white p-4 rounded-4 shadow">
                    <h3 class="fw-bold">{{ stats.totalSalons }}</h3>
                    <p>Active Salons</p>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card bg-dark border-info text-white p-4 rounded-4 shadow">
                    <h3 class="fw-bold">{{ stats.pendingSalons }}</h3>
                    <p>Pending Approval</p>
                </div>
            </div>
        </div>

        <h3 class="mt-5 fw-bold">Recent Bookings</h3>
        <div class="table-responsive">
            <table class="table table-dark table-hover">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Salon</th>
                        <th>Service</th>
                        <th>Date</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="b in recentBookings" :key="b.id">
                        <td>{{ b.customerName }}</td>
                        <td>{{ b.salonName }}</td>
                        <td>{{ b.serviceName }}</td>
                        <td>{{ formatDate(b.date) }}</td>
                        <td class="text-pink fw-bold">₹{{ b.price }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const stats = ref({ totalRevenue: 0, totalBookings: 0, totalSalons: 0, pendingSalons: 0 })
const recentBookings = ref<any[]>([])

const formatDate = (d: string) => new Date(d).toLocaleDateString()

onMounted(async () => {
    const [s, b] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/recent-bookings')
    ])
    stats.value = s.data
    recentBookings.value = b.data
})
</script>

<style scoped>
.border-pink {
    border: 3px solid #ff6bd6 !important;
}

.border-success {
    border: 3px solid #28a745 !important;
}

.border-warning {
    border: 3px solid #ffc107 !important;
}

.border-info {
    border: 3px solid #17a2b8 !important;
}
</style>