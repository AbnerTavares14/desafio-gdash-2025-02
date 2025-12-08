export interface WeatherLog {
  id: string
  temperature: number
  humidity: number
  windSpeed: number
  condition: number
  conditionString: string
  collectedAt: string
  precipitationProb: number
  fullData?: {
    hourly?: {
      time: string[]
      temperature_2m: number[]
      precipitation_probability: number[]
    }
  }
}