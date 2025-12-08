import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
import { CloudSun, Loader2, ArrowLeft } from 'lucide-react'

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post('/users', { name, email, password })
      alert('Conta criada com sucesso! Faça login.')
      navigate('/')
    } catch (error) {
      alert('Erro ao criar conta. Tente outro email.')
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
            Criar Conta
          </CardTitle>
          <CardDescription className="text-slate-400">
            Preencha os dados abaixo para acessar o GDASH
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-200">
                Nome Completo
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-slate-600 bg-slate-900/50 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500"
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-600 bg-slate-900/50 text-slate-100 focus-visible:ring-blue-500"
                placeholder="Ex: joao@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-600 bg-slate-900/50 text-slate-100 focus-visible:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                'Cadastrar'
              )}
            </Button>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-blue-400 hover:underline font-medium"
              >
                <ArrowLeft className="h-3 w-3" /> Voltar para o Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
