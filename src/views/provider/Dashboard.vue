<!-- src/views/provider/Dashboard.vue -->
<template>
  <div class="min-vh-100 bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold fs-4">
          <i class="bi bi-shop-window me-2"></i> {{ auth.user?.name }}'s Salon
        </a>
        <div>
          <button class="btn btn-outline-light btn-sm me-2" @click="openCreateModal">
            <i class="bi bi-plus-lg"></i> Add Salon
          </button>
          <button class="btn btn-outline-light btn-sm" @click="auth.logout(); $router.push('/')">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Toast -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
      <div v-if="toast.message" :class="`toast show align-items-center text-white border-0 bg-${toast.type}`"
        role="alert">
        <div class="d-flex">
          <div class="toast-body fw-semibold">{{ toast.message }}</div>
          <button type="button" class="btn-close btn-close-white" @click="toast.message = ''"></button>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <h1 class="display-6 fw-bold mb-4 text-primary">Your Salons</h1>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-3 text-muted">Loading your salons...</p>
      </div>

      <!-- Salons List -->
      <div v-else-if="salons.length" class="row g-4">
        <!-- Desktop Table View -->
        <div v-if="!isMobile" class="card shadow-sm border-0">
          <div class="card-body p-0">
            <table class="table table-hover mb-0 align-middle">
              <thead class="bg-light">
                <tr>
                  <th>#</th>
                  <th>Salon Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Owner</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="salon in salons" :key="salon.id" class="hover-shadow">
                  <td class="text-muted small">#{{ salon.id }}</td>
                  <td class="fw-semibold">{{ salon.name }}</td>
                  <td>{{ salon.address || '—' }}</td>
                  <td>{{ salon.phone || '—' }}</td>
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
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Card View -->
        <div v-else v-for="salon in salons" :key="salon.id" class="col-12">
          <div class="card shadow-sm hover-shadow">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h5 class="fw-bold mb-1">{{ salon.name }}</h5>
                  <small class="text-muted">#{{ salon.id }} • {{ salon.ownerName }}</small>
                </div>
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="editSalon(salon)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteSalon(salon.id)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div class="mt-3 small text-muted">
                <div><i class="bi bi-geo-alt"></i> {{ salon.address || 'No address' }}</div>
                <div><i class="bi bi-telephone"></i> {{ salon.phone || 'No phone' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-5">
        <i class="bi bi-shop display-1 text-muted"></i>
        <h3 class="mt-4 text-muted">No Salons Yet</h3>
        <p class="lead text-muted">Click "Add Salon" to get started!</p>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }"
      tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">{{ editingSalon ? 'Edit Salon' : 'Add New Salon' }}</h5>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSalon">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Salon Name *</label>
                  <input v-model="form.name" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Owner Name *</label>
                  <input v-model="form.ownerName" type="text" class="form-control" required />
                </div>
                <div class="col-12">
                  <label class="form-label fw-semibold">Address</label>
                  <textarea v-model="form.address" class="form-control" rows="3"></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Phone *</label>
                  <input v-model="form.phone" type="text" class="form-control" required />
                </div>
              </div>
              <div class="mt-4 d-flex justify-content-end gap-2">
                <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-primary px-4">
                  {{ editingSalon ? 'Update' : 'Create' }}
                </button>
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
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

const auth = useAuthStore()
const salons = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingSalon = ref<any>(null)
const isMobile = computed(() => window.innerWidth < 768)

const toast = ref({ message: '', type: 'success' })

const form = ref({
  name: '',
  ownerName: '',
  address: '',
  phone: ''
})

onMounted(() => {
  loadSalons()
})

const loadSalons = async () => {
  try {
    loading.value = true
    const res = await api.get('/salons')
    salons.value = res.data
  } catch (err) {
    showToast('Failed to load salons', 'danger')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingSalon.value = null
  form.value = { name: '', ownerName: '', address: '', phone: '' }
  showModal.value = true
}

const editSalon = (salon: any) => {
  editingSalon.value = salon
  form.value = { ...salon }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingSalon.value = null
}

const saveSalon = async () => {
  try {
    if (editingSalon.value) {
      await api.put(`/salons/${editingSalon.value.id}`, form.value)
      showToast('Salon updated successfully!', 'success')
    } else {
      await api.post('/salons', form.value)
      showToast('Salon created successfully!', 'success')
    }
    closeModal()
    loadSalons()
  } catch (err) {
    showToast('Error saving salon', 'danger')
  }
}

const deleteSalon = async (id: number) => {
  if (!confirm('Delete this salon permanently?')) return
  try {
    await api.delete(`/salons/${id}`)
    showToast('Salon deleted', 'danger')
    loadSalons()
  } catch (err) {
    showToast('Failed to delete salon', 'danger')
  }
}

const showToast = (message: string, type: 'success' | 'danger') => {
  toast.value = { message, type }
  setTimeout(() => toast.value.message = '', 4000)
}
</script>

<style scoped>
.hover-shadow {
  transition: all 0.3s ease;
}

.hover-shadow:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12) !important;
}
</style>