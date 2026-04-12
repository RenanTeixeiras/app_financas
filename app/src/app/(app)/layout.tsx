import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell/app-shell";
import { requireUser } from "@/lib/auth/guards";

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  await requireUser();

  return <AppShell>{children}</AppShell>;
}
