"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  const active =
    pathname === "/"
      ? "inicio"
      : pathname.startsWith("/imoveis")
      ? "imoveis"
      : pathname.startsWith("/contato")
      ? "contato"
      : "inicio";

  const itemBase = "rounded-full px-4 py-2 text-sm font-medium transition";
  const itemActive = "bg-emerald-700 text-white";
  const itemIdle = "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-white">
            🏠
          </span>
          <span>Casa Certa</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link href="/" className={`${itemBase} ${active === "inicio" ? itemActive : itemIdle}`}>
            Início
          </Link>

          <Link
            href="/imoveis"
            className={`${itemBase} ${active === "imoveis" ? itemActive : itemIdle}`}
          >
            Imóveis
          </Link>

          <Link
            href="/contato"
            className={`${itemBase} ${active === "contato" ? itemActive : itemIdle}`}
          >
            Contato
          </Link>
        </nav>
      </div>
    </header>
  );
}