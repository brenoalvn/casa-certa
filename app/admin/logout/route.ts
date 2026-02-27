import { NextResponse } from "next/server";
import { supabaseSSR } from "@/lib/supabase-ssr";

export async function POST() {
  const supabase = await supabaseSSR(); // 👈 await
  await supabase.auth.signOut();

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return NextResponse.redirect(new URL("/admin/login", base));
}