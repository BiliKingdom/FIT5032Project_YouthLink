<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center min-vh-50">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold mb-4">
              Supporting Youth Mental Health & Wellbeing
            </h1>
            <p class="lead mb-4">
              Access resources, find support services, and connect with a community dedicated 
              to improving mental health outcomes for young people in Melbourne.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <router-link to="/support/map" class="btn btn-light btn-lg">
                <MapPin class="me-2" :size="20" />
                Find Services
              </router-link>
              <router-link to="/info" class="btn btn-outline-light btn-lg">
                <BookOpen class="me-2" :size="20" />
                Learn More
              </router-link>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <div class="hero-illustration p-4">
              <img 
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg" 
                alt="Young people supporting each other" 
                class="img-fluid rounded shadow-lg"
                style="max-height: 400px; object-fit: cover;"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3 mb-4">
            <div class="stat-item">
              <Users class="text-primary mb-2" :size="48" />
              <h3 class="fw-bold text-primary">500+</h3>
              <p class="text-muted">Youth Supported</p>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="stat-item">
              <MapPin class="text-success mb-2" :size="48" />
              <h3 class="fw-bold text-success">25+</h3>
              <p class="text-muted">Service Locations</p>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="stat-item">
              <BookOpen class="text-warning mb-2" :size="48" />
              <h3 class="fw-bold text-warning">100+</h3>
              <p class="text-muted">Resources Available</p>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="stat-item">
              <Calendar class="text-info mb-2" :size="48" />
              <h3 class="fw-bold text-info">24/7</h3>
              <p class="text-muted">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
      <div class="container">
        <div class="row mb-5">
          <div class="col-lg-8 mx-auto text-center">
            <h2 class="display-5 fw-bold mb-3">How We Support You</h2>
            <p class="lead text-muted">
              Comprehensive mental health support tailored for young people
            </p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Brain class="text-primary" :size="32" />
                </div>
                <h5 class="card-title">Mental Health Resources</h5>
                <p class="card-text text-muted">
                  Access comprehensive information about anxiety, depression, stress management, and wellness strategies.
                </p>
                <router-link to="/info" class="btn btn-outline-primary">
                  Explore Topics
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <MapPin class="text-success" :size="32" />
                </div>
                <h5 class="card-title">Find Local Services</h5>
                <p class="card-text text-muted">
                  Locate counseling centers, clinics, and support groups near you with our interactive map.
                </p>
                <router-link to="/support/map" class="btn btn-outline-success">
                  Find Services
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Calendar class="text-warning" :size="32" />
                </div>
                <h5 class="card-title">Book Appointments</h5>
                <p class="card-text text-muted">
                  Schedule consultations with mental health professionals through our easy booking system.
                </p>
                <router-link 
                  :to="authStore.isLoggedIn ? '/support/book' : '/auth/login'" 
                  class="btn btn-outline-warning"
                >
                  Book Now
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon bg-purple bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Calendar class="text-purple" :size="32" />
                </div>
                <h5 class="card-title">Course Booking</h5>
                <p class="card-text text-muted">
                  Join our mental health courses and workshops using our interactive calendar booking system.
                </p>
                <router-link 
                  :to="authStore.isLoggedIn ? '/courses/book' : '/auth/login'" 
                  class="btn btn-outline-purple"
                >
                  Book Courses
                </router-link>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <BookOpen class="text-info" :size="32" />
                </div>
                <h5 class="card-title">Educational Content</h5>
                <p class="card-text text-muted">
                  Browse articles, research, and educational materials on youth mental health topics.
                </p>
                <router-link to="/resources/list" class="btn btn-outline-info">
                  View Resources
                </router-link>
              </div>
            </div>
          </div>


          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="feature-icon bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Heart class="text-danger" :size="32" />
                </div>
                <h5 class="card-title">Get Involved</h5>
                <p class="card-text text-muted">
                  Support our mission through volunteering or donations to help more young people.
                </p>
                <router-link to="/involved" class="btn btn-outline-danger">
                  Learn How
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="py-5 bg-gradient-primary text-white">
      <div class="container text-center">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-5 fw-bold mb-3">Need Immediate Support?</h2>
            <p class="lead mb-4">
              If you're experiencing a mental health crisis, help is available 24/7
            </p>
            <div class="row g-3 justify-content-center">
              <div class="col-sm-6 col-md-4">
                <div class="p-3 bg-white bg-opacity-10 rounded">
                  <Phone class="mb-2" :size="24" />
                  <div><strong>Lifeline</strong></div>
                  <div>13 11 14</div>
                </div>
              </div>
              <div class="col-sm-6 col-md-4">
                <div class="p-3 bg-white bg-opacity-10 rounded">
                  <MessageCircle class="mb-2" :size="24" />
                  <div><strong>Kids Helpline</strong></div>
                  <div>1800 55 1800</div>
                </div>
              </div>
              <div class="col-sm-6 col-md-4">
                <div class="p-3 bg-white bg-opacity-10 rounded">
                  <AlertTriangle class="mb-2" :size="24" />
                  <div><strong>Emergency</strong></div>
                  <div>000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { 
  Heart, MapPin, BookOpen, Users, Calendar, Brain, 
  Phone, MessageCircle, AlertTriangle 
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #0056b3 100%);
}

.min-vh-50 {
  min-height: 50vh;
}

.stat-item {
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.feature-icon {
  width: 64px;
  height: 64px;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #0056b3 100%);
}

.text-purple {
  color: #6f42c1;
}

.bg-purple {
  background-color: #6f42c1;
}

.btn-outline-purple {
  color: #6f42c1;
  border-color: #6f42c1;
}

.btn-outline-purple:hover {
  color: #fff;
  background-color: #6f42c1;
  border-color: #6f42c1;
}

@media (max-width: 768px) {
  .hero-section .col-lg-6:first-child {
    margin-bottom: 2rem;
  }
  
  .display-4 {
    font-size: 2.5rem;
  }
}
</style>