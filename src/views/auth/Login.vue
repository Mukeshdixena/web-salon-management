<template>
  <div class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container" style="max-width: 540px;">
      <div class="card rounded-4 shadow-sm border-0 overflow-hidden">
        <div class="card-body p-5">
          <h3 class="fw-bold mb-1">{{ titleText }}</h3>
          <p class="text-muted mb-4">{{ subtitleText }}</p>

          <form @submit.prevent="onSubmit" autocomplete="off" novalidate>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" required class="form-control form-control-lg" />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" required class="form-control form-control-lg" />
            </div>

            <div class="d-grid">
              <button :disabled="loading" type="submit" class="btn btn-pink btn-lg fw-bold">
                <span v-if="!loading">{{ buttonText }}</span>
                <span v-else>Signing in…</span>
              </button>
            </div>

            <div v-if="error" class="alert alert-danger mt-3 py-2" role="alert">
              {{ error }}
            </div>
          </form>

          <hr class="my-4" />

          <div class="text-center small">
            <span v-if="role === 'customer'">
              Don't have an account?
              <a @click.prevent="goToRegister" href="#">Create account</a>
            </span>

            <span v-else-if="role === 'provider'">
              New to BeautyBook?
              <a @click.prevent="goToRegister" href="#">Register your salon</a>
            </span>

            <span v-else>
              Need admin help? Contact support.
            </span>
          </div>
        </div>
      </div>

      <div class="text-center mt-3 text-muted small">
        <router-link to="/">← Back to home</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api' // shared axios instance (baseURL = http://localhost:8080)

type Role = 'customer' | 'provider' | 'admin'

const route = useRoute()
const router = useRouter()

// Read role from query, default to customer
const rawRole = String(route.query.role || 'customer').toLowerCase()
const role = (['customer', 'provider', 'admin'].includes(rawRole) ? rawRole : 'customer') as Role

// Form state
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// UI labels
const titleText = computed(() => {
  if (role === 'admin') return 'Admin Sign in'
  if (role === 'provider') return 'Salon Owner Sign in'
  return 'Customer Sign in'
})
const subtitleText = computed(() => {
  if (role === 'admin') return 'Access the admin panel'
  if (role === 'provider') return 'Manage your salon, services, and queue'
  return 'Find salons, book services and track bookings'
})
const buttonText = computed(() => `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`)

// Pick endpoint by role
const apiPath = computed(() => {
  if (role === 'admin') return '/api/auth/admin/login'
  if (role === 'provider') return '/api/auth/provider/login'
  return '/api/auth/customer/login'
})

// Submit handler
const onSubmit = async () => {
  error.value = null
  loading.value = true

  try {
    const payload = { email: email.value.trim(), password: password.value }
    const res = await api.post(apiPath.value, payload)

    // Expect LoginResponse: { token, userId, name, email, role }
    const data = res.data
    if (!data || !data.token) {
      throw new Error('Invalid server response')
    }

    // Persist session
    localStorage.setItem('token', String(data.token))
    // server role expected values: "ADMIN", "PROVIDER", "CUSTOMER"
    const serverRole = String(data.role || '').toUpperCase()
    localStorage.setItem('role', serverRole)
    localStorage.setItem('userId', String(data.userId ?? ''))

    // Redirect: prefer server-sent role to avoid mismatch
    if (serverRole === 'ADMIN') {
      await router.push('/admin/dashboard')
    } else if (serverRole === 'PROVIDER') {
      await router.push('/provider/dashboard')
    } else {
      await router.push('/customer/dashboard')
    }

  } catch (err: any) {
    // err.response?.data might be a string or object
    if (err.response?.data) {
      error.value = typeof err.response.data === 'string' ? err.response.data : (err.response.data.message || JSON.stringify(err.response.data))
    } else {
      error.value = err.message || 'Login failed'
    }
  } finally {
    loading.value = false
  }
}

// navigation helpers
const goToRegister = () => {
  const targetRole = role === 'provider' ? 'provider' : 'customer'
  router.push({ path: '/register', query: { role: targetRole } })
}
</script>

<style scoped>
.btn-pink {
  background: linear-gradient(135deg, #ff6bd6, #ff8fab);
  border: none;
  color: white;
  transition: all 0.2s;
}

.btn-pink[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.card {
  border-radius: 16px;
}
</style>
