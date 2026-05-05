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

## Generating homie sprites

The site renders each homie as a 9-state pixel-art spritesheet (`spritesheet.webp`), not a raw photo. There's no built-in sprite generator in this repo yet — the loop right now is manual:

1. Add the homie's metadata to `pets/ideas.json` (name, description, tags).
2. Gather one or more reference photos of the homie (Google Image search is fine — these are source images for the generator, they never ship with the site).
3. Use an external pixel-art generator (Codex CLI, ChatGPT image gen, Midjourney, etc.) with the references and a prompt for a 9-state chibi sprite strip on transparent background.
4. Drop the resulting `pet.json` + `spritesheet.webp` under `public/pets/<id>/`.

Final output is always a stylized pixel sprite — the reference photos stay on your machine.
