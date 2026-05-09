import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/dal";

import { ProfileForm } from "@/components/profile-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile settings",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function ProfileSettingsPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?callbackUrl=/settings/profile");
  const { from } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f7f8ff]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-5 md:px-8 md:py-5">
        <SiteHeader />
      </section>
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 pb-16 md:px-8">
        <header>
          <p className="text-sm font-semibold tracking-[0.18em] text-cyan-700 uppercase">
            Settings
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-950 md:text-4xl">
            Your profile
          </h1>
          {from === "comment" ? (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Pick a handle below before you can post comments.
            </p>
          ) : (
            <p className="mt-3 text-stone-600">
              Pick a handle, write a bio, get repping. This is what other homies
              will see at <code>/u/yourhandle</code>.
            </p>
          )}
        </header>

        <ProfileForm
          initial={{
            handle: user.handle ?? "",
            name: user.name ?? "",
            bio: user.bio ?? "",
            image: user.image,
          }}
        />
      </section>
      <SiteFooter />
    </main>
  );
}
