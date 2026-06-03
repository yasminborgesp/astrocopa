import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AstroCopa 2026 — Tela TV",
  description: "Contagem regressiva AstroCopa",
};

// Layout sem nada — fullscreen puro para TV
export default function TVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
