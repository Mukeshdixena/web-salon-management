<template>
    <div class="container py-4">
        <h2 class="fw-bold mb-4 text-pink">All Bookings</h2>

        <div class="card border-0 shadow rounded-4 overflow-hidden">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>#</th>
                                <th>Customer</th>
                                <th>Service</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(b, i) in bookings" :key="b.id">
                                <td>{{ i + 1 }}</td>
                                <td class="fw-medium">{{ b.customerName }}</td>
                                <td>{{ b.serviceName }}</td>
                                <td>{{ formatDate(b.date) }} at {{ b.time }}</td>
                                <td>
                                    <span class="badge px-3 py-2" :class="statusClass(b.status)">
                                        {{ formatStatus(b.status) }}
                                    </span>
                                </td>
                                <td class="fw-bold text-pink">₹{{ b.price.toLocaleString('en-IN') }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="bookings.length === 0" class="text-center py-5 text-muted">
                        No bookings found.
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

interface Booking {
    id: number
    customerName: string
    serviceName: string
    date: string
    time: string
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
    price: number
}

const bookings = ref<Booking[]>([])

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short'
})

const formatStatus = (s: string) => s.charAt(0) + s.slice(1).toLowerCase()

const statusClass = (s: string) => {
    switch (s) {
        case 'COMPLETED': return 'bg-success text-white'
        case 'CANCELLED': return 'bg-danger text-white'
        case 'PENDING': return 'bg-warning text-dark'
        default: return 'bg-info text-white'
    }
}

// Static fallback data
const staticBookings: Booking[] = [
    { id: 1, customerName: 'Priya Sharma', serviceName: 'Hair Spa + Cut', date: '2025-11-20', time: '10:30 AM', status: 'COMPLETED', price: 1800 },
    { id: 2, customerName: 'Rohan Mehta', serviceName: 'Beard Trim', date: '2025-11-21', time: '02:00 PM', status: 'COMPLETED', price: 600 },
    { id: 3, customerName: 'Sneha Kapoor', serviceName: 'Facial', date: '2025-11-22', time: '03:30 PM', status: 'PENDING', price: 2500 },
    { id: 4, customerName: 'Kavya Singh', serviceName: 'Hair Coloring', date: '2025-11-23', time: '05:00 PM', status: 'CONFIRMED', price: 4500 }
]

onMounted(async () => {
    try {
        const res = await api.get('/api/provider/bookings')
        bookings.value = res.data?.length ? res.data : staticBookings
    } catch (err) {
        console.warn('API failed → using static bookings')
        bookings.value = staticBookings
    }
})
</script>