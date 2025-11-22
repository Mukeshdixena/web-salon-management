<template>
    <div>
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold">Services</h2>
            <button @click="showAddModal = true" class="btn btn-pink rounded-pill px-4">
                <i class="bi bi-plus-lg"></i> Add Service
            </button>
        </div>

        <div class="row g-4">
            <div v-for="service in services" :key="service.id" class="col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm rounded-4 hover-lift">
                    <div class="card-body p-4">
                        <h5 class="fw-bold">{{ service.name }}</h5>
                        <p class="text-muted small">{{ service.duration }} min • ₹{{ service.price }}</p>
                        <div class="d-flex gap-2 mt-3">
                            <button @click="editService(service)" class="btn btn-outline-secondary btn-sm rounded-pill">
                                Edit
                            </button>
                            <button @click="deleteService(service.id)"
                                class="btn btn-outline-danger btn-sm rounded-pill">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <teleport to="body">
            <div v-if="showAddModal" class="modal-backdrop" @click="showAddModal = false"></div>
            <div v-if="showAddModal" class="modal show d-block">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content rounded-4">
                        <div class="modal-header">
                            <h5 class="modal-title fw-bold">{{ editingService ? 'Edit' : 'Add New' }} Service</h5>
                            <button @click="showAddModal = false" class="btn-close"></button>
                        </div>
                        <div class="modal-body">
                            <input v-model="form.name" placeholder="Service Name" class="form-control mb-3">
                            <input v-model="form.price" type="number" placeholder="Price (₹)" class="form-control mb-3">
                            <input v-model="form.duration" type="number" placeholder="Duration (minutes)"
                                class="form-control mb-3">
                        </div>
                        <div class="modal-footer">
                            <button @click="saveService" class="btn btn-pink rounded-pill px-4">
                                {{ editingService ? 'Update' : 'Add' }} Service
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const services = ref<any[]>([])
const showAddModal = ref(false)
const editingService = ref<any>(null)
const form = ref({ name: '', price: '', duration: '' })

const loadServices = async () => {
    const res = await api.get('/api/provider/services')
    services.value = res.data
}

const saveService = async () => {
    if (editingService.value) {
        await api.put(`/api/provider/services/${editingService.value.id}`, form.value)
    } else {
        await api.post('/api/provider/services', form.value)
    }
    showAddModal.value = false
    form.value = { name: '', price: '', duration: '' }
    editingService.value = null
    loadServices()
}

const editService = (s: any) => {
    editingService.value = s
    form.value = { ...s }
    showAddModal.value = true
}

const deleteService = async (id: number) => {
    if (confirm('Delete this service?')) {
        await api.delete(`/api/provider/services/${id}`)
        loadServices()
    }
}

onMounted(loadServices)
</script>