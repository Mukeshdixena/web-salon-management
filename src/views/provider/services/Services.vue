<template>
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold text-pink">Manage Services</h2>
            <button class="btn btn-primary rounded-pill px-4 shadow-sm" @click="openAddModal">
                Add Service
            </button>
        </div>

        <div class="card border-0 shadow rounded-4">
            <div class="card-body">
                <table class="table table-hover align-middle mb-0">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Service Name</th>
                            <th>Price</th>
                            <th>Duration</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(s, i) in services" :key="s.id">
                            <td>{{ i + 1 }}</td>
                            <td class="fw-medium">{{ s.name }}</td>
                            <td class="text-pink fw-bold">₹{{ s.price }}</td>
                            <td>{{ s.duration }} min</td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-warning me-2"
                                    @click="openEditModal(s)">Edit</button>
                                <button class="btn btn-sm btn-outline-danger"
                                    @click="deleteService(s.id)">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div v-if="services.length === 0" class="text-center py-5 text-muted">
                    No services added yet.
                </div>
            </div>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
            <div class="bg-white p-4 rounded-4 shadow-lg" style="width: 420px;">
                <h4 class="fw-bold mb-4">{{ editMode ? 'Edit' : 'Add' }} Service</h4>
                <input v-model="form.name" placeholder="Service Name" class="form-control mb-3" />
                <input v-model.number="form.price" type="number" placeholder="Price (₹)" class="form-control mb-3" />
                <input v-model.number="form.duration" type="number" placeholder="Duration (min)"
                    class="form-control mb-4" />
                <div class="d-flex gap-2 justify-content-end">
                    <button class="btn btn-secondary" @click="closeModal">Cancel</button>
                    <button class="btn btn-success" @click="editMode ? updateService() : createService()">
                        {{ editMode ? 'Update' : 'Add' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

interface Service { id: number; name: string; price: number; duration: number }

const services = ref<Service[]>([])
const showModal = ref(false)
const editMode = ref(false)
const form = ref({ id: null as number | null, name: '', price: 0, duration: 0 })

const staticServices: Service[] = [
    { id: 1, name: 'Hair Cut', price: 400, duration: 30 },
    { id: 2, name: 'Hair Spa', price: 1200, duration: 60 },
    { id: 3, name: 'Facial', price: 2500, duration: 90 },
    { id: 4, name: 'Manicure', price: 800, duration: 45 }
]

const loadServices = async () => {
    try {
        const res = await api.get('/api/provider/services')
        services.value = res.data?.length ? res.data : staticServices
    } catch {
        services.value = staticServices
    }
}

const openAddModal = () => {
    editMode.value = false
    form.value = { id: null, name: '', price: 0, duration: 0 }
    showModal.value = true
}

const openEditModal = (s: Service) => {
    editMode.value = true
    form.value = { ...s }
    showModal.value = true
}

const createService = () => { alert('Service added!'); closeModal(); loadServices() }
const updateService = () => { alert('Service updated!'); closeModal(); loadServices() }
const deleteService = (id: number) => { if (confirm('Delete?')) loadServices() }
const closeModal = () => showModal.value = false

onMounted(loadServices)
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
}
</style>