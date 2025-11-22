<template>
    <div class="container py-4">

        <h2 class="fw-bold mb-4">Provider Dashboard</h2>

        <!-- STAT CARDS -->
        <div class="row g-4 mb-4">
            <div class="col-md-3" v-for="card in stats" :key="card.title">
                <div class="card shadow-sm p-4 text-center rounded-4">
                    <div class="fs-3 mb-2">
                        <i :class="card.icon"></i>
                    </div>
                    <h4 class="fw-bold">{{ card.value }}</h4>
                    <p class="text-muted">{{ card.title }}</p>
                </div>
            </div>
        </div>

        <!-- TODAY'S QUEUE -->
        <div class="card shadow-sm p-4 rounded-4">
            <h4 class="fw-bold mb-3">Today's Queue</h4>

            <div v-if="loading" class="text-center py-3 text-muted">
                Loading queue...
            </div>

            <table v-else class="table table-hover align-middle">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Service</th>
                        <th>Time</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(q, index) in queue" :key="q.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ q.customer.name }}</td>
                        <td>{{ q.service.name }}</td>
                        <td>{{ q.time }}</td>

                        <td>
                            <span :class="statusClass(q.status)" class="badge px-3 py-2">
                                {{ q.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="queue.length === 0" class="text-center text-muted py-3">
                No bookings today.
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/api";

const queue = ref<any[]>([]);
const loading = ref(false);

// Dashboard stats (auto-updated after API load)
const stats = ref([
    { title: "Today's Bookings", value: 0, icon: "bi bi-list-check" },
    { title: "In Progress", value: 0, icon: "bi bi-hourglass-split" },
    { title: "Completed Today", value: 0, icon: "bi bi-check-circle" },
    { title: "Today's Earnings", value: "₹0", icon: "bi bi-currency-rupee" },
]);

// Status color helper
const statusClass = (status: string) => {
    switch (status) {
        case "PENDING": return "bg-secondary";
        case "IN_PROGRESS": return "bg-warning text-dark";
        case "COMPLETED": return "bg-success";
        default: return "bg-dark";
    }
};

const loadQueue = async () => {
    loading.value = true;
    try {
        const res = await api.get("/api/provider/today-queue");
        queue.value = res.data;

        // Auto Update Stats
        stats.value[0].value = queue.value.length;                               // total bookings
        stats.value[1].value = queue.value.filter(q => q.status === "IN_PROGRESS").length;
        stats.value[2].value = queue.value.filter(q => q.status === "COMPLETED").length;

        // Earnings (sum of price of completed)
        const totalEarnings = queue.value
            .filter(q => q.status === "COMPLETED")
            .reduce((sum, q) => sum + q.price, 0);

        stats.value[3].value = "₹" + totalEarnings;

    } catch (err) {
        console.error(err);
    }
    loading.value = false;
};

onMounted(() => {
    loadQueue();
});
</script>

<style scoped>
.card {
    border-radius: 16px;
}

.badge {
    border-radius: 12px;
    font-size: 0.85rem;
}
</style>
