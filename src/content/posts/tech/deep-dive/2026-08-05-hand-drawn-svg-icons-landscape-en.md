---
title: "Three Routes to Hand-Drawn SVG Icons: A ~88k Free Library, a Generator That Bends Lucide, and the License Page Nobody Reads"
date: 2026-08-05
type: deep-dive
category: tech
tags: [svg, icons, hand-drawn, open-source, licensing, developer-tools, mcp]
lang: en
tldr: "Koboyo claims close to 90,000 free hand-drawn SVG icons (the count oscillates: 92,967 → 87,954 → 90,150), but its sitemap only lists about 17,930 icon pages, and its license page explicitly forbids building an icon library or canvas app with them. There are actually three routes to a hand-drawn look: collect a library, bend existing geometry programmatically (sketchyicons turns every straight run in Lucide into a quadratic Bézier, seeded by icon name for byte-for-byte reproducibility), or generate with AI. This piece compares seven libraries on scale and license, unpacks the algorithms behind sketchyicons and tldraw, and surveys the icon search tools now shipping MCP servers."
description: "Starting from Koboyo Icons' nearly 90,000 free hand-drawn SVGs, this article compares the scale and licensing of Khushmeen, Streamline Freehand, Icons8 Doodle, and Iconro (including Streamline's 100-icons-per-project allowance and its mandatory attribution for open-source projects), dissects sketchyicons' seeded coordinate perturbation and tldraw's multi-pass stroke rendering, and surveys icon search tools like icons0.dev and theSVG that expose MCP servers."
draft: false
glossary:
  - term: "quadratic Bézier"
    aliases: ["quadratic curve", "二次貝茲曲線"]
    definition: "A curve defined by a start point, an end point, and a single control point. The control point does not sit on the curve — it pulls the segment toward itself to create the bend."
    definition_en: "A curve defined by a start point, an end point, and a single control point. The control point does not sit on the curve — it pulls the segment toward itself to create the bend."
    advanced: "Corresponds to the `Q` command in SVG path syntax. Compared to cubic Bézier (`C`, two control points), a quadratic curve has only one control point — fewer parameters, cheaper to compute, and well suited to batch-perturbing large numbers of existing straight segments."
    advanced_en: "Corresponds to the `Q` command in SVG path syntax. Compared to cubic Bézier (`C`, two control points), a quadratic curve has only one control point — fewer parameters, cheaper to compute, and well suited to batch-perturbing large numbers of existing straight segments."
    context: "This article uses it to explain how sketchyicons turns Lucide's straight runs into hand-drawn-looking arcs."
    context_en: "This article uses it to explain how sketchyicons turns Lucide's straight runs into hand-drawn-looking arcs."
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-05-hand-drawn-svg-icons-landscape)

[Koboyo Icons](https://koboyo.com/icons) lists close to 90,000 free hand-drawn SVG icons — free for commercial use, no attribution, no signup. That scale is absurd for a free library: [Streamline](https://www.streamlinehq.com/)'s Freehand, billed as the largest hand-drawn set in the industry, has 11,171 icons in its main set, and costs money.

Don't treat that number as a constant, though. On the morning I wrote this, both the homepage and the license page showed **92,967**; a few hours later it read **87,954**, and Google's index still holds an older 71,238. The next day (2026-08-06) it was back up to **90,150**. So this isn't one-way pruning, it oscillates — this article says "close to 90,000" rather than pinning a figure, and by the time you read it there will probably be another one.

There's a second number that doesn't line up. [`koboyo.com/sitemap.xml`](https://koboyo.com/sitemap.xml) is a single flat `<urlset>` — not a sitemap index, no shards — and the whole file lists just **18,044 URLs**. Subtract the set and site-chrome pages and roughly **17,930 are icon pages**, five times fewer than the 90,150 the license page claims.

That does not mean the library only holds 18k icons: an icon absent from the sitemap is still reachable through on-site search or directly at `/icons/svg/<name>.svg`. But it does mean **what search engines can discover, and what you can actually browse, is an order of magnitude smaller than the headline figure**. If "best coverage" is your reason for picking Koboyo, search for a few of the obscure concepts you actually need before trusting the total.

Before you download, though, it's worth reading the [license page](https://koboyo.com/icons/license), because there's a clause there that decides whether you can use them at all.

And in 2026, "I want hand-drawn icons" no longer has just one answer. This piece covers three routes: **collect an existing library**, **bend existing geometry with code**, and **generate with AI**. The second route has the most interesting engineering, and the least written about it.

If you want vector *animation* rather than static icons, see [Text / Image to Lottie](/posts/ai/2026-06-09-text-image-to-lottie-open-source-en); for 3D assets, see [the 2026 3D modeling tools map](/posts/ai/2026-07-27-3d-modeling-tools-landscape-en). This one fills in the static 2D vector slot.

```
What do you need?
├── Maximum coverage, license limits acceptable ──→ Koboyo (~88k)
├── Cleanest license (CC0) ──────────────────────→ Khushmeen (400+)
├── Consistency, willing to pay ─────────────────→ Streamline Freehand (set of 11,171, from $19/mo)
├── Already on Lucide, want a different tone ────→ sketchyicons (generated, MIT)
├── Your own drawn shapes need the look too ─────→ Rough.js / tldraw's approach
└── Let an AI agent find icons ──────────────────→ icons0.dev / theSVG (MCP)
```

## Route one: existing libraries, where the real variable is the license

### The Koboyo clause that's easy to miss

The "You can't" section of Koboyo's license is blunt:

> Resell or redistribute the library (or any substantial part of it) as an icon collection, on a stock/marketplace site, or as a competing icon product, modified or not.
>
> Build a competing product with them, such as an icon library, or a canvas, whiteboard, diagramming, presentation or drawing app like koboyo.com.
>
> Bundle the icons into any app where they are the feature, or where users can pick, extract, download or re-share them.

The first clause is the standard anti-resale term every library has. Clauses two and three are the ones that matter: **you can't use them in a whiteboard, diagramming, presentation, or drawing app** (Koboyo itself is an [infinite canvas](https://koboyo.com/)), and **if your users can pick, extract, or download icons inside your app, you've crossed the line**.

In plain terms: using them as the UI icons of your own site or product is fine; building an editor where users choose icons to drop into a document is not. That's a long way from CC0 — and it happens to be the license wording that looks the most carefree, since it requires no attribution at all.

On where the icons come from, the license page says only that "The icons are curated, corrected and organised by hand" — which describes the curation process, not the drawing method. (Browsing the library turns up heavily systematic variants: the same concept appears as `drawn boldly` / `hand drawn loosely` / `at a slight angle` / `with a soft shadow`, and the interface category is a Cartesian product of `A card of` / `A grid of` / `A list of` / `A panel of` against activity, calendar, comments, and so on. That naming structure usually indicates batch generation — but this is my inference from the naming pattern, not something the site states.)

### Seven libraries by scale and license

| Library | Count | License | Watch out for |
|---|---|---|---|
| [Koboyo Icons](https://koboyo.com/icons) | License page says 90,150 (2026-08-06), sitemap lists ~17,930 pages | Free commercial, no attribution, **no competing products or "icons as the feature" apps** | Claimed coverage is unbeatable; browsable coverage is an order of magnitude smaller. You must judge the usage boundary yourself too |
| [Khushmeen Doodle Icons](https://khushmeen.com/icons.html) | 400+ | **CC0, no attribution** | Cleanest license. Ships Figma file and animated versions |
| [Streamline Freehand](https://www.streamlinehq.com/icons/streamline-freehand) | set of 11,171 (Freehand family: 22,349) | From $19/mo, or lifetime purchase; free sets need attribution | **100-icon-per-project allowance** (liftable via add-on); open-source projects require attribution even on paid plans |
| [Icons8 Doodle](https://icons8.com/icons/doodle) | 2,200 (57 categories) | Freemium, attribution on free tier | Colorful marker style, better for decks than UI |
| [Iconro Hand Drawn](https://iconro.com/icons/hand-drawn) | 1,010 | Free commercial, **backlink attribution required** | Live color/stroke editor on every icon page |
| [doo-iconik](https://github.com/ajentik/doo-iconik) | 595 | MIT | Packaged for 15 frameworks, including Rails / Laravel / Flutter |
| [Duma Icons](https://duma-icons.dudych.cc/) | 451 | Free | SVG + React |

Streamline occupies a different position from the rest: it's the only commercial option maintained long-term by a human team. Its [official page](https://www.streamlinehq.com/icons/streamline-freehand) notes Freehand is built on a 24px grid, where "varying stroke thickness creates an artistic look." For a hand-drawn set consistent enough to carry an entire product, this is still the safest answer.

The costs are all spelled out in the [license terms](https://help.streamlinehq.com/en/articles/5354366-streamline-premium-licenses), and there's more than one:

> Use up to 100 icons, 50 illustrations, 50 elements, or 50 emojis per project.
>
> It's 100 unique icons per project, so if you repeat one icon 10 times, it still counts only as one.

That allowance is often relayed as a hard ceiling, but section 6 of the same terms offers an Extended Allowance License that lifts it. Three other clauses have no such escape hatch, and they're the ones developers are more likely to trip over:

- **Open-source projects require attribution even on a paid plan** — "attribution is mandatory when incorporating our icons into open-source projects, including proper credits and a link to streamlinehq.com." Paying does not buy you out of crediting, which runs against most people's intuition.
- **No use for AI training** ("Do not use assets for AI training").
- **Only one licensed user per organization can access the vector sources.** Everyone else works from a pre-selected batch; more seats cost extra.

So the calculation before choosing Streamline isn't only whether the icon count is enough — it's also whether your project is open source and how many people need to touch the source files.

Khushmeen sits at the opposite extreme: barely 400 icons, but **CC0, no attribution, no restrictions**, plus a Figma file. [react-doodle-icons](https://github.com/agilek/react-doodle-icons) wraps 439 of them as MIT-licensed React components at roughly 200 bytes per icon. If your need is "swap common UI icons for a hand-drawn style" rather than "cover every obscure concept," this combination causes the least trouble.

## Route two: don't collect icons, bend the geometry

This route inverts the premise: **instead of finding hand-drawn icons, take a geometrically precise set and scramble the coordinates before rendering**. Coverage equals the upstream library (Lucide has 1,500+), licensing follows upstream, and the intensity of the effect becomes a parameter.

### sketchyicons: Lucide's geometry, seeded by name

[sketchyicons](https://sketchyicons.com/) has 1,500+ icons, and describes itself as "Nobody drew them":

> A generator takes Lucide's geometry and bends every line, seeded per icon so your build and mine produce it byte for byte.

The algorithm is two passes, spelled out on their site:

> Every straight run becomes a quadratic whose control point sits off the midpoint by a fraction of the run's own length. Then every coordinate moves. Both are seeded from the icon name, so the result is identical on every machine.

Three things are happening:

1. **Each straight run becomes a quadratic Bézier**, with the control point offset from the midpoint by **a fraction of that run's own length** — not a fixed pixel value.
2. **Every coordinate then shifts** in a second pass.
3. Both passes seed their randomness from the **icon name**, making the output deterministic: the same icon produces identical path data on any machine, on any build.

That "fraction of the run's own length" in step 1 is the crux of the design, because it makes tight shapes converge automatically:

> A coordinate cannot wander further than the run it belongs to and still be that run, so tight shapes barely move. That is the point rather than a limitation: everybody knows exactly what a chevron looks like, so a shaky one reads as broken, while a feather can wander and still look deliberate.

This names the real difficulty with hand-drawn icons: **where the wobble goes is semantically meaningful**. A shaky chevron reads as broken; a shaky feather reads as deliberate. Bounding the offset by run length rather than an absolute value gets you that judgment for free.

The other easily-overlooked practical constraint is size. sketchyicons holds itself to reading at **15px**:

> That is the size an interface actually uses inside a control, and it is where a wobbly stroke turns to mud. An icon that only reads at 24 is not finished.

This is why so many hand-drawn sets look great on their demo page and turn to mush in a real UI — the demos are all at 48px or larger.

Licensing is handled cleanly too. The site footer states that the geometry is derived from **Lucide 1.27.0 ([ISC](https://lucide.dev/license))**, that the [generator and npm packages are MIT](https://github.com/Fantomiald/sketchyicons), and that the project is not endorsed by Lucide. The API matches Lucide exactly (`size` / `color` / `strokeWidth` / `absoluteStrokeWidth`), so migrating an existing project is a one-line import change. Packages are split per framework (`@sketchyicons/react` at 492 B, `@sketchyicons/vue` at 466 B, `@sketchyicons/data` at 250 B), so a Vue project never sees React in its dependency tree.

### tldraw: shape ID as seed, two stroke passes

[tldraw's solution to the same problem](https://tldraw.dev/blog/engineering-imperfection-with-draw-shapes) is more involved, because its shapes get dragged and resized by users — the imperfection has to stay **stable through transformation**, or every resize makes the shape twitch anew.

Their answer is likewise a stable seed:

> Since every shape has a unique and stable ID, we can use this ID as the seed for the generator.

On top of that, two more layers:

- **Multiple stroke passes to simulate ink.** "We render each path multiple times, with each pass using slightly different random offsets" — each pass modifies the seed, two passes by default. A single wobbly line still reads as computer-drawn; two overlaid passes give it the thickness of a pen nib pressed into paper.
- **Corner rounding that varies by angle.** "A sharp 90° corner needs significant rounding to look hand-drawn, and a corner closer to 180° needs far less." Sharp corners need heavy rounding to look hand-drawn, obtuse ones barely any — and the rounding is further clamped by segment length so short edges don't get eaten entirely.

These two details explain why [Excalidraw](https://github.com/excalidraw/excalidraw) and tldraw feel genuinely hand-drawn while many similar tools read as a wobble filter bolted on.

### The foundation underneath: Rough.js

Both trace back to [Rough.js](https://roughjs.com/) — under 9 kB gzipped, MIT licensed, providing sketchy rendering for lines, arcs, polygons, circles, and SVG paths, with `roughness` and `bowing` as direct knobs on how scruffy the output looks. Excalidraw is built on it, and sponsors it.

The same author (Preet Shihn) also built [Wired Elements](https://wiredjs.com/) (MIT, 10.8k GitHub stars), wrapping Rough.js into a full set of hand-drawn web components — buttons, inputs, sliders. Its tagline is the philosophical footnote for this whole route:

> The elements are drawn with enough randomness that no two renderings will be exactly the same — just like two separate hand-drawn shapes.

Note that this is the opposite tradeoff from sketchyicons and tldraw: Wired Elements deliberately renders differently every time, which suits wireframes and mockups, whereas production icons need determinism or your diffs and snapshot tests stay permanently red.

## Route three: AI generation, currently the weakest link

[Clearly](https://www.clearly.sh/free/svg-icons) offers six style packs (line, filled, duotone, brutalist, hand-drawn, isometric) on a BYOK model — bring your own Claude or OpenAI key and the model writes the SVG directly. It's honest about its own positioning: fixed libraries run out when you need something domain-specific like a search-without-magnifier glyph, and generation fills that gap. [Vexura](https://www.vexura.io/) is a pure web tool with 3 free credits per day.

The current problem with this route isn't fidelity, though — it's **consistency**. Much of an icon set's value comes from every glyph sharing the same stroke weight, padding, and visual mass, and prompting them one at a time drifts by construction. Clearly attacks this with a brand kit (paid tier), but no AI generation option today reaches Streamline's level of consistency.

**The practical use is hybrid**: hold the baseline with a fixed library or a generator, and use AI only to fill in a handful of missing concepts. Also note Clearly's license tiering — free-tier output is personal use only, commercial requires Pro.

## An aside: icon search is collectively moving to MCP

The clearest trend while researching this: the current generation of icon aggregators are all building AI agent entry points — including Koboyo, from the top of this article. Its icon page carries a "Use with AI · MCP" entry, and once you sign in the icons are reachable from Claude, Codex, or Cursor.

| Service | Scale | Agent interface |
|---|---|---|
| [icons0.dev](https://icons0.dev/) ([i0](https://github.com/marcoripa96/i0), MIT) | 223 collections, 303k+ icons | MCP server, 4 tools |
| [theSVG](https://thesvg.org/) | 6,502+ (4,629 brand icons) | MCP + Figma plugin + VS Code + Raycast |
| [IconVaultKit](https://iconvaultkit.com/) | 200,000+, 92+ libraries | MCP + npm package |
| [Iconstack](https://iconstack.io/) | 51,378 | API + MCP |
| [Koboyo Icons](https://koboyo.com/icons) | ~90k claimed, ~18k in the sitemap (single hand-drawn style) | MCP (sign-in required) |
| [All SVG Icons](https://allsvgicons.com/) | 286,000+, 220+ libraries | Web-first |

i0's retrieval design deserves a closer look. Per its [GitHub repo](https://github.com/marcoripa96/i0), it stores the SVG body of all 303k icons in Turso (libSQL) and runs **FTS5 keyword search (with porter stemming) in parallel with a DiskANN vector index, fusing the two with RRF**; embeddings are 256-dimensional `gemini-embedding-001`. This is a concrete application of the architecture covered in [Hybrid Search: BM25 + Vector + RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) — icon search benefits from it unusually well, because a query like "an icon for delete-but-recoverable" is hopeless for pure keyword matching, while an exact term like "trash" is exactly what pure vector search tends to drift on.

The practical upshot: if you write frontend code in Claude Code or Cursor, letting the agent search MCP for icons and emit React components directly is much faster than switching to a browser to search and copy-paste.

## How to choose

- **Cleanest license, don't want to read terms** → [Khushmeen](https://khushmeen.com/icons.html) (CC0)
- **Maximum coverage, and your product isn't a canvas/editor** → [Koboyo](https://koboyo.com/icons), after confirming your users can't pick or download the icons inside your app
- **Already on Lucide** → [sketchyicons](https://sketchyicons.com/), one import line
- **Building a full design system, consistency first** → [Streamline Freehand](https://www.streamlinehq.com/icons/streamline-freehand), after confirming your project isn't open source (which requires attribution even on paid plans) and budgeting for the 100-per-project allowance and extra seats
- **Drawing hand-drawn shapes inside your own canvas product** → [Rough.js](https://roughjs.com/), following tldraw's stable-seed and multi-pass approach
- **Letting an AI agent find icons** → the MCP servers from [icons0.dev](https://icons0.dev/) or [theSVG](https://thesvg.org/)

One closing warning: the thing that most often goes wrong here isn't picking the wrong style, it's **not reading the license**. Hand-drawn libraries vary far more in licensing than ordinary UI icon sets — CC0, mandatory backlink, and no-competing-products all appear under the same "free for commercial use" banner, and their homepages all look equally friendly.

## Update log

- 2026-08-06: Koboyo's count moved again — the license page went from 87,954 back up to **90,150**, which kills the earlier inference that losing 5,013 icons in a day meant active pruning; rewritten as oscillation. Also checked `sitemap.xml`: a single flat urlset listing 18,044 URLs, roughly 17,930 of them icon pages — five times fewer than the claimed figure. Folded into the first section and the library comparison table.

## References

- [Koboyo Icons](https://koboyo.com/icons) — close to 90,000 free hand-drawn SVG icons, claimed
- [Koboyo Icons license](https://koboyo.com/icons/license) — the source text on competing products and "icons as the feature" apps; showed 90,150 on 2026-08-06
- [Koboyo sitemap.xml](https://koboyo.com/sitemap.xml) — a single flat urlset, 18,044 URLs measured 2026-08-06 (~17,930 icon pages)
- [Koboyo infinite canvas](https://koboyo.com/) — the product the library belongs to
- [sketchyicons](https://sketchyicons.com/) — 1,500+ icons generated from Lucide geometry, with the algorithm documented
- [sketchyicons on GitHub](https://github.com/Fantomiald/sketchyicons) — generator source (MIT)
- [Lucide License](https://lucide.dev/license) — ISC, with Feather-derived icons under MIT
- [Engineering imperfection with draw shapes · tldraw](https://tldraw.dev/blog/engineering-imperfection-with-draw-shapes) — shape ID as seed, multi-pass strokes, angle-aware rounding
- [Rough.js](https://roughjs.com/) — sketchy rendering library (MIT, < 9 kB gzipped)
- [Wired Elements](https://wiredjs.com/) — hand-drawn web components built on Rough.js
- [Excalidraw](https://github.com/excalidraw/excalidraw) — open-source hand-drawn infinite canvas
- [Khushmeen Doodle Icons](https://khushmeen.com/icons.html) — 400+ CC0 hand-drawn icons
- [react-doodle-icons](https://github.com/agilek/react-doodle-icons) — MIT React wrapper for Khushmeen's icons
- [Streamline Freehand](https://www.streamlinehq.com/icons/streamline-freehand) — a set of 11,171 commercial hand-drawn icons
- [Streamline pricing](https://home.streamlinehq.com/pricing) — subscription and lifetime plans; Freehand family totals 22,349
- [Streamline Premium Licenses](https://help.streamlinehq.com/en/articles/5354366-streamline-premium-licenses) — source text for the 100-per-project allowance, Extended Allowance License, open-source attribution duty, AI-training ban, and seat limits
- [Icons8 Doodle](https://icons8.com/icons/doodle) — 2,200 colorful doodle icons
- [Iconro Hand Drawn](https://iconro.com/icons/hand-drawn) — 1,010 hand-drawn icons requiring attribution
- [doo-iconik](https://github.com/ajentik/doo-iconik) — 595 icons packaged for 15 frameworks
- [Duma Icons](https://duma-icons.dudych.cc/) — 451 hand-drawn SVG / React icons
- [Clearly](https://www.clearly.sh/free/svg-icons) — BYOK AI SVG icon generation
- [Vexura](https://www.vexura.io/) — online AI SVG generation tool
- [icons0.dev](https://icons0.dev/) — icon search across 223 collections
- [i0 on GitHub](https://github.com/marcoripa96/i0) — implementation of the FTS5 + vector hybrid search and MCP server
- [theSVG](https://thesvg.org/) — 6,502+ brand and cloud architecture icons
- [IconVaultKit](https://iconvaultkit.com/) — aggregated search over 200,000+ icons
- [Iconstack](https://iconstack.io/) — 51,378 icons with API and MCP
- [All SVG Icons](https://allsvgicons.com/) — 286,000+ icons across 220+ libraries
- [Text / Image to Lottie: A Guide to AI Animation Generation Tools](/posts/ai/2026-06-09-text-image-to-lottie-open-source-en) — the vector animation slot
- [The 2026 Map of 3D Modeling Tools](/posts/ai/2026-07-27-3d-modeling-tools-landscape-en) — the 3D asset slot
- [Hybrid Search: Covering BM25 and Vector Search's Blind Spots](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) — architectural background for i0's retrieval design
