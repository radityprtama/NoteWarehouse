import type { Metadata } from "next";
import { ArrowRight, FolderKanban, Pin } from "lucide-react";
import Link from "next/link";

import { CollectionForm } from "@/components/forms/collection-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCollections } from "@/lib/queries/organization";

export const metadata: Metadata = {
  title: "Collections",
  description: "Curate note collections in Note Warehouse.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();
  const pinnedCount = collections.filter((collection) => collection.is_pinned).length;

  return (
    <main className="space-y-8 px-6 py-8 lg:px-8">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Curated vault shelves
          </p>
          <h1 className="font-display text-5xl tracking-tight">Collections</h1>
          <p className="max-w-2xl text-muted-foreground">
            Collections are manual reading paths, projects, and study bundles. Pin
            the active ones to keep them close on the dashboard.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full px-4 py-1">
            {collections.length} collections
          </Badge>
          <Badge variant="outline" className="rounded-full px-4 py-1">
            {pinnedCount} pinned
          </Badge>
        </div>
      </header>

      <CollectionForm />

      {collections.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl border bg-muted/30">
                      <FolderKanban className="size-5 text-accent" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl font-semibold tracking-tight">
                        {collection.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">/{collection.slug}</p>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {collection.description ||
                      "No description yet. Use this collection as a curated path through your notes."}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{collection.noteCount} notes</Badge>
                {collection.is_pinned ? (
                  <Badge variant="outline" className="gap-1">
                    <Pin className="size-3" />
                    Pinned
                  </Badge>
                ) : null}
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <Card className="border-dashed border-border/70 bg-card/80">
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border bg-muted/40">
              <FolderKanban className="size-6 text-accent" />
            </div>
            <h2 className="mt-5 font-display text-3xl">No collections yet.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Create a collection for a project, syllabus, exam, or reading queue,
              then attach notes from the editor.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
