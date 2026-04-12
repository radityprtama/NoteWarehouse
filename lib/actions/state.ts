export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<"email" | "password", string[]>>;
};

export const initialAuthActionState: AuthActionState = {
  status: "idle",
};

export type ProfileActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<
    Record<"display_name" | "avatar_url" | "bio" | "onboarding_completed", string[]>
  >;
};

export const initialProfileActionState: ProfileActionState = {
  status: "idle",
};

export type NoteActionField =
  | "title"
  | "slug"
  | "excerpt"
  | "content_md"
  | "cover_icon"
  | "folder_id"
  | "tag_ids"
  | "collection_ids"
  | "is_favorite"
  | "is_pinned"
  | "visibility";

export type NoteActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<NoteActionField, string[]>>;
  noteId?: string;
  slug?: string;
  archivedAt?: string | null;
  isFavorite?: boolean;
  isPinned?: boolean;
};

export const initialNoteActionState: NoteActionState = {
  status: "idle",
};
