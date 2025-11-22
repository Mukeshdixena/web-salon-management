<!-- src/views/provider/SalonManagement.vue -->
<template>
    <div class="container py-5">
        <div class="d-flex justify-content-between align-items-center mb-5">
            <div>
                <h1 class="fw-bold text-dark">Salon Management</h1>
                <p class="text-muted">Manage your services and queue</p>
            </div>
        </div>

        <div class="row g-5">
            <!-- Services Column -->
            <div class="col-lg-7">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="fw-bold">Services</h3>
                    <button @click="openServiceModal()" class="btn btn-pink rounded-pill px-4">
                        <i class="bi bi-plus-lg"></i> Add Service
                    </button>
                </div>

                <div class="row g-3">
                    <div v-for="service in services" :key="service.id" class="col-12">
                        <div class="card border-0 shadow-sm hover-shadow">
                            <div class="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="fw-bold mb-1">{{ service.name }}</h5>
                                    <p class="text-muted small mb-2">{{ service.description }}</p>
                                    <span class="text-primary">
                                        <i class="bi bi-clock"></i> {{ service.durationMinutes }} min
                                    </span>
                                    <span class="text-success fw-bold ms-3">$ {{ service.price }}</span>
                                </div>
                                <div>
                                    <button @click="editService(service)" class="btn btn-sm btn-outline-secondary me-2">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button @click="deleteService(service.id)" class="btn btn-sm btn-outline-danger">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Queue Column -->
            <div class="col-lg-5">
                <h3 class="fw-bold mb-4">Current Queue</h3>

                <div class="list-group">
                    <div v-for="appt in queue" :key="appt.id" class="list-group-item mb-3 border-0 shadow-sm rounded-3">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="fw-bold mb-1">{{ appt.customerName }}</h6>
                                <small class="text-muted">
                                    <i class="bi bi-telephone"></i> {{ appt.customerPhone }}
                                </small>
                                <p class="mb-1 small">{{ appt.service.name }}</p>
                                <small v-if="appt.status === 'WAITING'" class="text-warning">
                                    Est. wait: 15 min
                                </small>
                            </div>
                            <span :class="statusBadge(appt.status)">{{ statusText(appt.status) }}</span>
                        </div>

                        <div class="mt-3 d-grid d-md-flex gap-2">
                            <button v-if="appt.status === 'WAITING'" @click="startService(appt.id)"
                                class="btn btn-pink flex-fill">Start Service</button>
                            <button v-if="appt.status === 'IN_PROGRESS'" @click="completeService(appt.id)"
                                class="btn btn-success flex-fill">Complete</button>
                            <button @click="removeFromQueue(appt.id)"
                                class="btn btn-outline-secondary btn-sm">Remove</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Service Modal -->
        <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-pink text-white">
                        <h5 class="modal-title">{{ editingService ? 'Edit' : 'Add' }} Service</h5>
                        <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveService">
                            <div class="mb-3">
                                <label class="form-label">Name</label>
                                <input v-model="form.name" class="form-control" required />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea v-model="form.description" class="form-control" rows="2"></textarea>
                            </div>
                            <div class="row">
                                <div class="col-6 mb-3">
                                    <label class="form-label">Duration (minutes)</label>
                                    <input v-model.number="form.durationMinutes" type="number" class="form-control"
                                        required />
                                </div>
                                <div class="col-6 mb-3">
                                    <label class="form-label">Price ($)</label>
                                    <input v-model.number="form.price" type="number" step="0.01" class="form-control"
                                        required />
                                </div>
                            </div>
                            <div class="d-flex justify-content-end gap-2">
                                <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                                <button type="submit" class="btn btn-pink">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showModal" class="modal-backdrop fade show"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const services = ref([])
const queue = ref([])
const showModal = ref(false)
const editingService = ref<any>(null)

const form = ref({
    name: '', description: '', durationMinutes: 30, price: 0
})

onMounted(() => {
    loadServices()
    loadQueue()
})

const loadServices = async () => {
    const res = await api.get('/provider/services')
    services.value = res.data
}

const loadQueue = async () => {
    const res = await api.get('/provider/queue')
    queue.value = res.data
}

const openServiceModal = () => {
    editingService.value = null
    form.value = { name: '', description: '', durationMinutes: 30, price: 0 }
    showModal.value = true
}

const editService = (service: any) => {
    editingService.value = service
    form.value = { ...service }
    showModal.value = true
}

const saveService = async () => {
    if (editingService.value) {
        await api.put(`/provider/services/${editingService.value.id}`, form.value)
    } else {
        await api.post('/provider/services', form.value)
    }
    closeModal()
    loadServices()
}

const deleteService = async (id: number) => {
    if (confirm('Delete this service?')) {
        await api.delete(`/provider/services/${id}`)
        loadServices()
    }
}

const startService = async (id: number) => {
    await api.put(`/provider/queue/${id}/start`)
    loadQueue()
}

const completeService = async (id: number) => {
    await api.put(`/provider/queue/${id}/complete`)
    loadQueue()
}

const removeFromQueue = async (id: number) => {
    await api.delete(`/provider/queue/${id}`)
    loadQueue()
}

const closeModal = () => {
    showModal.value = false
}

const statusBadge = (status: string) => {
    return {
        'badge bg-warning text-dark': status === 'WAITING',
        'badge bg-pink': status === 'IN_PROGRESS',
        'badge bg-success': status === 'COMPLETED'
    }
}

const statusText = (status: string) => {
    return status === 'WAITING' ? 'waiting' : status === 'IN_PROGRESS' ? 'in progress' : 'completed'
}
</script>

<style scoped>
.btn-pink {
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    border: none;
    color: white;
}

.btn-pink:hover {
    background: linear-gradient(135deg, #ff5252, #ff6b6b);
    color: white;
}

.hover-shadow {
    transition: all 0.3s;
}

.hover-shadow:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.2) !important;
}
</style>