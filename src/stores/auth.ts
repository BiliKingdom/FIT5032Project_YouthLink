import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/config/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface User {
  id: string
  displayName: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  photoURL?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const initialized = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const createUserProfile = (supabaseUser: SupabaseUser, role?: 'user' | 'admin'): User => {
    const metadata = supabaseUser.user_metadata || {}
    return {
      id: supabaseUser.id,
      displayName: metadata.displayName || metadata.display_name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      role: role || (metadata.role as 'user' | 'admin') || 'user',
      createdAt: supabaseUser.created_at || new Date().toISOString(),
      photoURL: metadata.photoURL || metadata.avatar_url
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        user.value = createUserProfile(data.user)
        return { success: true }
      }

      return { success: false, error: 'Login failed' }
    } catch (error: any) {
      console.error('Login error:', error)
      let errorMessage = 'Login failed. Please try again.'

      if (error.message) {
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password.'
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email address.'
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection.'
        }
      }

      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, displayName: string, isAdmin: boolean = false) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: displayName,
            display_name: displayName,
            role: isAdmin ? 'admin' : 'user'
          }
        }
      })

      if (error) throw error

      if (data.user) {
        user.value = createUserProfile(data.user, isAdmin ? 'admin' : 'user')
        return { success: true }
      }

      return { success: false, error: 'Registration failed' }
    } catch (error: any) {
      console.error('Registration error:', error)
      let errorMessage = 'Registration failed. Please try again.'

      if (error.message) {
        if (error.message.includes('already registered')) {
          errorMessage = 'An account with this email already exists.'
        } else if (error.message.includes('Password')) {
          errorMessage = 'Password should be at least 6 characters.'
        }
      }

      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      user.value = null

      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const initializeAuth = () => {
    return new Promise<void>(async (resolve) => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        user.value = createUserProfile(session.user)
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          user.value = createUserProfile(session.user)
        } else {
          user.value = null
        }

        if (!initialized.value) {
          initialized.value = true
          resolve()
        }
      })

      if (!session) {
        initialized.value = true
        resolve()
      }
    })
  }

  return {
    user,
    loading,
    initialized,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    initializeAuth
  }
})