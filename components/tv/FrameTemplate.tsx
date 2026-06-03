"use client";

import Image from "next/image";
import type { FrameTemplate } from "@/types";

interface FrameTemplateProps {
  imageUrl: string;
  frame: FrameTemplate;
  objectPosition?: string;
  className?: string;
}

// ─── Frame: Nenhum (imagem pura) ─────────────────────────────────────────────
function FrameNone({ imageUrl, objectPosition = "center center" }: { imageUrl: string; objectPosition?: string }) {
  return (
    <div className="relative w-full h-full">
      <Image src={imageUrl} alt="Campanha" fill className="object-cover" style={{ objectPosition }} sizes="100vw" />
    </div>
  );
}

// ─── Frame: AstroCopa (bandas verde + logo) ───────────────────────────────────
function FrameAstrocopa({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: "#014b3d" }}>
      {/* Barra topo */}
      <div
        className="flex items-center px-6 shrink-0"
        style={{ height: "10%", background: "linear-gradient(90deg, #0dff51, #43c4c8)" }}
      >
        <Image src="/logo.png" alt="AstroCopa" width={80} height={40} className="object-contain brightness-0" />
      </div>

      {/* Imagem central */}
      <div className="relative flex-1">
        <Image src={imageUrl} alt="Campanha" fill className="object-cover object-center" sizes="100vw" />
      </div>

      {/* Barra rodapé */}
      <div
        className="flex items-center justify-between px-6 shrink-0"
        style={{ height: "10%", background: "linear-gradient(90deg, #43c4c8, #0dff51)" }}
      >
        <span className="font-sora font-extrabold text-sm uppercase tracking-widest" style={{ color: "#014b3d" }}>
          AstroCopa 2026
        </span>
        <span className="font-sora font-semibold text-xs uppercase tracking-widest" style={{ color: "#014b3d", opacity: 0.7 }}>
          Grupo Nova
        </span>
      </div>
    </div>
  );
}

// ─── Frame: Campanha (borda brilhante + badge) ────────────────────────────────
function FrameCampanha({ imageUrl }: { imageUrl: string }) {
  return (
    <div
      className="relative w-full h-full"
      style={{ padding: "12px", background: "linear-gradient(135deg, #0dff51, #43c4c8, #ffdf02)" }}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <Image src={imageUrl} alt="Campanha" fill className="object-cover object-center" sizes="100vw" />

        {/* Overlay gradiente inferior */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "35%", background: "linear-gradient(to top, rgba(1,75,61,0.92), transparent)" }}
        />

        {/* Logo + texto no rodapé */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6">
          <div>
            <p className="font-sora font-extrabold text-white text-lg uppercase tracking-wider leading-tight">
              AstroCopa
            </p>
            <p className="font-sora font-medium text-white/70 text-xs uppercase tracking-widest">
              Grupo Nova 2026
            </p>
          </div>
          <div
            className="px-3 py-1.5 rounded-full"
            style={{ background: "#ffdf02" }}
          >
            <span className="font-sora font-bold text-xs" style={{ color: "#014b3d" }}>
              #AstroCopa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Frame: Destaque (barra amarela inferior com texto) ───────────────────────
function FrameDestaque({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: "#ffdf02" }}>
      {/* Imagem */}
      <div className="relative flex-1">
        <Image src={imageUrl} alt="Campanha" fill className="object-cover object-center" sizes="100vw" />
      </div>

      {/* Barra amarela inferior */}
      <div
        className="flex items-center justify-between px-8 shrink-0"
        style={{ height: "14%", background: "#ffdf02" }}
      >
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="AstroCopa" width={70} height={35} className="object-contain" />
        </div>
        <div className="text-right">
          <p className="font-sora font-extrabold text-sm uppercase tracking-widest" style={{ color: "#014b3d" }}>
            Campanha 2026
          </p>
          <p className="font-sora font-medium text-xs uppercase tracking-widest" style={{ color: "#014b3d", opacity: 0.6 }}>
            Grupo Nova
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Frame: Clean (bordas arredondadas simples) ───────────────────────────────
function FrameClean({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative w-full h-full" style={{ padding: "16px", background: "white" }}>
      <div className="relative w-full h-full overflow-hidden rounded-3xl">
        <Image src={imageUrl} alt="Campanha" fill className="object-cover object-center" sizes="100vw" />
        {/* Watermark */}
        <div className="absolute top-4 right-4">
          <Image src="/logo.png" alt="AstroCopa" width={60} height={30} className="object-contain opacity-80" />
        </div>
      </div>
    </div>
  );
}

// ─── Exportação principal ─────────────────────────────────────────────────────
export function FrameTemplateView({ imageUrl, frame, objectPosition = "center center", className = "" }: FrameTemplateProps) {
  const frames: Record<FrameTemplate, React.ReactNode> = {
    none:      <FrameNone      imageUrl={imageUrl} objectPosition={objectPosition} />,
    astrocopa: <FrameAstrocopa imageUrl={imageUrl} />,
    campanha:  <FrameCampanha  imageUrl={imageUrl} />,
    destaque:  <FrameDestaque  imageUrl={imageUrl} />,
    clean:     <FrameClean     imageUrl={imageUrl} />,
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {frames[frame] ?? frames.none}
    </div>
  );
}

// ─── Labels dos frames (para o admin) ────────────────────────────────────────
export const FRAME_OPTIONS: { id: FrameTemplate; label: string; description: string }[] = [
  { id: "none",      label: "Sem moldura",    description: "Imagem pura, sem decoração" },
  { id: "astrocopa", label: "AstroCopa",      description: "Bandas verde + logo no topo e base" },
  { id: "campanha",  label: "Campanha",       description: "Borda gradiente + overlay com badge" },
  { id: "destaque",  label: "Destaque",       description: "Barra amarela com logo e nome" },
  { id: "clean",     label: "Clean",          description: "Fundo branco com bordas arredondadas" },
];
