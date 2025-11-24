<template>
  <div class="min-vh-100 d-flex align-items-center bg-light">
    <div class="container" style="max-width: 540px;">

      <!-- Role Selection -->
      <div v-if="!selectedRole" class="text-center">
        <h2 class="fw-bold mb-4">Choose Login Type</h2>

        <div class="d-grid gap-3">
          <button class="btn btn-lg btn-outline-dark" @click="selectRole('customer')">
            Customer Login / Register
          </button>

          <button class="btn btn-lg btn-outline-primary" @click="selectRole('provider')">
            Provider Login / Register
          </button>

          <button class="btn btn-lg btn-outline-danger" @click="selectRole('admin')">
            Admin Login
          </button>
        </div>

        <div class="text-center mt-4 text-muted small">
          <router-link to="/">← Back to home</router-link>
        </div>
      </div>

      <!-- Auth Form -->
      <div v-else class="card rounded-4 shadow-sm border-0 overflow-hidden">
        <div class="card-body p-5">

          <!-- Back button -->
          <button class="btn btn-sm btn-link px-0 mb-3" @click="resetRole">
            ← Choose different role
          </button>

          <!-- Title -->
          <h3 class="fw-bold mb-1">{{ titleText }}</h3>
          <p class="text-muted mb-2">{{ subtitleText }}</p>

          <!-- Small current role note -->
          <p class="text-muted small mb-4">
            You are {{ isLogin ? 'logging in' : 'registering' }} as {{ selectedRoleLabel }}
          </p>

          <!-- FORM -->
          <form @submit.prevent="onSubmit" autocomplete="off" novalidate>

            <!-- FULL NAME for register only -->
            <div v-if="!isLogin" class="mb-3">
              <label class="form-label">Full Name</label>
              <input v-model="name" type="text" required class="form-control form-control-lg" />
            </div>

            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" required class="form-control form-control-lg" />
            </div>

            <div class="mb-3">
              <label class="form-label">Password</label>
              <input v-model="password" type="password" required class="form-control form-control-lg" />
            </div>

            <!-- Confirm Password -->
            <div v-if="!isLogin" class="mb-3">
              <label class="form-label">Confirm Password</label>
              <input v-model="confirmPassword" type="password" required class="form-control form-control-lg" />
            </div>

            <!-- Button -->
            <div class="d-grid">
              <button :disabled="loading" type="submit" class="btn btn-pink btn-lg fw-bold">
                <span v-if="!loading">{{ buttonText }}</span>
                <span v-else>{{ isLogin ? 'Signing in…' : 'Creating account…' }}</span>
              </button>
            </div>

            <div v-if="error" class="alert alert-danger mt-3 py-2" role="alert">
              {{ error }}
            </div>
          </form>

          <hr class="my-4" />

          <!-- Bottom Switch Text -->
          <div class="text-center small">
            <span v-if="isLogin && selectedRole !== 'admin'">
              Don't have an account?
              <a href="#" @click.prevent="switchToRegister">Register</a>
            </span>

            <span v-else-if="!isLogin">
              Already have an account?
              <a href="#" @click.prevent="switchToLogin">Sign in</a>
            </span>

            <span v-else-if="selectedRole === 'admin'">
              Admin access is restricted to authorized users only.
            </span>
          </div>

        </div>
      </div>

      <!-- Back to home -->
      <div v-if="selectedRole" class="text-center mt-3 text-muted small">
        <router-link to="/">← Back to home</router-link>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/api'

type Role = 'customer' | 'provider' | 'admin'

const router = useRouter()

// State
const selectedRole = ref<Role | null>(null)
const isLogin = ref(true)

// Form fields
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// Selecting role
const selectRole = (role: Role) => {
  selectedRole.value = role
}

// Reset selection
const resetRole = () => {
  selectedRole.value = null
  isLogin.value = true
  name.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
}

// Labels
const selectedRoleLabel = computed(() => {
  if (selectedRole.value === 'customer') return 'Customer'
  if (selectedRole.value === 'provider') return 'Provider'
  return 'Admin'
})

const titleText = computed(() => {
  if (isLogin.value) {
    if (selectedRole.value === 'admin') return 'Admin Sign in'
    if (selectedRole.value === 'provider') return 'Provider Sign in'
    return 'Customer Sign in'
  }

  if (selectedRole.value === 'provider') return 'Register Your Salon'
  return 'Create Your Account'
})

const subtitleText = computed(() => {
  if (isLogin.value) {
    if (selectedRole.value === 'admin') return 'Access the admin dashboard'
    if (selectedRole.value === 'provider') return 'Manage your salon and services'
    return 'Book salons and manage your appointments'
  }

  if (selectedRole.value === 'provider') return 'Grow your business on our platform'
  return 'Join and start booking salons'
})

const buttonText = computed(() =>
  isLogin.value
    ? `Sign in as ${selectedRoleLabel.value}`
    : `Register as ${selectedRoleLabel.value}`
)

// API paths
const apiPath = computed(() => {
  if (isLogin.value) {
    if (selectedRole.value === 'admin') return '/api/auth/admin/login'
    if (selectedRole.value === 'provider') return '/api/auth/provider/login'
    return '/api/auth/customer/login'
  } else {
    if (selectedRole.value === 'provider') return '/api/auth/provider/register'
    return '/api/auth/customer/register'
  }
})

// Submit Login/Register
const onSubmit = async () => {
  error.value = null
  loading.value = true

  try {
    if (!isLogin.value && password.value !== confirmPassword.value) {
      throw new Error('Passwords do not match')
    }

    const payload = isLogin.value
      ? { email: email.value.trim(), password: password.value }
      : { name: name.value.trim(), email: email.value.trim(), password: password.value }

    const res = await api.post(apiPath.value, payload)
    const data = res.data

    if (isLogin.value) {
      if (!data.token) throw new Error('Invalid server response')

      const role = String(data.role).toUpperCase()

      localStorage.setItem('token', data.token)
      localStorage.setItem('role', role)
      localStorage.setItem('userId', String(data.userId ?? ''))

      localStorage.setItem(
        'user',
        JSON.stringify({
          id: data.userId,
          name: data.name,
          email: data.email,
          role
        })
      )

      if (role === 'ADMIN') router.push('/admin/dashboard')
      else if (role === 'PROVIDER') router.push('/provider/dashboard')
      else router.push('/customer/dashboard')
    } else {
      // Registration successful
      isLogin.value = true
      error.value = 'Account created successfully. Please log in.'
    }

  } catch (err: any) {
    error.value = err.response?.data?.message || err.message || 'Action failed'
  } finally {
    loading.value = false
  }
}

// Switch between Login/Register
const switchToRegister = () => (isLogin.value = false)
const switchToLogin = () => (isLogin.value = true)
</script>

<style scoped>
.btn-pink {
  background: linear-gradient(135deg, #ff6bd6, #ff8fab);
  border: none;
  color: white;
  transition: all 0.2s;
}
</style>
