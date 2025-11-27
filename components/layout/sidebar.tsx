'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Users, 
  GraduationCap, 
  UserCircle, 
  Brain, 
  FileText, 
  BarChart3, 
  LogOut,
  Home,
  ClipboardCheck,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  perfil: 'ADMIN' | 'MODERADOR';
}

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/dashboard', label: 'Acompanhamento', icon: LayoutDashboard },
  { href: '/admin/usuarios', label: 'Usuários', icon: Users },
  { href: '/admin/turmas', label: 'Turmas', icon: GraduationCap },
  { href: '/admin/alunos', label: 'Alunos', icon: UserCircle },
  { href: '/admin/dominios', label: 'Domínios Cognitivos', icon: Brain },
  { href: '/admin/templates', label: 'Templates de Avaliação', icon: FileText },
  { href: '/admin/avaliacoes', label: 'Avaliações', icon: ClipboardCheck },
  { href: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
];

const moderadorLinks = [
  { href: '/moderador', label: 'Minhas Turmas', icon: GraduationCap },
  { href: '/moderador/relatorios', label: 'Relatórios', icon: BarChart3 },
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
    <div className="w-64 bg-[#173b5a] flex flex-col h-screen">
      <div className="p-4 border-b border-[#2a5580]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 relative bg-[#f8f1e7] rounded-lg flex items-center justify-center overflow-hidden">
            <Image 
              src="/logo-metis-light.jpg" 
              alt="Métis Logo" 
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#f8f1e7]">Métis</h1>
            <p className="text-xs text-[#cda465]">Academia da Mente</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || 
            (link.href !== '/admin' && pathname?.startsWith(link.href + '/'));
          
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#cda465] text-[#173b5a]'
                    : 'text-[#f8f1e7] hover:bg-[#2a5580]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#2a5580]">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-[#f8f1e7] hover:bg-[#2a5580] hover:text-[#f8f1e7]"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Sair
        </Button>
      </div>
    </div>
  );
}
