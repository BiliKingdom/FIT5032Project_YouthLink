<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h1 class="display-5 fw-bold mb-3">Course Booking</h1>
      <p class="lead text-muted">
        Book your mental health and wellness courses using our interactive calendar
      </p>
    </div>

    <!-- Course Selection -->
    <div class="row mb-4">
      <div class="col-lg-4">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">
              <BookOpen class="me-2" :size="20" />
              Available Courses
            </h5>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <div v-else class="list-group list-group-flush">
              <div 
                v-for="course in courses" 
                :key="course.id"
                class="list-group-item list-group-item-action"
                :class="{ 'active': selectedCourse?.id === course.id }"
                @click="selectCourse(course)"
                style="cursor: pointer;"
              >
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold">{{ course.title }}</h6>
                    <p class="mb-1 small text-muted">{{ course.description }}</p>
                    <div class="d-flex align-items-center gap-3 mt-2">
                      <small class="text-muted">
                        <User class="me-1" :size="12" />
                        {{ course.instructor }}
                      </small>
                      <small class="text-muted">
                        <Clock class="me-1" :size="12" />
                        {{ course.duration }}min
                      </small>
                      <small class="text-muted">
                        <Users class="me-1" :size="12" />
                        Max {{ course.maxParticipants }}
                      </small>
                    </div>
                  </div>
                  <span class="badge bg-success">Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Course Details -->
        <div v-if="selectedCourse" class="card shadow-sm border-0 mt-4">
          <div class="card-header bg-success text-white">
            <h6 class="mb-0">
              <Info class="me-2" :size="16" />
              Course Details
            </h6>
          </div>
          <div class="card-body">
            <h6 class="fw-bold">{{ selectedCourse.title }}</h6>
            <p class="text-muted small mb-3">{{ selectedCourse.description }}</p>
            
            <div class="course-info">
              <div class="info-item mb-2">
                <User class="text-primary me-2" :size="16" />
                <strong>Instructor:</strong> {{ selectedCourse.instructor }}
              </div>
              <div class="info-item mb-2">
                <Clock class="text-primary me-2" :size="16" />
                <strong>Duration:</strong> {{ selectedCourse.duration }} minutes
              </div>
              <div class="info-item mb-2">
                <Users class="text-primary me-2" :size="16" />
                <strong>Max Participants:</strong> {{ selectedCourse.maxParticipants }}
              </div>
              <div class="info-item mb-2">
                <Tag class="text-primary me-2" :size="16" />
                <strong>Category:</strong> {{ selectedCourse.category }}
              </div>
            </div>

            <!-- Course Schedule -->
            <div v-if="courseSchedules.length > 0" class="mt-3">
              <h6 class="fw-bold mb-2">Weekly Schedule:</h6>
              <div class="schedule-list">
                <div v-for="schedule in courseSchedules" :key="schedule.id" class="schedule-item mb-1">
                  <small class="text-muted">
                    <Calendar class="me-1" :size="12" />
                    {{ getDayName(schedule.dayOfWeek) }}s: {{ formatTime(schedule.startTime) }} - {{ formatTime(schedule.endTime) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar -->
      <div class="col-lg-8">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-info text-white">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <Calendar class="me-2" :size="20" />
                Booking Calendar
              </h5>
              <div class="d-flex gap-2">
                <button 
                  class="btn btn-outline-light btn-sm"
                  @click="calendarApi?.prev()"
                >
                  <ChevronLeft :size="16" />
                </button>
                <button 
                  class="btn btn-outline-light btn-sm"
                  @click="calendarApi?.today()"
                >
                  Today
                </button>
                <button 
                  class="btn btn-outline-light btn-sm"
                  @click="calendarApi?.next()"
                >
                  <ChevronRight :size="16" />
                </button>
              </div>
            </div>
          </div>
          <div class="card-body p-0">
            <div id="calendar" ref="calendarEl"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- My Bookings -->
    <div class="row mt-5">
      <div class="col-12">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">
              <BookOpen class="me-2" :size="20" />
              My Bookings
            </h5>
          </div>
          <div class="card-body">
            <div v-if="userBookings.length > 0" class="row g-3">
              <div v-for="booking in userBookings" :key="booking.id" class="col-md-6 col-lg-4">
                <div class="booking-card p-3 border rounded">
                  <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0">{{ booking.courseName }}</h6>
                    <span class="badge" :class="getStatusBadgeClass(booking.status)">
                      {{ booking.status }}
                    </span>
                  </div>
                  <div class="booking-details">
                    <div class="detail-item mb-1">
                      <Calendar class="text-muted me-1" :size="14" />
                      <small>{{ formatBookingDate(booking.startTime) }}</small>
                    </div>
                    <div class="detail-item mb-1">
                      <Clock class="text-muted me-1" :size="14" />
                      <small>{{ formatBookingTime(booking.startTime) }} - {{ formatBookingTime(booking.endTime) }}</small>
                    </div>
                  </div>
                  <div class="mt-2">
                    <button 
                      v-if="booking.status === 'confirmed' && !isPastBooking(booking.startTime)"
                      class="btn btn-outline-danger btn-sm"
                      @click="cancelBooking(booking.id!)"
                    >
                      <X class="me-1" :size="12" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <BookOpen class="text-muted mb-2" :size="48" />
              <p class="text-muted">No bookings yet. Select a course and click on available time slots to book!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Booking Confirmation Modal -->
  <div class="modal fade" id="bookingModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Confirm Booking</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div v-if="selectedTimeSlot && selectedCourse">
            <h6 class="fw-bold">{{ selectedCourse.title }}</h6>
            <p class="text-muted">{{ selectedCourse.description }}</p>
            
            <div class="booking-summary p-3 bg-light rounded">
              <div class="row">
                <div class="col-6">
                  <strong>Date:</strong><br>
                  <span class="text-muted">{{ formatModalDate(selectedTimeSlot.start) }}</span>
                </div>
                <div class="col-6">
                  <strong>Time:</strong><br>
                  <span class="text-muted">{{ formatModalTime(selectedTimeSlot.start) }} - {{ formatModalTime(selectedTimeSlot.end) }}</span>
                </div>
              </div>
              <hr>
              <div class="row">
                <div class="col-6">
                  <strong>Instructor:</strong><br>
                  <span class="text-muted">{{ selectedCourse.instructor }}</span>
                </div>
                <div class="col-6">
                  <strong>Duration:</strong><br>
                  <span class="text-muted">{{ selectedCourse.duration }} minutes</span>
                </div>
              </div>
            </div>

            <div class="mt-3">
              <label for="bookingNotes" class="form-label">Notes (Optional)</label>
              <textarea
                v-model="bookingNotes"
                id="bookingNotes"
                class="form-control"
                rows="3"
                placeholder="Any special requirements or notes..."
                maxlength="500"
              ></textarea>
              <div class="form-text">{{ bookingNotes.length }}/500 characters</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="confirmBooking"
            :disabled="bookingInProgress"
          >
            <div v-if="bookingInProgress" class="spinner-border spinner-border-sm me-2"></div>
            {{ bookingInProgress ? 'Booking...' : 'Confirm Booking' }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Toast Notifications -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div 
      id="bookingToast" 
      class="toast" 
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
    >
      <div class="toast-header">
        <CheckCircle v-if="toastType === 'success'" class="text-success me-2" :size="16" />
        <AlertCircle v-else class="text-danger me-2" :size="16" />
        <strong class="me-auto">{{ toastType === 'success' ? 'Success' : 'Error' }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">
        {{ toastMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  BookOpen, User, Clock, Users, Info, Calendar, Tag, 
  ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle 
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { 
  coursesService, 
  courseBookingsService, 
  courseSchedulesService,
  type Course, 
  type CourseBooking, 
  type CourseSchedule 
} from '@/services/coursesService'

// FullCalendar imports
import { Calendar as FullCalendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

const authStore = useAuthStore()

// Refs
const calendarEl = ref<HTMLElement>()
const calendarApi = ref<FullCalendar>()
const loading = ref(false)
const bookingInProgress = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const bookingNotes = ref('')

// Data
const courses = ref<Course[]>([])
const selectedCourse = ref<Course | null>(null)
const courseSchedules = ref<CourseSchedule[]>([])
const userBookings = ref<CourseBooking[]>([])
const allBookings = ref<CourseBooking[]>([])
const selectedTimeSlot = ref<{ start: Date; end: Date } | null>(null)

// Calendar initialization
const initializeCalendar = async () => {
  await nextTick()
  
  if (!calendarEl.value) return

  calendarApi.value = new FullCalendar(calendarEl.value, {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    height: 600,
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    businessHours: {
      daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday - Saturday
      startTime: '09:00',
      endTime: '18:00'
    },
    selectable: true,
    selectMirror: true,
    select: handleDateSelect,
    eventClick: handleEventClick,
    events: [],
    eventColor: '#0066CC',
    selectConstraint: 'businessHours',
    selectOverlap: false,
    eventOverlap: false
  })

  calendarApi.value.render()
  await loadCalendarEvents()
}

// Load courses
const loadCourses = async () => {
  loading.value = true
  try {
    const result = await coursesService.getAll()
    if (result.success) {
      courses.value = result.data || []
    } else {
      showToast('Failed to load courses', 'error')
    }
  } catch (error) {
    console.error('Error loading courses:', error)
    showToast('Error loading courses', 'error')
  } finally {
    loading.value = false
  }
}

// Select course
const selectCourse = async (course: Course) => {
  selectedCourse.value = course
  
  // Load course schedules
  if (course.id) {
    const result = await courseSchedulesService.getByCourseId(course.id)
    if (result.success) {
      courseSchedules.value = result.data || []
    }
  }
  
  await loadCalendarEvents()
}

// Load calendar events
const loadCalendarEvents = async () => {
  if (!calendarApi.value || !selectedCourse.value) return

  try {
    // Load all bookings for this course
    const result = await courseBookingsService.getAllBookings()
    if (result.success) {
      allBookings.value = result.data || []
      
      // Filter bookings for selected course
      const courseBookings = allBookings.value.filter(
        booking => booking.courseId === selectedCourse.value!.id
      )
      
      // Convert bookings to calendar events
      const events = courseBookings.map(booking => ({
        id: booking.id,
        title: `${booking.courseName} (${getBookingCount(booking)} / ${selectedCourse.value!.maxParticipants})`,
        start: booking.startTime instanceof Date ? booking.startTime : booking.startTime.toDate(),
        end: booking.endTime instanceof Date ? booking.endTime : booking.endTime.toDate(),
        backgroundColor: booking.userId === authStore.user?.id ? '#28a745' : '#6c757d',
        borderColor: booking.userId === authStore.user?.id ? '#28a745' : '#6c757d',
        extendedProps: {
          booking: booking,
          isUserBooking: booking.userId === authStore.user?.id
        }
      }))
      
      // Generate available time slots based on course schedule
      const availableSlots = generateAvailableSlots()
      
      // Add available slots as selectable events
      const slotEvents = availableSlots.map(slot => ({
        id: `slot-${slot.start.getTime()}`,
        title: `Available (${getAvailableSpots(slot)} spots)`,
        start: slot.start,
        end: slot.end,
        backgroundColor: '#e9ecef',
        borderColor: '#dee2e6',
        textColor: '#495057',
        display: 'background',
        extendedProps: {
          isAvailable: true,
          availableSpots: getAvailableSpots(slot)
        }
      }))
      
      calendarApi.value.removeAllEvents()
      calendarApi.value.addEventSource([...events, ...slotEvents])
    }
  } catch (error) {
    console.error('Error loading calendar events:', error)
  }
}

// Generate available time slots for the next 4 weeks
const generateAvailableSlots = () => {
  if (!selectedCourse.value || courseSchedules.value.length === 0) return []
  
  const slots = []
  const today = new Date()
  const endDate = new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000) // 4 weeks from now
  
  for (let date = new Date(today); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dayOfWeek = date.getDay()
    
    // Find schedules for this day
    const daySchedules = courseSchedules.value.filter(schedule => schedule.dayOfWeek === dayOfWeek)
    
    for (const schedule of daySchedules) {
      const [startHour, startMinute] = schedule.startTime.split(':').map(Number)
      const [endHour, endMinute] = schedule.endTime.split(':').map(Number)
      
      const slotStart = new Date(date)
      slotStart.setHours(startHour, startMinute, 0, 0)
      
      const slotEnd = new Date(date)
      slotEnd.setHours(endHour, endMinute, 0, 0)
      
      // Only add future slots
      if (slotStart > today) {
        slots.push({ start: new Date(slotStart), end: new Date(slotEnd) })
      }
    }
  }
  
  return slots
}

// Get booking count for a specific time slot
const getBookingCount = (booking: CourseBooking) => {
  const bookingStart = booking.startTime instanceof Date ? booking.startTime : booking.startTime.toDate()
  
  return allBookings.value.filter(b => {
    if (b.courseId !== selectedCourse.value!.id || b.status !== 'confirmed') return false
    
    const bStart = b.startTime instanceof Date ? b.startTime : b.startTime.toDate()
    const timeDiff = Math.abs(bStart.getTime() - bookingStart.getTime())
    return timeDiff < 30 * 60 * 1000 // Same time slot (within 30 minutes)
  }).length
}

// Get available spots for a time slot
const getAvailableSpots = (slot: { start: Date; end: Date }) => {
  if (!selectedCourse.value) return 0
  
  const bookingCount = allBookings.value.filter(booking => {
    if (booking.courseId !== selectedCourse.value!.id || booking.status !== 'confirmed') return false
    
    const bookingStart = booking.startTime instanceof Date ? booking.startTime : booking.startTime.toDate()
    const timeDiff = Math.abs(bookingStart.getTime() - slot.start.getTime())
    return timeDiff < 30 * 60 * 1000
  }).length
  
  return selectedCourse.value.maxParticipants - bookingCount
}

// Handle date selection
const handleDateSelect = (selectInfo: any) => {
  if (!authStore.isLoggedIn) {
    showToast('Please log in to book courses', 'error')
    return
  }
  
  if (!selectedCourse.value) {
    showToast('Please select a course first', 'error')
    return
  }
  
  const start = selectInfo.start
  const end = selectInfo.end
  
  // Check if this is a valid time slot
  const isValidSlot = courseSchedules.value.some(schedule => {
    const dayOfWeek = start.getDay()
    if (schedule.dayOfWeek !== dayOfWeek) return false
    
    const [scheduleStartHour, scheduleStartMinute] = schedule.startTime.split(':').map(Number)
    const [scheduleEndHour, scheduleEndMinute] = schedule.endTime.split(':').map(Number)
    
    const scheduleStart = new Date(start)
    scheduleStart.setHours(scheduleStartHour, scheduleStartMinute, 0, 0)
    
    const scheduleEnd = new Date(start)
    scheduleEnd.setHours(scheduleEndHour, scheduleEndMinute, 0, 0)
    
    return start.getTime() === scheduleStart.getTime() && end.getTime() === scheduleEnd.getTime()
  })
  
  if (!isValidSlot) {
    showToast('Please select a valid time slot for this course', 'error')
    calendarApi.value?.unselect()
    return
  }
  
  // Check if slot is available
  const availableSpots = getAvailableSpots({ start, end })
  if (availableSpots <= 0) {
    showToast('This time slot is fully booked', 'error')
    calendarApi.value?.unselect()
    return
  }
  
  selectedTimeSlot.value = { start, end }
  const modal = new (window as any).bootstrap.Modal(document.getElementById('bookingModal'))
  modal.show()
  
  calendarApi.value?.unselect()
}

// Handle event click
const handleEventClick = (clickInfo: any) => {
  const booking = clickInfo.event.extendedProps.booking
  if (booking && booking.userId === authStore.user?.id) {
    if (confirm('Do you want to cancel this booking?')) {
      cancelBooking(booking.id)
    }
  }
}

// Confirm booking
const confirmBooking = async () => {
  if (!selectedTimeSlot.value || !selectedCourse.value || !authStore.user) return
  
  bookingInProgress.value = true
  
  try {
    const result = await courseBookingsService.create({
      courseId: selectedCourse.value.id!,
      courseName: selectedCourse.value.title,
      userId: authStore.user.id,
      userName: authStore.user.displayName,
      userEmail: authStore.user.email,
      startTime: selectedTimeSlot.value.start,
      endTime: selectedTimeSlot.value.end,
      notes: bookingNotes.value.trim() || undefined
    })
    
    if (result.success) {
      showToast('Course booked successfully!', 'success')
      const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('bookingModal'))
      modal.hide()
      
      // Reset form
      selectedTimeSlot.value = null
      bookingNotes.value = ''
      
      // Reload data
      await loadUserBookings()
      await loadCalendarEvents()
    } else {
      showToast(result.error || 'Failed to book course', 'error')
    }
  } catch (error) {
    console.error('Error booking course:', error)
    showToast('Error booking course', 'error')
  } finally {
    bookingInProgress.value = false
  }
}

// Load user bookings
const loadUserBookings = async () => {
  if (!authStore.user) return
  
  try {
    const result = await courseBookingsService.getUserBookings(authStore.user.id)
    if (result.success) {
      userBookings.value = result.data || []
    }
  } catch (error) {
    console.error('Error loading user bookings:', error)
  }
}

// Cancel booking
const cancelBooking = async (bookingId: string) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return
  
  try {
    const result = await courseBookingsService.cancel(bookingId)
    if (result.success) {
      showToast('Booking cancelled successfully', 'success')
      await loadUserBookings()
      await loadCalendarEvents()
    } else {
      showToast('Failed to cancel booking', 'error')
    }
  } catch (error) {
    console.error('Error cancelling booking:', error)
    showToast('Error cancelling booking', 'error')
  }
}

// Utility functions
const getDayName = (dayOfWeek: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayOfWeek]
}

const formatTime = (timeString: string) => {
  const [hour, minute] = timeString.split(':')
  const date = new Date()
  date.setHours(parseInt(hour), parseInt(minute))
  return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
}

const formatBookingDate = (dateTime: any) => {
  const date = dateTime instanceof Date ? dateTime : dateTime.toDate()
  return date.toLocaleDateString('en-AU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatBookingTime = (dateTime: any) => {
  const date = dateTime instanceof Date ? dateTime : dateTime.toDate()
  return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
}

const formatModalDate = (date: Date) => {
  return date.toLocaleDateString('en-AU', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatModalTime = (date: Date) => {
  return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
}

const getStatusBadgeClass = (status: string) => {
  const classes: { [key: string]: string } = {
    'confirmed': 'bg-success',
    'cancelled': 'bg-danger',
    'completed': 'bg-secondary'
  }
  return classes[status] || 'bg-secondary'
}

const isPastBooking = (dateTime: any) => {
  const date = dateTime instanceof Date ? dateTime : dateTime.toDate()
  return date < new Date()
}

const showToast = (message: string, type: 'success' | 'error') => {
  toastMessage.value = message
  toastType.value = type
  
  const toastElement = document.getElementById('bookingToast')
  if (toastElement) {
    const toast = new (window as any).bootstrap.Toast(toastElement)
    toast.show()
  }
}

// Lifecycle
onMounted(async () => {
  await loadCourses()
  await loadUserBookings()
  await initializeCalendar()
})

onUnmounted(() => {
  if (calendarApi.value) {
    calendarApi.value.destroy()
  }
})
</script>

<style scoped>
.course-info .info-item {
  display: flex;
  align-items: center;
}

.booking-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  background-color: #f8f9fa;
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.detail-item {
  display: flex;
  align-items: center;
}

.schedule-item {
  padding: 0.25rem 0;
}

.list-group-item.active {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

.booking-summary {
  border: 1px solid #dee2e6;
}

/* FullCalendar custom styles */
:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-toolbar-title) {
  font-size: 1.25rem;
  font-weight: 600;
}

:deep(.fc-button) {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}

:deep(.fc-button:hover) {
  background-color: #0056b3;
  border-color: #0056b3;
}

:deep(.fc-event) {
  border-radius: 4px;
  font-size: 0.875rem;
}

:deep(.fc-daygrid-event) {
  margin: 1px;
}

:deep(.fc-timegrid-event) {
  border-radius: 4px;
}

:deep(.fc-highlight) {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
}

:deep(.fc-select-mirror) {
  background-color: rgba(var(--bs-success-rgb), 0.3);
}
</style>