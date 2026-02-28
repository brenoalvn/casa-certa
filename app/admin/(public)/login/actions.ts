"use server";

import { supabaseSSR } from "@/lib/supabase-ssr";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await supabaseSSR();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { ok: false, message: error.message };

  return { ok: true };
}