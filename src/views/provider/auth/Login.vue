<template>
    <div class="min-vh-100 bg-light d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card shadow-lg border-0 rounded-4">
                        <div class="card-body p-5">
                            <h3 class="text-center fw-bold mb-4">Salon Owner Login</h3>
                            <form @submit.prevent="login">
                                <div class="mb-4">
                                    <input v-model="email" type="email"
                                        class="form-control form-control-lg rounded-pill" placeholder="Email" required>
                                </div>
                                <div class="mb-4">
                                    <input v-model="password" type="password"
                                        class="form-control form-control-lg rounded-pill" placeholder="Password"
                                        required>
                                </div>
                                <button type="submit" class="btn btn-pink w-100 rounded-pill py-3 fw-bold">
                                    Login as Provider
                                </button>
                            </form>
                            <p class="text-center mt-4 small">
                                New salon? <router-link to="/provider/register" class="text-pink fw-bold">Register
                                    here</router-link>
                            </p>
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
import { useProviderStore } from '@/stores/provider'

const email = ref('demo@salon.com')
const password = ref('123456')
const router = useRouter()
const providerStore = useProviderStore()

const login = async () => {
    await providerStore.login(email.value, password.value)
    router.push('/provider/dashboard')
}
</script>

<style scoped>
.btn-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab);
    border: none;
    color: white;
}
</style>