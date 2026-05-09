import { handlers } from "@/auth";

// Drizzle / @neondatabase/serverless rely on Node APIs; force Node runtime.
export const runtime = "nodejs";

export const { GET, POST } = handlers;
