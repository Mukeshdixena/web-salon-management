<template>
  <div class="container-fluid py-4 px-3 px-md-5 members-container">
    <!-- Header -->
    <div class="header-section mb-4">
      <div class="header-content">
        <div>
          <h2 class="fw-bold mb-1 title-responsive">Salons Management</h2>
          <p class="text-muted small mb-0 d-none d-md-block">Manage all salons, services & staff in one place.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1" @click="store.loadSalons">
            <i class="bi bi-arrow-clockwise"></i>
            <span class="d-none d-sm-inline">Refresh</span>
          </button>
          <button class="btn btn-primary btn-sm d-flex align-items-center gap-1" @click="openAddModal">
            <i class="bi bi-plus-lg"></i>
            <span class="d-none d-sm-inline">Add Salon</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1100">
      <div v-if="store.toastMessage" :class="`toast align-items-center text-white border-0 bg-${store.toastType}`" role="alert">
        <div class="d-flex">
          <div class="toast-body">{{ store.toastMessage }}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="store.toastMessage = ''"></button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="store.loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <div class="mt-2 text-muted">Loading salons...</div>
    </div>

    <!-- Desktop Table -->
    <div v-else class="table-responsive rounded-3 overflow-hidden shadow-sm">
      <table class="table table-hover align-middle mb-0">
        <thead class="bg-light text-muted small fw-semibold">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Owner</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="salon in store.salons" :key="salon.id">
            <td class="text-muted small">#{{ salon.id }}</td>
            <td class="fw-semibold">{{ salon.name }}</td>
            <td>{{ salon.address || '—' }}</td>
            <td>{{ salon.phone }}</td>
            <td>{{ salon.ownerName }}</td>
            <td class="text-center">
              <div class="d-flex justify-content-center gap-2">
                <button class="btn btn-sm btn-outline-primary" @click="editSalon(salon)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(salon)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="!store.salons.length">
            <td colspan="6" class="text-center py-5 text-muted">No salons found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div class="modal fade" :class="{ show: showModal }" :style="{ display: showModal ? 'block' : 'none' }" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingSalon ? 'Edit Salon' : 'Add New Salon' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveSalon">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label">Salon Name <span class="text-danger">*</span></label>
                  <input v-model="form.name" type="text" class="form-control" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Owner Name <span class="text-danger">*</span></label>
                  <input v-model="form.ownerName" type="text" class="form-control" required />
                </div>
                <div class="col-12">
                  <label class="form-label">Address</label>
                  <textarea v-model="form.address" class="form-control" rows="2"></textarea>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Phone <span class="text-danger">*</span></label>
                  <input v-model="form.phone" type="text" class="form-control" required />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Latitude</label>
                  <input v-model.number="form.latitude" type="number" step="any" class="form-control" />
                </div>
                <div class="col-md-3">
                  <label class="form-label">Longitude</label>
                  <input v-model.number="form.longitude" type="number" step="any" class="form-control" />
                </div>
              </div>
              <div class="mt-4 d-flex gap-2 justify-content-end">
                <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                <button type="submit" class="btn btn-primary">{{ editingSalon ? 'Update' : 'Create' }} Salon</button>
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
import { useSalonStore, type Salon } from '@/stores/salonStore'

const store = useSalonStore()
const showModal = ref(false)
const editingSalon = ref<Salon | null>(null)

const form = ref({
  name: '',
  address: '',
  phone: '',
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  ownerName: ''
})

onMounted(() => {
  store.loadSalons()
})

const openAddModal = () => {
  editingSalon.value = null
  form.value = { name: '', address: '', phone: '', ownerName: '', latitude: undefined, longitude: undefined }
  showModal.value = true
}

const editSalon = (salon: Salon) => {
  editingSalon.value = salon
  form.value = { ...salon }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingSalon.value = null
}

const saveSalon = async () => {
  if (editingSalon.value) {
    await store.updateSalon(editingSalon.value.id, form.value)
  } else {
    await store.createSalon(form.value)
  }
  closeModal()
}

const confirmDelete = async (salon: Salon) => {
  if (confirm(`Delete "${salon.name}" permanently?`)) {
    await store.deleteSalon(salon.id)
  }
}
</script>

<style scoped>
/* Same beautiful styling as your original design */
.members-container { font-family: 'Inter', sans-serif; }
.header-section { background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 1px 10px rgba(0,0,0,0.08); }
.title-responsive { font-size: 1.8rem; }
@media (min-width: 768px) { .header-content { flex-direction: row; justify-content: space-between; align-items: center; } }
</style>