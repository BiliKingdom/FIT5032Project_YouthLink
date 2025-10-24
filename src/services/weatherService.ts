import type { Coordinates } from './locationService'

export interface WeatherData {
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  feelsLike: number
  location: string
}

export const getWeatherByCoordinates = async (
  coordinates: Coordinates
): Promise<WeatherData | null> => {
  try {
    const API_KEY = '64a18e8c87b58c77bce4d4b84d4bd3f4'
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${API_KEY}&units=metric`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Weather API request failed')
    }

    const data = await response.json()

    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      feelsLike: Math.round(data.main.feels_like),
      location: data.name
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    return null
  }
}

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
