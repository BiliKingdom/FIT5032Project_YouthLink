<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold mb-3">Mental Health Events</h1>
      <p class="lead text-muted">
        Join our workshops, support groups, and community events
      </p>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-success text-white">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h5 class="mb-0">
              <Calendar class="me-2" :size="20" />
              Upcoming Events
            </h5>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control"
                placeholder="Search events..."
                @input="filterEvents"
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
                  Event
                  <ChevronUp v-if="sortField === 'title' && sortDirection === 'asc'" :size="14" />
                  <ChevronDown v-else-if="sortField === 'title' && sortDirection === 'desc'" :size="14" />
                </th>
                <th @click="sortBy('date')" class="sortable">
                  Date & Time
                  <ChevronUp v-if="sortField === 'date' && sortDirection === 'asc'" :size="14" />
                  <ChevronDown v-else-if="sortField === 'date' && sortDirection === 'desc'" :size="14" />
                </th>
                <th @click="sortBy('location')" class="sortable">
                  Location
                  <ChevronUp v-if="sortField === 'location' && sortDirection === 'asc'" :size="14" />
                  <ChevronDown v-else-if="sortField === 'location' && sortDirection === 'desc'" :size="14" />
                </th>
                <th @click="sortBy('capacity')" class="sortable">
                  Availability
                  <ChevronUp v-if="sortField === 'capacity' && sortDirection === 'asc'" :size="14" />
                  <ChevronDown v-else-if="sortField === 'capacity' && sortDirection === 'desc'" :size="14" />
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in paginatedEvents" :key="event.id">
                <td>
                  <div>
                    <strong>{{ event.title }}</strong>
                    <div class="text-muted small">{{ event.description }}</div>
                    <span class="badge mt-1" :class="getTypeBadgeClass(event.type)">
                      {{ event.type }}
                    </span>
                  </div>
                </td>
                <td>
                  <div>
                    <strong>{{ formatDate(event.date) }}</strong>
                    <div class="text-muted small">{{ formatTime(event.date) }}</div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <MapPin class="me-2 text-muted" :size="14" />
                    <div>
                      <div>{{ event.location }}</div>
                      <div class="text-muted small">{{ event.address }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="progress me-2" style="width: 60px; height: 8px;">
                      <div 
                        class="progress-bar" 
                        :class="getCapacityBarClass(event)"
                        :style="{ width: getCapacityPercentage(event) + '%' }"
                      ></div>
                    </div>
                    <small class="text-muted">
                      {{ event.registered }}/{{ event.capacity }}
                    </small>
                  </div>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button 
                      class="btn btn-outline-primary" 
                      @click="viewEvent(event)"
                    >
                      <Eye :size="14" />
                    </button>
                    <button 
                      class="btn btn-success" 
                      @click="registerForEvent(event)"
                      :disabled="event.registered >= event.capacity || isPastEvent(event.date)"
                    >
                      <UserPlus :size="14" />
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
              Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredEvents.length) }} 
              of {{ filteredEvents.length }} events
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
  Calendar, Search, ChevronUp, ChevronDown, MapPin, Eye, UserPlus 
} from 'lucide-vue-next'

interface Event {
  id: number
  title: string
  description: string
  type: string
  date: string
  location: string
  address: string
  capacity: number
  registered: number
}

const searchQuery = ref('')
const sortField = ref('date')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = 10

const events = ref<Event[]>([
  {
    id: 1,
    title: 'Anxiety Management Workshop',
    description: 'Learn practical techniques for managing anxiety in daily life',
    type: 'Workshop',
    date: '2025-02-15T14:00:00',
    location: 'Community Centre',
    address: '123 Collins Street, Melbourne',
    capacity: 20,
    registered: 15
  },
  {
    id: 2,
    title: 'Youth Support Group',
    description: 'Weekly peer support group for young people aged 16-25',
    type: 'Support Group',
    date: '2025-02-18T18:00:00',
    location: 'MindWell Centre',
    address: '456 Bourke Street, Melbourne',
    capacity: 12,
    registered: 8
  },
  {
    id: 3,
    title: 'Mindfulness Meditation Session',
    description: 'Guided meditation for stress reduction and mental clarity',
    type: 'Meditation',
    date: '2025-02-20T10:00:00',
    location: 'Wellness Studio',
    address: '789 Flinders Lane, Melbourne',
    capacity: 15,
    registered: 12
  },
  {
    id: 4,
    title: 'Mental Health First Aid Training',
    description: 'Learn how to provide initial support to someone experiencing mental health problems',
    type: 'Training',
    date: '2025-02-22T09:00:00',
    location: 'Training Centre',
    address: '321 Spencer Street, Melbourne',
    capacity: 25,
    registered: 18
  },
  {
    id: 5,
    title: 'Art Therapy Session',
    description: 'Express yourself through creative art activities',
    type: 'Therapy',
    date: '2025-02-25T15:00:00',
    location: 'Art Studio',
    address: '654 Chapel Street, Melbourne',
    capacity: 10,
    registered: 7
  },
  {
    id: 6,
    title: 'Depression Support Circle',
    description: 'Safe space to share experiences and coping strategies',
    type: 'Support Group',
    date: '2025-02-27T17:00:00',
    location: 'Community Hall',
    address: '987 High Street, Melbourne',
    capacity: 15,
    registered: 11
  },
  {
    id: 7,
    title: 'Stress Management Seminar',
    description: 'Evidence-based strategies for managing stress and building resilience',
    type: 'Seminar',
    date: '2025-03-01T13:00:00',
    location: 'Conference Room',
    address: '147 Queen Street, Melbourne',
    capacity: 30,
    registered: 22
  },
  {
    id: 8,
    title: 'Family Support Workshop',
    description: 'Supporting family members with mental health challenges',
    type: 'Workshop',
    date: '2025-03-05T16:00:00',
    location: 'Family Centre',
    address: '258 King Street, Melbourne',
    capacity: 20,
    registered: 14
  },
  {
    id: 9,
    title: 'Peer Mentor Training',
    description: 'Training for young people to become peer mentors',
    type: 'Training',
    date: '2025-03-08T10:00:00',
    location: 'Training Facility',
    address: '369 Lonsdale Street, Melbourne',
    capacity: 16,
    registered: 9
  },
  {
    id: 10,
    title: 'Mental Health Awareness Talk',
    description: 'Community presentation on mental health awareness and stigma reduction',
    type: 'Presentation',
    date: '2025-03-12T19:00:00',
    location: 'Town Hall',
    address: '741 Swanston Street, Melbourne',
    capacity: 100,
    registered: 65
  },
  {
    id: 11,
    title: 'Breathing Techniques Workshop',
    description: 'Learn various breathing exercises for anxiety and stress relief',
    type: 'Workshop',
    date: '2025-03-15T11:00:00',
    location: 'Wellness Centre',
    address: '852 Collins Street, Melbourne',
    capacity: 18,
    registered: 13
  },
  {
    id: 12,
    title: 'Online Safety & Mental Health',
    description: 'Navigating social media and online spaces for better mental health',
    type: 'Seminar',
    date: '2025-03-18T14:30:00',
    location: 'Digital Hub',
    address: '963 Flinders Street, Melbourne',
    capacity: 25,
    registered: 19
  }
])

const filteredEvents = ref<Event[]>([])

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEvents.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvents.value.length / itemsPerPage)
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

const filterEvents = () => {
  const query = searchQuery.value.toLowerCase()
  filteredEvents.value = events.value.filter(event =>
    event.title.toLowerCase().includes(query) ||
    event.description.toLowerCase().includes(query) ||
    event.type.toLowerCase().includes(query) ||
    event.location.toLowerCase().includes(query)
  )
  currentPage.value = 1
  sortEvents()
}

const sortBy = (field: keyof Event) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
  sortEvents()
}

const sortEvents = () => {
  filteredEvents.value.sort((a, b) => {
    let aValue = a[sortField.value as keyof Event]
    let bValue = b[sortField.value as keyof Event]
    
    if (sortField.value === 'date') {
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    }
    
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-AU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTypeBadgeClass = (type: string) => {
  const classes: { [key: string]: string } = {
    'Workshop': 'bg-primary',
    'Support Group': 'bg-success',
    'Meditation': 'bg-info',
    'Training': 'bg-warning',
    'Therapy': 'bg-purple',
    'Seminar': 'bg-secondary',
    'Presentation': 'bg-dark'
  }
  return classes[type] || 'bg-secondary'
}

const getCapacityPercentage = (event: Event) => {
  return (event.registered / event.capacity) * 100
}

const getCapacityBarClass = (event: Event) => {
  const percentage = getCapacityPercentage(event)
  if (percentage >= 90) return 'bg-danger'
  if (percentage >= 70) return 'bg-warning'
  return 'bg-success'
}

const isPastEvent = (dateString: string) => {
  return new Date(dateString) < new Date()
}

const viewEvent = (event: Event) => {
  console.log('Viewing event:', event.title)
  // Mock event viewing
}

const registerForEvent = (event: Event) => {
  if (event.registered < event.capacity && !isPastEvent(event.date)) {
    event.registered++
    console.log('Registered for event:', event.title)
    // Mock event registration
  }
}

onMounted(() => {
  filteredEvents.value = [...events.value]
  sortEvents()
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

.bg-purple {
  background-color: #6f42c1 !important;
}

.table-responsive {
  max-height: 600px;
}

.pagination .page-link {
  color: var(--bs-success);
}

.pagination .page-item.active .page-link {
  background-color: var(--bs-success);
  border-color: var(--bs-success);
}

.progress {
  border-radius: 4px;
}
</style>