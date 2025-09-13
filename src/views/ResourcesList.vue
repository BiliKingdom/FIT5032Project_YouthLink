<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold mb-3">Mental Health Resources</h1>
      <p class="lead text-muted">
        Browse our collection of articles, guides, and educational materials. Rate resources to help others find the best content.
      </p>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-primary text-white">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h5 class="mb-0">
              <BookOpen class="me-2" :size="20" />
              Resources Library
            </h5>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Search resources..."
                @input="filterResources"
              >
              <button class="btn btn-outline-light" type="button">
                <Search :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th @click="sortBy('title')" class="sortable">
                  Title
                  <ChevronUp v-if="sortField === 'title' && sortDirection === 'asc'" :size="14" />
                  <ChevronDown v-else-if="sortField === 'title' && sortDirection === 'desc'" :size="14" />
                </th>
                <th @click="sortBy('category')" class="sortable">
                  Category
                  <ChevronUp v-if="sortField === 'category' && sortDirection === 'asc'" :size="14" />
                  <ChevronDown v-else-if="sortField === 'category' && sortDirection === 'desc'" :size="14" />
                </th>
                <th @click="sortBy('type')" class="sortable">
                  Type
                  <ChevronUp v-if="sortField === 'type' && sortDirection === 'asc'" :size="14" />
                  <ChevronDown v-else-if="sortField === 'type' && sortDirection === 'desc'" :size="14" />
                </th>
                <th @click="sortBy('rating')" class="sortable">
                  Rating
                  <ChevronUp v-if="sortField === 'rating' && sortDirection === 'asc'" :size="14" />
                  <ChevronDown v-else-if="sortField === 'rating' && sortDirection === 'desc'" :size="14" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="resource in paginatedResources" :key="resource.id">
                <td>
                  <div>
                    <strong>{{ resource.title }}</strong>
                    <div class="text-muted small">{{ resource.description }}</div>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="getCategoryBadgeClass(resource.category)">
                    {{ resource.category }}
                  </span>
                </td>
                <td>{{ resource.type }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="stars me-2">
                      <Star
                        v-for="i in 5"
                        :key="i"
                        :size="14"
                        :class="i <= Math.round(resource.rating) ? 'text-warning' : 'text-muted'"
                        :fill="i <= Math.round(resource.rating) ? 'currentColor' : 'none'"
                      />
                    </div>
                    <small class="text-muted">({{ resource.rating.toFixed(1) }}/5 - {{ resource.ratingCount }} reviews)</small>
                  </div>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click="viewResource(resource)">
                      <Eye :size="14" />
                    </button>
                    <button class="btn btn-outline-warning" @click="rateResource(resource)">
                      <Star :size="14" />
                    </button>
                    <button class="btn btn-outline-success" @click="downloadResource(resource)">
                      <Download :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card-footer">
        <div class="row align-items-center">
          <div class="col-md-6">
            <small class="text-muted">
              Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredResources.length) }} 
              of {{ filteredResources.length }} resources
            </small>
          </div>
          <div class="col-md-6">
            <nav>
              <ul class="pagination pagination-sm justify-content-end mb-0">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
                    Previous
                  </button>
                </li>
                <li
                  v-for="page in visiblePages"
                  :key="page"
                  class="page-item"
                  :class="{ active: page === currentPage }"
                >
                  <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Rating Modal -->
  <div class="modal fade" id="ratingModal" tabindex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ratingModalLabel">Rate Resource</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="selectedResource" class="text-center">
            <h6 class="mb-3">{{ selectedResource.title }}</h6>
            <p class="text-muted mb-4">{{ selectedResource.description }}</p>
            
            <div class="rating-stars mb-4">
              <Star
                v-for="i in 5"
                :key="i"
                :size="32"
                :class="i <= userRating ? 'text-warning' : 'text-muted'"
                :fill="i <= userRating ? 'currentColor' : 'none'"
                class="rating-star"
                @click="setRating(i)"
                @mouseover="hoverRating = i"
                @mouseleave="hoverRating = 0"
                style="cursor: pointer;"
              />
            </div>
            
            <div class="mb-3">
              <label for="reviewComment" class="form-label">Add a comment (optional)</label>
              <textarea
                v-model="reviewComment"
                id="reviewComment"
                class="form-control"
                rows="3"
                placeholder="Share your thoughts about this resource..."
                maxlength="500"
              ></textarea>
              <div class="form-text">{{ reviewComment.length }}/500 characters</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button 
            type="button" 
            class="btn btn-primary" 
            @click="submitRating"
            :disabled="userRating === 0 || submittingRating"
          >
            <div v-if="submittingRating" class="spinner-border spinner-border-sm me-2" role="status"></div>
            {{ submittingRating ? 'Submitting...' : 'Submit Rating' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Success/Error Toast -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div 
      id="ratingToast" 
      class="toast" 
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
    >
      <div class="toast-header">
        <CheckCircle v-if="toastType === 'success'" class="text-success me-2" :size="16" />
        <AlertCircle v-else class="text-danger me-2" :size="16" />
        <strong class="me-auto">{{ toastType === 'success' ? 'Success' : 'Error' }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  BookOpen, Search, ChevronUp, ChevronDown, Star, Eye, Download,
  CheckCircle, AlertCircle
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

interface Resource {
  id: number
  title: string
  description: string
  category: string
  type: string
  rating: number
  url: string
  ratingCount: number
  userRatings: { [userId: string]: { rating: number; comment: string; date: string } }
}

const searchQuery = ref('')
const sortField = ref('title')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = 10
const selectedResource = ref<Resource | null>(null)
const userRating = ref(0)
const hoverRating = ref(0)
const reviewComment = ref('')
const submittingRating = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const authStore = useAuthStore()

const resources = ref<Resource[]>([
  {
    id: 1,
    title: 'Understanding Anxiety in Young People',
    description: 'A comprehensive guide to recognizing and managing anxiety symptoms',
    category: 'Anxiety',
    type: 'Article',
    rating: 4.5,
    url: '#',
    ratingCount: 24,
    userRatings: {}
  },
  {
    id: 2,
    title: 'Coping with Depression: A Teen\'s Guide',
    description: 'Practical strategies for managing depression and building resilience',
    category: 'Depression',
    type: 'Guide',
    rating: 4.8,
    url: '#',
    ratingCount: 31,
    userRatings: {}
  },
  {
    id: 3,
    title: 'Stress Management Techniques',
    description: 'Evidence-based methods for reducing stress and improving wellbeing',
    category: 'Stress',
    type: 'Video',
    rating: 4.2,
    url: '#',
    ratingCount: 18,
    userRatings: {}
  },
  {
    id: 4,
    title: 'Building Healthy Relationships',
    description: 'Tips for developing and maintaining positive relationships',
    category: 'Relationships',
    type: 'Article',
    rating: 4.6,
    url: '#',
    ratingCount: 27,
    userRatings: {}
  },
  {
    id: 5,
    title: 'Mindfulness for Mental Health',
    description: 'Introduction to mindfulness practices for emotional regulation',
    category: 'Wellness',
    type: 'Audio',
    rating: 4.4,
    url: '#',
    ratingCount: 15,
    userRatings: {}
  },
  {
    id: 6,
    title: 'Sleep and Mental Health',
    description: 'The connection between sleep quality and psychological wellbeing',
    category: 'Wellness',
    type: 'Article',
    rating: 4.3,
    url: '#',
    ratingCount: 22,
    userRatings: {}
  },
  {
    id: 7,
    title: 'Social Media and Self-Esteem',
    description: 'Navigating social media while maintaining a positive self-image',
    category: 'Self-Esteem',
    type: 'Guide',
    rating: 4.1,
    url: '#',
    ratingCount: 19,
    userRatings: {}
  },
  {
    id: 8,
    title: 'Crisis Support Resources',
    description: 'Emergency contacts and immediate support options',
    category: 'Crisis',
    type: 'Resource List',
    rating: 4.9,
    url: '#',
    ratingCount: 45,
    userRatings: {}
  },
  {
    id: 9,
    title: 'Nutrition and Mental Health',
    description: 'How diet affects mood and cognitive function',
    category: 'Wellness',
    type: 'Article',
    rating: 4.0,
    url: '#',
    ratingCount: 12,
    userRatings: {}
  },
  {
    id: 10,
    title: 'Exercise for Mental Wellbeing',
    description: 'The mental health benefits of physical activity',
    category: 'Wellness',
    type: 'Video',
    rating: 4.7,
    url: '#',
    ratingCount: 33,
    userRatings: {}
  },
  {
    id: 11,
    title: 'Dealing with Panic Attacks',
    description: 'Immediate strategies for managing panic attacks',
    category: 'Anxiety',
    type: 'Guide',
    rating: 4.5,
    url: '#',
    ratingCount: 28,
    userRatings: {}
  },
  {
    id: 12,
    title: 'Supporting a Friend in Crisis',
    description: 'How to help someone experiencing mental health difficulties',
    category: 'Support',
    type: 'Article',
    rating: 4.6,
    url: '#',
    ratingCount: 21,
    userRatings: {}
  }
])

const filteredResources = ref<Resource[]>([])

const paginatedResources = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredResources.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredResources.value.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  return startIndex.value + itemsPerPage
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const filterResources = () => {
  const query = searchQuery.value.toLowerCase()
  filteredResources.value = resources.value.filter(resource =>
    resource.title.toLowerCase().includes(query) ||
    resource.description.toLowerCase().includes(query) ||
    resource.category.toLowerCase().includes(query) ||
    resource.type.toLowerCase().includes(query)
  )
  currentPage.value = 1
  sortResources()
}

const sortBy = (field: keyof Resource) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  sortResources()
}

const sortResources = () => {
  filteredResources.value.sort((a, b) => {
    const aValue = a[sortField.value as keyof Resource]
    const bValue = b[sortField.value as keyof Resource]
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection.value === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection.value === 'asc' 
        ? aValue - bValue
        : bValue - aValue
    }
    
    return 0
  })
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getCategoryBadgeClass = (category: string) => {
  const classes: { [key: string]: string } = {
    'Anxiety': 'bg-primary',
    'Depression': 'bg-success',
    'Stress': 'bg-warning',
    'Relationships': 'bg-info',
    'Wellness': 'bg-secondary',
    'Self-Esteem': 'bg-purple',
    'Crisis': 'bg-danger',
    'Support': 'bg-dark'
  }
  return classes[category] || 'bg-secondary'
}

const viewResource = (resource: Resource) => {
  console.log('Viewing resource:', resource.title)
  // Mock resource viewing
}

const downloadResource = (resource: Resource) => {
  console.log('Downloading resource:', resource.title)
}

const rateResource = (resource: Resource) => {
  if (!authStore.isLoggedIn) {
    showToast('Please log in to rate resources', 'error')
    return
  }
  
  selectedResource.value = resource
  userRating.value = 0
  reviewComment.value = ''
  
  // Check if user has already rated this resource
  if (authStore.user && resource.userRatings[authStore.user.id]) {
    const existingRating = resource.userRatings[authStore.user.id]
    userRating.value = existingRating.rating
    reviewComment.value = existingRating.comment
  }
  
  // Show modal using Bootstrap's modal API
  const modal = new (window as any).bootstrap.Modal(document.getElementById('ratingModal'))
  modal.show()
}

const setRating = (rating: number) => {
  userRating.value = rating
}

const submitRating = async () => {
  if (!selectedResource.value || !authStore.user || userRating.value === 0) {
    return
  }
  
  submittingRating.value = true
  
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const resource = selectedResource.value
    const userId = authStore.user.id
    const wasNewRating = !resource.userRatings[userId]
    
    // Store the user's rating
    resource.userRatings[userId] = {
      rating: userRating.value,
      comment: reviewComment.value,
      date: new Date().toISOString()
    }
    
    // Recalculate average rating
    const ratings = Object.values(resource.userRatings).map(r => r.rating)
    resource.rating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    resource.ratingCount = ratings.length
    
    // Hide modal
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('ratingModal'))
    modal.hide()
    
    // Show success message
    showToast(
      wasNewRating ? 'Thank you for rating this resource!' : 'Your rating has been updated!',
      'success'
    )
    
  } catch (error) {
    console.error('Error submitting rating:', error)
    showToast('Failed to submit rating. Please try again.', 'error')
  } finally {
    submittingRating.value = false
  }
}

const showToast = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  
  const toastElement = document.getElementById('ratingToast')
  if (toastElement) {
    const toast = new (window as any).bootstrap.Toast(toastElement)
    toast.show()
  }
}

onMounted(() => {
  filteredResources.value = [...resources.value]
  sortResources()
})
</script>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.stars {
  display: flex;
  gap: 1px;
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.rating-star {
  transition: all 0.2s ease;
}

.rating-star:hover {
  transform: scale(1.1);
}

.bg-purple {
  background-color: #6f42c1 !important;
}

.table-responsive {
  max-height: 600px;
}

.pagination .page-link {
  color: var(--bs-primary);
}

.pagination .page-item.active .page-link {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.modal-content {
  border: none;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.toast {
  min-width: 300px;
}
</style>