# Homiedex

Homiedex is the codex of Black & African American pop culture as tiny animated pixel pets — the legends of music, film, sports, comedy, civil rights, and literature, reimagined as little chibi homies that can live in your terminal.

## How it works

Homies are still file-driven (drop a folder under `public/pets/`, push, ship).
The community layer — sign-in, profiles, comments, favorites — lives in a
Neon Postgres database accessed via Drizzle ORM, with Auth.js handling
GitHub / Google sign-in.

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
cp .env.example .env.local   # fill in AUTH_SECRET, OAuth + DATABASE_URL
bun db:push                  # apply schema to your Neon DB
bun dev
```

## Production

```bash
bun run build
```

## Community schema

The Postgres schema (`src/lib/db/schema.ts`) defines:

- `user`, `account`, `session`, `verificationToken` — Auth.js core tables
- `comment` — forum-style posts on pet pages, soft-deleted
- `favorite` — user → pet favorites, used on profiles

Run `bun db:generate` after schema edits to produce a SQL migration in
`drizzle/`, then `bun db:push` to apply.

### Required env vars

- `AUTH_SECRET` — `openssl rand -base64 32`
- `AUTH_GITHUB_ID` / `AUTH_GITHUB_SECRET`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`
- `DATABASE_URL` — Neon Postgres connection string

## Generating homie sprites

There's no built-in sprite generator in this repo. The loop is manual:

1. Pick a homie from `pets/ideas.json` (or add a new one).
2. Find one or more reference photos (Google Image search is fine — they stay on your machine, never committed).
3. Use Codex CLI, ChatGPT image gen, Midjourney, or any pixel-art tool to produce a 9-row chibi spritesheet from the references.
4. Save as `public/pets/<slug>/pet.json` + `public/pets/<slug>/spritesheet.webp`.
5. Commit, push, deploy.
