<template>
    <div>
        <h2 class="fw-bold mb-4">Platform Revenue</h2>
        <div class="card bg-dark p-5 rounded-4 shadow">
            <h1 class="text-pink fw-bold text-center mb-4">₹{{ totalRevenue }}</h1>
            <canvas ref="chart"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const totalRevenue = ref(0)
const chart = ref<HTMLCanvasElement>()

onMounted(async () => {
    const res = await api.get('/api/admin/revenue')
    totalRevenue.value = res.data.total

    new Chart(chart.value!, {
        type: 'bar',
        data: {
            labels: res.data.months,
            datasets: [{
                label: 'Revenue (₹)',
                data: res.data.values,
                backgroundColor: '#ff6bd6'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } }
        }
    })
})
</script>