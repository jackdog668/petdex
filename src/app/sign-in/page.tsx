import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { signInWithProvider } from "@/lib/auth-actions";
import { getCurrentUser } from "@/lib/dal";

import { GithubIcon } from "@/components/github-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Homiedex to comment, favorite, and join the homies.",
};

type Props = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const user = await getCurrentUser();
  const { callbackUrl } = await searchParams;
  if (user) {
    redirect(callbackUrl?.startsWith("/") ? callbackUrl : "/");
  }

  return (
    <main className="min-h-screen bg-[#f7f8ff]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-5 md:px-8 md:py-5">
        <SiteHeader />
      </section>
      <section className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 pb-16 md:px-8">
        <header>
          <p className="text-sm font-semibold tracking-[0.18em] text-cyan-700 uppercase">
            Sign in
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-950 md:text-4xl">
            Pull up to the dex.
          </h1>
          <p className="mt-3 text-stone-600">
            Sign in to comment on the homies, favorite your faves, and rep your
            profile.
          </p>
        </header>

        <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm backdrop-blur">
          <ProviderButton
            provider="github"
            label="Continue with GitHub"
            callbackUrl={callbackUrl}
            icon={<GithubIcon className="size-4" />}
          />
          <ProviderButton
            provider="google"
            label="Continue with Google"
            callbackUrl={callbackUrl}
            icon={<GoogleGlyph />}
          />
        </div>

        <p className="text-xs text-stone-500">
          By signing in you agree to keep things respectful. We only store your
          name, email, and avatar from the provider you choose.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}

function ProviderButton({
  provider,
  label,
  callbackUrl,
  icon,
}: {
  provider: "github" | "google";
  label: string;
  callbackUrl?: string;
  icon: React.ReactNode;
}) {
  return (
    <form action={signInWithProvider}>
      <input type="hidden" name="provider" value={provider} />
      {callbackUrl ? (
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      ) : null}
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
      >
        {icon}
        {label}
      </button>
    </form>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.76h3.55c2.08-1.92 3.29-4.74 3.29-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.55-2.76c-.98.66-2.24 1.06-3.73 1.06-2.87 0-5.3-1.94-6.16-4.55H2.18v2.86A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.86z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.86C6.7 7.32 9.13 5.38 12 5.38z"
      />
    </svg>
  );
}
