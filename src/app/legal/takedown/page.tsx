import { GithubIcon } from "@/components/github-icon";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Takedown — Homiedex",
  description: "How to report a homie that infringes your rights.",
  robots: { index: true, follow: true },
};

const REPO = "jackdog668/homiedex";

export default function TakedownPage() {
  const issueUrl = `https://github.com/${REPO}/issues/new`;

  return (
    <main className="min-h-screen bg-[#f7f8ff] text-[#050505]">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-5 md:px-8 md:py-5">
        <SiteHeader />
      </section>
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 pb-12 md:px-8 md:pb-16">
        <header>
          <p className="font-mono text-xs tracking-[0.22em] text-[#5266ea] uppercase">
            Legal · Takedown
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Report a homie
          </h1>
          <p className="mt-4 text-base leading-7 text-stone-700">
            Homiedex hosts fan-art pixel pets celebrating Black & African
            American pop culture icons. We don't claim rights to the underlying
            likeness or IP of anyone depicted. If you're a rights holder (or
            authorized representative) and want a homie removed, open a GitHub
            issue.
          </p>
        </header>

        <section className="space-y-3 rounded-2xl border border-black/10 bg-white/76 p-6 backdrop-blur">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-stone-700">
            <li>Open a takedown request via the link below.</li>
            <li>
              Tell us which homie (slug from the URL) and your relationship to
              the IP.
            </li>
            <li>
              We review manually. Typical response under 48 hours. Filings stay
              public on GitHub for transparency.
            </li>
            <li>Approved takedowns remove the homie from the gallery.</li>
          </ol>
        </section>

        <a
          href={issueUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 w-fit items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
        >
          <GithubIcon className="size-4" />
          Open takedown request
        </a>

        <p className="border-t border-black/10 pt-6 text-xs text-stone-500">
          Homiedex is a fan project. We act on good-faith takedown requests.
        </p>
      </section>
      <SiteFooter />
    </main>
  );
}
