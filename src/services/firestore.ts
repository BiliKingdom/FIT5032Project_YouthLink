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
      const querySnapshot = await getDocs(collection(db, 'resource_comments'))
      const comments: ResourceComment[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ResourceComment
        // Filter by resourceId and exclude reported comments
        if (data.resourceId === resourceId && !data.reported) {
          comments.push({
            id: doc.id,
            ...data
          } as ResourceComment)
        }
      })
      
      // Sort by createdAt descending on client side
      comments.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })
      
      return { success: true, data: comments }
    } catch (error) {
      console.error('Error fetching resource comments:', error)
      return { success: false, error: 'Failed to fetch comments' }
    }
  },

  // Get user's comment for a specific resource
  async getUserComment(resourceId: string, userId: string) {
    try {
      const querySnapshot = await getDocs(collection(db, 'resource_comments'))
      let userComment: ResourceComment | null = null
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ResourceComment
        if (data.resourceId === resourceId && data.userId === userId && !data.reported) {
          userComment = {
            id: doc.id,
            ...data
          } as ResourceComment
        }
      })
      
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