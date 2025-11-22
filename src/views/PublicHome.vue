<!-- src/views/PublicHome.vue -->
<template>
  <div class="min-vh-100 bg-light">
    <!-- Hero -->
    <div class="bg-primary text-white py-5">
      <div class="container text-center py-5">
        <h1 class="display-4 fw-bold">Find Your Perfect Salon</h1>
        <p class="lead">Book beauty services near you in seconds</p>
        <div class="col-md-6 mx-auto mt-4">
          <div class="input-group input-group-lg">
            <input type="text" class="form-control" placeholder="Enter location or use current..." v-model="searchLocation">
            <button class="btn btn-outline-light" @click="useLocation">
              <i class="bi bi-geo-alt-fill"></i> Use My Location
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Nearby Salons -->
    <div class="container py-5">
      <h2 class="mb-4">Nearby Salons</h2>
      <div class="row g-4">
        <div v-for="salon in salons" :key="salon.id" class="col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm hover-shadow">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold">{{ salon.name }}</h5>
              <p class="text-muted small"><i class="bi bi-person"></i> {{ salon.ownerName }}</p>
              <p class="small"><i class="bi bi-geo-alt"></i> {{ salon.address }}</p>
              <p class="small"><i class="bi bi-telephone"></i> {{ salon.phone }}</p>
              <div class="mt-auto">
                <button class="btn btn-primary w-100" @click="goToSalon(salon.id)">
                  View Services & Book
                </button>
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
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const salons = ref([])
const searchLocation = ref('')

onMounted(async () => {
  const res = await axios.get('http://localhost:8080/api/salons')
  salons.value = res.data
})

const useLocation = () => alert('Location permission coming soon!')
const goToSalon = (id: number) => router.push(`/salon/${id}`)
</script>

<style scoped>
.hover-shadow:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important; transition: all 0.3s; }
</style>