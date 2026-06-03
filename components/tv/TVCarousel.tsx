"use client";

import { useState, useEffect, useRef } from "react";
import { FrameTemplateView } from "@/components/tv/FrameTemplate";
import type { Media } from "@/types";

interface TVCarouselProps {
  media: Media[];
  intervalSeconds?: number;
}

export function TVCarousel({ media, intervalSeconds = 10 }: TVCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeMedia = media.filter((m) => m.active);

  const goToNext = () => {
    if (activeMedia.length <= 1) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeMedia.length);
      setIsTransitioning(false);
    }, 600);
  };

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeMedia.length]);

  useEffect(() => {
    if (activeMedia.length <= 1) return;
    timerRef.current = setInterval(goToNext, intervalSeconds * 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMedia.length, intervalSeconds, currentIndex]);

  if (activeMedia.length === 0) return null;

  const current = activeMedia[currentIndex];

  return (
    <div className="relative w-full h-full">
      {/* Frame + imagem com transição fade */}
      <div
        className="absolute inset-0 transition-opacity duration-600"
        style={{ opacity: isTransitioning ? 0 : 1, transitionDuration: "600ms" }}
      >
        <FrameTemplateView
          imageUrl={current.image_url}
          frame={current.frame_template ?? "none"}
          objectPosition={current.object_position ?? "center center"}
          className="w-full h-full"
        />
      </div>

      {/* Indicadores */}
      {activeMedia.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {activeMedia.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? "24px" : "8px",
                height: "8px",
                background: i === currentIndex ? "#014b3d" : "rgba(1,75,61,0.3)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
