import { appointmentsService } from '@/services/firestore'
import { userService } from '@/services/firestore'
import type { Appointment } from '@/services/firestore'

export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface TimeSeriesDataPoint {
  date: Date
  value: number
}

export const chartDataService = {
  async getUserRegistrationTrend(months: number = 6): Promise<TimeSeriesDataPoint[]> {
    try {
      const result = await userService.getAll()

      if (!result.success || !result.data) {
        return []
      }

      const now = new Date()
      const startDate = new Date(now)
      startDate.setMonth(startDate.getMonth() - months)

      const monthlyData = new Map<string, number>()

      result.data.forEach((user: any) => {
        const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt)

        if (createdAt >= startDate) {
          const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`
          monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1)
        }
      })

      const dataPoints: TimeSeriesDataPoint[] = []
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        date.setDate(1)

        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        dataPoints.push({
          date,
          value: monthlyData.get(monthKey) || 0
        })
      }

      return dataPoints
    } catch (error) {
      console.error('Error getting user registration trend:', error)
      return []
    }
  },

  async getAppointmentsByService(): Promise<ChartDataPoint[]> {
    try {
      const result = await appointmentsService.getAll()

      if (!result.success || !result.data) {
        return []
      }

      const serviceCount = new Map<string, number>()

      result.data.forEach((appointment: Appointment) => {
        const service = appointment.serviceType || 'Unknown'
        serviceCount.set(service, (serviceCount.get(service) || 0) + 1)
      })

      const colors = [
        '#0066CC',
        '#28a745',
        '#ffc107',
        '#dc3545',
        '#6c757d',
        '#17a2b8',
        '#6f42c1',
        '#fd7e14'
      ]

      return Array.from(serviceCount.entries())
        .map(([label, value], index) => ({
          label,
          value,
          color: colors[index % colors.length]
        }))
        .sort((a, b) => b.value - a.value)
    } catch (error) {
      console.error('Error getting appointments by service:', error)
      return []
    }
  },

  async getAppointmentsByStatus(): Promise<ChartDataPoint[]> {
    try {
      const result = await appointmentsService.getAll()

      if (!result.success || !result.data) {
        return []
      }

      const statusCount = new Map<string, number>()

      result.data.forEach((appointment: Appointment) => {
        const status = appointment.status || 'Unknown'
        statusCount.set(status, (statusCount.get(status) || 0) + 1)
      })

      const statusColors: { [key: string]: string } = {
        pending: '#ffc107',
        confirmed: '#28a745',
        cancelled: '#dc3545',
        completed: '#6c757d'
      }

      return Array.from(statusCount.entries()).map(([label, value]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value,
        color: statusColors[label] || '#6c757d'
      }))
    } catch (error) {
      console.error('Error getting appointments by status:', error)
      return []
    }
  },

  async getMonthlyAppointments(months: number = 6): Promise<TimeSeriesDataPoint[]> {
    try {
      const result = await appointmentsService.getAll()

      if (!result.success || !result.data) {
        return []
      }

      const now = new Date()
      const startDate = new Date(now)
      startDate.setMonth(startDate.getMonth() - months)

      const monthlyData = new Map<string, number>()

      result.data.forEach((appointment: Appointment) => {
        const createdAt = appointment.createdAt instanceof Date
          ? appointment.createdAt
          : (appointment.createdAt as any).toDate()

        if (createdAt >= startDate) {
          const monthKey = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, '0')}`
          monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + 1)
        }
      })

      const dataPoints: TimeSeriesDataPoint[] = []
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now)
        date.setMonth(date.getMonth() - i)
        date.setDate(1)

        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        dataPoints.push({
          date,
          value: monthlyData.get(monthKey) || 0
        })
      }

      return dataPoints
    } catch (error) {
      console.error('Error getting monthly appointments:', error)
      return []
    }
  },

  async getUsersByRole(): Promise<ChartDataPoint[]> {
    try {
      const result = await userService.getAll()

      if (!result.success || !result.data) {
        return []
      }

      const roleCount = new Map<string, number>()

      result.data.forEach((user: any) => {
        const role = user.role || 'user'
        roleCount.set(role, (roleCount.get(role) || 0) + 1)
      })

      const roleColors: { [key: string]: string } = {
        admin: '#dc3545',
        user: '#0066CC'
      }

      return Array.from(roleCount.entries()).map(([label, value]) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        value,
        color: roleColors[label] || '#6c757d'
      }))
    } catch (error) {
      console.error('Error getting users by role:', error)
      return []
    }
  }
}
