import type { Metadata } from "next";
import { ArrowRight, BookOpenText, Clock3, FolderKanban, Search, Sparkles, Star, Tags } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getDashboardData } from "@/lib/queries/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your Note Warehouse vault.",
};

function formatRelativeDate(value: string) {
  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="space-y-10 px-6 py-8 lg:px-8">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
        <div className="space-y-4">
          <Badge variant="secondary" className="w-fit rounded-full px-4 py-1">
            Vault overview
          </Badge>
          <div className="space-y-3">
            <h1 className="font-display text-5xl tracking-tight text-balance sm:text-6xl">Your notes, sorted and ready.</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Note Warehouse keeps your study vault searchable, compact, and calm so the content is easy to return to.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 xl:justify-end">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/search">
              <Search className="size-4" />
              Search vault
            </Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/profile">
              <Sparkles className="size-4" />
              Profile
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total notes", value: data.totalNotes },
          { label: "Favorites", value: data.favoriteCount },
          { label: "Pinned collections", value: data.pinnedCollectionCount },
          { label: "Updated in 7 days", value: data.recentActivityCount },
        ].map((item) => (
          <Card key={item.label} className="border-border/60 bg-card/90 shadow-sm">
            <CardContent className="space-y-2 p-6">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-display text-4xl tracking-tight">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {data.errors.length > 0 ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-base">Partial dashboard data loaded</CardTitle>
            <CardDescription>
              Some vault panels could not be loaded. The page stayed usable and the rest of the data is shown below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {data.errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr_0.9fr]">
        <Card className="border-border/60 bg-card/90 shadow-sm">
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div className="space-y-1">
              <CardTitle>Recent notes</CardTitle>
              <CardDescription>Latest edits in the vault.</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href="/notes">
                View all
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentNotes.length > 0 ? (
              data.recentNotes.map((note) => (
                <div key={note.id} className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {note.cover_icon ? <span aria-hidden>{note.cover_icon}</span> : null}
                        <h3 className="font-medium leading-none">{note.title}</h3>
                        {note.is_pinned ? <Badge variant="outline">Pinned</Badge> : null}
                        {note.is_favorite ? <Badge>Favorite</Badge> : null}
                      </div>
                      <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {note.excerpt || "No excerpt added yet."}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatRelativeDate(note.updated_at)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 px-5 py-10 text-center">
                <p className="font-medium">No notes yet</p>
                <p className="mt-2 text-sm text-muted-foreground">Your recent note list will appear here once you start writing.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Collections</CardTitle>
            <CardDescription>Pinned collection shortcuts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.pinnedCollections.length > 0 ? (
              data.pinnedCollections.map((collection) => (
                <div key={collection.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                  <div>
                    <p className="font-medium">{collection.name}</p>
                    <p className="text-sm text-muted-foreground">{collection.description || "Pinned collection"}</p>
                  </div>
                  <Badge variant="outline">Pinned</Badge>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 px-5 py-10 text-center">
                <p className="font-medium">No pinned collections</p>
                <p className="mt-2 text-sm text-muted-foreground">Collections will surface here when you pin them.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Tag summary</CardTitle>
            <CardDescription>Most active tags in the vault.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.tagSummary.length > 0 ? (
              data.tagSummary.map((tag) => (
                <div key={tag.id} className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
                  <div>
                    <p className="font-medium">{tag.name}</p>
                    <p className="text-sm text-muted-foreground">Used in {tag.noteCount} notes</p>
                  </div>
                  <Badge variant="secondary">{tag.noteCount}</Badge>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 px-5 py-10 text-center">
                <p className="font-medium">No tags yet</p>
                <p className="mt-2 text-sm text-muted-foreground">Tag your notes to build better filters and retrieval.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card className="border-border/60 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Favorite notes</CardTitle>
            <CardDescription>Starred references worth keeping close.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.favoriteNotes.length > 0 ? (
              data.favoriteNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.slug}`}
                  className="block rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 transition-colors hover:bg-muted/45"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{note.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Updated {formatRelativeDate(note.updated_at)}
                      </p>
                    </div>
                    <Star className="size-4 shrink-0 fill-accent text-accent" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 px-5 py-10 text-center">
                <p className="font-medium">No favorites yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Star notes to build a compact shelf of high-value references.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Activity window</CardTitle>
            <CardDescription>Notes updated in the last seven days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
              <div className="flex items-center gap-3">
                <Clock3 className="size-4 text-accent" />
                <div>
                  <p className="font-medium">Recent edits</p>
                  <p className="text-sm text-muted-foreground">Last 7 days</p>
                </div>
              </div>
              <p className="font-display text-3xl">{data.recentActivityCount}</p>
            </div>
            <Separator />
            <p className="text-sm leading-6 text-muted-foreground">
              Search, edit, and organize without leaving the vault. The dashboard stays intentionally lightweight so it can scale
              into a richer workspace later.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle>Vault shortcuts</CardTitle>
            <CardDescription>Fast routes for common actions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { href: "/search", label: "Search vault", icon: Search },
              { href: "/notes", label: "All notes", icon: BookOpenText },
              { href: "/collections", label: "Collections", icon: FolderKanban },
              { href: "/tags", label: "Tags", icon: Tags },
              { href: "/favorites", label: "Favorites", icon: Star },
              { href: "/profile", label: "Profile", icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <Button key={item.label} asChild variant="outline" className="h-auto justify-start rounded-2xl px-4 py-4">
                  <Link href={item.href}>
                    <Icon className="size-4 text-accent" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
