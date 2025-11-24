import { getUserFromToken } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { redirect } from 'next/navigation';

export default async function ModeradorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  if (!user || user.perfil !== 'MODERADOR') {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar perfil="MODERADOR" />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
