<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="text-center mb-5">
          <h1 class="display-5 fw-bold mb-3">{{ topicTitle }}</h1>
          <p class="lead text-muted">
            Learn about {{ topicTitle.toLowerCase() }} and find helpful resources and coping strategies
          </p>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-body p-5">
            <div v-if="topic">
              <div class="mb-4">
                <div class="topic-icon mb-3" :style="{ backgroundColor: topic.color + '20' }">
                  <component :is="topic.icon" :class="`text-${topic.colorClass}`" :size="48" />
                </div>
              </div>

              <div class="content-section mb-5">
                <h3 class="h4 fw-bold mb-3">What is {{ topic.title }}?</h3>
                <p class="text-muted">{{ topic.description }}</p>
              </div>

              <div class="content-section mb-5">
                <h3 class="h4 fw-bold mb-3">Common Signs & Symptoms</h3>
                <ul class="list-unstyled">
                  <li v-for="symptom in topic.symptoms" :key="symptom" class="mb-2">
                    <CheckCircle class="text-success me-2" :size="16" />
                    {{ symptom }}
                  </li>
                </ul>
              </div>

              <div class="content-section mb-5">
                <h3 class="h4 fw-bold mb-3">Coping Strategies</h3>
                <div class="row g-3">
                  <div v-for="strategy in topic.strategies" :key="strategy" class="col-md-6">
                    <div class="p-3 bg-light rounded">
                      <Heart class="text-primary me-2" :size="16" />
                      {{ strategy }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="content-section">
                <h3 class="h4 fw-bold mb-3">When to Seek Help</h3>
                <div class="alert alert-info">
                  <AlertTriangle class="me-2" :size="20" />
                  If you're experiencing persistent symptoms that interfere with daily life, 
                  consider reaching out to a mental health professional for support.
                </div>
              </div>
            </div>

            <div v-else class="text-center py-5">
              <AlertCircle class="text-muted mb-3" :size="48" />
              <h3 class="text-muted">Topic Not Found</h3>
              <p class="text-muted">The requested mental health topic could not be found.</p>
              <router-link to="/info" class="btn btn-primary">
                Back to Topics
              </router-link>
            </div>
          </div>
        </div>

        <div class="text-center mt-4">
          <router-link to="/info" class="btn btn-outline-primary me-3">
            <ArrowLeft class="me-2" :size="16" />
            Back to Topics
          </router-link>
          <router-link to="/support/map" class="btn btn-primary">
            Find Support Services
            <ArrowRight class="ms-2" :size="16" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  Brain, Heart, Zap, Users, Shield, Sun,
  CheckCircle, AlertTriangle, AlertCircle, ArrowLeft, ArrowRight 
} from 'lucide-vue-next'

const route = useRoute()

interface Topic {
  slug: string
  title: string
  description: string
  icon: any
  color: string
  colorClass: string
  symptoms: string[]
  strategies: string[]
}

const topics: Topic[] = [
  {
    slug: 'anxiety',
    title: 'Anxiety',
    description: 'Anxiety is a normal response to stress, but when it becomes overwhelming or persistent, it can interfere with daily activities and quality of life.',
    icon: Brain,
    color: '#0066CC',
    colorClass: 'primary',
    symptoms: [
      'Excessive worry or fear',
      'Restlessness or feeling on edge',
      'Difficulty concentrating',
      'Physical symptoms like rapid heartbeat',
      'Sleep disturbances',
      'Avoiding certain situations'
    ],
    strategies: [
      'Deep breathing exercises',
      'Progressive muscle relaxation',
      'Regular physical exercise',
      'Mindfulness meditation',
      'Limiting caffeine intake',
      'Maintaining a regular sleep schedule'
    ]
  },
  {
    slug: 'depression',
    title: 'Depression',
    description: 'Depression is more than just feeling sad. It\'s a serious mental health condition that affects how you feel, think, and handle daily activities.',
    icon: Heart,
    color: '#28A745',
    colorClass: 'success',
    symptoms: [
      'Persistent sad or empty mood',
      'Loss of interest in activities',
      'Changes in appetite or weight',
      'Sleep problems',
      'Fatigue or loss of energy',
      'Feelings of worthlessness or guilt'
    ],
    strategies: [
      'Maintain social connections',
      'Engage in regular physical activity',
      'Practice self-care routines',
      'Set small, achievable goals',
      'Seek professional support',
      'Consider therapy or counseling'
    ]
  },
  {
    slug: 'stress',
    title: 'Stress Management',
    description: 'Stress is a natural response to challenges, but chronic stress can impact both physical and mental health.',
    icon: Zap,
    color: '#FFC107',
    colorClass: 'warning',
    symptoms: [
      'Feeling overwhelmed',
      'Irritability or mood swings',
      'Muscle tension or headaches',
      'Changes in appetite',
      'Difficulty sleeping',
      'Trouble concentrating'
    ],
    strategies: [
      'Time management techniques',
      'Regular exercise routine',
      'Relaxation techniques',
      'Healthy eating habits',
      'Setting boundaries',
      'Taking regular breaks'
    ]
  }
]

const topic = ref<Topic | null>(null)

const topicTitle = computed(() => {
  return topic.value?.title || 'Mental Health Topic'
})

onMounted(() => {
  const slug = route.params.slug as string
  topic.value = topics.find(t => t.slug === slug) || null
})
</script>

<style scoped>
.topic-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.content-section {
  border-left: 3px solid var(--bs-primary);
  padding-left: 1.5rem;
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>