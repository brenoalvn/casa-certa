import { Suspense } from "react";
import { LoginClient } from "./LoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center bg-[#faf7f2] px-6">Carregando…</main>}>
      <LoginClient />
    </Suspense>
  );
}