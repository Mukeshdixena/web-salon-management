<template>
    <div class="min-vh-100 bg-light d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">

                        <div class="card-header bg-pink text-white text-center py-4">
                            <h3 class="fw-bold mb-0">Create Account</h3>
                        </div>

                        <div class="card-body p-5">

                            <form @submit.prevent="register">

                                <div class="mb-4">
                                    <input v-model="form.name" type="text"
                                        class="form-control form-control-lg rounded-pill" placeholder="Full Name"
                                        required>
                                </div>

                                <div class="mb-4">
                                    <input v-model="form.email" type="email"
                                        class="form-control form-control-lg rounded-pill" placeholder="Email address"
                                        required>
                                </div>

                                <div class="mb-4">
                                    <input v-model="form.phone" type="text"
                                        class="form-control form-control-lg rounded-pill" placeholder="Phone Number"
                                        required>
                                </div>

                                <div class="mb-4">
                                    <input v-model="form.password" type="password"
                                        class="form-control form-control-lg rounded-pill" placeholder="Password"
                                        required>
                                </div>

                                <button type="submit"
                                    class="btn btn-pink w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm"
                                    :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                    {{ loading ? 'Creating Your Account...' : 'Sign Up' }}
                                </button>

                            </form>

                            <!-- SUCCESS MESSAGE -->
                            <div v-if="success" class="alert alert-success mt-4 text-center rounded-3">
                                <strong>Account created successfully!</strong><br>
                                You can now log in.
                            </div>

                            <!-- ERROR MESSAGE -->
                            <div v-if="error" class="alert alert-danger mt-4 rounded-3 text-center">
                                {{ error }}
                            </div>

                            <div class="text-center mt-4">
                                <p class="mb-0">
                                    Already have an account?
                                    <router-link to="/customer/login" class="text-pink fw-bold">Login</router-link>
                                </p>
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
const loading = ref(false)
const success = ref(false)
const error = ref('')

const form = ref({
    name: '',
    email: '',
    phone: '',
    password: ''
})

const register = async () => {
    loading.value = true
    success.value = false
    error.value = ''

    try {
        await axios.post('http://localhost:8080/api/auth/customer/register', {
            name: form.value.name,
            email: form.value.email,
            phone: form.value.phone,
            password: form.value.password
        })

        success.value = true
        setTimeout(() => router.push('/customer/login'), 2500)

    } catch (e: any) {
        error.value = e.response?.data || 'Registration failed'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.bg-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab) !important;
}

.btn-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab);
    border: none;
    color: white;
}
</style>
