"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";

import { createFolderAction } from "@/lib/actions/organization";
import {
  initialOrganizationActionState,
  type OrganizationActionState,
} from "@/lib/actions/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FolderInput } from "@/lib/validators/organization";

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return errors?.length ? (
    <p id={id} className="text-sm text-destructive">
      {errors[0]}
    </p>
  ) : null;
}

function ActionMessage({ state }: { state: OrganizationActionState }) {
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

export function FolderForm() {
  const form = useForm<FolderInput>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      color: "",
    },
  });
  const [state, formAction, pending] = useActionState(
    createFolderAction,
    initialOrganizationActionState,
  );

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm md:grid-cols-2"
    >
      <div className="grid gap-2">
        <Label htmlFor="folder-name">Folder name</Label>
        <Input
          id="folder-name"
          placeholder="Research methods"
          maxLength={80}
          {...form.register("name")}
          aria-describedby={state.fieldErrors?.name ? "folder-name-error" : undefined}
        />
        <FieldError id="folder-name-error" errors={state.fieldErrors?.name} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="folder-slug">Slug</Label>
        <Input
          id="folder-slug"
          placeholder="research-methods"
          maxLength={100}
          {...form.register("slug")}
          aria-describedby={state.fieldErrors?.slug ? "folder-slug-error" : undefined}
        />
        <FieldError id="folder-slug-error" errors={state.fieldErrors?.slug} />
      </div>
      <div className="grid gap-2 md:col-span-2">
        <Label htmlFor="folder-description">Description</Label>
        <Textarea
          id="folder-description"
          placeholder="Top-level shelf for a study area or long-running topic."
          maxLength={180}
          {...form.register("description")}
          aria-describedby={
            state.fieldErrors?.description ? "folder-description-error" : undefined
          }
        />
        <FieldError
          id="folder-description-error"
          errors={state.fieldErrors?.description}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="folder-color">Color token</Label>
        <Input
          id="folder-color"
          placeholder="steel"
          maxLength={24}
          {...form.register("color")}
          aria-describedby={state.fieldErrors?.color ? "folder-color-error" : undefined}
        />
        <FieldError id="folder-color-error" errors={state.fieldErrors?.color} />
      </div>
      <div className="flex items-end justify-between gap-3 md:justify-end">
        <ActionMessage state={state} />
        <Button type="submit" disabled={pending} className="rounded-full">
          {pending ? "Creating..." : "Create folder"}
        </Button>
      </div>
    </form>
  );
}
