<!-- src/views/provider/Dashboard.vue -->
<template>
  <div class="min-vh-100 bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold fs-4">
          <i class="bi bi-shop-window me-2"></i> {{ auth.user?.name }} Salon
        </a>
        <div>
          <button class="btn btn-outline-light btn-sm me-2" @click="showSalonsModal = true">
            <i class="bi bi-plus-lg"></i> Add Salon
          </button>
          <button class="btn btn-outline-light btn-sm" @click="auth.logout(); $router.push('/')">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Toast -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">
      <div v-if="toast.message" :class="`toast show align-items-center text-white border-0 bg-${toast.type}`" role="alert">
        <div class="d-flex">
          <div class="toast-body">{{ toast.message }}</div>
          <button type="button" class="btn-close btn-close-white" @click="toast.message = ''"></button>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <h1 class="fw-bold mb-4">Your Salons</h1>

      <!-- Desktop Table -->
      <div v-if="!isMobile" class="card shadow-sm border-0">
        <div class="card-body p-0">
          <table class="table table-hover mb-0">
            <thead class="bg-light">
              <tr>
                <th>ID</th>
                <th>Salon Name</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Owner</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="salon in salons" :key="salon.id">
                <td class="text-muted small">#{{ salon.id }}</td>
                <td class="fw-semibold">{{ salon.name }}</td>
                <td>{{ salon.address || '—' }}</td>
                <td>{{ salon.phone }}</td>
                <td>{{ salon.ownerName }}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-outline-primary me-1" @click="editSalon(salon)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteSalon(salon.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!salons.length">
                <td colspan="6" class="text-center py-5 text-muted">No salons yet. Click "Add Salon" to start!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Cards -->
      <div v-else class="row g-3">
        <div v-for="salon in salons" :key="salon.id" class="col-12">
          <div class="card shadow-sm">
            <div class="card-body">
              <h6 class="fw-bold">{{ salon.name }}</h6>
              <small class="text-muted">#{{ salon.id }} • {{ salon.ownerName }}</small>
              <div class="mt-2 small">
                <div><i class="bi bi-geo-alt"></i> {{ salon.address || 'No address' }}</div>
                <div><i class="bi bi-telephone"></i> {{ salon.phone }}</div>
              </div>
              <div class="mt-3 d-flex gap-2">
                <button class="btn btn-outline-primary btn-sm flex-fill" @click="editSalon(salon)">Edit</button>
                <button class="btn btn-outline-danger btn-sm flex-fill" @click="deleteSalon(salon.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" :class="{ show: showSalonsModal }" :style="{ display: showSalonsModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ editingSalon ? 'Edit Salon' : 'Add New Salon' }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="showSalonsModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSalon">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Salon Name *</label>
                  <input v-model="form.name" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Owner Name *</label>
                  <input v-model="form.ownerName" class="form-control" required />
                </div>
                <div class="col-12">
                  <label class="form-label">Address</label>
                  <textarea v-model="form.address" class="form-control" rows="2"></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Phone *</label>
                  <input v-model="form.phone" class="form-control" required />
                </div>
              </div>
              <div class="mt-4 d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" @click="showSalonsModal = false">Cancel</button>
                <button type="submit" class="btn btn-primary">{{ editingSalon ? 'Update' : 'Create' }}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showSalonsModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const auth = useAuthStore()
auth.init()

const salons = ref([])
const showSalonsModal = ref(false)
const editingSalon = ref<any>(null)
const isMobile = computed(() => window.innerWidth < 768)
const toast = ref({ message: '', type: 'success' })

const form = ref({
  name: '', address: '', phone: '', ownerName: ''
})

onMounted(() => loadSalons())

const loadSalons = async () => {
  const res = await axios.get('http://localhost:8080/api/salons')
  salons.value = res.data
}

const editSalon = (salon: any) => {
  editingSalon.value = salon
  form.value = { ...salon }
  showSalonsModal.value = true
}

const saveSalon = async () => {
  try {
    if (editingSalon.value) {
      await axios.put(`http://localhost:8080/api/salons/${editingSalon.value.id}`, form.value)
      toast.value = { message: 'Salon updated!', type: 'success' }
    } else {
      await axios.post('http://localhost:8080/api/salons', form.value)
      toast.value = { message: 'Salon created!', type: 'success' }
    }
    showSalonsModal.value = false
    loadSalons()
  } catch {
    toast.value = { message: 'Error saving salon', type: 'danger' }
  }
}

const deleteSalon = async (id: number) => {
  if (confirm('Delete this salon permanently?')) {
    await axios.delete(`http://localhost:8080/api/salons/${id}`)
    toast.value = { message: 'Salon deleted!', type: 'danger' }
    loadSalons()
  }
}
</script>

<style scoped>
.hover-shadow:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important; transition: all 0.3s; }
</style>