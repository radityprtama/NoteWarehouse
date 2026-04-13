"use client";

import { useEffect, useRef, useState } from "react";

import type { AutosaveState } from "@/components/editor/autosave-status";

export function useNoteAutosave<T>(
  value: T,
  onSave: (value: T) => Promise<void>,
  enabled: boolean,
) {
  const [status, setStatus] = useState<AutosaveState>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasMountedRef = useRef(false);
  const onSaveRef = useRef(onSave);

  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
    }

    statusTimeoutRef.current = setTimeout(() => {
      setStatus("saving");
    }, 0);

    timeoutRef.current = setTimeout(async () => {
      try {
        await onSaveRef.current(value);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    }, 900);

    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, value]);

  return status;
}
