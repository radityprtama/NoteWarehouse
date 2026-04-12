import { describe, expect, it } from "vitest";

import { envSchema, publicEnvSchema } from "@/lib/env";

describe("envSchema", () => {
  it("requires the public Supabase variables", () => {
    expect(() =>
      envSchema.parse({
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toThrow();
  });

  it("accepts the full Note Warehouse environment", () => {
    expect(
      envSchema.parse({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toMatchObject({
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });
  });

  it("keeps browser-safe validation separate from service role secrets", () => {
    expect(
      publicEnvSchema.parse({
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toMatchObject({
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    });
  });
});
