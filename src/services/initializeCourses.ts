import { coursesService, courseSchedulesService } from './coursesService'

// Initialize sample courses
export const initializeCourses = async () => {
  try {
    console.log('Initializing courses...')

    // Course 1: Anxiety Management Workshop
    const anxietyWorkshop = await coursesService.create({
      title: 'Anxiety Management Workshop',
      description: 'Learn practical techniques to manage anxiety and stress. This interactive workshop covers breathing exercises, cognitive behavioral techniques, and mindfulness practices.',
      instructor: 'Dr. Sarah Chen',
      duration: 90, // 90 minutes
      maxParticipants: 12,
      category: 'Mental Health',
      price: 0, // Free
      isActive: true
    })

    if (anxietyWorkshop.success) {
      // Add schedules for Anxiety Workshop (Tuesdays and Thursdays)
      await courseSchedulesService.create({
        courseId: anxietyWorkshop.id!,
        dayOfWeek: 2, // Tuesday
        startTime: '14:00',
        endTime: '15:30',
        isActive: true
      })
      
      await courseSchedulesService.create({
        courseId: anxietyWorkshop.id!,
        dayOfWeek: 4, // Thursday
        startTime: '10:00',
        endTime: '11:30',
        isActive: true
      })
    }

    // Course 2: Mindfulness Meditation
    const mindfulnessMeditation = await coursesService.create({
      title: 'Mindfulness Meditation Sessions',
      description: 'Guided mindfulness meditation sessions to help reduce stress, improve focus, and enhance emotional wellbeing. Suitable for beginners and experienced practitioners.',
      instructor: 'Marcus Williams',
      duration: 60, // 60 minutes
      maxParticipants: 20,
      category: 'Wellness',
      price: 0, // Free
      isActive: true
    })

    if (mindfulnessMeditation.success) {
      // Add schedules for Mindfulness (Mondays, Wednesdays, Fridays)
      await courseSchedulesService.create({
        courseId: mindfulnessMeditation.id!,
        dayOfWeek: 1, // Monday
        startTime: '18:00',
        endTime: '19:00',
        isActive: true
      })
      
      await courseSchedulesService.create({
        courseId: mindfulnessMeditation.id!,
        dayOfWeek: 3, // Wednesday
        startTime: '12:00',
        endTime: '13:00',
        isActive: true
      })
      
      await courseSchedulesService.create({
        courseId: mindfulnessMeditation.id!,
        dayOfWeek: 5, // Friday
        startTime: '17:00',
        endTime: '18:00',
        isActive: true
      })
    }

    // Course 3: Youth Support Group
    const youthSupportGroup = await coursesService.create({
      title: 'Youth Support Group',
      description: 'A safe space for young people (16-25) to share experiences, build connections, and support each other. Facilitated by trained peer mentors and mental health professionals.',
      instructor: 'Emily Rodriguez',
      duration: 120, // 2 hours
      maxParticipants: 8,
      category: 'Support Group',
      price: 0, // Free
      isActive: true
    })

    if (youthSupportGroup.success) {
      // Add schedules for Youth Support Group (Saturdays)
      await courseSchedulesService.create({
        courseId: youthSupportGroup.id!,
        dayOfWeek: 6, // Saturday
        startTime: '10:00',
        endTime: '12:00',
        isActive: true
      })
      
      await courseSchedulesService.create({
        courseId: youthSupportGroup.id!,
        dayOfWeek: 6, // Saturday
        startTime: '14:00',
        endTime: '16:00',
        isActive: true
      })
    }

    console.log('Courses initialized successfully!')
    return { success: true, message: 'Courses initialized with sample data' }

  } catch (error) {
    console.error('Error initializing courses:', error)
    return { success: false, error: 'Failed to initialize courses' }
  }
}