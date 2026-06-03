"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 10% 90%, rgba(255,223,2,0.35) 0%, transparent 40%), radial-gradient(ellipse at 90% 10%, rgba(13,255,81,0.4) 0%, transparent 45%), linear-gradient(135deg, #0dff51 0%, #43c4c8 100%)",
      }}
    >
      {/* Card */}
      <div
        className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
        style={{ background: "white" }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <Image
            src="/logo.png"
            alt="AstroCopa"
            width={160}
            height={80}
            className="object-contain"
            style={{ filter: "brightness(0) saturate(100%) invert(22%) sepia(57%) saturate(500%) hue-rotate(120deg) brightness(60%)" }}
          />
          <p
            className="font-sora font-medium text-sm uppercase tracking-widest"
            style={{ color: "#014b3d", opacity: 0.5 }}
          >
            Painel Administrativo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="font-sora font-semibold text-xs uppercase tracking-widest"
              style={{ color: "#014b3d" }}
            >
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl border font-sora text-sm outline-none transition-all"
              style={{
                borderColor: "#014b3d30",
                color: "#014b3d",
                background: "#f8f9fa",
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="font-sora font-semibold text-xs uppercase tracking-widest"
              style={{ color: "#014b3d" }}
            >
              Senha
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border font-sora text-sm outline-none transition-all"
                style={{
                  borderColor: "#014b3d30",
                  color: "#014b3d",
                  background: "#f8f9fa",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#014b3d", opacity: 0.4 }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="font-sora text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-sora font-bold text-sm uppercase tracking-wider transition-all duration-150 disabled:opacity-60"
            style={{ background: "#0dff51", color: "#014b3d" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
