// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import 'bootstrap'

// Optional global styles
import '@/assets/css/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth (critical for page refresh)
const authStore = useAuthStore()
await authStore.initialize()

// Mount the app
app.mount('#app')

// Optional: Global error handler (recommended for production)
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Global Error]', err)
  console.error('Component:', instance)
  console.error('Info:', info)
  // Send to Sentry, LogRocket, etc. here in production
}