"use client";

import { useCampaign } from "@/hooks/useCampaign";
import { useMedia } from "@/hooks/useMedia";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MediaGrid } from "@/components/admin/MediaGrid";
import { Images } from "lucide-react";

export default function MediaPage() {
  const { campaign, loading: campaignLoading } = useCampaign();
  const { media, loading: mediaLoading, refetch } = useMedia(campaign?.id);

  if (campaignLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-sora text-sm" style={{ color: "#014b3d", opacity: 0.5 }}>Carregando...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-sora text-sm" style={{ color: "#014b3d", opacity: 0.5 }}>
          Nenhuma campanha ativa encontrada.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 44, height: 44, background: "#0dff51" }}
        >
          <Images size={22} style={{ color: "#014b3d" }} />
        </div>
        <div>
          <h1 className="font-sora font-extrabold text-2xl" style={{ color: "#014b3d" }}>
            Gerenciar Mídias
          </h1>
          <p className="font-sora text-sm" style={{ color: "#014b3d", opacity: 0.5 }}>
            {media.length} imagem(ns) · {media.filter((m) => m.active).length} ativa(s)
          </p>
        </div>
      </div>

      {/* Upload */}
      <section
        className="p-6 rounded-2xl border"
        style={{ background: "white", borderColor: "#014b3d10" }}
      >
        <h2 className="font-sora font-bold text-sm uppercase tracking-widest mb-4" style={{ color: "#014b3d" }}>
          Upload de Imagens
        </h2>
        <ImageUpload campaignId={campaign.id} onSuccess={refetch} />
      </section>

      {/* Grid */}
      <section
        className="p-6 rounded-2xl border"
        style={{ background: "white", borderColor: "#014b3d10" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sora font-bold text-sm uppercase tracking-widest" style={{ color: "#014b3d" }}>
            Imagens da Campanha
          </h2>
          <p className="font-sora text-xs" style={{ color: "#014b3d", opacity: 0.4 }}>
            Arraste para reordenar
          </p>
        </div>
        {mediaLoading ? (
          <p className="font-sora text-sm text-center py-8" style={{ color: "#014b3d", opacity: 0.4 }}>
            Carregando imagens...
          </p>
        ) : (
          <MediaGrid media={media} onUpdate={refetch} />
        )}
      </section>
    </div>
  );
}
