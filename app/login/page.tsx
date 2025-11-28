'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface LoginPageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function LoginPage(props: LoginPageProps) {
  const searchParams = props?.searchParams || {};
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: login, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login');
        setLoading(false);
        return;
      }

      if (data.token) {
        localStorage.setItem('auth-token', data.token);
      }

      await router.push(data.redirectTo);
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#173b5a] p-4">
      <Card className="w-full max-w-md bg-[#f8f1e7] border-none shadow-2xl">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="flex justify-center">
            <div className="w-24 h-24 relative">
              <Image 
                src="/logo-metis-light.jpg" 
                alt="Métis Logo" 
                width={96}
                height={96}
                className="rounded-xl object-contain"
              />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-[#173b5a]">
              Métis
            </CardTitle>
            <CardDescription className="text-[#cda465] font-medium text-lg">
              Academia da Mente
            </CardDescription>
          </div>
          <p className="text-sm text-[#173b5a]/70">
            Sistema de Gestão de Avaliações Cognitivas
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login" className="text-[#173b5a]">Login</Label>
              <Input
                id="login"
                type="text"
                placeholder="seu-login@metis"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                disabled={loading}
                className="border-[#cda465]/30 focus:border-[#cda465] focus:ring-[#cda465]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-[#173b5a]">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={loading}
                className="border-[#cda465]/30 focus:border-[#cda465] focus:ring-[#cda465]"
              />
            </div>
            {error && (
              <div className="text-sm text-red-700 bg-red-100 p-3 rounded-md">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-[#173b5a] hover:bg-[#0b0b28] text-[#f8f1e7]" 
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-6 pt-4 border-t border-[#cda465]/20 text-xs text-center text-[#173b5a]/60">
            <p>Sistema de Gestão Métis</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
