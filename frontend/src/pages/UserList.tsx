import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
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
import { ArrowLeft, Users as UsersIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface User {
  id: string
  name: string
  email: string
}

export function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    api
      .get('/users')
      .then((res) => setUsers(res.data))
      .catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Comunidade</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-blue-600" />
              Usuários Cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-slate-500">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-400 font-mono">
                      {user.id.substring(0, 8)}...
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
