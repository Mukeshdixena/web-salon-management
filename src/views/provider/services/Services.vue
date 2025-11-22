<template>
    <div class="container py-4">

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold">Manage Services</h2>

            <button class="btn btn-primary rounded-pill px-4" @click="openAddModal">
                + Add Service
            </button>
        </div>


        <!-- TABLE -->
        <div class="card shadow-sm p-4 rounded-4">
            <table class="table align-middle table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Service</th>
                        <th>Price</th>
                        <th>Duration</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(s, index) in services" :key="s.id">
                        <td>{{ index + 1 }}</td>
                        <td>{{ s.name }}</td>
                        <td>₹{{ s.price }}</td>
                        <td>{{ s.duration }} min</td>

                        <td class="text-end">
                            <button class="btn btn-sm btn-warning me-2" @click="openEditModal(s)">
                                Edit
                            </button>

                            <button class="btn btn-sm btn-danger" @click="deleteService(s.id)">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="services.length === 0" class="text-center text-muted py-3">
                No services added yet.
            </div>
        </div>

        <!-- ADD / EDIT MODAL -->
        <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
            <div class="modal-content-box">
                <h4 class="fw-bold mb-3">{{ editMode ? 'Edit Service' : 'Add Service' }}</h4>

                <div class="mb-3">
                    <label class="fw-bold mb-1">Service Name</label>
                    <input type="text" class="form-control" v-model="form.name" />
                </div>

                <div class="mb-3">
                    <label class="fw-bold mb-1">Price (₹)</label>
                    <input type="number" class="form-control" v-model="form.price" />
                </div>

                <div class="mb-3">
                    <label class="fw-bold mb-1">Duration (Minutes)</label>
                    <input type="number" class="form-control" v-model="form.duration" />
                </div>

                <div class="d-flex justify-content-end gap-2 mt-4">
                    <button class="btn btn-secondary" @click="closeModal">Cancel</button>

                    <button v-if="editMode" class="btn btn-primary" @click="updateService">
                        Update
                    </button>

                    <button v-else class="btn btn-success" @click="createService">
                        Add
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "@/api";

const services = ref<any[]>([]);
const showModal = ref(false);
const editMode = ref(false);

const form = ref({
    id: null,
    name: "",
    price: "",
    duration: ""
});

// Load Services
const loadServices = async () => {
    try {
        const res = await api.get("/api/provider/services");
        services.value = res.data;
    } catch (err) {
        console.error(err);
    }
};

// Add
const openAddModal = () => {
    editMode.value = false;
    form.value = { id: null, name: "", price: "", duration: "" };
    showModal.value = true;
};

// Edit
const openEditModal = (s: any) => {
    editMode.value = true;
    form.value = { id: s.id, name: s.name, price: s.price, duration: s.duration };
    showModal.value = true;
};

// Save service
const createService = async () => {
    try {
        await api.post("/api/provider/services/add", {
            name: form.value.name,
            price: Number(form.value.price),
            duration: Number(form.value.duration)
        });
        closeModal();
        loadServices();
    } catch (err) {
        console.error(err);
    }
};

// Update
const updateService = async () => {
    try {
        await api.put(`/api/provider/services/${form.value.id}`, {
            name: form.value.name,
            price: Number(form.value.price),
            duration: Number(form.value.duration)
        });
        closeModal();
        loadServices();
    } catch (err) { }
};

// Delete
const deleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
        await api.delete(`/api/provider/services/${id}`);
        loadServices();
    } catch (err) {
        console.error(err);
    }
};

const closeModal = () => {
    showModal.value = false;
};

onMounted(() => loadServices());
</script>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content-box {
    background: white;
    padding: 25px;
    width: 400px;
    border-radius: 12px;
}
</style>
