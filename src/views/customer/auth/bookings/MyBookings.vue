<template>
  <div class="container py-5">

    <h2 class="fw-bold mb-4">My Bookings</h2>

    <div v-if="loading" class="text-center py-5 text-muted">
      Loading your bookings...
    </div>

    <div v-else-if="bookings.length === 0" class="text-center py-5 text-muted">
      No bookings found.
    </div>

    <div v-else class="d-flex flex-column gap-4">

      <div v-for="b in bookings" :key="b.id" class="card shadow-sm p-4">

        <div class="d-flex justify-content-between align-items-center">
          <h4 class="fw-bold">{{ b.service.name }}</h4>
          <span :class="statusClass(b.status)" class="badge px-3 py-2 fs-6">
            {{ b.status }}
          </span>
        </div>

        <p class="mb-1 text-muted">{{ b.salon.name }}</p>
        <p class="fw-bold">₹{{ b.price }}</p>

        <div class="mt-3">
          <strong>Date:</strong> {{ b.date }} <br />
          <strong>Time:</strong> {{ b.time }}
        </div>

      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/api";

const bookings = ref<any[]>([]);
const loading = ref(false);

const statusClass = (status: string) => {
  switch (status) {
    case "PENDING": return "bg-secondary";
    case "CONFIRMED": return "bg-info text-dark";
    case "IN_PROGRESS": return "bg-warning text-dark";
    case "COMPLETED": return "bg-success";
    case "CANCELLED": return "bg-danger";
    default: return "bg-dark";
  }
};

const loadBookings = async () => {
  loading.value = true;
  try {
    const customerId = Number(localStorage.getItem("userId"));
    const res = await api.get(`/api/bookings/customer?customerId=${customerId}`);
    bookings.value = res.data;
  } catch (err) {
    console.error(err);
  }
  loading.value = false;
};

onMounted(loadBookings);
</script>

<style scoped>
.card {
  border-radius: 12px;
}

.badge {
  font-size: 0.9rem;
  border-radius: 30px;
}
</style>
