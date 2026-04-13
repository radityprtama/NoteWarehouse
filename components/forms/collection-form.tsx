"use client";

import { useActionState } from "react";
import { useForm } from "react-hook-form";

import { createCollectionAction } from "@/lib/actions/organization";
import {
  initialOrganizationActionState,
  type OrganizationActionState,
} from "@/lib/actions/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CollectionInput } from "@/lib/validators/organization";

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

export function CollectionForm() {
  const form = useForm<CollectionInput>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      is_pinned: false,
    },
  });
  const [state, formAction, pending] = useActionState(
    createCollectionAction,
    initialOrganizationActionState,
  );

  return (
    <form
      action={formAction}
      className="grid gap-4 rounded-3xl border border-border/60 bg-card/90 p-5 shadow-sm lg:grid-cols-2"
    >
      <div className="grid gap-2">
        <Label htmlFor="collection-name">Collection name</Label>
        <Input
          id="collection-name"
          placeholder="Exam prep"
          maxLength={80}
          {...form.register("name")}
          aria-describedby={
            state.fieldErrors?.name ? "collection-name-error" : undefined
          }
        />
        <FieldError id="collection-name-error" errors={state.fieldErrors?.name} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="collection-slug">Slug</Label>
        <Input
          id="collection-slug"
          placeholder="exam-prep"
          maxLength={100}
          {...form.register("slug")}
          aria-describedby={
            state.fieldErrors?.slug ? "collection-slug-error" : undefined
          }
        />
        <FieldError id="collection-slug-error" errors={state.fieldErrors?.slug} />
      </div>
      <div className="grid gap-2 lg:col-span-2">
        <Label htmlFor="collection-description">Description</Label>
        <Textarea
          id="collection-description"
          placeholder="A curated set of notes for a goal, project, or study sprint."
          maxLength={180}
          {...form.register("description")}
          aria-describedby={
            state.fieldErrors?.description ? "collection-description-error" : undefined
          }
        />
        <FieldError
          id="collection-description-error"
          errors={state.fieldErrors?.description}
        />
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-border/60 bg-muted/25 p-4">
        <input
          id="collection-pinned"
          type="checkbox"
          className="mt-1 size-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...form.register("is_pinned")}
          aria-describedby={
            state.fieldErrors?.is_pinned ? "collection-pinned-error" : undefined
          }
        />
        <div className="space-y-1">
          <Label htmlFor="collection-pinned">Pin collection</Label>
          <p className="text-sm text-muted-foreground">
            Pinned collections appear on the dashboard and act as quick shelves.
          </p>
          <FieldError
            id="collection-pinned-error"
            errors={state.fieldErrors?.is_pinned}
          />
        </div>
      </div>
      <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-end">
        <ActionMessage state={state} />
        <Button type="submit" disabled={pending} className="rounded-full">
          {pending ? "Creating..." : "Create collection"}
        </Button>
      </div>
    </form>
  );
}
