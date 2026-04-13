"use client";

import { useState } from "react";
import { CalendarClock, Clock3, Copy, FileText } from "lucide-react";

import { MarkdownRenderer } from "@/lib/markdown/render";
import { getReadingTime } from "@/lib/markdown/reading-time";
import { extractTableOfContents } from "@/lib/markdown/toc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function NoteReader({
  title,
  content,
  updatedAt,
}: {
  title: string;
  content: string;
  updatedAt: string;
}) {
  const [copied, setCopied] = useState(false);
  const stats = getReadingTime(content);
  const toc = extractTableOfContents(content);

  async function copyMarkdown() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <section className="min-w-0 space-y-8">
        <header className="rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              Markdown note
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock3 className="size-3.5" />
              {stats.minutes} min read
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileText className="size-3.5" />
              {stats.words} words
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="size-3.5" />
              Updated {new Date(updatedAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
            {title}
          </h1>
        </header>

        <div className="rounded-3xl border border-border/60 bg-card/95 p-6 shadow-sm sm:p-8">
          <MarkdownRenderer content={content || "_This note is empty._"} />
        </div>
      </section>

      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-4 rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-medium">On this page</h2>
            <p className="mt-1 text-xs text-muted-foreground">Generated from README headings.</p>
          </div>
          {toc.length > 0 ? (
            <nav className="space-y-2 text-sm">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={
                    item.level === 3
                      ? "block pl-4 text-muted-foreground hover:text-foreground"
                      : "block text-muted-foreground hover:text-foreground"
                  }
                >
                  {item.text}
                </a>
              ))}
            </nav>
          ) : (
            <p className="text-sm text-muted-foreground">Add level 2 or 3 headings for a table of contents.</p>
          )}
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start rounded-2xl"
            onClick={copyMarkdown}
          >
            <Copy className="size-4" />
            {copied ? "Copied" : "Copy Markdown"}
          </Button>
        </div>
      </aside>
    </div>
  );
}
