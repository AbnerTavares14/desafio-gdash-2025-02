import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, CloudRain, CloudSun, Droplets } from 'lucide-react'
import type { WeatherLog } from '@/types/weather'

export function HourlyForecast({ latest }: { latest?: WeatherLog }) {
  if (!latest?.fullData?.hourly) return null

  return (
    <Card className="mb-8 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-500" /> Previsão para as Próximas
          Horas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200">
          {latest.fullData.hourly.time.map((time, index) => {
            const date = new Date(time)
            const now = new Date()
            if (date < new Date(now.setMinutes(now.getMinutes() - 59)))
              return null

            const isMidnight = date.getHours() === 0
            const timeLabel = isMidnight
              ? date
                  .toLocaleDateString('pt-BR', { weekday: 'short' })
                  .toUpperCase()
              : `${date.getHours()}:00`
            const temp =
              latest.fullData!.hourly!.temperature_2m[index].toFixed(0)
            const prob =
              latest.fullData!.hourly!.precipitation_probability[index]

            return (
              <div
                key={time}
                className={`flex flex-col items-center min-w-[80px] p-3 rounded-lg border transition-colors ${
                  isMidnight
                    ? 'bg-blue-100 border-blue-300'
                    : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-blue-200'
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isMidnight ? 'text-blue-700 font-bold' : 'text-slate-600'
                  }`}
                >
                  {timeLabel}
                </span>
                <div className="my-2">
                  {prob > 50 ? (
                    <CloudRain className="h-6 w-6 text-blue-500" />
                  ) : (
                    <CloudSun className="h-6 w-6 text-orange-400" />
                  )}
                </div>
                <span className="text-lg font-bold text-slate-800">
                  {temp}°
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <Droplets className="h-3 w-3 text-cyan-500" />
                  <span className="text-xs text-cyan-600 font-medium">
                    {prob}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
