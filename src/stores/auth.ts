// src/stores/auth.ts
import { defineStore } from 'pinia'
import api from '@/api' // your configured axios instance
import type { AxiosResponse } from 'axios'

export enum UserRole {
    ADMIN = 'ADMIN',
    PROVIDER = 'PROVIDER',
    CUSTOMER = 'CUSTOMER'
}

export interface User {
    id: number
    name: string
    email: string
    role: UserRole
}

interface LoginResponse {
    token: string
    userId: number
    name: string
    email: string
    role: string
}

interface AuthState {
    token: string
    user: User | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: '',
        user: null
    }),

    getters: {
        isAuthenticated: (state): boolean => !!state.token && !!state.user,
        role: (state): UserRole | null => state.user?.role || null,
        isAdmin: (state): boolean => state.user?.role === UserRole.ADMIN,
        isProvider: (state): boolean => state.user?.role === UserRole.PROVIDER,
        isCustomer: (state): boolean => state.user?.role === UserRole.CUSTOMER,
        userName: (state): string => state.user?.name.split(' ')[0] || 'User'
    },

    actions: {
        // Load session on app startup
        async initialize() {
            await this.loadFromStorage()
            if (this.token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
            }
        },

        // Try login across all roles
        async login(email: string, password: string): Promise<void> {
            const endpoints = [
                '/api/auth/admin/login',
                '/api/auth/provider/login',
                '/api/auth/customer/login'
            ]

            const errors: string[] = []

            for (const endpoint of endpoints) {
                try {
                    const response: AxiosResponse<LoginResponse> = await api.post(endpoint, {
                        email,
                        password
                    })

                    this.handleSuccessfulLogin(response.data)
                    return // Success → exit
                } catch (error: any) {
                    // Collect error but continue trying next endpoint
                    const msg = error.response?.data?.message || error.message
                    errors.push(`${endpoint.split('/').pop()}: ${msg}`)
                }
            }

            // All failed
            throw new Error('Invalid email or password. Please try again.')
        },

        // Central login success handler
        handleSuccessfulLogin(data: LoginResponse) {
            const role = String(data.role || '').toUpperCase() as UserRole

            if (!Object.values(UserRole).includes(role)) {
                console.warn('Unknown role received:', role)
            }

            this.token = data.token
            this.user = {
                id: data.userId,
                name: data.name,
                email: data.email,
                role: role
            }

            // Persist to localStorage
            localStorage.setItem('token', this.token)
            localStorage.setItem('user', JSON.stringify(this.user))

            // Set default Authorization header for all future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        },

        // Load from localStorage (call on app init)
        async loadFromStorage(): Promise<void> {
            const token = localStorage.getItem('token')
            const userJson = localStorage.getItem('user')

            if (token && userJson) {
                try {
                    this.token = token
                    this.user = JSON.parse(userJson) as User

                    // Re-apply auth header
                    api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
                } catch (e) {
                    console.error('Failed to parse stored user data', e)
                    this.logout()
                }
            }
        },

        // Logout everywhere
        logout(): void {
            this.token = ''
            this.user = null

            localStorage.removeItem('token')
            localStorage.removeItem('user')

            delete api.defaults.headers.common['Authorization']
        },

        // Optional: Check session validity with backend
        async verifySession(): Promise<boolean> {
            if (!this.token) return false

            try {
                await api.get('/api/auth/me') // or any protected endpoint
                return true
            } catch {
                this.logout()
                return false
            }
        }
    }
})