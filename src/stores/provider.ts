// src/stores/provider.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'

export const useProviderStore = defineStore('provider', () => {
    const token = ref<string | null>(localStorage.getItem('provider_token'))
    const salon = ref<any>(null)

    const login = async (email: string, password: string) => {
        const res = await api.post('/api/provider/login', { email, password })
        token.value = res.data.token
        salon.value = res.data.salon
        localStorage.setItem('provider_token', token.value!)
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        return res.data
    }

    const logout = () => {
        token.value = null
        salon.value = null
        localStorage.removeItem('provider_token')
        delete api.defaults.headers.common['Authorization']
    }

    const loadFromStorage = () => {
        if (token.value) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        }
    }

    loadFromStorage()

    return { token, salon, login, logout }
})