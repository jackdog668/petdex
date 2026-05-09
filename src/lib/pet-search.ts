// In-memory search over the filesystem-loaded pet list. No DB.

import { getApprovedPetsWithMetrics, type PetWithMetrics } from "@/lib/pets";
import { PET_KINDS, PET_VIBES, type PetKind, type PetVibe } from "@/lib/types";

export type SortKey = "curated" | "popular" | "installed" | "alpha";

export type SearchInput = {
  q?: string;
  kinds?: PetKind[];
  vibes?: PetVibe[];
  sort?: SortKey;
  cursor?: number;
  limit?: number;
};

export type SearchOutput = {
  pets: PetWithMetrics[];
  total: number;
  nextCursor: number | null;
  facets: {
    kinds: Record<string, number>;
    vibes: Record<string, number>;
  };
};

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 60;

export const SEARCH_LIMITS = {
  DEFAULT_LIMIT,
  MAX_LIMIT,
} as const;

export async function searchPets(input: SearchInput): Promise<SearchOutput> {
  const all = await getApprovedPetsWithMetrics();

  const q = input.q?.trim().toLowerCase() ?? "";
  const kinds = input.kinds && input.kinds.length > 0 ? input.kinds : null;
  const vibes = input.vibes && input.vibes.length > 0 ? input.vibes : null;
  const sortKey = input.sort ?? "curated";
  const limit = clamp(input.limit ?? DEFAULT_LIMIT, 1, MAX_LIMIT);
  const cursor = Math.max(0, input.cursor ?? 0);

  const filtered = all.filter((p) => {
    if (kinds && !kinds.includes(p.kind)) return false;
    if (vibes && !p.vibes.some((v) => vibes.includes(v))) return false;
    if (q) {
      const hay =
        `${p.displayName}\n${p.description}\n${p.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => sortCmp(a, b, sortKey));
  const total = sorted.length;

  const slice = sorted.slice(cursor, cursor + limit);
  const nextCursor = cursor + limit < total ? cursor + limit : null;

  // Facets always show the full unfiltered universe so users see all options.
  const facets: SearchOutput["facets"] = {
    kinds: Object.fromEntries(PET_KINDS.map((k) => [k, 0])),
    vibes: Object.fromEntries(PET_VIBES.map((v) => [v, 0])),
  };
  for (const pet of all) {
    facets.kinds[pet.kind] = (facets.kinds[pet.kind] ?? 0) + 1;
    for (const v of pet.vibes) {
      facets.vibes[v] = (facets.vibes[v] ?? 0) + 1;
    }
  }

  return { pets: slice, total, nextCursor, facets };
}

function sortCmp(a: PetWithMetrics, b: PetWithMetrics, key: SortKey): number {
  switch (key) {
    case "popular":
      return (
        b.metrics.likeCount - a.metrics.likeCount ||
        a.displayName.localeCompare(b.displayName)
      );
    case "installed":
      return (
        b.metrics.installCount - a.metrics.installCount ||
        a.displayName.localeCompare(b.displayName)
      );
    case "alpha":
      return a.displayName.localeCompare(b.displayName);
    case "curated":
    default:
      return (
        Number(b.featured ?? false) - Number(a.featured ?? false) ||
        a.displayName.localeCompare(b.displayName)
      );
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
