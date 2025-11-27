'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Plus, KeyRound, Loader2, Copy, Check } from 'lucide-react';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  criado_em: string;
  aluno?: {
    id: string;
    nome: string;
  } | null;
}

const perfilColors: Record<string, string> = {
  ADMIN: 'bg-blue-100 text-blue-800',
  COORDENADOR: 'bg-purple-100 text-purple-800',
  MODERADOR: 'bg-green-100 text-green-800',
  ALUNO: 'bg-amber-100 text-amber-800',
};

const perfilLabels: Record<string, string> = {
  ADMIN: 'Admin',
  COORDENADOR: 'Coordenador',
  MODERADOR: 'Moderador',
  ALUNO: 'Aluno',
};

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [resettingId, setResettingId] = useState<string | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/admin/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const openResetDialog = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setNewPassword(null);
    setCopied(false);
    setResetDialogOpen(true);
  };

  const handleResetSenha = async () => {
    if (!selectedUser) return;

    setResettingId(selectedUser.id);

    try {
      const response = await fetch(`/api/admin/usuarios/${selectedUser.id}/resetar-senha`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setNewPassword(data.novaSenha);
      } else {
        alert(data.error || 'Erro ao resetar senha');
        setResetDialogOpen(false);
      }
    } catch (error) {
      alert('Erro ao conectar com o servidor');
      setResetDialogOpen(false);
    } finally {
      setResettingId(null);
    }
  };

  const copyPassword = async () => {
    if (newPassword) {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie usuários do sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/usuarios/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Total: {usuarios.length} usuário(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell className="font-medium">
                    {usuario.nome}
                    {usuario.aluno && (
                      <span className="text-xs text-muted-foreground block">
                        Vinculado: {usuario.aluno.nome}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{usuario.email}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        perfilColors[usuario.perfil] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {perfilLabels[usuario.perfil] || usuario.perfil}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(usuario.criado_em).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openResetDialog(usuario)}
                      disabled={resettingId === usuario.id}
                    >
                      {resettingId === usuario.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <KeyRound className="w-4 h-4" />
                      )}
                      <span className="ml-2 hidden sm:inline">Resetar Senha</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {newPassword ? 'Nova Senha Gerada' : 'Resetar Senha'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {newPassword ? (
                <div className="space-y-4 mt-4">
                  <p>A nova senha para <strong>{selectedUser?.nome}</strong> foi gerada:</p>
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <code className="text-lg font-mono font-bold text-amber-800 flex-1">
                      {newPassword}
                    </code>
                    <Button variant="ghost" size="sm" onClick={copyPassword}>
                      {copied ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-red-600 font-medium">
                    Anote essa senha! Ela não será exibida novamente.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  <p>Você está prestes a gerar uma nova senha para:</p>
                  <p><strong>{selectedUser?.nome}</strong> ({selectedUser?.email})</p>
                  <p className="text-sm">A senha atual será substituída por uma nova senha aleatória.</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {newPassword ? (
              <Button onClick={() => setResetDialogOpen(false)}>
                Entendido
              </Button>
            ) : (
              <>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <Button 
                  onClick={handleResetSenha}
                  disabled={resettingId !== null}
                >
                  {resettingId ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    'Gerar Nova Senha'
                  )}
                </Button>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
