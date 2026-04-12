do $$
declare
  seed_user uuid;
  intro_folder uuid := '10000000-0000-4000-8000-000000000001';
  markdown_tag uuid := '10000000-0000-4000-8000-000000000002';
  study_tag uuid := '10000000-0000-4000-8000-000000000003';
  intro_collection uuid := '10000000-0000-4000-8000-000000000004';
  intro_note uuid := '10000000-0000-4000-8000-000000000005';
begin
  select id into seed_user from public.profiles order by created_at asc limit 1;

  if seed_user is null then
    return;
  end if;

  insert into public.folders (id, user_id, name, slug, description, color)
  values (intro_folder, seed_user, 'Study', 'study', 'Core study materials', 'blue')
  on conflict (user_id, slug) do update set
    name = excluded.name,
    description = excluded.description,
    color = excluded.color;

  insert into public.tags (id, user_id, name, slug, color)
  values
    (markdown_tag, seed_user, 'Markdown', 'markdown', 'slate'),
    (study_tag, seed_user, 'Study', 'study', 'blue')
  on conflict (user_id, slug) do update set
    name = excluded.name,
    color = excluded.color;

  insert into public.collections (id, user_id, name, slug, description, is_pinned)
  values (intro_collection, seed_user, 'Pinned Reads', 'pinned-reads', 'Frequently revisited notes', true)
  on conflict (user_id, slug) do update set
    name = excluded.name,
    description = excluded.description,
    is_pinned = excluded.is_pinned;

  insert into public.notes (
    id,
    user_id,
    folder_id,
    title,
    slug,
    excerpt,
    content_md,
    cover_icon,
    is_pinned,
    is_favorite
  )
  values (
    intro_note,
    seed_user,
    intro_folder,
    'Welcome to Note Warehouse',
    'welcome-to-note-warehouse',
    'Your first seeded note.',
    '# Welcome to Note Warehouse

This vault is ready for Markdown notes, search, and collections.

## Start here

- Create notes
- Organize with folders, tags, and collections
- Search everything instantly

```ts
const warehouse = "markdown-first";
```
',
    'package',
    true,
    true
  )
  on conflict (user_id, slug) do update set
    folder_id = excluded.folder_id,
    title = excluded.title,
    excerpt = excluded.excerpt,
    content_md = excluded.content_md,
    cover_icon = excluded.cover_icon,
    is_pinned = excluded.is_pinned,
    is_favorite = excluded.is_favorite;

  insert into public.note_tags (note_id, tag_id)
  values
    (intro_note, markdown_tag),
    (intro_note, study_tag)
  on conflict do nothing;

  insert into public.note_collections (note_id, collection_id)
  values (intro_note, intro_collection)
  on conflict do nothing;
end $$;
