<template>
  <div class="min-vh-100 bg-light">
    <!-- Hero -->
    <div class="bg-primary text-white py-5">
      <div class="container text-center py-5">
        <h1 class="display-3 fw-bold">Find Your Perfect Salon</h1>
        <p class="lead mb-4">Book beauty services in seconds</p>
        <button class="btn btn-light btn-lg px-5" @click="$router.push('/login')">
          Salon Owners Login
        </button>
      </div>
    </div>

    <!-- Salons Grid -->
    <div class="container py-5">
      <h2 class="text-center mb-5">Available Salons</h2>
      <div class="row g-4">
        <div v-for="salon in salons" :key="salon.id" class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm hover-shadow border-0">
            <div class="card-body p-4">
              <h5 class="card-title fw-bold">{{ salon.name }}</h5>
              <p class="text-muted small">Owner: {{ salon.ownerName }}</p>
              <p class="small">
                <i class="bi bi-geo-alt"></i> {{ salon.address || 'Location not set' }}
              </p>
              <div class="mt-3">
                <span class="badge bg-success">Open Now</span>
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
import axios from 'axios'

const salons = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:8080/api/salons')
  salons.value = res.data
})
</script>

<style scoped>
.hover-shadow { transition: all 0.3s; }
.hover-shadow:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important; }
</style>