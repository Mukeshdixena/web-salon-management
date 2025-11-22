<template>
  <div class="min-vh-100 bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-danger shadow">
      <div class="container">
        <span class="navbar-brand fw-bold">Admin Panel</span>
        <button class="btn btn-outline-light btn-sm" @click="auth.logout(); $router.push('/')">
          Logout
        </button>
      </div>
    </nav>

    <div class="container py-5">
      <h1 class="display-5 fw-bold mb-4 text-danger">Super Admin Dashboard</h1>
      <p class="lead">You have full control over the platform</p>

      <div class="row mt-5 g-4">
        <div class="col-md-4">
          <div class="card text-center p-5 shadow-lg border-0 bg-white">
            <i class="bi bi-check-circle-fill display-1 text-success"></i>
            <h3 class="mt-3">Approve Providers</h3>
            <p class="text-muted">Review & approve salon owner registrations</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center p-5 shadow-lg border-0 bg-white">
            <i class="bi bi-shop display-1 text-primary"></i>
            <h3 class="mt-3">All Salons</h3>
            <p class="text-muted">View & manage every salon on the platform</p>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card text-center p-5 shadow-lg border-0 bg-white">
            <i class="bi bi-people-fill display-1 text-warning"></i>
            <h3 class="mt-3">Users</h3>
            <p class="text-muted">Manage customers, providers & admins</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
auth.init()
</script>