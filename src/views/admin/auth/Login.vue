<template>
    <div class="min-vh-100 bg-dark d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-5">
                    <div class="card bg-black text-white border-pink shadow-lg rounded-4">
                        <div class="card-body p-5 text-center">
                            <h1 class="fw-bold mb-5">Admin Panel</h1>

                            <form @submit.prevent="login">
                                <input v-model="email" type="email"
                                    class="form-control form-control-lg rounded-pill mb-4" placeholder="Admin Email">

                                <input v-model="password" type="password"
                                    class="form-control form-control-lg rounded-pill mb-4" placeholder="Password">

                                <button type="submit" class="btn btn-pink w-100 rounded-pill py-3 fw-bold">
                                    Login as Admin
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
import { useAdminStore } from '@/stores/admin'

const email = ref('')
const password = ref('')
const router = useRouter()
const adminStore = useAdminStore()

const login = async () => {
    const ok = await adminStore.login(email.value, password.value)
    if (ok) router.push('/admin/dashboard')
}
</script>

<style scoped>
.border-pink {
    border: 3px solid #ff6bd6 !important;
}

.btn-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab);
    border: none;
    color: white;
}

.bg-black {
    background: #111 !important;
}
</style>
