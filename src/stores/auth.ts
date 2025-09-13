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
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
    
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
      
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        displayName: newUser.displayName,
        email: newUser.email,
        role: newUser.role,
        createdAt: serverTimestamp()
      })
      
      return newUser
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const userProfile = await createUserProfile(userCredential.user)
      user.value = userProfile
      return { success: true }
    } catch (error: any) {
      console.error('Login error:', error)
      let errorMessage = 'Login failed. Please try again.'
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.'
          break
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.'
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
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName: displayName,
        email: email,
        role: 'user',
        createdAt: serverTimestamp()
      })
      
      const userProfile = await createUserProfile(userCredential.user)
      user.value = userProfile
      
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