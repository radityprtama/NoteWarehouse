import { z } from "zod";

export const noteVisibilitySchema = z.enum(["private", "unlisted", "public"]);

export const noteFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120),
  slug: z.string().trim().min(1, "Slug is required.").max(140),
  excerpt: z.string().trim().max(240).optional().or(z.literal("")),
  content_md: z.string().max(200_000).default(""),
  cover_icon: z.string().trim().max(16).optional().or(z.literal("")),
  folder_id: z.string().uuid().nullable().default(null),
  tag_ids: z.array(z.string().uuid()).default([]),
  collection_ids: z.array(z.string().uuid()).default([]),
  is_favorite: z.boolean().default(false),
  is_pinned: z.boolean().default(false),
  visibility: noteVisibilitySchema.default("private"),
});

export const noteStatusSchema = z.object({
  is_favorite: z.boolean().optional(),
  is_pinned: z.boolean().optional(),
  archived_at: z.string().datetime().nullable().optional(),
});

export type NoteFormInput = z.infer<typeof noteFormSchema>;
export type NoteStatusInput = z.infer<typeof noteStatusSchema>;
