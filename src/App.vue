<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <SkipNavigation />
    <LiveRegion />
    <ToastNotification />
    <AppHeader />
    <main id="main-content" class="flex-grow-1" tabindex="-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import SkipNavigation from '@/components/accessibility/SkipNavigation.vue'
import LiveRegion from '@/components/accessibility/LiveRegion.vue'
import ToastNotification from '@/components/notifications/ToastNotification.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>

<style>
/* Bootstrap CSS import */
@import 'bootstrap/dist/css/bootstrap.min.css';

/* Custom CSS variables */
:root {
  --bs-primary: #0066CC;
  --bs-primary-rgb: 0, 102, 204;
  --bs-success: #28A745;
  --bs-warning: #FFC107;
  --bs-info: #17A2B8;
  --bs-danger: #DC3545;
}

/* Global styles */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.text-light-emphasis {
  color: rgba(255, 255, 255, 0.75) !important;
}

/* Smooth transitions */
* {
  transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
}

/* Enhanced focus states for accessibility (WCAG 2.1 AA) */
.btn:focus,
.form-control:focus,
.form-select:focus,
.form-check-input:focus,
a:focus,
button:focus,
input:focus,
select:focus,
textarea:focus,
[tabindex]:focus {
  outline: 3px solid #0066CC;
  outline-offset: 2px;
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

/* Focus visible for keyboard navigation only */
.btn:focus-visible,
.form-control:focus-visible,
a:focus-visible,
button:focus-visible {
  outline: 3px solid #0066CC;
  outline-offset: 2px;
}

/* Remove outline for mouse clicks (keeps for keyboard) */
.btn:focus:not(:focus-visible),
a:focus:not(:focus-visible),
button:focus:not(:focus-visible) {
  outline: none;
}

/* Loading spinner animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spinner-border {
  animation: spin 0.75s linear infinite;
}

/* Responsive utilities */
@media (max-width: 576px) {
  .display-1 { font-size: 2.5rem; }
  .display-2 { font-size: 2rem; }
  .display-3 { font-size: 1.75rem; }
  .display-4 { font-size: 1.5rem; }
  .display-5 { font-size: 1.25rem; }
}

/* Skip link for accessibility */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--bs-primary);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 0;
}
</style>