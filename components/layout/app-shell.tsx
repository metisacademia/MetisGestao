'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface AppShellProps {
  perfil: 'ADMIN' | 'COORDENADOR' | 'MODERADOR';
  children: React.ReactNode;
}

export function AppShell({ perfil, children }: AppShellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block h-full">
        <Sidebar perfil={perfil} />
      </div>

      <div className="flex flex-1 flex-col bg-gray-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <header className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm md:hidden">
            <div className="flex items-center gap-3">
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Abrir menu de navegação">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <div>
                <p className="text-sm font-semibold text-gray-900">Menu</p>
                <p className="text-xs text-muted-foreground">Navegação principal</p>
              </div>
            </div>
          </header>

          <SheetContent side="left" className="w-72 p-0">
            <Sidebar perfil={perfil} onNavigate={() => setOpen(false)} className="h-full" />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8 space-y-4">{children}</div>
        </main>
      </div>
    </div>
  );
}
