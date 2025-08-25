import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  displayName: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Mock authentication - will be replaced with Firebase Auth
  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data - admin user for testing
      const mockUser: User = {
        id: '1',
        displayName: email === 'admin@mindwellnfp.org' ? 'Admin User' : 'Regular User',
        email,
        role: email === 'admin@mindwellnfp.org' ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      }
      
      user.value = mockUser
      localStorage.setItem('user', JSON.stringify(mockUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Invalid credentials' }
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newUser: User = {
        id: Date.now().toString(),
        displayName,
        email,
        role: 'user',
        createdAt: new Date().toISOString()
      }
      
      user.value = newUser
      localStorage.setItem('user', JSON.stringify(newUser))
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    loading,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    initializeAuth
  }
})