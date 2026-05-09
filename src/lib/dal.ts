import "server-only";

import { cache } from "react";

import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

import { auth } from "@/auth";

export type CurrentUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  handle: string | null;
  bio: string | null;
};

// Returns the signed-in user (or null). Memoized for the React render pass.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [row] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      handle: users.handle,
      bio: users.bio,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return row ?? null;
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
