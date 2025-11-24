import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Métis - Academia da Mente",
  description: "Sistema de Gestão de Avaliações Cognitivas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
