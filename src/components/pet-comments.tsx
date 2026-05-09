import Link from "next/link";

import { MessageCircle } from "lucide-react";

import { getCommentsForPet } from "@/lib/community/queries";
import { getCurrentUser } from "@/lib/dal";

import { CommentForm } from "@/components/comment-form";
import { DeleteCommentButton } from "@/components/delete-comment-button";

const RELATIVE_DIVISIONS: {
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

function formatRelative(date: Date): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  let duration = (date.getTime() - Date.now()) / 1000;
  for (const div of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < div.amount) {
      return rtf.format(Math.round(duration), div.unit);
    }
    duration /= div.amount;
  }
  return rtf.format(Math.round(duration), "year");
}

export async function PetComments({
  petSlug,
  petName,
}: {
  petSlug: string;
  petName: string;
}) {
  const [comments, currentUser] = await Promise.all([
    getCommentsForPet(petSlug),
    getCurrentUser(),
  ]);

  const visible = comments.filter((c) => !c.deletedAt);

  return (
    <section
      id="comments"
      className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm shadow-blue-950/5 backdrop-blur md:p-7"
    >
      <header className="flex items-center gap-2 text-sm font-semibold text-stone-950">
        <MessageCircle className="size-4" />
        Talk on the page
        <span className="text-stone-500">·</span>
        <span className="text-stone-500">{visible.length}</span>
      </header>

      <p className="mt-2 text-sm text-stone-600">
        Old-school forum vibes. Drop a memory, a quote, a hot take about{" "}
        {petName}.
      </p>

      <div className="mt-5">
        {currentUser ? (
          currentUser.handle ? (
            <CommentForm petSlug={petSlug} />
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Pick a handle on your{" "}
              <Link
                href={`/settings/profile?from=comment`}
                className="underline underline-offset-2"
              >
                profile settings
              </Link>{" "}
              before you can post.
            </div>
          )
        ) : (
          <div className="rounded-xl border border-black/10 bg-stone-50 p-4 text-sm text-stone-700">
            <Link
              href={`/sign-in?callbackUrl=/pets/${petSlug}#comments`}
              className="font-semibold text-[#5266ea] hover:underline"
            >
              Sign in
            </Link>{" "}
            to post a comment.
          </div>
        )}
      </div>

      <ul className="mt-6 flex flex-col gap-4">
        {visible.length === 0 ? (
          <li className="rounded-xl border border-dashed border-black/10 bg-white/60 p-5 text-sm text-stone-500">
            No comments yet — be the first to say something about {petName}.
          </li>
        ) : (
          visible.map((c) => (
            <li
              key={c.id}
              className="flex gap-3 rounded-xl border border-black/10 bg-white p-4"
            >
              <CommentAvatar
                image={c.authorImage}
                name={c.authorName}
                handle={c.authorHandle}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <CommentAuthor name={c.authorName} handle={c.authorHandle} />
                  <span className="text-xs text-stone-500">
                    {formatRelative(c.createdAt)}
                  </span>
                  {currentUser?.id === c.authorId ? (
                    <DeleteCommentButton id={c.id} petSlug={petSlug} />
                  ) : null}
                </div>
                <p className="mt-1 break-words whitespace-pre-wrap text-sm text-stone-800">
                  {c.body}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function CommentAvatar({
  image,
  name,
  handle,
}: {
  image: string | null;
  name: string | null;
  handle: string | null;
}) {
  const initial = (handle ?? name ?? "?").slice(0, 1).toUpperCase();
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image}
        alt=""
        className="size-9 shrink-0 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-stone-200 text-xs font-semibold text-stone-700">
      {initial}
    </span>
  );
}

function CommentAuthor({
  name,
  handle,
}: {
  name: string | null;
  handle: string | null;
}) {
  if (handle) {
    return (
      <Link
        href={`/u/${handle}`}
        className="text-sm font-semibold text-stone-900 hover:underline"
      >
        @{handle}
      </Link>
    );
  }
  return (
    <span className="text-sm font-semibold text-stone-900">
      {name ?? "Anonymous homie"}
    </span>
  );
}
