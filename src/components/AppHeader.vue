<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
    <div class="container">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <div class="logo-icon me-2">
          <Heart class="text-primary" :size="28" />
        </div>
        <span class="fw-bold text-primary">MindWell NFP</span>
      </router-link>

      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Mental Health Info
            </a>
            <ul class="dropdown-menu">
              <li><router-link to="/info" class="dropdown-item">All Topics</router-link></li>
              <li><router-link to="/info/anxiety" class="dropdown-item">Anxiety</router-link></li>
              <li><router-link to="/info/depression" class="dropdown-item">Depression</router-link></li>
              <li><router-link to="/info/stress" class="dropdown-item">Stress Management</router-link></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Get Support
            </a>
            <ul class="dropdown-menu">
              <li><router-link to="/support/map" class="dropdown-item">Find Services</router-link></li>
              <li><router-link to="/support/book" class="dropdown-item">Book Appointment</router-link></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              Resources
            </a>
            <ul class="dropdown-menu">
              <li><router-link to="/resources/list" class="dropdown-item">Articles</router-link></li>
              <li><router-link to="/resources/events" class="dropdown-item">Events</router-link></li>
            </ul>
          </li>
          <!-- <li class="nav-item">
            <router-link to="/involved" class="nav-link">Get Involved</router-link>
          </li> -->
          <li class="nav-item">
            <router-link to="/about" class="nav-link">About</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link">Contact</router-link>
          </li>
        </ul>

        <div class="navbar-nav">
          <div v-if="!authStore.isLoggedIn" class="d-flex gap-2">
            <router-link to="/auth/login" class="btn btn-outline-primary btn-sm">Login</router-link>
            <router-link to="/auth/register" class="btn btn-primary btn-sm">Register</router-link>
          </div>
          <div v-else class="dropdown">
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              <User class="me-1" :size="18" />
              {{ authStore.user?.displayName }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><router-link to="/account" class="dropdown-item">Profile</router-link></li>
              <li v-if="authStore.isAdmin">
                <router-link to="/admin" class="dropdown-item">Admin Dashboard</router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button @click="authStore.logout()" class="dropdown-item">
                  <LogOut class="me-1" :size="16" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { Heart, User, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  text-decoration: none;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--bs-primary) !important;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    margin-top: 1rem;
  }
  
  .d-flex.gap-2 {
    margin-top: 1rem;
  }
}
</style>