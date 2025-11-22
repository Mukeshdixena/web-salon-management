// src/stores/auth.ts
import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { 'Content-Type': 'application/json' }
})

export interface User {
    id: number
    name: string
    email: string
    role: string
    status: string
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: '' as string,
        role: '' as string
    }),

    actions: {
        async login(email: string, password: string) {
            const res = await api.post('/auth/login', { email, password })
            this.token = res.data.token
            this.user = res.data.user
            this.role = res.data.user.role

            localStorage.setItem('token', this.token)
            localStorage.setItem('role', this.role)

            api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        },

        logout() {
            this.user = null
            this.token = ''
            this.role = ''
            localStorage.removeItem('token')
            localStorage.removeItem('role')
            delete api.defaults.headers.common['Authorization']
        },

        init() {
            const token = localStorage.getItem('token')
            const role = localStorage.getItem('role')
            if (token && role) {
                this.token = token
                this.role = role
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            }
        }
    }
})