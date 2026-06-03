"use client";

import type { TextSize } from "@/types";

interface TVTextBlockProps {
  title: string | null;
  body: string | null;
  size?: TextSize;
  centered?: boolean;
}

const titleSizes: Record<TextSize, string> = {
  sm: "clamp(1.2rem, 2.5vw, 3rem)",
  md: "clamp(2rem,   4vw,  5rem)",
  lg: "6vw",
};

const bodySizes: Record<TextSize, string> = {
  sm: "clamp(0.75rem, 1.2vw, 1.4rem)",
  md: "clamp(1rem,    1.8vw, 2.2rem)",
  lg: "2vw",
};

export function TVTextBlock({ title, body, size = "md", centered = false }: TVTextBlockProps) {
  if (!title && !body) return null;

  return (
    <div
      className={`w-full h-full flex flex-col justify-center px-[6%] py-[5%] ${
        centered ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {title && (
        <p
          className="font-sora font-extrabold tracking-wide leading-tight"
          style={{
            fontSize: titleSizes[size],
            color: "#0dff51",
            textShadow: "0 0 40px rgba(13,255,81,0.35)",
          }}
        >
          {title}
        </p>
      )}

      {body && (
        <p
          className="font-sora font-semibold mt-4 leading-relaxed"
          style={{
            fontSize: bodySizes[size],
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {body}
        </p>
      )}

      <div
        className="mt-6 rounded-full"
        style={{ width: "clamp(40px, 5vw, 70px)", height: "3px", background: "#ffdf02" }}
      />
    </div>
  );
}
