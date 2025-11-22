<!-- src/views/Login.vue -->
<template>
  <div class="min-vh-100 bg-light d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg border-0">
            <div class="card-body p-5">
              <div class="text-center mb-5">
                <h1 class="fw-bold text-primary">Welcome Back</h1>
                <p class="text-muted">Choose your role to continue</p>
              </div>

              <div class="row g-4">
                <!-- Customer (No login needed) -->
                <div class="col-md-6">
                  <div class="text-center p-4 border rounded-3 hover-border-primary cursor-pointer"
                       @click="goPublic">
                    <i class="bi bi-person-heart display-1 text-primary mb-3"></i>
                    <h4>I'm a Customer</h4>
                    <p class="small text-muted">Browse salons & book instantly</p>
                    <span class="badge bg-success">No login required</span>
                  </div>
                </div>

                <!-- Service Provider Login -->
                <div class="col-md-6">
                  <div class="border rounded-3 p-4">
                    <div class="text-center mb-4">
                      <i class="bi bi-shop display-1 text-success mb-3"></i>
                      <h4>Salon Owner / Admin</h4>
                    </div>
                    <form @submit.prevent="loginProvider">
                      <div class="mb-3">
                        <input type="password" class="form-control form-control-lg" 
                               placeholder="Enter admin password" v-model="password" required />
                      </div>
                      <button type="submit" class="btn btn-success w-100 btn-lg">
                        Login as Provider
                      </button>
                    </form>
                    <small class="text-muted d-block text-center mt-3">
                      Default password: <code>admin123</code>
                    </small>
                  </div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const password = ref('')

const goPublic = () => router.push('/')

const loginProvider = async () => {
  try {
    const res = await axios.post('http://localhost:8080/api/salons/login', {
      role: 'admin',
      password: password.value
    })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('role', res.data.role)
    router.push('/provider/dashboard')
  } catch {
    alert('Wrong password!')
  }
}
</script>

<style scoped>
.hover-border-primary:hover { border-color: #0d6efd !important; }
.cursor-pointer { cursor: pointer; }
</style>