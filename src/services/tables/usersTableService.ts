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
        const users = result.data.map((user: any) => ({
          id: user.id,
          displayName: user.displayName || 'Unknown',
          email: user.email || '',
          role: user.role || 'user',
          createdAt: user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt),
          status: 'active' as const
        }))

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
