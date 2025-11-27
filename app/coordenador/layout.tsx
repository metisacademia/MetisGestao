import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';

export default async function CoordenadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  if (!user || user.perfil !== 'COORDENADOR') {
    redirect('/login');
  }

  return <AppShell perfil="COORDENADOR">{children}</AppShell>;
}
