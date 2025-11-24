<!-- src/views/customer/bookings/MyBookings.vue -->
<template>
  <div class="container py-5 min-vh-100">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h2 class="fw-bold text-pink mb-1">My Bookings</h2>
        <p class="text-muted">You have {{ bookings.length }} appointment(s)</p>
      </div>
      <router-link to="/" class="btn btn-outline-pink rounded-pill px-4">
        Book Another
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-pink"></div>
    </div>

    <div v-else-if="bookings.length === 0" class="text-center py-5">
      <i class="bi bi-calendar-x display-1 text-muted mb-4"></i>
      <h4>No bookings yet</h4>
      <p class="text-muted">Start your beauty journey — book your first appointment!</p>
      <router-link to="/" class="btn btn-pink rounded-pill px-5 mt-3">Explore Salons</router-link>
    </div>

    <div v-else class="row g-4">
      <div v-for="b in bookings" :key="b.id" class="col-lg-6">
        <div class="card shadow-sm border-0 rounded-4 overflow-hidden h-100">
          <div class="row g-0">
            <div class="col-md-4">
              <img :src="b.salon.image || 'https://images.unsplash.com/photo-1559598467-f8b76c5a8e3d?w=400'"
                class="img-fluid h-100 w-100" style="object-fit: cover;" alt="Salon">
            </div>
            <div class="col-md-8">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h4 class="fw-bold mb-0">{{ b.service.name }}</h4>
                  <span :class="statusBadge(b.status)" class="px-3 py-2 small fw-bold">
                    {{ formatStatus(b.status) }}
                  </span>
                </div>
                <h6 class="text-pink">{{ b.salon.name }}</h6>
                <p class="text-muted mb-3">
                  <i class="bi bi-geo-alt"></i> {{ b.salon.address }}
                </p>
                <div class="row text-muted small">
                  <div class="col-6">
                    <strong>Date:</strong> {{ formatDate(b.date) }}
                  </div>
                  <div class="col-6">
                    <strong>Time:</strong> {{ b.time }}
                  </div>
                </div>
                <div class="mt-3 d-flex justify-content-between align-items-center">
                  <h5 class="text-pink fw-bold">₹{{ b.price }}</h5>
                  <button v-if="b.status === 'PENDING'" class="btn btn-sm btn-outline-danger">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

interface Booking {
  id: number
  service: { name: string }
  salon: { name: string; address: string; image?: string }
  date: string
  time: string
  price: number
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
}

const bookings = ref<Booking[]>([])
const loading = ref(true)
const authStore = useAuthStore()

const staticBookings: Booking[] = [
  { id: 1, service: { name: "Hair Spa + Cut" }, salon: { name: "Glamour Studio", address: "Koramangala", image: "https://images.unsplash.com/photo-1633681926053-9074b76e21a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYXV0eSUyMHNhbG9ufGVufDB8fDB8fHww" }, date: "2025-11-28", time: "11:00 AM", price: 1800, status: "CONFIRMED" },
  { id: 2, service: { name: "Facial + Cleanup" }, salon: { name: "Blush Beauty", address: "MG Road", image: "https://images.unsplash.com/photo-1633681926053-9074b76e21a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYXV0eSUyMHNhbG9ufGVufDB8fDB8fHww" }, date: "2025-11-25", time: "03:30 PM", price: 2500, status: "COMPLETED" },
  { id: 3, service: { name: "Manicure & Pedicure" }, salon: { name: "Luxe Spa", address: "Indiranagar", image: "https://images.unsplash.com/photo-1633681926053-9074b76e21a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYXV0eSUyMHNhbG9ufGVufDB8fDB8fHww" }, date: "2025-12-01", time: "02:00 PM", price: 1500, status: "PENDING" }
]

const loadBookings = async () => {
  try {
    const customerId = authStore.user?.id || localStorage.getItem('userId')
    if (!customerId) throw new Error("No user")

    const res = await api.get(`/api/bookings/customer?customerId=${customerId}`)
    bookings.value = res.data?.length ? res.data : staticBookings
  } catch (err) {
    console.warn('MyBookings API failed → using static data')
    bookings.value = staticBookings
  } finally {
    loading.value = false
  }
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })
const formatStatus = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replace('_', ' ')
const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    PENDING: 'bg-warning text-dark',
    CONFIRMED: 'bg-info text-white',
    COMPLETED: 'bg-success text-white',
    CANCELLED: 'bg-danger text-white'
  }
  return map[s] || 'bg-secondary'
}

onMounted(loadBookings)
</script>

<style scoped>
.btn-outline-pink {
  border-color: #ff6bd6;
  color: #ff6bd6;
}

.btn-outline-pink:hover {
  background: #ff6bd6;
  color: white;
}

.text-pink {
  color: #ff6bd6;
}
</style>