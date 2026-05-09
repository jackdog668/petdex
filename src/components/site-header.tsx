import Link from "next/link";

import { signOutAction } from "@/lib/auth-actions";
import { getCurrentUser } from "@/lib/dal";

import { SiteHeaderMenu } from "@/components/site-header-menu";

export async function SiteHeader() {
  const user = await getCurrentUser();

  const userSlot = user ? (
    <UserChip user={user} />
  ) : (
    <Link
      href="/sign-in"
      className="rounded-full border border-black/10 bg-white/80 px-3.5 py-1.5 text-sm font-medium text-stone-900 transition hover:bg-white"
    >
      Sign in
    </Link>
  );

  const mobileUserSlot = user ? (
    <div className="flex flex-col gap-1">
      <Link
        href={user.handle ? `/u/${user.handle}` : "/settings/profile"}
        className="rounded-2xl px-4 py-3 text-stone-800 transition hover:bg-white"
      >
        {user.handle ? `@${user.handle}` : "Set up your profile"}
      </Link>
      <Link
        href="/settings/profile"
        className="rounded-2xl px-4 py-3 text-stone-800 transition hover:bg-white"
      >
        Settings
      </Link>
      <form action={signOutAction}>
        <button
          type="submit"
          className="w-full rounded-2xl px-4 py-3 text-left text-stone-800 transition hover:bg-white"
        >
          Sign out
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/sign-in"
      className="rounded-2xl px-4 py-3 text-stone-800 transition hover:bg-white"
    >
      Sign in
    </Link>
  );

  return <SiteHeaderMenu userSlot={userSlot} mobileUserSlot={mobileUserSlot} />;
}

function UserChip({
  user,
}: {
  user: { name: string | null; image: string | null; handle: string | null };
}) {
  const display = user.handle ? `@${user.handle}` : (user.name ?? "Profile");
  const href = user.handle ? `/u/${user.handle}` : "/settings/profile";
  return (
    <div className="flex items-center gap-1">
      <Link
        href={href}
        className="flex items-center gap-2 rounded-full border border-black/10 bg-white/80 py-1 pr-3 pl-1 text-sm font-medium text-stone-900 transition hover:bg-white"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt=""
            className="size-7 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="grid size-7 place-items-center rounded-full bg-stone-200 text-xs font-semibold text-stone-700">
            {(user.name ?? "?").slice(0, 1).toUpperCase()}
          </span>
        )}
        <span>{display}</span>
      </Link>
      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-full border border-transparent px-2 py-1 text-xs text-stone-500 transition hover:text-stone-900"
          aria-label="Sign out"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
