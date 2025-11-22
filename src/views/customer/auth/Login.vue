<!-- src/views/auth/Register.vue -->
<template>
    <div class="min-vh-100 bg-gradient d-flex align-items-center">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-5 col-md-7">
                    <div class="card shadow-lg border-0 rounded-4">
                        <div class="card-body p-5">

                            <div class="text-center mb-5">
                                <h1 class="fw-bold text-success display-5">Join as Salon Owner</h1>
                                <p class="text-muted">Create your salon account and wait for admin approval</p>
                            </div>

                            <form @submit.prevent="register">

                                <div class="mb-3">
                                    <input v-model="form.name" type="text"
                                        class="form-control form-control-lg rounded-3" placeholder="Your Full Name"
                                        required />
                                </div>

                                <div class="mb-3">
                                    <input v-model="form.email" type="email"
                                        class="form-control form-control-lg rounded-3" placeholder="Email Address"
                                        required />
                                </div>

                                <div class="mb-3">
                                    <input v-model="form.phone" type="text"
                                        class="form-control form-control-lg rounded-3" placeholder="Phone Number"
                                        required />
                                </div>

                                <div class="mb-4">
                                    <input v-model="form.password" type="password"
                                        class="form-control form-control-lg rounded-3" placeholder="Create Password"
                                        required minlength="6" />
                                </div>

                                <button type="submit" class="btn btn-success w-100 btn-lg rounded-3 mb-3"
                                    :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                                    {{ loading ? 'Creating Account...' : 'Register as Provider' }}
                                </button>

                                <!-- SUCCESS MESSAGE -->
                                <div v-if="success" class="alert alert-success rounded-3 text-center">
                                    <strong>Registration successful!</strong><br>
                                    Your account is pending admin approval. You can log in once approved.
                                </div>

                                <!-- ERROR MESSAGE -->
                                <div v-if="error" class="alert alert-danger rounded-3">{{ error }}</div>

                                <div class="text-center mt-4">
                                    <router-link to="/login" class="text-decoration-none">
                                        Already have an account? <strong>Sign In</strong>
                                    </router-link>
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const loading = ref(false);
const success = ref(false);
const error = ref("");

const form = ref({
    name: "",
    email: "",
    phone: "",
    password: "",
});

const register = async () => {
    loading.value = true;
    error.value = "";
    success.value = false;

    try {
        await axios.post("http://localhost:8080/api/auth/provider/register", {
            name: form.value.name,
            email: form.value.email,
            phone: form.value.phone,
            password: form.value.password,
        });

        success.value = true;

        // Redirect after success
        setTimeout(() => router.push("/login"), 3000);

    } catch (e: any) {
        error.value = e.response?.data || "Registration failed";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.bg-gradient {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}
</style>
