<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-6">
                <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="card-header bg-pink text-white text-center py-4">
                        <h2 class="fw-bold mb-0">Confirm Your Booking</h2>
                    </div>
                    <div class="card-body p-5">
                        <div class="text-center mb-4">
                            <i class="bi bi-check-circle-fill text-success fs-1"></i>
                        </div>

                        <div class="bg-light rounded-4 p-4 mb-4">
                            <h5 class="fw-bold">{{ booking.serviceName }}</h5>
                            <p class="mb-2">{{ booking.salonName }}</p>
                            <p class="text-muted">
                                <i class="bi bi-calendar"></i> {{ formatDate(booking.date) }} at {{ booking.time }}
                            </p>
                            <h4 class="text-pink fw-bold mt-3">₹{{ booking.price }}</h4>
                        </div>

                        <button @click="confirmBooking" class="btn btn-pink w-100 rounded-pill py-3 fw-bold fs-4">
                            Confirm & Pay ₹{{ booking.price }}
                        </button>

                        <p class="text-center text-muted small mt-3">
                            You won't be charged yet • Free cancellation
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()

const booking = ref({
    salonId: route.query.salonId,
    salonName: route.query.salonName,
    serviceId: route.query.serviceId,
    serviceName: route.query.serviceName,
    price: route.query.price,
    date: route.query.date,
    time: route.query.time
})

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

const confirmBooking = async () => {
    try {
        await api.post('/api/bookings', booking.value)
        router.push('/booking/success')
    } catch (err: any) {
        if (err.response?.status === 401) {
            alert('Please login to book')
            router.push(`/customer/login?redirect=/salon/${booking.value.salonId}`)
        }
    }
}
</script>

<style scoped>
.bg-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab) !important;
}
</style>