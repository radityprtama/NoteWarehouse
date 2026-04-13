"use client";

import { useRef, useState } from "react";

import { EditorShell } from "@/components/editor/editor-shell";
import {
  MarkdownToolbar,
  type EditorMode,
  type MarkdownFormat,
} from "@/components/editor/markdown-toolbar";
import { MarkdownRenderer } from "@/lib/markdown/render";
import { useNoteAutosave } from "@/hooks/use-note-autosave";

function applyPrefixToLines(text: string, prefix: string) {
  return text
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
}

export function NoteEditor({
  initialValue,
  noteId,
  title = "Edit note",
}: {
  initialValue: string;
  noteId: string | null;
  title?: string;
}) {
  const [content, setContent] = useState(initialValue);
  const [mode, setMode] = useState<EditorMode>("split");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const status = useNoteAutosave(
    content,
    async (nextContent) => {
      if (!noteId) {
        return;
      }

      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content_md: nextContent }),
      });

      if (!response.ok) {
        throw new Error("Unable to autosave note.");
      }
    },
    Boolean(noteId),
  );

  function applyFormat(format: MarkdownFormat) {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    const nextSelected =
      format.kind === "wrap"
        ? `${format.before}${selected}${format.after}`
        : applyPrefixToLines(selected || "", format.prefix);
    const nextContent = `${content.slice(0, start)}${nextSelected}${content.slice(end)}`;
    const nextCursor = start + nextSelected.length;

    setContent(nextContent);

    window.requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  }

  return (
    <EditorShell title={title} status={status}>
      <MarkdownToolbar mode={mode} onModeChange={setMode} onFormat={applyFormat} />
      <div className={mode === "split" ? "grid gap-4 xl:grid-cols-2" : "space-y-4"}>
        {mode !== "preview" ? (
          <textarea
            ref={textareaRef}
            aria-label="Note content"
            className="min-h-[62dvh] w-full resize-y rounded-3xl border border-border/60 bg-card/95 p-5 font-mono text-sm leading-7 shadow-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/30"
            value={content}
            spellCheck
            onChange={(event) => setContent(event.target.value)}
          />
        ) : null}
        {mode !== "edit" ? (
          <div className="min-h-[62dvh] overflow-auto rounded-3xl border border-border/60 bg-card/95 p-5 shadow-sm sm:p-6">
            <MarkdownRenderer content={content || "_Nothing to preview yet._"} />
          </div>
        ) : null}
      </div>
    </EditorShell>
  );
}
