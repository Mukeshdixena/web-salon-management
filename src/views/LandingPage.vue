<template>
    <div class="min-vh-100 d-flex flex-column">

        <!-- NAVBAR -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
            <div class="container">
                <a class="navbar-brand fw-bold fs-3 text-pink" href="#">
                    <i class="bi bi-scissors me-2"></i>BeautyBook
                </a>

                <div class="d-flex align-items-center gap-3">
                    <!-- Customer Login / Signup -->
                    <div class="dropdown" v-if="!isCustomerLoggedIn">
                        <button class="btn btn-outline-pink rounded-pill px-4" data-bs-toggle="dropdown">
                            <i class="bi bi-person me-1"></i> Customer
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 py-3">
                            <li>
                                <button @click="goToCustomerLogin" class="dropdown-item py-2">
                                    <i class="bi bi-box-arrow-in-right text-pink"></i> Login
                                </button>
                            </li>
                            <li>
                                <button @click="goToCustomerSignup" class="dropdown-item py-2">
                                    <i class="bi bi-person-plus text-pink"></i> Create Account
                                </button>
                            </li>
                        </ul>
                    </div>

                    <button v-else class="btn btn-pink rounded-pill px-4">
                        <i class="bi bi-person-check"></i> Hi, {{ customerName }}
                    </button>
                </div>
            </div>
        </nav>

        <!-- HERO -->
        <section class="hero flex-grow-1 position-relative overflow-hidden">
            <div class="hero-bg"></div>
            <div class="container h-100 position-relative z-3 d-flex align-items-center">
                <div class="row align-items-center flex-grow-1">
                    <div class="col-lg-6 text-white">
                        <h1 class="display-3 fw-bold mb-4">
                            Find Your Perfect Salon
                        </h1>
                        <p class="lead fs-4 mb-5 opacity-90">
                            Discover nearby salons and book your beauty services in seconds
                        </p>
                        <div class="d-flex flex-column flex-sm-row gap-3">
                            <button @click="scrollToSalons" class="btn btn-light btn-lg rounded-pill px-5 shadow-lg">
                                Explore Salons
                            </button>
                            <button @click="goToCustomerSignup" class="btn btn-outline-light btn-lg rounded-pill px-5">
                                Get Started Free
                            </button>
                        </div>
                    </div>
                    <div class="col-lg-6 text-center mt-5 mt-lg-0">
                        <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&q=80"
                            class="img-fluid rounded-4 shadow-lg" alt="Salon">
                    </div>
                </div>
            </div>
        </section>

        <!-- SALONS GRID -->
        <section id="salons" class="container py-5" ref="salonsSection">
            <div class="text-center mb-5">
                <h2 class="fw-bold display-5">Nearby Salons</h2>
                <p class="text-muted fs-5">{{ salons.length }} salons available now</p>
            </div>

            <div class="row g-4">
                <div v-for="salon in salons" :key="salon.id" class="col-md-6 col-lg-4">
                    <div class="card salon-card border-0 shadow-sm h-100 overflow-hidden rounded-4 hover-lift">
                        <div class="position-relative">
                            <img :src="salon.image || placeholderImage(salon.id)" class="card-img-top"
                                style="height: 220px; object-fit: cover;">
                            <div class="position-absolute top-0 end-0 m-3">
                                <span class="badge bg-white text-dark fw-bold px-3 py-2 rounded-pill shadow">
                                    <i class="bi bi-star-fill text-warning"></i> {{ salon.rating || 4.8 }}
                                </span>
                            </div>
                        </div>
                        <div class="card-body p-4">
                            <h5 class="card-title fw-bold fs-4">{{ salon.name }}</h5>
                            <p class="text-muted small">{{ salon.description?.slice(0, 80) || 'Premium beauty & wellness
                                services' }}...</p>
                            <div class="d-flex align-items-center text-muted small mb-3">
                                <i class="bi bi-geo-alt-fill me-2"></i>
                                <span>{{ salon.address || 'Downtown Area' }}</span>
                            </div>
                            <button @click="$router.push(`/salon/${salon.id}`)"
                                class="btn btn-pink w-100 rounded-pill mt-3 fw-semibold">
                                View Services ({{ salon.services?.length || 12 }})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SALON OWNER SECTION -->
        <section class="bg-gradient-pink text-white py-5">
            <div class="container text-center py-5">
                <div class="row align-items-center">
                    <div class="col-lg-8 mx-auto">
                        <h2 class="display-5 fw-bold mb-4">Are you a Salon Owner?</h2>
                        <p class="lead mb-5 opacity-90">
                            Join thousands of beauty professionals growing their business with BeautyBook
                        </p>
                        <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                            <button @click="$router.push('/provider/login')"
                                class="btn btn-outline-light btn-lg rounded-pill px-5">
                                <i class="bi bi-box-arrow-in-right"></i> Login as Salon Owner
                            </button>
                            <button @click="$router.push('/provider/register')"
                                class="btn btn-light text-pink btn-lg rounded-pill px-5 fw-bold">
                                <i class="bi bi-shop"></i> Register Your Salon
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- FOOTER -->
        <footer class="bg-dark text-white py-4">
            <div class="container text-center">
                <p>&copy; 2025 BeautyBook. Made with love for beauty professionals.</p>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

const salons = ref([])
const isCustomerLoggedIn = ref(false)
const customerName = ref('')

onMounted(async () => {
    try {
        const res = await api.get('/api/salons')
        salons.value = res.data.map((s: any) => ({
            ...s,
            rating: s.rating || (4.5 + Math.random() * 0.5).toFixed(1),
            image: s.image || `https://source.unsplash.com/random/800x600/?salon,beauty,${s.id}`
        }))
    } catch (err) {
        console.log('No salons yet or API down')
    }
})

const placeholderImage = (id: number) =>
    `https://source.unsplash.com/random/800x600/?salon,beauty,${id}`

const scrollToSalons = () => {
    document.getElementById('salons')?.scrollIntoView({ behavior: 'smooth' })
}

const goToCustomerLogin = () => $router.push('/customer/login')
const goToCustomerSignup = () => $router.push('/customer/signup')
</script>

<style scoped>
.text-pink {
    color: #ff6bd6;
}

.btn-pink {
    background: linear-gradient(135deg, #ff6bd6, #ff8fab);
    border: none;
    color: white;
}

.btn-pink:hover {
    background: linear-gradient(135deg, #ff4ac6, #ff7a9b);
    transform: translateY(-2px);
}

.btn-outline-pink {
    border-color: #ff6bd6;
    color: #ff6bd6;
}

.btn-outline-pink:hover {
    background: #ff6bd6;
    color: white;
}

.hero {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)),
        url('https://images.unsplash.com/photo-1595475038784-b3f97102f1f8?w=1600&q=80') center/cover;
}

.hero-bg {
    position: absolute;
    inset: 0;
    background: inherit;
    filter: blur(10px);
    transform: scale(1.05);
}

.z-3 {
    z-index: 3;
}

.salon-card {
    transition: all 0.4s ease;
}

.hover-lift:hover {
    transform: translateY(-15px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
}

.bg-gradient-pink {
    background: linear-gradient(135deg, #ff9eea, #ff6bd6);
}
</style>