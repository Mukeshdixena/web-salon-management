<template>
    <div>
        <h2 class="fw-bold mb-4">Today's Queue</h2>

        <div class="row g-4">
            <div v-for="booking in queue" :key="booking.id" class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="card-header bg-pink text-white py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">{{ booking.customerName }}</h6>
                            <span class="badge bg-white text-pink fw-bold">{{ booking.time }}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <p class="mb-2"><strong>Service:</strong> {{ booking.serviceName }}</p>
                        <p class="mb-3 text-muted small">Phone: {{ booking.customerPhone }}</p>

                        <div class="d-flex gap-2">
                            <button @click="startService(booking.id)" :disabled="booking.status === 'in-progress'"
                                class="btn btn-success btn-sm rounded-pill px-4">
                                Start Service
                            </button>
                            <button @click="completeService(booking.id)" :disabled="booking.status !== 'in-progress'"
                                class="btn btn-pink btn-sm rounded-pill px-4">
                                Complete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="queue.length === 0" class="text-center py-5">
            <p class="text-muted fs-4">No bookings today yet — relax!</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const queue = ref<any[]>([])

const fetchQueue = async () => {
    const res = await api.get('/api/provider/today-queue')
    queue.value = res.data
}

const startService = async (id: number) => {
    await api.post(`/api/provider/booking/${id}/start`)
    fetchQueue()
}

const completeService = async (id: number) => {
    await api.post(`/api/provider/booking/${id}/complete`)
    fetchQueue()
}

onMounted(fetchQueue)
</script>

<style scoped>
.bg-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab) !important;
}
</style>