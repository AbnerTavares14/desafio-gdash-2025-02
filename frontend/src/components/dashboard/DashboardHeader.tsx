import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CloudRain, LogOut } from 'lucide-react'

export function DashboardHeader() {
  const navigate = useNavigate()

  function logout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CloudRain className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-800">GDASH Monitor</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/users')}>
            Comunidade
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
          >
            Meu Perfil
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-slate-600 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
