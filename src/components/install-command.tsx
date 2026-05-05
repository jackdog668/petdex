"use client";

import { useEffect, useState } from "react";

import { Download, MousePointerClick, Terminal } from "lucide-react";

type InstallCommandProps = {
  slug: string;
  displayName: string;
};

type Platform = "macos" | "linux" | "windows";

function detectPlatform(): Platform {
  if (typeof window === "undefined") return "macos";
  const ua = window.navigator.userAgent || "";
  const platform =
    (window.navigator as Navigator & { platform?: string }).platform ?? "";
  if (/Win/i.test(platform) || /Windows/i.test(ua)) return "windows";
  if (/Linux/i.test(platform) || /Linux/i.test(ua)) return "linux";
  return "macos";
}

export function InstallCommand({ slug, displayName }: InstallCommandProps) {
  const [platform, setPlatform] = useState<Platform>("macos");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const installPath =
    platform === "windows"
      ? `%USERPROFILE%\\.codex\\pets\\${slug}\\`
      : `~/.codex/pets/${slug}/`;

  return (
    <div className="rounded-2xl border border-black/10 bg-white/76 p-5 shadow-sm shadow-blue-950/5 backdrop-blur">
      <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
        <Download className="size-4" />1. Download the pack
      </div>
      <p className="mt-2 text-xs leading-5 text-stone-500">
        Two files. Save them next to each other in a folder named{" "}
        <code className="rounded bg-stone-100 px-1.5 py-0.5">{slug}</code>.
      </p>
      <div className="mt-3 flex flex-col gap-2">
        <a
          href={`/pets/${slug}/pet.json`}
          download
          className="inline-flex h-10 items-center justify-between rounded-full border border-black/10 bg-white px-4 text-sm text-stone-800 transition hover:border-black/30"
        >
          <span className="font-mono text-xs">pet.json</span>
          <Download className="size-4" />
        </a>
        <a
          href={`/pets/${slug}/spritesheet.webp`}
          download
          className="inline-flex h-10 items-center justify-between rounded-full border border-black/10 bg-white px-4 text-sm text-stone-800 transition hover:border-black/30"
        >
          <span className="font-mono text-xs">spritesheet.webp</span>
          <Download className="size-4" />
        </a>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-950">
          <Terminal className="size-4" />2. Drop into Codex
        </div>
        <PlatformToggle platform={platform} onChange={setPlatform} />
      </div>
      <p className="mt-2 text-xs leading-5 text-stone-600">
        Move the folder to{" "}
        <code className="break-all rounded bg-stone-100 px-1.5 py-0.5">
          {installPath}
        </code>
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-stone-950">
        <MousePointerClick className="size-4" />3. Activate in Codex
      </div>
      <ol className="mt-2 space-y-1 text-xs leading-5 text-stone-600">
        <li>
          Open Codex →{" "}
          <span className="font-mono text-stone-800">Settings</span> →{" "}
          <span className="font-mono text-stone-800">Appearance</span> →{" "}
          <span className="font-mono text-stone-800">Pets</span>.
        </li>
        <li>
          Find <strong className="text-stone-800">{displayName}</strong> under{" "}
          <span className="font-mono text-stone-800">Custom pets</span> and{" "}
          click <span className="font-mono text-stone-800">Select</span>.
        </li>
        <li>
          Use <code className="rounded bg-stone-100 px-1.5 py-0.5">/pet</code>{" "}
          inside Codex to wake the homie or tuck them away.
        </li>
      </ol>
    </div>
  );
}

function PlatformToggle({
  platform,
  onChange,
}: {
  platform: Platform;
  onChange: (p: Platform) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Install platform"
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-black/10 bg-white/70 p-0.5 text-[10px] font-mono uppercase tracking-wider"
    >
      {(["macos", "linux", "windows"] as Platform[]).map((p) => (
        <button
          key={p}
          type="button"
          role="tab"
          aria-selected={platform === p}
          onClick={() => onChange(p)}
          className={`px-2 py-1 rounded-full transition ${
            platform === p
              ? "bg-black text-white"
              : "text-stone-600 hover:text-black"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
