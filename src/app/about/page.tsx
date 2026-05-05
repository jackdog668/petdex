import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getApprovedPetCount } from "@/lib/pets";

const SITE_URL = "https://homiedex.vercel.app";

export const revalidate = 3600;

export const metadata = {
  title: "About Homiedex — Black & African American pop culture pixel pets",
  description:
    "Homiedex is the codex of Black & African American pop culture as tiny animated pixel pets. Browse legends from music, film, sports, comedy, and history.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Homiedex",
    description:
      "The Black & African American pop culture codex of pixel pets.",
    url: `${SITE_URL}/about`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is Homiedex?",
    a: "Homiedex is a codex of Black & African American pop culture icons — musicians, athletes, actors, comedians, civil rights figures, writers — reimagined as tiny animated pixel pets. Each entry is a small spritesheet with 9 states (idle, working, sleeping, etc.) that can live in the Codex CLI or anywhere else you want a chibi homie cheering you on.",
  },
  {
    q: "How do I install a homie?",
    a: "Open any homie's detail page and click Download on pet.json and spritesheet.webp. Move both files into a folder named after the homie's slug (e.g. ~/.codex/pets/biggie/). Then in Codex go to Settings → Appearance → Pets and select the homie. Use /pet inside Codex to wake it.",
  },
  {
    q: "Where do the homies come from?",
    a: "Hand-curated. Each homie is a pixel sprite generated and reviewed individually — the featured set covers a broad sweep (Biggie, Prince, Bey, T'Challa, Ali, MLK), and the catalog grows as new homies get pixel-arted and committed to the repo.",
  },
  {
    q: "Can I add a new homie?",
    a: "The repo is open. Fork it on GitHub, add public/pets/<slug>/pet.json + public/pets/<slug>/spritesheet.webp, and open a pull request. The site auto-rebuilds on merge.",
  },
  {
    q: "Is Homiedex free and open source?",
    a: "Yes. Every homie is free to install and use, and the site itself is open source on GitHub.",
  },
  {
    q: "What's a vibe? What's a kind?",
    a: "Each pet is tagged with a kind (musician, athlete, character, …) and a few vibes (cozy, playful, focused, mystical, …). These power the gallery filters and per-vibe / per-kind landing pages so you can find the right homie without scrolling.",
  },
  {
    q: "How does Homiedex make money?",
    a: "It doesn't. It's a labor-of-love project. No ads, no upsells.",
  },
];

export default async function AboutPage() {
  const totalPets = await getApprovedPetCount();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: "About Homiedex",
      url: `${SITE_URL}/about`,
      description:
        "Homiedex is the Black & African American pop culture codex of pixel pets.",
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7f8ff] text-[#050505]">
      <JsonLd data={jsonLd} />
      <section className="petdex-cloud relative overflow-hidden">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col px-5 pt-5 pb-10 md:px-8">
          <SiteHeader />
          <div className="mt-12 flex flex-col items-center text-center md:mt-16">
            <p className="font-mono text-xs tracking-[0.22em] text-[#5266ea] uppercase">
              About
            </p>
            <h1 className="mt-3 text-balance text-[40px] leading-[1] font-semibold tracking-tight md:text-[64px]">
              Homiedex is the codex of Black homies
            </h1>
            <p className="mt-5 max-w-2xl text-balance text-base leading-7 text-[#202127] md:text-lg">
              {totalPets}+ Black & African American pop culture legends as tiny
              animated pixel pets. Drop one in your terminal and ship code
              with the GOATs.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-5 py-14 md:px-8 md:py-20">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 md:text-3xl">
            What Homiedex is
          </h2>
          <p className="text-base leading-7 text-stone-700 md:text-lg">
            Homiedex is a public, open-source codex. Every entry is a homie pack
            — a tiny bundle of metadata and pixel art celebrating a Black or
            African American pop culture icon. Think of it as a Pokédex, but
            for the GOATs.
          </p>
          <p className="text-base leading-7 text-stone-700 md:text-lg">
            The catalog spans music, film, sports, comedy, civil rights, and
            literature. Find a companion by mood —{" "}
            <Link
              href="/vibe/cozy"
              className="text-[#5266ea] underline-offset-2 hover:underline"
            >
              cozy
            </Link>{" "}
            or{" "}
            <Link
              href="/vibe/focused"
              className="text-[#5266ea] underline-offset-2 hover:underline"
            >
              focused
            </Link>
            .
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 md:text-3xl">
            How a homie pack works
          </h2>
          <p className="text-base leading-7 text-stone-700 md:text-lg">
            Each homie is two files. <code className="rounded bg-[#eef1ff] px-1 py-0.5 text-[#5266ea]">pet.json</code>{" "}
            defines the metadata — name, the 9 animation states, frame durations
            — and{" "}
            <code className="rounded bg-[#eef1ff] px-1 py-0.5 text-[#5266ea]">spritesheet.webp</code>{" "}
            holds the pixel art as a horizontal strip. Codex loads them at
            startup and swaps states based on what's happening in your session.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 md:text-3xl">
            FAQ
          </h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <article key={item.q} className="space-y-2">
                <h3 className="text-lg font-semibold text-stone-950">
                  {item.q}
                </h3>
                <p className="text-base leading-7 text-stone-700">{item.a}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950 md:text-3xl">
            Browse by kind or vibe
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              ["Creatures", "/kind/creature"],
              ["Objects", "/kind/object"],
              ["Characters", "/kind/character"],
              ["Cozy", "/vibe/cozy"],
              ["Playful", "/vibe/playful"],
              ["Focused", "/vibe/focused"],
              ["Mystical", "/vibe/mystical"],
              ["Wholesome", "/vibe/wholesome"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="inline-flex h-9 items-center rounded-full border border-black/10 bg-white px-3 text-sm text-stone-700 transition hover:border-black/30"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
