<template>
    <div class="min-vh-100 bg-light d-flex align-items-center">
        <div class="container text-center py-5">
            <i class="bi bi-check-circle-fill text-success fs-1 mb-4" style="font-size: 5rem;"></i>
            <h1 class="display-4 fw-bold mb-3">Booking Confirmed!</h1>
            <p class="lead text-muted mb-5">We've sent confirmation to your phone & email</p>
            <div class="card mx-auto" style="max-width: 500px;">
                <div class="card-body text-start">
                    <h5>You're booked for:</h5>
                    <p class="fw-bold fs-4">{{ booking.serviceName }}</p>
                    <p>At <strong>{{ booking.salonName }}</strong></p>
                    <p class="text-pink fw-bold">
                        {{ formatDate(booking.date) }} at {{ booking.time }}
                    </p>
                </div>
            </div>
            <div class="mt-5">
                <router-link to="/" class="btn btn-pink rounded-pill px-5 py-3 fw-bold">
                    Back to Home
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
const booking = ref(route.query)
const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
</script>