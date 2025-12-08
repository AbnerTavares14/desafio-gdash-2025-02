import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { getCurrentUserId } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Loader2, Save, Trash2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const userId = getCurrentUserId()

  useEffect(() => {
    if (userId) loadProfile()
  }, [userId])

  async function loadProfile() {
    try {
      setIsLoading(true)
      const response = await api.get(`/users/${userId}`)
      setFormData({
        ...formData,
        name: response.data.name,
        email: response.data.email,
      })
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar perfil.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    try {
      await api.put(`/users/`, formData)
      alert('Perfil atualizado com sucesso!')
      setFormData((prev) => ({ ...prev, password: '' }))
    } catch (error) {
      console.error(error)
      alert('Erro ao atualizar. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteAccount() {
    try {
      await api.delete(`/users/`)
      localStorage.removeItem('token')
      alert('Sua conta foi excluída.')
      navigate('/')
    } catch (error) {
      console.error(error)
      alert('Erro ao excluir conta.')
    }
  }

  if (!userId)
    return (
      <div className="p-8">
        Erro: Usuário não identificado. Faça login novamente.
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Meu Perfil</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Atualize seus dados de cadastro.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            ) : (
              <form
                id="profile-form"
                onSubmit={handleUpdate}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button
              type="submit"
              form="profile-form"
              disabled={isSaving || isLoading}
              className="bg-blue-600"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Salvar Alterações
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Zona de Perigo</CardTitle>
            <CardDescription className="text-red-600/80">
              A exclusão da conta é permanente e não pode ser desfeita.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Excluir Minha Conta
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação excluirá permanentemente sua conta e todos os seus
                    dados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sim, excluir conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
