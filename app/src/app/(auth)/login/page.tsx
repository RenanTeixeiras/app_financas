import Link from "next/link";
import { Mail } from "lucide-react";

import { signInWithMagicLink } from "@/actions/auth/sign-in";
import { redirectIfAuthenticated } from "@/lib/auth/guards";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await redirectIfAuthenticated();

  const params = await searchParams;
  const error = params.error ? decodeURIComponent(params.error) : null;
  const success = params.success ? decodeURIComponent(params.success) : null;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md items-center px-4 py-10">
      <section className="w-full rounded-[2rem] border border-white/12 bg-white/8 p-6 shadow-[var(--shadow-glow)] backdrop-blur-xl md:p-8">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.3)]">
          <Mail className="size-5" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Entrar
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
          Entre com seu email para receber um link mágico e acessar o app com segurança.
        </p>

        <form action={signInWithMagicLink} className="mt-8 space-y-4">
          <label className="block text-sm text-[var(--text-muted)]" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="voce@exemplo.com"
            className="w-full rounded-2xl border border-white/12 bg-black/10 px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-white/24"
          />

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.35)] transition hover:brightness-105"
          >
            Enviar link de acesso
          </button>
        </form>

        {success ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/12"
        >
          Voltar
        </Link>
      </section>
    </main>
  );
}
