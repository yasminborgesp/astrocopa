import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Layout compartilhado por todas as rotas /admin (exceto login)
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "#f5f6f7" }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
