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
    name: 'Headspace Melbourne CBD',
    type: 'Youth Mental Health Service',
    address: '1/270 Collins Street',
    suburb: 'Melbourne',
    postcode: '3000',
    phone: '(03) 9663 6733',
    email: 'melbourne@headspace.org.au',
    website: 'https://headspace.org.au/headspace-centres/melbourne/',
    coordinates: { lat: -37.8136, lng: 144.9631 },
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
    description: 'Free and confidential mental health support for young people aged 12-25.'
  },
  {
    name: 'Beyond Blue Support Centre',
    type: 'Mental Health Support',
    address: 'Level 6, 287 Collins Street',
    suburb: 'Melbourne',
    postcode: '3000',
    phone: '1300 22 4636',
    email: 'info@beyondblue.org.au',
    website: 'https://beyondblue.org.au',
    coordinates: { lat: -37.8174, lng: 144.9648 },
    services: ['Support Groups', 'Information Sessions', 'Online Support'],
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
    description: 'Providing support for anxiety, depression and suicide prevention.'
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
    services: ['Clinical Services', 'Early Intervention', 'Research Programs'],
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
    description: 'Specialist mental health services for young people experiencing severe mental illness.'
  },
  {
    name: 'Melbourne City Mission - Mental Health',
    type: 'Community Mental Health',
    address: '164 Royal Parade',
    suburb: 'Parkville',
    postcode: '3052',
    phone: '(03) 9926 6666',
    email: 'info@mcm.org.au',
    website: 'https://mcm.org.au',
    coordinates: { lat: -37.7886, lng: 144.9631 },
    services: ['Counselling', 'Case Management', 'Peer Support'],
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
    name: 'MIND Australia - Richmond',
    type: 'Mental Health Support',
    address: '86-92 Church Street',
    suburb: 'Richmond',
    postcode: '3121',
    phone: '(03) 8486 4200',
    email: 'info@mindaustralia.org.au',
    website: 'https://mindaustralia.org.au',
    coordinates: { lat: -37.8197, lng: 144.9969 },
    services: ['Individual Support', 'Group Programs', 'Family Support'],
    ageRange: 'All ages',
    bulkBilling: false,
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
    description: 'Specialist mental health recovery and rehabilitation services.'
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
    services: ['Crisis Counselling', '24/7 Phone Support', 'Text Support'],
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
    name: 'Headspace Camberwell',
    type: 'Youth Mental Health Service',
    address: '1022 Burke Road',
    suburb: 'Camberwell',
    postcode: '3124',
    phone: '(03) 9882 8400',
    email: 'camberwell@headspace.org.au',
    website: 'https://headspace.org.au/headspace-centres/camberwell/',
    coordinates: { lat: -37.8244, lng: 145.0581 },
    services: ['Individual Counselling', 'Group Therapy', 'Family Support'],
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
    description: 'Youth mental health services in the eastern suburbs.'
  },
  {
    name: 'St Kilda Youth Service',
    type: 'Youth Support Service',
    address: '20 Carlisle Street',
    suburb: 'St Kilda',
    postcode: '3182',
    phone: '(03) 9534 6605',
    email: 'info@skys.org.au',
    website: 'https://skys.org.au',
    coordinates: { lat: -37.8679, lng: 144.9841 },
    services: ['Counselling', 'Case Management', 'Housing Support'],
    ageRange: '16-25 years',
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
    description: 'Comprehensive support services for young people in crisis.'
  },
  {
    name: 'Footscray Community Health Centre',
    type: 'Community Health',
    address: '1 Moreland Street',
    suburb: 'Footscray',
    postcode: '3011',
    phone: '(03) 9689 9588',
    email: 'info@wchc.org.au',
    website: 'https://wchc.org.au',
    coordinates: { lat: -37.7993, lng: 144.9008 },
    services: ['Mental Health Counselling', 'Social Work', 'Psychology'],
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
    description: 'Bulk-billed mental health services in the western suburbs.'
  },
  {
    name: 'Northcote Community Health Centre',
    type: 'Community Health',
    address: '42 Separation Street',
    suburb: 'Northcote',
    postcode: '3070',
    phone: '(03) 9481 3555',
    email: 'info@nchc.org.au',
    website: 'https://nchc.org.au',
    coordinates: { lat: -37.7708, lng: 144.9969 },
    services: ['Psychology', 'Social Work', 'Group Programs'],
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
    description: 'Community health services including mental health support.'
  }
]