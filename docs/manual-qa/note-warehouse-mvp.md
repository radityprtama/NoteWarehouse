# Note Warehouse Manual QA

Use this checklist before deploying a new build. Test with at least one fresh Supabase user and one seeded or content-rich user.

## Environment

- `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL`.
- `.env.local` contains `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `.env.local` contains `SUPABASE_SERVICE_ROLE_KEY`.
- `.env.local` contains `NEXT_PUBLIC_APP_URL`.
- `.env.local` contains `DATABASE_URL` for Drizzle Kit commands.
- Supabase migrations have been applied.
- Drizzle Kit can connect with `npm run db:studio` or `npm run db:introspect`.
- Supabase Auth redirect URLs include local and deployed callback URLs.
- Local Supabase CLI works with `npm run supabase:status`.

## Auth

- Sign up with email and password.
- Confirm signup creates a profile and preferences row.
- Log out from the sidebar.
- Log back in with email and password.
- Visit `/dashboard` while logged out and confirm redirect to `/login`.
- Visit `/login` while logged in and confirm redirect behavior does not trap the user.
- Update profile display name, avatar URL, bio, and onboarding state.

## Dashboard

- Dashboard renders total notes, favorites, pinned collections, and recent activity.
- Recent notes show latest edits.
- Favorite notes link to the correct note.
- Pinned collections display after creating a pinned collection.
- Empty states are useful for a new account.

## Notes

- Create a note from `/notes/new`.
- Edit title, slug, excerpt, cover icon, visibility, and Markdown content.
- Verify autosave updates the saved state.
- Use the toolbar for headings, bold, italic, quote, code, link, checklist, and table.
- Verify live preview renders headings, code blocks, tables, checklists, blockquotes, and links.
- Open the reading page and verify typography, table of contents, reading time, copy Markdown, and related notes.
- Favorite and unfavorite a note.
- Pin and unpin a note.
- Archive and restore a note.
- Duplicate a note and confirm relations are copied.
- Delete a note and confirm the browser confirmation appears first.
- Export a note from the reading page and verify the downloaded `.md` content.

## Import And Backup

- Import a single `.md` file from `/notes`.
- Import multiple `.md` files from `/notes`.
- Try importing a non-Markdown file and confirm an error toast appears.
- Try importing a file larger than 2 MB and confirm an error toast appears.
- Confirm imported notes appear after refresh and preserve Markdown content.
- Download a JSON backup from `/settings`.
- Confirm the backup includes notes, folders, tags, collections, relations, and preferences.

## Search

- Search by title text.
- Search by content text.
- Search by exact phrase in quotes.
- Search by tag syntax like `#topic`.
- Apply favorite, pinned, archived, folder, tag, and collection filters.
- Confirm results highlight matching terms safely.
- Confirm no-result states explain next steps.
- Confirm recent search history is saved for non-empty searches.

## Organization

- Create a folder with name, slug, description, and color token.
- Open the folder detail page and confirm filtered notes render.
- Create a tag with name, slug, and color token.
- Open the tag detail page and confirm filtered notes render.
- Create a collection with name, slug, description, and pin state.
- Open the collection detail page and confirm filtered notes render.
- Attach folders, tags, and collections from the note editor.

## Settings

- Change theme preference.
- Change default editor mode.
- Change default editor width.
- Toggle command palette preference.
- Toggle compact sidebar preference.
- Save settings and verify the success state.
- Disable command palette and confirm the topbar command trigger disappears.

## Keyboard UX

- Press `Ctrl+K` or `Cmd+K` and confirm the command palette opens.
- Use command palette to navigate to notes, search, folders, tags, collections, settings, and profile.
- Press `Ctrl+N` or `Cmd+N` outside form fields and confirm quick-create opens.
- Confirm `Ctrl+N` does not hijack typing inside inputs or textareas.

## Responsive And Accessibility

- Test at 375px, 768px, 1024px, and 1440px widths.
- Confirm mobile sidebar opens and closes.
- Confirm there is no horizontal page scroll.
- Confirm visible focus states exist for buttons, links, inputs, and command items.
- Confirm forms have visible labels and inline errors.
- Confirm icon-only buttons have accessible labels.
- Confirm light and dark themes have readable contrast.
- Confirm reduced-motion users are not blocked by animations.

## Security And Data Isolation

- Confirm all user-owned tables have RLS enabled.
- Confirm one user cannot access another user's note slug directly.
- Confirm one user cannot attach another user's folder, tag, or collection through direct requests.
- Confirm Markdown rendering does not execute raw HTML.
- Confirm import and autosave require authentication.
- Confirm backup export only returns the authenticated user's records.
- Confirm `SUPABASE_SERVICE_ROLE_KEY` is not exposed to the browser bundle.

## Release Commands

Run before merging or deploying:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Expected result:

- TypeScript passes with strict mode.
- ESLint passes with React Compiler rules.
- Vitest passes all unit and component tests.
- Next.js production build completes.

## Current Residual Risks

- Supabase CLI/database integration tests are not automated yet.
- Attachment UI and storage policies are schema-ready but not implemented.
- Semantic search, version history, sharing, collaboration, OCR, and AI features are future work.
- Browser-native delete confirmation is intentionally simple; a custom accessible confirmation dialog can replace it later.
