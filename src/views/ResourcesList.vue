<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold mb-3">Mental Health Resources</h1>
      <p class="lead text-muted">
        Browse our collection of articles, guides, and educational materials
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
                        :class="i <= resource.rating ? 'text-warning' : 'text-muted'"
                        :fill="i <= resource.rating ? 'currentColor' : 'none'"
                      />
                    </div>
                    <small class="text-muted">({{ resource.rating }}/5)</small>
                  </div>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" @click="viewResource(resource)">
                      <Eye :size="14" />
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  BookOpen, Search, ChevronUp, ChevronDown, Star, Eye, Download 
} from 'lucide-vue-next'

interface Resource {
  id: number
  title: string
  description: string
  category: string
  type: string
  rating: number
  url: string
}

const searchQuery = ref('')
const sortField = ref('title')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = 10

const resources = ref<Resource[]>([
  {
    id: 1,
    title: 'Understanding Anxiety in Young People',
    description: 'A comprehensive guide to recognizing and managing anxiety symptoms',
    category: 'Anxiety',
    type: 'Article',
    rating: 4.5,
    url: '#'
  },
  {
    id: 2,
    title: 'Coping with Depression: A Teen\'s Guide',
    description: 'Practical strategies for managing depression and building resilience',
    category: 'Depression',
    type: 'Guide',
    rating: 4.8,
    url: '#'
  },
  {
    id: 3,
    title: 'Stress Management Techniques',
    description: 'Evidence-based methods for reducing stress and improving wellbeing',
    category: 'Stress',
    type: 'Video',
    rating: 4.2,
    url: '#'
  },
  {
    id: 4,
    title: 'Building Healthy Relationships',
    description: 'Tips for developing and maintaining positive relationships',
    category: 'Relationships',
    type: 'Article',
    rating: 4.6,
    url: '#'
  },
  {
    id: 5,
    title: 'Mindfulness for Mental Health',
    description: 'Introduction to mindfulness practices for emotional regulation',
    category: 'Wellness',
    type: 'Audio',
    rating: 4.4,
    url: '#'
  },
  {
    id: 6,
    title: 'Sleep and Mental Health',
    description: 'The connection between sleep quality and psychological wellbeing',
    category: 'Wellness',
    type: 'Article',
    rating: 4.3,
    url: '#'
  },
  {
    id: 7,
    title: 'Social Media and Self-Esteem',
    description: 'Navigating social media while maintaining a positive self-image',
    category: 'Self-Esteem',
    type: 'Guide',
    rating: 4.1,
    url: '#'
  },
  {
    id: 8,
    title: 'Crisis Support Resources',
    description: 'Emergency contacts and immediate support options',
    category: 'Crisis',
    type: 'Resource List',
    rating: 4.9,
    url: '#'
  },
  {
    id: 9,
    title: 'Nutrition and Mental Health',
    description: 'How diet affects mood and cognitive function',
    category: 'Wellness',
    type: 'Article',
    rating: 4.0,
    url: '#'
  },
  {
    id: 10,
    title: 'Exercise for Mental Wellbeing',
    description: 'The mental health benefits of physical activity',
    category: 'Wellness',
    type: 'Video',
    rating: 4.7,
    url: '#'
  },
  {
    id: 11,
    title: 'Dealing with Panic Attacks',
    description: 'Immediate strategies for managing panic attacks',
    category: 'Anxiety',
    type: 'Guide',
    rating: 4.5,
    url: '#'
  },
  {
    id: 12,
    title: 'Supporting a Friend in Crisis',
    description: 'How to help someone experiencing mental health difficulties',
    category: 'Support',
    type: 'Article',
    rating: 4.6,
    url: '#'
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
  // Mock resource download
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
</style>