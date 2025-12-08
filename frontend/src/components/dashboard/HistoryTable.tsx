import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Download,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { WeatherLog } from '@/types/weather'

interface Props {
  logs: WeatherLog[]
  onDownload: (type: 'csv' | 'xlsx') => void
  isDownloading: boolean
}

export function HistoryTable({ logs, onDownload, isDownloading }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(logs.length / itemsPerPage)
  const currentLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Histórico de Coletas
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload('csv')}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" /> CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDownload('xlsx')}
            disabled={isDownloading}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Temp (°C)</TableHead>
                <TableHead>Umidade (%)</TableHead>
                <TableHead>Vento (km/h)</TableHead>
                <TableHead>Prob. de Chuva (%)</TableHead>
                <TableHead>Condição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-700">
                      {new Date(log.collectedAt).toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell>{log.temperature.toFixed(1)}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {log.humidity}%
                      </span>
                    </TableCell>
                    <TableCell>{log.windSpeed}</TableCell>
                    <TableCell>{log.precipitationProb}</TableCell>
                    <TableCell>
                      {log.conditionString || log.condition}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Página {currentPage} de {totalPages || 1}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Próximo <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
