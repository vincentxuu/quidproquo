---
title: "A Guide to Design-System Color Palettes: From Tailwind to Material 3"
date: 2026-06-05
category: design
type: deep-dive
tags: [design-system, color, tailwindcss, oklch, accessibility, ui]
lang: en
tldr: "A comparison of seven major design systems—Tailwind, Radix, Material 3, Carbon, Ant Design, Primer, and Apple HIG—covering scale structure, neutral colors, dark-mode strategies, and why new projects should prefer OKLCH over HSL."
description: "Compare the color systems behind Tailwind, Radix, Material 3, Carbon, Ant Design, Primer, and Apple HIG, including tonal scales, contrast standards, dark mode, and palette-generation tools."
draft: false
---

> 🌏 [中文版](/posts/design/2026-06-05-design-system-color-palettes)

The hard part of choosing website colors is not finding one attractive color. It is everything that follows: deriving hover and disabled states, deciding how many neutral steps you need, meeting WCAG text contrast, and rebuilding the palette for dark mode. Major design systems have already solved these problems in different ways. This guide compares seven of their color architectures and the common patterns they have converged on, so a new site can borrow proven decisions instead of inventing a system from scratch.

## Seven Major Systems at a Glance

| System | Scale structure | Neutral strategy | Dark mode |
|---|---|---|---|
| Tailwind CSS | 11 steps (50–950) across 22+ hues | Several gray families: slate, gray, zinc, neutral, and stone | Manual `dark:` variant |
| Radix Colors | 12 steps with a defined purpose for each | Pure grays plus tinted grays such as mauve and sand | Built in; switch a class |
| Material 3 | Tonal palette from 0–100 (13 tones) | Neutral and Neutral Variant palettes | The same color roles map automatically |
| IBM Carbon | Gray 10–100 as the foundation | Gray-dominant; blue is the sole action color | Four themes: White, Gray 10, Gray 90, and Gray 100 |
| Ant Design | 12 base hues × 10 steps = 120 colors | Black and white with alpha transparency | Separate dark-theme algorithm |
| GitHub Primer | Neutral 0–13 with reversed direction | Two neutral scales | Reversed scales let light and dark themes share tokens |
| Apple HIG | No numeric scale; semantic dynamic colors | systemGray through systemGray6 | Each color includes light, dark, and two high-contrast variants |

Each system has a distinct strength.

**Tailwind** offers the most widely used ready-made palette. Step 50 is the lightest and 950 the darkest; since v4, the official values use OKLCH throughout. **Material 3** takes the automated route: it derives five key colors from one source color in the HCT color space, expands them into tonal palettes, and maps them to 26 color roles. It also supports standard, 3:1, and 7:1 contrast levels. **Carbon** expresses interface depth through layers of gray and uses color sparingly, producing the strongest enterprise look. **Ant Design** supplies an algorithm that generates ten steps from one base color; its brand blue is `#1677ff`, and the documentation recommends the sixth step as the primary color. **Primer** starts its light scale at white and its dark scale at black. Reversing the direction of the two neutral scales means most tokens do not need separate dark-mode overrides.

## The Shared Architecture Behind Them

These seven systems look different, but their foundations are remarkably similar:

1. **Three token layers:** primitive (`blue-500`) → semantic (`text-default`, `bg-danger`) → component (`button-primary-bg`). UI components reference semantic tokens, so a theme change only updates the mappings.
2. **Numeric scales:** Material Design introduced the 50/100–900 convention in 2014, and Tailwind popularized it. Larger numbers are darker. The intermediate 950 step arrived later to support subtler background differences in dark interfaces.
3. **A minimal color set:** one primary color, one neutral scale, and four semantic colors—green for success, yellow or orange for warning, red for error, and blue for information. Every system is a variation on this formula.
4. **Primary colors near the middle:** placing the brand color around Tailwind 500/600 or Ant's sixth step leaves room for both lighter tints and darker hover or active shades.
5. **Tinted neutrals:** grays with a small amount of hue, such as Tailwind's slate or Radix's mauve and sand, harmonize with an accent of the same hue better than a perfectly neutral gray.

## Radix's 12 Semantic Steps: The Most Reusable Model

Most systems give you ten colors without telling you exactly what each one should do. Radix Colors assigns a purpose to every step:

| Step | Purpose |
|---|---|
| 1–2 | App backgrounds and subtle component backgrounds |
| 3–5 | UI component backgrounds: normal, hover, and active |
| 6–8 | Borders: non-interactive, interactive, and strong border plus focus ring |
| 9–10 | Solid backgrounds; step 9 has the highest chroma in the scale and serves as the primary button color |
| 11–12 | Low-contrast and high-contrast text |

This table is a portable mental model that works with any hue. One detail matters: most step-9 colors are designed for white foreground text, but Sky, Mint, Lime, Yellow, and Amber require dark text. Radix calls out those five exceptions explicitly. Its documentation also states that Radix Colors are not intended to be customized. Their contrast has been tuned by hand. If you need a brand color, generate a separate scale with the custom-palette tool instead of editing the supplied values.

## Color Science: Why New Projects Should Use OKLCH Instead of HSL

HSL lightness is not visually consistent across hues. Yellow at 50% lightness looks far brighter than blue at the same value, so every HSL scale needs manual correction. OKLCH, introduced by Björn Ottosson in 2020, is perceptually uniform: changing lightness does not unexpectedly shift hue or saturation, and equal numeric changes produce roughly equal visual changes. All major browsers have supported native `oklch()` since 2023, including colors in the wider Display P3 gamut.

Evil Martians summarizes the practical benefit well: “Designers can define a formula, choose a few colors, and an entire design system palette is automatically generated.” Material 3's HCT is Google's answer to the same class of problem. Its tone values map directly to contrast, which allows Material 3 to generate accessible combinations automatically.

For contrast, WCAG 2.x AA requires 4.5:1 for normal text, 3:1 for large text (at least 24px, or 18.66px when bold), and 3:1 for UI components and graphics. AAA raises normal-text contrast to 7:1. APCA is a candidate algorithm for WCAG 3 that also considers font size, weight, and light-on-dark polarity, but it is not yet a final standard. Radix already uses APCA when setting its text-contrast targets.

## Three Practical Routes

**Route one: use an existing palette.** With Tailwind, choose one accent hue and one gray family—slate for a cooler interface or stone for a warmer one—then add red, green, and amber for semantic states. With Radix, choose a brand scale, its matching tinted gray, and semantic scales. Apply the 12-step roles and dark mode comes with the system.

**Route two: generate a brand palette.** If you already have a fixed brand color, feed it into the [Radix custom palette tool](https://www.radix-ui.com/colors/custom) or [uicolors.app](https://uicolors.app/generate), then apply the original system's semantic roles to the generated scale. [Atmos](https://atmos.style) adds native OKLCH editing and easing-curve control.

**Route three: automate the full system.** The Material Theme Builder Figma plugin takes one source color and generates the full set of Material 3 roles. It suits teams that want an algorithm to enforce accessible combinations.

Three framework-independent open palettes are also useful: **Open Color**, a long-standing UI-oriented collection with 13 hues and ten steps; **Reasonable Colors**, designed around accessible contrast; and **Flexoki**, an ink-inspired palette by Obsidian CEO Steph Ango, derived in Oklab and tuned for screen reading. Flexoki is particularly well suited to content-heavy sites.

## Matching a Visual Direction

| Desired feel | Systems to study |
|---|---|
| Neutral, modern SaaS | Tailwind slate or zinc; Radix |
| Enterprise, restrained, data-dense | IBM Carbon; Ant Design |
| Vivid and personal | Material 3 dynamic color |
| Developer tooling | GitHub Primer |
| Editorial or reading-focused | Flexoki; Apple HIG's label hierarchy |

## The Overall Tradeoff

A color system trades customization freedom against engineering guarantees. Tailwind gives you the most freedom, but leaves contrast and dark mode to you. Radix gives up some customization in exchange for semantic roles and APCA-tuned contrast at every step. Material 3 delegates the entire process to an algorithm.

For a typical website, a strong combination is to borrow Radix's 12-step mental model, generate the scale with Tailwind or a palette tool, and define the values in OKLCH. Taking those three pieces from different systems turns color selection from an open-ended taste problem into a repeatable lookup process.

## References

- [Tailwind CSS — Colors](https://tailwindcss.com/docs/colors)
- [Radix Colors](https://www.radix-ui.com/colors)
- [Radix Colors — Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- [Material Design 3 — How the color system works](https://m3.material.io/styles/color/system/how-the-system-works)
- [IBM Carbon Design System — Color](https://carbondesignsystem.com/elements/color/overview/)
- [Ant Design — Colors](https://ant.design/docs/spec/colors)
- [GitHub Primer — Color usage](https://primer.style/product/getting-started/foundations/color-usage/)
- [Apple Human Interface Guidelines — Color](https://developer.apple.com/design/human-interface-guidelines/color)
- [Evil Martians — OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Section508.gov — Making Color Usage Accessible](https://www.section508.gov/create/making-color-usage-accessible/)
- [Open Color](https://yeun.github.io/open-color/)
- [Reasonable Colors](https://www.reasonable.work/colors/)
- [Flexoki](https://stephango.com/flexoki)
- [uicolors.app — Tailwind palette generator](https://uicolors.app/generate)
- [Atmos — color palette tool](https://atmos.style)
