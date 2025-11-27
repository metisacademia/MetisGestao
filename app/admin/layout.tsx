import { getUserFromToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  if (!user || user.perfil !== 'ADMIN') {
    redirect('/login');
  }

  return <AppShell perfil="ADMIN">{children}</AppShell>;
}
