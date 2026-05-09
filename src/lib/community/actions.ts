"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { requireUser } from "@/lib/dal";
import { db } from "@/lib/db";
import { comments, favorites, users } from "@/lib/db/schema";

const commentSchema = z.object({
  petSlug: z.string().min(1).max(120),
  body: z
    .string()
    .trim()
    .min(1, "Say something!")
    .max(2000, "Keep it under 2000 chars."),
});

export type CommentActionState = {
  ok: boolean;
  error?: string;
};

export async function postComment(
  _state: CommentActionState | undefined,
  formData: FormData,
): Promise<CommentActionState> {
  let user: Awaited<ReturnType<typeof requireUser>>;
  try {
    user = await requireUser();
  } catch {
    return { ok: false, error: "You need to sign in to post." };
  }

  // Force a handle before letting users post.
  if (!user.handle) {
    redirect("/settings/profile?from=comment");
  }

  const parsed = commentSchema.safeParse({
    petSlug: formData.get("petSlug"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }

  await db.insert(comments).values({
    petSlug: parsed.data.petSlug,
    userId: user.id,
    body: parsed.data.body,
  });

  revalidatePath(`/pets/${parsed.data.petSlug}`);
  return { ok: true };
}

export async function deleteComment(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = formData.get("id");
  const petSlug = formData.get("petSlug");
  if (typeof id !== "string" || typeof petSlug !== "string") return;

  // Soft-delete and only if owned by the caller.
  await db
    .update(comments)
    .set({ deletedAt: new Date(), body: "" })
    .where(and(eq(comments.id, id), eq(comments.userId, user.id)));

  revalidatePath(`/pets/${petSlug}`);
}

export async function toggleFavorite(formData: FormData): Promise<void> {
  let user: Awaited<ReturnType<typeof requireUser>>;
  try {
    user = await requireUser();
  } catch {
    redirect("/sign-in");
  }
  const petSlug = formData.get("petSlug");
  if (typeof petSlug !== "string" || petSlug.length === 0) return;

  const existing = await db
    .select({ userId: favorites.userId })
    .from(favorites)
    .where(and(eq(favorites.userId, user.id), eq(favorites.petSlug, petSlug)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, user.id), eq(favorites.petSlug, petSlug)),
      );
  } else {
    await db.insert(favorites).values({ userId: user.id, petSlug });
  }

  revalidatePath(`/pets/${petSlug}`);
  if (user.handle) revalidatePath(`/u/${user.handle}`);
}

const handleSchema = z
  .string()
  .trim()
  .min(3, "Handle must be at least 3 characters.")
  .max(24, "Handle must be 24 characters or fewer.")
  .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only.");

const profileSchema = z.object({
  handle: handleSchema,
  name: z
    .string()
    .trim()
    .max(60, "Name too long.")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .trim()
    .max(280, "Bio is capped at 280 chars.")
    .optional()
    .or(z.literal("")),
});

export type ProfileActionState = {
  ok: boolean;
  error?: string;
  fieldErrors?: { handle?: string; name?: string; bio?: string };
};

const RESERVED_HANDLES = new Set([
  "admin",
  "api",
  "sign-in",
  "sign-out",
  "settings",
  "u",
  "pets",
  "kind",
  "vibe",
  "about",
  "legal",
  "homiedex",
]);

export async function updateProfile(
  _state: ProfileActionState | undefined,
  formData: FormData,
): Promise<ProfileActionState> {
  let user: Awaited<ReturnType<typeof requireUser>>;
  try {
    user = await requireUser();
  } catch {
    redirect("/sign-in");
  }

  const parsed = profileSchema.safeParse({
    handle: formData.get("handle"),
    name: formData.get("name") ?? "",
    bio: formData.get("bio") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: ProfileActionState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "handle") fieldErrors.handle = issue.message;
      if (key === "name") fieldErrors.name = issue.message;
      if (key === "bio") fieldErrors.bio = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  const { handle, name, bio } = parsed.data;

  if (RESERVED_HANDLES.has(handle.toLowerCase())) {
    return { ok: false, fieldErrors: { handle: "That handle is reserved." } };
  }

  // Reject if some other user already owns it (case-insensitive).
  const conflict = await db
    .select({ id: users.id })
    .from(users)
    .where(sql`lower(${users.handle}) = lower(${handle})`)
    .limit(1);
  if (conflict[0] && conflict[0].id !== user.id) {
    return { ok: false, fieldErrors: { handle: "That handle is taken." } };
  }

  await db
    .update(users)
    .set({
      handle,
      name: name && name.length > 0 ? name : user.name,
      bio: bio && bio.length > 0 ? bio : null,
    })
    .where(eq(users.id, user.id));

  revalidatePath(`/u/${handle}`);
  revalidatePath("/settings/profile");
  return { ok: true };
}
