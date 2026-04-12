import { z } from "zod";

export const authSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const profileSchema = z.object({
  display_name: z.string().trim().max(80).optional().or(z.literal("")),
  avatar_url: z.string().trim().url().optional().or(z.literal("")),
  bio: z.string().trim().max(280).optional().or(z.literal("")),
  onboarding_completed: z.boolean().default(false),
});

export type AuthInput = z.infer<typeof authSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
