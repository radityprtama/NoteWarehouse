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
  updated_at timestamptz not null default now(),
  constraint user_preferences_theme_check check (theme in ('light', 'dark', 'system')),
  constraint user_preferences_editor_mode_check check (editor_mode in ('edit', 'preview', 'split')),
  constraint user_preferences_editor_width_check check (editor_width in ('compact', 'comfortable', 'wide'))
);

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
  unique (user_id, slug),
  constraint folders_name_not_blank check (length(btrim(name)) > 0),
  constraint folders_slug_not_blank check (length(btrim(slug)) > 0)
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
  unique (user_id, slug),
  constraint tags_name_not_blank check (length(btrim(name)) > 0),
  constraint tags_slug_not_blank check (length(btrim(slug)) > 0)
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
  unique (user_id, slug),
  constraint collections_name_not_blank check (length(btrim(name)) > 0),
  constraint collections_slug_not_blank check (length(btrim(slug)) > 0)
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
  unique (user_id, slug),
  constraint notes_title_not_blank check (length(btrim(title)) > 0),
  constraint notes_slug_not_blank check (length(btrim(slug)) > 0),
  constraint notes_visibility_check check (visibility in ('private', 'unlisted', 'public'))
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
  created_at timestamptz not null default now(),
  constraint search_history_query_not_blank check (length(btrim(query)) > 0)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name')
  );

  insert into public.user_preferences (user_id)
  values (new.id);

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create index profiles_created_idx on public.profiles (created_at desc);

create index folders_user_updated_idx on public.folders (user_id, updated_at desc);
create index tags_user_name_idx on public.tags (user_id, name);
create index collections_user_pinned_idx on public.collections (user_id, is_pinned, updated_at desc);
create index collections_user_updated_idx on public.collections (user_id, updated_at desc);

create index notes_user_updated_idx on public.notes (user_id, updated_at desc);
create index notes_user_created_idx on public.notes (user_id, created_at desc);
create index notes_user_archived_idx on public.notes (user_id, archived_at);
create index notes_user_favorite_idx on public.notes (user_id, is_favorite);
create index notes_user_pinned_idx on public.notes (user_id, is_pinned);
create index notes_user_folder_idx on public.notes (user_id, folder_id);
create index notes_search_document_idx on public.notes using gin (search_document);
create index notes_title_trgm_idx on public.notes using gin (title gin_trgm_ops);

create index note_tags_tag_idx on public.note_tags (tag_id, note_id);
create index note_collections_collection_idx on public.note_collections (collection_id, note_id);
create index search_history_user_last_used_idx on public.search_history (user_id, last_used_at desc);

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_user_preferences_updated_at before update on public.user_preferences for each row execute function public.set_updated_at();
create trigger set_folders_updated_at before update on public.folders for each row execute function public.set_updated_at();
create trigger set_tags_updated_at before update on public.tags for each row execute function public.set_updated_at();
create trigger set_collections_updated_at before update on public.collections for each row execute function public.set_updated_at();
create trigger set_notes_updated_at before update on public.notes for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.folders enable row level security;
alter table public.tags enable row level security;
alter table public.collections enable row level security;
alter table public.notes enable row level security;
alter table public.note_tags enable row level security;
alter table public.note_collections enable row level security;
alter table public.search_history enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_insert_own" on public.profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "preferences_all_own" on public.user_preferences
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "folders_all_own" on public.folders
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "tags_all_own" on public.tags
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "collections_all_own" on public.collections
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "notes_all_own" on public.notes
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and (
      folder_id is null
      or exists (
        select 1
        from public.folders f
        where f.id = folder_id and f.user_id = (select auth.uid())
      )
    )
  );

create policy "search_history_all_own" on public.search_history
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "note_tags_own" on public.note_tags
  for all to authenticated
  using (
    exists (
      select 1
      from public.notes n
      join public.tags t on t.id = note_tags.tag_id
      where n.id = note_tags.note_id
        and n.user_id = (select auth.uid())
        and t.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.notes n
      join public.tags t on t.id = note_tags.tag_id
      where n.id = note_tags.note_id
        and n.user_id = (select auth.uid())
        and t.user_id = (select auth.uid())
    )
  );

create policy "note_collections_own" on public.note_collections
  for all to authenticated
  using (
    exists (
      select 1
      from public.notes n
      join public.collections c on c.id = note_collections.collection_id
      where n.id = note_collections.note_id
        and n.user_id = (select auth.uid())
        and c.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.notes n
      join public.collections c on c.id = note_collections.collection_id
      where n.id = note_collections.note_id
        and n.user_id = (select auth.uid())
        and c.user_id = (select auth.uid())
    )
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
stable
security invoker
set search_path = public
as $$
  with query_input as (
    select
      nullif(btrim(coalesce(p_query, '')), '') as raw_query,
      case
        when nullif(btrim(coalesce(p_query, '')), '') is null then null::tsquery
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
    case
      when query_input.ts_query is null then 0::real
      else (
        ts_rank_cd(n.search_document, query_input.ts_query)
        + case when n.title % query_input.raw_query then similarity(n.title, query_input.raw_query) else 0 end
      )::real
    end as rank
  from public.notes n
  cross join query_input
  left join public.folders f on f.id = n.folder_id
  where
    n.user_id = (select auth.uid())
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
        where nc.note_id = n.id
          and c.slug = p_collection_slug
          and c.user_id = (select auth.uid())
      )
    )
    and (
      p_tag_slug is null
      or exists (
        select 1
        from public.note_tags nt
        join public.tags t on t.id = nt.tag_id
        where nt.note_id = n.id
          and t.slug = p_tag_slug
          and t.user_id = (select auth.uid())
      )
    )
    and (
      query_input.ts_query is null
      or n.search_document @@ query_input.ts_query
      or n.title % query_input.raw_query
    )
  order by rank desc, n.updated_at desc;
$$;

grant execute on function public.search_notes(text, boolean, text, text, text, boolean, boolean) to authenticated;
