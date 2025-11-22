<template>
  <div class="min-vh-100 bg-gradient d-flex align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-5">
              <div class="text-center mb-5">
                <h1 class="fw-bold text-primary display-5">Welcome Back</h1>
                <p class="text-muted">Sign in to manage your salon empire</p>
              </div>

              <form @submit.prevent="login">
                <div class="mb-4">
                  <input v-model="email" type="email" class="form-control form-control-lg rounded-3" placeholder="Email"
                    required />
                </div>
                <div class="mb-4">
                  <input v-model="password" type="password" class="form-control form-control-lg rounded-3"
                    placeholder="Password" required />
                </div>

                <button type="submit" class="btn btn-primary w-100 btn-lg rounded-3 mb-4" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Signing in...' : 'Sign In' }}
                </button>

                <div class="text-center mt-4">
                  <router-link to="/register" class="btn btn-outline-primary w-100">
                    Don't have an account? <strong>Register as Salon Owner</strong>
                  </router-link>
                </div>
                <div v-if="error" class="alert alert-danger rounded-3">{{ error }}</div>


                <div class="text-center text-muted small">
                  <p>Demo Accounts:</p>
                  <code class="bg-light px-2 py-1 rounded">admin@salon.com</code> → ADMIN<br>
                  Register as provider → will be PENDING until admin approves
                </div>

              </form>
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
import { useAuthStore } from '@/stores/auth'

const email = ref('admin@salon.com')
const password = ref('admin123')
const loading = ref(false)
const error = ref('')
const router = useRouter()
const auth = useAuthStore()

const login = async () => {
  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    if (auth.role === 'ADMIN') router.push('/admin/dashboard')
    if (auth.role === 'PROVIDER') router.push('/provider/dashboard')
  } catch (e: any) {
    error.value = e.response?.data || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>