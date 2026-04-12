import Link from "next/link";
import { Mail } from "lucide-react";

export default function LoginPage() {
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
          Tela base da autenticação. Na próxima sprint, ela será conectada ao Supabase Auth com
          magic link.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-white/12 bg-black/10 p-4">
          <p className="text-sm text-[var(--text-muted)]">
            Estrutura já pronta para receber o formulário e o callback de autenticação.
          </p>
        </div>

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
