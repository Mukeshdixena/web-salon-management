<!-- src/views/admin/Dashboard.vue -->
<template>
  <div class="min-vh-100 bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger shadow sticky-top">
      <div class="container-fluid">
        <span class="navbar-brand fw-bold fs-4">
          <i class="bi bi-shield-lock me-2"></i> Admin Panel
        </span>
        <button class="btn btn-outline-light btn-sm" @click="auth.logout(); $router.push('/')">
          <i class="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </nav>

    <div class="container py-5">
      <h1 class="display-5 fw-bold mb-5 text-danger">Pending Provider Approvals</h1>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-3 text-muted">Loading pending requests...</p>
      </div>

      <!-- Users Grid -->
      <div v-else class="row g-4">
        <div v-for="user in pendingUsers" :key="user.id" class="col-lg-4 col-md-6">
          <div class="card shadow-sm border-0 h-100 hover-shadow">
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center mb-3">
                <div class="bg-warning rounded-circle p-3 me-3">
                  <i class="bi bi-clock-history text-white fs-3"></i>
                </div>
                <div>
                  <h5 class="mb-0 fw-bold">{{ user.name }}</h5>
                  <small class="text-muted">{{ user.email }}</small>
                </div>
              </div>

              <div class="mt-2">
                <span class="badge bg-warning text-dark">PENDING</span>
                <p class="mt-2 text-muted small">
                  Requested to join as <strong>Salon Owner</strong>
                </p>
              </div>

              <div class="d-flex gap-2 mt-auto">
                <button @click="approve(user.id)" class="btn btn-success flex-fill">
                  <i class="bi bi-check-lg"></i> Approve
                </button>
                <button @click="reject(user.id)" class="btn btn-outline-danger flex-fill">
                  <i class="bi bi-x-lg"></i> Reject
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="!pendingUsers.length && !loading" class="col-12">
          <div class="text-center py-5">
            <i class="bi bi-check-circle-fill display-1 text-success"></i>
            <h3 class="mt-4 text-success">All caught up!</h3>
            <p class="text-muted lead">No pending provider registrations</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'  // ← CLEAN, CENTRALIZED API

const auth = useAuthStore()
const pendingUsers = ref<any[]>([])
const loading = ref(true)

// Load pending providers on mount
onMounted(async () => {
  await loadPending()
})

const loadPending = async () => {
  try {
    loading.value = true
    const res = await api.get('/admin/pending-providers')
    pendingUsers.value = res.data
  } catch (err) {
    console.error('Failed to load pending users', err)
  } finally {
    loading.value = false
  }
}

const approve = async (id: number) => {
  if (!confirm('Approve this salon owner?')) return
  try {
    await api.put(`/admin/approve/${id}`)
    pendingUsers.value = pendingUsers.value.filter(u => u.id !== id)
  } catch (err) {
    alert('Approval failed')
  }
}

const reject = async (id: number) => {
  if (!confirm('Reject this registration?')) return
  try {
    await api.put(`/admin/reject/${id}`)
    pendingUsers.value = pendingUsers.value.filter(u => u.id !== id)
  } catch (err) {
    alert('Rejection failed')
  }
}
</script>

<style scoped>
.hover-shadow {
  transition: all 0.3s ease;
}

.hover-shadow:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}
</style>