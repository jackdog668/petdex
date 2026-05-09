import "server-only";

import { and, count, desc, eq, isNull, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { comments, favorites, users } from "@/lib/db/schema";

export type CommentRow = {
  id: string;
  body: string;
  createdAt: Date;
  deletedAt: Date | null;
  authorId: string;
  authorName: string | null;
  authorImage: string | null;
  authorHandle: string | null;
};

export async function getCommentsForPet(
  petSlug: string,
): Promise<CommentRow[]> {
  const rows = await db
    .select({
      id: comments.id,
      body: comments.body,
      createdAt: comments.createdAt,
      deletedAt: comments.deletedAt,
      authorId: users.id,
      authorName: users.name,
      authorImage: users.image,
      authorHandle: users.handle,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.petSlug, petSlug))
    .orderBy(desc(comments.createdAt))
    .limit(200);

  return rows;
}

export async function getCommentCountForPet(petSlug: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(comments)
    .where(and(eq(comments.petSlug, petSlug), isNull(comments.deletedAt)));
  return row?.count ?? 0;
}

export async function getFavoriteCountForPet(petSlug: string): Promise<number> {
  const [row] = await db
    .select({ count: count() })
    .from(favorites)
    .where(eq(favorites.petSlug, petSlug));
  return row?.count ?? 0;
}

export async function isFavoritedByUser(
  userId: string,
  petSlug: string,
): Promise<boolean> {
  const [row] = await db
    .select({ userId: favorites.userId })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.petSlug, petSlug)))
    .limit(1);
  return !!row;
}

export type ProfilePayload = {
  id: string;
  name: string | null;
  image: string | null;
  handle: string;
  bio: string | null;
  joinedAt: Date;
  postCount: number;
  favorites: { petSlug: string; createdAt: Date }[];
  comments: {
    id: string;
    body: string;
    createdAt: Date;
    petSlug: string;
  }[];
};

export async function getProfileByHandle(
  handle: string,
): Promise<ProfilePayload | null> {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      image: users.image,
      handle: users.handle,
      bio: users.bio,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(sql`lower(${users.handle}) = lower(${handle})`)
    .limit(1);

  if (!user?.handle) return null;

  const [favRows, commentRows, postCountRow] = await Promise.all([
    db
      .select({ petSlug: favorites.petSlug, createdAt: favorites.createdAt })
      .from(favorites)
      .where(eq(favorites.userId, user.id))
      .orderBy(desc(favorites.createdAt))
      .limit(50),
    db
      .select({
        id: comments.id,
        body: comments.body,
        createdAt: comments.createdAt,
        petSlug: comments.petSlug,
      })
      .from(comments)
      .where(and(eq(comments.userId, user.id), isNull(comments.deletedAt)))
      .orderBy(desc(comments.createdAt))
      .limit(50),
    db
      .select({ count: count() })
      .from(comments)
      .where(and(eq(comments.userId, user.id), isNull(comments.deletedAt))),
  ]);

  return {
    id: user.id,
    name: user.name,
    image: user.image,
    handle: user.handle,
    bio: user.bio,
    joinedAt: user.createdAt,
    postCount: postCountRow[0]?.count ?? 0,
    favorites: favRows,
    comments: commentRows,
  };
}
