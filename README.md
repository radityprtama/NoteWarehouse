# Note Warehouse

Note Warehouse is a full-stack personal knowledge vault for storing README-style Markdown notes, organizing them into shelves, and retrieving them quickly through search. It is built for single-user note capture first, with a Supabase data model and RLS policy set that can grow into multi-user sharing later.

## Product Summary

The app combines a Markdown note vault, personal wiki, and searchable document library. Users can create notes, edit Markdown with live preview and autosave, organize content with folders, tags, and collections, favorite or pin important notes, archive old material, import Markdown files, export notes, and download a JSON backup.

The current MVP includes:

- Email/password authentication with Supabase Auth.
- Protected authenticated app shell with dashboard, sidebar, topbar search, theme toggle, and command palette.
- Notes CRUD, archive/restore, duplicate, pin, favorite, autosave, Markdown preview, reading mode, related notes, previous/next navigation, and export to `.md`.
- Folders, tags, collections, pinned collections, and settings/preferences.
- Postgres full-text search through a `search_notes` RPC with filters for folder, tag, collection, favorite, pinned, and archived notes.
- Markdown import and JSON backup export.
- Production-focused TypeScript, validation, RLS, migrations, seed data, tests, and setup docs.

## Tech Stack

- Next.js 16 with App Router and root `proxy.ts`.
- React 19 and TypeScript strict mode.
- Tailwind CSS 4 and shadcn/ui primitives.
- Supabase Auth, Postgres, RLS, SSR clients, SQL migrations, and Drizzle ORM schema tooling.
- React Hook Form and Zod for forms and validation.
- react-markdown, remark-gfm, and rehype-highlight for Markdown rendering.
- cmdk command palette, Lucide icons, next-themes, TanStack Query provider, sonner toasts, date-fns, and Vitest.

## Architecture

The application uses server components for route-level data reads and server actions or route handlers for mutations. Supabase RLS remains the primary security boundary, while server code also checks the authenticated user before mutating user-owned data.

Key layers:

- `app/(marketing)` contains the public landing page.
- `app/(auth)` contains login and signup.
- `app/(app)` contains authenticated dashboard, notes, search, organization, profile, and settings pages.
- `app/api` contains autosave, import, note export, and backup route handlers.
- `components` contains app shell, editor, note, search, form, and shadcn UI components.
- `lib/actions` contains server actions for auth, notes, profile, search history, organization, and preferences.
- `lib/queries` contains server-side read models for dashboard, notes, search, profile, and organization.
- `db/schema.ts` contains the Drizzle ORM schema mirror for public application tables.
- `lib/db/client.ts` exposes a server-only Drizzle client for trusted server-side database work.
- `lib/validators` contains Zod schemas shared by client/server form logic.
- `lib/markdown`, `lib/search`, and `lib/import-export` contain pure utilities with unit tests.
- `supabase/migrations` and `supabase/seed.sql` define the database.
- `types/database.ts` contains the typed Supabase schema used by the app.

## Database Schema

The initial migration is `supabase/migrations/20260412150000_note_warehouse_init.sql`.

Main tables:

- `profiles`: one profile per Supabase auth user.
- `user_preferences`: theme, editor defaults, sidebar, and command palette preferences.
- `folders`: optional top-level note shelf.
- `tags`: reusable cross-reference labels.
- `collections`: curated note groups with pinned support.
- `notes`: Markdown notes with title, slug, content, excerpt, cover icon, visibility, archive, pin, favorite, timestamps, and generated `search_document`.
- `note_tags`: many-to-many note/tag relation.
- `note_collections`: many-to-many note/collection relation.
- `search_history`: recent search history for authenticated users.
Attachments are planned as a future schema addition alongside Supabase Storage policies.

Search:

- `notes.search_document` is a generated weighted `tsvector`.
- `search_notes(...)` is a security-definer RPC for full-text search and metadata filters.
- Trigram extension is enabled for future fuzzy/hybrid search.

Security:

- RLS is enabled on every user-owned table.
- Policies restrict reads and writes to `auth.uid()`.
- Relation-table policies verify both the note and organization entity belong to the current user.
- A profile trigger creates `profiles` and `user_preferences` records when a new auth user is created.

## Route Map

Public routes:

- `/` - landing page.
- `/login` - email/password login.
- `/signup` - email/password signup.
- `/auth/callback` - Supabase auth callback.

Authenticated app routes:

- `/dashboard` - vault overview, recent notes, favorites, pinned collections, and tag summary.
- `/notes` - active notes shelf with Markdown import.
- `/notes/new` - create note.
- `/notes/[noteSlug]` - reading view with Markdown render and export.
- `/notes/[noteSlug]/edit` - editor and autosave.
- `/search` - global search and filters.
- `/favorites` - starred notes.
- `/archived` - archived notes.
- `/folders` and `/folders/[folderSlug]` - folder management and filtered notes.
- `/tags` and `/tags/[tagSlug]` - tag management and filtered notes.
- `/collections` and `/collections/[collectionSlug]` - collection management and filtered notes.
- `/profile` - profile and onboarding state.
- `/settings` - workspace preferences and backup export.

API routes:

- `PATCH /api/notes/[noteId]` - autosave note content.
- `GET /api/notes/[noteSlug]/export` - download one note as Markdown.
- `POST /api/import` - import one or more Markdown files.
- `GET /api/backup` - download JSON backup.

## Local Setup

Requirements:

- Node.js 20 or newer.
- npm.
- Supabase CLI for local database work.
- A Supabase project, or local Supabase via the CLI.

Install dependencies:

```bash
npm install
```

Create local environment variables:

```bash
cp .env.example .env.local
```

Set values in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-or-project-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-or-project-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

For local Supabase:

```bash
supabase start
supabase db reset
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

For a hosted Supabase project:

1. Create a project in Supabase.
2. Copy the project URL, anon key, and service role key into `.env.local` and Vercel environment variables.
3. Run `supabase link --project-ref <project-ref>`.
4. Apply the migration with `supabase db push`, or paste the SQL migration into the Supabase SQL editor.
5. Optionally run `supabase db reset` locally to load `supabase/seed.sql`.
6. In Supabase Auth settings, add redirect URLs for local, preview, and production deployments.

Recommended redirect URLs:

- `http://localhost:3000/auth/callback`
- `https://<your-vercel-preview-domain>/auth/callback`
- `https://<your-production-domain>/auth/callback`

Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code. It is only for trusted server-side code.

## Drizzle ORM

Drizzle is configured in [drizzle.config.ts](./drizzle.config.ts) and uses [db/schema.ts](./db/schema.ts). The runtime app still uses Supabase SSR clients for most authenticated user data so Supabase Auth and RLS keep working as the security boundary. Drizzle is used for schema definitions, generated migrations, Studio, trusted server-only database tasks, and the authenticated JSON backup export.

Environment variable:

```bash
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

Local Supabase uses port `54322` for Postgres by default. For a hosted Supabase project, copy a connection string from Supabase Dashboard, Project Settings, Database. Supabase provides direct and pooler URLs. For migrations, prefer a direct connection when available, or a session pooler URL. Keep this value server-only.

Drizzle scripts:

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:introspect
npm run db:check
npm run db:studio
```

Recommended workflow for this project:

1. Apply the existing baseline SQL migration first with Supabase CLI: `supabase db reset` locally, or `supabase db push` for a linked project.
2. Edit `db/schema.ts` for future schema changes.
3. Generate a Drizzle migration with `npm run db:generate -- --name <change_name>`.
4. Review the generated SQL in `drizzle/`.
5. Apply it to the Supabase database with `npm run db:migrate`.
6. If the migration affects app-facing types, regenerate Supabase types or update `types/database.ts`.

Important adoption note: the project already has a hand-written baseline migration in `supabase/migrations`. Do not apply a Drizzle-generated initial create-table migration to a database that already has that baseline. Use Drizzle-generated migrations for changes after the baseline, or introspect an existing database with `npm run db:introspect` if you want to rebuild the Drizzle schema from a live Supabase database.

Drizzle-generated migrations cover schema objects represented in `db/schema.ts`. Keep Supabase-specific RLS policies, Auth triggers, RPC functions, and extension setup in explicit SQL migrations unless they are intentionally moved into Drizzle-managed SQL.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run start
npm run db:generate
npm run db:migrate
npm run db:check
npm run db:studio
```

Verification used during this build:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`

`npm run build` may fetch Google font assets through `next/font/google`.

## Deployment

Deploy on Vercel:

1. Import the repository into Vercel.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, and server-only `DATABASE_URL`.
3. Apply Supabase migrations before the first production deployment.
4. Add Vercel preview and production callback URLs in Supabase Auth.
5. Deploy.

The app uses `proxy.ts` for protected route redirects. Next.js 16 uses Proxy rather than the older middleware convention.

## Testing Strategy

Implemented tests cover:

- Environment validation.
- Slug utilities.
- Markdown reading time and table of contents.
- Markdown import/export helpers.
- Search parser and safe highlighting.
- Auth form behavior.
- Sidebar navigation.
- Note editor formatting toolbar.
- Search filters.

Recommended integration coverage before production:

- Auth signup/login/logout with Supabase.
- Note CRUD, autosave, archive/restore, duplicate, favorite, pin, delete confirmation.
- Full-text search with tag/folder/collection filters.
- Markdown import, note export, and JSON backup export.
- RLS verification with two test users.

Manual QA checklist: `docs/manual-qa/note-warehouse-mvp.md`.

## Implementation Phases

Completed:

- Phase 1: Next.js foundation, Tailwind/shadcn, Supabase SSR, auth, app shell, theme.
- Phase 2: note CRUD, editor, Markdown preview, note list, reading page.
- Phase 3: search, filters, favorites, pinned notes, archive, folders, tags, collections.
- Phase 4: dashboard, command palette, import/export, backup, responsive app shell.
- Phase 5: RLS review notes, test pass, docs, QA checklist, deployment readiness.

## Scaling Notes

The schema is designed for future expansion:

- Semantic search can add an embeddings table keyed by `note_id` and updated through a background job.
- Version history can use a `note_versions` table populated by update triggers or explicit save checkpoints.
- Public sharing can add signed public slugs and visibility policies around `notes.visibility`.
- Collaboration can add workspace tables, memberships, and role-aware RLS policies.
- Attachments can use Supabase Storage with an `attachments` table, storage bucket policies, and note/media relation records.
- Backlinks can be added by parsing Markdown links and storing edges in a `note_links` table.
- Smart collections can be represented as saved filter definitions on collections or a dedicated `smart_collections` table.

## Known Follow-Ups

- Add integration tests against a local Supabase instance.
- Add optimistic updates for selected note actions after route-level flows are stable.
- Add attachment upload UI and storage policies.
- Add version history and restore UI.
- Add semantic search and AI summarization only after the base retrieval system is reliable.
