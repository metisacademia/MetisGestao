'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Lock, Check } from 'lucide-react';

interface UserInfo {
  nome: string;
  email: string;
  perfil: string;
  criado_em: string;
}

export default function PaginaMeuPerfil() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUserInfo(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAlterarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);

    if (novaSenha !== confirmarSenha) {
      setMensagem({ tipo: 'erro', texto: 'As senhas não coincidem' });
      return;
    }

    if (novaSenha.length < 6) {
      setMensagem({ tipo: 'erro', texto: 'A nova senha deve ter no mínimo 6 caracteres' });
      return;
    }

    setAlterandoSenha(true);

    try {
      const response = await fetch('/api/auth/alterar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar senha');
      }

      setMensagem({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err instanceof Error ? err.message : 'Erro ao alterar senha' });
    } finally {
      setAlterandoSenha(false);
    }
  };

  const perfilLabel: Record<string, string> = {
    ADMIN: 'Administrador',
    COORDENADOR: 'Coordenador',
    MODERADOR: 'Moderador',
    ALUNO: 'Aluno',
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
      <div>
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Visualize suas informações e altere sua senha
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Seus dados cadastrados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">Nome</Label>
              <p className="font-medium">{userInfo?.nome}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Email de Acesso</Label>
              <p className="font-medium">{userInfo?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Tipo de Conta</Label>
              <p className="font-medium">{perfilLabel[userInfo?.perfil || ''] || userInfo?.perfil}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Membro desde</Label>
              <p className="font-medium">
                {userInfo?.criado_em ? new Date(userInfo.criado_em).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                }) : '-'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Alterar Senha
            </CardTitle>
            <CardDescription>
              Atualize sua senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAlterarSenha} className="space-y-4">
              {mensagem && (
                <div className={`px-4 py-3 rounded flex items-center gap-2 ${
                  mensagem.tipo === 'sucesso' 
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                  {mensagem.tipo === 'sucesso' && <Check className="w-4 h-4" />}
                  {mensagem.texto}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="senhaAtual">Senha Atual</Label>
                <Input
                  id="senhaAtual"
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Digite sua senha atual"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <Input
                  id="novaSenha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  required
                />
              </div>

              <Button type="submit" disabled={alterandoSenha} className="w-full">
                {alterandoSenha && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Alterar Senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
