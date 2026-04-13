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

export type OrganizationActionField =
  | "name"
  | "slug"
  | "description"
  | "color"
  | "is_pinned";

export type OrganizationActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<OrganizationActionField, string[]>>;
};

export const initialOrganizationActionState: OrganizationActionState = {
  status: "idle",
};

export type PreferenceActionField =
  | "theme"
  | "editor_mode"
  | "editor_width"
  | "sidebar_collapsed"
  | "command_palette_enabled";

export type PreferenceActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<PreferenceActionField, string[]>>;
};

export const initialPreferenceActionState: PreferenceActionState = {
  status: "idle",
};
