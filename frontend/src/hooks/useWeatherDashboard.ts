import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { WeatherLog } from '@/types/weather'

export function useWeatherDashboard() {
  const [logs, setLogs] = useState<WeatherLog[]>([])
  const [insight, setInsight] = useState<string>('Carregando análise da IA...')
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    fetchData()
    fetchInsight()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    try {
      const response = await api.get('/weather/logs')
      setLogs(response.data)
    } catch (error) {
      console.error('Erro ao buscar dados', error)
    }
  }

  async function fetchInsight() {
    try {
      const response = await api.get('/weather/insights')
      setInsight(response.data.text)
    } catch (error) {
      console.log(error)
      setInsight('IA indisponível no momento.')
    }
  }

  async function handleDownload(type: 'csv' | 'xlsx') {
    setIsDownloading(true)
    try {
      const response = await api.get(`/weather/export/${type}`, {
        responseType: 'blob',
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `weather_data.${type}`)
      document.body.appendChild(link)
      link.click()
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
    	console.log(error)
      alert('Erro ao baixar arquivo.')
    } finally {
      setIsDownloading(false)
    }
  }

  return { logs, insight, isDownloading, handleDownload }
}