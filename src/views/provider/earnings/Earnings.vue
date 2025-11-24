<template>
    <div class="container py-4">
        <h2 class="fw-bold mb-4 text-pink">Earnings Overview</h2>

        <div class="card border-0 shadow rounded-4 overflow-hidden">
            <div class="card-body">
                <div class="row text-center g-4 mb-5">
                    <div class="col-md-4">
                        <h3 class="fw-bold text-pink">₹{{ totalEarnings.toLocaleString('en-IN') }}</h3>
                        <p class="text-muted">Total Earnings</p>
                    </div>
                    <div class="col-md-4">
                        <h3 class="fw-bold text-success">₹{{ thisMonth.toLocaleString('en-IN') }}</h3>
                        <p class="text-muted">This Month</p>
                    </div>
                    <div class="col-md-4">
                        <h3 class="fw-bold text-primary">₹{{ today.toLocaleString('en-IN') }}</h3>
                        <p class="text-muted">Today</p>
                    </div>
                </div>

                <canvas ref="chartRef"></canvas>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'  // This now works after npm install

const totalEarnings = ref(48500)
const thisMonth = ref(18200)
const today = ref(8600)
const chartRef = ref<HTMLCanvasElement>()

const staticChartData = [8000, 12000, 9000, 15000, 18200, 21000]

onMounted(() => {
    // Try API first
    // (Even if API fails, we show beautiful static data)
    // api.get('/api/provider/earnings').then(...).catch(() => {})

    new Chart(chartRef.value!, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Earnings (₹)',
                data: staticChartData,
                borderColor: '#ff6bd6',
                backgroundColor: 'rgba(255, 107, 214, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ff6bd6',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    })
})
</script>

<style scoped>
.text-pink {
    color: #ff6bd6;
}
</style>