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
                        :class="i <= Math.round((resource as any).overallRating || 0) ? 'text-warning' : 'text-muted'"
                        :fill="i <= Math.round((resource as any).overallRating || 0) ? 'currentColor' : 'none'"
                      />
                    </div>
                    <small class="text-muted">({{ ((resource as any).overallRating || 0).toFixed(1) }}/5 - {{ (resource as any).totalRatings || 0 }} reviews)</small>
                  </div>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <router-link :to="`/resources/${resource.id}`" class="btn btn-outline-primary">
                      <Eye :size="14" />
                    </router-link>
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
import { BookOpen, Search, ChevronUp, ChevronDown, Star, Eye, Download, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { articlePdfService } from '@/services/export/articlePdfService'

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
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const authStore = useAuthStore()
const resources = ref<any[]>([])

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

const downloadResource = async (resource: any) => {
  try {
    if (resource.type !== 'Article') {
      showToast('PDF download is currently only available for articles', 'error')
      return
    }

    const publishedDate = resource.publishedDate
      ? (typeof resource.publishedDate === 'string'
          ? resource.publishedDate
          : resource.publishedDate.toDate?.().toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }))
      : undefined

    articlePdfService.generatePDF({
      title: resource.title,
      author: resource.author || 'Unknown Author',
      content: resource.content || resource.description || '',
      publishedDate: publishedDate,
      category: resource.category
    })

    showToast('PDF downloaded successfully!', 'success')
  } catch (error) {
    console.error('Error generating PDF:', error)
    showToast('Failed to generate PDF', 'error')
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

const loadResources = async () => {
  try {
    const { resourcesService } = await import('@/services/firestore')
    const result = await resourcesService.getAll()
    
    if (result.success) {
      resources.value = result.data || []
    } else {
      console.error('Failed to load resources:', result.error)
    }
  } catch (error) {
    console.error('Error loading resources:', error)
  }
}

onMounted(() => {
  loadResources().then(() => {
    filteredResources.value = [...resources.value]
    sortResources()
  })
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