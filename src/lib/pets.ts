// Filesystem-based pet loader. Each homie lives at:
//   public/pets/<slug>/pet.json
//   public/pets/<slug>/spritesheet.webp  (or .png)
//
// pet.json shape (minimum required fields):
//   {
//     "id": "biggie",
//     "displayName": "Biggie",
//     "description": "...",
//     "kind": "character",
//     "vibes": ["heroic", "edgy"],
//     "tags": ["music", "hip-hop", "ny"],
//     "featured": true                           // optional
//   }

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import { cache } from "react";

import {
  PET_KINDS,
  PET_VIBES,
  type PetCredit,
  type PetdexPet,
  type PetKind,
  type PetVibe,
} from "@/lib/types";

export type Metrics = {
  installCount: number;
  zipDownloadCount: number;
  likeCount: number;
};

export type PetWithMetrics = PetdexPet & { metrics: Metrics };

const EMPTY_METRICS: Metrics = {
  installCount: 0,
  zipDownloadCount: 0,
  likeCount: 0,
};

const PETS_ROOT = path.join(process.cwd(), "public", "pets");

type RawPetJson = {
  id?: unknown;
  slug?: unknown;
  displayName?: unknown;
  description?: unknown;
  kind?: unknown;
  vibes?: unknown;
  tags?: unknown;
  featured?: unknown;
  submittedBy?: unknown;
};

function isPetKind(v: unknown): v is PetKind {
  return typeof v === "string" && (PET_KINDS as readonly string[]).includes(v);
}

function isPetVibe(v: unknown): v is PetVibe {
  return typeof v === "string" && (PET_VIBES as readonly string[]).includes(v);
}

async function fileExists(p: string): Promise<boolean> {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

async function loadOne(slug: string): Promise<PetdexPet | undefined> {
  const dir = path.join(PETS_ROOT, slug);
  const jsonPath = path.join(dir, "pet.json");
  if (!(await fileExists(jsonPath))) return undefined;

  let raw: RawPetJson;
  try {
    raw = JSON.parse(await readFile(jsonPath, "utf8")) as RawPetJson;
  } catch {
    return undefined;
  }

  const id = (raw.id ?? raw.slug ?? slug) as string;
  if (typeof id !== "string" || id.length === 0) return undefined;
  const displayName =
    typeof raw.displayName === "string" ? raw.displayName : slug;
  const description =
    typeof raw.description === "string" ? raw.description : "";
  const kind = isPetKind(raw.kind) ? raw.kind : "character";
  const vibes = Array.isArray(raw.vibes) ? raw.vibes.filter(isPetVibe) : [];
  const tags = Array.isArray(raw.tags)
    ? raw.tags.filter((t): t is string => typeof t === "string")
    : [];
  const featured = raw.featured === true;
  const submittedBy =
    raw.submittedBy &&
    typeof raw.submittedBy === "object" &&
    typeof (raw.submittedBy as PetCredit).name === "string"
      ? {
          name: (raw.submittedBy as PetCredit).name,
          url: (raw.submittedBy as PetCredit).url,
          imageUrl: (raw.submittedBy as PetCredit).imageUrl,
        }
      : undefined;

  // Pick whichever spritesheet extension exists. Prefer .webp.
  const webp = path.join(dir, "spritesheet.webp");
  const png = path.join(dir, "spritesheet.png");
  let spritesheetFile: string | undefined;
  if (await fileExists(webp)) spritesheetFile = "spritesheet.webp";
  else if (await fileExists(png)) spritesheetFile = "spritesheet.png";

  // If there's no spritesheet on disk, still return the entry — it just
  // renders as a blank cell. Lets you commit pet.json early and add the
  // sprite later.
  const spritesheetPath = spritesheetFile
    ? `/pets/${slug}/${spritesheetFile}`
    : "";
  const petJsonPath = `/pets/${slug}/pet.json`;

  const importedAt = (await stat(jsonPath)).mtime.toISOString();

  return {
    id,
    slug,
    displayName,
    description,
    spritesheetPath,
    petJsonPath,
    approvalState: "approved",
    featured,
    kind,
    vibes,
    tags,
    submittedBy,
    importedAt,
    qa: {},
  };
}

export const getAllApprovedPets = cache(async (): Promise<PetdexPet[]> => {
  let entries: string[] = [];
  try {
    entries = await readdir(PETS_ROOT);
  } catch {
    return [];
  }
  const pets = await Promise.all(entries.map((slug) => loadOne(slug)));
  return pets.filter((p): p is PetdexPet => p !== undefined);
});

export async function getPet(slug: string): Promise<PetdexPet | undefined> {
  const all = await getAllApprovedPets();
  return all.find((p) => p.slug === slug);
}

export async function getPetWithMetrics(
  slug: string,
): Promise<PetWithMetrics | undefined> {
  const pet = await getPet(slug);
  if (!pet) return undefined;
  return { ...pet, metrics: EMPTY_METRICS };
}

export async function getStaticPetSlugs(): Promise<string[]> {
  const all = await getAllApprovedPets();
  return all.filter((p) => p.featured).map((p) => p.slug);
}

export async function getFeaturedPetsWithMetrics(
  limit = 6,
): Promise<PetWithMetrics[]> {
  const all = await getAllApprovedPets();
  return all
    .filter((p) => p.featured)
    .slice(0, limit)
    .map((p) => ({ ...p, metrics: EMPTY_METRICS }));
}

export async function getApprovedPetsWithMetrics(): Promise<PetWithMetrics[]> {
  const all = await getAllApprovedPets();
  return all.map((p) => ({ ...p, metrics: EMPTY_METRICS }));
}

export async function getApprovedPetCount(): Promise<number> {
  const all = await getAllApprovedPets();
  return all.length;
}
