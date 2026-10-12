# Folio — project conventions

Personal portfolio for **Diogo Nóbrega** — multidisciplinary designer
(graphic design, 3D, motion, illustration, branding). Goal: land freelance
and full-time work.

## Stack

- Plain **HTML + CSS + JS**. No framework, no build step, **no dependencies**
  (no GSAP, no npm — the machine has no Node). Keep it that way.
- Pages: `index.html` · `about.html` · `estoril-open.html` · `aldi.html` ·
  `christina.html` · `ai.html` · `other.html` · `css/styles.css` · `js/main.js`.
- Fonts (Google Fonts): **Anton** (heavy condensed display — the big
  headlines) and **Space Mono** (nav, labels, credits, body copy — everything
  else).
- Preview: `python -m http.server 4173` → `http://localhost:4173`, or use
  `preview_start` with the `"folio"` config in `.claude/launch.json`.

## Art direction — "dark cargo"

A rebuild of Diogo's earlier daandesign.cargo.site portfolio as plain static
HTML/CSS/JS. This replaced the previous "warm sketchbook" site as the live
site on 2026-09-13 — that version is fully preserved at `sketchbook/` (see
bottom of this file). Keep this identity:

- **One ground.** Near-black `--bg`. A soft green halftone glow sits fixed in
  the top-left corner (`body::before`) — decorative, matches the original
  reference site.
- **One accent:** `--accent`, a vibrant lime green (`#80dc3b`, sampled from
  the original site). Used for `›`/`‹` chevrons, the compare-slider handle,
  credit-list accents, the `EN` language tag on bilingual project copy.
  Nothing else is coloured by us — photos and client logos show in their own
  colours.
- **Type.** Anton, all-caps, for every `h1` (hero name, project titles, about
  heading). Space Mono for absolutely everything else — nav, tagline, tile
  labels, captions, credits, body paragraphs. No third font.
- **Work grid is an explicit CSS grid, not a masonry.** `.grid` is 3 columns
  on desktop with named areas: ALDI top-left, Estoril Open (tall, spans both
  rows) in the middle, Christina top-right, **AI** under ALDI and **Other**
  under Christina — placed by `:nth-child` inside `@media (min-width: 861px)`,
  so **the order of the five tiles in `index.html` matters** (aldi, estoril,
  christina, ai, other). ≤860px it's 2 columns, ≤560px 1 column, in DOM order.
  Image tiles keep their natural aspect ratio; `.tile` has **no border and no
  background** — images sit directly on the page background with no visible
  card edge. Don't reintroduce `border`/`background` on `.tile`.
- **Brand marquee** (`.brands`): two identical `.brand-track` blocks looping
  via a CSS `translateX` keyframe — keep both tracks identical for a seamless
  loop, same technique as the old site.

## Colour (tokens in `:root`)

`--bg #0a0a0a` · `--bg-2 #111111` · `--ink #f2f2f0` · `--ink-soft #8f8f89` ·
`--line #232323` · `--accent #80dc3b`.
Change tokens only — never hard-code a colour elsewhere.

## Content / project pages

- Work items on `index.html`: `<a class="tile" href="slug.html"><img>…
  <span class="tile-label">Name <span class="chev">↗</span></span></a>`
  inside `.grid`. A tile with no project page yet is a plain `<div class="tile">`
  (not a link) with an `EDIT ME` comment above the group.
- **Project pages** — one HTML file per project, all with the **same head
  structure** (the user asked for every project page to match):
  - `.project-head` with the `<h1>` as `Brand <span class="chev">›</span>
    Campaign` (e.g. `ALDI › Abertura Príncipe Real`).
  - Then `.project-columns`: a narrow `.project-credits-col` (`<dl>`, vertical
    list: Agency / Creative Director / Project Manager / Design / Copy /
    Client) beside `.project-copy` (two `.lang-block`s — PT, then EN).
    Every project needs both the PT and EN description.
  - Then `.project-shots` — a vertical stack of images.
    Default has a gap and rounded corners; add the modifier class
    `.project-shots--flush` (gap: 0, square corners) when the source artwork
    is designed to butt up edge-to-edge into one continuous stripe — check
    with the user before assuming, but `aldi.html`/`christina.html` both use it.
  - `.pm-compare-slider` — drag-to-compare (render vs. built), ported from
    the sketchbook site: base `<img>` + `.cs-over` (a wrapping `<div>` with
    the clip-path, containing the second `<img>`) + `.cs-handle` + a native
    `.cs-range` input driving `--p` via the `[data-compare]` handler in
    `js/main.js`. **The container is a fixed `aspect-ratio: 3/2`** — always
    crop/size the two source images to roughly that ratio, or `object-fit:
    cover` will show mostly dead/letterboxed space (this happened twice).
  - Reuses the site header/footer + `js/main.js`; nav links are relative
    (same-folder), back-link points at `index.html#work`.
- **Transparent source art**: when a client PNG has real alpha (soft edges,
  drop shadows, torn/rounded cutouts meant to blend into the page), export it
  as **WebP with alpha preserved** — not a JPG flattened onto an
  approximated black. A flattened JPG reliably shows a visible seam/border
  against the page background; WebP-with-alpha both fixes that and compresses
  better than the equivalent PNG. See `assets/estoril/recap-*.webp`.
- **Collection pages** (`ai.html`, `other.html`) — not case studies but
  containers holding many pieces of work. They show on the home grid as
  typographic `.tile--cat` tiles (big Anton word, no cover image) and open a
  page with `.collection-head` (title + one-line blurb) followed by the work:
  - `ai.html`: `.video-grid` of `<figure class="work work--video">`s, each a
    portrait 3:4 `<video controls playsinline preload="metadata">` (src ends
    `#t=0.1` so the first frame shows). Clips live in `assets/ai/` (~15 MB
    each; no ffmpeg on this machine, so they're uncompressed).
  - `other.html`: a `.project-shots` stack of `<figure class="work">`s
    (image + label) in `assets/other/` as WebP. Add `is-tall` to the figure
    for a portrait image so it isn't stretched to full width. Order on the
    page is deliberate (the tall email image is last).
  - **Hover labels:** every `.work` has a `<span class="work-label"
    aria-hidden="true">` that fades in over the image on hover (dim overlay +
    centred text; on videos it's a top bar so the controls stay usable; on
    touch screens it's a small always-visible tag). Put the real description
    in the image `alt`. Labels in use: "Posts Leads Sical", "Store Decoration
    Adidas", "KV Lion", "Nestlé Leite Condensado POS", "CRM's Decathlon",
    "FOOH Videos".
- To add a project: copy `christina.html`, drop web-sized images in a new
  `assets/<slug>/`, and point a new tile in `index.html`'s `.grid` at the file.
- About page (`about.html`): portrait + PT/EN `.lang-block`s shown
  simultaneously (no toggle) — this site has no language switcher, unlike
  the old one.

## House rules

- No build step, no new dependencies, no analytics.
- Test at 375 / 768 / 1280+. Body must never scroll horizontally.
- **The local dev server sends no cache headers.** Python's `http.server`
  will still serve a stale copy of an image or CSS file you just overwrote
  until the browser's own cache expires or is force-refreshed. Verify a fix
  landed with a `fetch(url, {cache:'no-store'})` check (or a hard refresh),
  not by trusting a normal reload — this has caused false "it didn't work"
  reports more than once.
- Accessible: one `<h1>` per page, real `alt` text, visible focus states.

## Previous version — "warm sketchbook" (now `sketchbook/`)

The original site (aged-paper background, hand-drawn Shantell Sans +
Newsreader type, one orange accent, PT/EN bilingual toggle via
`sketchbook/js/i18n.js`) is preserved in full at `sketchbook/` as a backup.
It is a complete, self-contained copy of the old site (its own `index.html`,
`css/styles.css`, `js/`, `assets/`) and is not linked from the current live
site. Its internal conventions are unchanged from when it was primary — see
git history / earlier revisions of this file if you need to work on it again.
