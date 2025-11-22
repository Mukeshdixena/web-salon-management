import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: '',
        user: null as null | {
            id: number
            name: string
            email: string
            role: string
        }
    }),

    getters: {
        role: (state) => state.user?.role
    },

    actions: {
        async login(email: string, password: string) {
            let url = ''

            // Try admin first
            try {
                url = 'http://localhost:8080/api/auth/admin/login'
                const res = await axios.post(url, { email, password })
                this.handleLogin(res.data)
                return
            } catch (e) {
                // ignore and try provider next
            }

            // Try provider login
            try {
                url = 'http://localhost:8080/api/auth/provider/login'
                const res = await axios.post(url, { email, password })
                this.handleLogin(res.data)
                return
            } catch (e: any) {
                throw e // return failure to page
            }
        },

        handleLogin(data: any) {
            this.token = data.token
            this.user = {
                id: data.userId,
                name: data.name,
                email: data.email,
                role: data.role
            }

            localStorage.setItem('token', this.token)
            localStorage.setItem('user', JSON.stringify(this.user))
        },

        loadStored() {
            const t = localStorage.getItem('token')
            const u = localStorage.getItem('user')

            if (t && u) {
                this.token = t
                this.user = JSON.parse(u)
            }
        },

        logout() {
            this.token = ''
            this.user = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }
})
