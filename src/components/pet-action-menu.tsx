"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  Check,
  X as CloseIcon,
  Copy,
  ExternalLink,
  Link2,
  MoreHorizontal,
} from "lucide-react";

const SITE_URL = "https://homiedex.vercel.app";

export type PetActionMenuPet = {
  slug: string;
  displayName: string;
  description?: string;
};

type Props = {
  pet: PetActionMenuPet;
  variant?: "card" | "detail";
};

export function PetActionMenu({ pet, variant = "card" }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"link" | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const pageUrl = `${SITE_URL}/pets/${pet.slug}`;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const onCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied("link");
      setTimeout(() => setCopied(null), 1400);
    } catch {
      // ignore
    }
  }, [pageUrl]);

  const triggerSize = variant === "card" ? "size-7" : "size-8";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label={`More actions for ${pet.displayName}`}
        aria-expanded={open}
        className={`grid ${triggerSize} place-items-center rounded-full border border-black/10 bg-white/85 text-stone-700 shadow-sm transition hover:bg-white`}
      >
        {open ? (
          <CloseIcon className="size-3.5" />
        ) : (
          <MoreHorizontal className="size-3.5" />
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-black/10 bg-white shadow-lg"
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopyLink();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-stone-800 transition hover:bg-stone-50"
            role="menuitem"
          >
            {copied === "link" ? (
              <Check className="size-4 text-emerald-600" />
            ) : (
              <Link2 className="size-4" />
            )}
            {copied === "link" ? "Link copied" : "Copy link"}
          </button>
          <a
            href={`/pets/${pet.slug}`}
            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-800 transition hover:bg-stone-50"
            role="menuitem"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="size-4" />
            Open detail page
          </a>
          <a
            href={`/pets/${pet.slug}/pet.json`}
            download
            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-800 transition hover:bg-stone-50"
            role="menuitem"
            onClick={(e) => e.stopPropagation()}
          >
            <Copy className="size-4" />
            Download pet.json
          </a>
        </div>
      ) : null}
    </div>
  );
}
