import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CloudSun, Loader2 } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', response.data.access_token)
      navigate('/dashboard')
    } catch (error) {
      console.log(error)
      alert('Erro ao fazer login. Verifique as credenciais.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 text-slate-100 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-600/20 p-3">
              <CloudSun className="h-10 w-10 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            GDASH Weather
          </CardTitle>
          <CardDescription className="text-slate-400">
            Entre com suas credenciais para acessar o monitoramento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@gdash.com"
                className="border-slate-600 bg-slate-900/50 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                className="border-slate-600 bg-slate-900/50 text-slate-100 focus-visible:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                </>
              ) : (
                'Acessar Dashboard'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link
              to="/register"
              className="text-blue-400 hover:underline font-medium"
            >
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
