<template>
  <div class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container" style="max-width: 540px;">
      <div class="card rounded-4 shadow-sm border-0 overflow-hidden">
        <div class="card-body p-5">

          <h3 class="fw-bold mb-1">{{ titleText }}</h3>
          <p class="text-muted mb-4">{{ subtitleText }}</p>

          <form @submit.prevent="onSubmit" autocomplete="off" novalidate>

            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input v-model="name" type="text" required class="form-control form-control-lg" />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" required class="form-control form-control-lg" />
            </div>

            <div class="mb-3">
              <label class="form-label">Phone Number</label>
              <input v-model="phone" type="tel" required class="form-control form-control-lg" />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" required class="form-control form-control-lg" />
            </div>

            <div class="d-grid">
              <button :disabled="loading" type="submit" class="btn btn-pink btn-lg fw-bold">
                <span v-if="!loading">{{ buttonText }}</span>
                <span v-else>Creating account…</span>
              </button>
            </div>

            <div v-if="error" class="alert alert-danger mt-3 py-2">
              {{ error }}
            </div>

            <div v-if="success" class="alert alert-success mt-3 py-2">
              {{ success }}
            </div>

          </form>

          <hr class="my-4" />

          <div class="text-center small">
            Already have an account?
            <a @click.prevent="goToLogin" href="#">Login here</a>
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
import api from '@/api'

type Role = 'customer' | 'provider'

const route = useRoute()
const router = useRouter()

// Determine role from query
const rawRole = String(route.query.role || 'customer').toLowerCase()
const role = (['customer', 'provider'].includes(rawRole) ? rawRole : 'customer') as Role

// Form fields
const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)

// UI text
const titleText = computed(() => {
  return role === 'provider' ? 'Register Your Salon Account' : 'Create Your Customer Account'
})

const subtitleText = computed(() => {
  return role === 'provider'
    ? 'Join BeautyBook as a provider and manage your salon online.'
    : 'Join BeautyBook to book beauty services easily.'
})

const buttonText = computed(() => {
  return role === 'provider' ? 'Register as Provider' : 'Register as Customer'
})

// API endpoint based on role
const apiPath = computed(() => {
  return role === 'provider'
    ? '/api/auth/provider/register'
    : '/api/auth/customer/register'
})

// Submit form
const onSubmit = async () => {
  error.value = null
  success.value = null
  loading.value = true

  try {
    const payload = {
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value
    }

    const res = await api.post(apiPath.value, payload)

    success.value = res.data || 'Account created successfully!'

    // After short delay → redirect to login
    setTimeout(() => {
      router.push({ path: '/login', query: { role: role } })
    }, 1200)

  } catch (err: any) {
    if (err.response?.data) {
      error.value = typeof err.response.data === 'string'
        ? err.response.data
        : (err.response.data.message || 'Registration failed')
    } else {
      error.value = err.message || 'Registration failed'
    }
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push({ path: '/login', query: { role: role } })
}
</script>

<style scoped>
.btn-pink {
  background: linear-gradient(135deg, #ff6bd6, #ff8fab);
  border: none;
  color: white;
  transition: 0.2s;
}

.btn-pink[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

.card {
  border-radius: 16px;
}
</style>
