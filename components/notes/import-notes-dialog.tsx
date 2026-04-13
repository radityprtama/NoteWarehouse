"use client";

import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ImportResponse = {
  imported?: Array<{ filename: string; slug: string }>;
  imported_count?: number;
  errors?: Array<{ filename: string; error: string }>;
  error?: string;
};

export function ImportNotesDialog() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    const payload = new FormData();
    for (const file of Array.from(files)) {
      payload.append("files", file);
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/import", {
          method: "POST",
          body: payload,
        });
        const result = (await response.json()) as ImportResponse;

        if (!response.ok) {
          toast.error(result.error || "Unable to import Markdown files.");
          return;
        }

        const importedCount = result.imported_count ?? result.imported?.length ?? 0;
        const errorCount = result.errors?.length ?? 0;

        if (errorCount > 0) {
          toast.warning(
            `Imported ${importedCount} notes. ${errorCount} files need attention.`,
          );
        } else {
          toast.success(`Imported ${importedCount} Markdown notes.`);
        }

        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Import failed.");
      } finally {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    });
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".md,.markdown,text/markdown,text/plain"
        multiple
        className="hidden"
        onChange={(event) => handleFiles(event.currentTarget.files)}
      />
      <Button
        type="button"
        variant="outline"
        className="rounded-full"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-4" />
        {pending ? "Importing..." : "Import Markdown"}
      </Button>
    </>
  );
}
