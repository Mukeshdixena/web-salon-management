<template>
    <div class="container py-5">
        <div class="row g-5">
            <!-- Left: Info + Services -->
            <div class="col-lg-8">
                <div class="d-flex align-items-center mb-4">
                    <img :src="salon.image" class="rounded-3 me-4" style="width:120px;height:120px;object-fit:cover;">
                    <div>
                        <h1 class="fw-bold mb-1">{{ salon.name }}</h1>
                        <p class="text-muted mb-1">
                            <i class="bi bi-geo-alt-fill text-pink"></i> {{ salon.address }}
                        </p>
                        <div>
                            <i class="bi bi-star-fill text-warning"></i>
                            <strong>{{ salon.rating }} ({{ salon.reviews }} reviews)</strong>
                            • <span class="text-success">Open Now</span>
                        </div>
                    </div>
                </div>

                <hr>

                <h3 class="fw-bold mb-4">Services</h3>
                <div class="row g-4">
                    <div v-for="service in salon.services" :key="service.id" class="col-md-6">
                        <div @click="selectService(service)"
                            :class="{ 'border-pink': selectedService?.id === service.id }"
                            class="card border shadow-sm rounded-4 p-4 cursor-pointer hover-lift">
                            <h5 class="fw-bold mb-2">{{ service.name }}</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <p class="text-muted small mb-1">{{ service.duration }} min</p>
                                    <p class="h4 fw-bold text-pink mb-0">₹{{ service.price }}</p>
                                </div>
                                <i v-if="selectedService?.id === service.id"
                                    class="bi bi-check-circle-fill text-pink fs-3"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Calendar + Time Slots -->
            <div class="col-lg-4">
                <div class="sticky-top" style="top: 100px;">
                    <div v-if="selectedService" class="card border-0 shadow-lg rounded-4 p-4">
                        <h5 class="fw-bold mb-3">Select Date & Time</h5>

                        <!-- Calendar (Simple) -->
                        <div class="mb-4">
                            <input type="date" v-model="selectedDate"
                                class="form-control form-control-lg rounded-pill text-center">
                        </div>

                        <!-- Time Slots -->
                        <div class="row g-2">
                            <div v-for="slot in availableSlots" :key="slot" class="col-4">
                                <button @click="selectedSlot = slot"
                                    :class="{ 'btn-pink text-white': selectedSlot === slot, 'btn-outline-secondary': selectedSlot !== slot }"
                                    class="btn btn-sm w-100 rounded-pill py-3" :disabled="!slotAvailable(slot)">
                                    {{ slot }}
                                </button>
                            </div>
                        </div>

                        <button @click="proceedToBooking" :disabled="!selectedSlot"
                            class="btn btn-pink w-100 rounded-pill mt-4 py-3 fw-bold fs-5 shadow-lg">
                            Book Now • ₹{{ selectedService.price }}
                        </button>
                    </div>

                    <div v-else class="text-center py-5 text-muted">
                        <i class="bi bi-hand-index fs-1"></i>
                        <p class="mt-3">Please select a service</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'

const route = useRoute()
const router = useRouter()
const salonId = route.params.id

const salon = ref<any>({})
const selectedService = ref<any>(null)
const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedSlot = ref<string>('')
const availableSlots = ref(['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'])

const selectService = (service: any) => {
    selectedService.value = service
    selectedSlot.value = ''
}

const slotAvailable = (slot: string) => {
    // In real app: check API
    return Math.random() > 0.3
}

const proceedToBooking = () => {
    router.push({
        path: '/booking/confirm',
        query: {
            salonId: salon.value.id,
            salonName: salon.value.name,
            serviceId: selectedService.value.id,
            serviceName: selectedService.value.name,
            price: selectedService.value.price,
            date: selectedDate.value,
            time: selectedSlot.value
        }
    })
}

onMounted(async () => {
    const res = await api.get(`/api/salons/${salonId}`)
    salon.value = res.data
})
</script>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.hover-lift {
    transition: all 0.3s;
}

.hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12) !important;
}

.border-pink {
    border: 3px solid #ff6bd6 !important;
}

.btn-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab);
    border: none;
}

.btn-pink:hover {
    background: linear-gradient(135deg, #ff4ac6, #ff7a9b);
}
</style>