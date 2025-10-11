<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-light py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-5 fw-bold mb-4">About MindWell NFP</h1>
            <p class="lead mb-4">
              We're a Melbourne-based not-for-profit organization dedicated to supporting youth mental health 
              and wellbeing through innovative technology solutions and community-focused programs.
            </p>
          </div>
          <div class="col-lg-6">
            <img 
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" 
              alt="Team collaboration" 
              class="img-fluid rounded shadow"
            >
          </div>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="py-5">
      <div class="container">
        <div class="row g-5">
          <div class="col-lg-6">
            <div class="text-center mb-4">
              <Target class="text-primary mb-3" :size="48" />
              <h2 class="h3 fw-bold">Our Mission</h2>
            </div>
            <p class="text-muted">
              To improve mental health outcomes for young people in Melbourne by providing accessible, 
              technology-driven resources and connecting them with quality support services in their community.
            </p>
          </div>
          <div class="col-lg-6">
            <div class="text-center mb-4">
              <Eye class="text-success mb-3" :size="48" />
              <h2 class="h3 fw-bold">Our Vision</h2>
            </div>
            <p class="text-muted">
              A future where every young person has the tools, resources, and support they need to thrive 
              mentally and emotionally, breaking down barriers to mental health care.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="bg-primary text-white py-5">
      <div class="container">
        <div class="row text-center">
          <div class="col-md-3 mb-4">
            <h3 class="display-6 fw-bold">3</h3>
            <p class="mb-0">Years of Impact</p>
          </div>
          <div class="col-md-3 mb-4">
            <h3 class="display-6 fw-bold">500+</h3>
            <p class="mb-0">Youth Supported</p>
          </div>
          <div class="col-md-3 mb-4">
            <h3 class="display-6 fw-bold">25+</h3>
            <p class="mb-0">Partner Organizations</p>
          </div>
          <div class="col-md-3 mb-4">
            <h3 class="display-6 fw-bold">24/7</h3>
            <p class="mb-0">Resource Availability</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="display-6 fw-bold mb-3">Our Team</h2>
          <p class="lead text-muted">
            Meet the dedicated professionals working to support youth mental health
          </p>
        </div>

        <div class="row g-4">
          <div v-for="member in team" :key="member.name" class="col-md-6 col-lg-3">
            <div class="card border-0 text-center">
              <div class="card-body">
                <div class="team-photo mb-3">
                  <img 
                    :src="member.photo" 
                    :alt="member.name" 
                    class="rounded-circle img-fluid"
                    style="width: 120px; height: 120px; object-fit: cover;"
                  >
                </div>
                <h5 class="card-title">{{ member.name }}</h5>
                <p class="text-primary fw-medium">{{ member.role }}</p>
                <p class="card-text text-muted small">{{ member.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Target, Eye } from 'lucide-vue-next'

interface TeamMember {
  name: string
  role: string
  description: string
  photo: string
}

const team: TeamMember[] = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Clinical Director',
    description: 'Clinical psychologist specializing in adolescent mental health with 15+ years experience.',
    photo: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg'
  },
  {
    name: 'Marcus Williams',
    role: 'Technology Director',
    description: 'Full-stack developer passionate about using technology to improve mental health outcomes.',
    photo: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Community Outreach',
    description: 'Connecting young people with resources and building partnerships across Melbourne.',
    photo: 'https://images.pexels.com/photos/3727464/pexels-photo-3727464.jpeg'
  },
  {
    name: 'James Thompson',
    role: 'Research Coordinator',
    description: 'PhD researcher focused on evidence-based interventions for youth mental health.',
    photo: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg'
  }
]
</script>

<style scoped>
.team-photo {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}
</style>