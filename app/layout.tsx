import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstroCopa 2026 | Nova Promotora",
  description: "Campanha interna de engajamento — Nova Promotora",
  // Ícone: substituir por /public/favicon.ico da campanha
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased font-sora">{children}</body>
    </html>
  );
}
