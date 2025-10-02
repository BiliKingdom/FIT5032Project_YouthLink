import { supabase } from '@/config/supabase'
import type { Database } from '@/config/supabase'

type Course = Database['public']['Tables']['courses']['Row']
type CourseInsert = Database['public']['Tables']['courses']['Insert']
type CourseUpdate = Database['public']['Tables']['courses']['Update']

type CourseSchedule = Database['public']['Tables']['course_schedules']['Row']
type CourseScheduleInsert = Database['public']['Tables']['course_schedules']['Insert']

type CourseBooking = Database['public']['Tables']['course_bookings']['Row']
type CourseBookingInsert = Database['public']['Tables']['course_bookings']['Insert']

type CourseException = Database['public']['Tables']['course_exceptions']['Row']
type CourseExceptionInsert = Database['public']['Tables']['course_exceptions']['Insert']

type OneTimeSession = Database['public']['Tables']['one_time_sessions']['Row']
type OneTimeSessionInsert = Database['public']['Tables']['one_time_sessions']['Insert']

export type {
  Course,
  CourseSchedule,
  CourseBooking,
  CourseBookingInsert,
  CourseException,
  OneTimeSession
}

export const coursesService = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('title')

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching courses:', error)
      return { success: false, error: 'Failed to fetch courses', data: [] }
    }
  },

  async getById(courseId: string) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle()

      if (error) throw error
      if (!data) return { success: false, error: 'Course not found', data: null }
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching course:', error)
      return { success: false, error: 'Failed to fetch course', data: null }
    }
  },

  async create(courseData: CourseInsert) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single()

      if (error) throw error
      return { success: true, id: data.id, data }
    } catch (error) {
      console.error('Error creating course:', error)
      return { success: false, error: 'Failed to create course' }
    }
  },

  async update(courseId: string, courseData: CourseUpdate) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', courseId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error updating course:', error)
      return { success: false, error: 'Failed to update course' }
    }
  },

  async delete(courseId: string) {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_active: false })
        .eq('id', courseId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting course:', error)
      return { success: false, error: 'Failed to delete course' }
    }
  }
}

export const courseSchedulesService = {
  async getByCourseId(courseId: string) {
    try {
      const { data, error } = await supabase
        .from('course_schedules')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('day_of_week')

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching schedules:', error)
      return { success: false, error: 'Failed to fetch schedules', data: [] }
    }
  },

  async create(scheduleData: CourseScheduleInsert) {
    try {
      const { data, error } = await supabase
        .from('course_schedules')
        .insert(scheduleData)
        .select()
        .single()

      if (error) throw error
      return { success: true, id: data.id, data }
    } catch (error) {
      console.error('Error creating schedule:', error)
      return { success: false, error: 'Failed to create schedule' }
    }
  },

  async update(scheduleId: string, scheduleData: Partial<CourseScheduleInsert>) {
    try {
      const { data, error } = await supabase
        .from('course_schedules')
        .update(scheduleData)
        .eq('id', scheduleId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error updating schedule:', error)
      return { success: false, error: 'Failed to update schedule' }
    }
  },

  async delete(scheduleId: string) {
    try {
      const { error } = await supabase
        .from('course_schedules')
        .update({ is_active: false })
        .eq('id', scheduleId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting schedule:', error)
      return { success: false, error: 'Failed to delete schedule' }
    }
  }
}

export const courseBookingsService = {
  async create(bookingData: CourseBookingInsert) {
    try {
      const conflictCheck = await this.checkConflicts(
        bookingData.user_id,
        bookingData.start_time,
        bookingData.end_time
      )

      if (!conflictCheck.success) {
        return conflictCheck
      }

      if (conflictCheck.hasConflict) {
        return {
          success: false,
          error: 'You already have a booking at this time. Please choose a different time slot.'
        }
      }

      const capacityCheck = await this.checkCapacity(
        bookingData.course_id,
        bookingData.start_time
      )

      if (!capacityCheck.success) {
        return capacityCheck
      }

      if (capacityCheck.isFull) {
        return {
          success: false,
          error: 'This time slot is fully booked. Please choose another time.'
        }
      }

      const { data, error } = await supabase
        .from('course_bookings')
        .insert({ ...bookingData, status: 'confirmed' })
        .select()
        .single()

      if (error) throw error
      return { success: true, id: data.id, data }
    } catch (error) {
      console.error('Error creating booking:', error)
      return { success: false, error: 'Failed to create booking' }
    }
  },

  async checkConflicts(userId: string, startTime: string, endTime: string) {
    try {
      const { data, error } = await supabase
        .from('course_bookings')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'confirmed')
        .or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`)

      if (error) throw error
      return { success: true, hasConflict: (data?.length || 0) > 0 }
    } catch (error) {
      console.error('Error checking conflicts:', error)
      return { success: false, error: 'Failed to check conflicts' }
    }
  },

  async checkCapacity(courseId: string, startTime: string) {
    try {
      const courseResult = await coursesService.getById(courseId)
      if (!courseResult.success || !courseResult.data) {
        return courseResult
      }

      const course = courseResult.data
      const sessionStart = new Date(startTime)
      const sessionStartMs = sessionStart.getTime()
      const windowStart = new Date(sessionStartMs - 30 * 60 * 1000).toISOString()
      const windowEnd = new Date(sessionStartMs + 30 * 60 * 1000).toISOString()

      const { data, error } = await supabase
        .from('course_bookings')
        .select('*')
        .eq('course_id', courseId)
        .eq('status', 'confirmed')
        .gte('start_time', windowStart)
        .lte('start_time', windowEnd)

      if (error) throw error

      const bookingCount = data?.length || 0
      const isFull = bookingCount >= course.max_participants

      return {
        success: true,
        isFull,
        currentBookings: bookingCount,
        maxCapacity: course.max_participants
      }
    } catch (error) {
      console.error('Error checking capacity:', error)
      return { success: false, error: 'Failed to check capacity' }
    }
  },

  async getUserBookings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('course_bookings')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return { success: false, error: 'Failed to fetch bookings', data: [] }
    }
  },

  async getAllBookings() {
    try {
      const { data, error } = await supabase
        .from('course_bookings')
        .select('*')
        .eq('status', 'confirmed')

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching all bookings:', error)
      return { success: false, error: 'Failed to fetch bookings', data: [] }
    }
  },

  async cancel(bookingId: string) {
    try {
      const { error } = await supabase
        .from('course_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      return { success: false, error: 'Failed to cancel booking' }
    }
  }
}

export const courseExceptionsService = {
  async getByCourseId(courseId: string) {
    try {
      const { data, error } = await supabase
        .from('course_exceptions')
        .select('*')
        .eq('course_id', courseId)
        .order('exception_date')

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching exceptions:', error)
      return { success: false, error: 'Failed to fetch exceptions', data: [] }
    }
  },

  async create(exceptionData: CourseExceptionInsert) {
    try {
      const { data, error } = await supabase
        .from('course_exceptions')
        .insert(exceptionData)
        .select()
        .single()

      if (error) throw error
      return { success: true, id: data.id, data }
    } catch (error) {
      console.error('Error creating exception:', error)
      return { success: false, error: 'Failed to create exception' }
    }
  },

  async delete(exceptionId: string) {
    try {
      const { error } = await supabase
        .from('course_exceptions')
        .delete()
        .eq('id', exceptionId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting exception:', error)
      return { success: false, error: 'Failed to delete exception' }
    }
  }
}

export const oneTimeSessionsService = {
  async getByCourseId(courseId: string) {
    try {
      const { data, error } = await supabase
        .from('one_time_sessions')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('session_date')

      if (error) throw error
      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Error fetching sessions:', error)
      return { success: false, error: 'Failed to fetch sessions', data: [] }
    }
  },

  async create(sessionData: OneTimeSessionInsert) {
    try {
      const { data, error } = await supabase
        .from('one_time_sessions')
        .insert(sessionData)
        .select()
        .single()

      if (error) throw error
      return { success: true, id: data.id, data }
    } catch (error) {
      console.error('Error creating session:', error)
      return { success: false, error: 'Failed to create session' }
    }
  },

  async update(sessionId: string, sessionData: Partial<OneTimeSessionInsert>) {
    try {
      const { data, error } = await supabase
        .from('one_time_sessions')
        .update(sessionData)
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error updating session:', error)
      return { success: false, error: 'Failed to update session' }
    }
  },

  async delete(sessionId: string) {
    try {
      const { error } = await supabase
        .from('one_time_sessions')
        .update({ is_active: false })
        .eq('id', sessionId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting session:', error)
      return { success: false, error: 'Failed to delete session' }
    }
  }
}
