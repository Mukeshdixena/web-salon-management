// src/stores/auth.ts
import { defineStore } from 'pinia'
import api from '@/api'  // ← clean import

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as any,
        token: localStorage.getItem('token') || '',
        role: localStorage.getItem('role') || ''
    }),

    actions: {
        async login(email: string, password: string) {
            const res = await api.post('/auth/login', { email, password })
            this.token = res.data.token
            this.user = res.data.user
            this.role = res.data.user.role

            localStorage.setItem('token', this.token)
            localStorage.setItem('role', this.role)
        },

        logout() {
            this.user = null
            this.token = ''
            this.role = ''
            localStorage.removeItem('token')
            localStorage.removeItem('role')
        }
    }
})