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
                                    <input v-model="name" type="text" class="form-control form-control-lg rounded-pill"
                                        placeholder="Full Name" required>
                                </div>
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
                                    Sign Up
                                </button>
                            </form>
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

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = () => {
    alert('Account created! Welcome to BeautyBook')
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
</style>