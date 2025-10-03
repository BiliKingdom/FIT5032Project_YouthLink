import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/config/firebase'

// Course interface
export interface Course {
  id?: string
  title: string
  description: string
  instructor: string
  duration: number // in minutes
  maxParticipants: number
  category: string
  price: number
  isActive: boolean
  courseType: 'one-time' | 'weekly' | 'monthly'
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

// Course booking interface
export interface CourseBooking {
  id?: string
  courseId: string
  courseInstanceId?: string
  courseName: string
  userId: string
  userName: string
  userEmail: string
  startTime: Timestamp | Date
  endTime: Timestamp | Date
  status: 'confirmed' | 'cancelled' | 'completed'
  notes?: string
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

// Course schedule interface (recurring sessions)
export interface CourseSchedule {
  id?: string
  courseId: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  isActive: boolean
  createdAt: Timestamp | Date
}

// Course exception interface (for cancelled sessions)
export interface CourseException {
  id?: string
  courseId: string
  exceptionDate: string // YYYY-MM-DD format
  reason?: string
  createdAt: Timestamp | Date
  createdBy: string // admin user ID
}

// One-time course session interface
export interface OneTimeCourseSession {
  id?: string
  courseId: string
  sessionDate: Timestamp | Date
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  isActive: boolean
  createdAt: Timestamp | Date
}

// Courses service
export const coursesService = {
  // Get all active courses
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'courses'))
      const courses: Course[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Course
        if (data.isActive) {
          courses.push({
            id: doc.id,
            ...data
          } as Course)
        }
      })
      
      courses.sort((a, b) => a.title.localeCompare(b.title))
      return { success: true, data: courses }
    } catch (error) {
      console.error('Error fetching courses:', error)
      return { success: false, error: 'Failed to fetch courses' }
    }
  },

  // Get single course
  async getById(courseId: string) {
    try {
      const docRef = doc(db, 'courses', courseId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { 
          success: true, 
          data: { id: docSnap.id, ...docSnap.data() } as Course 
        }
      } else {
        return { success: false, error: 'Course not found' }
      }
    } catch (error) {
      console.error('Error fetching course:', error)
      return { success: false, error: 'Failed to fetch course' }
    }
  },

  // Create new course (admin only)
  async create(courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'courses'), {
        ...courseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating course:', error)
      return { success: false, error: 'Failed to create course' }
    }
  },

  // Update course (admin only)
  async update(courseId: string, courseData: Partial<Course>) {
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        ...courseData,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating course:', error)
      return { success: false, error: 'Failed to update course' }
    }
  },

  // Delete course (admin only)
  async delete(courseId: string) {
    try {
      await updateDoc(doc(db, 'courses', courseId), {
        isActive: false,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error deleting course:', error)
      return { success: false, error: 'Failed to delete course' }
    }
  }
}

// Course bookings service
export const courseBookingsService = {
  // Create new booking
  async create(bookingData: Omit<CourseBooking, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Check for conflicts first
      const conflictCheck = await this.checkConflicts(
        bookingData.userId,
        bookingData.startTime,
        bookingData.endTime
      )

      if (!conflictCheck.success) {
        return { success: false, error: conflictCheck.error || 'Failed to check conflicts' }
      }

      if ('hasConflict' in conflictCheck && conflictCheck.hasConflict) {
        return {
          success: false,
          error: 'You already have a booking at this time. Please choose a different time slot.'
        }
      }
      
      // Check course capacity
      const capacityCheck = await this.checkCapacity(
        bookingData.courseId,
        bookingData.startTime
      )

      if (!capacityCheck.success) {
        return { success: false, error: capacityCheck.error || 'Failed to check capacity' }
      }

      if ('isFull' in capacityCheck && capacityCheck.isFull) {
        return {
          success: false,
          error: 'This time slot is fully booked. Please choose another time.'
        }
      }
      
      const docRef = await addDoc(collection(db, 'course_bookings'), {
        ...bookingData,
        status: 'confirmed',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating booking:', error)
      return { success: false, error: 'Failed to create booking' }
    }
  },

  // Check for booking conflicts
  async checkConflicts(userId: string, startTime: Timestamp | Date, endTime: Timestamp | Date) {
    try {
      const q = query(
        collection(db, 'course_bookings'),
        where('userId', '==', userId),
        where('status', '==', 'confirmed')
      )
      const querySnapshot = await getDocs(q)
      let hasConflict = false
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as CourseBooking
        const existingStart = data.startTime instanceof Timestamp ? data.startTime.toDate() : new Date(data.startTime)
        const existingEnd = data.endTime instanceof Timestamp ? data.endTime.toDate() : new Date(data.endTime)
        const newStart = startTime instanceof Timestamp ? startTime.toDate() : new Date(startTime)
        const newEnd = endTime instanceof Timestamp ? endTime.toDate() : new Date(endTime)
        
        // Check for overlap
        if (newStart < existingEnd && newEnd > existingStart) {
          hasConflict = true
        }
      })
      
      return { success: true, hasConflict }
    } catch (error) {
      console.error('Error checking conflicts:', error)
      return { success: false, error: 'Failed to check conflicts' }
    }
  },

  // Check course capacity
  async checkCapacity(courseId: string, startTime: Timestamp | Date) {
    try {
      // Get course details
      const courseResult = await coursesService.getById(courseId)
      if (!courseResult.success) {
        return { success: false, error: courseResult.error || 'Failed to get course' }
      }
      
      const course = courseResult.data!
      const sessionStart = startTime instanceof Timestamp ? startTime.toDate() : new Date(startTime)
      
      // Count existing bookings for this time slot
      const q = query(
        collection(db, 'course_bookings'),
        where('courseId', '==', courseId),
        where('status', '==', 'confirmed')
      )
      const querySnapshot = await getDocs(q)
      let bookingCount = 0
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as CourseBooking
        const existingStart = data.startTime instanceof Timestamp ? data.startTime.toDate() : new Date(data.startTime)
        
        // Check if it's the same time slot (within 30 minutes)
        const timeDiff = Math.abs(existingStart.getTime() - sessionStart.getTime())
        if (timeDiff < 30 * 60 * 1000) { // 30 minutes in milliseconds
          bookingCount++
        }
      })
      
      const isFull = bookingCount >= course.maxParticipants
      return { success: true, isFull, currentBookings: bookingCount, maxCapacity: course.maxParticipants }
    } catch (error) {
      console.error('Error checking capacity:', error)
      return { success: false, error: 'Failed to check capacity' }
    }
  },

  // Get user's bookings
  async getUserBookings(userId: string) {
    try {
      const q = query(
        collection(db, 'course_bookings'),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const bookings: CourseBooking[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as CourseBooking
        bookings.push({
          id: doc.id,
          ...data
        } as CourseBooking)
      })
      
      // Sort bookings by startTime in JavaScript instead of Firestore
      bookings.sort((a, b) => {
        const timeA = a.startTime instanceof Timestamp ? a.startTime.toDate() : new Date(a.startTime)
        const timeB = b.startTime instanceof Timestamp ? b.startTime.toDate() : new Date(b.startTime)
        return timeB.getTime() - timeA.getTime() // desc order
      })
      
      return { success: true, data: bookings }
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return { success: false, error: 'Failed to fetch bookings' }
    }
  },

  // Get all bookings for calendar display
  async getAllBookings() {
    try {
      const q = query(
        collection(db, 'course_bookings'),
        where('status', '==', 'confirmed')
      )
      const querySnapshot = await getDocs(q)
      const bookings: CourseBooking[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as CourseBooking
        bookings.push({
          id: doc.id,
          ...data
        } as CourseBooking)
      })
      
      return { success: true, data: bookings }
    } catch (error) {
      console.error('Error fetching all bookings:', error)
      return { success: false, error: 'Failed to fetch bookings' }
    }
  },

  // Cancel booking
  async cancel(bookingId: string) {
    try {
      await updateDoc(doc(db, 'course_bookings', bookingId), {
        status: 'cancelled',
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      return { success: false, error: 'Failed to cancel booking' }
    }
  }
}

// Course schedules service
export const courseSchedulesService = {
  // Get schedules for a course
  async getByCourseId(courseId: string) {
    try {
      const querySnapshot = await getDocs(collection(db, 'course_schedules'))
      const schedules: CourseSchedule[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as CourseSchedule
        if (data.courseId === courseId && data.isActive) {
          schedules.push({
            id: doc.id,
            ...data
          } as CourseSchedule)
        }
      })
      
      schedules.sort((a, b) => a.dayOfWeek - b.dayOfWeek)
      return { success: true, data: schedules }
    } catch (error) {
      console.error('Error fetching course schedules:', error)
      return { success: false, error: 'Failed to fetch schedules' }
    }
  },

  // Create schedule
  async create(scheduleData: Omit<CourseSchedule, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'course_schedules'), {
        ...scheduleData,
        createdAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating schedule:', error)
      return { success: false, error: 'Failed to create schedule' }
    }
  },

  // Update schedule
  async update(scheduleId: string, scheduleData: Partial<CourseSchedule>) {
    try {
      await updateDoc(doc(db, 'course_schedules', scheduleId), scheduleData)
      return { success: true }
    } catch (error) {
      console.error('Error updating schedule:', error)
      return { success: false, error: 'Failed to update schedule' }
    }
  },

  // Delete schedule
  async delete(scheduleId: string) {
    try {
      await updateDoc(doc(db, 'course_schedules', scheduleId), {
        isActive: false
      })
      return { success: true }
    } catch (error) {
      console.error('Error deleting schedule:', error)
      return { success: false, error: 'Failed to delete schedule' }
    }
  }
}

// Course exceptions service (for cancelled sessions)
export const courseExceptionsService = {
  // Get exceptions for a course
  async getByCourseId(courseId: string) {
    try {
      const querySnapshot = await getDocs(collection(db, 'course_exceptions'))
      const exceptions: CourseException[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as CourseException
        if (data.courseId === courseId) {
          exceptions.push({
            id: doc.id,
            ...data
          } as CourseException)
        }
      })
      
      return { success: true, data: exceptions }
    } catch (error) {
      console.error('Error fetching course exceptions:', error)
      return { success: false, error: 'Failed to fetch exceptions' }
    }
  },

  // Create exception (admin only)
  async create(exceptionData: Omit<CourseException, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'course_exceptions'), {
        ...exceptionData,
        createdAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating exception:', error)
      return { success: false, error: 'Failed to create exception' }
    }
  },

  // Delete exception (admin only)
  async delete(exceptionId: string) {
    try {
      await deleteDoc(doc(db, 'course_exceptions', exceptionId))
      return { success: true }
    } catch (error) {
      console.error('Error deleting exception:', error)
      return { success: false, error: 'Failed to delete exception' }
    }
  }
}

// One-time course sessions service
export const oneTimeSessionsService = {
  // Get sessions for a course
  async getByCourseId(courseId: string) {
    try {
      const querySnapshot = await getDocs(collection(db, 'one_time_sessions'))
      const sessions: OneTimeCourseSession[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as OneTimeCourseSession
        if (data.courseId === courseId && data.isActive) {
          sessions.push({
            id: doc.id,
            ...data
          } as OneTimeCourseSession)
        }
      })
      
      // Sort by session date
      sessions.sort((a, b) => {
        const dateA = a.sessionDate instanceof Timestamp ? a.sessionDate.toDate() : new Date(a.sessionDate)
        const dateB = b.sessionDate instanceof Timestamp ? b.sessionDate.toDate() : new Date(b.sessionDate)
        return dateA.getTime() - dateB.getTime()
      })
      
      return { success: true, data: sessions }
    } catch (error) {
      console.error('Error fetching one-time sessions:', error)
      return { success: false, error: 'Failed to fetch sessions' }
    }
  },

  // Create session (admin only)
  async create(sessionData: Omit<OneTimeCourseSession, 'id' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'one_time_sessions'), {
        ...sessionData,
        createdAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating session:', error)
      return { success: false, error: 'Failed to create session' }
    }
  },

  // Update session (admin only)
  async update(sessionId: string, sessionData: Partial<OneTimeCourseSession>) {
    try {
      await updateDoc(doc(db, 'one_time_sessions', sessionId), sessionData)
      return { success: true }
    } catch (error) {
      console.error('Error updating session:', error)
      return { success: false, error: 'Failed to update session' }
    }
  },

  // Delete session (admin only)
  async delete(sessionId: string) {
    try {
      await updateDoc(doc(db, 'one_time_sessions', sessionId), {
        isActive: false
      })
      return { success: true }
    } catch (error) {
      console.error('Error deleting session:', error)
      return { success: false, error: 'Failed to delete session' }
    }
  }
}