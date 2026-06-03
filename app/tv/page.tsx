"use client";

import Image from "next/image";
import { useCampaign } from "@/hooks/useCampaign";
import { useMedia } from "@/hooks/useMedia";
import { TVCountdown } from "@/components/tv/TVCountdown";
import { TVCarousel } from "@/components/tv/TVCarousel";
import { TVLogo } from "@/components/tv/TVLogo";
import { TVTextBlock } from "@/components/tv/TVTextBlock";

function TVBackground({ overlay = "left" }: { overlay?: "left" | "center" }) {
  const overlays = {
    left:   "linear-gradient(90deg, rgba(1,75,61,0.90) 0%, rgba(1,75,61,0.68) 45%, rgba(1,75,61,0.12) 100%)",
    center: "radial-gradient(ellipse at center, rgba(1,75,61,0.82) 0%, rgba(1,75,61,0.45) 65%, rgba(1,75,61,0.12) 100%)",
  };
  return (
    <>
      <Image src="/campo.png" alt="" fill className="object-cover object-center" priority />
      <div className="absolute inset-0 z-10" style={{ background: overlays[overlay] }} />
    </>
  );
}

export default function TVPage() {
  const { campaign, loading } = useCampaign();
  const { media } = useMedia(campaign?.id, true);

  const leftContent  = campaign?.left_content_type ?? "countdown";
  const showCarousel = campaign?.show_carousel      ?? true;
  const label        = campaign?.countdown_label     ?? "FALTAM";
  const title        = campaign?.title               ?? "AstroCopa 2026";
  const textSize     = campaign?.text_size           ?? "md";
  const hasImages    = media.filter((m) => m.active).length > 0;
  const hasCarousel  = showCarousel && hasImages;

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="tv-fullscreen relative overflow-hidden">
        <TVBackground overlay="center" />
        <div className="relative z-20 flex items-center justify-center w-full h-full">
          <span className="font-sora font-extrabold uppercase tracking-widest animate-pulse"
            style={{ fontSize: "clamp(2rem,4vw,5rem)", color: "#0dff51" }}>
            ASTROCOPA
          </span>
        </div>
      </div>
    );
  }

  // ─── MODO: Esquerdo OFF + Carrossel ON → carrossel tela cheia 16:9 ────────
  if (leftContent === "none" && hasCarousel) {
    return (
      <div className="tv-fullscreen relative overflow-hidden">
        <TVBackground overlay="center" />
        <div className="relative z-20 flex flex-col w-full h-full p-8">
          <TVLogo size="sm" />
          <div className="flex-1 flex items-center justify-center">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{ aspectRatio: "16/9", width: "min(90vw, calc(90vh * 16/9))" }}>
              <TVCarousel media={media} intervalSeconds={campaign?.slide_interval_seconds ?? 10} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MODO: Esquerdo OFF + Carrossel OFF → só background + logo ────────────
  if (leftContent === "none" && !hasCarousel) {
    return (
      <div className="tv-fullscreen relative overflow-hidden">
        <TVBackground overlay="center" />
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full gap-6">
          <TVLogo size="lg" />
          <p className="font-sora font-extrabold uppercase tracking-widest text-center"
            style={{ fontSize: "clamp(1.5rem,4vw,5rem)", color: "#0dff51" }}>
            {title}
          </p>
        </div>
      </div>
    );
  }

  // ─── Conteúdo esquerdo (countdown ou texto) ────────────────────────────────
  // centered = true quando não há carrossel à direita
  const isCentered = !hasCarousel;

  const LeftContent = () => {
    if (leftContent === "text") {
      return (
        <TVTextBlock
          title={campaign?.side_text_title ?? null}
          body={campaign?.side_text_body   ?? null}
          size={textSize}
          centered={isCentered}
        />
      );
    }
    return campaign ? (
      <TVCountdown targetDate={campaign.event_date} label={label} campaignTitle={title} />
    ) : null;
  };

  // ─── MODO: Esquerdo ON + Carrossel OFF → conteúdo centralizado ────────────
  if (!hasCarousel) {
    return (
      <div className="tv-fullscreen relative overflow-hidden">
        <TVBackground overlay="center" />
        <div className="absolute pointer-events-none z-10"
          style={{ bottom: "-10%", left: "-6%", width: "35vw", height: "35vw" }}>
          <div className="blob-yellow w-full h-full rounded-full opacity-25" />
        </div>
        <div className="relative z-20 flex flex-col w-full h-full px-[7%] py-[5%]">
          <TVLogo size="md" />
          <div className="flex-1 flex items-center justify-center">
            <LeftContent />
          </div>
        </div>
      </div>
    );
  }

  // ─── MODO padrão: split 50/50 ─────────────────────────────────────────────
  return (
    <div className="tv-fullscreen relative overflow-hidden">
      <TVBackground overlay="left" />
      <div className="absolute pointer-events-none z-10"
        style={{ bottom: "-8%", left: "-5%", width: "30vw", height: "30vw" }}>
        <div className="blob-yellow w-full h-full rounded-full opacity-30" />
      </div>

      <div className="relative z-20 flex w-full h-full">
        {/* Esquerda */}
        <div className="flex flex-col justify-between w-1/2 h-full px-[5%] py-[4%]">
          <TVLogo size="md" />
          <div className="flex-1 flex items-center">
            <LeftContent />
          </div>
        </div>

        {/* Direita: Carrossel */}
        <div className="w-1/2 h-full p-6">
          <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl">
            <TVCarousel media={media} intervalSeconds={campaign?.slide_interval_seconds ?? 10} />
          </div>
        </div>
      </div>
    </div>
  );
}
