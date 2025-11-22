<template>
  <div class="min-vh-100 d-flex flex-column bg-light">

    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <div class="container">
        <router-link to="/" class="navbar-brand fw-bold fs-3 text-pink d-flex align-items-center gap-2">
          <i class="bi bi-scissors"></i> BeautyBook
        </router-link>

        <div class="ms-auto d-flex align-items-center gap-4">
          <button @click="goToLogin"
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
            <img src="https://images.unsplash.com/photo-1675034743339-0b0747047727?q=80&w=1470&auto=format&fit=crop"
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
            <img :src="salon.image" class="card-img-top" style="height: 220px; object-fit: cover;" alt="Salon">

            <div class="position-absolute top-0 end-0 m-3">
              <span class="badge bg-white text-dark fw-bold px-3 py-2 rounded-pill shadow-sm">
                <i class="bi bi-star-fill text-warning"></i> {{ salon.rating }}
              </span>
            </div>

            <div class="card-body p-4">
              <h5 class="fw-bold mb-2">{{ salon.name }}</h5>
              <p class="text-muted small mb-3">{{ salon.description.slice(0, 90) }}...</p>

              <div class="d-flex justify-content-between align-items-center">
                <small class="text-muted">
                  <i class="bi bi-geo-alt-fill text-pink"></i> {{ salon.address }}
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

interface Salon {
  id: number
  name: string
  description: string
  address: string
  image: string
  rating: string
}

const router = useRouter()

/* ---------------- NAVBAR LOGIN REDIRECT ---------------- */
const goToLogin = () => {
  router.push({ path: '/login', query: { role: 'customer' } })
}

/* ---------------- BOOK NOW REDIRECT ---------------- */
const handleBookNow = () => {
  router.push({ path: '/login', query: { role: 'customer' } })
}

/* ---------------- UI STATE ---------------- */
const salons = ref<Salon[]>([])
const salonsSection = ref<HTMLElement | null>(null)

/* ---------------- SCROLL TO SALONS ---------------- */
const scrollToSalons = () => {
  salonsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

/* ---------------- FALLBACK DATA ---------------- */
const sampleSalons: Salon[] = [
  {
    id: 1,
    name: "Glam & Glow Studio",
    description: "Full-service beauty studio offering hair, nails, and spa treatments.",
    address: "MG Road, Bengaluru",
    image: "https://images.unsplash.com/photo-1601041518595-9950e2f95562?q=80",
    rating: "4.8"
  },
  {
    id: 2,
    name: "Urban Chic Salon",
    description: "Trendy salon with premium stylists and beauty experts.",
    address: "Connaught Place, Delhi",
    image: "https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?q=80",
    rating: "4.7"
  },
  {
    id: 3,
    name: "Luxury Spa & Beauty",
    description: "Relax, rejuvenate, and enhance beauty with luxury spa services.",
    address: "Bandra West, Mumbai",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80",
    rating: "4.9"
  }
]

/* ---------------- FETCH SALONS ---------------- */
onMounted(async () => {
  try {
    const res = await api.get('/salons')
    salons.value = res.data?.length ? res.data : sampleSalons
  } catch {
    salons.value = sampleSalons
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
</style>
