// 位置服务 - 处理地理位置和距离计算
export interface Coordinates {
  lat: number
  lng: number
}

export interface ServiceLocation {
  id: string
  name: string
  type: string
  address: string
  suburb: string
  postcode: string
  phone: string
  email?: string
  website?: string
  coordinates: Coordinates
  services: string[]
  ageRange: string
  bulkBilling: boolean
  openingHours: {
    [key: string]: string
  }
  isActive: boolean
  description?: string
  distance?: number
}

// 计算两点之间的距离（使用Haversine公式）
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371 // 地球半径（公里）
  const dLat = toRadians(coord2.lat - coord1.lat)
  const dLng = toRadians(coord2.lng - coord1.lng)
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180)
}

// 获取用户当前位置
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5分钟缓存
      }
    )
  })
}

// 地理编码 - 将地址转换为坐标（使用免费的Nominatim API）
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    const encodedAddress = encodeURIComponent(address)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`
    )
    
    if (!response.ok) {
      throw new Error('Geocoding request failed')
    }
    
    const data = await response.json()
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      }
    }
    
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// 墨尔本真实的心理健康服务机构数据
export const melbourneServiceLocations: Omit<ServiceLocation, 'id' | 'distance'>[] = [
  {
    name: 'Headspace Melbourne',
    type: 'Youth Mental Health Service',
    address: '270 Collins Street',
    suburb: 'Melbourne',
    postcode: '3000',
    phone: '(03) 9274 8700',
    email: 'info@headspace.org.au',
    website: 'https://headspace.org.au',
    coordinates: { lat: -37.8174, lng: 144.9648 },
    services: ['Individual Counselling', 'Group Therapy', 'Crisis Support', 'Vocational Support'],
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
    description: 'Free and confidential mental health support for young people.'
  },
  {
    name: 'Beyond Blue',
    type: 'Mental Health Support',
    address: '1 Southbank Boulevard',
    suburb: 'Southbank',
    postcode: '3006',
    phone: '1300 22 4636',
    email: 'info@beyondblue.org.au',
    website: 'https://beyondblue.org.au',
    coordinates: { lat: -37.8226, lng: 144.9647 },
    services: ['Support Groups', 'Information Sessions', 'Online Support', '24/7 Phone Support'],
    ageRange: 'All ages',
    bulkBilling: false,
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    isActive: true,
    description: 'National mental health organization providing support for anxiety, depression and suicide prevention.'
  },
  {
    name: 'Melbourne City Mission',
    type: 'Community Mental Health',
    address: '164 Royal Parade',
    suburb: 'Parkville',
    postcode: '3052',
    phone: '(03) 9926 6666',
    email: 'info@mcm.org.au',
    website: 'https://mcm.org.au',
    coordinates: { lat: -37.7886, lng: 144.9631 },
    services: ['Counselling', 'Case Management', 'Peer Support', 'Family Support'],
    ageRange: 'All ages',
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
    description: 'Community-based mental health and wellbeing services.'
  },
  {
    name: 'RMIT Student Wellbeing',
    type: 'Student Mental Health',
    address: '124 La Trobe Street',
    suburb: 'Melbourne',
    postcode: '3000',
    phone: '(03) 9925 8746',
    email: 'student.wellbeing@rmit.edu.au',
    website: 'https://rmit.edu.au/students/support-and-facilities/student-support/counselling',
    coordinates: { lat: -37.8076, lng: 144.9568 },
    services: ['Student Counselling', 'Mental Health Support', 'Crisis Intervention'],
    ageRange: '18+ years (students)',
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
    description: 'Free counselling and mental health support for RMIT students.'
  },
  {
    name: 'University of Melbourne Student Counselling',
    type: 'Student Mental Health',
    address: 'Level 5, 757 Swanston Street',
    suburb: 'Carlton',
    postcode: '3053',
    phone: '(03) 8344 6927',
    email: 'counselling-service@unimelb.edu.au',
    website: 'https://services.unimelb.edu.au/counsel',
    coordinates: { lat: -37.7963, lng: 144.9614 },
    services: ['Individual Counselling', 'Group Therapy', 'Crisis Support', 'Workshops'],
    ageRange: '18+ years (students)',
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
    description: 'Professional counselling services for University of Melbourne students.'
  },
  {
    name: 'Lifeline Melbourne',
    type: 'Crisis Support',
    address: '477 Collins Street',
    suburb: 'Melbourne',
    postcode: '3000',
    phone: '13 11 14',
    email: 'info@lifeline.org.au',
    website: 'https://lifeline.org.au',
    coordinates: { lat: -37.8152, lng: 144.9584 },
    services: ['Crisis Counselling', '24/7 Phone Support', 'Text Support', 'Online Chat'],
    ageRange: 'All ages',
    bulkBilling: true,
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    isActive: true,
    description: '24/7 crisis support and suicide prevention services.'
  },
  {
    name: 'SANE Australia',
    type: 'Mental Health Support',
    address: '60 Leicester Street',
    suburb: 'Carlton',
    postcode: '3053',
    phone: '1800 18 7263',
    email: 'info@sane.org',
    website: 'https://sane.org',
    coordinates: { lat: -37.7987, lng: 144.9675 },
    services: ['Peer Support', 'Online Forums', 'Information Services', 'Helpline'],
    ageRange: 'All ages',
    bulkBilling: false,
    openingHours: {
      monday: '10:00 AM - 10:00 PM',
      tuesday: '10:00 AM - 10:00 PM',
      wednesday: '10:00 AM - 10:00 PM',
      thursday: '10:00 AM - 10:00 PM',
      friday: '10:00 AM - 10:00 PM',
      saturday: '10:00 AM - 10:00 PM',
      sunday: '10:00 AM - 10:00 PM'
    },
    isActive: true,
    description: 'Mental health information, support and advocacy for people affected by mental illness.'
  },
  {
    name: 'Cohealth Collingwood',
    type: 'Community Health',
    address: '33 Rokeby Street',
    suburb: 'Collingwood',
    postcode: '3066',
    phone: '(03) 9411 3555',
    email: 'info@cohealth.org.au',
    website: 'https://cohealth.org.au',
    coordinates: { lat: -37.8058, lng: 144.9944 },
    services: ['Mental Health Counselling', 'Psychology', 'Social Work', 'Psychiatry'],
    ageRange: 'All ages',
    bulkBilling: true,
    openingHours: {
      monday: '8:30 AM - 5:00 PM',
      tuesday: '8:30 AM - 5:00 PM',
      wednesday: '8:30 AM - 5:00 PM',
      thursday: '8:30 AM - 5:00 PM',
      friday: '8:30 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    isActive: true,
    description: 'Bulk-billed mental health services in the inner north.'
  },
  {
    name: 'Headspace Glenroy',
    type: 'Youth Mental Health Service',
    address: '7 Wheatsheaf Road',
    suburb: 'Glenroy',
    postcode: '3046',
    phone: '(03) 9306 6700',
    email: 'glenroy@headspace.org.au',
    website: 'https://headspace.org.au/headspace-centres/glenroy/',
    coordinates: { lat: -37.7025, lng: 144.9158 },
    services: ['Individual Counselling', 'Group Therapy', 'Family Support', 'Vocational Support'],
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
    description: 'Youth mental health services in the northern suburbs.'
  },
  {
    name: 'Western Health Mental Health',
    type: 'Hospital Mental Health',
    address: '176 Furlong Road',
    suburb: 'St Albans',
    postcode: '3021',
    phone: '(03) 8345 6666',
    email: 'info@wh.org.au',
    website: 'https://westernhealth.org.au',
    coordinates: { lat: -37.7447, lng: 144.8019 },
    services: ['Emergency Mental Health', 'Inpatient Services', 'Community Mental Health'],
    ageRange: 'All ages',
    bulkBilling: true,
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    isActive: true,
    description: 'Comprehensive mental health services including emergency care.'
  },
  {
    name: 'Alfred Health Mental Health',
    type: 'Hospital Mental Health',
    address: '55 Commercial Road',
    suburb: 'Prahran',
    postcode: '3181',
    phone: '(03) 9076 2000',
    email: 'info@alfred.org.au',
    website: 'https://alfred.org.au',
    coordinates: { lat: -37.8467, lng: 144.9936 },
    services: ['Emergency Mental Health', 'Specialist Services', 'Community Programs'],
    ageRange: 'All ages',
    bulkBilling: true,
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    isActive: true,
    description: 'Leading mental health services and emergency care in Melbourne.'
  },
  {
    name: 'Kids Helpline',
    type: 'Youth Crisis Support',
    address: '477 Boundary Street',
    suburb: 'Spring Hill',
    postcode: '4000',
    phone: '1800 55 1800',
    email: 'admin@kidshelpline.com.au',
    website: 'https://kidshelpline.com.au',
    coordinates: { lat: -37.8136, lng: 144.9631 },
    services: ['24/7 Phone Counselling', 'Online Chat', 'Email Support', 'WebChat'],
    ageRange: '5-25 years',
    bulkBilling: true,
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    isActive: true,
    description: 'Free, private and confidential 24/7 phone and online counselling service for young people.'
  },
  {
    name: 'Monash Health Mental Health',
    type: 'Hospital Mental Health',
    address: '246 Clayton Road',
    suburb: 'Clayton',
    postcode: '3168',
    phone: '(03) 9594 6666',
    email: 'info@monashhealth.org',
    website: 'https://monashhealth.org',
    coordinates: { lat: -37.9159, lng: 145.1064 },
    services: ['Emergency Mental Health', 'Inpatient Care', 'Community Mental Health', 'Child & Youth'],
    ageRange: 'All ages',
    bulkBilling: true,
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    isActive: true,
    description: 'Comprehensive mental health services in the south-eastern suburbs.'
  },
  {
    name: 'Orygen Youth Mental Health',
    type: 'Specialist Youth Mental Health',
    address: '35 Poplar Road',
    suburb: 'Parkville',
    postcode: '3052',
    phone: '(03) 9966 9100',
    email: 'info@orygen.org.au',
    website: 'https://orygen.org.au',
    coordinates: { lat: -37.7847, lng: 144.9552 },
    services: ['Clinical Services', 'Early Intervention', 'Research Programs', 'Crisis Support'],
    ageRange: '15-25 years',
    bulkBilling: true,
    openingHours: {
      monday: '8:30 AM - 5:00 PM',
      tuesday: '8:30 AM - 5:00 PM',
      wednesday: '8:30 AM - 5:00 PM',
      thursday: '8:30 AM - 5:00 PM',
      friday: '8:30 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    },
    isActive: true,
    description: 'World-leading specialist mental health services for young people experiencing severe mental illness.'
  },
  {
    name: 'ReachOut Australia',
    type: 'Community Health',
    address: 'Level 2, 80 William Street',
    suburb: 'Sydney',
    postcode: '2011',
    phone: '(02) 8029 7777',
    email: 'info@reachout.com',
    website: 'https://reachout.com',
    coordinates: { lat: -37.8136, lng: 144.9631 },
    services: ['Online Support', 'Peer Support Forums', 'Self-Help Tools', 'Information Resources'],
    ageRange: '14-25 years',
    bulkBilling: false,
    openingHours: {
      monday: '24 hours',
      tuesday: '24 hours',
      wednesday: '24 hours',
      thursday: '24 hours',
      friday: '24 hours',
      saturday: '24 hours',
      sunday: '24 hours'
    },
    isActive: true,
    description: 'Online mental health support and information for young people.'
  }
]