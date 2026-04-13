import { relations, sql, type SQL } from "drizzle-orm";
import {
  boolean,
  check,
  customType,
  index,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true })
    .defaultNow()
    .notNull(),
};

const tsVector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey(),
    email: text("email").notNull(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    onboardingCompleted: boolean("onboarding_completed").default(false).notNull(),
    ...timestamps,
  },
  (table) => [index("profiles_created_idx").on(table.createdAt.desc())],
);

export const userPreferences = pgTable(
  "user_preferences",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => profiles.id, { onDelete: "cascade" }),
    theme: text("theme").$type<"light" | "dark" | "system">().default("system").notNull(),
    editorMode: text("editor_mode")
      .$type<"edit" | "preview" | "split">()
      .default("split")
      .notNull(),
    editorWidth: text("editor_width")
      .$type<"compact" | "comfortable" | "wide">()
      .default("comfortable")
      .notNull(),
    sidebarCollapsed: boolean("sidebar_collapsed").default(false).notNull(),
    commandPaletteEnabled: boolean("command_palette_enabled").default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    check("user_preferences_theme_check", sql`${table.theme} in ('light', 'dark', 'system')`),
    check(
      "user_preferences_editor_mode_check",
      sql`${table.editorMode} in ('edit', 'preview', 'split')`,
    ),
    check(
      "user_preferences_editor_width_check",
      sql`${table.editorWidth} in ('compact', 'comfortable', 'wide')`,
    ),
  ],
);

export const folders = pgTable(
  "folders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    color: text("color"),
    ...timestamps,
  },
  (table) => [
    unique("folders_user_name_unique").on(table.userId, table.name),
    unique("folders_user_slug_unique").on(table.userId, table.slug),
    check("folders_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    check("folders_slug_not_blank", sql`length(btrim(${table.slug})) > 0`),
    index("folders_user_updated_idx").on(table.userId, table.updatedAt.desc()),
  ],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    color: text("color"),
    ...timestamps,
  },
  (table) => [
    unique("tags_user_name_unique").on(table.userId, table.name),
    unique("tags_user_slug_unique").on(table.userId, table.slug),
    check("tags_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    check("tags_slug_not_blank", sql`length(btrim(${table.slug})) > 0`),
    index("tags_user_name_idx").on(table.userId, table.name),
  ],
);

export const collections = pgTable(
  "collections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    isPinned: boolean("is_pinned").default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    unique("collections_user_name_unique").on(table.userId, table.name),
    unique("collections_user_slug_unique").on(table.userId, table.slug),
    check("collections_name_not_blank", sql`length(btrim(${table.name})) > 0`),
    check("collections_slug_not_blank", sql`length(btrim(${table.slug})) > 0`),
    index("collections_user_pinned_idx").on(
      table.userId,
      table.isPinned,
      table.updatedAt.desc(),
    ),
    index("collections_user_updated_idx").on(table.userId, table.updatedAt.desc()),
  ],
);

export const notes = pgTable(
  "notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    folderId: uuid("folder_id").references(() => folders.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    contentMd: text("content_md").default("").notNull(),
    excerpt: text("excerpt"),
    coverIcon: text("cover_icon"),
    visibility: text("visibility")
      .$type<"private" | "unlisted" | "public">()
      .default("private")
      .notNull(),
    isPinned: boolean("is_pinned").default(false).notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),
    archivedAt: timestamp("archived_at", { mode: "string", withTimezone: true }),
    ...timestamps,
    searchDocument: tsVector("search_document").generatedAlwaysAs(
      (): SQL => sql`
        setweight(to_tsvector('english', coalesce(${notes.title}, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(${notes.excerpt}, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(${notes.contentMd}, '')), 'C')
      `,
    ),
  },
  (table) => [
    unique("notes_user_slug_unique").on(table.userId, table.slug),
    check("notes_title_not_blank", sql`length(btrim(${table.title})) > 0`),
    check("notes_slug_not_blank", sql`length(btrim(${table.slug})) > 0`),
    check(
      "notes_visibility_check",
      sql`${table.visibility} in ('private', 'unlisted', 'public')`,
    ),
    index("notes_user_updated_idx").on(table.userId, table.updatedAt.desc()),
    index("notes_user_created_idx").on(table.userId, table.createdAt.desc()),
    index("notes_user_archived_idx").on(table.userId, table.archivedAt),
    index("notes_user_favorite_idx").on(table.userId, table.isFavorite),
    index("notes_user_pinned_idx").on(table.userId, table.isPinned),
    index("notes_user_folder_idx").on(table.userId, table.folderId),
    index("notes_search_document_idx").using("gin", table.searchDocument),
    index("notes_title_trgm_idx").using("gin", sql`${table.title} gin_trgm_ops`),
  ],
);

export const noteTags = pgTable(
  "note_tags",
  {
    noteId: uuid("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.noteId, table.tagId] }),
    index("note_tags_tag_idx").on(table.tagId, table.noteId),
  ],
);

export const noteCollections = pgTable(
  "note_collections",
  {
    noteId: uuid("note_id")
      .notNull()
      .references(() => notes.id, { onDelete: "cascade" }),
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.noteId, table.collectionId] }),
    index("note_collections_collection_idx").on(table.collectionId, table.noteId),
  ],
);

export const searchHistory = pgTable(
  "search_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    query: text("query").notNull(),
    filters: jsonb("filters").$type<Record<string, unknown>>().default({}).notNull(),
    lastUsedAt: timestamp("last_used_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check("search_history_query_not_blank", sql`length(btrim(${table.query})) > 0`),
    index("search_history_user_last_used_idx").on(table.userId, table.lastUsedAt.desc()),
  ],
);

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  preferences: one(userPreferences),
  folders: many(folders),
  tags: many(tags),
  collections: many(collections),
  notes: many(notes),
  searchHistory: many(searchHistory),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  profile: one(profiles, {
    fields: [userPreferences.userId],
    references: [profiles.id],
  }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [folders.userId],
    references: [profiles.id],
  }),
  notes: many(notes),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [tags.userId],
    references: [profiles.id],
  }),
  noteTags: many(noteTags),
}));

export const collectionsRelations = relations(collections, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [collections.userId],
    references: [profiles.id],
  }),
  noteCollections: many(noteCollections),
}));

export const notesRelations = relations(notes, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [notes.userId],
    references: [profiles.id],
  }),
  folder: one(folders, {
    fields: [notes.folderId],
    references: [folders.id],
  }),
  noteTags: many(noteTags),
  noteCollections: many(noteCollections),
}));

export const noteTagsRelations = relations(noteTags, ({ one }) => ({
  note: one(notes, {
    fields: [noteTags.noteId],
    references: [notes.id],
  }),
  tag: one(tags, {
    fields: [noteTags.tagId],
    references: [tags.id],
  }),
}));

export const noteCollectionsRelations = relations(noteCollections, ({ one }) => ({
  note: one(notes, {
    fields: [noteCollections.noteId],
    references: [notes.id],
  }),
  collection: one(collections, {
    fields: [noteCollections.collectionId],
    references: [collections.id],
  }),
}));

export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  profile: one(profiles, {
    fields: [searchHistory.userId],
    references: [profiles.id],
  }),
}));

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type UserPreference = typeof userPreferences.$inferSelect;
export type Folder = typeof folders.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Collection = typeof collections.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
