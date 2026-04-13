"use client";

import type { ComponentType } from "react";
import { Bold, Code2, Heading2, Italic, List, ListChecks, Quote, Columns2, Eye, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";

export type EditorMode = "edit" | "preview" | "split";
export type MarkdownFormat =
  | { kind: "wrap"; label: string; before: string; after: string }
  | { kind: "prefix"; label: string; prefix: string };

const tools: Array<MarkdownFormat & { icon: ComponentType<{ className?: string }> }> = [
  { kind: "wrap", label: "Bold", before: "**", after: "**", icon: Bold },
  { kind: "wrap", label: "Italic", before: "_", after: "_", icon: Italic },
  { kind: "wrap", label: "Code", before: "`", after: "`", icon: Code2 },
  { kind: "prefix", label: "Heading", prefix: "## ", icon: Heading2 },
  { kind: "prefix", label: "Quote", prefix: "> ", icon: Quote },
  { kind: "prefix", label: "List", prefix: "- ", icon: List },
  { kind: "prefix", label: "Checklist", prefix: "- [ ] ", icon: ListChecks },
];

const modes: Array<{ value: EditorMode; label: string; icon: ComponentType<{ className?: string }> }> = [
  { value: "edit", label: "Edit", icon: Pencil },
  { value: "preview", label: "Preview", icon: Eye },
  { value: "split", label: "Split", icon: Columns2 },
];

export function MarkdownToolbar({
  mode,
  onModeChange,
  onFormat,
}: {
  mode: EditorMode;
  onModeChange: (mode: EditorMode) => void;
  onFormat: (format: MarkdownFormat) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-border/60 bg-card/90 p-3 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <Button
              key={tool.label}
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => onFormat(tool)}
              aria-label={tool.label}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{tool.label}</span>
            </Button>
          );
        })}
      </div>
      <div className="ml-auto flex flex-wrap gap-2">
        {modes.map((item) => {
          const Icon = item.icon;

          return (
            <Button
              key={item.value}
              type="button"
              variant={mode === item.value ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => onModeChange(item.value)}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
