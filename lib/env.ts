import { z } from "zod";

export const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const envSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type Env = z.infer<typeof envSchema>;

function readPublicEnvironment() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };
}

function readServerEnvironment() {
  return {
    ...readPublicEnvironment(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function getPublicEnv() {
  return publicEnvSchema.parse(readPublicEnvironment());
}

export function getEnv() {
  return envSchema.parse(readServerEnvironment());
}

export const publicEnv = new Proxy({} as PublicEnv, {
  get(_target, property: keyof PublicEnv) {
    return getPublicEnv()[property];
  },
});

export const env = new Proxy({} as Env, {
  get(_target, property: keyof Env) {
    return getEnv()[property];
  },
});
