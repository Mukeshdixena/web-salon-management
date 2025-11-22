import { defineStore } from "pinia";
import axios from "axios";

export const useProviderStore = defineStore("provider", {
    state: () => ({
        token: "",
        provider: null as null | {
            id: number
            name: string
            email: string
            role: string
        }
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                const res = await axios.post("http://localhost:8080/api/auth/provider/login", {
                    email,
                    password
                })

                this.token = res.data.token
                this.provider = {
                    id: res.data.userId,
                    name: res.data.name,
                    email: res.data.email,
                    role: res.data.role
                }

                // Persist session
                localStorage.setItem("providerToken", this.token)
                localStorage.setItem("providerInfo", JSON.stringify(this.provider))

            } catch (err: any) {
                throw err
            }
        },

        loadStoredProvider() {
            const t = localStorage.getItem("providerToken")
            const u = localStorage.getItem("providerInfo")

            if (t && u) {
                this.token = t
                this.provider = JSON.parse(u)
            }
        },

        logout() {
            this.token = ""
            this.provider = null
            localStorage.removeItem("providerToken")
            localStorage.removeItem("providerInfo")
        }
    }
})
