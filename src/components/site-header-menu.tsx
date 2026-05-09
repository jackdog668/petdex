"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Menu, X } from "lucide-react";

import { GithubIcon } from "@/components/github-icon";
import { PetdexLogo } from "@/components/petdex-logo";

type Props = {
  userSlot: React.ReactNode;
  mobileUserSlot: React.ReactNode;
};

export function SiteHeaderMenu({ userSlot, mobileUserSlot }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className="flex items-center justify-between gap-3">
        <PetdexLogo href="/" />

        <div className="hidden items-center gap-9 text-sm text-[#4f515c] md:flex">
          <Link href="/#gallery" className="transition hover:text-black">
            Gallery
          </Link>
          <Link href="/about" className="transition hover:text-black">
            About
          </Link>
          <a href="/api/manifest" className="transition hover:text-black">
            Manifest
          </a>
          <a
            href="https://github.com/jackdog668/homiedex"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-black"
          >
            <GithubIcon className="size-4" />
            GitHub
          </a>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden md:block">{userSlot}</div>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full border border-black/10 bg-white/70 text-stone-700 transition hover:bg-white md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        // biome-ignore lint/a11y/noStaticElementInteractions: backdrop click-outside; Escape handler on window dismisses too.
        // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click-outside; Escape handler on window dismisses too.
        <div
          className="fixed inset-0 z-40 flex flex-col bg-[#f7f8ff]/95 backdrop-blur md:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-3">
            <PetdexLogo href="/" />
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid size-10 place-items-center rounded-full border border-black/10 bg-white text-stone-700 transition hover:bg-stone-100"
            >
              <X className="size-4" />
            </button>
          </div>
          <nav className="mt-4 flex flex-col gap-1 px-5 text-lg">
            <MobileLink href="/#gallery" onClick={() => setOpen(false)}>
              Gallery
            </MobileLink>
            <MobileLink href="/about" onClick={() => setOpen(false)}>
              About
            </MobileLink>
            <MobileLink href="/api/manifest" onClick={() => setOpen(false)}>
              Manifest
            </MobileLink>
            <a
              href="https://github.com/jackdog668/homiedex"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-2xl px-4 py-3 transition hover:bg-white"
              onClick={() => setOpen(false)}
            >
              <GithubIcon className="size-5" />
              GitHub
            </a>
            <div className="mt-2 border-t border-black/10 pt-3">
              {mobileUserSlot}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-2xl px-4 py-3 text-stone-800 transition hover:bg-white"
    >
      {children}
    </Link>
  );
}
