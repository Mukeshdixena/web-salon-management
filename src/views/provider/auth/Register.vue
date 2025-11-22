<template>
    <div class="min-vh-100 bg-light d-flex align-items-center">
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow-lg border-0 rounded-4">
                        <div class="card-body p-5">
                            <h3 class="text-center fw-bold mb-5">Register Your Salon</h3>
                            <form @submit.prevent="register">
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <input v-model="form.salonName" type="text"
                                            class="form-control form-control-lg rounded-pill" placeholder="Salon Name"
                                            required>
                                    </div>
                                    <div class="col-md-6">
                                        <input v-model="form.ownerName" type="text"
                                            class="form-control form-control-lg rounded-pill" placeholder="Your Name"
                                            required>
                                    </div>
                                    <div class="col-md-6">
                                        <input v-model="form.email" type="email"
                                            class="form-control form-control-lg rounded-pill" placeholder="Email"
                                            required>
                                    </div>
                                    <div class="col-md-6">
                                        <input v-model="form.phone" type="text"
                                            class="form-control form-control-lg rounded-pill" placeholder="Phone"
                                            required>
                                    </div>
                                    <div class="col-12">
                                        <textarea v-model="form.address" class="form-control rounded-3" rows="3"
                                            placeholder="Full Address" required></textarea>
                                    </div>
                                    <div class="col-md-6">
                                        <input v-model="form.password" type="password"
                                            class="form-control form-control-lg rounded-pill" placeholder="Password"
                                            required>
                                    </div>
                                    <div class="col-md-6">
                                        <input v-model="form.confirmPassword" type="password"
                                            class="form-control form-control-lg rounded-pill"
                                            placeholder="Confirm Password" required>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-pink w-100 rounded-pill py-3 mt-5 fw-bold fs-4">
                                    Register Salon
                                </button>
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

const form = ref({
    salonName: '', ownerName: '', email: '', phone: '', address: '', password: '', confirmPassword: ''
})
const router = useRouter()

const register = () => {
    alert('Salon registered! Waiting for admin approval.')
    router.push('/provider/login')
}
</script>

<style scoped>
.btn-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab);
    border: none;
    color: white;
}
</style>