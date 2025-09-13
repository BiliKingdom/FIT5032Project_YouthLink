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

  // Convert Firebase user to our User interface
  const createUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
    try {
      // Add timeout for Firestore operations
      const getUserDoc = async () => {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        return userDoc
      }
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Firestore timeout')), 10000) // 10 second timeout
      )
      
      const userDoc = await Promise.race([getUserDoc(), timeoutPromise]) as any
      
      if (userDoc.exists()) {
        const userData = userDoc.data()
        return {
          id: firebaseUser.uid,
          displayName: firebaseUser.displayName || userData.displayName || 'User',
          email: firebaseUser.email || '',
          role: userData.role || 'user',
          createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          photoURL: firebaseUser.photoURL || userData.photoURL
        }
      } else {
        // Create new user document if it doesn't exist
        const newUser: User = {
          id: firebaseUser.uid,
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: 'user',
          createdAt: new Date().toISOString()
        }
        
        try {
          // Add timeout for user creation
          const createUserDoc = async () => {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              displayName: newUser.displayName,
              email: newUser.email,
              role: newUser.role,
              createdAt: serverTimestamp()
            })
          }
          
          await Promise.race([createUserDoc(), timeoutPromise])
        } catch (createError) {
          console.warn('Failed to create user document in Firestore:', createError)
          // Continue with local user data even if Firestore write fails
        }
        
        return newUser
      }
    } catch (error: any) {
      if (error.message === 'Firestore timeout') {
        console.warn('Firestore operation timed out, using fallback user data')
      } else {
        console.warn('Failed to fetch user document from Firestore:', error)
      }
      
      // Return a basic user profile based on Firebase Auth data when offline
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
      // Set a timeout for the login operation
      const loginPromise = signInWithEmailAndPassword(auth, email, password)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout')), 30000) // 30 second timeout
      )
      
      const userCredential = await Promise.race([loginPromise, timeoutPromise]) as any
      const userProfile = await createUserProfile(userCredential.user)
      user.value = userProfile
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      let errorMessage = 'Login failed. Please try again.'
      
      // Handle timeout errors
      if (error.message === 'Login timeout') {
        errorMessage = 'Login is taking too long. Please check your internet connection and try again.'
        return { success: false, error: errorMessage }
      }
      
      // Handle offline errors
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

  const register = async (email: string, password: string, displayName: string) => {
    loading.value = true
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      })
      
      // Create user profile immediately for faster UI response
      const userProfile: User = {
        id: userCredential.user.uid,
        displayName: displayName,
        email: email,
        role: 'user',
        createdAt: new Date().toISOString()
      }
      user.value = userProfile
      
      // Create user document in Firestore asynchronously (don't wait)
      setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: displayName,
        email: email,
        role: 'user',
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
      
      // Clean up subscription on store disposal
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