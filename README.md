# Homiedex

Homiedex is the codex of Black & African American pop culture as tiny animated pixel pets — the legends of music, film, sports, comedy, civil rights, and literature, reimagined as little chibi homies that can live in your terminal.

## How it works

The site reads pets directly from the filesystem. No database, no auth, no storage service. Each homie is a folder under `public/pets/`:

```
public/pets/biggie/
├── pet.json          # metadata
└── spritesheet.webp  # 8x9 grid of animation frames
```

Drop a new folder, push to GitHub, Vercel rebuilds, the homie is live.

## Anatomy of a homie

### `pet.json`

```json
{
  "id": "biggie",
  "displayName": "Biggie",
  "description": "A tiny crowned king of New York rap rocking shades and a Coogi sweater.",
  "kind": "character",
  "vibes": ["heroic", "edgy"],
  "tags": ["music", "hip-hop", "ny"],
  "featured": true
}
```

- `id` / `slug` — must match the folder name
- `kind` — `creature` | `object` | `character`
- `vibes` — any of: `cozy`, `calm`, `playful`, `cheerful`, `focused`, `mischievous`, `heroic`, `edgy`, `mystical`, `wholesome`, `chaotic`, `melancholic`
- `tags` — free-form
- `featured` — `true` puts the homie on the hero parade

### `spritesheet.webp`

An 8 × 9 grid (recommended **1536 × 1872**, each cell 192 × 208) on a transparent background. Each row is one animation:

| Row | Animation | Frames | Duration |
|-----|-----------|--------|----------|
| 0   | Idle       | 6 | 1100ms |
| 1   | Run Right  | 8 | 1060ms |
| 2   | Run Left   | 8 | 1060ms |
| 3   | Waving     | 4 | 700ms  |
| 4   | Jumping    | 5 | 840ms  |
| 5   | Failed     | 8 | 1220ms |
| 6   | Waiting    | 6 | 1010ms |
| 7   | Running    | 6 | 820ms  |
| 8   | Review     | 6 | 1030ms |

Frames go left-to-right per row. Rows that don't need 8 frames just leave the rightmost cells transparent.

### Roster

The full curated list of planned homies (with descriptions and tags) lives in `pets/ideas.json`. Sprites get added one at a time as they're pixel-arted.

## Development

```bash
bun install
bun dev
```

## Production

```bash
bun run build
```

## Generating homie sprites

There's no built-in sprite generator in this repo. The loop is manual:

1. Pick a homie from `pets/ideas.json` (or add a new one).
2. Find one or more reference photos (Google Image search is fine — they stay on your machine, never committed).
3. Use Codex CLI, ChatGPT image gen, Midjourney, or any pixel-art tool to produce a 9-row chibi spritesheet from the references.
4. Save as `public/pets/<slug>/pet.json` + `public/pets/<slug>/spritesheet.webp`.
5. Commit, push, deploy.
