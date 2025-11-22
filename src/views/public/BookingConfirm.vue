<template>
  <div class="container py-5">
    <h2 class="fw-bold mb-4">Confirm Your Booking</h2>

    <div class="card p-4 shadow-sm">

      <!-- Date -->
      <label class="fw-bold mb-1">Select Date</label>
      <input type="date" class="form-control mb-3" v-model="date" @change="loadSlots" />

      <!-- Time Slots -->
      <label class="fw-bold mb-1">Select Time Slot</label>

      <div v-if="loadingSlots" class="text-muted mb-3">Loading slots...</div>

      <div class="d-flex flex-wrap gap-2 mb-3">
        <button
          v-for="slot in slots"
          :key="slot"
          @click="selectedTime = slot"
          class="btn"
          :class="selectedTime === slot ? 'btn-primary' : 'btn-outline-secondary'"
        >
          {{ slot }}
        </button>
      </div>

      <button class="btn btn-success w-100 py-3 fw-bold"
              :disabled="!selectedTime || !date"
              @click="confirmBooking">
        Confirm Booking
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

const salonId = Number(route.query.salonId);
const serviceId = Number(route.query.serviceId);

const date = ref("");
const selectedTime = ref("");
const slots = ref<string[]>([]);
const loadingSlots = ref(false);

const loadSlots = async () => {
  if (!date.value) return;

  loadingSlots.value = true;
  try {
    const res = await api.get(`/api/bookings/slots`, {
      params: {
        salonId,
        serviceId,
        date: date.value,
      },
    });
    slots.value = res.data;
  } catch (err) {
    console.error(err);
  }
  loadingSlots.value = false;
};

const confirmBooking = async () => {
  try {
    const customerId = Number(localStorage.getItem("userId"));

    const res = await api.post("/api/bookings/create", {
      customerId,
      salonId,
      serviceId,
      date: date.value,
      time: selectedTime.value,
    });

    const bookingId = res.data;

    router.push(`/booking/success?id=${bookingId}`);
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => {
  // required but empty
});
</script>
