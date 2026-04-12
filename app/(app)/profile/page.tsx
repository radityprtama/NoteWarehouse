import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/forms/profile-form";
import { updateProfileAction } from "@/lib/actions/profile";
import { getCurrentProfile } from "@/lib/queries/profile";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your Note Warehouse profile.",
};

export default async function ProfilePage() {
  const currentProfile = await getCurrentProfile();

  if (!currentProfile) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10">
      <div className="mb-8">
        <p className="text-sm font-medium text-muted-foreground">Account</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Profile
        </h1>
        <p className="mt-3 text-muted-foreground">
          Keep your vault identity simple. Your email is{" "}
          <span className="font-medium text-foreground">{currentProfile.email}</span>.
        </p>
      </div>
      <section className="rounded-xl border bg-card/95 p-6 shadow-sm">
        <ProfileForm
          profile={currentProfile.profile}
          action={updateProfileAction}
        />
      </section>
    </main>
  );
}
