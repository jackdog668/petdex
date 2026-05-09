// Database schema for Homiedex community features.
// - Auth.js core tables (users, accounts, sessions, verificationTokens)
// - App tables: comments, favorites
// User profile fields (handle, bio) live directly on the users table to keep
// joins simple — there's no real reason to split them off.

import type { AdapterAccountType } from "@auth/core/adapters";
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    // Profile fields. `handle` is the URL-safe username at /u/<handle>.
    // It's nullable until the user picks one (we redirect them to /settings
    // on first sign-in).
    handle: text("handle").unique(),
    bio: text("bio"),
    createdAt: timestamp("createdAt", { mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    uniqueIndex("user_handle_lower_idx").on(sql`lower(${table.handle})`),
  ],
);

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [
    primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  ],
);

export const comments = pgTable(
  "comment",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    petSlug: text("petSlug").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" })
      .notNull()
      .default(sql`now()`),
    // Soft-delete: keep the row so reply threads don't break, blank the body.
    deletedAt: timestamp("deletedAt", { mode: "date" }),
  },
  (table) => [
    index("comment_pet_slug_idx").on(table.petSlug, table.createdAt),
    index("comment_user_id_idx").on(table.userId, table.createdAt),
  ],
);

export const favorites = pgTable(
  "favorite",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    petSlug: text("petSlug").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.petSlug] }),
    index("favorite_pet_slug_idx").on(table.petSlug),
  ],
);

export const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
  favorites: many(favorites),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
}));
