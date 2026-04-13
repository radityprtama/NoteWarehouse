import type { Metadata } from "next";
import { ArrowRight, FolderOpen } from "lucide-react";
import Link from "next/link";

import { FolderForm } from "@/components/forms/folder-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getFolders } from "@/lib/queries/organization";

export const metadata: Metadata = {
  title: "Folders",
  description: "Create and browse folder shelves in Note Warehouse.",
};

export default async function FoldersPage() {
  const folders = await getFolders();

  return (
    <main className="space-y-8 px-6 py-8 lg:px-8">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Warehouse aisles
          </p>
          <h1 className="font-display text-5xl tracking-tight">Folders</h1>
          <p className="max-w-2xl text-muted-foreground">
            Folders are top-level shelves for broad study areas. Keep them stable,
            then use tags and collections for cross-cutting structure.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit rounded-full px-4 py-1">
          {folders.length} folders
        </Badge>
      </header>

      <FolderForm />

      {folders.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {folders.map((folder) => (
            <Link
              key={folder.id}
              href={`/folders/${folder.slug}`}
              className="group rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-2xl border bg-muted/30">
                      <FolderOpen className="size-5 text-accent" />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl font-semibold tracking-tight">
                        {folder.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">/{folder.slug}</p>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {folder.description ||
                      "No description yet. Use this shelf to group a stable knowledge area."}
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-accent" />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{folder.noteCount} notes</Badge>
                {folder.color ? <Badge variant="outline">{folder.color}</Badge> : null}
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <Card className="border-dashed border-border/70 bg-card/80">
          <CardContent className="flex flex-col items-center px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border bg-muted/40">
              <FolderOpen className="size-6 text-accent" />
            </div>
            <h2 className="mt-5 font-display text-3xl">No folders yet.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Create one broad shelf, then attach notes to it from the editor metadata
              panel.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/notes/new">Create a note</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
