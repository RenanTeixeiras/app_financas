import Link from "next/link";
import { ArrowRight, Sparkles, Wallet } from "lucide-react";

import { appRoutes } from "@/lib/constants/routes";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-4 py-12 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] border border-white/12 bg-white/7 p-8 shadow-[var(--shadow-glow)] backdrop-blur-xl md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-sm text-[var(--text-muted)]">
            <Sparkles className="size-4 text-[var(--accent-primary)]" />
            Sprint 1 iniciada
          </div>

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-6xl">
              Seu controle financeiro, lindo no desktop e impecável no celular.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-muted)] md:text-lg">
              Base do produto pronta para um app premium de receitas e despesas, com visual
              minimalista luxuoso, arquitetura simples e crescimento seguro para multiusuário.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.35)] transition hover:brightness-105"
            >
              Entrar no app
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={appRoutes.dashboard}
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-medium text-[var(--text-primary)] transition hover:bg-white/10"
            >
              Ver shell inicial
            </Link>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/12 bg-white/6 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent-primary),#7dd3fc)] text-slate-950 shadow-[0_16px_40px_rgba(116,124,255,0.3)]">
              <Wallet className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">Finanças Pessoais</p>
              <p className="text-sm text-[var(--text-muted)]">Glassmorphism moderno</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {[
              ["Stack", "Next.js, Supabase, Drizzle e Tailwind v4"],
              ["Direção", "Minimalista premium com dark-first luxuoso"],
              ["Domínio", "Receitas, despesas, categorias globais e personalizadas"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{label}</p>
                <p className="mt-2 text-sm text-[var(--text-primary)]">{value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
