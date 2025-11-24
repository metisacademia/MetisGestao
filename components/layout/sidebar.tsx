'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Users, 
  GraduationCap, 
  UserCircle, 
  Brain, 
  FileText, 
  BarChart3, 
  LogOut,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  perfil: 'ADMIN' | 'MODERADOR';
}

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/turmas', label: 'Turmas', icon: GraduationCap },
  { href: '/admin/alunos', label: 'Alunos', icon: UserCircle },
  { href: '/admin/dominios', label: 'Domínios Cognitivos', icon: Brain },
  { href: '/admin/templates', label: 'Templates de Avaliação', icon: FileText },
  { href: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
];

const moderadorLinks = [
  { href: '/moderador', label: 'Minhas Turmas', icon: GraduationCap },
];

export function Sidebar({ perfil }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const links = perfil === 'ADMIN' ? adminLinks : moderadorLinks;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">Métis</h1>
        <p className="text-sm text-muted-foreground">Academia da Mente</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
          
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </div>
  );
}
