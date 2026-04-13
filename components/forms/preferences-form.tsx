"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";

import { updatePreferencesAction } from "@/lib/actions/preferences";
import {
  initialPreferenceActionState,
  type PreferenceActionState,
} from "@/lib/actions/state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PreferencesInput } from "@/lib/validators/preferences";

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return errors?.length ? (
    <p id={id} className="text-sm text-destructive">
      {errors[0]}
    </p>
  ) : null;
}

function ActionMessage({ state }: { state: PreferenceActionState }) {
  return state.message ? (
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
  ) : null;
}

export function PreferencesForm({ preferences }: { preferences: PreferencesInput }) {
  const form = useForm<PreferencesInput>({
    defaultValues: preferences,
  });
  const [state, formAction, pending] = useActionState(
    updatePreferencesAction,
    initialPreferenceActionState,
  );

  return (
    <form
      action={formAction}
      className="space-y-6 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="theme">Theme</Label>
          <select
            id="theme"
            className={selectClassName}
            {...form.register("theme")}
            aria-describedby={state.fieldErrors?.theme ? "theme-error" : undefined}
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <FieldError id="theme-error" errors={state.fieldErrors?.theme} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="editor_mode">Editor mode</Label>
          <select
            id="editor_mode"
            className={selectClassName}
            {...form.register("editor_mode")}
            aria-describedby={
              state.fieldErrors?.editor_mode ? "editor-mode-error" : undefined
            }
          >
            <option value="split">Split editor</option>
            <option value="edit">Write only</option>
            <option value="preview">Preview only</option>
          </select>
          <FieldError
            id="editor-mode-error"
            errors={state.fieldErrors?.editor_mode}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="editor_width">Editor width</Label>
          <select
            id="editor_width"
            className={selectClassName}
            {...form.register("editor_width")}
            aria-describedby={
              state.fieldErrors?.editor_width ? "editor-width-error" : undefined
            }
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="wide">Wide</option>
          </select>
          <FieldError
            id="editor-width-error"
            errors={state.fieldErrors?.editor_width}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label
          htmlFor="command_palette_enabled"
          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 bg-muted/25 p-4"
        >
          <input
            id="command_palette_enabled"
            type="checkbox"
            className="mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...form.register("command_palette_enabled")}
          />
          <span className="space-y-1">
            <span className="block font-medium">Command palette</span>
            <span className="block text-sm leading-6 text-muted-foreground">
              Keep keyboard-driven navigation enabled for fast search and switching.
            </span>
          </span>
        </label>

        <label
          htmlFor="sidebar_collapsed"
          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 bg-muted/25 p-4"
        >
          <input
            id="sidebar_collapsed"
            type="checkbox"
            className="mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            {...form.register("sidebar_collapsed")}
          />
          <span className="space-y-1">
            <span className="block font-medium">Start with compact sidebar</span>
            <span className="block text-sm leading-6 text-muted-foreground">
              Store the preference now so the shell can honor it when collapsible navigation lands.
            </span>
          </span>
        </label>
      </div>

      <FieldError
        id="command-palette-error"
        errors={state.fieldErrors?.command_palette_enabled}
      />
      <FieldError
        id="sidebar-collapsed-error"
        errors={state.fieldErrors?.sidebar_collapsed}
      />

      <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between")}>
        <ActionMessage state={state} />
        <Button type="submit" disabled={pending} className="rounded-full">
          {pending ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}
