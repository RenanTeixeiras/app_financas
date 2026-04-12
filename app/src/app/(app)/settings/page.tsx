export default function SettingsPage() {
  return (
    <section className="rounded-[2rem] border border-white/12 bg-white/8 p-6 backdrop-blur-xl">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Ajustes</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
        Espaço reservado para preferências de tema, moeda, locale e configurações futuras da conta.
      </p>
    </section>
  );
}
