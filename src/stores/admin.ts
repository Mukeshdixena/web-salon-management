// src/stores/admin.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useAdminStore = defineStore('admin', () => {
    const token = ref<string | null>(localStorage.getItem('admin_token'))

    const login = async (email: string, password: string) => {
        const res = await api.post('/api/admin/login', { email, password })
        token.value = res.data.token
        localStorage.setItem('admin_token', token.value)
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }

    const logout = () => {
        token.value = null
        localStorage.removeItem('admin_token')
        delete api.defaults.headers.common['Authorization']
    }

    if (token.value) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }

    return { token, login, logout }
})