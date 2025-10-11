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
import type { ServiceLocation } from './locationService'

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

// Resource comment interface
export interface ResourceComment {
  id?: string
  resourceId: string
  userId: string
  userName: string
  userEmail: string
  overallRating: number
  aspectRatings: {
    helpfulness: number
    clarity: number
    relevance: number
    accuracy: number
  }
  comment: string
  helpful: number
  reported: boolean
  createdAt: Timestamp | Date
  updatedAt: Timestamp | Date
}

// Resource interface
export interface Resource {
  id?: string
  title: string
  description: string
  category: string
  type: string
  content: string
  author: string
  publishedDate: Timestamp | Date
  tags: string[]
  isPublished: boolean
  viewCount: number
  overallRating: number
  aspectRatings: {
    helpfulness: number
    clarity: number
    relevance: number
    accuracy: number
  }
  totalRatings: number
  commentCount: number
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
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      )

      const q = query(
        collection(db, 'appointments'),
        orderBy('createdAt', 'desc')
      )
      const fetchPromise = getDocs(q)

      const querySnapshot = await Promise.race([fetchPromise, timeoutPromise]) as any
      const appointments: Appointment[] = []

      querySnapshot.forEach((doc: any) => {
        appointments.push({
          id: doc.id,
          ...doc.data()
        } as Appointment)
      })

      return { success: true, data: appointments }
    } catch (error: any) {
      console.error('Error fetching all appointments:', error)
      if (error.message === 'Request timeout') {
        return { success: false, error: 'Request timed out. Please check your internet connection and try again.' }
      }
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

// Resource comments service
export const resourceCommentsService = {
  // Create new comment
  async create(commentData: Omit<ResourceComment, 'id' | 'createdAt' | 'updatedAt' | 'helpful' | 'reported'>) {
    try {
      const docRef = await addDoc(collection(db, 'resource_comments'), {
        ...commentData,
        helpful: 0,
        reported: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      // Update resource comment count and rating
      await this.updateResourceStats(commentData.resourceId)
      
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating comment:', error)
      return { success: false, error: 'Failed to create comment' }
    }
  },

  // Get comments for a resource
  async getResourceComments(resourceId: string) {
    try {
      console.log('=== Fetching comments for resource:', resourceId)

      // Simplified query without multiple where clauses to avoid index requirements
      const q = query(
        collection(db, 'resource_comments'),
        where('resourceId', '==', resourceId)
      )
      const querySnapshot = await getDocs(q)
      const comments: ResourceComment[] = []

      console.log('Raw query results:', querySnapshot.size, 'documents')

      querySnapshot.forEach((doc) => {
        const data = doc.data() as ResourceComment
        console.log('Comment doc:', doc.id, 'reported:', data.reported)
        // Filter out reported comments and sort client-side
        if (!data.reported) {
          comments.push({
            id: doc.id,
            ...data
          })
        }
      })

      // Sort by createdAt descending (newest first)
      comments.sort((a, b) => {
        const aTime = a.createdAt && typeof (a.createdAt as any).toDate === 'function'
          ? (a.createdAt as any).toDate().getTime()
          : 0
        const bTime = b.createdAt && typeof (b.createdAt as any).toDate === 'function'
          ? (b.createdAt as any).toDate().getTime()
          : 0
        return bTime - aTime
      })

      console.log('Final comments to display:', comments.length)
      return { success: true, data: comments }
    } catch (error) {
      console.error('Error fetching resource comments:', error)
      return { success: false, error: 'Failed to fetch comments' }
    }
  },

  // Get user's comment for a specific resource
  async getUserComment(resourceId: string, userId: string) {
    try {
      console.log('getUserComment called with resourceId:', resourceId, 'userId:', userId)

      const q = query(
        collection(db, 'resource_comments'),
        where('resourceId', '==', resourceId),
        where('userId', '==', userId),
        limit(1)
      )
      const querySnapshot = await getDocs(q)
      let userComment: ResourceComment | null = null

      querySnapshot.forEach((doc) => {
        const data = doc.data() as ResourceComment
        // Only return if not reported
        if (!data.reported) {
          userComment = {
            id: doc.id,
            ...data
          }
        }
      })

      console.log('getUserComment found:', userComment ? `Yes (id: ${(userComment as any).id})` : 'No')
      return { success: true, data: userComment }
    } catch (error) {
      console.error('Error fetching user comment:', error)
      return { success: false, error: 'Failed to fetch user comment' }
    }
  },

  // Update existing comment
  async update(commentId: string, commentData: Partial<ResourceComment>) {
    try {
      await updateDoc(doc(db, 'resource_comments', commentId), {
        ...commentData,
        updatedAt: serverTimestamp()
      })
      
      // Update resource stats if ratings changed
      if (commentData.resourceId) {
        await this.updateResourceStats(commentData.resourceId)
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error updating comment:', error)
      return { success: false, error: 'Failed to update comment' }
    }
  },

  // Update comment helpful count
  async markHelpful(commentId: string) {
    try {
      const commentRef = doc(db, 'resource_comments', commentId)
      const commentDoc = await getDoc(commentRef)
      
      if (commentDoc.exists()) {
        const currentHelpful = commentDoc.data().helpful || 0
        await updateDoc(commentRef, {
          helpful: currentHelpful + 1,
          updatedAt: serverTimestamp()
        })
        return { success: true }
      }
      
      return { success: false, error: 'Comment not found' }
    } catch (error) {
      console.error('Error marking comment helpful:', error)
      return { success: false, error: 'Failed to mark comment helpful' }
    }
  },

  // Report comment
  async reportComment(commentId: string) {
    try {
      await updateDoc(doc(db, 'resource_comments', commentId), {
        reported: true,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error reporting comment:', error)
      return { success: false, error: 'Failed to report comment' }
    }
  },

  // Update resource statistics
  async updateResourceStats(resourceId: string) {
    try {
      const q = query(
        collection(db, 'resource_comments'),
        where('resourceId', '==', resourceId),
        where('reported', '==', false)
      )
      const querySnapshot = await getDocs(q)
      
      let totalOverallRating = 0
      let totalHelpfulness = 0
      let totalClarity = 0
      let totalRelevance = 0
      let totalAccuracy = 0
      let commentCount = 0
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        totalOverallRating += data.overallRating
        totalHelpfulness += data.aspectRatings.helpfulness
        totalClarity += data.aspectRatings.clarity
        totalRelevance += data.aspectRatings.relevance
        totalAccuracy += data.aspectRatings.accuracy
        commentCount++
      })
      
      const averageOverallRating = commentCount > 0 ? totalOverallRating / commentCount : 0
      const averageHelpfulness = commentCount > 0 ? totalHelpfulness / commentCount : 0
      const averageClarity = commentCount > 0 ? totalClarity / commentCount : 0
      const averageRelevance = commentCount > 0 ? totalRelevance / commentCount : 0
      const averageAccuracy = commentCount > 0 ? totalAccuracy / commentCount : 0
      
      await updateDoc(doc(db, 'resources', resourceId), {
        overallRating: averageOverallRating,
        aspectRatings: {
          helpfulness: averageHelpfulness,
          clarity: averageClarity,
          relevance: averageRelevance,
          accuracy: averageAccuracy
        },
        totalRatings: commentCount,
        commentCount: commentCount,
        updatedAt: serverTimestamp()
      })
      
      return { success: true }
    } catch (error) {
      console.error('Error updating resource stats:', error)
      return { success: false, error: 'Failed to update resource stats' }
    }
  },

  // Get all comments (admin only)
  async getAll() {
    try {
      const q = query(
        collection(db, 'resource_comments'),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const comments: ResourceComment[] = []
      
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data()
        } as ResourceComment)
      })
      
      return { success: true, data: comments }
    } catch (error) {
      console.error('Error fetching all comments:', error)
      return { success: false, error: 'Failed to fetch comments' }
    }
  }
}

// Resources service
export const resourcesService = {
  // Get all resources
  async getAll() {
    try {
      const q = query(
        collection(db, 'resources'),
        orderBy('publishedDate', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const resources: Resource[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Resource
        // Filter published resources on the client side
        if (data.isPublished) {
          resources.push({
            id: doc.id,
            ...data
          } as Resource)
        }
      })
      
      return { success: true, data: resources }
    } catch (error) {
      console.error('Error fetching resources:', error)
      return { success: false, error: 'Failed to fetch resources' }
    }
  },

  // Get single resource
  async getById(resourceId: string) {
    try {
      const docRef = doc(db, 'resources', resourceId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        // Increment view count
        await updateDoc(docRef, {
          viewCount: (docSnap.data().viewCount || 0) + 1
        })
        
        return { 
          success: true, 
          data: { id: docSnap.id, ...docSnap.data() } as Resource 
        }
      } else {
        return { success: false, error: 'Resource not found' }
      }
    } catch (error) {
      console.error('Error fetching resource:', error)
      return { success: false, error: 'Failed to fetch resource' }
    }
  }
}

// Service locations service
export const serviceLocationsService = {
  // Create new service location
  async create(locationData: Omit<ServiceLocation, 'id' | 'distance'>) {
    try {
      const docRef = await addDoc(collection(db, 'service_locations'), {
        ...locationData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { success: true, id: docRef.id }
    } catch (error) {
      console.error('Error creating service location:', error)
      return { success: false, error: 'Failed to create service location' }
    }
  },

  // Get all service locations
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, 'service_locations'))
      const locations: ServiceLocation[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ServiceLocation
        // Filter active locations on client side
        if (data.isActive) {
          locations.push({
            ...data,
            id: doc.id
          } as ServiceLocation)
        }
      })
      
      // Sort by name on client side
      locations.sort((a, b) => a.name.localeCompare(b.name))
      
      return { success: true, data: locations }
    } catch (error) {
      console.error('Error fetching service locations:', error)
      return { success: false, error: 'Failed to fetch service locations' }
    }
  },

  // Get service locations by type
  async getByType(type: string) {
    try {
      const querySnapshot = await getDocs(collection(db, 'service_locations'))
      const locations: ServiceLocation[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ServiceLocation
        // Filter by type and active status on client side
        if (data.type === type && data.isActive) {
          locations.push({
            ...data,
            id: doc.id
          } as ServiceLocation)
        }
      })
      
      // Sort by name on client side
      locations.sort((a, b) => a.name.localeCompare(b.name))
      
      return { success: true, data: locations }
    } catch (error) {
      console.error('Error fetching service locations by type:', error)
      return { success: false, error: 'Failed to fetch service locations' }
    }
  },

  // Update service location
  async update(locationId: string, locationData: Partial<ServiceLocation>) {
    try {
      await updateDoc(doc(db, 'service_locations', locationId), {
        ...locationData,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating service location:', error)
      return { success: false, error: 'Failed to update service location' }
    }
  },

  // Delete service location (soft delete)
  async delete(locationId: string) {
    try {
      await updateDoc(doc(db, 'service_locations', locationId), {
        isActive: false,
        updatedAt: serverTimestamp()
      })
      return { success: true }
    } catch (error) {
      console.error('Error deleting service location:', error)
      return { success: false, error: 'Failed to delete service location' }
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
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      )

      const fetchPromise = getDocs(collection(db, 'users'))

      const querySnapshot = await Promise.race([fetchPromise, timeoutPromise]) as any
      const users: any[] = []

      querySnapshot.forEach((doc: any) => {
        users.push({
          id: doc.id,
          ...doc.data()
        })
      })

      return { success: true, data: users }
    } catch (error: any) {
      console.error('Error fetching users:', error)
      if (error.message === 'Request timeout') {
        return { success: false, error: 'Request timed out. Please check your internet connection and try again.' }
      }
      return { success: false, error: 'Failed to fetch users' }
    }
  }
}