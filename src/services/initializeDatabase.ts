import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'

// Sample data for initializing the database
export const initializeDatabase = async () => {
  try {
    console.log('Initializing Firebase database...')

    // Initialize sample mental health resources
    const resourcesData = [
      {
        title: 'The Complete Guide to Teen Anxiety Disorders',
        description: 'A comprehensive guide to help teens identify, understand, and manage anxiety symptoms, including practical coping strategies and professional advice.',
        category: 'Anxiety',
        type: 'Article',
        content: `# The Complete Guide to Teen Anxiety

## What is an Anxiety Disorder?

Anxiety is a normal response to stress, but when it becomes excessive or persistent, it can develop into an anxiety disorder. Anxiety disorders are one of the most common mental health issues for teenagers.

## Common Symptoms

### Physical Symptoms:
- A racing heart or palpitations
- Sweating or shaking
- Difficulty breathing or feeling of suffocation
- Headache or muscle tension
- Upset stomach or nausea
- Fatigue or insomnia

### Emotional Symptoms:
- Excessive worry or fear
- Irritability
- Difficulty concentrating
- Feeling out of control
- Avoiding certain situations or activities

## Coping Strategies

### 1. Deep Breathing Exercises
When feeling anxious, try the following:
- Inhale slowly for 4 seconds
- Hold your breath for 4 seconds
- Exhale slowly for 6 seconds
- Repeat 5-10 times

### 2. Progressive Muscle Relaxation
- Starting with your toes, gradually tense and relax each muscle group
- Hold the tension for 5 seconds, then relax for 10 seconds
- Work your way up, working your way up the body

### 3. Cognitive Reframing
- Identify negative thought patterns
- Question the validity of these thoughts
- Replace them with more realistic, positive thoughts.

### 4. Establish a daily routine
- Maintain a regular sleep schedule
- Exercise regularly
- Eat a healthy diet
- Limit caffeine intake

## When to Seek Professional Help

If anxiety symptoms:
- Persist for more than 6 months
- Severely interfere with school or social life
- Lead to avoiding important activities
- Accompanying depression or other psychological issues

Contact a mental health professional immediately.

## Support Resources

- **Lifeline**: 13 11 14
- **Kids Helpline**: 1800 55 1800
- **Beyond Blue**: 1300 22 4636

Remember, seeking help is a sign of courage; you don't have to face anxiety alone.`,
        author: 'Dr. Chen (Dr. Sarah Chen)',
        publishedDate: serverTimestamp(),
        tags: ['anxiety disorders', 'Mental Health', 'Coping strategie', 'teenager'],
        isPublished: true,
        viewCount: 0,
        overallRating: 4.5,
        aspectRatings: {
          helpfulness: 4.6,
          clarity: 4.3,
          relevance: 4.7,
          accuracy: 4.4
        },
        totalRatings: 24,
        commentCount: 18
      }
    ]

    // Create resources collection
    for (const resource of resourcesData) {
      const docRef = doc(collection(db, 'resources'))
      await setDoc(docRef, resource)
    }

    // Initialize service locations for the map
    const serviceLocationsData = [
      {
        id: 'headspace-melbourne',
        name: 'Headspace Melbourne',
        type: 'Youth Mental Health Service',
        address: '456 Bourke Street, Melbourne VIC 3000',
        phone: '(03) 9234 5678',
        email: 'melbourne@headspace.org.au',
        website: 'https://headspace.org.au',
        coordinates: {
          lat: -37.8136,
          lng: 144.9631
        },
        services: ['Individual Counselling', 'Group Therapy', 'Crisis Support'],
        ageRange: '12-25 years',
        bulkBilling: true,
        openingHours: {
          monday: '9:00 AM - 5:00 PM',
          tuesday: '9:00 AM - 5:00 PM',
          wednesday: '9:00 AM - 5:00 PM',
          thursday: '9:00 AM - 5:00 PM',
          friday: '9:00 AM - 5:00 PM',
          saturday: 'Closed',
          sunday: 'Closed'
        },
        isActive: true,
        createdAt: serverTimestamp()
      },
      {
        id: 'beyond-blue-support',
        name: 'Beyond Blue Support Centre',
        type: 'Mental Health Support',
        address: '789 Collins Street, Melbourne VIC 3000',
        phone: '(03) 9345 6789',
        email: 'support@beyondblue.org.au',
        website: 'https://beyondblue.org.au',
        coordinates: {
          lat: -37.8174,
          lng: 144.9648
        },
        services: ['Support Groups', 'Counselling', 'Information Sessions'],
        ageRange: 'All ages',
        bulkBilling: false,
        openingHours: {
          monday: '8:00 AM - 6:00 PM',
          tuesday: '8:00 AM - 6:00 PM',
          wednesday: '8:00 AM - 6:00 PM',
          thursday: '8:00 AM - 6:00 PM',
          friday: '8:00 AM - 6:00 PM',
          saturday: '9:00 AM - 1:00 PM',
          sunday: 'Closed'
        },
        isActive: true,
        createdAt: serverTimestamp()
      }
    ]

    // Create service locations collection
    for (const location of serviceLocationsData) {
      await setDoc(doc(db, 'service_locations', location.id), location)
    }

    // Initialize system settings
    const systemSettings = {
      siteName: 'MindWell NFP',
      siteDescription: 'Supporting youth mental health and wellbeing',
      contactEmail: 'info@mindwell.org.au',
      emergencyContacts: {
        lifeline: '13 11 14',
        kidsHelpline: '1800 55 1800',
        emergency: '000'
      },
      features: {
        appointmentBooking: true,
        resourceRating: true,
        contactForm: true,
        serviceMap: true
      },
      maintenanceMode: false,
      lastUpdated: serverTimestamp()
    }

    await setDoc(doc(db, 'system', 'settings'), systemSettings)

    console.log('Database initialized successfully!')
    return { success: true, message: 'Database initialized with sample data' }

  } catch (error) {
    console.error('Error initializing database:', error)
    return { success: false, error: 'Failed to initialize database' }
  }
}

// Function to check if database needs initialization
export const checkDatabaseStatus = async () => {
  try {
    // This would check if essential collections exist
    // For now, we'll just return that initialization is needed
    return { needsInitialization: true }
  } catch (error) {
    console.error('Error checking database status:', error)
    return { needsInitialization: true }
  }
}