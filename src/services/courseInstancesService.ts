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
  Timestamp,
  writeBatch
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import {
  coursesService,
  courseSchedulesService,
  courseExceptionsService,
  oneTimeSessionsService,
  type Course,
  type CourseSchedule,
  type CourseException,
  type OneTimeCourseSession
} from './coursesService'

export interface CourseInstance {
  id?: string
  courseId: string
  courseName: string
  courseDescription: string
  instructor: string
  duration: number
  maxParticipants: number
  currentBookings: number
  category: string
  startTime: Timestamp | Date
  endTime: Timestamp | Date
  status: 'active' | 'cancelled' | 'full' | 'completed'
  isActive: boolean
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

export const courseInstancesService = {
  async create(instanceData: Omit<CourseInstance, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'course_instances'), {
        ...instanceData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating course instance:', error)
      return { success: false, error: 'Failed to create course instance' }
    }
  },

  async getById(instanceId: string) {
    try {
      const docRef = doc(db, 'course_instances', instanceId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          success: true,
          data: { id: docSnap.id, ...docSnap.data() } as CourseInstance
        }
      } else {
        return { success: false, error: 'Course instance not found' }
      }
    } catch (error) {
      console.error('Error fetching course instance:', error)
      return { success: false, error: 'Failed to fetch course instance' }
    }
  },

  async getUpcomingInstances(daysAhead: number = 14) {
    try {
      const now = new Date()
      const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)

      const querySnapshot = await getDocs(collection(db, 'course_instances'))
      const instances: CourseInstance[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as CourseInstance
        const startTime = data.startTime instanceof Timestamp ? data.startTime.toDate() : new Date(data.startTime)

        if (data.isActive && startTime >= now && startTime <= futureDate) {
          instances.push({
            id: doc.id,
            ...data
          } as CourseInstance)
        }
      })

      instances.sort((a, b) => {
        const timeA = a.startTime instanceof Timestamp ? a.startTime.toDate() : new Date(a.startTime)
        const timeB = b.startTime instanceof Timestamp ? b.startTime.toDate() : new Date(b.startTime)
        return timeA.getTime() - timeB.getTime()
      })

      return { success: true, data: instances }
    } catch (error) {
      console.error('Error fetching upcoming instances:', error)
      return { success: false, error: 'Failed to fetch upcoming instances' }
    }
  },

  async getInstancesByCourse(courseId: string, daysAhead: number = 14) {
    try {
      const now = new Date()
      const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)

      const querySnapshot = await getDocs(collection(db, 'course_instances'))
      const instances: CourseInstance[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as CourseInstance
        const startTime = data.startTime instanceof Timestamp ? data.startTime.toDate() : new Date(data.startTime)

        if (data.courseId === courseId && data.isActive && startTime >= now && startTime <= futureDate) {
          instances.push({
            id: doc.id,
            ...data
          } as CourseInstance)
        }
      })

      instances.sort((a, b) => {
        const timeA = a.startTime instanceof Timestamp ? a.startTime.toDate() : new Date(a.startTime)
        const timeB = b.startTime instanceof Timestamp ? b.startTime.toDate() : new Date(b.startTime)
        return timeA.getTime() - timeB.getTime()
      })

      return { success: true, data: instances }
    } catch (error) {
      console.error('Error fetching course instances:', error)
      return { success: false, error: 'Failed to fetch course instances' }
    }
  },

  async update(instanceId: string, instanceData: Partial<CourseInstance>) {
    try {
      await updateDoc(doc(db, 'course_instances', instanceId), {
        ...instanceData,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating course instance:', error)
      return { success: false, error: 'Failed to update course instance' }
    }
  },

  async incrementBookingCount(instanceId: string) {
    try {
      const instanceResult = await this.getById(instanceId)
      if (!instanceResult.success || !instanceResult.data) {
        return { success: false, error: 'Instance not found' }
      }

      const instance = instanceResult.data
      const newCount = instance.currentBookings + 1
      const newStatus = newCount >= instance.maxParticipants ? 'full' : instance.status

      await updateDoc(doc(db, 'course_instances', instanceId), {
        currentBookings: newCount,
        status: newStatus,
        updatedAt: serverTimestamp()
      })

      return { success: true }
    } catch (error) {
      console.error('Error incrementing booking count:', error)
      return { success: false, error: 'Failed to update booking count' }
    }
  },

  async decrementBookingCount(instanceId: string) {
    try {
      const instanceResult = await this.getById(instanceId)
      if (!instanceResult.success || !instanceResult.data) {
        return { success: false, error: 'Instance not found' }
      }

      const instance = instanceResult.data
      const newCount = Math.max(0, instance.currentBookings - 1)
      const newStatus = newCount < instance.maxParticipants && instance.status === 'full'
        ? 'active'
        : instance.status

      await updateDoc(doc(db, 'course_instances', instanceId), {
        currentBookings: newCount,
        status: newStatus,
        updatedAt: serverTimestamp()
      })

      return { success: true }
    } catch (error) {
      console.error('Error decrementing booking count:', error)
      return { success: false, error: 'Failed to update booking count' }
    }
  },

  async deleteOldInstances(daysBefore: number = 7) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysBefore)

      const querySnapshot = await getDocs(collection(db, 'course_instances'))
      const batch = writeBatch(db)
      let deleteCount = 0

      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data() as CourseInstance
        const endTime = data.endTime instanceof Timestamp ? data.endTime.toDate() : new Date(data.endTime)

        if (endTime < cutoffDate) {
          batch.delete(docSnapshot.ref)
          deleteCount++
        }
      })

      if (deleteCount > 0) {
        await batch.commit()
      }

      return { success: true, deletedCount: deleteCount }
    } catch (error) {
      console.error('Error deleting old instances:', error)
      return { success: false, error: 'Failed to delete old instances' }
    }
  },

  async generateUpcomingInstances(daysAhead: number = 14) {
    try {
      console.log('Starting generation of upcoming course instances...')

      const coursesResult = await coursesService.getAll()
      if (!coursesResult.success) {
        return { success: false, error: 'Failed to fetch courses' }
      }

      const courses = coursesResult.data || []
      const now = new Date()
      const startDate = new Date(now)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000)
      endDate.setHours(23, 59, 59, 999)

      const existingInstancesSnapshot = await getDocs(collection(db, 'course_instances'))
      const existingInstances = new Set<string>()

      existingInstancesSnapshot.forEach((doc) => {
        const data = doc.data() as CourseInstance
        const startTime = data.startTime instanceof Timestamp ? data.startTime.toDate() : new Date(data.startTime)
        const key = `${data.courseId}-${startTime.getTime()}`
        existingInstances.add(key)
      })

      const batch = writeBatch(db)
      let instanceCount = 0

      for (const course of courses) {
        if (!course.id || !course.isActive) continue

        if (course.courseType === 'weekly') {
          const schedulesResult = await courseSchedulesService.getByCourseId(course.id)
          if (!schedulesResult.success) continue

          const schedules = schedulesResult.data || []
          const exceptionsResult = await courseExceptionsService.getByCourseId(course.id)
          const exceptions = exceptionsResult.success ? exceptionsResult.data || [] : []

          const exceptionDates = new Set(
            exceptions.map(e => e.exceptionDate)
          )

          for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            const dayOfWeek = date.getDay()
            const dateStr = date.toISOString().split('T')[0]

            if (exceptionDates.has(dateStr)) continue

            const daySchedules = schedules.filter(s => s.dayOfWeek === dayOfWeek && s.isActive)

            for (const schedule of daySchedules) {
              const [startHour, startMinute] = schedule.startTime.split(':').map(Number)
              const [endHour, endMinute] = schedule.endTime.split(':').map(Number)

              const instanceStart = new Date(date)
              instanceStart.setHours(startHour, startMinute, 0, 0)

              const instanceEnd = new Date(date)
              instanceEnd.setHours(endHour, endMinute, 0, 0)

              if (instanceStart < now) continue

              const key = `${course.id}-${instanceStart.getTime()}`
              if (existingInstances.has(key)) continue

              const instanceRef = doc(collection(db, 'course_instances'))
              batch.set(instanceRef, {
                courseId: course.id,
                courseName: course.title,
                courseDescription: course.description,
                instructor: course.instructor,
                duration: course.duration,
                maxParticipants: course.maxParticipants,
                currentBookings: 0,
                category: course.category,
                startTime: Timestamp.fromDate(instanceStart),
                endTime: Timestamp.fromDate(instanceEnd),
                status: 'active',
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
              })

              instanceCount++
            }
          }
        } else if (course.courseType === 'one-time') {
          const sessionsResult = await oneTimeSessionsService.getByCourseId(course.id)
          if (!sessionsResult.success) continue

          const sessions = sessionsResult.data || []

          for (const session of sessions) {
            if (!session.isActive) continue

            const sessionDate = session.sessionDate instanceof Timestamp
              ? session.sessionDate.toDate()
              : new Date(session.sessionDate)

            if (sessionDate < startDate || sessionDate > endDate) continue

            const [startHour, startMinute] = session.startTime.split(':').map(Number)
            const [endHour, endMinute] = session.endTime.split(':').map(Number)

            const instanceStart = new Date(sessionDate)
            instanceStart.setHours(startHour, startMinute, 0, 0)

            const instanceEnd = new Date(sessionDate)
            instanceEnd.setHours(endHour, endMinute, 0, 0)

            if (instanceStart < now) continue

            const key = `${course.id}-${instanceStart.getTime()}`
            if (existingInstances.has(key)) continue

            const instanceRef = doc(collection(db, 'course_instances'))
            batch.set(instanceRef, {
              courseId: course.id,
              courseName: course.title,
              courseDescription: course.description,
              instructor: course.instructor,
              duration: course.duration,
              maxParticipants: course.maxParticipants,
              currentBookings: 0,
              category: course.category,
              startTime: Timestamp.fromDate(instanceStart),
              endTime: Timestamp.fromDate(instanceEnd),
              status: 'active',
              isActive: true,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            })

            instanceCount++
          }
        }
      }

      if (instanceCount > 0) {
        await batch.commit()
      }

      console.log(`Successfully generated ${instanceCount} new course instances`)
      return { success: true, count: instanceCount }
    } catch (error) {
      console.error('Error generating upcoming instances:', error)
      return { success: false, error: 'Failed to generate upcoming instances' }
    }
  },

  async refreshInstances() {
    try {
      console.log('Refreshing course instances...')

      await this.deleteOldInstances(7)

      const result = await this.generateUpcomingInstances(14)

      return result
    } catch (error) {
      console.error('Error refreshing instances:', error)
      return { success: false, error: 'Failed to refresh instances' }
    }
  }
}
