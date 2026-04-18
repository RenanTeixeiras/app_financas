import type { ReactNode } from "react";

import { BottomNav } from "@/components/app-shell/bottom-nav";
import { Sidebar } from "@/components/app-shell/sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl gap-6 px-4 pb-28 pt-6 md:px-6 md:pb-6">
      <Sidebar />
      <main
        id="main-content"
        className="flex min-h-[calc(100dvh-3rem)] flex-1 flex-col rounded-[2rem] border border-white/12 bg-white/6 p-4 shadow-[0_24px_100px_rgba(6,14,28,0.45)] backdrop-blur-xl md:p-6"
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
