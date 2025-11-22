<template>
    <div class="container py-5" v-if="booking">
        <div class="card shadow p-5 text-center">

            <h2 class="fw-bold text-success mb-3">Booking Confirmed!</h2>
            <p class="text-muted">Your booking has been successfully created.</p>

            <hr />

            <h4 class="fw-bold">{{ booking.service.name }}</h4>
            <p class="mb-1">{{ booking.salon.name }}</p>

            <p class="fw-bold">Date: {{ booking.date }}</p>
            <p class="fw-bold">Time: {{ booking.time }}</p>

            <button class="btn btn-primary mt-4" @click="goToBookings">
                View My Bookings
            </button>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api";

const route = useRoute();
const router = useRouter();

const bookingId = Number(route.query.id);
const booking = ref<any>(null);

const loadBooking = async () => {
    try {
        const res = await api.get(`/api/bookings/${bookingId}`);
        booking.value = res.data;
    } catch (err) {
        console.error(err);
    }
};

const goToBookings = () => {
    router.push("/customer/bookings");
};

onMounted(loadBooking);
</script>

<style scoped>
.card {
    max-width: 500px;
    margin: 0 auto;
}
</style>
