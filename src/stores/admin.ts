import { defineStore } from 'pinia'
import axios from 'axios'

export const useAdminStore = defineStore('admin', {
    state: () => ({
        token: '',
        admin: null as null | {
            id: number
            name: string
            email: string
            role: string
        },
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                const res = await axios.post('http://localhost:8080/api/auth/admin/login', {
                    email,
                    password
                })

                this.token = res.data.token
                this.admin = {
                    id: res.data.userId,
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role
                }

                // Save token in localStorage to persist login
                localStorage.setItem('adminToken', this.token)
                localStorage.setItem('adminInfo', JSON.stringify(this.admin))

                return true
            } catch (err: any) {
                const msg = err.response?.data || 'Login failed'
                alert(msg)
                return false
            }
        },

        loadStoredAdmin() {
            const t = localStorage.getItem('adminToken')
            const u = localStorage.getItem('adminInfo')

            if (t && u) {
                this.token = t
                this.admin = JSON.parse(u)
            }
        },

        logout() {
            this.token = ''
            this.admin = null
            localStorage.removeItem('adminToken')
            localStorage.removeItem('adminInfo')
        }
    }
})
