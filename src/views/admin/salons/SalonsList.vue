<template>
    <div>
        <h2 class="fw-bold mb-4">All Salons ({{ salons.length }})</h2>

        <div class="row g-4">
            <div v-for="salon in salons" :key="salon.id" class="col-md-6">
                <div class="card bg-dark text-white border-0 shadow rounded-4 overflow-hidden">
                    <div class="row g-0">
                        <div class="col-4">
                            <img :src="salon.image" class="img-fluid h-100" style="object-fit: cover;">
                        </div>
                        <div class="col-8 p-4">
                            <h5 class="fw-bold">{{ salon.name }}</h5>
                            <p class="text-muted small">{{ salon.address }}</p>
                            <p><strong>Owner:</strong> {{ salon.ownerName }}</p>
                            <div v-if="salon.status === 'pending'" class="d-flex gap-2">
                                <button @click="approve(salon.id)" class="btn btn-success btn-sm rounded-pill">
                                    Approve
                                </button>
                                <button @click="reject(salon.id)" class="btn btn-danger btn-sm rounded-pill">
                                    Reject
                                </button>
                            </div>
                            <span v-else class="badge"
                                :class="salon.status === 'approved' ? 'bg-success' : 'bg-danger'">
                                {{ salon.status }}
                            </span>
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

const salons = ref<any[]>([])

const loadSalons = async () => {
    const res = await api.get('/api/admin/salons')
    salons.value = res.data
}

const approve = async (id: number) => {
    await api.post(`/api/admin/salons/${id}/approve`)
    loadSalons()
}

const reject = async (id: number) => {
    await api.post(`/api/admin/salons/${id}/reject`)
    loadSalons()
}

onMounted(loadSalons)
</script>