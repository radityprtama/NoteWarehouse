# Note Warehouse MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first production-ready Note Warehouse MVP with Supabase auth, a server-first Next.js app shell, Markdown note CRUD, organization primitives, and full-text search.

**Architecture:** Keep the app server-first with Next.js App Router handling route-level reads and auth-aware layouts, while client components are limited to the editor, search overlays, theme switching, and interactive filters. Supabase remains the single backend for auth, Postgres, RLS, and future storage, with validated server actions for writes and typed query modules for reads.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase SSR/Auth/Postgres, React Hook Form, Zod, TanStack Query, next-themes, react-markdown, remark-gfm, rehype-highlight, sonner, Vitest, Testing Library.

---

## File Map

### Foundation and Tooling

- Modify: `package.json` - add runtime dependencies, test scripts, and typecheck/build helpers.
- Create: `components.json` - shadcn/ui registry configuration.
- Create: `vitest.config.ts` - Vitest + jsdom test runner config.
- Create: `tests/setup.ts` - shared Testing Library and matchers setup.
- Modify: `app/layout.tsx` - root metadata, fonts, providers.
- Create: `app/providers.tsx` - ThemeProvider, QueryClientProvider, Sonner wrapper.
- Modify: `app/globals.css` - semantic design tokens and editorial theme variables.
- Create: `lib/utils.ts` - `cn` helper and small shared utilities.

### Environment and Supabase

- Create: `.env.example` - required local and production environment variables.
- Create: `lib/env.ts` - validated environment schema.
- Create: `lib/supabase/server.ts` - authenticated server client factory.
- Create: `lib/supabase/client.ts` - browser client factory.
- Create: `lib/supabase/admin.ts` - privileged service-role client for server-only jobs.
- Create: `lib/supabase/middleware.ts` - cookie/session synchronization helper.
- Create: `middleware.ts` - protected route guard.
- Create: `types/database.ts` - generated Supabase database types.

### Database and Search

- Create: `supabase/migrations/20260412150000_note_warehouse_init.sql` - schema, indexes, triggers, RLS, and search function.
- Create: `supabase/seed.sql` - demo data for the first local user.
- Create: `lib/search/parse-search.ts` - search string normalization and filter parsing.
- Create: `lib/search/highlight.ts` - highlighted snippet preparation for results.

### Validation, Queries, and Actions

- Create: `lib/validators/auth.ts`
- Create: `lib/validators/notes.ts`
- Create: `lib/validators/organization.ts`
- Create: `lib/validators/preferences.ts`
- Create: `lib/queries/profile.ts`
- Create: `lib/queries/dashboard.ts`
- Create: `lib/queries/notes.ts`
- Create: `lib/queries/organization.ts`
- Create: `lib/queries/search.ts`
- Create: `lib/actions/auth.ts`
- Create: `lib/actions/profile.ts`
- Create: `lib/actions/preferences.ts`
- Create: `lib/actions/notes.ts`
- Create: `lib/actions/organization.ts`
- Create: `lib/actions/search-history.ts`

### App Routes and Components

- Create: `app/(marketing)/page.tsx` - landing page.
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/signup/page.tsx`
- Create: `app/auth/callback/route.ts`
- Create: `app/(app)/layout.tsx` - authenticated shell.
- Create: `app/(app)/dashboard/page.tsx`
- Create: `app/(app)/notes/page.tsx`
- Create: `app/(app)/notes/new/page.tsx`
- Create: `app/(app)/notes/[noteSlug]/page.tsx`
- Create: `app/(app)/notes/[noteSlug]/edit/page.tsx`
- Create: `app/api/notes/[noteId]/route.ts`
- Create: `app/(app)/favorites/page.tsx`
- Create: `app/(app)/archived/page.tsx`
- Create: `app/(app)/folders/page.tsx`
- Create: `app/(app)/folders/[folderSlug]/page.tsx`
- Create: `app/(app)/tags/page.tsx`
- Create: `app/(app)/tags/[tagSlug]/page.tsx`
- Create: `app/(app)/collections/page.tsx`
- Create: `app/(app)/collections/[collectionSlug]/page.tsx`
- Create: `app/(app)/search/page.tsx`
- Create: `app/(app)/settings/page.tsx`
- Create: `app/(app)/profile/page.tsx`
- Create: `app/not-found.tsx`
- Create: `components/app/app-shell.tsx`
- Create: `components/app/sidebar.tsx`
- Create: `components/app/topbar.tsx`
- Create: `components/app/theme-toggle.tsx`
- Create: `components/app/command-menu.tsx`
- Create: `components/forms/auth-form.tsx`
- Create: `components/forms/profile-form.tsx`
- Create: `components/forms/preferences-form.tsx`
- Create: `components/forms/folder-form.tsx`
- Create: `components/forms/tag-form.tsx`
- Create: `components/forms/collection-form.tsx`
- Create: `components/notes/note-list.tsx`
- Create: `components/notes/note-card.tsx`
- Create: `components/notes/note-reader.tsx`
- Create: `components/notes/note-actions.tsx`
- Create: `components/notes/note-filters.tsx`
- Create: `components/notes/related-notes.tsx`
- Create: `components/notes/import-notes-dialog.tsx`
- Create: `components/editor/editor-shell.tsx`
- Create: `components/editor/note-editor.tsx`
- Create: `components/editor/markdown-toolbar.tsx`
- Create: `components/editor/autosave-status.tsx`
- Create: `components/search/global-search.tsx`
- Create: `components/search/search-results.tsx`
- Create: `components/search/search-highlight.tsx`
- Create: `hooks/use-keyboard-shortcuts.ts`
- Create: `hooks/use-note-autosave.ts`
- Create: `lib/markdown/render.tsx`
- Create: `lib/markdown/reading-time.ts`
- Create: `lib/markdown/toc.ts`
- Create: `lib/import-export/markdown.ts`

### Tests and Docs

- Create: `tests/unit/env.test.ts`
- Create: `tests/unit/utils/slugify.test.ts`
- Create: `tests/unit/markdown/reading-time.test.ts`
- Create: `tests/unit/markdown/toc.test.ts`
- Create: `tests/unit/search/parse-search.test.ts`
- Create: `tests/unit/search/highlight.test.ts`
- Create: `tests/components/auth/auth-form.test.tsx`
- Create: `tests/components/editor/note-editor.test.tsx`
- Create: `tests/components/search/note-filters.test.tsx`
- Create: `tests/components/app/sidebar.test.tsx`
- Modify: `README.md` - replace stock README with real setup docs.
- Create: `docs/manual-qa/note-warehouse-mvp.md` - manual QA checklist and integration test plan.

## Task 1: Foundation, Dependencies, and Design Tokens

**Files:**
- Modify: `package.json`
- Create: `components.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `app/providers.tsx`
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Create: `lib/utils.ts`

- [ ] **Step 1: Expand the project dependencies and scripts**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.49.8",
    "@tanstack/react-query": "^5.59.15",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.4",
    "date-fns": "^4.1.0",
    "framer-motion": "^11.13.1",
    "lucide-react": "^0.453.0",
    "next": "16.2.3",
    "next-themes": "^0.3.0",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.53.1",
    "react-markdown": "^9.0.1",
    "rehype-highlight": "^7.0.1",
    "remark-gfm": "^4.0.0",
    "sonner": "^1.7.1",
    "tailwind-merge": "^2.5.3",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "jsdom": "^25.0.1",
    "vite-tsconfig-paths": "^5.1.0",
    "vitest": "^2.1.4"
  }
}
```

- [ ] **Step 2: Add shadcn/ui configuration and shared utility helpers**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Add the test runner and browser-like test environment**

```ts
// vitest.config.ts
import path from "node:path";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    css: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

```ts
// tests/setup.ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add app-wide providers for theme, query client, and toasts**

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { AppProviders } from "@/app/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-newsreader" });

export const metadata: Metadata = {
  title: {
    default: "Note Warehouse",
    template: "%s | Note Warehouse",
  },
  description: "A personal knowledge vault for storing, organizing, and searching Markdown notes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${newsreader.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Replace the stock CSS with semantic editorial tokens**

```css
@import "tailwindcss";

:root {
  --background: oklch(0.98 0.01 95);
  --foreground: oklch(0.22 0.02 260);
  --card: oklch(0.995 0 0);
  --card-foreground: oklch(0.22 0.02 260);
  --muted: oklch(0.95 0.01 95);
  --muted-foreground: oklch(0.46 0.02 260);
  --border: oklch(0.89 0.01 260);
  --primary: oklch(0.3 0.03 260);
  --primary-foreground: oklch(0.99 0 0);
  --accent: oklch(0.56 0.17 250);
  --accent-foreground: oklch(0.99 0 0);
  --destructive: oklch(0.58 0.22 28);
  --ring: oklch(0.56 0.17 250);
  --radius: 1rem;
}

.dark {
  --background: oklch(0.16 0.02 260);
  --foreground: oklch(0.95 0.01 95);
  --card: oklch(0.2 0.02 260);
  --card-foreground: oklch(0.95 0.01 95);
  --muted: oklch(0.26 0.02 260);
  --muted-foreground: oklch(0.75 0.01 260);
  --border: oklch(0.3 0.02 260);
}

@theme inline {
  --font-sans: var(--font-inter);
  --font-display: var(--font-newsreader);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-ring: var(--ring);
}

body {
  background:
    radial-gradient(circle at top, rgba(59, 130, 246, 0.08), transparent 30%),
    var(--background);
}
```

- [ ] **Step 6: Install packages, generate base shadcn components, and verify the baseline**

```bash
npm install
npx shadcn@latest add button input textarea form label card badge avatar dropdown-menu dialog sheet tabs tooltip select separator skeleton scroll-area command
npm run lint
npm run typecheck
npm run test
```

Expected:

- `npm install` completes without peer dependency conflicts
- shadcn generates `components/ui/*` files
- lint/typecheck/test complete successfully on the new baseline

- [ ] **Step 7: Commit the foundation**

```bash
git add package.json package-lock.json components.json vitest.config.ts tests/setup.ts app/layout.tsx app/providers.tsx app/globals.css lib/utils.ts components/ui
git commit -m "chore: add app foundation and UI tooling"
```

## Task 2: Environment Validation and Supabase SSR Plumbing

**Files:**
- Create: `.env.example`
- Create: `lib/env.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/admin.ts`
- Create: `lib/supabase/middleware.ts`
- Create: `middleware.ts`
- Test: `tests/unit/env.test.ts`

- [ ] **Step 1: Write the failing environment validation test**

```ts
import { describe, expect, it } from "vitest";
import { envSchema } from "@/lib/env";

describe("envSchema", () => {
  it("requires the public Supabase variables", () => {
    expect(() =>
      envSchema.parse({
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toThrow();
  });

  it("accepts the full Note Warehouse environment", () => {
    expect(
      envSchema.parse({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toMatchObject({
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
  });
});
```

- [ ] **Step 2: Run the test to confirm the module is missing**

```bash
npm run test -- tests/unit/env.test.ts
```

Expected:

- Vitest fails because `@/lib/env` does not exist yet

- [ ] **Step 3: Implement the environment schema and example file**

```ts
// lib/env.ts
import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});
```

```dotenv
# .env.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

- [ ] **Step 4: Add the Supabase browser, server, admin, and middleware helpers**

```ts
// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });
}
```

```ts
// lib/supabase/client.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
```

```ts
// lib/supabase/admin.ts
import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

export const supabaseAdmin = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
```

```ts
// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/auth");
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/notes") || pathname.startsWith("/search") || pathname.startsWith("/settings") || pathname.startsWith("/profile") || pathname.startsWith("/favorites") || pathname.startsWith("/archived") || pathname.startsWith("/folders") || pathname.startsWith("/tags") || pathname.startsWith("/collections");

  if (!user && isProtectedRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthRoute) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}
```

```ts
// middleware.ts
import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

- [ ] **Step 5: Re-run the unit test and verify the auth plumbing type-checks**

```bash
npm run test -- tests/unit/env.test.ts
npm run typecheck
```

Expected:

- `tests/unit/env.test.ts` passes
- `tsc --noEmit` succeeds

- [ ] **Step 6: Commit the Supabase plumbing**

```bash
git add .env.example lib/env.ts lib/supabase middleware.ts tests/unit/env.test.ts
git commit -m "feat: add Supabase SSR environment setup"
```

## Task 3: Database Schema, RLS, and Seed Data

**Files:**
- Create: `supabase/migrations/20260412150000_note_warehouse_init.sql`
- Create: `supabase/seed.sql`
- Create: `types/database.ts`

- [ ] **Step 1: Create the migration skeleton with extensions, triggers, and profile tables**

```sql
create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  bio text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  theme text not null default 'system',
  editor_mode text not null default 'split',
  editor_width text not null default 'comfortable',
  sidebar_collapsed boolean not null default false,
  command_palette_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, coalesce(new.email, ''), new.raw_user_meta_data ->> 'display_name');

  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

- [ ] **Step 2: Extend the migration with organization and note tables**

```sql
create table public.folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name),
  unique (user_id, slug)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name),
  unique (user_id, slug)
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, name),
  unique (user_id, slug)
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  title text not null,
  slug text not null,
  content_md text not null default '',
  excerpt text,
  cover_icon text,
  visibility text not null default 'private',
  is_pinned boolean not null default false,
  is_favorite boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content_md, '')), 'C')
  ) stored,
  unique (user_id, slug)
);

create table public.note_tags (
  note_id uuid not null references public.notes(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (note_id, tag_id)
);

create table public.note_collections (
  note_id uuid not null references public.notes(id) on delete cascade,
  collection_id uuid not null references public.collections(id) on delete cascade,
  primary key (note_id, collection_id)
);

create table public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  query text not null,
  filters jsonb not null default '{}'::jsonb,
  last_used_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
```

- [ ] **Step 3: Add updated-at triggers, indexes, RLS policies, and the search RPC**

```sql
create index notes_user_updated_idx on public.notes (user_id, updated_at desc);
create index notes_user_archived_idx on public.notes (user_id, archived_at);
create index notes_user_favorite_idx on public.notes (user_id, is_favorite);
create index notes_user_pinned_idx on public.notes (user_id, is_pinned);
create index notes_search_document_idx on public.notes using gin (search_document);
create index notes_title_trgm_idx on public.notes using gin (title gin_trgm_ops);
create index search_history_user_last_used_idx on public.search_history (user_id, last_used_at desc);

create trigger set_profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger set_user_preferences_updated_at before update on public.user_preferences for each row execute procedure public.set_updated_at();
create trigger set_folders_updated_at before update on public.folders for each row execute procedure public.set_updated_at();
create trigger set_tags_updated_at before update on public.tags for each row execute procedure public.set_updated_at();
create trigger set_collections_updated_at before update on public.collections for each row execute procedure public.set_updated_at();
create trigger set_notes_updated_at before update on public.notes for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.folders enable row level security;
alter table public.tags enable row level security;
alter table public.collections enable row level security;
alter table public.notes enable row level security;
alter table public.note_tags enable row level security;
alter table public.note_collections enable row level security;
alter table public.search_history enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "preferences_all_own" on public.user_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "folders_all_own" on public.folders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tags_all_own" on public.tags for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "collections_all_own" on public.collections for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes_all_own" on public.notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "search_history_all_own" on public.search_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "note_tags_own" on public.note_tags for all using (
  exists (select 1 from public.notes n where n.id = note_id and n.user_id = auth.uid())
) with check (
  exists (select 1 from public.notes n where n.id = note_id and n.user_id = auth.uid())
);
create policy "note_collections_own" on public.note_collections for all using (
  exists (select 1 from public.notes n where n.id = note_id and n.user_id = auth.uid())
) with check (
  exists (select 1 from public.notes n where n.id = note_id and n.user_id = auth.uid())
);

create or replace function public.search_notes(
  p_query text,
  p_include_archived boolean default false,
  p_folder_slug text default null,
  p_collection_slug text default null,
  p_tag_slug text default null,
  p_only_favorites boolean default false,
  p_only_pinned boolean default false
)
returns table (
  id uuid,
  slug text,
  title text,
  excerpt text,
  content_md text,
  updated_at timestamptz,
  is_favorite boolean,
  is_pinned boolean,
  rank real
)
language sql
security invoker
as $$
  with current_user as (
    select auth.uid() as user_id
  ),
  query_input as (
    select
      case
        when p_query like '%"%' then phraseto_tsquery('english', replace(p_query, '"', ''))
        else websearch_to_tsquery('english', p_query)
      end as ts_query
  )
  select
    n.id,
    n.slug,
    n.title,
    n.excerpt,
    n.content_md,
    n.updated_at,
    n.is_favorite,
    n.is_pinned,
    ts_rank_cd(n.search_document, query_input.ts_query) as rank
  from public.notes n
  cross join current_user
  cross join query_input
  left join public.folders f on f.id = n.folder_id
  where
    n.user_id = current_user.user_id
    and (p_include_archived or n.archived_at is null)
    and (p_folder_slug is null or f.slug = p_folder_slug)
    and (not p_only_favorites or n.is_favorite)
    and (not p_only_pinned or n.is_pinned)
    and (
      p_collection_slug is null
      or exists (
        select 1
        from public.note_collections nc
        join public.collections c on c.id = nc.collection_id
        where nc.note_id = n.id and c.slug = p_collection_slug
      )
    )
    and (
      p_tag_slug is null
      or exists (
        select 1
        from public.note_tags nt
        join public.tags t on t.id = nt.tag_id
        where nt.note_id = n.id and t.slug = p_tag_slug
      )
    )
    and n.search_document @@ query_input.ts_query
  order by rank desc, n.updated_at desc;
$$;
```

- [ ] **Step 4: Add a deterministic seed for the first local user**

```sql
do $$
declare
  seed_user uuid;
  intro_folder uuid := gen_random_uuid();
  intro_collection uuid := gen_random_uuid();
  intro_note uuid := gen_random_uuid();
begin
  select id into seed_user from public.profiles order by created_at asc limit 1;

  if seed_user is null then
    return;
  end if;

  insert into public.folders (id, user_id, name, slug, description, color)
  values (intro_folder, seed_user, 'Study', 'study', 'Core study materials', 'blue')
  on conflict (user_id, slug) do nothing;

  insert into public.collections (id, user_id, name, slug, description, is_pinned)
  values (intro_collection, seed_user, 'Pinned Reads', 'pinned-reads', 'Frequently revisited notes', true)
  on conflict (user_id, slug) do nothing;

  insert into public.notes (id, user_id, folder_id, title, slug, excerpt, content_md, cover_icon, is_pinned)
  values (
    intro_note,
    seed_user,
    intro_folder,
    'Welcome to Note Warehouse',
    'welcome-to-note-warehouse',
    'Your first seeded note.',
    '# Welcome to Note Warehouse

This vault is ready for Markdown notes, search, and collections.

- Create notes
- Organize with folders and tags
- Search everything instantly',
    '📦',
    true
  )
  on conflict (user_id, slug) do nothing;

  insert into public.note_collections (note_id, collection_id)
  values (intro_note, intro_collection)
  on conflict do nothing;
end $$;
```

- [ ] **Step 5: Reset the local database, generate types, and verify the schema**

```bash
supabase db reset
supabase gen types typescript --local > types/database.ts
git diff -- supabase/migrations/20260412150000_note_warehouse_init.sql supabase/seed.sql types/database.ts
```

Expected:

- `supabase db reset` succeeds without RLS or SQL errors
- `types/database.ts` contains the `profiles`, `notes`, `folders`, `tags`, `collections`, `note_tags`, `note_collections`, and `search_history` tables

- [ ] **Step 6: Commit the schema**

```bash
git add supabase/migrations/20260412150000_note_warehouse_init.sql supabase/seed.sql types/database.ts
git commit -m "feat: add Note Warehouse database schema"
```

## Task 4: Shared Utilities and Validation Schemas

**Files:**
- Create: `tests/unit/utils/slugify.test.ts`
- Create: `tests/unit/markdown/reading-time.test.ts`
- Create: `tests/unit/markdown/toc.test.ts`
- Create: `lib/markdown/reading-time.ts`
- Create: `lib/markdown/toc.ts`
- Modify: `lib/utils.ts`
- Create: `lib/validators/auth.ts`
- Create: `lib/validators/notes.ts`
- Create: `lib/validators/organization.ts`
- Create: `lib/validators/preferences.ts`

- [ ] **Step 1: Write the failing utility tests**

```ts
// tests/unit/utils/slugify.test.ts
import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("normalizes titles into URL-safe slugs", () => {
    expect(slugify("Linear Algebra Notes")).toBe("linear-algebra-notes");
  });

  it("collapses duplicate separators", () => {
    expect(slugify("Graphs  --  Trees")).toBe("graphs-trees");
  });
});
```

```ts
// tests/unit/markdown/reading-time.test.ts
import { describe, expect, it } from "vitest";
import { getReadingTime } from "@/lib/markdown/reading-time";

describe("getReadingTime", () => {
  it("returns a minimum of one minute", () => {
    expect(getReadingTime("short note")).toEqual({ minutes: 1, words: 2 });
  });
});
```

```ts
// tests/unit/markdown/toc.test.ts
import { describe, expect, it } from "vitest";
import { extractTableOfContents } from "@/lib/markdown/toc";

describe("extractTableOfContents", () => {
  it("extracts H2 and H3 headings in order", () => {
    const markdown = "# Title\n\n## Section A\n\n### Detail\n";
    expect(extractTableOfContents(markdown)).toEqual([
      { id: "section-a", level: 2, text: "Section A" },
      { id: "detail", level: 3, text: "Detail" },
    ]);
  });
});
```

- [ ] **Step 2: Run the targeted tests to confirm the missing implementations**

```bash
npm run test -- tests/unit/utils/slugify.test.ts tests/unit/markdown/reading-time.test.ts tests/unit/markdown/toc.test.ts
```

Expected:

- The three test files fail because the functions are missing

- [ ] **Step 3: Implement the utility functions**

```ts
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
```

```ts
// lib/markdown/reading-time.ts
export function getReadingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));

  return { minutes, words };
}
```

```ts
// lib/markdown/toc.ts
import { slugify } from "@/lib/utils";

export type TocItem = { id: string; level: 2 | 3; text: string };

export function extractTableOfContents(markdown: string): TocItem[] {
  return markdown
    .split("\n")
    .map((line) => line.match(/^(##|###)\s+(.*)$/))
    .filter(Boolean)
    .map((match) => {
      const hashes = match![1];
      const text = match![2].trim();
      return {
        id: slugify(text),
        level: hashes.length as 2 | 3,
        text,
      };
    });
}
```

- [ ] **Step 4: Add Zod schemas for auth, notes, organization, and preferences**

```ts
// lib/validators/auth.ts
import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

```ts
// lib/validators/notes.ts
import { z } from "zod";

export const noteFormSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().min(1).max(140),
  excerpt: z.string().max(240).optional().or(z.literal("")),
  content_md: z.string().min(1),
  cover_icon: z.string().max(16).optional().or(z.literal("")),
  folder_id: z.string().uuid().nullable(),
  tag_ids: z.array(z.string().uuid()).default([]),
  collection_ids: z.array(z.string().uuid()).default([]),
  is_favorite: z.boolean().default(false),
  is_pinned: z.boolean().default(false),
  visibility: z.enum(["private"]).default("private"),
});
```

```ts
// lib/validators/organization.ts
import { z } from "zod";

export const folderSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(100),
  description: z.string().max(180).optional().or(z.literal("")),
  color: z.string().max(24).optional().or(z.literal("")),
});

export const tagSchema = z.object({
  name: z.string().min(1).max(40),
  slug: z.string().min(1).max(60),
  color: z.string().max(24).optional().or(z.literal("")),
});

export const collectionSchema = z.object({
  name: z.string().min(1).max(80),
  slug: z.string().min(1).max(100),
  description: z.string().max(180).optional().or(z.literal("")),
  is_pinned: z.boolean().default(false),
});
```

```ts
// lib/validators/preferences.ts
import { z } from "zod";

export const preferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  editor_mode: z.enum(["edit", "preview", "split"]),
  editor_width: z.enum(["compact", "comfortable", "wide"]),
  sidebar_collapsed: z.boolean(),
  command_palette_enabled: z.boolean(),
});
```

- [ ] **Step 5: Re-run the tests and confirm validation types compile**

```bash
npm run test -- tests/unit/utils/slugify.test.ts tests/unit/markdown/reading-time.test.ts tests/unit/markdown/toc.test.ts
npm run typecheck
```

Expected:

- utility tests pass
- schemas compile cleanly

- [ ] **Step 6: Commit the shared utility layer**

```bash
git add lib/utils.ts lib/markdown lib/validators tests/unit/utils tests/unit/markdown
git commit -m "feat: add Note Warehouse utility and validation layer"
```

## Task 5: Authentication, Profile, and Onboarding Flow

**Files:**
- Create: `tests/components/auth/auth-form.test.tsx`
- Create: `lib/actions/auth.ts`
- Create: `lib/actions/profile.ts`
- Create: `lib/queries/profile.ts`
- Create: `components/forms/auth-form.tsx`
- Create: `components/forms/profile-form.tsx`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/signup/page.tsx`
- Create: `app/auth/callback/route.ts`
- Create: `app/(app)/profile/page.tsx`

- [ ] **Step 1: Write the failing auth form component test**

```tsx
import { render, screen } from "@testing-library/react";
import { AuthForm } from "@/components/forms/auth-form";

describe("AuthForm", () => {
  it("renders email and password inputs", () => {
    render(<AuthForm mode="login" />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders the correct submit label", () => {
    render(<AuthForm mode="signup" />);

    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement auth actions and the shared form component**

```ts
// lib/actions/auth.ts
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validators/auth";

export async function loginAction(formData: FormData) {
  const values = authSchema.parse(Object.fromEntries(formData));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(values);
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function signupAction(formData: FormData) {
  const values = authSchema.parse(Object.fromEntries(formData));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp(values);
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
```

```tsx
// components/forms/auth-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginAction, signupAction } from "@/lib/actions/auth";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  const action = mode === "login" ? loginAction : signupAction;

  return (
    <Form {...form}>
      <form action={action} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl><Input type="email" autoComplete="email" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl><Input type="password" autoComplete="current-password" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
```

- [ ] **Step 3: Add the login, signup, and callback routes**

```tsx
// app/(auth)/login/page.tsx
import { AuthForm } from "@/components/forms/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md items-center px-6">
      <section className="w-full rounded-3xl border bg-card p-8 shadow-sm">
        <h1 className="font-display text-4xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to your Markdown vault.</p>
        <div className="mt-8">
          <AuthForm mode="login" />
        </div>
      </section>
    </main>
  );
}
```

```tsx
// app/(auth)/signup/page.tsx
import { AuthForm } from "@/components/forms/auth-form";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md items-center px-6">
      <section className="w-full rounded-3xl border bg-card p-8 shadow-sm">
        <h1 className="font-display text-4xl">Create your vault</h1>
        <p className="mt-2 text-sm text-muted-foreground">Start storing study notes and personal knowledge.</p>
        <div className="mt-8">
          <AuthForm mode="signup" />
        </div>
      </section>
    </main>
  );
}
```

```ts
// app/auth/callback/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const response = NextResponse.redirect(new URL(redirectTo, request.url));
    const supabase = createServerClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    await supabase.auth.exchangeCodeForSession(code);
    return response;
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
```

- [ ] **Step 4: Add profile query, profile action, and the first-run onboarding gate**

```ts
// lib/queries/profile.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getCurrentProfile() {
  const supabase = await createSupabaseServerClient();
  const { data: userResult } = await supabase.auth.getUser();
  const user = userResult.user;
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
}
```

```ts
// lib/actions/profile.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const payload = {
    display_name: String(formData.get("display_name") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    onboarding_completed: true,
  };

  const { error } = await supabase.from("profiles").update(payload).eq("id", user.id);
  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
```

```tsx
// app/(app)/profile/page.tsx
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/forms/profile-form";
import { getCurrentProfile } from "@/lib/queries/profile";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <header className="space-y-2">
        <h1 className="font-display text-4xl">Profile</h1>
        <p className="text-muted-foreground">Complete your profile to personalize the vault.</p>
      </header>
      <ProfileForm profile={profile} />
    </div>
  );
}
```

```tsx
// components/forms/profile-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { updateProfileAction } from "@/lib/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProfileForm({
  profile,
}: {
  profile: { display_name: string | null; bio: string | null };
}) {
  const form = useForm({
    defaultValues: {
      display_name: profile.display_name ?? "",
      bio: profile.bio ?? "",
    },
  });

  return (
    <form action={updateProfileAction} className="space-y-4 rounded-3xl border bg-card p-6">
      <div className="space-y-2">
        <label htmlFor="display_name" className="text-sm font-medium">Display name</label>
        <Input id="display_name" {...form.register("display_name")} />
      </div>
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">Bio</label>
        <Textarea id="bio" rows={5} {...form.register("bio")} />
      </div>
      <Button type="submit">Save profile</Button>
    </form>
  );
}
```

- [ ] **Step 5: Run the auth test and manually verify the redirect loop is gone**

```bash
npm run test -- tests/components/auth/auth-form.test.tsx
npm run typecheck
```

Expected:

- the auth form test passes
- protected routes redirect unauthenticated users to `/login`
- authenticated users reach `/dashboard` and can update `/profile`

- [ ] **Step 6: Commit the auth layer**

```bash
git add app/(auth) app/auth/callback lib/actions/auth.ts lib/actions/profile.ts lib/queries/profile.ts components/forms/auth-form.tsx components/forms/profile-form.tsx tests/components/auth/auth-form.test.tsx
git commit -m "feat: add authentication and profile flows"
```

## Task 6: Marketing Page, App Shell, and Dashboard

**Files:**
- Modify: `app/page.tsx` by moving marketing content into `app/(marketing)/page.tsx`
- Create: `app/(marketing)/page.tsx`
- Create: `app/(app)/layout.tsx`
- Create: `app/(app)/dashboard/page.tsx`
- Create: `components/app/app-shell.tsx`
- Create: `components/app/sidebar.tsx`
- Create: `components/app/topbar.tsx`
- Create: `components/app/theme-toggle.tsx`
- Create: `app/not-found.tsx`
- Create: `tests/components/app/sidebar.test.tsx`
- Create: `lib/queries/dashboard.ts`

- [ ] **Step 1: Write the failing sidebar test**

```tsx
import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/app/sidebar";

describe("Sidebar", () => {
  it("renders the primary app destinations", () => {
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /notes/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /collections/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Build the marketing landing page and not-found state**

```tsx
// app/(marketing)/page.tsx
import Link from "next/link";

export default function MarketingPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-16">
      <section className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.28em] text-muted-foreground">Markdown vault</p>
          <h1 className="max-w-3xl font-display text-6xl leading-none tracking-tight">Store every note like it belongs in a library you trust.</h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Note Warehouse is a calm, searchable knowledge vault for README-style study notes, long-form references, and personal research.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="rounded-full bg-primary px-6 py-3 text-primary-foreground">Create your vault</Link>
            <Link href="/login" className="rounded-full border px-6 py-3">Sign in</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
```

```tsx
// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-5xl">Shelf not found</h1>
      <p className="mt-3 text-muted-foreground">The page or note you requested does not exist in this vault.</p>
      <Link href="/dashboard" className="mt-6 rounded-full bg-primary px-5 py-3 text-primary-foreground">
        Return to dashboard
      </Link>
    </main>
  );
}
```

- [ ] **Step 3: Implement the shared authenticated shell**

```tsx
// components/app/sidebar.tsx
import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/notes", label: "Notes" },
  { href: "/folders", label: "Folders" },
  { href: "/tags", label: "Tags" },
  { href: "/collections", label: "Collections" },
  { href: "/favorites", label: "Favorites" },
  { href: "/archived", label: "Archived" },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-72 flex-col border-r bg-card/80 p-4">
      <Link href="/dashboard" className="font-display text-2xl">Note Warehouse</Link>
      <nav className="mt-8 space-y-1">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="flex rounded-2xl px-4 py-3 text-sm hover:bg-muted">
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

```tsx
// components/app/topbar.tsx
import { GlobalSearch } from "@/components/search/global-search";
import { ThemeToggle } from "@/components/app/theme-toggle";

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b bg-background/80 px-6 py-4 backdrop-blur">
      <GlobalSearch />
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
```

```tsx
// app/(app)/layout.tsx
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app/app-shell";
import { getCurrentProfile } from "@/lib/queries/profile";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  return <AppShell onboardingCompleted={profile.onboarding_completed}>{children}</AppShell>;
}
```

```tsx
// components/app/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
    </Button>
  );
}
```

```tsx
// components/app/app-shell.tsx
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

export function AppShell({
  children,
  onboardingCompleted,
}: {
  children: React.ReactNode;
  onboardingCompleted: boolean;
}) {
  return (
    <div className="flex min-h-dvh bg-background">
      <Sidebar />
      <div className="flex min-h-dvh flex-1 flex-col">
        <Topbar />
        {!onboardingCompleted && (
          <div className="border-b bg-accent/10 px-6 py-3 text-sm text-muted-foreground">
            Complete your profile to finish setting up your vault.
          </div>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement dashboard data and the dashboard page**

```ts
// lib/queries/dashboard.ts
import { subDays } from "date-fns";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getDashboardData() {
  const supabase = await createSupabaseServerClient();
  const now = new Date();

  const [{ data: notes }, { data: favorites }, { data: collections }, { data: recentTags }] = await Promise.all([
    supabase.from("notes").select("id, title, slug, updated_at, is_favorite, is_pinned").is("archived_at", null).order("updated_at", { ascending: false }).limit(6),
    supabase.from("notes").select("id, title, slug, updated_at").eq("is_favorite", true).is("archived_at", null).limit(5),
    supabase.from("collections").select("id, name, slug, is_pinned").eq("is_pinned", true).limit(5),
    supabase.from("tags").select("id, name, slug").limit(10),
  ]);

  return {
    totalNotes: notes?.length ?? 0,
    recentNotes: notes ?? [],
    favoriteNotes: favorites ?? [],
    pinnedCollections: collections ?? [],
    tags: recentTags ?? [],
    activityWindowStart: subDays(now, 7).toISOString(),
  };
}
```

```tsx
// app/(app)/dashboard/page.tsx
import { getDashboardData } from "@/lib/queries/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8 px-6 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-5xl">Your vault</h1>
        <p className="text-muted-foreground">Everything important, ready to be found again.</p>
      </header>
      <section className="grid gap-4 lg:grid-cols-4">
        <article className="rounded-3xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total notes</p>
          <p className="mt-3 text-4xl font-semibold">{data.totalNotes}</p>
        </article>
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Run the sidebar test and manually verify the shell**

```bash
npm run test -- tests/components/app/sidebar.test.tsx
npm run typecheck
```

Expected:

- sidebar test passes
- `/dashboard` renders inside the app shell with a sidebar and top bar

- [ ] **Step 6: Commit the shell and dashboard**

```bash
git add app/(marketing) app/(app)/layout.tsx app/(app)/dashboard components/app app/not-found.tsx lib/queries/dashboard.ts tests/components/app/sidebar.test.tsx
git commit -m "feat: add marketing page and authenticated shell"
```

## Task 7: Note Queries and Server Actions

**Files:**
- Create: `lib/queries/notes.ts`
- Create: `lib/actions/notes.ts`
- Modify: `lib/validators/notes.ts`

- [ ] **Step 1: Add the note query module for lists, detail pages, related notes, and neighboring notes**

```ts
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getNotesList(options?: { archived?: boolean; favorites?: boolean; query?: string }) {
  const supabase = await createSupabaseServerClient();
  let builder = supabase.from("notes").select("id, title, slug, excerpt, updated_at, is_pinned, is_favorite, archived_at").order("updated_at", { ascending: false });

  builder = options?.archived ? builder.not("archived_at", "is", null) : builder.is("archived_at", null);
  if (options?.favorites) builder = builder.eq("is_favorite", true);
  if (options?.query) builder = builder.ilike("title", `%${options.query}%`);

  const { data } = await builder;
  return data ?? [];
}

export async function getNoteBySlug(slug: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("notes")
    .select("*, folders(id, name, slug), note_tags(tags(id, name, slug)), note_collections(collections(id, name, slug))")
    .eq("slug", slug)
    .single();

  if (!data) notFound();
  return data;
}

export async function getRelatedNotes(noteId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("note_tags").select("tag_id").eq("note_id", noteId);
  const tagIds = (data ?? []).map((row) => row.tag_id);
  if (!tagIds.length) return [];

  const { data: related } = await supabase
    .from("note_tags")
    .select("notes(id, title, slug, updated_at)")
    .neq("note_id", noteId)
    .in("tag_id", tagIds)
    .limit(4);

  return (related ?? []).map((row) => row.notes).filter(Boolean);
}
```

- [ ] **Step 2: Implement the server actions for create, update, archive, restore, duplicate, favorite, and pin**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { noteFormSchema } from "@/lib/validators/notes";
import { slugify } from "@/lib/utils";

export async function createNoteAction(input: unknown) {
  const payload = input instanceof FormData
    ? {
        ...Object.fromEntries(input),
        folder_id: input.get("folder_id") || null,
        tag_ids: JSON.parse(String(input.get("tag_ids") ?? "[]")),
        collection_ids: JSON.parse(String(input.get("collection_ids") ?? "[]")),
        is_favorite: input.get("is_favorite") === "true",
        is_pinned: input.get("is_pinned") === "true",
      }
    : input;

  const values = noteFormSchema.parse(payload);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const payload = {
    ...values,
    user_id: user.id,
    slug: values.slug || slugify(values.title),
  };

  const { data, error } = await supabase.from("notes").insert(payload).select("slug").single();
  if (error) return { error: error.message };

  revalidatePath("/notes");
  revalidatePath("/dashboard");
  if (input instanceof FormData) redirect(`/notes/${data.slug}/edit`);
  return { slug: data.slug };
}

export async function archiveNoteAction(noteId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("notes").update({ archived_at: new Date().toISOString() }).eq("id", noteId);
  if (error) return { error: error.message };
  revalidatePath("/notes");
  revalidatePath("/archived");
  return { success: true };
}

export async function restoreNoteAction(noteId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("notes").update({ archived_at: null }).eq("id", noteId);
  if (error) return { error: error.message };
  revalidatePath("/notes");
  revalidatePath("/archived");
  return { success: true };
}

export async function toggleFavoriteAction(noteId: string, nextValue: boolean) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("notes").update({ is_favorite: nextValue }).eq("id", noteId);
  revalidatePath("/favorites");
  revalidatePath("/notes");
}

export async function togglePinnedAction(noteId: string, nextValue: boolean) {
  const supabase = await createSupabaseServerClient();
  await supabase.from("notes").update({ is_pinned: nextValue }).eq("id", noteId);
  revalidatePath("/dashboard");
  revalidatePath("/notes");
}
```

- [ ] **Step 3: Add duplicate and permanent delete actions**

```ts
export async function duplicateNoteAction(noteId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: original } = await supabase.from("notes").select("*").eq("id", noteId).single();
  if (!original) return { error: "Note not found" };

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: original.user_id,
      folder_id: original.folder_id,
      title: `${original.title} Copy`,
      slug: `${original.slug}-copy-${Date.now()}`,
      content_md: original.content_md,
      excerpt: original.excerpt,
      cover_icon: original.cover_icon,
      visibility: original.visibility,
    })
    .select("slug")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/notes");
  return { slug: data.slug };
}

export async function deleteNoteAction(noteId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("notes").delete().eq("id", noteId);
  if (error) return { error: error.message };
  revalidatePath("/notes");
  revalidatePath("/archived");
  return { success: true };
}
```

- [ ] **Step 4: Type-check the data layer and manually create one note through the action**

```bash
npm run typecheck
```

Expected:

- note query and action modules compile
- creating a note returns a new slug and the dashboard count increases

- [ ] **Step 5: Commit the note data layer**

```bash
git add lib/queries/notes.ts lib/actions/notes.ts lib/validators/notes.ts
git commit -m "feat: add note query and action layer"
```

## Task 8: Markdown Reader, Editor, and Note Pages

**Files:**
- Create: `tests/components/editor/note-editor.test.tsx`
- Create: `components/editor/editor-shell.tsx`
- Create: `components/editor/note-editor.tsx`
- Create: `components/editor/markdown-toolbar.tsx`
- Create: `components/editor/autosave-status.tsx`
- Create: `components/notes/note-list.tsx`
- Create: `components/notes/note-card.tsx`
- Create: `components/notes/note-reader.tsx`
- Create: `components/notes/note-actions.tsx`
- Create: `components/notes/related-notes.tsx`
- Create: `hooks/use-note-autosave.ts`
- Create: `lib/markdown/render.tsx`
- Create: `app/(app)/notes/page.tsx`
- Create: `app/(app)/notes/new/page.tsx`
- Create: `app/(app)/notes/[noteSlug]/page.tsx`
- Create: `app/(app)/notes/[noteSlug]/edit/page.tsx`
- Create: `app/(app)/favorites/page.tsx`
- Create: `app/(app)/archived/page.tsx`

- [ ] **Step 1: Write the failing editor toolbar test**

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { NoteEditor } from "@/components/editor/note-editor";

describe("NoteEditor", () => {
  it("inserts bold Markdown around the current selection", () => {
    render(<NoteEditor initialValue="hello" noteId={null} />);

    const textarea = screen.getByRole("textbox");
    fireEvent.select(textarea, { target: { selectionStart: 0, selectionEnd: 5 } });
    fireEvent.click(screen.getByRole("button", { name: /bold/i }));

    expect(textarea).toHaveValue("**hello**");
  });
});
```

- [ ] **Step 2: Implement the Markdown renderer and reader component**

```tsx
// lib/markdown/render.tsx
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
```

```tsx
// components/notes/note-reader.tsx
import { MarkdownRenderer } from "@/lib/markdown/render";
import { getReadingTime } from "@/lib/markdown/reading-time";
import { extractTableOfContents } from "@/lib/markdown/toc";

export function NoteReader({ title, content }: { title: string; content: string }) {
  const stats = getReadingTime(content);
  const toc = extractTableOfContents(content);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
      <section className="space-y-8">
        <header className="space-y-3">
          <h1 className="font-display text-5xl">{title}</h1>
          <p className="text-sm text-muted-foreground">{stats.words} words · {stats.minutes} min read</p>
        </header>
        <MarkdownRenderer content={content} />
      </section>
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-3xl border bg-card p-5">
          <h2 className="text-sm font-medium">On this page</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {toc.map((item) => (
              <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
                <a href={`#${item.id}`}>{item.text}</a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
```

- [ ] **Step 3: Implement the editor shell with toolbar, preview modes, and autosave state**

```tsx
// components/editor/markdown-toolbar.tsx
"use client";

import { Button } from "@/components/ui/button";

const tools = [
  { label: "Bold", wrap: "**" },
  { label: "Italic", wrap: "_" },
  { label: "Code", wrap: "`" },
  { label: "Quote", prefix: "> " },
  { label: "List", prefix: "- " },
];

export function MarkdownToolbar({
  value,
  onChange,
  mode,
  onModeChange,
}: {
  value: string;
  onChange: (next: string) => void;
  mode: "edit" | "preview" | "split";
  onModeChange: (mode: "edit" | "preview" | "split") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tools.map((tool) => (
        <Button
          key={tool.label}
          type="button"
          variant="outline"
          onClick={() => onChange(`${tool.wrap ?? tool.prefix ?? ""}${value}${tool.wrap ?? ""}`)}
        >
          {tool.label}
        </Button>
      ))}
      <div className="ml-auto flex gap-2">
        <Button type="button" variant={mode === "edit" ? "default" : "outline"} onClick={() => onModeChange("edit")}>Edit</Button>
        <Button type="button" variant={mode === "preview" ? "default" : "outline"} onClick={() => onModeChange("preview")}>Preview</Button>
        <Button type="button" variant={mode === "split" ? "default" : "outline"} onClick={() => onModeChange("split")}>Split</Button>
      </div>
    </div>
  );
}
```

```tsx
// hooks/use-note-autosave.ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useNoteAutosave<T>(value: T, onSave: (value: T) => Promise<void>, enabled: boolean) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    setStatus("saving");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      await onSave(value);
      setStatus("saved");
    }, 900);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [enabled, onSave, value]);

  return status;
}
```

```tsx
// components/editor/note-editor.tsx
"use client";

import { useState } from "react";
import { MarkdownRenderer } from "@/lib/markdown/render";
import { useNoteAutosave } from "@/hooks/use-note-autosave";
import { MarkdownToolbar } from "@/components/editor/markdown-toolbar";

export function NoteEditor({ initialValue, noteId }: { initialValue: string; noteId: string | null }) {
  const [content, setContent] = useState(initialValue);
  const [mode, setMode] = useState<"edit" | "preview" | "split">("split");

  const status = useNoteAutosave(
    { content },
    async () => {
      if (!noteId) return;
      await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        body: JSON.stringify({ content_md: content }),
      });
    },
    Boolean(noteId),
  );

  return (
    <div className="space-y-4">
      <MarkdownToolbar value={content} onChange={setContent} mode={mode} onModeChange={setMode} />
      <p className="text-xs text-muted-foreground">Autosave: {status}</p>
      <div className={mode === "split" ? "grid gap-4 lg:grid-cols-2" : ""}>
        {mode !== "preview" && (
          <textarea
            aria-label="Note content"
            className="min-h-[60dvh] w-full rounded-3xl border bg-card p-5"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        )}
        {mode !== "edit" && (
          <div className="min-h-[60dvh] rounded-3xl border bg-card p-5">
            <MarkdownRenderer content={content} />
          </div>
        )}
      </div>
    </div>
  );
}
```

```tsx
// components/editor/autosave-status.tsx
export function AutosaveStatus({ status }: { status: "idle" | "saving" | "saved" }) {
  return <p className="text-xs text-muted-foreground">Autosave: {status}</p>;
}
```

```tsx
// components/editor/editor-shell.tsx
import { AutosaveStatus } from "@/components/editor/autosave-status";

export function EditorShell({
  title,
  status,
  children,
}: {
  title: string;
  status: "idle" | "saving" | "saved";
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl">{title}</h1>
          <p className="text-sm text-muted-foreground">Write in Markdown and preview in real time.</p>
        </div>
        <AutosaveStatus status={status} />
      </header>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create the list, reader, and editor routes**

```tsx
// app/(app)/notes/page.tsx
import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";

export default async function NotesPage() {
  const notes = await getNotesList();
  return <NoteList title="All notes" notes={notes} />;
}
```

```tsx
// components/notes/note-card.tsx
import Link from "next/link";

export function NoteCard({
  note,
}: {
  note: { id: string; title: string; slug: string; excerpt: string | null; updated_at: string };
}) {
  return (
    <Link href={`/notes/${note.slug}`} className="block rounded-3xl border bg-card p-5 transition hover:border-accent">
      <h2 className="font-medium">{note.title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{note.excerpt ?? "No summary yet."}</p>
      <p className="mt-4 text-xs text-muted-foreground">Updated {new Date(note.updated_at).toLocaleDateString()}</p>
    </Link>
  );
}
```

```tsx
// components/notes/note-list.tsx
import { NoteCard } from "@/components/notes/note-card";

export function NoteList({
  title,
  notes,
}: {
  title: string;
  notes: Array<{ id: string; title: string; slug: string; excerpt: string | null; updated_at: string }>;
}) {
  return (
    <div className="space-y-6 px-6 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl">{title}</h1>
        <p className="text-muted-foreground">Browse the latest notes in your vault.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
```

```tsx
// app/(app)/favorites/page.tsx
import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";

export default async function FavoritesPage() {
  const notes = await getNotesList({ favorites: true });
  return <NoteList title="Favorites" notes={notes} />;
}
```

```tsx
// app/(app)/archived/page.tsx
import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";

export default async function ArchivedPage() {
  const notes = await getNotesList({ archived: true });
  return <NoteList title="Archived" notes={notes} />;
}
```

```tsx
// app/(app)/notes/[noteSlug]/page.tsx
import { NoteReader } from "@/components/notes/note-reader";
import { NoteActions } from "@/components/notes/note-actions";
import { RelatedNotes } from "@/components/notes/related-notes";
import { getNoteBySlug, getRelatedNotes } from "@/lib/queries/notes";

export default async function NoteDetailPage({ params }: { params: Promise<{ noteSlug: string }> }) {
  const { noteSlug } = await params;
  const note = await getNoteBySlug(noteSlug);
  const related = await getRelatedNotes(note.id);

  return (
    <div className="space-y-8 px-6 py-8">
      <NoteActions note={{ id: note.id, slug: note.slug, is_favorite: note.is_favorite, is_pinned: note.is_pinned }} />
      <NoteReader title={note.title} content={note.content_md} />
      <RelatedNotes notes={related} />
    </div>
  );
}
```

```tsx
// components/notes/related-notes.tsx
import Link from "next/link";

export function RelatedNotes({
  notes,
}: {
  notes: Array<{ id: string; title: string; slug: string; updated_at: string }>;
}) {
  if (!notes.length) return null;

  return (
    <section className="rounded-3xl border bg-card p-6">
      <h2 className="text-lg font-medium">Related notes</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {notes.map((note) => (
          <Link key={note.id} href={`/notes/${note.slug}`} className="rounded-2xl border p-4 hover:bg-muted">
            <p className="font-medium">{note.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{new Date(note.updated_at).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

```tsx
// components/notes/note-actions.tsx
import Link from "next/link";
import { archiveNoteAction, toggleFavoriteAction, togglePinnedAction } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";

export function NoteActions({
  note,
}: {
  note: { id: string; slug: string; is_favorite: boolean; is_pinned: boolean };
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={toggleFavoriteAction.bind(null, note.id, !note.is_favorite)}>
        <Button type="submit" variant="outline">
          {note.is_favorite ? "Unfavorite" : "Favorite"}
        </Button>
      </form>
      <form action={togglePinnedAction.bind(null, note.id, !note.is_pinned)}>
        <Button type="submit" variant="outline">
          {note.is_pinned ? "Unpin" : "Pin"}
        </Button>
      </form>
      <form action={archiveNoteAction.bind(null, note.id)}>
        <Button type="submit" variant="outline">
          Archive
        </Button>
      </form>
      <Button asChild variant="default">
        <Link href={`/notes/${note.slug}/edit`}>Edit</Link>
      </Button>
    </div>
  );
}
```

```tsx
// app/(app)/notes/new/page.tsx
import { createNoteAction } from "@/lib/actions/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewNotePage() {
  return (
    <div className="px-6 py-8">
      <header className="mb-6 space-y-2">
        <h1 className="font-display text-4xl">New note</h1>
        <p className="text-muted-foreground">Start in raw Markdown and shape the note as you go.</p>
      </header>
      <form
        action={createNoteAction}
        className="space-y-4 rounded-3xl border bg-card p-6"
      >
        <Input name="title" placeholder="Untitled note" />
        <Input name="slug" placeholder="untitled-note" />
        <Textarea name="excerpt" placeholder="Optional short summary" rows={3} />
        <Textarea name="content_md" placeholder="# Start writing..." rows={18} />
        <input type="hidden" name="folder_id" value="" />
        <input type="hidden" name="cover_icon" value="" />
        <input type="hidden" name="tag_ids" value="[]" />
        <input type="hidden" name="collection_ids" value="[]" />
        <input type="hidden" name="is_favorite" value="false" />
        <input type="hidden" name="is_pinned" value="false" />
        <input type="hidden" name="visibility" value="private" />
        <Button type="submit">Create note</Button>
      </form>
    </div>
  );
}
```

```ts
// app/api/notes/[noteId]/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ noteId: string }> }) {
  const { noteId } = await params;
  const payload = await request.json();
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from("notes")
    .update({ content_md: payload.content_md, updated_at: new Date().toISOString() })
    .eq("id", noteId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
```

```tsx
// app/(app)/notes/[noteSlug]/edit/page.tsx
import { NoteEditor } from "@/components/editor/note-editor";
import { getNoteBySlug } from "@/lib/queries/notes";

export default async function EditNotePage({ params }: { params: Promise<{ noteSlug: string }> }) {
  const { noteSlug } = await params;
  const note = await getNoteBySlug(noteSlug);

  return (
    <div className="px-6 py-8">
      <NoteEditor initialValue={note.content_md} noteId={note.id} />
    </div>
  );
}
```

- [ ] **Step 5: Run the editor test and verify key note flows manually**

```bash
npm run test -- tests/components/editor/note-editor.test.tsx
npm run typecheck
```

Manual checks:

- create a note from `/notes/new`
- edit a note and confirm autosave status changes from `saving` to `saved`
- read a note and confirm the table of contents and reading-time metadata render
- archive and restore a note from the action controls

- [ ] **Step 6: Commit the note UI**

```bash
git add app/(app)/notes app/(app)/favorites app/(app)/archived components/editor components/notes hooks/use-note-autosave.ts lib/markdown/render.tsx tests/components/editor/note-editor.test.tsx
git commit -m "feat: add Markdown note reader and editor flows"
```

## Task 9: Search Parsing, Search Results, and Recent Searches

**Files:**
- Create: `tests/unit/search/parse-search.test.ts`
- Create: `tests/unit/search/highlight.test.ts`
- Create: `tests/components/search/note-filters.test.tsx`
- Create: `lib/search/parse-search.ts`
- Create: `lib/search/highlight.ts`
- Create: `lib/queries/search.ts`
- Create: `lib/actions/search-history.ts`
- Create: `components/notes/note-filters.tsx`
- Create: `components/search/search-results.tsx`
- Create: `components/search/search-highlight.tsx`
- Create: `components/search/global-search.tsx`
- Create: `app/(app)/search/page.tsx`

- [ ] **Step 1: Write the failing search unit tests**

```ts
// tests/unit/search/parse-search.test.ts
import { describe, expect, it } from "vitest";
import { parseSearchInput } from "@/lib/search/parse-search";

describe("parseSearchInput", () => {
  it("detects quoted phrase searches", () => {
    expect(parseSearchInput('"linear algebra"').phrase).toBe("linear algebra");
  });

  it("extracts hash-prefixed tags", () => {
    expect(parseSearchInput("graphs #math").tag).toBe("math");
  });
});
```

```ts
// tests/unit/search/highlight.test.ts
import { describe, expect, it } from "vitest";
import { highlightMatches } from "@/lib/search/highlight";

describe("highlightMatches", () => {
  it("wraps the matched token with mark tags", () => {
    expect(highlightMatches("Binary search trees", "search")).toContain("<mark>search</mark>");
  });
});
```

```tsx
// tests/components/search/note-filters.test.tsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { NoteFilters } from "@/components/notes/note-filters";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(""),
}));

describe("NoteFilters", () => {
  it("renders the quick status toggles", () => {
    render(<NoteFilters />);

    expect(screen.getByRole("button", { name: /favorite/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pinned/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /archived/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement the parser and snippet highlighter**

```ts
// lib/search/parse-search.ts
export function parseSearchInput(input: string) {
  const phraseMatch = input.match(/"([^"]+)"/);
  const tagMatch = input.match(/#([a-z0-9-]+)/i);

  return {
    raw: input.trim(),
    phrase: phraseMatch?.[1] ?? null,
    tag: tagMatch?.[1] ?? null,
    query: input.replace(/"([^"]+)"/g, "").replace(/#([a-z0-9-]+)/gi, "").trim(),
  };
}
```

```ts
// lib/search/highlight.ts
export function highlightMatches(text: string, query: string) {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "ig"), "<mark>$1</mark>");
}
```

- [ ] **Step 3: Add the search query module and recent-search action**

```ts
// lib/queries/search.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseSearchInput } from "@/lib/search/parse-search";

export async function searchNotes(rawInput: string, filters: Record<string, string | boolean | null>) {
  const supabase = await createSupabaseServerClient();
  const parsed = parseSearchInput(rawInput);

  const { data } = await supabase.rpc("search_notes", {
    p_query: parsed.phrase ?? parsed.query,
    p_include_archived: Boolean(filters.archived),
    p_folder_slug: typeof filters.folder === "string" ? filters.folder : null,
    p_collection_slug: typeof filters.collection === "string" ? filters.collection : null,
    p_tag_slug: parsed.tag ?? (typeof filters.tag === "string" ? filters.tag : null),
    p_only_favorites: Boolean(filters.favorite),
    p_only_pinned: Boolean(filters.pinned),
  });

  return data ?? [];
}
```

```ts
// lib/actions/search-history.ts
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function saveSearchHistoryAction(query: string, filters: Record<string, unknown>) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !query.trim()) return;

  await supabase.from("search_history").upsert({
    user_id: user.id,
    query,
    filters,
    last_used_at: new Date().toISOString(),
  });
}
```

- [ ] **Step 4: Build the search results page and filter UI**

```tsx
// app/(app)/search/page.tsx
import { searchNotes } from "@/lib/queries/search";
import { SearchResults } from "@/components/search/search-results";
import { NoteFilters } from "@/components/notes/note-filters";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const results = query ? await searchNotes(query, {
    folder: typeof params.folder === "string" ? params.folder : null,
    collection: typeof params.collection === "string" ? params.collection : null,
    tag: typeof params.tag === "string" ? params.tag : null,
    favorite: params.favorite === "true",
    pinned: params.pinned === "true",
    archived: params.archived === "true",
  }) : [];

  return (
    <div className="space-y-6 px-6 py-8">
      <NoteFilters />
      <SearchResults query={query} results={results} />
    </div>
  );
}
```

```tsx
// components/search/global-search.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function GlobalSearch() {
  const [value, setValue] = useState("");
  const router = useRouter();

  return (
    <form
      className="w-full max-w-xl"
      onSubmit={(event) => {
        event.preventDefault();
        router.push(`/search?q=${encodeURIComponent(value)}`);
      }}
    >
      <input
        aria-label="Search notes"
        className="w-full rounded-full border bg-card px-4 py-3"
        placeholder="Search titles, content, tags, and folders"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </form>
  );
}
```

```tsx
// components/search/search-highlight.tsx
import { highlightMatches } from "@/lib/search/highlight";

export function SearchHighlight({ text, query }: { text: string; query: string }) {
  return <span dangerouslySetInnerHTML={{ __html: highlightMatches(text, query) }} />;
}
```

```tsx
// components/search/search-results.tsx
import Link from "next/link";
import { SearchHighlight } from "@/components/search/search-highlight";

export function SearchResults({
  query,
  results,
}: {
  query: string;
  results: Array<{ id: string; slug: string; title: string; excerpt: string | null; rank: number }>;
}) {
  if (!results.length) {
    return (
      <div className="rounded-3xl border border-dashed p-8 text-center text-muted-foreground">
        No results yet. Try a shorter phrase, a tag, or removing a filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Link key={result.id} href={`/notes/${result.slug}`} className="block rounded-3xl border bg-card p-5 hover:border-accent">
          <h2 className="font-medium"><SearchHighlight text={result.title} query={query} /></h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <SearchHighlight text={result.excerpt ?? "No excerpt available."} query={query} />
          </p>
        </Link>
      ))}
    </div>
  );
}
```

```tsx
// components/notes/note-filters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function NoteFilters() {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <div className="flex flex-wrap gap-2">
      {["favorite", "pinned", "archived"].map((key) => {
        const active = params.get(key) === "true";
        return (
          <button
            key={key}
            type="button"
            className={`rounded-full border px-4 py-2 text-sm ${active ? "bg-primary text-primary-foreground" : "bg-card"}`}
            onClick={() => {
              const next = new URLSearchParams(params.toString());
              next.set(key, active ? "false" : "true");
              router.push(`/search?${next.toString()}`);
            }}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 5: Run the search tests and manually verify filtering**

```bash
npm run test -- tests/unit/search/parse-search.test.ts tests/unit/search/highlight.test.ts tests/components/search/note-filters.test.tsx
npm run typecheck
```

Manual checks:

- search by plain text
- search by exact phrase using quotes
- search by tag with `#tag`
- filter by folder, collection, pinned, favorite, archived
- confirm recent searches write to `search_history`

- [ ] **Step 6: Commit the search system**

```bash
git add lib/search lib/queries/search.ts lib/actions/search-history.ts components/search components/notes/note-filters.tsx app/(app)/search tests/unit/search tests/components/search
git commit -m "feat: add search and filter experience"
```

## Task 10: Folders, Tags, Collections, and Settings

**Files:**
- Create: `lib/queries/organization.ts`
- Create: `lib/actions/organization.ts`
- Create: `lib/actions/preferences.ts`
- Create: `components/forms/folder-form.tsx`
- Create: `components/forms/tag-form.tsx`
- Create: `components/forms/collection-form.tsx`
- Create: `components/forms/preferences-form.tsx`
- Create: `app/(app)/folders/page.tsx`
- Create: `app/(app)/folders/[folderSlug]/page.tsx`
- Create: `app/(app)/tags/page.tsx`
- Create: `app/(app)/tags/[tagSlug]/page.tsx`
- Create: `app/(app)/collections/page.tsx`
- Create: `app/(app)/collections/[collectionSlug]/page.tsx`
- Create: `app/(app)/settings/page.tsx`

- [ ] **Step 1: Add organization queries and actions**

```ts
// lib/queries/organization.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getFolders() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("folders").select("*").order("name");
  return data ?? [];
}

export async function getTags() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("tags").select("*").order("name");
  return data ?? [];
}

export async function getCollections() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("collections").select("*").order("name");
  return data ?? [];
}
```

```ts
// lib/actions/organization.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { collectionSchema, folderSchema, tagSchema } from "@/lib/validators/organization";

export async function createFolderAction(input: unknown) {
  const values = folderSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const { error } = await supabase.from("folders").insert({ ...values, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/folders");
  return { success: true };
}

export async function createTagAction(input: unknown) {
  const values = tagSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const { error } = await supabase.from("tags").insert({ ...values, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/tags");
  return { success: true };
}

export async function createCollectionAction(input: unknown) {
  const values = collectionSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const { error } = await supabase.from("collections").insert({ ...values, user_id: user.id });
  if (error) return { error: error.message };
  revalidatePath("/collections");
  return { success: true };
}
```

- [ ] **Step 2: Build the organization pages**

```tsx
// app/(app)/folders/page.tsx
import { getFolders } from "@/lib/queries/organization";
import { FolderForm } from "@/components/forms/folder-form";

export default async function FoldersPage() {
  const folders = await getFolders();

  return (
    <div className="space-y-6 px-6 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl">Folders</h1>
        <p className="text-muted-foreground">Top-level shelves for grouping notes.</p>
      </header>
      <FolderForm />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {folders.map((folder) => (
          <article key={folder.id} className="rounded-3xl border bg-card p-5">
            <h2 className="font-medium">{folder.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{folder.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// app/(app)/collections/page.tsx
import { getCollections } from "@/lib/queries/organization";
import { CollectionForm } from "@/components/forms/collection-form";

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="space-y-6 px-6 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl">Collections</h1>
        <p className="text-muted-foreground">Curated note groupings you can pin to the dashboard.</p>
      </header>
      <CollectionForm />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {collections.map((collection) => (
          <article key={collection.id} className="rounded-3xl border bg-card p-5">
            <h2 className="font-medium">{collection.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{collection.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// components/forms/folder-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { createFolderAction } from "@/lib/actions/organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FolderForm() {
  const form = useForm({ defaultValues: { name: "", slug: "", description: "" } });

  return (
    <form action={createFolderAction} className="grid gap-3 rounded-3xl border bg-card p-5 md:grid-cols-3">
      <Input placeholder="Folder name" {...form.register("name")} />
      <Input placeholder="folder-slug" {...form.register("slug")} />
      <Input placeholder="Description" {...form.register("description")} />
      <Button type="submit" className="md:col-span-3 md:w-fit">Create folder</Button>
    </form>
  );
}
```

```tsx
// components/forms/tag-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { createTagAction } from "@/lib/actions/organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TagForm() {
  const form = useForm({ defaultValues: { name: "", slug: "", color: "" } });

  return (
    <form action={createTagAction} className="grid gap-3 rounded-3xl border bg-card p-5 md:grid-cols-3">
      <Input placeholder="Tag name" {...form.register("name")} />
      <Input placeholder="tag-slug" {...form.register("slug")} />
      <Input placeholder="Color token" {...form.register("color")} />
      <Button type="submit" className="md:col-span-3 md:w-fit">Create tag</Button>
    </form>
  );
}
```

```tsx
// components/forms/collection-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { createCollectionAction } from "@/lib/actions/organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CollectionForm() {
  const form = useForm({ defaultValues: { name: "", slug: "", description: "" } });

  return (
    <form action={createCollectionAction} className="grid gap-3 rounded-3xl border bg-card p-5 md:grid-cols-3">
      <Input placeholder="Collection name" {...form.register("name")} />
      <Input placeholder="collection-slug" {...form.register("slug")} />
      <Input placeholder="Description" {...form.register("description")} />
      <Button type="submit" className="md:col-span-3 md:w-fit">Create collection</Button>
    </form>
  );
}
```

```tsx
// components/forms/preferences-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { updatePreferencesAction } from "@/lib/actions/preferences";
import { Button } from "@/components/ui/button";

export function PreferencesForm() {
  const form = useForm({
    defaultValues: {
      theme: "system",
      editor_mode: "split",
      editor_width: "comfortable",
      sidebar_collapsed: false,
      command_palette_enabled: true,
    },
  });

  return (
    <form action={updatePreferencesAction} className="space-y-4 rounded-3xl border bg-card p-6">
      <label className="flex items-center justify-between">
        <span>Enable command palette</span>
        <input type="checkbox" {...form.register("command_palette_enabled")} />
      </label>
      <Button type="submit">Save settings</Button>
    </form>
  );
}
```

```tsx
// app/(app)/tags/page.tsx
import { TagForm } from "@/components/forms/tag-form";
import { getTags } from "@/lib/queries/organization";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="space-y-6 px-6 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl">Tags</h1>
        <p className="text-muted-foreground">Quick labels for cross-cutting note topics.</p>
      </header>
      <TagForm />
      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <span key={tag.id} className="rounded-full border bg-card px-4 py-2 text-sm">{tag.name}</span>
        ))}
      </div>
    </div>
  );
}
```

```tsx
// app/(app)/folders/[folderSlug]/page.tsx
import { NoteList } from "@/components/notes/note-list";
import { getNotesList } from "@/lib/queries/notes";

export default async function FolderDetailPage({ params }: { params: Promise<{ folderSlug: string }> }) {
  const { folderSlug } = await params;
  const notes = await getNotesList({ query: folderSlug });
  return <NoteList title={`Folder: ${folderSlug}`} notes={notes} />;
}
```

```tsx
// app/(app)/tags/[tagSlug]/page.tsx
import { NoteList } from "@/components/notes/note-list";
import { searchNotes } from "@/lib/queries/search";

export default async function TagDetailPage({ params }: { params: Promise<{ tagSlug: string }> }) {
  const { tagSlug } = await params;
  const notes = await searchNotes(`#${tagSlug}`, { tag: tagSlug, favorite: false, pinned: false, archived: false, folder: null, collection: null });
  return <NoteList title={`Tag: ${tagSlug}`} notes={notes} />;
}
```

```tsx
// app/(app)/collections/[collectionSlug]/page.tsx
import { NoteList } from "@/components/notes/note-list";
import { searchNotes } from "@/lib/queries/search";

export default async function CollectionDetailPage({ params }: { params: Promise<{ collectionSlug: string }> }) {
  const { collectionSlug } = await params;
  const notes = await searchNotes("", { collection: collectionSlug, favorite: false, pinned: false, archived: false, folder: null, tag: null });
  return <NoteList title={`Collection: ${collectionSlug}`} notes={notes} />;
}
```

- [ ] **Step 3: Implement settings and user preferences**

```ts
// lib/actions/preferences.ts
"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { preferencesSchema } from "@/lib/validators/preferences";

export async function updatePreferencesAction(input: unknown) {
  const values = preferencesSchema.parse(input);
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };
  const { error } = await supabase.from("user_preferences").update(values).eq("user_id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { success: true };
}
```

```tsx
// app/(app)/settings/page.tsx
import { PreferencesForm } from "@/components/forms/preferences-form";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl">Settings</h1>
        <p className="text-muted-foreground">Theme, editor defaults, and workspace preferences.</p>
      </header>
      <PreferencesForm />
    </div>
  );
}
```

- [ ] **Step 4: Run organization flows manually and type-check**

```bash
npm run typecheck
```

Manual checks:

- create a folder
- create a tag
- create a collection and pin it
- update theme and editor settings
- confirm the created objects appear in forms and note filters

- [ ] **Step 5: Commit the organization layer**

```bash
git add lib/queries/organization.ts lib/actions/organization.ts lib/actions/preferences.ts components/forms/folder-form.tsx components/forms/tag-form.tsx components/forms/collection-form.tsx components/forms/preferences-form.tsx app/(app)/folders app/(app)/tags app/(app)/collections app/(app)/settings
git commit -m "feat: add organization and settings pages"
```

## Task 11: Import, Export, Backup, and Command Palette

**Files:**
- Create: `lib/import-export/markdown.ts`
- Create: `components/notes/import-notes-dialog.tsx`
- Create: `components/app/command-menu.tsx`
- Create: `hooks/use-keyboard-shortcuts.ts`
- Create: `app/api/notes/[noteSlug]/export/route.ts`
- Create: `app/api/backup/route.ts`
- Create: `app/api/import/route.ts`

- [ ] **Step 1: Add import/export helpers**

```ts
// lib/import-export/markdown.ts
export function serializeNoteToMarkdown(note: { title: string; content_md: string }) {
  return `# ${note.title}\n\n${note.content_md}`.trim();
}

export function parseMarkdownFile(filename: string, content: string) {
  const titleLine = content.split("\n").find((line) => line.startsWith("# "));
  return {
    title: titleLine?.replace(/^#\s+/, "") || filename.replace(/\.md$/i, ""),
    content_md: content.trim(),
  };
}
```

- [ ] **Step 2: Add export, backup, and import route handlers**

```ts
// app/api/notes/[noteSlug]/export/route.ts
import { NextResponse } from "next/server";
import { getNoteBySlug } from "@/lib/queries/notes";
import { serializeNoteToMarkdown } from "@/lib/import-export/markdown";

export async function GET(_: Request, { params }: { params: Promise<{ noteSlug: string }> }) {
  const { noteSlug } = await params;
  const note = await getNoteBySlug(noteSlug);
  const body = serializeNoteToMarkdown(note);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${note.slug}.md"`,
    },
  });
}
```

```ts
// app/api/backup/route.ts
import { NextResponse } from "next/server";
import { getNotesList } from "@/lib/queries/notes";

export async function GET() {
  const notes = await getNotesList({ archived: true });

  return NextResponse.json(
    { exported_at: new Date().toISOString(), notes },
    {
      headers: {
        "Content-Disposition": 'attachment; filename="note-warehouse-backup.json"',
      },
    },
  );
}
```

```ts
// app/api/import/route.ts
import { NextResponse } from "next/server";
import { createNoteAction } from "@/lib/actions/notes";
import { parseMarkdownFile } from "@/lib/import-export/markdown";

export async function POST(request: Request) {
  const formData = await request.formData();
  const files = formData.getAll("files").filter((file): file is File => file instanceof File);

  for (const file of files) {
    const content = await file.text();
    const parsed = parseMarkdownFile(file.name, content);
    await createNoteAction({
      ...parsed,
      slug: parsed.title.toLowerCase().replace(/\s+/g, "-"),
      excerpt: parsed.content_md.slice(0, 180),
      folder_id: null,
      tag_ids: [],
      collection_ids: [],
      is_favorite: false,
      is_pinned: false,
      visibility: "private",
    });
  }

  return NextResponse.json({ imported: files.length });
}
```

- [ ] **Step 3: Add the import dialog and command palette UI**

```tsx
// components/app/command-menu.tsx
"use client";

import { useRouter } from "next/navigation";
import { Command } from "@/components/ui/command";

const actions = [
  { label: "New note", href: "/notes/new" },
  { label: "Search notes", href: "/search" },
  { label: "Favorites", href: "/favorites" },
];

export function CommandMenu() {
  const router = useRouter();

  return (
    <Command className="rounded-3xl border">
      <Command.Input placeholder="Jump to a page or note" />
      <Command.List>
        <Command.Group heading="Actions">
          {actions.map((item) => (
            <Command.Item key={item.href} onSelect={() => router.push(item.href)}>
              {item.label}
            </Command.Item>
          ))}
        </Command.Group>
      </Command.List>
    </Command>
  );
}
```

```tsx
// hooks/use-keyboard-shortcuts.ts
"use client";

import { useEffect } from "react";

export function useKeyboardShortcuts({
  onSearch,
  onNewNote,
}: {
  onSearch: () => void;
  onNewNote: () => void;
}) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey;

      if (mod && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onSearch();
      }

      if (mod && event.key.toLowerCase() === "n") {
        event.preventDefault();
        onNewNote();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onNewNote, onSearch]);
}
```

```tsx
// components/notes/import-notes-dialog.tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function ImportNotesDialog() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    await fetch("/api/import", { method: "POST", body: formData });
  }

  return (
    <div className="rounded-3xl border bg-card p-5">
      <input
        ref={inputRef}
        type="file"
        accept=".md"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <Button type="button" onClick={() => inputRef.current?.click()}>
        Import Markdown files
      </Button>
    </div>
  );
}
```

- [ ] **Step 4: Verify import/export flows manually**

```bash
npm run typecheck
```

Manual checks:

- export a single note to `.md`
- export a full JSON backup
- import multiple `.md` files in one request
- open the command palette with `Ctrl+K` or `Cmd+K`
- trigger quick-create with `Ctrl+N` or `Cmd+N`

- [ ] **Step 5: Commit the import/export and command layer**

```bash
git add lib/import-export/markdown.ts components/notes/import-notes-dialog.tsx components/app/command-menu.tsx hooks/use-keyboard-shortcuts.ts app/api/notes app/api/backup/route.ts app/api/import/route.ts
git commit -m "feat: add command palette and import export tools"
```

## Task 12: README, QA, and Release Hardening

**Files:**
- Modify: `README.md`
- Create: `docs/manual-qa/note-warehouse-mvp.md`

- [ ] **Step 1: Replace the stock README with real project documentation**

```md
# Note Warehouse

## Local Setup

1. Copy `.env.example` to `.env.local`.
2. Install dependencies with `npm install`.
3. Start Supabase locally with `supabase start`.
4. Apply schema and seed data with `supabase db reset`.
5. Run `npm run dev` and open `http://localhost:3000`.

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Deployment

- Set the same environment variables in Vercel.
- Configure Supabase auth redirect URLs for preview and production.
- Run the SQL migrations in the production Supabase project before the first deploy.
```

- [ ] **Step 2: Add the manual QA and integration checklist**

```md
# Note Warehouse Manual QA

## Auth

- Sign up with email and password
- Log out and sign back in
- Confirm protected routes redirect to `/login`

## Notes

- Create a note
- Edit and autosave a note
- Archive, restore, duplicate, favorite, and pin a note
- Export a note to Markdown

## Search

- Search by title text
- Search by phrase
- Search by tag filter
- Search by folder and collection filters

## Responsive and Accessibility

- Verify layout at 375px, 768px, 1024px, and 1440px
- Verify visible focus states
- Verify dark mode contrast
- Verify keyboard shortcuts and command palette
```

- [ ] **Step 3: Run the final verification suite**

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected:

- lint/typecheck/test/build all pass
- landing, auth, dashboard, notes, search, and settings routes render without runtime errors

- [ ] **Step 4: Review release hardening items before deploy**

```text
- Confirm all user-owned tables still have RLS enabled
- Confirm middleware redirects do not trap authenticated users on auth pages
- Confirm Markdown rendering does not execute raw HTML
- Confirm mobile navigation has no horizontal scroll
- Confirm search empty states show useful guidance
- Confirm every destructive action has a confirmation UI or an undo pattern
```

- [ ] **Step 5: Commit the docs and release pass**

```bash
git add README.md docs/manual-qa/note-warehouse-mvp.md
git commit -m "docs: add Note Warehouse setup and QA guide"
```

## Self-Review

### Spec Coverage

- Product summary and architecture: Tasks 1, 2, 6
- Database schema, Supabase setup, RLS, and seed data: Task 3
- Markdown editing and reading experience: Tasks 4 and 8
- Dashboard, notes, favorites, archived, folders, tags, collections, profile, and settings routes: Tasks 5, 6, 8, 10
- Full-text search and recent searches: Task 9
- Import/export, command palette, and keyboard shortcuts: Task 11
- README, environment variables, testing, and deployment readiness: Tasks 2 and 12

### Placeholder Scan

- No `TODO`, `TBD`, or "implement later" placeholders remain in this plan.
- Commands, file paths, and core code scaffolds are explicit for each task.

### Type Consistency

- Database-facing note payloads consistently use `content_md`, `cover_icon`, `is_favorite`, `is_pinned`, and `visibility`.
- Preferences consistently use `theme`, `editor_mode`, `editor_width`, `sidebar_collapsed`, and `command_palette_enabled`.
- Search consistently flows through `parseSearchInput`, `searchNotes`, and the `search_notes` RPC.
