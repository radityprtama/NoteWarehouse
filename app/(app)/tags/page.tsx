import type { Metadata } from "next";
import { ArrowRight, Hash } from "lucide-react";
import Link from "next/link";

import { TagForm } from "@/components/forms/tag-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getTags } from "@/lib/queries/organization";

export const metadata: Metadata = {
  title: "Tags",
  description: "Create and browse note tags in Note Warehouse.",
};

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <main className="space-y-8 px-6 py-8 lg:px-8">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Cross-reference labels
          </p>
          <h1 className="font-display text-5xl tracking-tight">Tags</h1>
          <p className="max-w-2xl text-muted-foreground">
            Tags cut across folders and collections. Use them for subjects,
            concepts, courses, and reusable retrieval cues.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit rounded-full px-4 py-1">
          {tags.length} tags
        </Badge>
      </header>

      <TagForm />

      {tags.length > 0 ? (
        <section className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-border/60 bg-card/90 px-4 py-2 text-sm shadow-sm transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-muted/40">
                <Hash className="size-4 text-accent" />
              </span>
              <span className="font-medium">{tag.name}</span>
              <Badge variant="secondary">{tag.noteCount}</Badge>
              {tag.color ? <span className="text-muted-foreground">{tag.color}</span> : null}
              <ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent" />
            </Link>
          ))}
        </section>
      ) : (
        <Card className="border-dashed border-border/70 bg-card/80">
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border bg-muted/40">
              <Hash className="size-6 text-accent" />
            </div>
            <h2 className="mt-5 font-display text-3xl">No tags yet.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Start with a small controlled vocabulary. You can attach tags from the
              note editor and search by them instantly.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
