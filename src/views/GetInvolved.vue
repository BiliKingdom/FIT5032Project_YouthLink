<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-primary text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-5 fw-bold mb-4">Get Involved</h1>
            <p class="lead mb-4">
              Join our mission to support youth mental health in Melbourne. 
              Every contribution makes a difference in a young person's life.
            </p>
          </div>
          <div class="col-lg-6">
            <img 
              src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg" 
              alt="Volunteers helping community" 
              class="img-fluid rounded shadow"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Ways to Help -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-6 fw-bold mb-3">Ways to Make a Difference</h2>
          <p class="lead text-muted">
            Choose how you'd like to support our cause
          </p>
        </div>

        <div class="row g-4">
          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="involvement-icon bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Users class="text-primary" :size="32" />
                </div>
                <h5 class="card-title">Volunteer</h5>
                <p class="card-text text-muted">
                  Share your time and skills to directly support young people in our community programs.
                </p>
                <ul class="list-unstyled text-start mb-4">
                  <li class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    Peer mentoring
                  </li>
                  <li class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    Event assistance
                  </li>
                  <li class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    Administrative support
                  </li>
                </ul>
                <button class="btn btn-primary">
                  Become a Volunteer
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="involvement-icon bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Heart class="text-success" :size="32" />
                </div>
                <h5 class="card-title">Donate</h5>
                <p class="card-text text-muted">
                  Your financial support helps us expand our services and reach more young people in need.
                </p>
                <ul class="list-unstyled text-start mb-4">
                  <li class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    One-time donations
                  </li>
                  <li class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    Monthly giving
                  </li>
                  <li class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    Corporate partnerships
                  </li>
                </ul>
                <button class="btn btn-success">
                  Make a Donation
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm">
              <div class="card-body text-center p-4">
                <div class="involvement-icon bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <Share2 class="text-info" :size="32" />
                </div>
                <h5 class="card-title">Spread Awareness</h5>
                <p class="card-text text-muted">
                  Help us reduce stigma and raise awareness about youth mental health in your community.
                </p>
                <ul class="list-unstyled text-start mb-4">
                  <li class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    Social media advocacy
                  </li>
                  <li class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    Community presentations
                  </li>
                  <li class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    Fundraising events
                  </li>
                </ul>
                <button class="btn btn-info">
                  Get Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Stats -->
    <section class="bg-light py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-6 fw-bold mb-3">Your Impact</h2>
          <p class="lead text-muted">
            See how your support creates real change
          </p>
        </div>

        <div class="row text-center">
          <div class="col-md-3 mb-4">
            <div class="impact-stat">
              <div class="stat-icon bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <Users class="text-primary" :size="32" />
              </div>
              <h3 class="fw-bold text-primary">150+</h3>
              <p class="text-muted">Active Volunteers</p>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="impact-stat">
              <div class="stat-icon bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <DollarSign class="text-success" :size="32" />
              </div>
              <h3 class="fw-bold text-success">$250K</h3>
              <p class="text-muted">Raised This Year</p>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="impact-stat">
              <div class="stat-icon bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <Calendar class="text-warning" :size="32" />
              </div>
              <h3 class="fw-bold text-warning">48</h3>
              <p class="text-muted">Events Hosted</p>
            </div>
          </div>
          <div class="col-md-3 mb-4">
            <div class="impact-stat">
              <div class="stat-icon bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                <Heart class="text-info" :size="32" />
              </div>
              <h3 class="fw-bold text-info">500+</h3>
              <p class="text-muted">Lives Impacted</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-6 fw-bold mb-3">Volunteer Stories</h2>
          <p class="lead text-muted">
            Hear from our amazing volunteers
          </p>
        </div>

        <div class="row g-4">
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="col-lg-4">
            <div class="card border-0 shadow-sm h-100">
              <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                  <img 
                    :src="testimonial.photo" 
                    :alt="testimonial.name" 
                    class="rounded-circle me-3"
                    style="width: 50px; height: 50px; object-fit: cover;"
                  >
                  <div>
                    <h6 class="mb-0">{{ testimonial.name }}</h6>
                    <small class="text-muted">{{ testimonial.role }}</small>
                  </div>
                </div>
                <p class="card-text text-muted">{{ testimonial.quote }}</p>
                <div class="text-warning">
                  <Star v-for="i in 5" :key="i" :size="16" fill="currentColor" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="bg-gradient-primary text-white py-5">
      <div class="container text-center">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <h2 class="display-5 fw-bold mb-3">Ready to Make a Difference?</h2>
            <p class="lead mb-4">
              Join our community of supporters and help us create positive change in youth mental health
            </p>
            <div class="d-flex gap-3 justify-content-center flex-wrap">
              <button class="btn btn-light btn-lg">
                <Users class="me-2" :size="20" />
                Start Volunteering
              </button>
              <button class="btn btn-outline-light btn-lg">
                <Heart class="me-2" :size="20" />
                Make a Donation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { 
  Users, Heart, Share2, CheckCircle, DollarSign, 
  Calendar, Star 
} from 'lucide-vue-next'

interface Testimonial {
  id: number
  name: string
  role: string
  quote: string
  photo: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Jessica Chen',
    role: 'Peer Mentor Volunteer',
    quote: 'Volunteering with MindWell has been incredibly rewarding. Seeing young people gain confidence and develop coping skills makes every moment worthwhile.',
    photo: 'https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Event Coordinator',
    quote: 'The impact we make together is amazing. Every event brings our community closer and helps break down mental health stigma.',
    photo: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg'
  },
  {
    id: 3,
    name: 'Sarah Thompson',
    role: 'Workshop Facilitator',
    quote: 'Being part of MindWell has taught me so much about resilience and community support. It\'s a privilege to contribute to such important work.',
    photo: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg'
  }
]
</script>

<style scoped>
.involvement-icon,
.stat-icon {
  width: 64px;
  height: 64px;
}

.impact-stat {
  transition: transform 0.3s ease;
}

.impact-stat:hover {
  transform: translateY(-5px);
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, var(--bs-primary) 0%, #0056b3 100%);
}

@media (max-width: 768px) {
  .display-5 {
    font-size: 2.5rem;
  }
}
</style>