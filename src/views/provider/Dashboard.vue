<template>
  <div class="min-vh-100 bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div class="container">
        <span class="navbar-brand fw-bold">Provider Dashboard</span>
        <button class="btn btn-outline-light btn-sm" @click="auth.logout(); $router.push('/')">
          Logout
        </button>
      </div>
    </nav>

    <div class="container py-5">
      <h1 class="display-5 fw-bold mb-4">Welcome, {{ auth.user?.name }}!</h1>
      <p class="lead">You are logged in as <strong>{{ auth.role }}</strong></p>

      <div class="row mt-5">
        <div class="col-md-4">
          <div class="card text-center p-4 shadow-sm">
            <i class="bi bi-shop display-1 text-primary"></i>
            <h3>Manage Salons</h3>
            <p class="text-muted">Add, edit, delete your salons</p>
          </div>
        </div>
        <!-- More cards coming soon -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
auth.init()
</script>