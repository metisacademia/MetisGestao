'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface AlunoSemConta {
  id: string;
  nome: string;
  turma: {
    nome_turma: string;
  };
}

export default function NovoUsuarioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [perfil, setPerfil] = useState<string>('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [alunoId, setAlunoId] = useState<string>('');
  const [alunosSemConta, setAlunosSemConta] = useState<AlunoSemConta[]>([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (perfil === 'ALUNO') {
      setLoadingAlunos(true);
      fetch('/api/admin/usuarios/alunos-sem-conta')
        .then(res => res.json())
        .then(data => {
          setAlunosSemConta(data);
          setLoadingAlunos(false);
        })
        .catch(() => setLoadingAlunos(false));
    }
  }, [perfil]);

  useEffect(() => {
    // Auto-fill only the name when an aluno is selected (for convenience)
    if (perfil === 'ALUNO' && alunoId) {
      const alunoSelecionado = alunosSemConta.find(a => a.id === alunoId);
      if (alunoSelecionado) {
        setNome(alunoSelecionado.nome);
        // Do NOT auto-fill email - user must enter it manually to avoid duplicates
      }
    }
  }, [alunoId, alunosSemConta, perfil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (perfil === 'ALUNO' && !alunoId) {
      setError('Selecione um aluno para vincular ao usuário');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senha,
          perfil,
          alunoId: perfil === 'ALUNO' ? alunoId : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      router.push('/admin/usuarios');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/usuarios">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Novo Usuário</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre um novo usuário no sistema
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dados do Usuário</CardTitle>
          <CardDescription>
            Preencha os dados do novo usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="perfil">Tipo de Usuário *</Label>
              <Select value={perfil} onValueChange={(value) => {
                setPerfil(value);
                setNome('');
                setEmail('');
                setAlunoId('');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COORDENADOR">Coordenador</SelectItem>
                  <SelectItem value="MODERADOR">Moderador</SelectItem>
                  <SelectItem value="ALUNO">Aluno</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {perfil === 'COORDENADOR' && 'Acesso total ao sistema, exceto gestão de usuários'}
                {perfil === 'MODERADOR' && 'Gerencia turmas, alunos e avaliações'}
                {perfil === 'ALUNO' && 'Acesso ao próprio relatório de evolução'}
              </p>
            </div>

            {perfil === 'ALUNO' && (
              <div className="space-y-2">
                <Label htmlFor="aluno">Vincular ao Aluno *</Label>
                {loadingAlunos ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Carregando alunos...
                  </div>
                ) : alunosSemConta.length === 0 ? (
                  <p className="text-sm text-amber-600">
                    Não há alunos cadastrados sem conta. Cadastre alunos primeiro em Turmas &gt; Alunos.
                  </p>
                ) : (
                  <Select value={alunoId} onValueChange={setAlunoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {alunosSemConta.map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id}>
                          {aluno.nome} - {aluno.turma.nome_turma}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-sm text-muted-foreground">
                  O aluno precisa estar cadastrado previamente para criar um acesso
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do usuário"
                required
                disabled={perfil === 'ALUNO' && !!alunoId}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email de Acesso *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={perfil === 'ALUNO' ? 'primeironome@metis' : 'usuario@metis'}
                required
              />
              <p className="text-sm text-muted-foreground">
                {perfil === 'ALUNO'
                  ? 'Digite um email único para este aluno (ex: joao@metis)'
                  : 'Digite o email de acesso (ex: coordenador@metis)'
                }
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha">Senha *</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
              <p className="text-sm text-muted-foreground">
                Essa senha será usada para o primeiro acesso. O usuário poderá alterá-la depois.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading || (perfil === 'ALUNO' && !alunoId)}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Criar Usuário
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/usuarios">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
