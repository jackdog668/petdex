"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  type ProfileActionState,
  updateProfile,
} from "@/lib/community/actions";

const initial: ProfileActionState = { ok: false };

export function ProfileForm({
  initial: initialValues,
}: {
  initial: {
    handle: string;
    name: string;
    bio: string;
    image: string | null;
  };
}) {
  const [state, action, pending] = useActionState(updateProfile, initial);

  return (
    <form
      action={action}
      className="flex flex-col gap-5 rounded-2xl border border-black/10 bg-white/80 p-6 shadow-sm backdrop-blur"
    >
      <div className="flex items-center gap-4">
        {initialValues.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={initialValues.image}
            alt=""
            className="size-16 shrink-0 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-stone-200 text-xl font-semibold text-stone-700">
            {(initialValues.handle || initialValues.name || "?")
              .slice(0, 1)
              .toUpperCase()}
          </span>
        )}
        <p className="text-xs text-stone-500">
          Avatar is pulled from your sign-in provider. To change it, update your
          GitHub or Google profile picture and sign in again.
        </p>
      </div>

      <Field
        label="Handle"
        hint="Letters, numbers, underscores. 3–24 chars. Shows up as @handle."
        error={state.fieldErrors?.handle}
      >
        <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 focus-within:border-[#5266ea]">
          <span className="text-sm text-stone-500">@</span>
          <input
            name="handle"
            defaultValue={initialValues.handle}
            required
            minLength={3}
            maxLength={24}
            pattern="[A-Za-z0-9_]+"
            placeholder="biggie_fan_92"
            className="w-full bg-transparent py-2 text-sm text-stone-900 outline-none"
          />
        </div>
      </Field>

      <Field
        label="Display name"
        hint="Optional. Shown on your profile alongside your handle."
        error={state.fieldErrors?.name}
      >
        <input
          name="name"
          defaultValue={initialValues.name}
          maxLength={60}
          placeholder="(optional)"
          className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-[#5266ea]"
        />
      </Field>

      <Field
        label="Bio"
        hint="280 chars max. Tell the homies what you're about."
        error={state.fieldErrors?.bio}
      >
        <textarea
          name="bio"
          defaultValue={initialValues.bio}
          maxLength={280}
          rows={3}
          placeholder="(optional)"
          className="w-full resize-y rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-stone-900 outline-none transition focus:border-[#5266ea]"
        />
      </Field>

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm">
          {state.ok ? (
            <span className="text-green-700">Saved.</span>
          ) : state.error ? (
            <span className="text-red-600">{state.error}</span>
          ) : null}
        </p>
        <div className="flex items-center gap-3">
          {initialValues.handle ? (
            <Link
              href={`/u/${initialValues.handle}`}
              className="text-sm text-stone-600 hover:underline"
            >
              View profile
            </Link>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#5266ea] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4053c4] disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save profile"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: control is passed in via children.
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-stone-900">{label}</span>
      {children}
      {error ? (
        <span className="text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="text-xs text-stone-500">{hint}</span>
      ) : null}
    </label>
  );
}
