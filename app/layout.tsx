import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

import { SiteHeader } from "./components/site-header"; // 👈 importa aqui

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Casa Certa",
  description: "Imóveis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.variable} ${playfair.variable} antialiased bg-[#faf7f2] text-zinc-900`}>
        <SiteHeader /> {/* 👈 agora aparece em TODAS as páginas */}

        {/* Espaço pro header não “tampar” o topo */}
        <div className="pt-16">{children}</div>
      </body>
    </html>
  );
}