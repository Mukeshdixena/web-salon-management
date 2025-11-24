<!-- src/views/public/Home.vue -->
<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <div class="container">
        <router-link to="/" class="navbar-brand fw-bold fs-3 text-pink d-flex align-items-center gap-2">
          <i class="bi bi-scissors"></i> BeautyBook
        </router-link>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <i class="bi bi-list fs-2"></i>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
          <div class="ms-auto d-flex align-items-center gap-4">
            <template v-if="!user">
              <button @click="goToLogin('customer')" class="btn btn-outline-dark rounded-pill px-4 fw-semibold">
                Customer Login
              </button>
              <button @click="goToLogin('salon')"
                class="btn btn-pink rounded-pill px-4 fw-semibold d-none d-lg-inline-flex">
                Salon Owner?
              </button>
            </template>
            <div v-else class="dropdown">
              <button class="btn btn-dark rounded-pill px-4 dropdown-toggle" data-bs-toggle="dropdown">
                Hi, {{ user.name.split(' ')[0] }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow-lg">
                <li><router-link to="/customer/bookings" class="dropdown-item">My Bookings</router-link></li>
                <li>
                  <hr class="dropdown-divider">
                </li>
                <li><button @click="logout" class="dropdown-item text-danger">Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero text-white position-relative overflow-hidden">
      <div class="hero-overlay"></div>
      <div class="container position-relative z-3 py-5">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-7">
            <h1 class="display-2 fw-bold mb-4">Book Your<br><span class="text-pink">Beauty Moment</span></h1>
            <p class="lead fs-3 mb-5 opacity-90">Hair • Nails • Spa • Makeup — from the best salons near you</p>
            <button @click="scrollToSalons" class="btn btn-light btn-lg rounded-pill px-5 shadow-lg fw-bold">
              Explore Salons
            </button>
          </div>
          <div class="col-lg-5 text-center">
            <img src="https://images.unsplash.com/photo-1675034743339-0b0747047727?w=800&q=80"
              class="img-fluid rounded-4 shadow-lg" alt="Salon">
          </div>
        </div>
      </div>
    </section>

    <!-- SALONS GRID -->
    <section id="salons" ref="salonsSection" class="container py-5 py-lg-7">
      <div class="text-center mb-5">
        <h2 class="display-5 fw-bold">Top Salons Near You</h2>
        <p class="text-muted fs-5">{{ salons.length }} premium salons available</p>
      </div>

      <div v-if="loading" class="row g-4">
        <div v-for="n in 6" :key="n" class="col-md-6 col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 bg-light" style="height: 380px;"></div>
        </div>
      </div>

      <div v-else class="row g-4">
        <div v-for="salon in salons" :key="salon.id" class="col-md-6 col-lg-4">
          <div class="card salon-card border-0 shadow-sm rounded-4 overflow-hidden hover-lift cursor-pointer"
            @click="goToSalon(salon.id)">
            <img :src="salon.image" class="card-img-top" style="height: 220px; object-fit: cover;" alt="Salon">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="fw-bold mb-0">{{ salon.name }}</h5>
                <span class="badge bg-white text-dark shadow-sm">Rating: {{ salon.rating }}</span>
              </div>
              <p class="text-muted small mb-3">{{ salon.address }}</p>
              <button @click.stop="handleBookNow(salon)" class="btn btn-pink w-100 rounded-pill py-3 fw-bold">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-dark text-white py-5 mt-auto">
      <div class="container text-center">
        <h5>BeautyBook</h5>
        <p class="small opacity-75">© {{ new Date().getFullYear() }} BeautyBook. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'

interface Salon {
  id: number
  name: string
  address: string
  image: string
  rating: string
}

const router = useRouter()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const salons = ref<Salon[]>([])
const loading = ref(true)
const salonsSection = ref<HTMLElement | null>(null)

// Static fallback salons — always beautiful!
const staticSalons: Salon[] = [
  { id: 1, name: "Glamour Studio", address: "Koramangala, Bangalore", image: "https://images.unsplash.com/photo-1633681926053-9074b76e21a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYXV0eSUyMHNhbG9ufGVufDB8fDB8fHww", rating: "4.9" },
  { id: 2, name: "Luxe Hair & Spa", address: "Indiranagar, Bangalore", image: "https://images.unsplash.com/photo-1633681926053-9074b76e21a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYXV0eSUyMHNhbG9ufGVufDB8fDB8fHww", rating: "4.8" },
  { id: 3, name: "Blush Beauty Lounge", address: "MG Road, Bangalore", image: "https://images.unsplash.com/photo-1633681926053-9074b76e21a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYXV0eSUyMHNhbG9ufGVufDB8fDB8fHww", rating: "5.0" },
  { id: 4, name: "The Makeup Bar", address: "Whitefield, Bangalore", image: "https://images.unsplash.com/photo-1633681926053-9074b76e21a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYXV0eSUyMHNhbG9ufGVufDB8fDB8fHww", rating: "4.7" },
  { id: 5, name: "Radiance Salon", address: "Jayanagar, Bangalore", image: "https://images.unsplash.com/photo-1633681926053-9074b76e21a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYXV0eSUyMHNhbG9ufGVufDB8fDB8fHww", rating: "4.9" },
  { id: 6, name: "Elegance Spa", address: "Malleshwaram, Bangalore", image: "https://images.unsplash.com/photo-1633681926053-9074b76e21a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGJlYXV0eSUyMHNhbG9ufGVufDB8fDB8fHww", rating: "4.8" }
]

onMounted(async () => {
  try {
    const res = await api.get('/api/salons')
    salons.value = res.data?.length ? res.data : staticSalons
  } catch (err) {
    console.warn('API failed → showing beautiful static salons')
    salons.value = staticSalons
  } finally {
    loading.value = false
  }
})

const scrollToSalons = () => salonsSection.value?.scrollIntoView({ behavior: 'smooth' })
const goToLogin = (role: string) => router.push({ path: '/login', query: { role } })
const goToSalon = (id: number) => router.push(`/salon/${id}`)
const handleBookNow = (salon: Salon) => user.value ? goToSalon(salon.id) : goToLogin('customer')
const logout = () => { authStore.logout(); router.push('/') }
</script>

<style scoped>
.text-pink {
  color: #ff6bd6;
}

.btn-pink {
  background: linear-gradient(135deg, #ff6bd6, #ff8fab);
  border: none;
  color: white;
}

.btn-pink:hover {
  background: linear-gradient(135deg, #ff4ac6, #ff7a9b);
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(255, 107, 214, 0.4);
}

.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1595475038784-b3f97102f1f8?w=1600') center/cover;
}

.hover-lift:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: inherit;
  filter: blur(12px);
  transform: scale(1.05);
}

.z-3 {
  z-index: 3;
}
</style>