import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wind, Droplets, Thermometer, CloudRain } from 'lucide-react'
import type { WeatherLog } from '@/types/weather'

export function CurrentStatsGrid({ latest }: { latest?: WeatherLog }) {
  if (!latest)
    return (
      <div className="p-8 text-center bg-white border border-dashed rounded-lg">
        Carregando dados...
      </div>
    )

  const cards = [
    {
      title: 'Temperatura',
      value: `${latest.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: 'text-red-600',
      bg: 'bg-red-100',
      border: 'border-l-red-500',
    },
    {
      title: 'Umidade',
      value: `${latest.humidity}%`,
      icon: Droplets,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      border: 'border-l-blue-500',
    },
    {
      title: 'Chuva (Prob.)',
      value: `${latest.precipitationProb}%`,
      icon: CloudRain,
      color: 'text-cyan-600',
      bg: 'bg-cyan-100',
      border: 'border-l-cyan-500',
    },
    {
      title: 'Vento',
      value: `${latest.windSpeed} km/h`,
      icon: Wind,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
      border: 'border-l-emerald-500',
    },
    {
      title: 'Condição',
      value: latest.conditionString || latest.condition,
      icon: CloudRain,
      color: 'text-indigo-600',
      bg: 'bg-indigo-100',
      border: 'border-l-indigo-500',
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
      {cards.map((card, i) => (
        <Card
          key={i}
          className={`border-l-4 ${card.border} shadow-sm hover:shadow-md transition-shadow`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 ${card.bg} rounded-full`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {card.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
