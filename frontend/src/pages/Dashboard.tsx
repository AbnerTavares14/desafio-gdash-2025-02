import { useWeatherDashboard } from '@/hooks/useWeatherDashboard'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { AiInsightCard } from '@/components/dashboard/AiInsightCard'
import { CurrentStatsGrid } from '@/components/dashboard/CurrentStatsGrid'
import { HourlyForecast } from '@/components/dashboard/HourlyForecast'
import { HistoryTable } from '@/components/dashboard/HistoryTable'

export function Dashboard() {
  const { logs, insight, isDownloading, handleDownload } = useWeatherDashboard()
  const latest = logs[0]

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <AiInsightCard insight={insight} />

        <CurrentStatsGrid latest={latest} />

        <HourlyForecast latest={latest} />

        <HistoryTable
          logs={logs}
          onDownload={handleDownload}
          isDownloading={isDownloading}
        />
      </main>
    </div>
  )
}
