"use client";

import { useActionState } from "react";

import {
  initialProfileActionState,
  type ProfileActionState,
} from "@/lib/actions/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Profile } from "@/lib/queries/profile";

type ProfileFormProps = {
  profile: Profile | null;
  action: (
    previousState: ProfileActionState,
    formData: FormData,
  ) => Promise<ProfileActionState>;
};

export function ProfileForm({ profile, action }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialProfileActionState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="display_name">Display name</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={profile?.display_name ?? ""}
          maxLength={80}
          aria-describedby={
            state.fieldErrors?.display_name ? "display-name-error" : undefined
          }
        />
        {state.fieldErrors?.display_name ? (
          <p id="display-name-error" className="text-sm text-destructive">
            {state.fieldErrors.display_name[0]}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="avatar_url">Avatar URL</Label>
        <Input
          id="avatar_url"
          name="avatar_url"
          type="url"
          defaultValue={profile?.avatar_url ?? ""}
          placeholder="https://example.com/avatar.jpg"
          aria-describedby={state.fieldErrors?.avatar_url ? "avatar-url-error" : undefined}
        />
        {state.fieldErrors?.avatar_url ? (
          <p id="avatar-url-error" className="text-sm text-destructive">
            {state.fieldErrors.avatar_url[0]}
          </p>
        ) : null}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile?.bio ?? ""}
          maxLength={280}
          placeholder="What are you studying or collecting here?"
          aria-describedby={state.fieldErrors?.bio ? "bio-error" : undefined}
        />
        {state.fieldErrors?.bio ? (
          <p id="bio-error" className="text-sm text-destructive">
            {state.fieldErrors.bio[0]}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Short context for your personal knowledge vault.
          </p>
        )}
      </div>
      <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
        <input
          id="onboarding_completed"
          name="onboarding_completed"
          type="checkbox"
          defaultChecked={profile?.onboarding_completed ?? false}
          className="mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <div className="space-y-1">
          <Label htmlFor="onboarding_completed">Onboarding completed</Label>
          <p className="text-sm text-muted-foreground">
            Marks the first-run setup as complete for this account.
          </p>
        </div>
      </div>
      {state.message ? (
        <p
          className={
            state.status === "success"
              ? "rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm"
              : "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          }
          role={state.status === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
