<template>
    <div>
        <h2 class="fw-bold mb-4">Earnings Overview</h2>

        <div class="card border-0 shadow-sm rounded-4 p-4">
            <div class="row text-center mb-4">
                <div class="col-md-4">
                    <h3 class="fw-bold text-pink">₹{{ totalEarnings }}</h3>
                    <p class="text-muted">Total Earnings</p>
                </div>
                <div class="col-md-4">
                    <h3 class="fw-bold text-success">₹{{ thisMonth }}</h3>
                    <p class="text-muted">This Month</p>
                </div>
                <div class="col-md-4">
                    <h3 class="fw-bold text-primary">₹{{ today }}</h3>
                    <p class="text-muted">Today</p>
                </div>
            </div>

            <canvas ref="chart"></canvas>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const totalEarnings = ref(0)
const thisMonth = ref(0)
const today = ref(0)
const chart = ref<HTMLCanvasElement>()

onMounted(async () => {
    const res = await api.get('/api/provider/earnings')
    totalEarnings.value = res.data.total
    thisMonth.value = res.data.month
    today.value = res.data.today

    new Chart(chart.value!, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Earnings (₹)',
                data: res.data.chart,
                borderColor: '#ff6bd6',
                backgroundColor: 'rgba(255,107,214,0.1)',
                tension: 0.4
            }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    })
})
</script>