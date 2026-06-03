import Image from "next/image";

interface TVLogoProps {
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { width: 100, height: 50 },
  md: { width: 160, height: 80 },
  lg: { width: 220, height: 110 },
};

// Logo AstroCopa (public/logo.png) — assume branco/transparente
// Para trocar: substitua public/logo.png
export function TVLogo({ size = "md" }: TVLogoProps) {
  const { width, height } = sizes[size];

  return (
    <Image
      src="/logo.png"
      alt="AstroCopa"
      width={width}
      height={height}
      className="object-contain object-left"
      priority
    />
  );
}
