<template>
  <div class="min-vh-100 d-flex flex-column bg-light">

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <div class="container">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand fw-bold fs-3 text-pink d-flex align-items-center gap-2">
          <i class="bi bi-scissors"></i> BeautyBook
        </router-link>

        <!-- Right Side -->
        <div class="ms-auto d-flex align-items-center gap-4">
          <!-- Login Button (Like Zomato/Amazon) -->
          <button @click="showAuthModal = true"
            class="btn btn-outline-dark rounded-pill px-4 fw-semibold d-flex align-items-center gap-2">
            <i class="bi bi-person"></i>
            Login
          </button>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero position-relative overflow-hidden text-white">
      <div class="hero-overlay"></div>
      <div class="container position-relative z-3 py-5">
        <div class="row align-items-center min-vh-30 py-5">
          <div class="col-lg-7">
            <h1 class="display-2 fw-bold mb-4">
              Book Your<br>
              <span class="text-pink">Beauty Moment</span>
            </h1>
            <p class="lead fs-3 mb-5 opacity-90">
              Hair • Nails • Spa • Makeup — from the best salons near you
            </p>
            <button @click="scrollToSalons" class="btn btn-light btn-lg rounded-pill px-5 shadow-lg fw-bold">
              Explore Salons
            </button>
          </div>
          <div class="col-lg-5 text-center">
            <img
              src="https://images.unsplash.com/photo-1675034743339-0b0747047727?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              class="img-fluid rounded-4 shadow-lg hero-image" alt="Salon">
          </div>
        </div>
      </div>
    </section>

    <!-- SALONS GRID -->
    <section id="salons" ref="salonsSection" class="container py-5">
      <div class="text-center mb-5">
        <h2 class="display-5 fw-bold">Top Salons Near You</h2>
        <p class="text-muted fs-5">{{ salons.length }} premium salons available now</p>
      </div>

      <div class="row g-4">
        <div v-for="salon in salons" :key="salon.id" class="col-md-6 col-lg-4">
          <div class="card salon-card border-0 shadow-sm rounded-4 overflow-hidden hover-lift">
            <img :src="salon.image || `https://source.unsplash.com/random/800x600/?salon,beauty,${salon.id}`"
              class="card-img-top" style="height: 220px; object-fit: cover;" alt="Salon">
            <div class="position-absolute top-0 end-0 m-3">
              <span class="badge bg-white text-dark fw-bold px-3 py-2 rounded-pill shadow-sm">
                <i class="bi bi-star-fill text-warning"></i> {{ salon.rating || '4.8' }}
              </span>
            </div>
            <div class="card-body p-4">
              <h5 class="fw-bold mb-2">{{ salon.name }}</h5>
              <p class="text-muted small mb-3">
                {{ (salon.description || 'Premium beauty services').slice(0, 90) }}...
              </p>
              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  <i class="bi bi-geo-alt-fill text-pink"></i> {{ salon.address || 'Nearby' }}
                </small>
                <small class="text-success fw-bold">Open Now</small>
              </div>
              <button @click="handleBookNow(salon)" class="btn btn-pink w-100 rounded-pill mt-3 fw-semibold py-3">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AUTH MODAL (Login / Signup Tabs) -->
    <teleport to="body">
      <div v-if="showAuthModal" class="modal-backdrop fade" @click="showAuthModal = false"></div>
      <div v-if="showAuthModal" class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4 shadow-lg border-0 overflow-hidden">
            <div class="modal-header border-0 pb-0">
              <ul class="nav nav-tabs w-100 border-0" role="tablist">
                <li class="nav-item flex-fill">
                  <button :class="{ 'active': activeTab === 'login' }" @click="activeTab = 'login'"
                    class="nav-link w-100 py-3 fw-bold">Login</button>
                </li>
                <li class="nav-item flex-fill">
                  <button :class="{ 'active': activeTab === 'signup' }" @click="activeTab = 'signup'"
                    class="nav-link w-100 py-3 fw-bold">Sign Up</button>
                </li>
              </ul>
              <button @click="showAuthModal = false" class="btn-close position-absolute top-0 end-0 m-3"></button>
            </div>
            <div class="modal-body pt-4">
              <!-- Login Form -->
              <div v-if="activeTab === 'login'">
                <form @submit.prevent="login">
                  <div class="mb-3">
                    <input type="email" v-model="loginEmail" class="form-control form-control-lg rounded-pill"
                      placeholder="Email" required>
                  </div>
                  <div class="mb-3">
                    <input type="password" v-model="loginPassword" class="form-control form-control-lg rounded-pill"
                      placeholder="Password" required>
                  </div>
                  <button type="submit" class="btn btn-pink w-100 rounded-pill py-3 fw-bold">
                    Login
                  </button>
                </form>
              </div>

              <!-- Signup Form -->
              <div v-else>
                <form @submit.prevent="signup">
                  <div class="mb-3">
                    <input type="text" v-model="signupName" class="form-control form-control-lg rounded-pill"
                      placeholder="Full Name" required>
                  </div>
                  <div class="mb-3">
                    <input type="email" v-model="signupEmail" class="form-control form-control-lg rounded-pill"
                      placeholder="Email" required>
                  </div>
                  <div class="mb-3">
                    <input type="password" v-model="signupPassword" class="form-control form-control-lg rounded-pill"
                      placeholder="Password" required>
                  </div>
                  <button type="submit" class="btn btn-pink w-100 rounded-pill py-3 fw-bold">
                    Create Account
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- FOOTER -->
    <footer class="bg-dark text-white py-5 mt-auto">
      <div class="container text-center">
        <p class="mb-0">© 2025 BeautyBook — Book beauty. Feel beautiful.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

interface Salon { id: number; name: string; description?: string; address?: string; image?: string; rating?: string }

const router = useRouter()
const salons = ref<Salon[]>([])
const salonsSection = ref<HTMLElement | null>(null)

const showAuthModal = ref(false)
const activeTab = ref<'login' | 'signup'>('login')

// Form fields
const loginEmail = ref('')
const loginPassword = ref('')
const signupName = ref('')
const signupEmail = ref('')
const signupPassword = ref('')

const scrollToSalons = () => {
  salonsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleBookNow = (salon: Salon) => {
  // Force login before booking (like Zomato)
  showAuthModal.value = true
  // Later: save selected salon in store
}

const login = () => {
  // TODO: Call API login
  alert('Login coming soon!')
  showAuthModal.value = false
}

const signup = () => {
  // TODO: Call API signup
  alert('Account created! Welcome to BeautyBook')
  showAuthModal.value = false
}

onMounted(async () => {
  try {
    const res = await api.get('/salons')
    salons.value = res.data.map((s: any) => ({
      id: s.id,
      name: s.name || 'Premium Salon',
      description: s.description,
      address: s.address,
      image: s.image || `https://source.unsplash.com/random/800x600/?salon,${s.id}`,
      rating: s.rating || (4.5 + Math.random() * 0.5).toFixed(1)
    }))
  } catch (err) {
    console.log('API offline or no salons')
  }
})
</script>

<style scoped>
.text-pink {
  color: #ff6bd6;
}

.btn-pink {
  background: linear-gradient(135deg, #ff6bd6, #ff8fab);
  border: none;
  color: white;
  transition: all 0.3s;
}

.btn-pink:hover {
  background: linear-gradient(135deg, #ff4ac6, #ff7a9b);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 107, 214, 0.4);
}

.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.75)),
    url('https://images.unsplash.com/photo-1595475038784-b3f97102f1f8?w=1600&q=80') center/cover no-repeat;
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

.salon-card {
  transition: all 0.4s;
}

.hover-lift:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.modal-backdrop {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  inset: 0;
  z-index: 1040;
}

.modal {
  z-index: 1050;
  background: transparent;
}

.nav-tabs .nav-link {
  border: none;
  border-radius: 0;
  color: #666;
  font-size: 1.1rem;
}

.nav-tabs .nav-link.active {
  color: #ff6bd6;
  border-bottom: 3px solid #ff6bd6;
}
</style>