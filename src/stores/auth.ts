import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import type { User as FirebaseUser } from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { supabase } from '@/config/supabase'

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

  const createUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      // First, try to get user role from Supabase auth.users table
      let userRole: 'user' | 'admin' = 'user'
      let displayName = firebaseUser.displayName || 'User'

      // SIMPLE ADMIN CHECK - Check if user email is in admin list
      try {
        console.log('Checking user role for:', firebaseUser.email)

        // ADMIN USERS LIST - Add emails that should have admin access
        const adminEmails = ['1383@qq.com']

        if (firebaseUser.email && adminEmails.includes(firebaseUser.email.toLowerCase())) {
          userRole = 'admin'
          console.log('✅ Admin role granted for:', firebaseUser.email)
        } else {
          console.log('Regular user role for:', firebaseUser.email)
        }
      } catch (err) {
        console.warn('Failed to check admin status:', err)
      }

      // Fallback to Firebase Firestore
      try {
        const getUserDoc = async () => {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          return userDoc
        }

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Firestore timeout')), 5000)
        )

        const userDoc = await Promise.race([getUserDoc(), timeoutPromise]) as any

        if (userDoc.exists()) {
          const userData = userDoc.data()
          // Firebase data overrides Supabase if it exists
          return {
            id: firebaseUser.uid,
            displayName: firebaseUser.displayName || userData.displayName || displayName,
            email: firebaseUser.email || '',
            role: userData.role || userRole,
            createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            photoURL: firebaseUser.photoURL || userData.photoURL
          }
        }
      } catch (firestoreError: any) {
        console.warn('Firestore error:', firestoreError)
      }

      // Return user with role from Supabase or default
      return {
        id: firebaseUser.uid,
        displayName: displayName,
        email: firebaseUser.email || '',
        role: userRole,
        createdAt: new Date().toISOString()
      }
    } catch (error: any) {
      console.error('Error creating user profile:', error)

      return {
        id: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        role: 'user',
        createdAt: new Date().toISOString()
      }
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const loginPromise = signInWithEmailAndPassword(auth, email, password)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout')), 30000)
      )
      
      const userCredential = await Promise.race([loginPromise, timeoutPromise]) as any
      const userProfile = await createUserProfile(userCredential.user)
      user.value = userProfile
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      let errorMessage = 'Login failed. Please try again.'
      
      if (error.message === 'Login timeout') {
        errorMessage = 'Login is taking too long. Please check your internet connection and try again.'
        return { success: false, error: errorMessage }
      }
      
      if (error.message && error.message.includes('client is offline')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.'
        return { success: false, error: errorMessage }
      }
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.'
          break
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.'
          break
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please check your credentials.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.'
          break
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.'
          break
      }
      
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, displayName: string, isAdmin: boolean = false) => {
    loading.value = true
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await updateProfile(userCredential.user, {
        displayName: displayName
      })
      
      const userProfile: User = {
        id: userCredential.user.uid,
        displayName: displayName,
        email: email,
        role: isAdmin ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      }
      user.value = userProfile
      
      setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: displayName,
        email: email,
        role: isAdmin ? 'admin' : 'user',
        createdAt: serverTimestamp()
      }).catch(error => {
        console.warn('Failed to create user document in Firestore (non-blocking):', error)
      })
      
      return { success: true }
    } catch (error: any) {
      console.error('Registration error:', error)
      let errorMessage = 'Registration failed. Please try again.'
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.'
          break
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.'
          break
      }
      
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const initializeAuth = () => {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userProfile = await createUserProfile(firebaseUser)
            user.value = userProfile
          } catch (error) {
            console.error('Error creating user profile:', error)
            user.value = null
          }
        } else {
          user.value = null
        }
        
        if (!initialized.value) {
          initialized.value = true
          resolve()
        }
      })
      
      return unsubscribe
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
