// src/stores/salonStore.ts   ← REPLACE the whole file
import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/api'
})

export interface Salon {
    id?: number
    name: string
    address: string
    phone: string
    latitude?: number
    longitude?: number
    ownerName: string
}

// For creating a new salon (id is never sent)
export type CreateSalonDto = Omit<Salon, 'id'>

export const useSalonStore = defineStore('salon', {
    state: () => ({
        salons: [] as Salon[],
        loading: false,
        toastMessage: '',
        toastType: 'success' as 'success' | 'danger'
    }),

    actions: {
        async loadSalons() {
            this.loading = true
            try {
                const res = await api.get<Salon[]>('/salons')
                this.salons = res.data
            } catch {
                this.showToast('Failed to load salons', 'danger')
            } finally {
                this.loading = false
            }
        },

        async createSalon(salon: CreateSalonDto) {
            try {
                await api.post('/salons', salon)
                this.showToast('Salon created successfully!')
                await this.loadSalons()
            } catch {
                this.showToast('Failed to create salon', 'danger')
            }
        },

        async updateSalon(id: number, salon: Partial<Salon>) {
            try {
                await api.put(`/salons/${id}`, salon)
                this.showToast('Salon updated!')
                await this.loadSalons()
            } catch {
                this.showToast('Update failed', 'danger')
            }
        },

        async deleteSalon(id: number) {
            try {
                await api.delete(`/salons/${id}`)
                this.showToast('Salon deleted!')
                await this.loadSalons()
            } catch {
                this.showToast('Delete failed', 'danger')
            }
        },

        showToast(msg: string, type: 'success' | 'danger' = 'success') {
            this.toastMessage = msg
            this.toastType = type
            setTimeout(() => this.toastMessage = '', 4000)
        }
    }
})