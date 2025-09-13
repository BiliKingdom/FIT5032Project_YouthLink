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
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/config/firebase'

// Appointment interface
export interface Appointment {
  id?: string
  userId: string
  serviceType: string
  preferredDate: string
  preferredTime: string
  urgency: string
  reason: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

// Contact submission interface
export interface ContactSubmission {
  id?: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'new' | 'in-progress' | 'resolved'
  createdAt: Timestamp | Date
}

// Appointments service
export const appointmentsService = {
  // Create new appointment
  async create(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating appointment:', error)
      return { success: false, error: 'Failed to create appointment' }
    }
  },

  // Get appointments for a user
  async getUserAppointments(userId: string) {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const appointments: Appointment[] = []
      
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        } as Appointment)
      })
      
      return { success: true, data: appointments }
    } catch (error) {
      console.error('Error fetching user appointments:', error)
      return { success: false, error: 'Failed to fetch appointments' }
    }
  },

  // Update appointment status
  async updateStatus(appointmentId: string, status: Appointment['status']) {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating appointment:', error)
      return { success: false, error: 'Failed to update appointment' }
    }
  },

  // Get all appointments (admin only)
  async getAll() {
    try {
      const q = query(
        collection(db, 'appointments'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const appointments: Appointment[] = []
      
      querySnapshot.forEach((doc) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        } as Appointment)
      })
      
      return { success: true, data: appointments }
    } catch (error) {
      console.error('Error fetching all appointments:', error)
      return { success: false, error: 'Failed to fetch appointments' }
    }
  }
}

// Contact submissions service
export const contactService = {
  // Create new contact submission
  async create(contactData: Omit<ContactSubmission, 'id' | 'status' | 'createdAt'>) {
    try {
      const docRef = await addDoc(collection(db, 'contact_submissions'), {
        ...contactData,
        status: 'new',
        createdAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating contact submission:', error)
      return { success: false, error: 'Failed to submit contact form' }
    }
  },

  // Get all contact submissions (admin only)
  async getAll() {
    try {
      const q = query(
        collection(db, 'contact_submissions'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const submissions: ContactSubmission[] = []
      
      querySnapshot.forEach((doc) => {
        submissions.push({
          id: doc.id,
          ...doc.data()
        } as ContactSubmission)
      })
      
      return { success: true, data: submissions }
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
      return { success: false, error: 'Failed to fetch submissions' }
    }
  },

  // Update submission status
  async updateStatus(submissionId: string, status: ContactSubmission['status']) {
    try {
      await updateDoc(doc(db, 'contact_submissions', submissionId), {
        status
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating submission status:', error)
      return { success: false, error: 'Failed to update status' }
    }
  }
}

// User service
export const userService = {
  // Get user profile
  async getProfile(userId: string) {
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } }
      } else {
        return { success: false, error: 'User not found' }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return { success: false, error: 'Failed to fetch profile' }
    }
  },

  // Update user profile
  async updateProfile(userId: string, profileData: any) {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...profileData,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating user profile:', error)
      return { success: false, error: 'Failed to update profile' }
    }
  },

  // Get all users (admin only)
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      const users: any[] = []
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      return { success: true, data: users }
    } catch (error) {
      console.error('Error fetching users:', error)
      return { success: false, error: 'Failed to fetch users' }
    }
  }
}