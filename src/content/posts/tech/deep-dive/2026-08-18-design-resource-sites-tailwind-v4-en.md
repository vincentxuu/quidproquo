---
title: "Auditing Design Resource Sites Against Tailwind v4: Whose Output Still Drops Straight In"
date: 2026-08-18
type: deep-dive
category: tech
tags: [design-system, tailwindcss, shadcn-ui, design-tokens, licensing, developer-tools]
lang: en
tldr: "Tailwind v4 only honours namespaces: a color variable has to be named `--color-*` to generate any utility. Audited against that rule, hextodesign's `--brand-500` output and its v3 `theme.extend` example both fail to connect, and the two packages it says are published to npm — `@halcyon/ui` and `@halcyon/tailwind` — both return 404 from the registry. What does line up is shadcn's two-layer token setup (`:root` plus `@theme inline`) and the official `shadcn/create` preset flow. On the inspiration side, Mobbin's free tier shows only the 'Latest 4' apps, making the $5/mo student plan the only usable entry point, and Tailwind Plus at $299 explicitly forbids turning its components into a UI library."
description: "Starting from Tailwind v4's theme namespace rules, this article audits the design resource sites of 2026 one by one: the output formats of color and token generators (hextodesign, tweakcn, Realtime Colors, Radix Colors), the real free-tier limits of UI inspiration libraries (Mobbin, Landbook, Recent), the licensing boundaries of component libraries (Tailwind Plus, Aceternity), plus font licensing and the state of first-party design system documentation."
draft: false
glossary:
  - term: "theme namespace"
    aliases: ["namespace"]
    definition: "In Tailwind v4, a theme variable's name prefix determines which family of utilities it generates. `--color-*` produces color utilities, `--font-*` font-family utilities, `--breakpoint-*` responsive variants. Get the prefix wrong and the variable is just an ordinary CSS custom property that generates no classes at all."
    definition_en: "In Tailwind v4, a theme variable's name prefix determines which family of utilities it generates. `--color-*` produces color utilities, `--font-*` font-family utilities, `--breakpoint-*` responsive variants. Get the prefix wrong and the variable is just an ordinary CSS custom property that generates no classes at all."
    advanced: "The official docs list 20 namespaces. A namespace can also be cleared wholesale with `--color-*: initial`, or the entire default theme discarded with `--*: initial`, leaving only your own values."
    advanced_en: "The official docs list 20 namespaces. A namespace can also be cleared wholesale with `--color-*: initial`, or the entire default theme discarded with `--*: initial`, leaving only your own values."
    context: "This article uses it as the test: whether a color generator's output is directly usable comes down to whether its variable names land inside a namespace."
    context_en: "This article uses it as the test: whether a color generator's output is directly usable comes down to whether its variable names land inside a namespace."
  - term: "OKLCH"
    definition: "A perceptual color notation describing a color by lightness (L), chroma (C), and hue (H). Unlike HSL, shifting the hue does not swing the perceived lightness, so a generated scale reads as evenly stepped."
    definition_en: "A perceptual color notation describing a color by lightness (L), chroma (C), and hue (H). Unlike HSL, shifting the hue does not swing the perceived lightness, so a generated scale reads as evenly stepped."
    advanced: "Tailwind v4 ships its default palette in OKLCH, which also unlocks the P3 wide gamut. The cost is editing ergonomics: adjusting hue or chroma shifts the WCAG contrast ratio, which does not happen in spaces like HSLuv."
    advanced_en: "Tailwind v4 ships its default palette in OKLCH, which also unlocks the P3 wide gamut. The cost is editing ergonomics: adjusting hue or chroma shifts the WCAG contrast ratio, which does not happen in spaces like HSLuv."
    context: "By 2026 nearly every shadcn theme generator emits OKLCH; older tools that only speak hex or HSL no longer line up with the default palette."
    context_en: "By 2026 nearly every shadcn theme generator emits OKLCH; older tools that only speak hex or HSL no longer line up with the default palette."
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-18-design-resource-sites-tailwind-v4)

There is no shortage of listicles for picking a project's design system — "10 best color tools," "inspiration sites every designer uses." They almost always compare two things: how good it looks and what it costs. But when you actually paste a tool's output into a project, the thing that stops you is usually a third: **does what it produces fit your build pipeline at all?**

Since [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4) moved theme configuration out of `tailwind.config.js` and into CSS — the npm registry records `4.0.0` as published 2025-01-21, and `latest` at the time of writing is `4.3.3` from 2026-07-16 — that question has a very checkable answer. This piece uses it to audit the usual design resource sites, one at a time.

There is a companion piece on this site, [Three Routes to Hand-Drawn SVG Icons](/posts/tech/deep-dive/2026-08-05-hand-drawn-svg-icons-landscape-en), covering the icon slot. This one covers color, type, inspiration libraries, and token generators.

## The test: v4 only honours namespaces

The most repeated line about v4 is "no more `tailwind.config.js`." That is true but incomplete. The point is not that the config moved — it is that **the variable name itself became the API**.

The [theme variables documentation](https://tailwindcss.com/docs/theme) states it plainly:

> Theme variables are defined in *namespaces* and each namespace corresponds to one or more utility class or variant APIs.

The docs list 20 namespaces. Colors live under `--color-*`, font families under `--font-*`, font sizes under `--text-*`, corner radii under `--radius-*`, breakpoints under `--breakpoint-*`. Define `--font-poppins: Poppins, sans-serif;` and you get a `font-poppins` class. Define `--color-brand-500` and you get `bg-brand-500`, `text-brand-500`, `border-brand-500` — the whole family.

Conversely, a variable named `--brand-500` is just an ordinary CSS custom property. You can reference it with `var(--brand-500)`, but Tailwind has no idea it exists and will not generate a single utility from it.

That is the checkpoint. Looking at a color generator's output, you do not need to judge the palette first:

```
What does it hand you?
├── @theme { --color-brand-500: ... }   → drops straight in
├── :root { --brand-500: ... }          → plain CSS variable, no utilities
├── a theme.extend.colors JS object     → v3 format, needs @config in v4
└── just a hex swatch image             → you convert it yourself
```

The third is not unusable — v4 kept the `@config` directive for loading legacy JS config files, and maintainers confirmed that compatibility path still exists in [discussion #16803](https://github.com/tailwindlabs/tailwindcss/discussions/16803). But that is a migration bridge, not the road a new project should take.

## shadcn's two token layers — and the fact that it now ships its own generator

If the project uses [shadcn/ui](https://ui.shadcn.com/), there is one more layer. The default CSS in the [official theming docs](https://ui.shadcn.com/docs/theming) splits things like this: semantic variables live in `:root` and `.dark`, and then a **separate** `@theme inline` block maps them into Tailwind's namespace.

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";

@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  /* ...31 color tokens in total */
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --primary: oklch(0.205 0 0);
}
```

The point of two layers: dark mode only has to override `--primary` inside `.dark`, never touching `@theme`; and the reason `bg-primary` exists at all is that the `@theme inline` line wires it into `--color-*`. To add a custom token such as `warning`, the docs are explicit that you write it in **both** places — define the value under `:root`/`.dark`, then add `--color-warning: var(--warning);` to `@theme inline`. Skip the second step and `bg-warning` simply will not exist.

Here is a fact that only became true recently and reshapes the whole tool list: **shadcn now ships its own visual theme generator**. [shadcn/create](https://ui.shadcn.com/create) lets you pick Style, Base Color, Theme, Chart Color, heading font, body font, icon library, radius, menu, and menu accent, previews it live, and hands back a preset code (the default is `--preset b0`). The CLI — `shadcn` on npm is `4.18.0` at the time of writing — has a matching command set:

```bash
pnpm dlx shadcn@latest init --preset b5Kc6P0Vc   # start a project from a preset
pnpm dlx shadcn@latest preset resolve            # recover the preset of an existing project
pnpm dlx shadcn@latest apply --only theme,font   # apply just theme and fonts to an existing project
pnpm dlx shadcn@latest migrate icons --from lucide --to tabler
```

The `--only theme,font` flag is the important one: it turns "change the palette" into a reversible operation that does not touch component code. The supported base colors are Neutral, Stone, Zinc, Mauve, Olive, Mist, and Taupe, and the `style` field in `components.json` now looks like `"base-nova"`.

The conclusion is blunt: **for a shadcn project in 2026, third-party theme generators have been demoted from necessary to supplementary.** They still earn their place — per-variable tuning, community theme galleries, generating a palette from an image — but for producing a full token set, the official path is shorter and harder to get wrong.

## Color and token generators: three that fit, one that does not

### tweakcn: the most complete third-party option

[tweakcn](https://tweakcn.com/) is an open-source shadcn theme editor (both Guillermo Rauch and shadcn himself have promoted it publicly). Its [pricing page](https://tweakcn.com/pricing) is specific: the free tier covers full theme customization, 5 AI-generated themes, saving and sharing up to 10 themes, importing an existing theme from CSS variables, exporting as CSS variables or as a **shadcn registry command**, and a contrast checker. Pro is $8/month for unlimited themes, unlimited AI generation, and generating themes from images.

That registry-command export is what separates it from a generic generator — the output is not a CSS blob for you to paste, but something the `shadcn` CLI consumes directly.

### Radix Colors: not a generator, a finished color system

[Radix Colors](https://www.radix-ui.com/colors) (now maintained by WorkOS) takes the opposite route: rather than deriving a scale from your brand color, it hands you 30 tuned hues at 12 steps each, plus alpha variants of black and white. Every step has an assigned job — backgrounds, interactive components, borders, solid colors, accessible text — and the text colors are guaranteed to hit their contrast targets against the matching background steps.

Two technical choices are worth noting: it uses **APCA** rather than the WCAG 2.x contrast algorithm, on the grounds that APCA better predicts how human vision actually perceives text, and it supports the P3 wide gamut. Dark mode is a class on a container that swaps the whole set.

Where it fits: you have no mandatory brand color, or the brand color only appears in a few accents while the rest of the interface wants a system that holds up. Where it does not: brand guidelines that require the corporate color to run through the entire interface.

### Realtime Colors and HueType: preview tools, and a trap to watch for

The value of [Realtime Colors](https://realtimecolors.com/) is that it lays your colors and fonts onto a finished-looking layout instead of a row of swatches. It is entirely free, and the FAQ settles the licensing question:

> Yes! You can use the colors you generate here however you'd like, commercially or non-commercially (I don't own the colors/fonts). The license only applies to the source code and materials specific to this website.

[HueType](https://huetype.dev/) is the same genre with more layouts — 17 presets and 23 layouts when I looked (landing page, dashboard, pricing, blog, ecommerce and more), exporting CSS variables, a Tailwind config, or design tokens.

These tools carry an easy trap: **the entire viewport is the preview canvas**. The "Sarah Chen, Head of Design, Northwind" testimonial and the "182 Fictional Street, Sim City" footer address on HueType are not that product's customers and office — they are placeholder content inside the demo layout. Realtime Colors is more explicit still, labelling its own pricing section "This is just a generic section" and its testimonials "What (imaginary) people are saying about this site." A human scanning the page works this out instantly. An AI agent told to "check what this tool costs and who its customers are" may well report the demo data back as fact.

### hextodesign: where the claims and the artifacts diverge

[hextodesign](https://hextodesign.com/) sells itself on "paste a hex, get a complete design system in 30 seconds." Good premise — but held against the namespace test above, three things do not line up.

**First, the variable names are outside the namespace.** The CSS it renders live on the homepage has this shape:

```css
:root {
  --brand-50:  oklch(0.96 0.030 286.0);
  --brand-500: oklch(0.563 0.200 286.0);
  --radius: 6px;
}
```

No `--color-` prefix, so in a v4 project none of these generate a utility class.

**Second, the Tailwind sample is v3 format.** The Tailwind output shown on the same page is a `theme: { extend: { colors: { brand: { ... } } } }` JS object, while the FAQ claims "The Tailwind config works with v3 and v4." Strictly that is not false — `@config` will load it — but that is a compatibility layer, not the native v4 shape.

**Third, two "generated" code blocks on the same page disagree about the hue.** The CSS above sits at hue 286; the Tailwind config block on the same page reads `oklch(78% .17 65)`, hue 65. Two outputs from one generation cannot be different colors, which suggests these are static marketing samples rather than live output.

There is a harder finding. The Deliverables section claims 64 React components "published to npm" and gives the install command `npm i -D @halcyon/tailwind`. Querying the npm registry, both `@halcyon/ui` and `@halcyon/tailwind` **return 404**. (A scoped package set to private also returns 404 — but a private package is not something a visitor could install either, so the command fails for them regardless.)

The pricing contradicts itself too: the page lists four tiers with distinct feature sets — Free / Starter $19 / Pro $39 / Studio $69 — then strikes all four through and marks them Free "for early users," while the FAQ says "fully free right now. No signup, no payment, no limits." Which features will eventually cost money is unanswerable from that page.

The conclusion is not "unusable" — its W3C DTCG `tokens.json` format and OKLCH scales are genuinely useful. The conclusion is: **treat it as a source of palette ideas, not as a link in your production pipeline**, and do not run its npm command.

## UI inspiration libraries: the free tier limits freshness, not volume

### Mobbin

[Mobbin](https://mobbin.com/) is a library of real app screenshots and flows, and it is hard to replace for competitive research. But its [pricing comparison table](https://mobbin.com/pricing) has a row the listicles skip: on the free tier, both Apps and Sites are limited to the **"Latest 4."** Not four views per month — you can see the four most recent apps and four most recent sites, full stop. Flows, animations, search results, and app history are all marked Limited, and collections cap at 3.

Which means the common advice to "start on the free tier and see how Duolingo does it" mostly does not work on Mobbin in 2026, unless Duolingo happens to be in the latest four. Pro is $10/month billed yearly; Team is $16 per seat per month billed yearly.

The genuinely useful thing to know is the [student plan](https://mobbin.com/education): **$5/month while in school**, verified with a university email and student ID (the site says roughly 2 minutes), granting full Pro access — the page cites 1,000+ apps, 149,900+ flows, and unlimited collections. If you or someone on the team qualifies, that is the only entry point where Mobbin is both usable and cheap.

### Landbook

[Landbook](https://land-book.com/) leans toward web and landing pages, and its strength is slicing 20,000+ sites into 200,000+ categorized *sections* (hero, pricing, testimonial, footer), so you can look at just the part you are stuck on.

One number is easy to get wrong: the homepage says "It's just $6 per month" while the [pricing page](https://land-book.com/pro) says $9/month. Both are correct — **$9 is the monthly rate, $6 is the effective monthly rate when billed yearly at $72**. The free tier is limited across every dimension, with boards capped at 3.

### Godly is now Recent

Plenty of 2026 listicles still write "godly.website." The domain is live, but the page now comes back titled "Recent — Design Inspiration," serving assets from `cdn.recent.design`. The editorial angle is unchanged (experimental, visually loud sites); only the name moved.

## Component libraries: the real variable is licensing

Free versus paid is easy to look up. What is hard to look up is **what you are permitted to do with it**. [Tailwind Plus](https://tailwindcss.com/plus/ui-blocks) (formerly Tailwind UI) writes the clearest license in this category and is worth reading as a benchmark. Pricing is $149 per package (Marketing, Application UI, or Ecommerce) or $299 for everything, paid once with lifetime updates.

The "can" list on the [license page](https://tailwindcss.com/plus/license) is generous: unlimited End Products, unlimited clients, commercial SaaS, even open-source projects with public source. It is the "cannot" list that deserves a line-by-line read:

> - Creating a repository of your favorite Tailwind Plus components, templates, or libraries (or derivatives of them) and publishing it publicly.
> - Creating a UI library using Tailwind Plus components, templates, or libraries and making it available either for sale or for free.
> - Converting a Tailwind Plus template to another framework and making it available either for sale or for free.
> - Creating a Figma or Sketch UI kit based on the Tailwind Plus component designs.
> - Creating a "website builder" project where end users can build their own websites using components, templates, or libraries included with or derived from Tailwind Plus.

Their own one-line summary: "use Tailwind Plus for anything you like as long as it doesn't compete with Tailwind Plus." The three realistic ways to cross the line are packaging purchased components into a shared internal UI kit and open-sourcing it, turning the designs into a Figma kit, and building a product where end users assemble their own layouts. The team license covers up to 25 employees and contractors.

Others in the same slot: [Magic UI](https://magicui.design/) has an MIT-licensed free tier plus a paid product, and [Aceternity UI](https://ui.aceternity.com/) offers a free core with a paid All-Access pass. I only found secondary sources for their prices — Aceternity's own blog says the paid side holds 166 blocks and 17 templates but does not list a figure inline — so I am not quoting numbers here. [Subframe](https://subframe.com/) is worse: the official `/pricing` returns a flat 404, and two secondary sources disagree on the free tier's page cap (one says 3, one says 5). I could not verify either, so I am not treating it as fact.

## Fonts: the line is drawn at redistribution

The vast majority of [Google Fonts](https://fonts.google.com/) ship under the **SIL Open Font License 1.1** — commercial use, self-hosting, and modification are all fine. The one recurring question is whether self-hosting requires shipping the license text, and the [answer from SIL's own community](https://community.software.sil.org/t/ofl-license-requirements-for-self-hosting-google-fonts/3769) is no: simply serving a font as a webfont does not require it, unless you are separately distributing the font package as a download.

[Fontshare](https://www.fontshare.com/) (Indian Type Foundry) is more consistent in quality and easier to differentiate with, but it uses ITF's own Free Font License rather than the OFL — commercial use is permitted, but **you may not resell the font files, nor redistribute derivative fonts based on ITF designs**.

For most projects this difference never comes up. It comes up in exactly two situations: you want to modify a typeface and publish the result, or your product lets end users download font assets. Both cases mean reading the original license, not a comparison article.

## For deciding the system itself, first-party docs remain the best material

Everything above solves the **execution** layer: where colors come from, where components come from. The material for the *decision* layer is still the documentation the big teams write themselves: [Material Design 3](https://m3.material.io/) (Google, open source; the 2026 I/O push is M3 Expressive, with Android going Compose-first), the [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines), [IBM Carbon](https://carbondesignsystem.com/), and [Shopify Polaris](https://polaris.shopify.com/). Their value is not what the components look like — it is **why things are divided the way they are**: when a dialog beats a sheet, how density should be tiered, how states should be named.

Carbon is furthest ahead here: [Carbon MCP](https://carbondesignsystem.com/developing/carbon-mcp/overview) is in public preview, exposing tools such as `docs_search` and `code_search` so coding agents like Claude Code and Cursor can query the design system's component guidance and code examples instead of guessing from model memory. That is the same trend the [icons piece](/posts/tech/deep-dive/2026-08-05-hand-drawn-svg-icons-landscape-en) observed: design resources are shifting from websites people browse into structured knowledge agents can query.

(An IBM employee claimed on LinkedIn that pairing Carbon MCP with Anthropic models makes teams "3.7x faster." That is a vendor claim with no published, reproducible methodology, so it is not listed here as fact.)

## How to choose

```
What are you solving?
├── Build a full token set (shadcn project) ──→ shadcn/create + preset apply (shortest path)
├── Build a full token set (not shadcn) ─────→ hand-write @theme; borrow scales from a generator
├── Per-variable tuning / community themes ──→ tweakcn (10 themes free, $8/mo Pro)
├── Want a neutral system, not a palette ────→ Radix Colors (12 steps × 30 hues, APCA)
├── See colors on a real layout first ───────→ Realtime Colors (free) / HueType
├── Study how real apps do it ───────────────→ Mobbin (free = Latest 4; $5/mo for students)
├── Study web layouts and sections ──────────→ Landbook ($9/mo, or $6 effective yearly)
├── Buy ready-made components ───────────────→ Tailwind Plus $149/pack, $299 all (no UI libraries)
└── Decide what the system should be ────────→ Material 3 / HIG / Carbon / Polaris first-party docs
```

## Overall

What came out of this audit as most useful is not any particular site — it is the checkpoint: **look at whether the variable names in its output land inside a Tailwind namespace.** That single test disqualifies half the tools still operating on a v3 mental model, in about 30 seconds, with no signup and no trial.

The second takeaway is the same one the icons piece landed on: **licensing is harder to research than features, and far more likely to bite you later.** Tailwind Plus's "cannot" list, the gap between the OFL and Fontshare's ITF license, Mobbin's "Latest 4" — none of these appear in any "10 best tools" roundup, and every one of them can surface only after you have committed.

One closing note on method. This piece started because I had put hextodesign at the top of a recommendation list on the strength of "free, paste a hex, fastest start" — and only found on verification that its npm command does not run, its Tailwind sample is the old format, and its pricing page contradicts itself. The gap is not that the tool is bad. It is that **how finished a marketing page looks and whether its output actually connects are two independent variables**. Listicles are unhelpful precisely because they only evaluate the first.

## References

- [Tailwind CSS v4.0 announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS — Theme variables documentation](https://tailwindcss.com/docs/theme)
- [Tailwind CSS Discussion #16803 — tailwind.config.js and @config in v4](https://github.com/tailwindlabs/tailwindcss/discussions/16803)
- [Tailwind Plus — UI Blocks pricing](https://tailwindcss.com/plus/ui-blocks)
- [Tailwind Plus — License](https://tailwindcss.com/plus/license)
- [shadcn/ui — Theming documentation](https://ui.shadcn.com/docs/theming)
- [shadcn/ui — CLI documentation](https://ui.shadcn.com/docs/cli)
- [shadcn/create](https://ui.shadcn.com/create)
- [tweakcn — Pricing](https://tweakcn.com/pricing)
- [Radix Colors](https://www.radix-ui.com/colors)
- [Realtime Colors](https://realtimecolors.com/)
- [HueType](https://huetype.dev/)
- [hextodesign](https://hextodesign.com/)
- [Mobbin — Pricing](https://mobbin.com/pricing)
- [Mobbin for Education](https://mobbin.com/education)
- [Landbook PRO](https://land-book.com/pro)
- [Recent (formerly Godly)](https://godly.website/)
- [Magic UI](https://magicui.design/)
- [Aceternity UI](https://ui.aceternity.com/)
- [Google Fonts](https://fonts.google.com/)
- [Fontshare](https://www.fontshare.com/)
- [SIL community — OFL requirements for self-hosting Google Fonts](https://community.software.sil.org/t/ofl-license-requirements-for-self-hosting-google-fonts/3769)
- [Material Design 3](https://m3.material.io/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [Carbon MCP (public preview)](https://carbondesignsystem.com/developing/carbon-mcp/overview)
- [Shopify Polaris](https://polaris.shopify.com/)
- On this site: [Three Routes to Hand-Drawn SVG Icons](/posts/tech/deep-dive/2026-08-05-hand-drawn-svg-icons-landscape-en)
- On this site: [TailwindCSS: Utility-First Is a CSS Management Strategy, Not a Style Preference](/posts/tech/2026-03-27-tailwindcss-utility-first-css-en)
- On this site: [shadcn/ui: Not a Package, but Copy-Paste Component Source Code](/posts/tech/2026-03-27-shadcn-ui-component-library-en)
