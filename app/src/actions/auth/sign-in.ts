"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInWithMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!email) {
    redirect("/login?error=missing_email");
  }

  const supabase = await createClient();
  const callbackUrl = `${getBaseUrl()}/auth/callback`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(`/login?success=${encodeURIComponent("Confira seu email para entrar no app.")}`);
}
