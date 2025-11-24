<template>
    <div class="container py-4">
        <h3 class="mb-4 fw-bold text-pink">Today's Queue</h3>

        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-pink"></div>
        </div>

        <div v-else-if="queue.length === 0" class="alert alert-info rounded-4">
            No appointments scheduled for today.
        </div>

        <div v-else class="row g-4">
            <div v-for="b in queue" :key="b.id" class="col-md-6">
                <div class="card h-100 border-0 shadow-sm rounded-4">
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="fw-bold">{{ b.service.name }}</h5>
                            <p class="mb-2 text-muted">
                                {{ b.customer.name }} • {{ b.time }}
                            </p>
                            <span :class="['badge px-3 py-2', statusBadge(b.status)]">
                                {{ formatStatus(b.status) }}
                            </span>
                        </div>
                        <div class="text-end">
                            <button v-if="b.status === 'PENDING'" class="btn btn-success btn-sm mb-2"
                                @click="accept(b.id)">
                                Accept
                            </button>
                            <button v-if="b.status === 'PENDING'" class="btn btn-danger btn-sm mb-2"
                                @click="reject(b.id)">
                                Reject
                            </button>
                            <button v-if="b.status === 'CONFIRMED'" class="btn btn-primary btn-sm" @click="start(b.id)">
                                Start Service
                            </button>
                            <button v-if="b.status === 'IN_PROGRESS'" class="btn btn-dark btn-sm"
                                @click="complete(b.id)">
                                Complete
                            </button>
                        </div>
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
    time: string
    status: string
    customer: { name: string }
    service: { name: string }
}

const queue = ref<Booking[]>([])
const loading = ref(true)

const staticQueue: Booking[] = [
    { id: 1, time: '10:30 AM', status: 'COMPLETED', customer: { name: 'Priya Sharma' }, service: { name: 'Hair Spa' } },
    { id: 2, time: '02:00 PM', status: 'IN_PROGRESS', customer: { name: 'Rohan Mehta' }, service: { name: 'Beard Trim' } },
    { id: 3, time: '03:30 PM', status: 'PENDING', customer: { name: 'Sneha Kapoor' }, service: { name: 'Facial' } }
]

const fetchQueue = async () => {
    try {
        const res = await api.get('/api/provider/bookings/today')
        queue.value = res.data?.length ? res.data : staticQueue
    } catch (err) {
        console.warn('Queue API failed → using static')
        queue.value = staticQueue
    } finally {
        loading.value = false
    }
}

const accept = async (id: number) => { alert('Accepted: ' + id); fetchQueue() }
const reject = async (id: number) => { if (confirm('Reject?')) fetchQueue() }
const start = async (id: number) => { alert('Started!'); fetchQueue() }
const complete = async (id: number) => { alert('Completed!'); fetchQueue() }

const statusBadge = (s: string) => {
    const map: Record<string, string> = {
        PENDING: 'bg-warning text-dark',
        CONFIRMED: 'bg-info text-white',
        IN_PROGRESS: 'bg-primary text-white',
        COMPLETED: 'bg-success text-white',
        CANCELLED: 'bg-danger text-white'
    }
    return map[s] || 'bg-secondary'
}

const formatStatus = (s: string) => s.replace('_', ' ')

onMounted(fetchQueue)
</script>