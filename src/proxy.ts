// Next.js 16 proxy (the renamed middleware). The Auth.js `auth` export
// itself is a request handler — re-export it as the proxy so every request
// hydrates the session cookie before hitting our routes.
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|pets/.*\\.).*)"],
};
