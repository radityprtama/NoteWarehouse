import type { Metadata } from "next";
import { Download, Settings2, UserRound } from "lucide-react";
import Link from "next/link";

import { PreferencesForm } from "@/components/forms/preferences-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/lib/queries/profile";
import type { PreferencesInput } from "@/lib/validators/preferences";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage Note Warehouse workspace preferences.",
};

const defaultPreferences: PreferencesInput = {
  theme: "system",
  editor_mode: "split",
  editor_width: "comfortable",
  sidebar_collapsed: false,
  command_palette_enabled: true,
};

export default async function SettingsPage() {
  const currentProfile = await getCurrentProfile();
  const preferences: PreferencesInput = {
    theme: currentProfile?.preferences?.theme ?? defaultPreferences.theme,
    editor_mode:
      currentProfile?.preferences?.editor_mode ?? defaultPreferences.editor_mode,
    editor_width:
      currentProfile?.preferences?.editor_width ?? defaultPreferences.editor_width,
    sidebar_collapsed:
      currentProfile?.preferences?.sidebar_collapsed ??
      defaultPreferences.sidebar_collapsed,
    command_palette_enabled:
      currentProfile?.preferences?.command_palette_enabled ??
      defaultPreferences.command_palette_enabled,
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-6 py-8 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Workspace controls
          </p>
          <h1 className="font-display text-5xl tracking-tight">Settings</h1>
          <p className="max-w-2xl text-muted-foreground">
            Tune the vault defaults now. The schema already stores future shell and
            editor preferences even when the current UI only uses part of them.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit rounded-full px-4 py-1">
          Personal vault
        </Badge>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.6fr]">
        <PreferencesForm preferences={preferences} />

        <div className="space-y-6">
          <Card className="border-border/60 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="size-5 text-accent" />
                Stored preferences
              </CardTitle>
              <CardDescription>
                These settings are saved in Supabase under your authenticated user.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">Theme</span>
                <span className="font-medium capitalize">{preferences.theme}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">Editor</span>
                <span className="font-medium capitalize">
                  {preferences.editor_mode.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">Width</span>
                <span className="font-medium capitalize">
                  {preferences.editor_width}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-5 text-accent" />
                Account profile
              </CardTitle>
              <CardDescription>
                Profile details, onboarding state, and identity live separately from
                workspace preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/profile">Open profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="size-5 text-accent" />
                Backup export
              </CardTitle>
              <CardDescription>
                Download notes, folders, tags, collections, and preferences as a JSON
                archive.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="rounded-full">
                <a href="/api/backup">Download backup</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
