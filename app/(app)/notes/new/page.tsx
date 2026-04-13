import type { Metadata } from "next";

import { createNoteAction } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "New Note",
  description: "Create a new Markdown note in Note Warehouse.",
};

async function createNoteFormAction(formData: FormData) {
  "use server";

  await createNoteAction(formData);
}

export default function NewNotePage() {
  return (
    <main className="space-y-6 px-6 py-8 lg:px-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
          Quick capture
        </p>
        <h1 className="font-display text-5xl tracking-tight">New note</h1>
        <p className="max-w-2xl text-muted-foreground">
          Start with a title and raw Markdown. Organization metadata can be expanded
          as the vault grows.
        </p>
      </header>

      <form action={createNoteFormAction} className="space-y-4 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
          <Input name="title" placeholder="Untitled note" required />
          <Input name="slug" placeholder="optional-custom-slug" />
        </div>
        <Textarea name="excerpt" placeholder="Optional short summary" rows={3} />
        <Textarea
          name="content_md"
          placeholder={"# Start writing\n\nUse Markdown, code fences, tables, and checklists."}
          rows={18}
          className="font-mono leading-7"
        />
        <input type="hidden" name="folder_id" value="" />
        <input type="hidden" name="cover_icon" value="" />
        <input type="hidden" name="tag_ids" value="[]" />
        <input type="hidden" name="collection_ids" value="[]" />
        <input type="hidden" name="is_favorite" value="false" />
        <input type="hidden" name="is_pinned" value="false" />
        <input type="hidden" name="visibility" value="private" />
        <Button type="submit" className="rounded-full">
          Create note
        </Button>
      </form>
    </main>
  );
}
