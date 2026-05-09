import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Calendar, Heart, MessageCircle } from "lucide-react";

import { getProfileByHandle } from "@/lib/community/queries";
import { getPet } from "@/lib/pets";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) {
    return {
      title: "Profile not found",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `@${profile.handle} on Homiedex`,
    description: profile.bio ?? `${profile.handle}'s homies on Homiedex.`,
    alternates: { canonical: `/u/${profile.handle}` },
  };
}

export default async function ProfilePage({ params }: Props) {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) notFound();

  const favoritePets = (
    await Promise.all(profile.favorites.map((f) => getPet(f.petSlug)))
  ).filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <main className="min-h-screen bg-[#f7f8ff]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-5 md:px-8 md:py-5">
        <SiteHeader />
      </section>
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-5 pb-12 md:px-8 md:pb-16">
        <header className="flex flex-col gap-5 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur md:flex-row md:items-center">
          {profile.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.image}
              alt=""
              className="size-24 shrink-0 rounded-full object-cover ring-2 ring-white"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="grid size-24 shrink-0 place-items-center rounded-full bg-stone-200 text-3xl font-semibold text-stone-700">
              {(profile.handle ?? "?").slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-semibold text-stone-950 md:text-4xl">
              @{profile.handle}
            </h1>
            {profile.name ? (
              <p className="text-sm text-stone-600">{profile.name}</p>
            ) : null}
            {profile.bio ? (
              <p className="mt-3 max-w-xl whitespace-pre-wrap text-stone-700">
                {profile.bio}
              </p>
            ) : null}
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-600">
              <Stat
                icon={<Calendar className="size-4" />}
                label="Joined"
                value={profile.joinedAt.toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                })}
              />
              <Stat
                icon={<MessageCircle className="size-4" />}
                label="Posts"
                value={profile.postCount.toString()}
              />
              <Stat
                icon={<Heart className="size-4" />}
                label="Favorites"
                value={profile.favorites.length.toString()}
              />
            </dl>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <Panel title="Favorite homies" icon={<Heart className="size-4" />}>
            {favoritePets.length === 0 ? (
              <p className="text-sm text-stone-500">No faves yet.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {favoritePets.map((pet) => (
                  <li key={pet.slug}>
                    <Link
                      href={`/pets/${pet.slug}`}
                      className="group block rounded-xl border border-black/10 bg-white p-3 transition hover:border-[#5266ea]"
                    >
                      <p className="truncate text-sm font-semibold text-stone-900 group-hover:text-[#5266ea]">
                        {pet.displayName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-stone-500">
                        {pet.tags.slice(0, 2).join(" · ")}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Recent posts"
            icon={<MessageCircle className="size-4" />}
          >
            {profile.comments.length === 0 ? (
              <p className="text-sm text-stone-500">No posts yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {profile.comments.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-xl border border-black/10 bg-white p-4"
                  >
                    <Link
                      href={`/pets/${c.petSlug}#comments`}
                      className="text-xs font-semibold tracking-[0.18em] text-[#5266ea] uppercase hover:underline"
                    >
                      on /{c.petSlug}
                    </Link>
                    <p className="mt-2 line-clamp-3 break-words text-sm text-stone-800">
                      {c.body}
                    </p>
                    <p className="mt-2 text-xs text-stone-500">
                      {c.createdAt.toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      <span className="font-semibold text-stone-900">{value}</span>
      <span>{label}</span>
    </span>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-stone-950">
        {icon}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
