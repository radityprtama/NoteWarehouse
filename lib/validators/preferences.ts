import { z } from "zod";

export const preferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  editor_mode: z.enum(["edit", "preview", "split"]).default("split"),
  editor_width: z.enum(["compact", "comfortable", "wide"]).default("comfortable"),
  sidebar_collapsed: z.boolean().default(false),
  command_palette_enabled: z.boolean().default(true),
});

export type PreferencesInput = z.infer<typeof preferencesSchema>;
