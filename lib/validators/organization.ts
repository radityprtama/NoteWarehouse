import { z } from "zod";

const colorSchema = z.string().trim().max(24).optional().or(z.literal(""));
const descriptionSchema = z.string().trim().max(180).optional().or(z.literal(""));

export const folderSchema = z.object({
  name: z.string().trim().min(1, "Folder name is required.").max(80),
  slug: z.string().trim().min(1, "Folder slug is required.").max(100),
  description: descriptionSchema,
  color: colorSchema,
});

export const tagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required.").max(40),
  slug: z.string().trim().min(1, "Tag slug is required.").max(60),
  color: colorSchema,
});

export const collectionSchema = z.object({
  name: z.string().trim().min(1, "Collection name is required.").max(80),
  slug: z.string().trim().min(1, "Collection slug is required.").max(100),
  description: descriptionSchema,
  is_pinned: z.boolean().default(false),
});

export type FolderInput = z.infer<typeof folderSchema>;
export type TagInput = z.infer<typeof tagSchema>;
export type CollectionInput = z.infer<typeof collectionSchema>;
