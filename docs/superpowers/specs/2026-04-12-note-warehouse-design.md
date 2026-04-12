# Note Warehouse Design Spec

Date: 2026-04-12
Status: Approved for planning
Scope: MVP sub-project for the first production-ready release

## 1. Product Summary

Note Warehouse is a full-stack personal knowledge vault for storing, organizing, and retrieving Markdown notes. The product is designed for open signup, but the MVP behavior centers on private, user-owned notes with clean security boundaries so it can expand to multi-user use cases later.

The product should feel like a modern editorial vault:

- fast to capture notes
- reliable to search
- calm to read
- structured enough to scale beyond casual note-taking

The first release focuses on authenticated note management, Markdown editing and reading, folders, tags, collections, and strong full-text search. It intentionally excludes semantic search, collaboration, version history, and a production attachment pipeline until the core vault workflow is stable.

## 2. Product Thinking

### Core Promise

Users should be able to create a note, organize it, and find it again quickly without friction. Search is a first-class product feature, not a secondary utility.

### Product Principles

- Markdown-first over rich-text abstraction
- retrieval speed over feature sprawl
- maintainability over clever architecture
- calm reading experience over noisy dashboard UI
- server-first rendering over client-heavy data orchestration

### Primary User Model

- open signup is enabled in v1
- every user only sees their own data
- the app behaves like a personal vault, even though the auth model supports more than one account

### MVP Scope

Included:

- email/password authentication
- onboarding and profile basics
- dashboard
- note CRUD
- archive and restore
- duplicate, pin, favorite
- Markdown editor with toolbar, split preview, autosave, and distraction-free mode
- Markdown reading page with table of contents and reading metadata
- folders, tags, and curated collections
- global full-text search with filters and recent searches
- import/export for Markdown and JSON backup
- responsive shell, theming, and command palette

Deferred:

- semantic search
- AI summarization
- public note sharing
- collaboration
- version history
- OCR and document ingestion
- file attachments and media uploads

## 3. Feature Breakdown

### Authentication

- email/password signup and login with Supabase Auth
- session persistence across server and client boundaries
- protected app shell
- profile page
- lightweight first-run onboarding state in `profiles`
- magic link support can be added later without changing the app model

### Dashboard

- total notes count
- recently updated notes
- favorite notes
- pinned collections
- tag summary
- quick actions
- central search entry point
- simple 7-day writing activity derived from note create and update timestamps

### Notes

- create, edit, delete, archive, restore
- duplicate note
- pin and favorite toggles
- autosave during editing
- note metadata editing
- clean reading view and dedicated edit view

### Markdown Experience

- raw Markdown authoring
- toolbar for common syntax insertions
- split editor and preview
- preview with syntax highlighting
- GitHub-flavored Markdown features including tables, task lists, blockquotes, links, and fenced code blocks
- copy raw Markdown
- export single note to `.md`
- import `.md` files

### Organization

- each note belongs to zero or one folder
- each note can have many tags
- each note can belong to many collections
- favorites and pinned states remain lightweight note flags

### Search

- global search entry in top bar and command palette
- dedicated search results page
- instant search feedback
- search across title, excerpt, content, and related metadata
- filters for tag, folder, collection, pinned, favorite, archived, and date ranges
- recent searches per user
- highlighted snippets and no-result guidance

## 4. Architecture Decisions

### Recommended Application Shape

The app will use a server-first Next.js App Router architecture.

- Server Components are the default for route-level screens, authenticated layouts, dashboards, note detail pages, and list pages.
- Client Components are limited to areas that require browser interactivity: editor controls, preview toggles, command palette, theme toggle, inline filters, and small optimistic interactions.
- Server Actions handle page-coupled mutations such as note creation, updates, archive actions, and profile settings.
- Route Handlers handle file-like and integration-oriented workflows such as import/export, backup download, and future upload helpers.

This follows current Next.js guidance to keep client boundaries small and move data access to the server by default.

### Why Not a Client-Heavy SPA

A client-heavy dashboard would add avoidable bundle weight, duplicate auth and loading logic, and make Supabase security boundaries harder to reason about. The MVP does not need that tradeoff.

### Why Not a Strict BFF Layer Everywhere

A fully formalized backend-for-frontend layer would be useful later for collaboration and audit-heavy use cases, but it is heavier than necessary for the MVP. The app should keep clean internal service boundaries without forcing every query through a custom API layer.

## 5. Technical Architecture Overview

### Frontend Stack

- Next.js 16 with App Router
- TypeScript strict mode
- Tailwind CSS
- shadcn/ui
- Lucide icons
- React Hook Form
- Zod
- TanStack Query for targeted client-side fetch flows
- next-themes
- react-markdown with remark/rehype plugins for rendering
- cmdk-style command palette UX

### Backend and Data

- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security
- Supabase Storage reserved for future attachment support
- direct Supabase queries from server modules instead of introducing Drizzle in the MVP

Direct Supabase queries are the cleaner option for this project because:

- the app already depends on Supabase auth and RLS
- the schema is relational but not deeply domain-complex yet
- Postgres search functions and policies are first-class in Supabase
- fewer abstraction layers improves delivery speed for the MVP

### Module Boundaries

- `lib/supabase`: server, browser, and privileged utility clients
- `lib/queries`: read models grouped by domain
- `lib/actions`: validated server mutations
- `lib/search`: parsing, normalization, ranking helpers, and snippet preparation
- `lib/markdown`: rendering config, sanitization, heading extraction, reading time, and future link parsing
- `components/app`: authenticated shell and app-specific interface
- `components/editor`: note editor surface and toolbar
- `components/notes`: cards, lists, metadata, reading widgets

### State Strategy

- route and filter state belongs in the URL
- local transient editor state stays in client components
- TanStack Query is reserved for interactions that benefit from client revalidation, not for every screen

## 6. Database Schema

### Core Tables

### `profiles`

- `id uuid primary key references auth.users(id)`
- `email text`
- `display_name text`
- `avatar_url text null`
- `bio text null`
- `onboarding_completed boolean default false`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Purpose:

- stores product-level profile data separate from Supabase auth internals

### `user_preferences`

- `user_id uuid primary key references profiles(id) on delete cascade`
- `theme text default 'system'`
- `editor_mode text default 'split'`
- `editor_width text default 'comfortable'`
- `sidebar_collapsed boolean default false`
- `command_palette_enabled boolean default true`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### `folders`

- `id uuid primary key`
- `user_id uuid not null references profiles(id) on delete cascade`
- `name text not null`
- `slug text not null`
- `description text null`
- `color text null`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Constraints and indexes:

- unique `(user_id, slug)`
- unique `(user_id, name)`
- index on `(user_id, updated_at desc)`

### `tags`

- `id uuid primary key`
- `user_id uuid not null references profiles(id) on delete cascade`
- `name text not null`
- `slug text not null`
- `color text null`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Constraints and indexes:

- unique `(user_id, slug)`
- unique `(user_id, name)`

### `collections`

- `id uuid primary key`
- `user_id uuid not null references profiles(id) on delete cascade`
- `name text not null`
- `slug text not null`
- `description text null`
- `is_pinned boolean default false`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Constraints and indexes:

- unique `(user_id, slug)`
- unique `(user_id, name)`

### `notes`

- `id uuid primary key`
- `user_id uuid not null references profiles(id) on delete cascade`
- `folder_id uuid null references folders(id) on delete set null`
- `title text not null`
- `slug text not null`
- `content_md text not null default ''`
- `excerpt text null`
- `cover_icon text null`
- `visibility text not null default 'private'`
- `is_pinned boolean default false`
- `is_favorite boolean default false`
- `archived_at timestamptz null`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`
- `search_document tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content_md, '')), 'C')
  ) stored`

Notes:

- `visibility` is included for future sharing and collaboration support
- hard delete exists, but archive is the primary soft-delete flow
- `search_document` should combine weighted title, excerpt, and content

Constraints and indexes:

- unique `(user_id, slug)`
- index on `(user_id, updated_at desc)`
- index on `(user_id, archived_at)`
- index on `(user_id, is_favorite)`
- index on `(user_id, is_pinned)`
- gin index on `search_document`
- optional trigram index on `title`

### `note_tags`

- `note_id uuid references notes(id) on delete cascade`
- `tag_id uuid references tags(id) on delete cascade`
- primary key `(note_id, tag_id)`

### `note_collections`

- `note_id uuid references notes(id) on delete cascade`
- `collection_id uuid references collections(id) on delete cascade`
- primary key `(note_id, collection_id)`

### `search_history`

- `id uuid primary key`
- `user_id uuid not null references profiles(id) on delete cascade`
- `query text not null`
- `filters jsonb not null default '{}'::jsonb`
- `last_used_at timestamptz default now()`
- `created_at timestamptz default now()`

Indexes:

- index on `(user_id, last_used_at desc)`

### Optional Future Table: `attachments`

- reserved for later addition
- do not implement upload pipeline in MVP unless it is clearly low-risk after core features are complete

## 7. Search Design

Search is a primary system, not a convenience feature.

### Search Sources

- note title
- note excerpt
- note body Markdown
- tags, folders, and collections via relational filters

### Search Strategy

1. normalize the user query
2. parse structured filters from the URL state
3. run Postgres full-text search against `search_document`
4. boost title matches
5. optionally blend trigram similarity for tolerant title matching
6. filter by note ownership and note state
7. return ranked results with snippets for UI highlighting

### Supported Filters in MVP

- tag
- folder
- collection
- pinned
- favorite
- archived
- created date
- updated date
- exact phrase search when users wrap terms in double quotes, implemented with `phraseto_tsquery`

### Future Search Extension

The search layer should be written behind an internal interface so semantic ranking can be appended later without rewriting screen contracts.

## 8. Security Model

### Authentication

- Supabase Auth handles signup, login, and session management
- the app uses Supabase SSR helpers for authenticated server access
- protected routes redirect unauthenticated users to login

### Authorization

- every user-owned table includes `user_id`
- Row Level Security is enabled on all user data tables
- policies restrict users to selecting, inserting, updating, and deleting only their own records

### Validation

- client forms use Zod-backed validation
- server actions revalidate all input with the same schemas or server-specific derivatives
- note rendering must sanitize unsafe HTML behavior through the chosen Markdown pipeline

### Storage

- Storage bucket design is deferred
- if attachments are added later, bucket and object policies must mirror note ownership and avoid public buckets by default

## 9. Supabase Setup Steps

1. Create a Supabase project.
2. Enable email/password auth.
3. Configure site URL and redirect URLs for local and production environments.
4. Add environment variables to Next.js.
5. Run SQL migrations for schema, indexes, trigger helpers, and RLS policies.
6. Add a trigger that creates a `profiles` row for each new auth user.
7. Seed demo data for local development.
8. Verify protected routes and session persistence locally.

### Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

## 10. Route Structure

### Public Routes

- `/`
- `/login`
- `/signup`
- `/auth/callback`
- `/auth/confirm`

### Authenticated Routes

- `/dashboard`
- `/notes`
- `/notes/new`
- `/notes/[noteSlug]`
- `/notes/[noteSlug]/edit`
- `/favorites`
- `/archived`
- `/folders`
- `/folders/[folderSlug]`
- `/tags`
- `/tags/[tagSlug]`
- `/collections`
- `/collections/[collectionSlug]`
- `/search`
- `/settings`
- `/profile`

### Layout Model

- public marketing layout for landing and auth
- authenticated app shell with sidebar and top bar
- optional right rail on note-focused pages for metadata and table of contents

## 11. UI and UX Design System

### Visual Direction

- warm editorial vault
- clean, calm, premium, and highly readable
- not an enterprise admin panel

### Layout

- left sidebar for primary navigation
- top bar for search, quick create, import/export, theme toggle, and account access
- central content panel for list/detail work
- contextual right rail for note metadata and generated table of contents

### Primary Screens

- landing page with product story and auth calls to action
- dashboard with layered cards and quick actions
- note index page designed like a library catalog rather than a spreadsheet
- note detail page optimized for reading and scanning
- note editor page optimized for writing velocity and previewing

### Typography

Recommended direction:

- display typography with editorial warmth, such as Newsreader or Calistoga
- body and interface typography with a practical sans, such as Inter
- monospace for metadata chips, code, and structured labels

### Color Direction

- neutral paper-like backgrounds in light mode
- deep ink text
- restrained accent for active states, primary actions, and search emphasis
- theme tokens should be semantic rather than hardcoded into components

### Interaction Rules

- visible focus states
- keyboard-first search and command access
- helpful empty states
- skeleton loading where responses may exceed 300ms
- toast feedback for successful and failed user actions
- subtle motion only, roughly 180ms to 240ms for most transitions

## 12. Folder Structure

This is the target production-minded structure for the MVP:

```text
app/
  (marketing)/
  (auth)/
  (app)/
    dashboard/
    notes/
    favorites/
    archived/
    folders/
    tags/
    collections/
    search/
    settings/
    profile/
  api/
components/
  ui/
  app/
  editor/
  notes/
  search/
  forms/
lib/
  actions/
  queries/
  search/
  markdown/
  supabase/
  utils/
hooks/
types/
supabase/
  migrations/
  seed.sql
docs/
  superpowers/
    specs/
```

## 13. Implementation Plan by Phases

This section describes delivery phases only. A detailed implementation plan will be written separately after the user reviews this spec.

### Phase 1: Foundation

- initialize product shell and design tokens
- configure shadcn/ui and theme provider
- integrate Supabase SSR auth
- create protected layout and auth screens
- add onboarding and profile baseline

### Phase 2: Core Notes

- build notes schema and migrations
- implement note CRUD and archive flows
- implement Markdown editor and preview
- implement folders, tags, and collections basics

### Phase 3: Search and Organization

- implement full-text search and filters
- add favorites and pinning
- add search history
- refine note lists and detail metadata

### Phase 4: Polish

- dashboard metrics and recent activity
- command palette
- import/export
- empty states, skeletons, and responsive refinement

### Phase 5: Hardening

- RLS review
- error handling audit
- testing pass
- deployment and setup documentation

## 14. Testing Strategy

### Unit Tests

- slug generation
- search query parsing
- search filter normalization
- Markdown utility helpers
- reading time and heading extraction

### Component Tests

- auth forms
- note create and edit forms
- editor toolbar interactions
- search filters
- command palette shell

### Integration Coverage Plan

- auth-protected route access
- note CRUD flow
- archive and restore flow
- search returning expected owned records only

### Manual QA Checklist

- signup and login
- route protection
- theme parity
- keyboard navigation
- mobile navigation
- empty states
- destructive confirmations
- search no-result behavior

## 15. Deployment and DevOps Expectations

- deploy on Vercel
- manage environment variables clearly for local, preview, and production
- keep SQL migrations in repo
- keep a seed path for local testing
- maintain linting and formatting defaults
- provide a strong README for local setup

## 16. Scaling Notes and Future Enhancements

The MVP should preserve seams for:

- semantic search
- note linking and backlinks
- public sharing
- collaboration
- audit events and activity history
- note templates
- flashcard generation
- study workflows

Key future-ready decisions already included:

- `visibility` on notes
- modular search layer
- route structure that can expand without rewrite
- separation between server reads, validated writes, and UI components

## 17. Open Decisions Resolved By This Spec

The following decisions are now fixed unless the user explicitly revises the spec:

- use a server-first Next.js architecture
- use direct Supabase queries rather than Drizzle for the MVP
- support open signup in v1
- use Markdown-native editing, not a hybrid rich editor
- ship folders, tags, and collections in v1
- position the visual design as a warm editorial vault
