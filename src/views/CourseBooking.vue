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
              Available Classes
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
                    <div class="mt-2">
                      <span class="badge" :class="getCourseTypeBadge(course.courseType)">
                        {{ getCourseTypeLabel(course.courseType) }}
                      </span>
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
              <div class="info-item mb-2">
                <Repeat class="text-primary me-2" :size="16" />
                <strong>Type:</strong> {{ getCourseTypeLabel(selectedCourse.courseType) }}
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

            <!-- One-time Sessions -->
            <div v-if="oneTimeSessions.length > 0" class="mt-3">
              <h6 class="fw-bold mb-2">Scheduled Sessions:</h6>
              <div class="session-list">
                <div v-for="session in oneTimeSessions.slice(0, 3)" :key="session.id" class="session-item mb-1">
                  <small class="text-muted">
                    <Calendar class="me-1" :size="12" />
                    {{ formatSessionDate(session.sessionDate) }}: {{ formatTime(session.startTime) }} - {{ formatTime(session.endTime) }}
                  </small>
                </div>
                <div v-if="oneTimeSessions.length > 3" class="text-muted small">
                  +{{ oneTimeSessions.length - 3 }} more sessions
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
import { BookOpen, User, Clock, Users, Info, Calendar, Tag, Repeat, ChevronLeft, ChevronRight, X, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import {
  coursesService,
  courseBookingsService,
  courseSchedulesService,
  courseExceptionsService,
  oneTimeSessionsService,
  type Course,
  type CourseBooking,
  type CourseSchedule,
  type CourseException,
  type OneTimeCourseSession
} from '@/services/coursesService'
import { courseInstancesService, type CourseInstance } from '@/services/courseInstancesService'
import { scheduledTasksService } from '@/services/scheduledTasksService'

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
const courseExceptions = ref<CourseException[]>([])
const oneTimeSessions = ref<OneTimeCourseSession[]>([])
const userBookings = ref<CourseBooking[]>([])
const allBookings = ref<CourseBooking[]>([])
const courseInstances = ref<CourseInstance[]>([])
const selectedTimeSlot = ref<{ start: Date; end: Date; instanceId?: string } | null>(null)

// Calendar initialization
const initializeCalendar = async () => {
  await nextTick()
  
  if (!calendarEl.value) return

  const today = new Date()

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
    eventOverlap: false,
    validRange: {
      start: new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()) // Show past dates
    }
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
  
  if (course.id) {
    // Load course schedules for weekly/monthly courses
    if (course.courseType === 'weekly' || course.courseType === 'monthly') {
      const schedulesResult = await courseSchedulesService.getByCourseId(course.id)
      if (schedulesResult.success) {
        courseSchedules.value = schedulesResult.data || []
      }

      // Load course exceptions
      const exceptionsResult = await courseExceptionsService.getByCourseId(course.id)
      if (exceptionsResult.success) {
        courseExceptions.value = exceptionsResult.data || []
      }
    }

    // Load one-time sessions for one-time courses
    if (course.courseType === 'one-time') {
      const sessionsResult = await oneTimeSessionsService.getByCourseId(course.id)
      if (sessionsResult.success) {
        oneTimeSessions.value = sessionsResult.data || []
      }
    }
  }
  
  await loadCalendarEvents()
}

// Load calendar events
const loadCalendarEvents = async () => {
  if (!calendarApi.value || !selectedCourse.value) return

  try {
    // Load course instances for this course
    const instancesResult = await courseInstancesService.getInstancesByCourse(selectedCourse.value.id!, 14)
    if (instancesResult.success) {
      courseInstances.value = instancesResult.data || []
    }

    // Load all bookings
    const result = await courseBookingsService.getAllBookings()
    if (result.success) {
      allBookings.value = result.data || []

      // Filter bookings for selected course
      const courseBookings = allBookings.value.filter(
        booking => booking.courseId === selectedCourse.value!.id
      )

      // Create events from course instances
      const instanceEvents = courseInstances.value.map(instance => {
        const startDate = instance.startTime instanceof Date ? instance.startTime : instance.startTime.toDate()
        const endDate = instance.endTime instanceof Date ? instance.endTime : instance.endTime.toDate()
        const isPast = startDate < new Date()
        const now = new Date()
        const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
        const isBeyondTwoWeeks = startDate > twoWeeksFromNow
        const availableSpots = instance.maxParticipants - instance.currentBookings
        const isFull = availableSpots <= 0

        let backgroundColor = '#d1e7ff'
        let borderColor = '#0d6efd'
        let textColor = '#084298'
        let title = `Available (${availableSpots} / ${instance.maxParticipants})`

        if (isPast) {
          backgroundColor = '#f8f9fa'
          borderColor = '#dee2e6'
          textColor = '#6c757d'
          title = 'Past Session'
        } else if (isFull) {
          backgroundColor = '#f8d7da'
          borderColor = '#dc3545'
          textColor = '#842029'
          title = 'Fully Booked'
        } else if (isBeyondTwoWeeks) {
          backgroundColor = '#e9ecef'
          borderColor = '#adb5bd'
          textColor = '#6c757d'
          title = `Not Yet Available (${availableSpots} spots)`
        }

        return {
          id: `instance-${instance.id}`,
          title: title,
          start: startDate,
          end: endDate,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          textColor: textColor,
          display: 'background',
          extendedProps: {
            instance: instance,
            isAvailable: !isPast && !isFull && !isBeyondTwoWeeks,
            availableSpots: availableSpots,
            isPast: isPast,
            isFull: isFull
          }
        }
      })

      // Create events for user bookings
      const bookingEvents = courseBookings
        .filter(booking => booking.userId === authStore.user?.id)
        .map(booking => {
          const startDate = booking.startTime instanceof Date ? booking.startTime : booking.startTime.toDate()
          const endDate = booking.endTime instanceof Date ? booking.endTime : booking.endTime.toDate()
          const isPast = startDate < new Date()

          return {
            id: `booking-${booking.id}`,
            title: `My Booking: ${booking.courseName}`,
            start: startDate,
            end: endDate,
            backgroundColor: isPast ? '#6c757d' : '#28a745',
            borderColor: isPast ? '#6c757d' : '#28a745',
            textColor: '#ffffff',
            extendedProps: {
              booking: booking,
              isUserBooking: true,
              isPast: isPast
            }
          }
        })

      calendarApi.value.removeAllEvents()
      calendarApi.value.addEventSource([...instanceEvents, ...bookingEvents])
    }
  } catch (error) {
    console.error('Error loading calendar events:', error)
  }
}

// Find course instance by time
const findInstanceByTime = (start: Date): CourseInstance | null => {
  return courseInstances.value.find(instance => {
    const instanceStart = instance.startTime instanceof Date ? instance.startTime : instance.startTime.toDate()
    return Math.abs(instanceStart.getTime() - start.getTime()) < 60000
  }) || null
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
  
  // Check if this is a past date
  if (start < new Date()) {
    showToast('Cannot book past sessions', 'error')
    calendarApi.value?.unselect()
    return
  }
  
  // Find the corresponding course instance
  const instance = findInstanceByTime(start)
  if (!instance) {
    showToast('No course instance available for this time slot', 'error')
    calendarApi.value?.unselect()
    return
  }

  // Check if instance is available
  if (instance.status === 'full' || instance.currentBookings >= instance.maxParticipants) {
    showToast('This course instance is fully booked', 'error')
    calendarApi.value?.unselect()
    return
  }

  if (instance.status === 'cancelled') {
    showToast('This course instance has been cancelled', 'error')
    calendarApi.value?.unselect()
    return
  }

  selectedTimeSlot.value = { start, end, instanceId: instance.id }
  const modal = new (window as any).bootstrap.Modal(document.getElementById('bookingModal'))
  modal.show()
  
  calendarApi.value?.unselect()
}


// Handle event click
const handleEventClick = (clickInfo: any) => {
  const booking = clickInfo.event.extendedProps.booking
  if (booking && booking.userId === authStore.user?.id && !clickInfo.event.extendedProps.isPast) {
    if (confirm('Do you want to cancel this booking?')) {
      cancelBooking(booking.id)
    }
  }
}

// Confirm booking
const confirmBooking = async () => {
  if (!selectedTimeSlot.value || !selectedCourse.value || !authStore.user || !selectedTimeSlot.value.instanceId) return

  bookingInProgress.value = true

  try {
    const result = await courseBookingsService.create({
      courseId: selectedCourse.value.id!,
      courseInstanceId: selectedTimeSlot.value.instanceId,
      courseName: selectedCourse.value.title,
      userId: authStore.user.id,
      userName: authStore.user.displayName,
      userEmail: authStore.user.email,
      startTime: selectedTimeSlot.value.start,
      endTime: selectedTimeSlot.value.end,
      status: 'confirmed',
      notes: bookingNotes.value.trim() || undefined
    })

    if (result.success) {
      await courseInstancesService.incrementBookingCount(selectedTimeSlot.value.instanceId)

      showToast('Course booked successfully!', 'success')
      const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('bookingModal'))
      modal.hide()

      selectedTimeSlot.value = null
      bookingNotes.value = ''

      await loadUserBookings()
      await loadCalendarEvents()
    } else {
      showToast(('error' in result ? result.error : undefined) || 'Failed to book course', 'error')
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
    const booking = userBookings.value.find(b => b.id === bookingId)
    const instanceId = booking?.courseInstanceId

    const result = await courseBookingsService.cancel(bookingId)
    if (result.success) {
      if (instanceId) {
        await courseInstancesService.decrementBookingCount(instanceId)
      }

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

const formatSessionDate = (dateTime: any) => {
  const date = dateTime instanceof Date ? dateTime : dateTime.toDate()
  return date.toLocaleDateString('en-AU', {
    month: 'short',
    day: 'numeric'
  })
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

const getCourseTypeBadge = (courseType: string) => {
  const badges: { [key: string]: string } = {
    'weekly': 'bg-primary',
    'monthly': 'bg-info',
    'one-time': 'bg-warning'
  }
  return badges[courseType] || 'bg-secondary'
}

const getCourseTypeLabel = (courseType: string) => {
  const labels: { [key: string]: string } = {
    'weekly': 'Weekly',
    'monthly': 'Monthly',
    'one-time': 'One-time'
  }
  return labels[courseType] || courseType
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
  await scheduledTasksService.initializeInstances()
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

.schedule-item, .session-item {
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