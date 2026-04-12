import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpenText, Search, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  "Markdown-first note capture",
  "Full-text search across vault content",
  "Tags, folders, and curated collections",
];

const featureCards = [
  {
    icon: BookOpenText,
    title: "Library-grade reading",
    description:
      "Readable layouts, clean typography, and focused note pages that feel built for long-term study.",
  },
  {
    icon: Search,
    title: "Search-first retrieval",
    description:
      "Find notes by title, content, tags, and metadata without leaving the keyboard.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "Supabase auth, RLS, and server-side reads keep each vault isolated and secure.",
  },
];

export default function MarketingPage() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[42rem] bg-[radial-gradient(circle_at_top_left,oklch(0.56_0.17_250/0.12),transparent_34rem),radial-gradient(circle_at_top_right,oklch(0.64_0.15_75/0.12),transparent_28rem)]" />
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col px-6 pb-16 pt-6 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-card/80 shadow-sm">
              <BadgeCheck className="size-5 text-accent" />
            </span>
            <div>
              <p className="font-display text-xl leading-none">Note Warehouse</p>
              <p className="text-xs text-muted-foreground">A Markdown vault for serious note-taking</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Create vault
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid flex-1 gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-20">
          <div className="max-w-3xl space-y-8">
            <Badge variant="secondary" className="w-fit rounded-full px-4 py-1">
              Personal knowledge vault
            </Badge>
            <div className="space-y-5">
              <h1 className="max-w-2xl font-display text-5xl leading-[0.95] tracking-tight text-balance text-foreground sm:text-6xl lg:text-7xl">
                Store study notes like they belong in a carefully sorted archive.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                Note Warehouse gives you a clean Markdown vault for READMEs, research notes, and personal knowledge you need to
                find again immediately.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/signup">
                  Start free
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full px-6">
                <Link href="/login">Open your vault</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <Card key={item} className="border-border/60 bg-card/80 shadow-sm">
                  <CardContent className="p-4 text-sm text-muted-foreground">{item}</CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/15 via-transparent to-transparent blur-2xl" />
            <Card className="relative overflow-hidden border-border/70 bg-card/90 shadow-2xl shadow-primary/10">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">Vault preview</p>
                    <h2 className="mt-2 font-display text-3xl">Clean, searchable, structured</h2>
                  </div>
                  <Badge variant="outline" className="rounded-full">
                    Markdown
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Fast capture</p>
                    <p className="mt-3 text-2xl font-semibold">Write once</p>
                    <p className="mt-2 text-sm text-muted-foreground">Save Markdown, revisit it later, and keep the context intact.</p>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-muted/40 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Search first</p>
                    <p className="mt-3 text-2xl font-semibold">Find instantly</p>
                    <p className="mt-2 text-sm text-muted-foreground">Title, content, tags, folders, and favorites all stay within reach.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3">
                    <div>
                      <p className="font-medium">Neuroscience revision notes</p>
                      <p className="text-sm text-muted-foreground">Pinned in Biology folder</p>
                    </div>
                    <Badge>Favorite</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-3">
                    <div>
                      <p className="font-medium">Product thinking README</p>
                      <p className="text-sm text-muted-foreground">Tagged strategy, systems</p>
                    </div>
                    <Badge variant="secondary">Updated today</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {featureCards.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title} className="border-border/60 bg-card/80 shadow-sm">
                <CardContent className="space-y-4 p-6">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-muted/50">
                    <Icon className="size-5 text-accent" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl">{feature.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
