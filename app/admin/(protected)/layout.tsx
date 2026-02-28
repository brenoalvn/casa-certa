// app/admin/(protected)/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseSSR } from "@/lib/supabase-ssr";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseSSR();
  const { data } = await supabase.auth.getUser();
if (!data.user) redirect("/admin/login");  
  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold">
              Casa Certa <span className="text-zinc-500 font-normal">Imóveis</span>
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              {/* <Link className="rounded-md px-3 py-2 hover:bg-zinc-100" href="/admin/imoveis">
                Imóveis
              </Link> */}
              <Link className="rounded-md px-3 py-2 hover:bg-zinc-100" href="/admin/leads">
                Leads
              </Link>
            </nav>
          </div>

          <form action="/admin/logout" method="post">
            <button className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50">Sair</button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}