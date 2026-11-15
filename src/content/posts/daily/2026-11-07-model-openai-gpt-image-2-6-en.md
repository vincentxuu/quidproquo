---
title: "Model Card: GPT-Image-2.6"
date: 2026-11-07
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt-image]
lang: en
description: "OpenAI shipped GPT-Image-2.6 (Flare/Sunburst) with GIF animation, markup-guided editing, and SVG export — pricing unchanged from 2.5, but early LMArena data shows the new generation trailing its own predecessor"
tldr: "GPT-Image-2.6 (API IDs: gpt-image-2.6-flare / gpt-image-2.6-sunburst): OpenAI released it 2026-11-04 with GIF generation, markup-guided editing, and SVG export; pricing holds at 2.5's rates (text in $5 / image in $8 / image out $30 per 1M tokens); LMArena's text-to-image board (preliminary, read 2026-11-02) showed 2.6 Sunburst trailing its own 2.5 Sunburst, but Artificial Analysis coverage two days later claimed the 2.6 family took the top two spots on both boards — the same model ranked behind and ahead of its predecessor within days, on different leaderboards"
series:
  name: "AI Model Tracker"
  order: 69
glossary:
  - term: "GPT-Image"
    def: "OpenAI's image generation and editing model line, running from GPT Image 1 (April 2025) to this release; starting with 2.5, the API splits into two variants, Flare (fast) and Sunburst (fine-grained)"
  - term: "LMArena"
    def: "Formerly Chatbot Arena — an independent evaluation platform that derives Elo-style scores from large-scale pairwise human votes, with separate leaderboards for image generation and image editing"
---

> 🌏 [中文版](/posts/daily/2026-11-07-model-openai-gpt-image-2-6)

## Model Info

| Field | Value |
|---|---|
| Model ID | `gpt-image-2.6-flare` / `gpt-image-2.6-sunburst` |
| Vendor | OpenAI |
| Parameters | Undisclosed |
| Context Window | Not applicable (image model); total output capped at 8,294,400px, no edge above 3,840px, anything past 2560×1440 marked experimental |
| Input Pricing (USD/1M tokens) | Text input $5.00; image input $8.00 (cached $2.00) |
| Output Pricing (USD/1M tokens) | $30.00 (same for both variants, unchanged from 2.5) |
| Open Source | No |
| Release Date | 2026-11-04 |
| Official Announcement | [OpenAI: Introducing Images 2.6](https://openai.com/index/introducing-images-2-6/) |
| Family | GPT-Image line (GPT Image 1, Apr 2025 → GPT Image 2, Apr 2026 → GPT-Image-2.5, Sep 2026 → GPT-Image-2.6, this release) |

## Capability Highlights

- GIF generation: turns a prompt or uploaded image into an animated, loopable GIF with adjustable speed and frame-by-frame editing, up to 16 frames
- Markup-guided editing: developers send a transparent PNG overlay annotation to point at exactly what should change, instead of describing the region in text alone; the release also adds SVG vector export, making OpenAI one of the few API vendors besides Recraft to return vectors directly
- Flare generation got roughly 50% faster again; at the lowest quality setting it can render in as little as 6 seconds. Independent testing by Artificial Analysis put Flare's median text-to-image latency at about 30 seconds, down from roughly 55 seconds for the prior generation
- A new `complexity` parameter, independent of `quality`, controls how much planning the model does before rendering, defaulting to `high`; on the consumer side, reusable reference images for a person, pet, or character remove the need to re-upload the same reference every time

## Benchmark Results

| Source | GPT-Image-2.6 | Predecessor (2.5) | Reference point |
|---|---|---|---|
| LMArena text-to-image board (Medium quality, preliminary, read 2026-11-02) | Sunburst 1409±13 (#2, 2,967 votes) / Flare 1384±13 (#4, 2,792 votes) | 2.5 Sunburst 1427±5 (#1, 54,913 votes) / 2.5 Flare 1399±5 (#3) | Nano Banana 2.1 1325±9 (#7) |
| LMArena single-image-edit board (same read date) | Sunburst 1476±10 (#3) / Flare 1462±10 (#5) | 2.5 Sunburst 1517±5 (#1) / 2.5 Flare 1482±5 (#2) | MAI-Image-2.7-Preview 1469±7 (#4) |
| Artificial Analysis, both boards (third-party report, 2026-11-06) ⚠️ | Took the top two spots on both text-to-image and editing boards | Described only as "surpassed the 2.5 generation," no precise score gap given | No comparison scores listed in the source article |

⚠️ These three data points come from different independent platforms, different quality settings (LMArena used Medium; OpenAI never stated which setting Artificial Analysis used), and different read dates (Nov 2 vs. Nov 6) — none of them are OpenAI's own self-reported numbers. The two LMArena entries for 2.6 carry only about 2,800–3,000 votes each, versus over 54,000 for the 2.5 generation, and their confidence intervals are more than twice as wide as neighboring entries — a classic sign of an early, statistically unstable sample. Artificial Analysis itself hadn't listed GPT-Image-2.6 at all as of November 5; the "took the top two spots" claim only surfaced on November 6, and the source article didn't publish the underlying scores, so it can only be treated as a secondhand report, not something that can be independently reconciled.

```diagram
title: GPT-Image-2.6's benchmark story flipped within four days
desc: LMArena's board, dated 2026-11-02, showed 2.6 trailing its own 2.5 generation; Artificial Analysis hadn't listed the model by 2026-11-05, then a 2026-11-06 secondhand report claimed 2.6 took the top two spots on both boards
caption: Dates are each leaderboard's self-stated or read timestamp, not a strict event sequence — LMArena's labeled date even precedes OpenAI's 2026-11-04 public release.
---
<svg viewBox="0 0 620 280">
  <path class="dg-axis" d="M40 124H560"/>

  <rect class="dg-band dg-band--warn" x="100" y="236" width="400" height="24"/>
  <text class="dg-small dg-text--warn" x="300" y="248" text-anchor="middle" dominant-baseline="central">Two boards, opposite verdicts, same model</text>

  <g>
    <line class="dg-rule" x1="100" y1="76" x2="100" y2="118"/>
    <circle class="dg-dot dg-dot--accent" cx="100" cy="124" r="6"/>
    <text class="dg-label" x="100" y="40" text-anchor="middle" dominant-baseline="central">2026-11-02</text>
    <text class="dg-sub" x="100" y="62" text-anchor="middle" dominant-baseline="central">LMArena: behind 2.5</text>
  </g>

  <g>
    <line class="dg-rule" x1="300" y1="130" x2="300" y2="172"/>
    <circle class="dg-dot" cx="300" cy="124" r="4"/>
    <text class="dg-label" x="300" y="186" text-anchor="middle" dominant-baseline="central">2026-11-04</text>
    <text class="dg-sub" x="300" y="208" text-anchor="middle" dominant-baseline="central">Official release</text>
  </g>

  <g>
    <line class="dg-rule" x1="400" y1="76" x2="400" y2="118"/>
    <circle class="dg-dot" cx="400" cy="124" r="4"/>
    <text class="dg-label" x="400" y="40" text-anchor="middle" dominant-baseline="central">2026-11-05</text>
    <text class="dg-sub" x="400" y="62" text-anchor="middle" dominant-baseline="central">AA: not listed</text>
  </g>

  <g>
    <line class="dg-rule" x1="500" y1="130" x2="500" y2="172"/>
    <circle class="dg-dot dg-dot--accent" cx="500" cy="124" r="6"/>
    <text class="dg-label" x="500" y="186" text-anchor="middle" dominant-baseline="central">2026-11-06</text>
    <text class="dg-sub" x="500" y="208" text-anchor="middle" dominant-baseline="central">AA: top two spots</text>
  </g>
</svg>
```

## vs. Predecessor and Competitors

Pricing is identical to 2.5 (text in $5 / image in $8 / image out $30 per 1M tokens), and the new GIF, markup editing, and SVG export all ride on that same rate card — effectively free new features. What's striking is that in the only independent data available so far (LMArena), both 2.6 variants actually score lower on pure image-quality preference than their own 2.5 counterparts: speed and feature count jumped, but quality votes didn't move up in lockstep, at least in this early sample.

Against Google's Nano Banana 2.1: both bill per token and charge the same $30/1M tokens for image output, but Google's image input is only $1.50 (versus OpenAI's $8), and Google additionally publishes a direct per-image conversion ("a 1K image costs 1,120 tokens, or $0.0336") that OpenAI does not — developers have to benchmark their own prompts to know the real cost. Community reports have already found that the same prompt at `low`/`medium` quality can burn noticeably more output tokens on 2.6 than on 2.5 (one report cited roughly 1,136 tokens versus 344), meaning the bill can rise even though the per-token rate didn't change.

Against flat-per-image vendors like ByteDance's Seedream 5.0 flash ($0.018/image) or Recraft's V4.1 Flash ($0.007/image), GPT-Image-2.6's token billing remains impossible to budget precisely at high volume — a structural weakness shared with Nano Banana's own token-based pricing, and not something this release addresses.

## What This Means for Agent Development

If you're building asset-automation agents (marketing creative, social copy images, mascot animation): reusable reference images plus GIF generation turn "generate consistent variants of the same character" from a prompt-engineering workaround into a saved asset you reuse across calls — but test your actual prompts for token consumption first; don't assume the bill will match 2.5.

If you're running a design pipeline that needs vector output (logos, icons, UI components): markup editing plus SVG export means you no longer have to describe edit regions in words, and the SVG can go straight into a layout tool without retracing. But Recraft also ships SVG at a flat per-image price — the real difference now isn't feature availability, it's billing predictability.

Not a fit: high-volume production pipelines (thousands of assets a month) that need precise per-unit cost forecasting — token-based uncertainty will outweigh the new features there, and Seedream's or Recraft's flat per-image pricing is the safer budget line. Also not a fit: picking a model today based on "it's #1 on some leaderboard" — two independent boards reached opposite conclusions about 2.6's image quality within the same week, so that evidence isn't stable enough yet to drive a routing decision.

## Today's Update

I used to assume independent third-party leaderboards were at least more trustworthy and stable than a vendor's own benchmark claims. GPT-Image-2.6 breaks that assumption: on the same model, LMArena (preliminary, with only about 5% of the predecessor's vote count) shows it ranking behind its own 2.5 generation, while two days later a secondhand Artificial Analysis report claims it swept the top two spots on both boards — without even publishing the scores. Leaderboard refresh speed and post-launch statistical noise are now just as important a variable in the image-model release cycle as pricing or features: any "it took #1 on launch day" claim deserves a follow-up question about which board, which quality setting, and which read date.

## References

- [OpenAI: Introducing Images 2.6 (official announcement)](https://openai.com/index/introducing-images-2-6/)
- [OpenAI's GPT-Image-2.6 Flare and Sunburst Top Every Image Leaderboard (AlphaSignal)](https://alphasignal.ai/news/openai-s-gpt-image-2-6-flare-and-sunburst-top-every-image-leaderboard)
- [GPT-Image-2.6: What Changed, Flare vs. Sunburst, Pricing (Oimi AI Studio)](https://oimi.ai/en/blog/what-is-gpt-image-2-6)
- [GPT Image 2.6 vs Gemini, FLUX and Seedream Compared (Digital Applied, full LMArena leaderboard figures)](https://www.digitalapplied.com/blog/gpt-image-2-6-vs-gemini-flux-seedream)
- [GPT Image 2.6: Flare vs Sunburst, Pricing and API Guide (Digital Applied)](https://www.digitalapplied.com/blog/gpt-image-2-6-flare-sunburst-api-guide)
- [OpenAI Developer Community: Images, upgraded — introducing ChatGPT Images 2.6](https://community.openai.com/t/images-upgraded-introducing-chatgpt-images-2-6/1412901)
