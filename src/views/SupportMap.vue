<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold mb-3">Find Support Services</h1>
      <p class="lead text-muted">
        Locate mental health services and support centers near you
      </p>
    </div>

    <!-- Location Permission Alert -->
    <div v-if="!locationPermissionGranted && !locationPermissionDenied" class="alert alert-info mb-4">
      <div class="d-flex align-items-center">
        <MapPin class="me-2" :size="20" />
        <div class="flex-grow-1">
          <strong>Enable Location Services</strong>
          <p class="mb-2">Allow location access to find services near you and calculate distances.</p>
          <button class="btn btn-primary btn-sm" @click="requestLocation">
            <Navigation class="me-1" :size="14" />
            Enable Location
          </button>
        </div>
      </div>
    </div>

    <div v-if="locationError" class="alert alert-warning mb-4">
      <AlertTriangle class="me-2" :size="20" />
      {{ locationError }}
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <MapPin class="me-2" :size="20" />
                Interactive Map
              </h5>
              <div v-if="userLocation" class="text-sm">
                <Navigation class="me-1" :size="14" />
                Your location detected
              </div>
            </div>
          </div>
          <div class="card-body p-0">
            <div id="map" style="height: 500px; width: 100%;" ref="mapContainer"></div>
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
              <div class="input-group">
                <input
                  v-model="searchLocation"
                  type="text"
                  id="location"
                  class="form-control"
                  placeholder="Enter suburb or postcode"
                >
                <button class="btn btn-outline-primary" @click="searchByAddress" :disabled="!searchLocation.trim()">
                  <Search :size="14" />
                </button>
              </div>
            </div>
            <div class="mb-3">
              <label for="serviceType" class="form-label">Service Type</label>
              <select v-model="selectedServiceType" id="serviceType" class="form-select" @change="filterServices">
                <option value="">All Services</option>
                <option value="Youth Mental Health Service">Youth Mental Health</option>
                <option value="Mental Health Support">Mental Health Support</option>
                <option value="Community Health">Community Health</option>
                <option value="Crisis Support">Crisis Support</option>
                <option value="Specialist Youth Mental Health">Specialist Services</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="maxDistance" class="form-label">Maximum Distance</label>
              <select v-model="maxDistance" id="maxDistance" class="form-select" @change="filterServices">
                <option value="">Any Distance</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
                <option value="50">Within 50 km</option>
              </select>
            </div>
            <button class="btn btn-primary w-100" @click="findNearbyServices" :disabled="!userLocation">
              <MapPin class="me-2" :size="20" />
              Find Nearby Services
            </button>
          </div>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="mb-0">
                <MapPin class="me-2" :size="16" />
                Services ({{ filteredServices.length }})
              </h6>
              <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                  Sort by {{ sortBy === 'distance' ? 'Distance' : 'Name' }}
                </button>
                <ul class="dropdown-menu">
                  <li><button class="dropdown-item" @click="setSortBy('distance')">Distance</button></li>
                  <li><button class="dropdown-item" @click="setSortBy('name')">Name</button></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="text-muted mt-2">Loading services...</p>
            </div>
            
            <div v-else-if="filteredServices.length > 0" class="services-list" style="max-height: 400px; overflow-y: auto;">
              <div 
                v-for="service in filteredServices" 
                :key="service.id" 
                class="service-item mb-3 p-3 border rounded cursor-pointer"
                :class="{ 'border-primary bg-primary bg-opacity-10': selectedService?.id === service.id }"
                @click="selectService(service)"
              >
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h6 class="fw-bold mb-1">{{ service.name }}</h6>
                  <span class="badge" :class="getServiceTypeBadge(service.type)">{{ service.type }}</span>
                </div>
                
                <p class="text-muted small mb-2">
                  <MapPin class="me-1" :size="12" />
                  {{ service.address }}, {{ service.suburb }} {{ service.postcode }}
                </p>
                
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="d-flex align-items-center">
                    <Phone class="me-1 text-primary" :size="14" />
                    <a :href="`tel:${service.phone}`" class="text-decoration-none small">
                      {{ service.phone }}
                    </a>
                  </div>
                  <div v-if="service.distance !== undefined" class="text-end">
                    <span class="badge bg-success">{{ service.distance.toFixed(1) }} km</span>
                  </div>
                </div>
                
                <div class="d-flex flex-wrap gap-1 mb-2">
                  <span v-for="serviceType in service.services.slice(0, 3)" :key="serviceType" class="badge bg-light text-dark small">
                    {{ serviceType }}
                  </span>
                  <span v-if="service.services.length > 3" class="badge bg-light text-dark small">
                    +{{ service.services.length - 3 }} more
                  </span>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">{{ service.ageRange }}</small>
                  <div class="d-flex gap-1">
                    <span v-if="service.bulkBilling" class="badge bg-success small">Bulk Billing</span>
                    <button class="btn btn-outline-primary btn-sm" @click.stop="showServiceDetails(service)">
                      <Eye :size="12" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-4">
              <MapPin class="text-muted mb-2" :size="32" />
              <p class="text-muted">No services found matching your criteria</p>
              <button class="btn btn-outline-primary btn-sm" @click="clearFilters">
                Clear Filters
              </button>
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

  <!-- Service Details Modal -->
  <div class="modal fade" id="serviceModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ selectedService?.name }}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" v-if="selectedService">
          <div class="row g-4">
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">Contact Information</h6>
              <div class="mb-2">
                <MapPin class="me-2 text-primary" :size="16" />
                <strong>Address:</strong><br>
                <span class="ms-4">{{ selectedService.address }}<br>{{ selectedService.suburb }} VIC {{ selectedService.postcode }}</span>
              </div>
              <div class="mb-2">
                <Phone class="me-2 text-primary" :size="16" />
                <strong>Phone:</strong> 
                <a :href="`tel:${selectedService.phone}`" class="text-decoration-none ms-2">{{ selectedService.phone }}</a>
              </div>
              <div v-if="selectedService.email" class="mb-2">
                <Mail class="me-2 text-primary" :size="16" />
                <strong>Email:</strong> 
                <a :href="`mailto:${selectedService.email}`" class="text-decoration-none ms-2">{{ selectedService.email }}</a>
              </div>
              <div v-if="selectedService.website" class="mb-2">
                <Globe class="me-2 text-primary" :size="16" />
                <strong>Website:</strong> 
                <a :href="selectedService.website" target="_blank" class="text-decoration-none ms-2">Visit Website</a>
              </div>
            </div>
            
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">Service Details</h6>
              <div class="mb-2">
                <Users class="me-2 text-primary" :size="16" />
                <strong>Age Range:</strong> {{ selectedService.ageRange }}
              </div>
              <div class="mb-2">
                <span class="badge" :class="selectedService.bulkBilling ? 'bg-success' : 'bg-warning'">
                  {{ selectedService.bulkBilling ? 'Bulk Billing Available' : 'Private Billing' }}
                </span>
              </div>
              <div v-if="selectedService.distance !== undefined" class="mb-2">
                <Navigation class="me-2 text-primary" :size="16" />
                <strong>Distance:</strong> {{ selectedService.distance.toFixed(1) }} km from your location
              </div>
            </div>
            
            <div class="col-12">
              <h6 class="fw-bold mb-3">Services Offered</h6>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span v-for="service in selectedService.services" :key="service" class="badge bg-primary">
                  {{ service }}
                </span>
              </div>
              
              <h6 class="fw-bold mb-3">Opening Hours</h6>
              <div class="row g-2">
                <div v-for="(hours, day) in selectedService.openingHours" :key="day" class="col-md-6">
                  <div class="d-flex justify-content-between">
                    <span class="text-capitalize fw-medium">{{ day }}:</span>
                    <span>{{ hours }}</span>
                  </div>
                </div>
              </div>
              
              <div v-if="selectedService.description" class="mt-3">
                <h6 class="fw-bold mb-2">About</h6>
                <p class="text-muted">{{ selectedService.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
          <a v-if="selectedService" :href="`tel:${selectedService.phone}`" class="btn btn-primary">
            <Phone class="me-1" :size="16" />
            Call Now
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MapPin, Search, Phone, TriangleAlert as AlertTriangle, Navigation, Eye, Mail, Globe, Users } from 'lucide-vue-next'
import { serviceLocationsService } from '@/services/firestore'
import { 
  getCurrentLocation, 
  calculateDistance, 
  geocodeAddress,
  type ServiceLocation,
  type Coordinates 
} from '@/services/locationService'
import L from 'leaflet'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const mapContainer = ref<HTMLElement>()
const map = ref<L.Map>()
const userMarker = ref<L.Marker>()
const serviceMarkers = ref<L.Marker[]>([])

const searchLocation = ref('')
const selectedServiceType = ref('')
const maxDistance = ref('')
const sortBy = ref<'distance' | 'name'>('distance')
const loading = ref(false)
const locationError = ref('')
const locationPermissionGranted = ref(false)
const locationPermissionDenied = ref(false)

const services = ref<ServiceLocation[]>([])
const userLocation = ref<Coordinates | null>(null)
const selectedService = ref<ServiceLocation | null>(null)

const filteredServices = computed(() => {
  let filtered = [...services.value]
  
  // Filter by service type
  if (selectedServiceType.value) {
    filtered = filtered.filter(service => service.type === selectedServiceType.value)
  }
  
  // Filter by distance
  if (maxDistance.value && userLocation.value) {
    const maxDist = parseFloat(maxDistance.value)
    filtered = filtered.filter(service => 
      service.distance !== undefined && service.distance <= maxDist
    )
  }
  
  // Sort services
  filtered.sort((a, b) => {
    if (sortBy.value === 'distance') {
      if (a.distance === undefined && b.distance === undefined) return 0
      if (a.distance === undefined) return 1
      if (b.distance === undefined) return -1
      return a.distance - b.distance
    } else {
      return a.name.localeCompare(b.name)
    }
  })
  
  return filtered
})

const initializeMap = () => {
  if (!mapContainer.value) return
  
  // Initialize map centered on Melbourne
  map.value = L.map(mapContainer.value).setView([-37.8136, 144.9631], 12)
  
  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map.value)
}

const loadServices = async () => {
  loading.value = true
  try {
    const result = await serviceLocationsService.getAll()
    if (result.success) {
      services.value = result.data || []
      
      // Calculate distances if user location is available
      if (userLocation.value) {
        calculateDistances()
      }
      
      // Add service markers to map
      addServiceMarkersToMap()
    } else {
      console.error('Failed to load services:', result.error)
    }
  } catch (error) {
    console.error('Error loading services:', error)
  } finally {
    loading.value = false
  }
}

const calculateDistances = () => {
  if (!userLocation.value) return
  
  services.value.forEach(service => {
    service.distance = calculateDistance(userLocation.value!, service.coordinates)
  })
}

const addServiceMarkersToMap = () => {
  if (!map.value) return
  
  // Clear existing service markers
  serviceMarkers.value.forEach(marker => marker.remove())
  serviceMarkers.value = []
  
  // Add markers for each service
  services.value.forEach(service => {
    const marker = L.marker([service.coordinates.lat, service.coordinates.lng])
      .addTo(map.value!)
      .bindPopup(`
        <div class="service-popup">
          <h6 class="fw-bold mb-2">${service.name}</h6>
          <p class="mb-1 small">${service.address}, ${service.suburb}</p>
          <p class="mb-1 small"><strong>Type:</strong> ${service.type}</p>
          <p class="mb-1 small"><strong>Phone:</strong> <a href="tel:${service.phone}">${service.phone}</a></p>
          ${service.distance ? `<p class="mb-1 small"><strong>Distance:</strong> ${service.distance.toFixed(1)} km</p>` : ''}
          <div class="mt-2">
            <button class="btn btn-primary btn-sm" onclick="window.showServiceDetails('${service.id}')">
              View Details
            </button>
          </div>
        </div>
      `)
    
    serviceMarkers.value.push(marker)
  })
}

const addUserLocationToMap = () => {
  if (!map.value || !userLocation.value) return
  
  // Remove existing user marker
  if (userMarker.value) {
    userMarker.value.remove()
  }
  
  // Create custom icon for user location
  const userIcon = L.divIcon({
    html: '<div style="background-color: #007bff; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
    iconSize: [20, 20],
    className: 'user-location-marker'
  })
  
  // Add user location marker
  userMarker.value = L.marker([userLocation.value.lat, userLocation.value.lng], { icon: userIcon })
    .addTo(map.value)
    .bindPopup('Your Location')
  
  // Center map on user location
  map.value.setView([userLocation.value.lat, userLocation.value.lng], 13)
}

const requestLocation = async () => {
  try {
    locationError.value = ''
    const location = await getCurrentLocation()
    userLocation.value = location
    locationPermissionGranted.value = true
    
    // Calculate distances and update map
    calculateDistances()
    addUserLocationToMap()
    
  } catch (error: any) {
    locationPermissionDenied.value = true
    if (error.code === 1) {
      locationError.value = 'Location access denied. You can still browse services but distances won\'t be calculated.'
    } else if (error.code === 2) {
      locationError.value = 'Location unavailable. Please check your device settings.'
    } else if (error.code === 3) {
      locationError.value = 'Location request timed out. Please try again.'
    } else {
      locationError.value = 'Unable to get your location. You can still browse services.'
    }
  }
}

const searchByAddress = async () => {
  if (!searchLocation.value.trim()) return
  
  try {
    const coordinates = await geocodeAddress(searchLocation.value + ', Melbourne, Australia')
    if (coordinates) {
      userLocation.value = coordinates
      calculateDistances()
      addUserLocationToMap()
      locationError.value = ''
    } else {
      locationError.value = 'Address not found. Please try a different search term.'
    }
  } catch (error) {
    locationError.value = 'Error searching for address. Please try again.'
  }
}

const findNearbyServices = () => {
  if (!userLocation.value) {
    requestLocation()
    return
  }
  
  // Sort by distance and show closest services
  sortBy.value = 'distance'
  
  // Optionally set a default max distance
  if (!maxDistance.value) {
    maxDistance.value = '20'
  }
}

const selectService = (service: ServiceLocation) => {
  selectedService.value = service
  
  // Center map on selected service
  if (map.value) {
    map.value.setView([service.coordinates.lat, service.coordinates.lng], 15)
    
    // Open popup for selected service
    const marker = serviceMarkers.value.find(m => 
      m.getLatLng().lat === service.coordinates.lat && 
      m.getLatLng().lng === service.coordinates.lng
    )
    if (marker) {
      marker.openPopup()
    }
  }
}

const showServiceDetails = (service: ServiceLocation) => {
  selectedService.value = service
  const modal = new (window as any).bootstrap.Modal(document.getElementById('serviceModal'))
  modal.show()
}

const setSortBy = (newSortBy: 'distance' | 'name') => {
  sortBy.value = newSortBy
}

const filterServices = () => {
  // Filtering is handled by computed property
}

const clearFilters = () => {
  selectedServiceType.value = ''
  maxDistance.value = ''
  searchLocation.value = ''
}

const getServiceTypeBadge = (type: string) => {
  const badges: { [key: string]: string } = {
    'Youth Mental Health Service': 'bg-primary',
    'Mental Health Support': 'bg-success',
    'Community Health': 'bg-info',
    'Crisis Support': 'bg-danger',
    'Specialist Youth Mental Health': 'bg-warning',
    'Youth Support Service': 'bg-secondary'
  }
  return badges[type] || 'bg-secondary'
}

// Make showServiceDetails available globally for popup buttons
;(window as any).showServiceDetails = (serviceId: string) => {
  const service = services.value.find(s => s.id === serviceId)
  if (service) {
    showServiceDetails(service)
  }
}

onMounted(() => {
  initializeMap()
  loadServices()
  
  // Try to get user location automatically (but don't force it)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        locationPermissionGranted.value = true
        calculateDistances()
        addUserLocationToMap()
      },
      () => {
        // Silently fail - user can manually enable location later
      },
      { timeout: 5000 }
    )
  }
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})

// Add Leaflet CSS
const leafletCSS = document.createElement('link')
leafletCSS.rel = 'stylesheet'
leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
document.head.appendChild(leafletCSS)

onUnmounted(() => {
  document.head.removeChild(leafletCSS)
})
</script>

<style scoped>
.service-item {
  transition: all 0.2s ease;
  cursor: pointer;
}

.service-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.services-list {
  scrollbar-width: thin;
  scrollbar-color: #dee2e6 transparent;
}

.services-list::-webkit-scrollbar {
  width: 6px;
}

.services-list::-webkit-scrollbar-track {
  background: transparent;
}

.services-list::-webkit-scrollbar-thumb {
  background-color: #dee2e6;
  border-radius: 3px;
}

.services-list::-webkit-scrollbar-thumb:hover {
  background-color: #adb5bd;
}
</script>

<style>
/* Global styles for Leaflet map */
.leaflet-popup-content {
  margin: 8px 12px;
  line-height: 1.4;
}

.service-popup h6 {
  color: #0066CC;
  margin-bottom: 8px;
}

.service-popup .btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

.user-location-marker {
  background: transparent !important;
  border: none !important;
}

.leaflet-div-icon {
  background: transparent;
  border: none;
}

.modal-body h6 {
  color: #0066CC;
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
}
</style>