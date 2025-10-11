import { courseInstancesService } from './courseInstancesService'

export interface TaskLog {
  taskName: string
  status: 'success' | 'error'
  timestamp: Date
  message?: string
  error?: string
}

export const scheduledTasksService = {
  taskLogs: [] as TaskLog[],

  logTask(log: TaskLog) {
    this.taskLogs.push(log)
    if (this.taskLogs.length > 100) {
      this.taskLogs = this.taskLogs.slice(-100)
    }
  },

  getRecentLogs(limit: number = 20): TaskLog[] {
    return this.taskLogs.slice(-limit).reverse()
  },

  async runWeeklyRefresh() {
    const taskName = 'Weekly Course Instance Refresh'
    console.log(`[${new Date().toISOString()}] Starting ${taskName}...`)

    try {
      const deleteResult = await courseInstancesService.deleteOldInstances(7)
      if (!deleteResult.success) {
        throw new Error(deleteResult.error || 'Failed to delete old instances')
      }

      console.log(`Deleted ${deleteResult.deletedCount} old course instances`)

      const generateResult = await courseInstancesService.generateUpcomingInstances(14)
      if (!generateResult.success) {
        throw new Error(generateResult.error || 'Failed to generate new instances')
      }

      console.log(`Generated ${generateResult.count} new course instances`)

      const message = `Deleted ${deleteResult.deletedCount} old instances, generated ${generateResult.count} new instances`

      this.logTask({
        taskName,
        status: 'success',
        timestamp: new Date(),
        message
      })

      console.log(`[${new Date().toISOString()}] ${taskName} completed successfully`)
      return { success: true, message }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[${new Date().toISOString()}] ${taskName} failed:`, errorMessage)

      this.logTask({
        taskName,
        status: 'error',
        timestamp: new Date(),
        error: errorMessage
      })

      return { success: false, error: errorMessage }
    }
  },

  setupScheduledTasks() {
    console.log('Setting up scheduled tasks...')

    const checkAndRunTask = () => {
      const now = new Date()
      const dayOfWeek = now.getDay()
      const hours = now.getHours()
      const minutes = now.getMinutes()

      if (dayOfWeek === 0 && hours === 0 && minutes === 0) {
        console.log('Triggered weekly refresh task')
        this.runWeeklyRefresh()
      }
    }

    setInterval(checkAndRunTask, 60 * 1000)

    console.log('Scheduled tasks configured: Weekly refresh every Sunday at 00:00')
  },

  async initializeInstances() {
    const taskName = 'Initial Instance Generation'
    console.log(`[${new Date().toISOString()}] Starting ${taskName}...`)

    try {
      const result = await courseInstancesService.refreshInstances()

      if (result.success) {
        const message = `Generated ${result.count || 0} course instances`
        this.logTask({
          taskName,
          status: 'success',
          timestamp: new Date(),
          message
        })

        console.log(`[${new Date().toISOString()}] ${taskName} completed successfully`)
        return { success: true, message }
      } else {
        throw new Error(result.error || 'Failed to initialize instances')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error(`[${new Date().toISOString()}] ${taskName} failed:`, errorMessage)

      this.logTask({
        taskName,
        status: 'error',
        timestamp: new Date(),
        error: errorMessage
      })

      return { success: false, error: errorMessage }
    }
  }
}

if (typeof window !== 'undefined') {
  scheduledTasksService.setupScheduledTasks()
}
