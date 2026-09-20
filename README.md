# Folio

Personal portfolio for Diogo Nóbrega — multidisciplinary designer (graphic
design, 3D, motion, illustration, branding). **Dark cargo** aesthetic: a
rebuild of Diogo's earlier daandesign.cargo.site portfolio as plain static
HTML/CSS/JS — near-black background, a lime-green accent, Anton headlines +
Space Mono for everything else. Plain HTML/CSS/JS — **no build, no
dependencies**.

The previous "warm sketchbook" version (aged-paper look, PT/EN toggle) is
kept as a full backup in [`sketchbook/`](sketchbook/) — see that folder's own
files for its conventions; it isn't linked from the live site.

## Preview locally

```bash
python -m http.server 4173
```

Open <http://localhost:4173>. `Ctrl+C` to stop. (Opening `index.html`
directly works too — all paths are relative.) Note: this server sends no
cache headers, so after replacing an image or CSS file you may need a hard
refresh to see the change.

## Structure

```
index.html            home: nav · hero · work grid (masonry) · brand marquee · footer
about.html            portrait + PT/EN bio shown side by side (no toggle)
aldi.html             project page — credits + PT/EN head, flush image stack
estoril-open.html     project page — credits + PT/EN head, compare-slider, image stack
christina.html        project page — credits + PT/EN head, flush image stack
css/styles.css        tokens → base → header/hero → work grid → marquee →
                       about → project-page helpers → compare-slider
js/main.js            drag-to-compare slider logic ([data-compare])
assets/
  work/                cover thumbnails for the home-grid tiles
  about/portrait.jpg
  brands/strip-*.png   scrolling brand-strip logo sheets
  aldi/ estoril/ christina/   web-sized images for each project page
  favicon.svg
CLAUDE.md              art-direction + conventions for future edits
sketchbook/            the previous site version, kept as a full backup
```

## Make it yours

Search the HTML files for `EDIT ME`. The main spots:

1. **`<title>` + meta description** — top of `index.html`.
2. **Hero** — the name and tagline. The "Curriculum vitae" nav item on every
   page links to `assets/Diogo-Nobrega-CV.pdf` — replace that file to update
   the CV.
3. **Work grid** (`index.html`, `.grid`) — some tiles aren't linked to a
   project page yet; copy `christina.html`, drop images in a new `assets/<slug>/`,
   and point the tile's `href` at it.
4. **About** (`about.html`) — bio paragraphs (PT + EN shown together), the
   portrait at `assets/about/portrait.jpg`.

## Project pages

Every project page has the same head: a `Brand › Campaign` title, then a
narrow credits list (Agency / Creative Director / Project Manager / Design /
Copy / Client) beside the description in PT and EN. Details in `CLAUDE.md`.

The head continues into `.project-shots` — a vertical stack of images. Add
`.project-shots--flush` when the source artwork should butt up edge-to-edge
into one continuous stripe (no gap, square corners).

`estoril-open.html` also has a drag-to-compare slider (`.pm-compare-slider`,
render vs. built) — keep the two source images close to a 3:2 ratio or the
crop will show dead space.

To add another project: copy `christina.html`, rename it, swap the
credits/copy/images, drop images in a new `assets/<slug>/`, and add a tile
on `index.html` linking to it.

## Brand strip

`.brands` scrolls two identical logo tracks — `assets/brands/strip-1.png`
and `strip-2.png` (white logos on transparent). Keep both `.brand-track`
blocks in `index.html` identical for a seamless loop.

## Deploy

1. `git init && git add -A && git commit -m "Portfolio"`
2. Push to a new GitHub repo.
3. Import into **Vercel** or **Netlify** — no framework, root folder is the
   output. Auto-deploys on every push. Free tier is plenty.
