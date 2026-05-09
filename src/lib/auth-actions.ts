"use server";

import { signIn, signOut } from "@/auth";

export async function signInWithProvider(formData: FormData) {
  const provider = formData.get("provider");
  const callbackUrl = formData.get("callbackUrl");
  if (typeof provider !== "string") return;
  await signIn(provider, {
    redirectTo:
      typeof callbackUrl === "string" && callbackUrl.startsWith("/")
        ? callbackUrl
        : "/",
  });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
