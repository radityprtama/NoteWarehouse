import { CheckCircle2, Circle, Loader2, TriangleAlert } from "lucide-react";

export type AutosaveState = "idle" | "saving" | "saved" | "error";

export function AutosaveStatus({ status }: { status: AutosaveState }) {
  const icon =
    status === "saving" ? (
      <Loader2 className="size-3.5 animate-spin" />
    ) : status === "saved" ? (
      <CheckCircle2 className="size-3.5 text-accent" />
    ) : status === "error" ? (
      <TriangleAlert className="size-3.5 text-destructive" />
    ) : (
      <Circle className="size-3.5" />
    );

  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/35 px-3 py-1 text-xs text-muted-foreground">
      {icon}
      Autosave: {status}
    </p>
  );
}
