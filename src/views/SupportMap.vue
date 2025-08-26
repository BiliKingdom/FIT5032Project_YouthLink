<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold mb-3">Find Support Services</h1>
      <p class="lead text-muted">
        Locate mental health services and support centers near you
      </p>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <MapPin class="me-2" :size="20" />
              Interactive Map
            </h5>
          </div>
          <div class="card-body p-0">
            <div class="map-placeholder bg-light d-flex align-items-center justify-content-center" style="height: 400px;">
              <div class="text-center">
                <MapPin class="text-muted mb-3" :size="48" />
                <h5 class="text-muted">Interactive Map Coming Soon</h5>
                <p class="text-muted">Map integration will be implemented in the next phase</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header">
            <h6 class="mb-0">
              <Search class="me-2" :size="16" />
              Search Services
            </h6>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <label for="location" class="form-label">Location</label>
              <input
                v-model="searchLocation"
                type="text"
                id="location"
                class="form-control"
                placeholder="Enter suburb or postcode"
              >
            </div>
            <div class="mb-3">
              <label for="serviceType" class="form-label">Service Type</label>
              <select v-model="selectedServiceType" id="serviceType" class="form-select">
                <option value="">All Services</option>
                <option value="counselling">Counselling</option>
                <option value="clinic">Mental Health Clinic</option>
                <option value="support-group">Support Group</option>
                <option value="crisis">Crisis Support</option>
              </select>
            </div>
            <button class="btn btn-primary w-100" @click="searchServices">
              <Search class="me-2" :size="16" />
              Search
            </button>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-header">
            <h6 class="mb-0">
              <MapPin class="me-2" :size="16" />
              Nearby Services
            </h6>
          </div>
          <div class="card-body">
            <div v-for="service in filteredServices" :key="service.id" class="service-item mb-3 p-3 bg-light rounded">
              <h6 class="fw-bold">{{ service.name }}</h6>
              <p class="text-muted small mb-2">{{ service.address }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-primary">{{ service.type }}</span>
                <div class="text-end">
                  <div class="text-muted small">{{ service.distance }}</div>
                  <a :href="`tel:${service.phone}`" class="text-decoration-none">
                    <Phone class="me-1" :size="14" />
                    {{ service.phone }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Emergency Support -->
    <div class="row mt-5">
      <div class="col-12">
        <div class="alert alert-danger">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h5 class="alert-heading mb-2">
                <AlertTriangle class="me-2" :size="20" />
                Need Immediate Help?
              </h5>
              <p class="mb-0">
                If you're experiencing a mental health crisis, don't wait. Contact emergency services immediately.
              </p>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
              <div class="d-flex gap-2 justify-content-md-end">
                <a href="tel:000" class="btn btn-danger">
                  <Phone class="me-1" :size="16" />
                  Emergency 000
                </a>
                <a href="tel:131114" class="btn btn-outline-danger">
                  <Phone class="me-1" :size="16" />
                  Lifeline 13 11 14
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MapPin, Search, Phone, AlertTriangle } from 'lucide-vue-next'

interface Service {
  id: number
  name: string
  type: string
  address: string
  phone: string
  distance: string
}

const searchLocation = ref('')
const selectedServiceType = ref('')

const services: Service[] = [
  {
    id: 1,
    name: 'Melbourne Youth Mental Health Centre',
    type: 'counselling',
    address: '123 Collins Street, Melbourne VIC 3000',
    phone: '(03) 9123 4567',
    distance: '2.1 km'
  },
  {
    id: 2,
    name: 'Headspace Melbourne',
    type: 'clinic',
    address: '456 Bourke Street, Melbourne VIC 3000',
    phone: '(03) 9234 5678',
    distance: '3.5 km'
  },
  {
    id: 3,
    name: 'Beyond Blue Support Group',
    type: 'support-group',
    address: '789 Flinders Lane, Melbourne VIC 3000',
    phone: '(03) 9345 6789',
    distance: '1.8 km'
  },
  {
    id: 4,
    name: 'Crisis Assessment Team',
    type: 'crisis',
    address: '321 Spencer Street, Melbourne VIC 3000',
    phone: '(03) 9456 7890',
    distance: '4.2 km'
  }
]

const filteredServices = computed(() => {
  if (!selectedServiceType.value) {
    return services
  }
  return services.filter(service => service.type === selectedServiceType.value)
})

const searchServices = () => {
  // Mock search functionality
  console.log('Searching for services:', {
    location: searchLocation.value,
    type: selectedServiceType.value
  })
}
</script>

<style scoped>
.service-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.map-placeholder {
  border: 2px dashed #dee2e6;
}
</style>