"use client";

import Image from "next/image";
import { FRAME_OPTIONS, FrameTemplateView } from "@/components/tv/FrameTemplate";
import type { FrameTemplate } from "@/types";

interface FrameSelectorProps {
  selected: FrameTemplate;
  onChange: (frame: FrameTemplate) => void;
  previewUrl?: string;
}

export function FrameSelector({ selected, onChange, previewUrl }: FrameSelectorProps) {
  const demoUrl = previewUrl ?? "/campo.png";

  return (
    <div className="space-y-3">
      <label className="font-sora font-semibold text-xs uppercase tracking-widest" style={{ color: "#014b3d" }}>
        Moldura / Frame
      </label>

      <div className="grid grid-cols-5 gap-3">
        {FRAME_OPTIONS.map((opt) => {
          const active = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className="flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all duration-150"
              style={{
                borderColor: active ? "#0dff51" : "#014b3d15",
                background: active ? "#0dff5110" : "transparent",
              }}
            >
              {/* Minipreview do frame */}
              <div className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <FrameTemplateView
                  imageUrl={demoUrl}
                  frame={opt.id}
                  className="w-full h-full"
                />
              </div>

              <span
                className="font-sora font-semibold text-xs text-center leading-tight"
                style={{ color: "#014b3d", opacity: active ? 1 : 0.6 }}
              >
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Preview maior do frame selecionado */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{ aspectRatio: "16/9", borderColor: "#014b3d10" }}
      >
        <FrameTemplateView imageUrl={demoUrl} frame={selected} className="w-full h-full" />
      </div>
      <p className="font-sora text-xs" style={{ color: "#014b3d", opacity: 0.4 }}>
        {FRAME_OPTIONS.find((o) => o.id === selected)?.description}
      </p>
    </div>
  );
}
