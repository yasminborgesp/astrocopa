"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, Images, Settings, LogOut, Tv } from "lucide-react";

const navItems = [
  { href: "/admin",          label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/media",    label: "Mídias",      icon: Images },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside
      className="flex flex-col w-64 min-h-screen shrink-0"
      style={{ background: "#014b3d" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-7 border-b border-white/10">
        <Image
          src="/logo.png"
          alt="AstroCopa"
          width={110}
          height={55}
          className="object-contain object-left"
        />
        <span className="font-sora font-medium text-white/50 text-xs uppercase tracking-widest mt-auto mb-1">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sora font-semibold transition-all duration-150"
              style={{
                background: active ? "#0dff51" : "transparent",
                color: active ? "#014b3d" : "rgba(255,255,255,0.7)",
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Atalhos */}
      <div className="px-4 pb-4 space-y-2">
        <Link
          href="/tv"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sora font-semibold transition-all duration-150"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <Tv size={18} />
          Ver tela TV
        </Link>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-sora font-semibold transition-all duration-150"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
}
