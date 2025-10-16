<template>
  <footer class="bg-dark text-light mt-5">
    <div class="container py-5">
      <div class="row">
        <div class="col-md-4 mb-4">
          <h5 class="text-primary mb-3">
            <Heart class="me-2" :size="20" />
            MindWell NFP
          </h5>
          <p class="text-light-emphasis">
            Supporting youth mental health and wellbeing through innovative technology solutions 
            and community-focused resources.
          </p>
        </div>
        
        <div class="col-md-2 mb-4">
          <h6 class="text-primary mb-3">Quick Links</h6>
          <ul class="list-unstyled">
            <!-- <li><router-link to="/info" class="text-light-emphasis text-decoration-none">Mental Health Info</router-link></li> -->
            <li><router-link to="/support/map" class="text-light-emphasis text-decoration-none">Find Services</router-link></li>
            <li><router-link to="/resources/list" class="text-light-emphasis text-decoration-none">Resources</router-link></li>
            <li><router-link to="/contact" class="text-light-emphasis text-decoration-none">Contact Us</router-link></li>
            <!-- <li><router-link to="/involved" class="text-light-emphasis text-decoration-none">Get Involved</router-link></li> -->
          </ul>
        </div>
        
        <div class="col-md-3 mb-4">
          <h6 class="text-primary mb-3">Support</h6>
          <ul class="list-unstyled">
            <li><router-link to="/courses/book" class="text-light-emphasis text-decoration-none">Book Appointment</router-link></li>
            <li><router-link to="/about" class="text-light-emphasis text-decoration-none">About Us</router-link></li>
            <li><router-link to="/accessibility" class="text-light-emphasis text-decoration-none">Accessibility</router-link></li>
          </ul>
        </div>
        
        <div class="col-md-3 mb-4">
          <h6 class="text-primary mb-3">Emergency Support</h6>
          <div class="text-light-emphasis">
            <div class="mb-2">
              <Phone class="me-2" :size="16" />
              <strong>Crisis Hotline:</strong> 13 11 14
            </div>
            <div class="mb-2">
              <MessageCircle class="me-2" :size="16" />
              <strong>Text Support:</strong> 0477 13 11 14
            </div>
            <small class="text-muted">Available 24/7</small>
          </div>
        </div>
      </div>
      
      <hr class="border-secondary my-4">
      
      <div class="row align-items-center">
        <div class="col-md-8">
          <p class="mb-0 text-light-emphasis">
            &copy; 2025 MindWell NFP. All rights reserved. 
            <span class="text-muted">|</span>
            This platform provides general wellness information and should not replace professional medical advice.
          </p>
        </div>
        <div class="col-md-4 text-md-end">
          <small class="text-muted">
            Made by Qingtian Liu <Heart class="text-danger" :size="14" /> 
          </small>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Heart, Phone, MessageCircle } from 'lucide-vue-next'
</script>

<style scoped>
footer a:hover {
  color: var(--bs-primary) !important;
  transition: color 0.3s ease;
}
</style>