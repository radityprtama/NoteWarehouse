import type { ReactNode } from "react";

import type { CurrentProfileResult } from "@/lib/queries/profile";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { Card } from "@/components/ui/card";

type AppShellProps = {
  children: ReactNode;
  currentProfile: CurrentProfileResult;
};

export function AppShell({ children, currentProfile }: AppShellProps) {
  const onboardingCompleted = currentProfile.profile?.onboarding_completed ?? false;
  const displayName = currentProfile.profile?.display_name ?? currentProfile.email;

  return (
    <div className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-[96rem] flex-col lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-border/70 bg-card/60 lg:flex lg:flex-col">
          <Sidebar currentProfile={currentProfile} />
        </aside>
        <div className="flex min-h-dvh flex-col">
          <Topbar currentProfile={currentProfile} />
          {!onboardingCompleted ? (
            <div className="border-b border-border/70 bg-muted/35 px-6 py-3 lg:px-8">
              <Card className="border-border/50 bg-card/80 px-4 py-3 shadow-none">
                <p className="text-sm text-muted-foreground">
                  Finish onboarding to personalize your vault. Current user:{" "}
                  <span className="font-medium text-foreground">{displayName}</span>.
                </p>
              </Card>
            </div>
          ) : null}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
