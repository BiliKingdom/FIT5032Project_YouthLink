<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold mb-3">Mental Health Information</h1>
      <p class="lead text-muted">
        Learn about common mental health topics and find resources to support your wellbeing
      </p>
    </div>

    <div class="row g-4">
      <div v-for="topic in topics" :key="topic.slug" class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm topic-card">
          <div class="card-body p-4">
            <div class="topic-icon mb-3" :style="{ backgroundColor: topic.color + '20' }">
              <component :is="topic.icon" :class="`text-${topic.colorClass}`" :size="32" />
            </div>
            <h5 class="card-title">{{ topic.title }}</h5>
            <p class="card-text text-muted">{{ topic.description }}</p>
            <div class="mt-auto">
              <router-link 
                :to="`/info/${topic.slug}`" 
                class="btn btn-outline-primary"
              >
                Learn More
                <ChevronRight class="ms-1" :size="16" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Brain, Heart, Zap, Users, Shield, Sun, ChevronRight } from 'lucide-vue-next'

interface Topic {
  slug: string
  title: string
  description: string
  icon: any
  color: string
  colorClass: string
}

const topics: Topic[] = [
  {
    slug: 'anxiety',
    title: 'Anxiety',
    description: 'Understanding anxiety disorders, symptoms, and effective coping strategies for managing anxious thoughts and feelings.',
    icon: Brain,
    color: '#0066CC',
    colorClass: 'primary'
  },
  {
    slug: 'depression',
    title: 'Depression',
    description: 'Learn about depression, its signs and symptoms, and discover pathways to recovery and maintaining mental wellness.',
    icon: Heart,
    color: '#28A745',
    colorClass: 'success'
  },
  {
    slug: 'stress',
    title: 'Stress Management',
    description: 'Practical techniques and tools for managing stress, building resilience, and maintaining balance in daily life.',
    icon: Zap,
    color: '#FFC107',
    colorClass: 'warning'
  },
  {
    slug: 'relationships',
    title: 'Relationships',
    description: 'Building healthy relationships, communication skills, and navigating social connections during adolescence.',
    icon: Users,
    color: '#17A2B8',
    colorClass: 'info'
  },
  {
    slug: 'self-esteem',
    title: 'Self-Esteem',
    description: 'Developing a positive self-image, building confidence, and practicing self-compassion in challenging times.',
    icon: Shield,
    color: '#6F42C1',
    colorClass: 'primary'
  },
  {
    slug: 'wellness',
    title: 'Overall Wellness',
    description: 'Holistic approaches to mental health including mindfulness, exercise, nutrition, and lifestyle factors.',
    icon: Sun,
    color: '#FD7E14',
    colorClass: 'warning'
  }
]
</script>

<style scoped>
.topic-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.topic-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.topic-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>