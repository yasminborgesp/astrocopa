"use client";

import { useCountdown } from "@/hooks/useCountdown";

interface TVCountdownProps {
  targetDate: string;
  label?: string;        // texto acima do número — padrão "FALTAM"
  campaignTitle?: string; // aparece no badge amarelo
}

function TimeBlock({ value, label, isLarge = false }: { value: number; label: string; isLarge?: boolean }) {
  const formatted = String(value).padStart(2, "0");

  if (isLarge) {
    return (
      <div className="flex items-baseline gap-4">
        <span
          className="font-sora font-extrabold leading-none"
          style={{ fontSize: "clamp(7rem, 18vw, 20rem)", color: "#0dff51", lineHeight: 0.85 }}
        >
          {formatted}
        </span>
        <span
          className="font-sora font-bold"
          style={{ fontSize: "clamp(2rem, 5vw, 6rem)", color: "#ffffff" }}
        >
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <span
        className="font-sora font-extrabold leading-none"
        style={{ fontSize: "clamp(2.5rem, 6vw, 7rem)", color: "#0dff51" }}
      >
        {formatted}
      </span>
      <span
        className="font-sora font-bold uppercase tracking-widest mt-1"
        style={{ fontSize: "clamp(0.6rem, 1.2vw, 1.4rem)", color: "rgba(255,255,255,0.7)" }}
      >
        {label}
      </span>
    </div>
  );
}

export function TVCountdown({ targetDate, label = "FALTAM", campaignTitle }: TVCountdownProps) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <p className="font-sora font-extrabold uppercase" style={{ fontSize: "clamp(2rem,5vw,6rem)", color: "#0dff51" }}>
        O evento chegou! 🚀
      </p>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Label customizável */}
      <p
        className="font-sora font-bold uppercase tracking-widest mb-2"
        style={{ fontSize: "clamp(0.8rem, 2vw, 2.5rem)", color: "rgba(255,255,255,0.8)", letterSpacing: "0.3em" }}
      >
        {label}
      </p>

      {/* Número grande + DIAS */}
      <TimeBlock value={days} label="DIAS" isLarge />

      {/* Linha divisória */}
      <div
        className="my-4 rounded-full"
        style={{ height: "2px", background: "rgba(13,255,81,0.3)", width: "clamp(200px, 38vw, 560px)" }}
      />

      {/* Horas : Minutos : Segundos */}
      <div className="flex items-start gap-4 md:gap-8">
        <TimeBlock value={hours}   label="HORAS" />
        <span className="font-sora font-bold self-start pt-1" style={{ fontSize: "clamp(1.5rem,3.5vw,4.5rem)", color: "#0dff51", opacity: 0.5 }}>:</span>
        <TimeBlock value={minutes} label="MINUTOS" />
        <span className="font-sora font-bold self-start pt-1" style={{ fontSize: "clamp(1.5rem,3.5vw,4.5rem)", color: "#0dff51", opacity: 0.5 }}>:</span>
        <TimeBlock value={seconds} label="SEGUNDOS" />
      </div>

      {/* Badge amarelo — mostra título da campanha */}
      <div
        className="mt-6 inline-flex items-center self-start rounded-full px-5 py-2"
        style={{ background: "#ffdf02" }}
      >
        <span className="font-sora font-bold" style={{ fontSize: "clamp(0.7rem, 1.3vw, 1.5rem)", color: "#014b3d" }}>
          {campaignTitle ?? "Contagem regressiva iniciada."}
        </span>
      </div>
    </div>
  );
}
