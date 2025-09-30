<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="display-6 fw-bold mb-2">Course Management</h1>
        <p class="text-muted">Manage courses, schedules, and exceptions</p>
      </div>
      <button class="btn btn-primary" @click="showCreateCourseModal">
        <Plus class="me-2" :size="16" />
        Add New Course
      </button>
    </div>

    <!-- Courses List -->
    <div class="row g-4 mb-5">
      <div v-for="course in courses" :key="course.id" class="col-lg-6 col-xl-4">
        <div class="card shadow-sm border-0 h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fw-bold">{{ course.title }}</h6>
            <div class="dropdown">
              <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                <MoreVertical :size="14" />
              </button>
              <ul class="dropdown-menu">
                <li><button class="dropdown-item" @click="editCourse(course)">Edit Course</button></li>
                <li><button class="dropdown-item" @click="manageSessions(course)">Manage Sessions</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger" @click="deleteCourse(course.id!)">Delete Course</button></li>
              </ul>
            </div>
          </div>
          <div class="card-body">
            <p class="text-muted small mb-3">{{ course.description }}</p>
            
            <div class="course-details">
              <div class="detail-row mb-2">
                <User class="text-primary me-2" :size="14" />
                <span class="small">{{ course.instructor }}</span>
              </div>
              <div class="detail-row mb-2">
                <Clock class="text-primary me-2" :size="14" />
                <span class="small">{{ course.duration }} minutes</span>
              </div>
              <div class="detail-row mb-2">
                <Users class="text-primary me-2" :size="14" />
                <span class="small">Max {{ course.maxParticipants }} participants</span>
              </div>
              <div class="detail-row mb-2">
                <Tag class="text-primary me-2" :size="14" />
                <span class="small">{{ course.category }}</span>
              </div>
            </div>

            <div class="mt-3">
              <span class="badge" :class="getCourseTypeBadge(course.courseType)">
                {{ getCourseTypeLabel(course.courseType) }}
              </span>
              <span class="badge ms-2" :class="course.isActive ? 'bg-success' : 'bg-danger'">
                {{ course.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
          <div class="card-footer">
            <div class="d-flex gap-2">
              <button class="btn btn-outline-primary btn-sm flex-fill" @click="viewBookings(course)">
                <Calendar class="me-1" :size="12" />
                Bookings
              </button>
              <button 
                v-if="course.courseType !== 'one-time'"
                class="btn btn-outline-warning btn-sm flex-fill" 
                @click="manageExceptions(course)"
              >
                <Ban class="me-1" :size="12" />
                Exceptions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Form Modal -->
    <div class="modal fade" id="courseModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingCourse ? 'Edit Course' : 'Create New Course' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveCourse">
              <div class="row g-3">
                <div class="col-md-8">
                  <label for="courseTitle" class="form-label">Course Title *</label>
                  <input
                    v-model="courseForm.title"
                    type="text"
                    id="courseTitle"
                    class="form-control"
                    required
                  >
                </div>
                <div class="col-md-4">
                  <label for="courseType" class="form-label">Course Type *</label>
                  <select
                    v-model="courseForm.courseType"
                    id="courseType"
                    class="form-select"
                    required
                    @change="onCourseTypeChange"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
                <div class="col-12">
                  <label for="courseDescription" class="form-label">Description *</label>
                  <textarea
                    v-model="courseForm.description"
                    id="courseDescription"
                    class="form-control"
                    rows="3"
                    required
                  ></textarea>
                </div>
                <div class="col-md-6">
                  <label for="courseInstructor" class="form-label">Instructor *</label>
                  <input
                    v-model="courseForm.instructor"
                    type="text"
                    id="courseInstructor"
                    class="form-control"
                    required
                  >
                </div>
                <div class="col-md-6">
                  <label for="courseCategory" class="form-label">Category *</label>
                  <select
                    v-model="courseForm.category"
                    id="courseCategory"
                    class="form-select"
                    required
                  >
                    <option value="Mental Health">Mental Health</option>
                    <option value="Wellness">Wellness</option>
                    <option value="Support Group">Support Group</option>
                    <option value="Therapy">Therapy</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label for="courseDuration" class="form-label">Duration (minutes) *</label>
                  <input
                    v-model.number="courseForm.duration"
                    type="number"
                    id="courseDuration"
                    class="form-control"
                    min="15"
                    max="240"
                    required
                  >
                </div>
                <div class="col-md-6">
                  <label for="courseCapacity" class="form-label">Max Participants *</label>
                  <input
                    v-model.number="courseForm.maxParticipants"
                    type="number"
                    id="courseCapacity"
                    class="form-control"
                    min="1"
                    max="50"
                    required
                  >
                </div>
              </div>

              <!-- Schedule Configuration for Weekly/Monthly -->
              <div v-if="courseForm.courseType === 'weekly'" class="mt-4">
                <h6 class="fw-bold mb-3">Weekly Schedule</h6>
                <div class="schedule-config">
                  <div v-for="(schedule, index) in weeklySchedules" :key="index" class="row g-2 mb-2 align-items-end">
                    <div class="col-md-3">
                      <label class="form-label small">Day</label>
                      <select v-model="schedule.dayOfWeek" class="form-select form-select-sm">
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                        <option value="0">Sunday</option>
                      </select>
                    </div>
                    <div class="col-md-3">
                      <label class="form-label small">Start Time</label>
                      <input v-model="schedule.startTime" type="time" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-3">
                      <label class="form-label small">End Time</label>
                      <input v-model="schedule.endTime" type="time" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-3">
                      <button type="button" class="btn btn-outline-danger btn-sm" @click="removeSchedule(index)">
                        <Trash2 :size="12" />
                      </button>
                    </div>
                  </div>
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="addSchedule">
                    <Plus :size="12" />
                    Add Time Slot
                  </button>
                </div>
              </div>

              <!-- Session Configuration for One-time -->
              <div v-if="courseForm.courseType === 'one-time'" class="mt-4">
                <h6 class="fw-bold mb-3">Sessions</h6>
                <div class="session-config">
                  <div v-for="(session, index) in oneTimeSessions" :key="index" class="row g-2 mb-2 align-items-end">
                    <div class="col-md-3">
                      <label class="form-label small">Date</label>
                      <input v-model="session.sessionDate" type="date" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-3">
                      <label class="form-label small">Start Time</label>
                      <input v-model="session.startTime" type="time" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-3">
                      <label class="form-label small">End Time</label>
                      <input v-model="session.endTime" type="time" class="form-control form-control-sm">
                    </div>
                    <div class="col-md-3">
                      <button type="button" class="btn btn-outline-danger btn-sm" @click="removeSession(index)">
                        <Trash2 :size="12" />
                      </button>
                    </div>
                  </div>
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="addSession">
                    <Plus :size="12" />
                    Add Session
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveCourse" :disabled="saving">
              <div v-if="saving" class="spinner-border spinner-border-sm me-2"></div>
              {{ saving ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Exceptions Management Modal -->
    <div class="modal fade" id="exceptionsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Manage Course Exceptions</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div v-if="selectedCourseForExceptions">
              <h6 class="fw-bold mb-3">{{ selectedCourseForExceptions.title }}</h6>
              <p class="text-muted small mb-4">Cancel specific dates when this course won't be available</p>

              <!-- Add Exception Form -->
              <div class="row g-3 mb-4 p-3 bg-light rounded">
                <div class="col-md-6">
                  <label for="exceptionDate" class="form-label">Date to Cancel</label>
                  <input
                    v-model="newException.exceptionDate"
                    type="date"
                    id="exceptionDate"
                    class="form-control"
                    :min="today"
                  >
                </div>
                <div class="col-md-6">
                  <label for="exceptionReason" class="form-label">Reason (Optional)</label>
                  <input
                    v-model="newException.reason"
                    type="text"
                    id="exceptionReason"
                    class="form-control"
                    placeholder="e.g., Public holiday, Instructor unavailable"
                  >
                </div>
                <div class="col-12">
                  <button class="btn btn-warning" @click="addException" :disabled="!newException.exceptionDate">
                    <Ban class="me-2" :size="16" />
                    Cancel This Date
                  </button>
                </div>
              </div>

              <!-- Existing Exceptions -->
              <div v-if="courseExceptions.length > 0">
                <h6 class="fw-bold mb-3">Cancelled Dates</h6>
                <div class="list-group">
                  <div v-for="exception in courseExceptions" :key="exception.id" class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ formatExceptionDate(exception.exceptionDate) }}</strong>
                      <div v-if="exception.reason" class="text-muted small">{{ exception.reason }}</div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm" @click="removeException(exception.id!)">
                      <Trash2 :size="12" />
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4">
                <Ban class="text-muted mb-2" :size="32" />
                <p class="text-muted">No cancelled dates for this course</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, MoreVertical, User, Clock, Users, Tag, Calendar, Ban, Trash2 } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { 
  coursesService, 
  courseSchedulesService,
  courseExceptionsService,
  oneTimeSessionsService,
  type Course,
  type CourseSchedule,
  type CourseException,
  type OneTimeCourseSession
} from '@/services/coursesService'

const authStore = useAuthStore()

// Data
const courses = ref<Course[]>([])
const editingCourse = ref(false)
const saving = ref(false)
const selectedCourseForExceptions = ref<Course | null>(null)
const courseExceptions = ref<CourseException[]>([])

const today = new Date().toISOString().split('T')[0]

// Form data
const courseForm = ref({
  title: '',
  description: '',
  instructor: '',
  duration: 60,
  maxParticipants: 12,
  category: 'Mental Health',
  courseType: 'weekly' as 'weekly' | 'monthly' | 'one-time',
  price: 0,
  isActive: true
})

const weeklySchedules = ref<Array<{
  dayOfWeek: number
  startTime: string
  endTime: string
}>>([])

const oneTimeSessions = ref<Array<{
  sessionDate: string
  startTime: string
  endTime: string
}>>([])

const newException = ref({
  exceptionDate: '',
  reason: ''
})

// Load courses
const loadCourses = async () => {
  try {
    const result = await coursesService.getAll()
    if (result.success) {
      courses.value = result.data || []
    }
  } catch (error) {
    console.error('Error loading courses:', error)
  }
}

// Show create course modal
const showCreateCourseModal = () => {
  editingCourse.value = false
  resetCourseForm()
  const modal = new (window as any).bootstrap.Modal(document.getElementById('courseModal'))
  modal.show()
}

// Edit course
const editCourse = async (course: Course) => {
  editingCourse.value = true
  courseForm.value = {
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    duration: course.duration,
    maxParticipants: course.maxParticipants,
    category: course.category,
    courseType: course.courseType,
    price: course.price,
    isActive: course.isActive
  }

  // Load existing schedules/sessions
  if (course.courseType === 'weekly' && course.id) {
    const result = await courseSchedulesService.getByCourseId(course.id)
    if (result.success) {
      weeklySchedules.value = (result.data || []).map(schedule => ({
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime
      }))
    }
  } else if (course.courseType === 'one-time' && course.id) {
    const result = await oneTimeSessionsService.getByCourseId(course.id)
    if (result.success) {
      oneTimeSessions.value = (result.data || []).map(session => ({
        sessionDate: session.sessionDate instanceof Date 
          ? session.sessionDate.toISOString().split('T')[0]
          : session.sessionDate.toDate().toISOString().split('T')[0],
        startTime: session.startTime,
        endTime: session.endTime
      }))
    }
  }

  const modal = new (window as any).bootstrap.Modal(document.getElementById('courseModal'))
  modal.show()
}

// Save course
const saveCourse = async () => {
  saving.value = true
  
  try {
    let result
    
    if (editingCourse.value) {
      // Update existing course
      const courseId = courses.value.find(c => 
        c.title === courseForm.value.title && 
        c.instructor === courseForm.value.instructor
      )?.id
      
      if (courseId) {
        result = await coursesService.update(courseId, courseForm.value)
      }
    } else {
      // Create new course
      result = await coursesService.create(courseForm.value)
    }
    
    if (result?.success) {
      const courseId = result.id || courses.value.find(c => 
        c.title === courseForm.value.title && 
        c.instructor === courseForm.value.instructor
      )?.id
      
      if (courseId) {
        // Save schedules/sessions
        if (courseForm.value.courseType === 'weekly') {
          for (const schedule of weeklySchedules.value) {
            if (schedule.startTime && schedule.endTime) {
              await courseSchedulesService.create({
                courseId,
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                isActive: true
              })
            }
          }
        } else if (courseForm.value.courseType === 'one-time') {
          for (const session of oneTimeSessions.value) {
            if (session.sessionDate && session.startTime && session.endTime) {
              await oneTimeSessionsService.create({
                courseId,
                sessionDate: new Date(session.sessionDate),
                startTime: session.startTime,
                endTime: session.endTime,
                isActive: true
              })
            }
          }
        }
      }
      
      const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('courseModal'))
      modal.hide()
      
      await loadCourses()
    }
  } catch (error) {
    console.error('Error saving course:', error)
  } finally {
    saving.value = false
  }
}

// Delete course
const deleteCourse = async (courseId: string) => {
  if (!confirm('Are you sure you want to delete this course?')) return
  
  try {
    const result = await coursesService.delete(courseId)
    if (result.success) {
      await loadCourses()
    }
  } catch (error) {
    console.error('Error deleting course:', error)
  }
}

// Manage exceptions
const manageExceptions = async (course: Course) => {
  selectedCourseForExceptions.value = course
  
  if (course.id) {
    const result = await courseExceptionsService.getByCourseId(course.id)
    if (result.success) {
      courseExceptions.value = result.data || []
    }
  }
  
  const modal = new (window as any).bootstrap.Modal(document.getElementById('exceptionsModal'))
  modal.show()
}

// Add exception
const addException = async () => {
  if (!selectedCourseForExceptions.value?.id || !newException.value.exceptionDate) return
  
  try {
    const result = await courseExceptionsService.create({
      courseId: selectedCourseForExceptions.value.id,
      exceptionDate: newException.value.exceptionDate,
      reason: newException.value.reason || undefined,
      createdBy: authStore.user?.id || ''
    })
    
    if (result.success) {
      // Reload exceptions
      const exceptionsResult = await courseExceptionsService.getByCourseId(selectedCourseForExceptions.value.id)
      if (exceptionsResult.success) {
        courseExceptions.value = exceptionsResult.data || []
      }
      
      // Reset form
      newException.value = {
        exceptionDate: '',
        reason: ''
      }
    }
  } catch (error) {
    console.error('Error adding exception:', error)
  }
}

// Remove exception
const removeException = async (exceptionId: string) => {
  if (!confirm('Are you sure you want to remove this exception?')) return
  
  try {
    const result = await courseExceptionsService.delete(exceptionId)
    if (result.success && selectedCourseForExceptions.value?.id) {
      // Reload exceptions
      const exceptionsResult = await courseExceptionsService.getByCourseId(selectedCourseForExceptions.value.id)
      if (exceptionsResult.success) {
        courseExceptions.value = exceptionsResult.data || []
      }
    }
  } catch (error) {
    console.error('Error removing exception:', error)
  }
}

// Form helpers
const resetCourseForm = () => {
  courseForm.value = {
    title: '',
    description: '',
    instructor: '',
    duration: 60,
    maxParticipants: 12,
    category: 'Mental Health',
    courseType: 'weekly',
    price: 0,
    isActive: true
  }
  weeklySchedules.value = []
  oneTimeSessions.value = []
}

const onCourseTypeChange = () => {
  weeklySchedules.value = []
  oneTimeSessions.value = []
  
  if (courseForm.value.courseType === 'weekly') {
    addSchedule()
  } else if (courseForm.value.courseType === 'one-time') {
    addSession()
  }
}

const addSchedule = () => {
  weeklySchedules.value.push({
    dayOfWeek: 1,
    startTime: '10:00',
    endTime: '11:00'
  })
}

const removeSchedule = (index: number) => {
  weeklySchedules.value.splice(index, 1)
}

const addSession = () => {
  oneTimeSessions.value.push({
    sessionDate: '',
    startTime: '10:00',
    endTime: '11:00'
  })
}

const removeSession = (index: number) => {
  oneTimeSessions.value.splice(index, 1)
}

// Utility functions
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

const formatExceptionDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const viewBookings = (course: Course) => {
  console.log('View bookings for:', course.title)
  // TODO: Implement bookings view
}

const manageSessions = (course: Course) => {
  console.log('Manage sessions for:', course.title)
  // TODO: Implement session management
}

// Lifecycle
onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.detail-row {
  display: flex;
  align-items: center;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.schedule-config, .session-config {
  max-height: 300px;
  overflow-y: auto;
}
</style>