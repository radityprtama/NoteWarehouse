import type { ReactNode } from "react";

import { AutosaveStatus, type AutosaveState } from "@/components/editor/autosave-status";

export function EditorShell({
  title,
  status,
  children,
}: {
  title: string;
  status: AutosaveState;
  children: ReactNode;
}) {
  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Markdown editor
          </p>
          <h1 className="font-display text-4xl tracking-tight">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Write raw Markdown, preview the rendered README, and let the vault save
            changes quietly while you work.
          </p>
        </div>
        <AutosaveStatus status={status} />
      </header>
      {children}
    </div>
  );
}
