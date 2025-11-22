<template>
    <div class="p-4">
        <h3 class="mb-4">Today’s Queue</h3>

        <div v-if="loading" class="text-center py-4">
            Loading bookings...
        </div>

        <div v-else-if="bookings.length === 0" class="alert alert-info">
            No bookings for today.
        </div>

        <div v-else class="list-group">

            <div v-for="b in bookings" :key="b.id" class="list-group-item py-3">
                <div class="d-flex justify-content-between">

                    <div>
                        <h5 class="fw-bold">{{ b.service.name }}</h5>
                        <p class="mb-1">
                            Customer: {{ b.customer.name }}<br />
                            Time: {{ b.time }}
                        </p>

                        <span :class="['badge', statusBadge(b.status)]">
                            {{ b.status }}
                        </span>
                    </div>

                    <div class="d-flex flex-column gap-2">

                        <button v-if="b.status === 'PENDING'" class="btn btn-sm btn-success" @click="accept(b.id)">
                            Accept
                        </button>

                        <button v-if="b.status === 'PENDING'" class="btn btn-sm btn-danger" @click="reject(b.id)">
                            Reject
                        </button>

                        <button v-if="b.status === 'CONFIRMED'" class="btn btn-sm btn-primary" @click="start(b.id)">
                            Start
                        </button>

                        <button v-if="b.status === 'IN_PROGRESS'" class="btn btn-sm btn-dark" @click="complete(b.id)">
                            Complete
                        </button>

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

const bookings = ref<Booking[]>([])
const loading = ref(false)

const fetchQueue = async () => {
    loading.value = true
    try {
        const res = await api.get('/api/provider/bookings/today')
        bookings.value = res.data
    } catch (e) {
        console.error(e)
    } finally {
        loading.value = false
    }
}

onMounted(fetchQueue)

const accept = async (id: number) => {
    await api.post(`/api/provider/bookings/${id}/accept`)
    fetchQueue()
}

const reject = async (id: number) => {
    await api.post(`/api/provider/bookings/${id}/reject`)
    fetchQueue()
}

const start = async (id: number) => {
    await api.post(`/api/provider/bookings/${id}/start`)
    fetchQueue()
}

const complete = async (id: number) => {
    await api.post(`/api/provider/bookings/${id}/complete`)
    fetchQueue()
}

const statusBadge = (status: string) => {
    switch (status) {
        case 'PENDING': return 'bg-warning text-dark'
        case 'CONFIRMED': return 'bg-info text-dark'
        case 'IN_PROGRESS': return 'bg-primary'
        case 'COMPLETED': return 'bg-success'
        case 'CANCELLED': return 'bg-danger'
        default: return 'bg-secondary'
    }
}
</script>

<style scoped>
.list-group-item {
    border-radius: 10px;
    margin-bottom: 10px;
    border: 1px solid #eee;
}
</style>
