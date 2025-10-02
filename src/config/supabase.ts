import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          title: string
          description: string
          instructor: string
          duration: number
          max_participants: number
          category: string
          price: number
          is_active: boolean
          course_type: 'one-time' | 'weekly' | 'monthly'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }
      course_schedules: {
        Row: {
          id: string
          course_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['course_schedules']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['course_schedules']['Insert']>
      }
      course_bookings: {
        Row: {
          id: string
          course_id: string
          course_name: string
          user_id: string
          user_name: string
          user_email: string
          start_time: string
          end_time: string
          status: 'confirmed' | 'cancelled' | 'completed'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['course_bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['course_bookings']['Insert']>
      }
      course_exceptions: {
        Row: {
          id: string
          course_id: string
          exception_date: string
          reason: string | null
          created_at: string
          created_by: string
        }
        Insert: Omit<Database['public']['Tables']['course_exceptions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['course_exceptions']['Insert']>
      }
      one_time_sessions: {
        Row: {
          id: string
          course_id: string
          session_date: string
          start_time: string
          end_time: string
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['one_time_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['one_time_sessions']['Insert']>
      }
    }
  }
}
