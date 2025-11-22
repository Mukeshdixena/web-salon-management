<template>
    <div>
        <h2 class="fw-bold mb-4">All Bookings</h2>
        <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="b in bookings" :key="b.id">
                                <td>{{ b.customerName }}</td>
                                <td>{{ b.serviceName }}</td>
                                <td>{{ formatDate(b.date) }} at {{ b.time }}</td>
                                <td>
                                    <span class="badge" :class="statusClass(b.status)">
                                        {{ b.status }}
                                    </span>
                                </td>
                                <td class="fw-bold text-pink">₹{{ b.price }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const bookings = ref<any[]>([])

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN')
const statusClass = (s: string) => {
    return s === 'completed' ? 'bg-success' : s === 'cancelled' ? 'bg-danger' : 'bg-warning'
}

onMounted(async () => {
    const res = await api.get('/api/provider/bookings')
    bookings.value = res.data
})
</script>