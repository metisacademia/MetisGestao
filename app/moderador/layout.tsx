import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';

export default async function ModeradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  if (!user || user.perfil !== 'MODERADOR') {
    redirect('/login');
  }

  return <AppShell perfil="MODERADOR">{children}</AppShell>;
}
