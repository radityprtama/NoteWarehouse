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
