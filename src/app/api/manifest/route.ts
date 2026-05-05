import { NextResponse } from "next/server";

import { getAllApprovedPets } from "@/lib/pets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const origin = new URL(req.url).origin;
  const pets = await getAllApprovedPets();

  const items = pets.map((pet) => ({
    slug: pet.slug,
    displayName: pet.displayName,
    description: pet.description,
    kind: pet.kind,
    vibes: pet.vibes,
    tags: pet.tags,
    featured: pet.featured ?? false,
    submittedBy: pet.submittedBy?.name ?? null,
    pageUrl: `${origin}/pets/${pet.slug}`,
    spritesheetUrl: pet.spritesheetPath
      ? `${origin}${pet.spritesheetPath}`
      : null,
    petJsonUrl: `${origin}${pet.petJsonPath}`,
  }));

  return NextResponse.json(
    {
      generatedAt: new Date().toISOString(),
      total: items.length,
      featured: items.filter((p) => p.featured).length,
      pets: items,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    },
  );
}
