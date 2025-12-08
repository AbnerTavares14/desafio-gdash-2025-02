import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'

export function AiInsightCard({ insight }: { insight: string }) {
  return (
    <Card className="border-indigo-200 bg-indigo-50/50 shadow-sm mb-8">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600 fill-indigo-600 animate-pulse" />
          <CardTitle className="text-base font-semibold text-indigo-800">
            Análise Inteligente
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {insight}
        </p>
      </CardContent>
    </Card>
  )
}
