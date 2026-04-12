import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app/app-shell";
import { getCurrentProfile } from "@/lib/queries/profile";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    redirect("/login");
  }

  return <AppShell currentProfile={currentProfile}>{children}</AppShell>;
}
