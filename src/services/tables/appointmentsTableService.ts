import { appointmentsService, type Appointment } from '@/services/firestore'

export interface AppointmentTableData {
  id: string
  userId: string
  userName?: string
  serviceType: string
  preferredDate: string
  preferredTime: string
  urgency: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  createdAt: Date
  reason: string
}

export const appointmentsTableService = {
  async getAllAppointments(): Promise<{ success: boolean; data?: AppointmentTableData[]; error?: string }> {
    try {
      const result = await appointmentsService.getAll()

      if (result.success && result.data) {
        const appointments = result.data.map((appt: Appointment) => ({
          id: appt.id!,
          userId: appt.userId,
          userName: 'User',
          serviceType: appt.serviceType,
          preferredDate: appt.preferredDate,
          preferredTime: appt.preferredTime,
          urgency: appt.urgency,
          status: appt.status,
          createdAt: appt.createdAt instanceof Date ? appt.createdAt : (appt.createdAt as any).toDate(),
          reason: appt.reason
        }))

        return { success: true, data: appointments }
      }

      return { success: false, error: result.error }
    } catch (error) {
      console.error('Error fetching appointments for table:', error)
      return { success: false, error: 'Failed to fetch appointments' }
    }
  },

  async updateAppointmentStatus(
    appointmentId: string,
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await appointmentsService.updateStatus(appointmentId, status)
      return result
    } catch (error) {
      console.error('Error updating appointment status:', error)
      return { success: false, error: 'Failed to update appointment status' }
    }
  },

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      pending: 'bg-warning',
      confirmed: 'bg-success',
      cancelled: 'bg-danger',
      completed: 'bg-secondary'
    }
    return classes[status] || 'bg-secondary'
  },

  getUrgencyBadgeClass(urgency: string): string {
    const classes: { [key: string]: string } = {
      low: 'bg-info',
      medium: 'bg-warning',
      high: 'bg-danger',
      urgent: 'bg-danger'
    }
    return classes[urgency.toLowerCase()] || 'bg-secondary'
  }
}
