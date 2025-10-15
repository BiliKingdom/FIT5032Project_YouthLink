import { userService } from '@/services/firestore'

export interface UserTableData {
  id: string
  displayName: string
  email: string
  role: 'user' | 'admin'
  createdAt: Date
  status: 'active' | 'inactive'
}

export const usersTableService = {
  async getAllUsers(): Promise<{ success: boolean; data?: UserTableData[]; error?: string }> {
    try {
      const result = await userService.getAll()

      if (result.success && result.data) {
        const users = result.data.map((user: any) => {
          let createdAtDate: Date

          try {
            if (user.createdAt?.toDate) {
              createdAtDate = user.createdAt.toDate()
            } else if (user.createdAt instanceof Date) {
              createdAtDate = user.createdAt
            } else if (typeof user.createdAt === 'string') {
              createdAtDate = new Date(user.createdAt)
            } else if (user.createdAt?.seconds) {
              createdAtDate = new Date(user.createdAt.seconds * 1000)
            } else {
              createdAtDate = new Date()
            }
          } catch (error) {
            console.warn('Error parsing createdAt for user:', user.id, error)
            createdAtDate = new Date()
          }

          return {
            id: user.id,
            displayName: user.displayName || 'Unknown',
            email: user.email || '',
            role: user.role || 'user',
            createdAt: createdAtDate,
            status: user.status || 'active' as const
          }
        })

        return { success: true, data: users }
      }

      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error fetching users for table:', error)
      return { success: false, error: 'Failed to fetch users' }
    }
  },

  async updateUserRole(userId: string, newRole: 'user' | 'admin'): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await userService.updateProfile(userId, { role: newRole })
      return result
    } catch (error) {
      console.error('Error updating user role:', error)
      return { success: false, error: 'Failed to update user role' }
    }
  },

  async updateUserStatus(userId: string, status: 'active' | 'inactive'): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await userService.updateProfile(userId, { status })
      return result
    } catch (error) {
      console.error('Error updating user status:', error)
      return { success: false, error: 'Failed to update user status' }
    }
  }
}
