import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 py-16">
      <Card className="w-full max-w-2xl border-border/60 bg-card/90 shadow-xl shadow-primary/5">
        <CardContent className="space-y-6 p-8 text-center sm:p-10">
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl border border-border/60 bg-muted/30">
            <BookOpenText className="size-7 text-accent" />
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Shelf missing</p>
            <h1 className="font-display text-5xl tracking-tight">This page is not in the vault.</h1>
            <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground">
              The note or route you tried to open does not exist. Return to the dashboard or sign in to continue browsing your
              workspace.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full px-6">
              <Link href="/dashboard">
                Go to dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
