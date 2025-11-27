'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserData {
  nome: string;
}

export default function AlunoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/aluno/meu-relatorio');
        if (response.ok) {
          const data = await response.json();
          setUserData({ nome: data.aluno.nome });
        } else if (response.status === 401) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f1e7] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-[#173b5a] animate-pulse" />
          <span className="text-[#173b5a] text-lg">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f1e7]">
      <header className="bg-[#173b5a] shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative bg-[#f8f1e7] rounded-lg flex items-center justify-center overflow-hidden">
                <Image 
                  src="/logo-metis-light.jpg" 
                  alt="Métis Logo" 
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[#f8f1e7]">Métis</h1>
                <p className="text-xs text-[#cda465]">Academia da Mente</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {userData && (
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-[#f8f1e7]">
                    Olá, {userData.nome.split(' ')[0]}!
                  </p>
                  <p className="text-xs text-[#cda465]">Área do Aluno</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-[#f8f1e7] hover:bg-[#2a5580] hover:text-[#f8f1e7]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-[#173b5a] mt-8 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-[#cda465]" suppressHydrationWarning>
            © {new Date().getFullYear()} Métis – Academia da Mente
          </p>
        </div>
      </footer>
    </div>
  );
}
