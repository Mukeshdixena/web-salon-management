<template>
    <div class="min-vh-100 bg-light d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
                        <div class="card-header bg-pink text-white text-center py-4">
                            <h3 class="fw-bold mb-0">Welcome Back!</h3>
                        </div>
                        <div class="card-body p-5">
                            <form @submit.prevent="login">
                                <div class="mb-4">
                                    <input v-model="email" type="email"
                                        class="form-control form-control-lg rounded-pill" placeholder="Email address"
                                        required>
                                </div>
                                <div class="mb-4">
                                    <input v-model="password" type="password"
                                        class="form-control form-control-lg rounded-pill" placeholder="Password"
                                        required>
                                </div>
                                <button type="submit"
                                    class="btn btn-pink w-100 rounded-pill py-3 fw-bold fs-5 shadow-sm">
                                    Login
                                </button>
                            </form>
                            <div class="text-center mt-4">
                                <p class="mb-0">
                                    Don't have an account?
                                    <router-link to="/customer/signup" class="text-pink fw-bold">Sign Up</router-link>
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

const email = ref('')
const password = ref('')
const router = useRouter()

const login = () => {
    // TODO: Connect to real API later
    alert('Customer login successful!')
    router.push('/')
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

.btn-pink:hover {
    background: linear-gradient(135deg, #ff4ac6, #ff7a9b);
}
</style>