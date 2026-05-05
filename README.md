# Homiedex

Homiedex is the codex of Black & African American pop culture as tiny animated pixel pets — the legends of music, film, sports, comedy, civil rights, and literature, reimagined as little chibi homies that can live in your terminal.

## Features

- Browse approved homie packs
- Preview every animation state
- Download individual ZIP packages
- Download the full gallery pack
- Validate and submit community homie packages in the browser

## Development

```bash
bun install
bun dev
```

## Production

```bash
bun run build
```

Homie packages live under `public/pets`, and downloadable archives are generated under `public/packs`. The roster of planned homies (with descriptions and tags) lives in `pets/ideas.json`.

## Brand placeholders

This fork hasn't been wired to its final brand info yet. Search for `your-handle`, `homiedex.example.com`, and `@yourhandle` to find the spots that need real values:

- GitHub repo URL — header, footer, README
- Site URL / domain — `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/about/page.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`
- Twitter / X handle — `src/app/layout.tsx`
- Sponsor link — `src/components/sponsor-button.tsx`, `src/components/site-header.tsx`

## Generating homie sprites

The site renders each homie as a 9-state pixel-art spritesheet, not a raw photo. To produce a sprite for a new homie:

1. Add the homie's metadata to `pets/ideas.json` (name, description, tags).
2. Gather one or more reference photos of the homie (Google Image search is fine — these are source images for the generator, never shipped to the site).
3. Feed the references into `scripts/generate-assets.ts` (uses OpenAI image generation) and review the output.
4. Drop the resulting `pet.json` + `spritesheet.webp` under `public/pets/<id>/`.

Final output is always a stylized pixel sprite — the reference photos stay on your machine.
