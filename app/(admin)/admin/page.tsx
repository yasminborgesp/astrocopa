"use client";

import Link from "next/link";
import { useCampaign } from "@/hooks/useCampaign";
import { useMedia } from "@/hooks/useMedia";
import { useCountdown } from "@/hooks/useCountdown";
import { Images, Settings, Tv, Clock, Calendar } from "lucide-react";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  href?: string;
}) {
  const content = (
    <div
      className="flex flex-col gap-3 p-6 rounded-2xl border transition-all duration-150 hover:shadow-md"
      style={{ background: "white", borderColor: "#014b3d10" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-sora font-semibold text-xs uppercase tracking-widest"
          style={{ color: "#014b3d", opacity: 0.5 }}
        >
          {label}
        </span>
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 36, height: 36, background: "#0dff5120" }}
        >
          <Icon size={18} style={{ color: "#014b3d" }} />
        </div>
      </div>
      <div>
        <p className="font-sora font-extrabold text-3xl" style={{ color: "#014b3d" }}>
          {value}
        </p>
        {sub && (
          <p className="font-sora text-xs mt-1" style={{ color: "#014b3d", opacity: 0.45 }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

export default function AdminDashboard() {
  const { campaign, loading } = useCampaign();
  const { media } = useMedia(campaign?.id);
  const { days, hours, minutes, seconds, isExpired } = useCountdown(campaign?.event_date ?? null);

  const activeCount = media.filter((m) => m.active).length;
  const totalCount  = media.length;

  const eventDateFormatted = campaign?.event_date
    ? new Date(campaign.event_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo",
      })
    : "—";

  const countdownText = isExpired
    ? "Evento ocorrido!"
    : `${days}d ${hours}h ${minutes}m ${seconds}s`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="font-sora font-semibold text-sm" style={{ color: "#014b3d", opacity: 0.5 }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-sora font-extrabold text-3xl" style={{ color: "#014b3d" }}>
          Dashboard
        </h1>
        <p className="font-sora text-sm mt-1" style={{ color: "#014b3d", opacity: 0.5 }}>
          {campaign?.title ?? "AstroCopa 2026"} · Visão geral da campanha
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Contagem"
          value={countdownText}
          sub={isExpired ? "—" : "até o evento"}
          icon={Clock}
        />
        <StatCard
          label="Data do Evento"
          value={eventDateFormatted}
          icon={Calendar}
          href="/admin/settings"
        />
        <StatCard
          label="Imagens Ativas"
          value={activeCount}
          sub={`de ${totalCount} total`}
          icon={Images}
          href="/admin/media"
        />
        <StatCard
          label="Intervalo Slide"
          value={`${campaign?.slide_interval_seconds ?? 10}s`}
          sub="troca automática"
          icon={Settings}
          href="/admin/settings"
        />
      </div>

      {/* Preview rápido da TV */}
      <div
        className="rounded-3xl overflow-hidden border"
        style={{ borderColor: "#014b3d10" }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between border-b"
          style={{ background: "white", borderColor: "#014b3d10" }}
        >
          <span className="font-sora font-bold text-sm" style={{ color: "#014b3d" }}>
            Preview da tela TV
          </span>
          <Link
            href="/tv"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-sora font-bold uppercase tracking-wider transition-all"
            style={{ background: "#0dff51", color: "#014b3d" }}
          >
            <Tv size={14} />
            Abrir TV
          </Link>
        </div>
        <div
          style={{
            aspectRatio: "16/5",
            background:
              "radial-gradient(ellipse at 5% 95%, rgba(255,223,2,0.45) 0%, transparent 35%), radial-gradient(ellipse at 92% 5%, rgba(13,255,81,0.5) 0%, transparent 40%), linear-gradient(135deg, #0dff51 0%, #43c4c8 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center px-12">
            <p
              className="font-sora font-extrabold uppercase tracking-widest"
              style={{ fontSize: "0.6rem", color: "#014b3d", opacity: 0.7 }}
            >
              FALTAM
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="font-sora font-extrabold"
                style={{ fontSize: "clamp(2rem, 5vw, 5rem)", color: "#014b3d", lineHeight: 1 }}
              >
                {days}
              </span>
              <span
                className="font-sora font-bold"
                style={{ fontSize: "clamp(0.8rem, 2vw, 2rem)", color: "#014b3d" }}
              >
                DIAS
              </span>
            </div>
            <div className="flex gap-3 mt-1 items-baseline">
              <span className="font-sora font-bold" style={{ fontSize: "clamp(0.6rem, 1.5vw, 1.5rem)", color: "#014b3d" }}>
                {String(hours).padStart(2,"0")}h
              </span>
              <span className="font-sora font-bold" style={{ fontSize: "clamp(0.6rem, 1.5vw, 1.5rem)", color: "#014b3d" }}>
                {String(minutes).padStart(2,"0")}m
              </span>
              <span className="font-sora font-bold" style={{ fontSize: "clamp(0.6rem, 1.5vw, 1.5rem)", color: "#014b3d" }}>
                {String(seconds).padStart(2,"0")}s
              </span>
            </div>
            <div
              className="inline-flex self-start mt-2 px-3 py-1 rounded-full"
              style={{ background: "#ffdf02" }}
            >
              <span className="font-sora font-bold" style={{ fontSize: "0.55rem", color: "#014b3d" }}>
                Contagem regressiva iniciada.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
