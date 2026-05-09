import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/lib/db/schema";

// During `next build` Next will import this module while pre-rendering
// pages, even though no actual queries fire. We accept a placeholder URL
// so module init succeeds; queries against it would fail at runtime — but
// that's the right failure mode (loud, in production logs) rather than
// breaking the build.
const url =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@placeholder.neon.tech/placeholder";

const sql = neon(url);

export const db = drizzle(sql, { schema });
