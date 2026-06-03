"use client";

import { useState, useEffect } from "react";
import { useCampaign } from "@/hooks/useCampaign";
import { updateCampaign } from "@/services/campaigns";
import { Settings, Loader2, Check } from "lucide-react";
import type { LeftContentType, TextSize } from "@/types";

function Toggle({ label, description, checked, onChange }: {
  label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "#014b3d10" }}>
      <div>
        <p className="font-sora font-semibold text-sm" style={{ color: "#014b3d" }}>{label}</p>
        <p className="font-sora text-xs mt-0.5" style={{ color: "#014b3d", opacity: 0.45 }}>{description}</p>
      </div>
      <button type="button" onClick={() => onChange(!checked)}
        className="relative shrink-0 rounded-full transition-all duration-200"
        style={{ width: 48, height: 26, background: checked ? "#0dff51" : "#014b3d20" }}>
        <span className="absolute top-1 rounded-full transition-all duration-200"
          style={{ width: 18, height: 18, background: "white", left: checked ? "26px" : "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { campaign, loading, refetch } = useCampaign();

  const [title,           setTitle]           = useState("");
  const [eventDate,       setEventDate]        = useState("");
  const [interval,        setInterval]         = useState(10);
  const [showCarousel,    setShowCarousel]     = useState(true);
  const [countdownLabel,  setCountdownLabel]   = useState("FALTAM");
  const [leftContent,     setLeftContent]      = useState<LeftContentType>("countdown");
  const [textSize,        setTextSize]         = useState<TextSize>("md");
  const [sideTextTitle,   setSideTextTitle]    = useState("");
  const [sideTextBody,    setSideTextBody]     = useState("");
  const [saving,          setSaving]           = useState(false);
  const [saved,           setSaved]            = useState(false);
  const [error,           setError]            = useState<string | null>(null);

  useEffect(() => {
    if (!campaign) return;
    setTitle(campaign.title);
    const dt = new Date(campaign.event_date);
    const p  = (n: number) => String(n).padStart(2, "0");
    setEventDate(`${dt.getFullYear()}-${p(dt.getMonth()+1)}-${p(dt.getDate())}T${p(dt.getHours())}:${p(dt.getMinutes())}`);
    setInterval(campaign.slide_interval_seconds);
    setShowCarousel(campaign.show_carousel   ?? true);
    setCountdownLabel(campaign.countdown_label ?? "FALTAM");
    setLeftContent((campaign.left_content_type as LeftContentType) ?? "countdown");
    setTextSize((campaign.text_size as TextSize) ?? "md");
    setSideTextTitle(campaign.side_text_title ?? "");
    setSideTextBody(campaign.side_text_body   ?? "");
  }, [campaign]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!campaign) return;
    setSaving(true); setError(null);

    const result = await updateCampaign(campaign.id, {
      title,
      event_date:            new Date(eventDate).toISOString(),
      slide_interval_seconds: interval,
      show_carousel:          showCarousel,
      countdown_label:        countdownLabel,
      left_content_type:      leftContent,
      text_size:              textSize,
      side_text_title:        sideTextTitle || null,
      side_text_body:         sideTextBody  || null,
    });

    setSaving(false);
    if (result.success) { setSaved(true); refetch(); setTimeout(() => setSaved(false), 3000); }
    else setError(result.error ?? "Erro ao salvar.");
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="font-sora text-sm" style={{ color: "#014b3d", opacity: 0.5 }}>Carregando...</p>
    </div>
  );

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-xl" style={{ width: 44, height: 44, background: "#0dff51" }}>
          <Settings size={22} style={{ color: "#014b3d" }} />
        </div>
        <div>
          <h1 className="font-sora font-extrabold text-2xl" style={{ color: "#014b3d" }}>Configurações</h1>
          <p className="font-sora text-sm" style={{ color: "#014b3d", opacity: 0.5 }}>Controle total da tela da TV</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">

        {/* ── LADO ESQUERDO ─────────────────────────────────────────── */}
        <section className="p-6 rounded-2xl border space-y-4" style={{ background: "white", borderColor: "#014b3d10" }}>
          <h2 className="font-sora font-bold text-xs uppercase tracking-widest" style={{ color: "#014b3d" }}>
            Lado Esquerdo da TV
          </h2>

          {/* Seletor: countdown vs texto */}
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: "countdown", label: "Contagem regressiva", desc: "Exibe o timer até o evento" },
              { id: "text",      label: "Texto personalizado",  desc: "Você define o conteúdo" },
              { id: "none",      label: "Desativar",            desc: "Carrossel ocupa tela cheia" },
            ] as const).map((opt) => (
              <button key={opt.id} type="button" onClick={() => setLeftContent(opt.id)}
                className="p-4 rounded-xl border-2 text-left transition-all"
                style={{ borderColor: leftContent === opt.id ? "#0dff51" : "#014b3d15", background: leftContent === opt.id ? "#0dff5110" : "transparent" }}>
                <p className="font-sora font-bold text-sm" style={{ color: "#014b3d" }}>{opt.label}</p>
                <p className="font-sora text-xs mt-1" style={{ color: "#014b3d", opacity: 0.45 }}>{opt.desc}</p>
              </button>
            ))}
          </div>

          {/* Countdown: campos específicos */}
          {leftContent === "countdown" && (
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label className="font-sora font-semibold text-xs uppercase tracking-widest" style={{ color: "#014b3d" }}>
                  Texto da contagem
                </label>
                <input type="text" value={countdownLabel}
                  onChange={(e) => setCountdownLabel(e.target.value)}
                  placeholder="FALTAM" maxLength={30}
                  className="w-full px-4 py-3 rounded-xl border font-sora font-bold text-sm outline-none"
                  style={{ borderColor: "#014b3d20", color: "#014b3d", background: "#f8f9fa" }} />
                <p className="font-sora text-xs" style={{ color: "#014b3d", opacity: 0.4 }}>
                  Aparece acima do número. Ex: "FALTAM", "DIAS PARA", "ATÉ A COPA"
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="font-sora font-semibold text-xs uppercase tracking-widest" style={{ color: "#014b3d" }}>
                  Data do Evento
                </label>
                <input type="datetime-local" required value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border font-sora text-sm outline-none"
                  style={{ borderColor: "#014b3d20", color: "#014b3d", background: "#f8f9fa" }} />
              </div>
            </div>
          )}

          {/* Texto personalizado: campos + tamanho */}
          {leftContent === "text" && (
            <div className="space-y-4 pt-1">
              {/* Tamanho */}
              <div className="space-y-2">
                <label className="font-sora font-semibold text-xs uppercase tracking-widest" style={{ color: "#014b3d" }}>
                  Tamanho do texto
                </label>
                <div className="flex gap-2">
                  {([
                    { id: "sm", label: "Pequeno", example: "Aa" },
                    { id: "md", label: "Médio",   example: "Aa" },
                    { id: "lg", label: "Grande",  example: "Aa" },
                  ] as const).map((opt) => (
                    <button key={opt.id} type="button" onClick={() => setTextSize(opt.id)}
                      className="flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all"
                      style={{ borderColor: textSize === opt.id ? "#0dff51" : "#014b3d15", background: textSize === opt.id ? "#0dff5110" : "transparent" }}>
                      <span className="font-sora font-extrabold" style={{
                        color: "#014b3d",
                        fontSize: opt.id === "sm" ? "1rem" : opt.id === "md" ? "1.5rem" : "2.2rem",
                      }}>
                        {opt.example}
                      </span>
                      <span className="font-sora font-semibold text-xs" style={{ color: "#014b3d", opacity: 0.6 }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Título */}
              <div className="space-y-1.5">
                <label className="font-sora font-semibold text-xs uppercase tracking-widest" style={{ color: "#014b3d" }}>
                  Título principal
                </label>
                <input type="text" value={sideTextTitle}
                  onChange={(e) => setSideTextTitle(e.target.value)}
                  placeholder="Ex: DESTAQUE DA SEMANA"
                  className="w-full px-4 py-3 rounded-xl border font-sora font-bold text-sm outline-none"
                  style={{ borderColor: "#014b3d20", color: "#014b3d", background: "#f8f9fa" }} />
              </div>

              {/* Corpo */}
              <div className="space-y-1.5">
                <label className="font-sora font-semibold text-xs uppercase tracking-widest" style={{ color: "#014b3d" }}>
                  Texto secundário
                </label>
                <textarea value={sideTextBody}
                  onChange={(e) => setSideTextBody(e.target.value)}
                  placeholder="Ex: Bons lances merecem replay"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border font-sora text-sm outline-none resize-none"
                  style={{ borderColor: "#014b3d20", color: "#014b3d", background: "#f8f9fa" }} />
              </div>
            </div>
          )}
        </section>

        {/* ── LADO DIREITO ──────────────────────────────────────────── */}
        <section className="p-6 rounded-2xl border" style={{ background: "white", borderColor: "#014b3d10" }}>
          <h2 className="font-sora font-bold text-xs uppercase tracking-widest mb-3" style={{ color: "#014b3d" }}>
            Lado Direito da TV
          </h2>
          <Toggle
            label="Carrossel de imagens"
            description={showCarousel ? "Fotos enviadas passando em loop" : "Desligado — countdown/texto ocupa a tela inteira"}
            checked={showCarousel}
            onChange={setShowCarousel}
          />
          {showCarousel && (
            <div className="flex items-center gap-4 mt-4">
              <span className="font-sora font-semibold text-xs uppercase tracking-widest shrink-0" style={{ color: "#014b3d" }}>
                Intervalo
              </span>
              <input type="range" min={3} max={60} step={1} value={interval}
                onChange={(e) => setInterval(Number(e.target.value))} className="flex-1 accent-green-500" />
              <span className="font-sora font-bold text-sm w-10 text-right" style={{ color: "#014b3d" }}>{interval}s</span>
            </div>
          )}
        </section>

        {/* ── CAMPANHA ─────────────────────────────────────────────── */}
        <section className="p-6 rounded-2xl border space-y-4" style={{ background: "white", borderColor: "#014b3d10" }}>
          <h2 className="font-sora font-bold text-xs uppercase tracking-widest" style={{ color: "#014b3d" }}>Campanha</h2>
          <div className="space-y-1.5">
            <label className="font-sora font-semibold text-xs uppercase tracking-widest" style={{ color: "#014b3d" }}>
              Nome (aparece no badge amarelo)
            </label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="AstroCopa 2026"
              className="w-full px-4 py-3 rounded-xl border font-sora text-sm outline-none"
              style={{ borderColor: "#014b3d20", color: "#014b3d", background: "#f8f9fa" }} />
          </div>
        </section>

        {/* Preview do modo */}
        <div className="px-4 py-3 rounded-xl text-xs font-sora font-semibold"
          style={{ background: "#0dff5115", color: "#014b3d" }}>
          Modo TV:{" "}
          {leftContent === "countdown" && showCarousel  && "Split — Contagem (esq) + Carrossel (dir)"}
          {leftContent === "countdown" && !showCarousel && "Contagem centralizada (tela cheia)"}
          {leftContent === "text"      && showCarousel  && "Split — Texto (esq) + Carrossel (dir)"}
          {leftContent === "text"      && !showCarousel && "Texto centralizado (tela cheia)"}
          {leftContent === "none"      && showCarousel  && "Carrossel em tela cheia 16:9"}
          {leftContent === "none"      && !showCarousel && "Somente background + logo"}
        </div>

        {error && <p className="font-sora text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={saving}
          className="w-full py-3.5 rounded-xl font-sora font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: saved ? "#014b3d" : "#0dff51", color: saved ? "#0dff51" : "#014b3d" }}>
          {saving ? <><Loader2 size={18} className="animate-spin" /> Salvando...</> :
           saved  ? <><Check size={18} /> Salvo! TV atualizada.</> :
                    "Salvar Configurações"}
        </button>
      </form>
    </div>
  );
}
