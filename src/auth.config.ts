import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// Edge-safe Auth.js config. No DB imports here — the proxy/middleware loads
// this file and the Drizzle adapter is Node-only.
export const authConfig = {
  providers: [GitHub, Google],
  pages: {
    signIn: "/sign-in",
  },
} satisfies NextAuthConfig;
