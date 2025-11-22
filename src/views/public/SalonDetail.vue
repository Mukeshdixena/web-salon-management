<template>
    <div class="container py-5" v-if="salon">
        <h1 class="fw-bold mb-3">{{ salon.name }}</h1>
        <p class="text-muted">{{ salon.address }}</p>

        <img :src="salon.image" class="img-fluid rounded mb-4" alt="Salon" />

        <h3 class="fw-bold mt-4">Services</h3>

        <div v-if="loading" class="py-4 text-center">Loading services...</div>

        <div v-else>
            <div v-for="service in services" :key="service.id"
                class="card my-3 p-3 shadow-sm d-flex flex-row justify-content-between align-items-center">

                <div>
                    <h5 class="fw-bold">{{ service.name }}</h5>
                    <p class="mb-1 text-muted">Duration: {{ service.duration }} min</p>
                    <p class="fw-bold">₹{{ service.price }}</p>
                </div>

                <button class="btn btn-pink" @click="goToBooking(service)">
                    Book Now
                </button>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/api";

const route = useRoute();
const router = useRouter();

const salonId = Number(route.params.id);
const salon = ref<any>(null);
const services = ref<any[]>([]);
const loading = ref(false);

const loadSalonServices = async () => {
    loading.value = true;
    try {
        const res = await api.get(`/api/salons/${salonId}/services`);
        services.value = res.data;
    } catch (err) {
        console.error(err);
    }
    loading.value = false;
};

const goToBooking = (service: any) => {
    router.push({
        path: "/booking/confirm",
        query: {
            salonId: salonId,
            serviceId: service.id,
        },
    });
};

onMounted(async () => {
    // If you have a salon API use it here. Using sample fallback:
    salon.value = {
        id: salonId,
        name: "Sample Salon",
        address: "Bangalore, MG Road",
        image: "https://images.unsplash.com/photo-1595475038784-b3f97102f1f8?w=1600&q=80"
    };

    await loadSalonServices();
});
</script>

<style scoped>
.btn-pink {
    background: #ff6bd6;
    border: none;
    color: white;
}
</style>
