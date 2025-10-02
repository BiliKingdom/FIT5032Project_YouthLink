import { ref, onMounted } from 'vue'
import { chartDataService, type ChartDataPoint, type TimeSeriesDataPoint } from '@/services/charts/chartDataService'

export function useChartData() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadUserRegistrationTrend = async (months: number = 6) => {
    loading.value = true
    error.value = null

    try {
      const data = await chartDataService.getUserRegistrationTrend(months)
      return data
    } catch (err) {
      error.value = 'Failed to load user registration trend'
      console.error('Error loading chart data:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const loadAppointmentsByService = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await chartDataService.getAppointmentsByService()
      return data
    } catch (err) {
      error.value = 'Failed to load appointments by service'
      console.error('Error loading chart data:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const loadAppointmentsByStatus = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await chartDataService.getAppointmentsByStatus()
      return data
    } catch (err) {
      error.value = 'Failed to load appointments by status'
      console.error('Error loading chart data:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const loadMonthlyAppointments = async (months: number = 6) => {
    loading.value = true
    error.value = null

    try {
      const data = await chartDataService.getMonthlyAppointments(months)
      return data
    } catch (err) {
      error.value = 'Failed to load monthly appointments'
      console.error('Error loading chart data:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const loadUsersByRole = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await chartDataService.getUsersByRole()
      return data
    } catch (err) {
      error.value = 'Failed to load users by role'
      console.error('Error loading chart data:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    loadUserRegistrationTrend,
    loadAppointmentsByService,
    loadAppointmentsByStatus,
    loadMonthlyAppointments,
    loadUsersByRole
  }
}
