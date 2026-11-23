---
title: "The 2026 Map of 3D Modeling Tools: AI Generation, Scanning, CAD, or Manual"
date: 2026-07-27
category: ai
type: deep-dive
tags:
  - 3d-generation
  - meshy
  - tripo
  - hunyuan3d
  - 3d-printing
  - photogrammetry
  - ai-tools
lang: en
tldr: "There are four paths to a 3D model in 2026: AI generation (Meshy 7.1 / Tripo H3.1 / Rodin Gen-2.5 / Hunyuan 3D), phone scanning, Text-to-CAD, and manual modeling. Picking wrong has concrete costs — AI-generated meshes can't be dimensionally edited, Rodin's STL exports usually need repair, and Meshy's free tier restricts downloads and requires attribution for commercial use. This guide selects by what the model is actually for, with current pricing from each vendor's own page."
description: "A complete 2026 selection guide for 3D modeling tools: pricing and topology quality across Meshy, Tripo, Rodin, and Tencent Hunyuan 3D; self-hosted open-source options (TRELLIS.2 / Hunyuan3D); phone scanning apps; Text-to-CAD; and manual tools like Blender."
draft: false
---

> :globe: [中文版](/posts/ai/2026-07-27-3d-modeling-tools-landscape)

"I want to make a 3D model" is not one question in 2026 — it's four. Is your input text, a photo, a physical object, or a dimensioned spec? Does the output go into a game engine, a 3D printer, an e-commerce page, or a CNC machine? Those two axes produce four completely different toolchains, and choosing wrong doesn't cost you "slightly worse quality" — it costs you the discovery, halfway through, that the thing you made cannot be modified at all.

This is a tool selection map. If you want the underlying research — how video diffusion gets lifted into 3D, why 3DGS may only be a transitional technique — the companion post [3D Generative Models in 2026: A Technical Map from Lyra 2.0](/posts/ai/2026-07-22-3d-generative-models-landscape-en) (in Chinese) covers the paper layer. This one covers what you can start using this afternoon.

## Four paths, disambiguated

```
What do you have?
├── Just an idea / one reference image ──→ AI generation (Meshy / Tripo / Rodin / Hunyuan 3D)
├── The physical object, in front of you ─→ Phone scanning (KIRI / RealityScan / Scaniverse)
├── Exact dimensions and tolerances ─────→ CAD (AdamCAD / Fusion 360 / Onshape)
└── Full control over every vertex ──────→ Manual modeling (Blender / Plasticity / Nomad)
                                                    ↑
                            Output from the first three paths almost always ends up here
```

That last line matters: **AI generation and scanning are not terminal stops**. They compress "zero to eighty percent" from days into minutes, but the remaining twenty percent — patching holes, fixing topology, matching dimensions — is still manual. Treat AI tools as blockout generators rather than finished-asset generators and your expectations will calibrate correctly.

## AI generation: the four commercial platforms

This is the lowest-barrier path. Text or an image goes in; a PBR-textured mesh comes out in seconds to minutes. The four vendors have clearly different biases:

| Platform | Current version | Strongest at | Free tier | Paid entry |
|---|---|---|---|---|
| [Meshy](https://www.meshy.ai/) | Meshy 7.1 | Mature UI, broadest feature coverage, hardest to get stuck in | 100 credits/mo | Pro $20/mo · 1,000 credits |
| [Tripo AI](https://www.tripo3d.ai/) | Tripo H3.1 | Cleanest quad topology, auto-rigging | 200 credits/mo | Pro $20/mo billed yearly · 3,000 credits |
| [Rodin (Hyper3D)](https://hyper3d.ai/) | Gen-2.5 | Most photorealistic textures and PBR | Free plan available | Creator $24/mo billed yearly ($30 monthly) · about 60 models |
| [Tencent Hunyuan 3D](https://3d.hunyuan.tencent.com/) | Web 3.x | End-to-end through animation, plus open weights | Free quota available | See official plans |

(Prices are from each vendor's own pricing page as of November 2026. Annual and monthly billing differ substantially at most vendors — verify before subscribing.)

### Meshy: the one you won't get stuck in

[Meshy](https://www.meshy.ai/) isn't best-in-class at any single axis; its value is that every axis is good enough and nothing blocks you. Models ship quickly: [Meshy-6](https://www.meshy.ai/blog/meshy-6-launch) on 2026-01-18, [Meshy 7](https://www.prnewswire.com/news-releases/meshy-releases-meshy-7-a-new-foundation-model-that-sets-a-new-bar-for-image-3d-alignment-302849368.html) on 2026-08-10 with a focus on matching the reference image, and [Meshy 7.1](https://www.meshy.ai/blog/meshy-7-1-launch) in 2026-09 adding Ultra 2K / Ultra 4K geometry resolution (Ultra 4K takes a single image only and needs a paid plan).

Per Meshy's [official Help Center](https://help.meshy.ai/en/articles/10000507-how-many-credits-does-each-generation-task-cost), the Model Stage costs 25 credits on Meshy 7, 20 on Meshy 6, and 10 on Meshy 6 Lite, and the Texture Stage adds 10 credits (15 for 8K textures). A full Meshy 7 run is about 35 credits; failed tasks are refunded.

The thing to actually watch is licensing and downloads. Per the [official Meshy pricing page](https://www.meshy.ai/pricing) and the [Free plan article](https://help.meshy.ai/en/articles/15696428-what-is-included-on-the-free-plan), the free plan gives you 100 credits a month and 1 concurrent task, licenses output under CC BY 4.0 (commercial use allowed with attribution to Meshy), and **only lets you download 10 untextured Meshy 6 Lite models a month** — Meshy 6/7 and textured models need a paid plan to download. Private assets, API access, and unlimited downloads start at Pro ($20/mo, 1,000 credits, 10 concurrent tasks). So the free tier is for getting a feel, not for production. Above Pro: Premium $40/3,000 credits, Studio $70/5,500 credits, Ultra $100/8,000 credits.

### Tripo: cleanest topology, least cleanup

If the output is headed for Unity or Unreal, [Tripo AI](https://www.tripo3d.ai/) is the default pick. Its differentiation is explicit: **quad topology, automatic retopology, and automatic rigging**. Per [Tripo's own comparison documentation](https://www.tripo3d.ai/tutorials/tripo-ai-vs-other-ai-3d-generators), the platform covers the full pipeline from modeling and texturing through retopology, rigging, and animation, plus AI segmentation that splits a model into independently editable parts.

The gap between triangle soup and clean quads only reveals itself the moment you deform the model, add a skeleton, or run subdivision. That's why Tripo's reputation is strongest among game-asset users — what it saves you is hours of downstream retopo work.

On the model side, Tripo's current flagship is [H3.1](https://developers.tripo3d.com/en/models/v3-1) (API version `v3.1-20260211`, up to 2 million faces, quad FBX output), alongside P1.0 for lightweight engine-ready meshes; at Formnext in 2026-11 it [previewed H3.5](https://www.prnewswire.com/news-releases/tripo-ai-gives-a-first-look-at-its-upcoming-print-ready-generative-model-with-intricate-true-to-life-3d-printed-creations-at-formnext-302939775.html), pitched as print-ready, without a release date. If you use the API, note that [the legacy v2.5 models are discontinued from 2026-12-01](https://developers.tripo3d.com/en/blog/legacy-model-deprecation).

Tripo prices aggressively. Its [official pricing page](https://www.tripo3d.ai/pricing) currently lists Free at 200 credits/mo (about 13 models, public and non-commercial), Pro at $20/mo billed yearly for 3,000 credits (about 200 models, private with commercial use), Max at $90/mo billed yearly for 25,000 credits, plus per-seat Team pricing. Meshy only reaches 3,000 credits at Premium ($40/mo billed monthly), though the two vendors' credits are not the same unit — compare on roughly how many models per month.

### Rodin: the ceiling on texture realism

[Hyper3D's Rodin](https://hyper3d.ai/) takes the opposite approach — not pipeline completeness, but per-asset visual quality. The current generation is still Gen-2.5, offering creative geometry mode, HD texture enhancement, texture delighting, forced symmetry, and micro-detail control: knobs aimed at artists. Per the [Hyper3D changelog](https://hyper3d.ai/changelog), Gen-2.5 opened 8K textures to all users in 2026-07; the 2026-09 Agent-Ready update moved to a second-generation 3D-native texture architecture with 8K/12K textures and shipped the Hyper3D CLI; and October–November 2026 added auto-rigging with prompt-editable skeletons.

Per the [official Hyper3D pricing page](https://hyper3d.ai/pricing), the Creator plan is $24/mo billed yearly ($30 monthly), estimated at about 60 models, and **API access, high-resolution textures, and high-poly quad output only unlock at Business ($96/mo billed yearly, $120 monthly, about 416 models)**. Rodin also supports a pay-by-result flow where you preview before committing credits, which is a meaningful design choice at higher per-generation costs.

Know the boundary though: Rodin optimizes meshes for **rendering**, not **printing**. Third-party reviews consistently report that its STL exports need substantial repair. For 3D printing, this is the worst fit of the four.

### Tencent Hunyuan 3D: the only dual-track platform-plus-open-weights option

[Tencent Hunyuan 3D](https://3d.hunyuan.tencent.com/) is unusual in offering both sides. The web platform is a full one-stop pipeline — 3D animation generation with skeletal rigging and motion selection, intelligent decimation, texture generation, sketch-to-3D, with export to OBJ / GLB / FBX / STL / USDZ — while the core model weights are fully open-sourced on GitHub.

Per the [Hunyuan3D-2 GitHub repo](https://github.com/Tencent-Hunyuan/Hunyuan3D-2), Hunyuan3D-2.1 was open-sourced on 2025-06-13 with a "new PBR model, VAE encoder, and all training code" — releasing the training code too is genuinely rare in 3D generation. The 2.5 technical report is at [arXiv:2506.16504](https://arxiv.org/abs/2506.16504). Third-party coverage reports the web platform's 3.1 release on 2026-01-29, supporting up to 8-view input for better reconstruction accuracy. Mind the gap between open source and the web product: on [Tencent-Hunyuan's GitHub](https://github.com/Tencent-Hunyuan), the newest downloadable shape and texture weights are still 2.1 (plus Hunyuan3D-Omni and Hunyuan3D-Part from 2025-09); 3.x lives only in the web app and API, and Hunyuan3D-Buffalo 1.0, published in 2026-08, is so far a paper and project page only.

The hardware bar is lower than you'd expect. The repo states:

> It takes 6 GB VRAM for shape generation and 16 GB for shape and texture generation in total.

So shape-only generation fits in 6 GB; you only need 16 GB once textures are involved. The 2mini variant is pruned further to 0.6B parameters (the full DiT-v2-1 is 3.0B), which runs on consumer cards at the RTX 4060 level.

## Self-hosted open source: for volume or licensing concerns

The biggest structural shift from 2025 to 2026 is that open-source 3D models genuinely caught up with the commercial platforms. If your volume makes credit pricing uneconomical, or you have commercial-licensing compliance concerns, this path is now a serious option:

- **[TRELLIS](https://github.com/microsoft/TRELLIS) (Microsoft)** — per [3D AI Studio's 2026 state-of-the-field report](https://www.3daistudio.com/state-of-ai-3d-generation-2026), TRELLIS.2 ships under MIT with 4B parameters, producing 1536-resolution assets in under 20 seconds. **The clean license is its biggest selling point** — no commercial strings attached.
- **[Hunyuan3D](https://github.com/Tencent-Hunyuan/Hunyuan3D-2) (Tencent)** — the best open option for texture and PBR quality, as covered above.
- **[TripoSG](https://github.com/VAST-AI-Research/TripoSG)** — high-fidelity shape synthesis via large-scale rectified flow.
- **[PartCrafter](https://github.com/wgsxm/PartCrafter)** — NeurIPS 2025; generates **structured, part-separable** meshes. For articulated assemblies or per-part editing, no other model gives you this.
- **[InstantMesh](https://github.com/TencentARC/InstantMesh)** — the canonical multi-view-diffusion-plus-feed-forward-reconstruction implementation, and a good entry point for understanding the approach.

The mainstream architecture has converged on "multi-view diffusion → feed-forward reconstruction": generate several consistent 2D views, then reconstruct a mesh with a feed-forward network. It's also the route with the best topology quality in 2026.

## Scanning: if you have the object, don't generate it

When the object you want to replicate is physically in front of you, scanning beats any AI generation on accuracy — generative models plausibly guess at occluded regions, while scanning measures them.

| App | Approach | Best for |
|---|---|---|
| [KIRI Engine](https://www.kiriengine.app/) | Photogrammetry + mesh-convertible 3DGS | Top pick on Android; converts Gaussian Splatting into real meshes for Blender / UE |
| [RealityScan](https://www.realityscan.com/) (Epic) | Pure photogrammetry | Straight into Unreal — same ecosystem |
| [Scaniverse](https://scaniverse.com/) (Niantic) | On-device 3DGS, free | Privacy: nothing gets uploaded |
| [Polycam](https://poly.cam/) | Photogrammetry + LiDAR + 3DGS | Broadest feature set, but the pricing structure changed in 2026 |

Two caveats. First, Gaussian Splatting looks great but **has no surface** — it's a cloud of semi-transparent ellipsoids, unusable directly in a game engine or physics sim, which makes KIRI's "3DGS to mesh" capability more important than it sounds. Second, per [SwiftWand's 2026 comparison](https://swiftwand.com/en/smartphone-3d-scanning-app-comparison-2026-en/), Polycam discontinued its Pro plan in 2026; its [official pricing page](https://poly.cam/pricing) now has four tiers — Free / Basic / Business ($400 per user per year) / Enterprise ($1,200 per user per year, 3-user minimum) — and Basic is frequently on promotion, so check before subscribing.

## Text-to-CAD: where an AI-generated mesh can't be edited, this can

This is the easiest path to get wrong. AI generation hands you **a mesh** — vertices, edges, faces, with no semantics like "this hole is 8mm." Changing it to 10mm means regenerating or sculpting by hand. CAD hands you a **parametric solid**: change the number, and the model recomputes.

Per [Leo AI's hands-on Text-to-CAD comparison](https://www.getleo.ai/blog/text-to-cad-tools-comparison-guide), the split in this space is clear:

- **[AdamCAD](https://www.adamcad.com/)** — text to a **parametric 3D model** with dimension sliders you can adjust without reworking anything, exportable to STL. Pick this if the model will change later.
- **[Zoo (Text-to-CAD)](https://zoo.dev/text-to-cad)** — generates mesh geometry directly, output in STL / OBJ; good for concept exploration and quick prototypes, but not parametric.
- **Spectral Labs SGS-1** and **Leo AI** — CAD copilots aimed further up the engineering stack.

For mature, stable choices, [Fusion 360](https://www.autodesk.com/products/fusion-360/), [Onshape](https://www.onshape.com/), and [FreeCAD](https://www.freecad.org/) remain the right answer for mechanical parts. The decision rule is simple: **will this model ever need a dimension change or a tolerance callout? If yes, go CAD — no matter how fast AI generation looks.**

## Manual modeling: where every path ends

| Tool | Position | Cost |
|---|---|---|
| [Blender](https://www.blender.org/) | Free and universal; the standard finishing station for AI and scan output | Free |
| [Nomad Sculpt](https://nomadsculpt.com/) | Organic sculpting on iPad; best mobile experience | One-time purchase |
| [ZBrush](https://www.maxon.net/zbrush) | The professional sculpting ceiling | Subscription |
| [Plasticity](https://www.plasticity.xyz/) | NURBS/solids; exceptionally clean hard-surface booleans and fillets | ~$175 perpetual |
| [Womp](https://womp.com/) | Browser-based SDF modeling; stronger than Tinkercad, gentler than Blender | Free tier exports STL |
| [Tinkercad](https://www.tinkercad.com/) | Absolute beginners and teaching | Free |

Per [3Dprinting.com's 2026 software guide](https://3dprinting.com/software-guides/best-3d-modeling-cad-software/), Plasticity takes the NURBS/solid-modeling route — a math-based method using smooth curves and watertight solids, prized for clean booleans and fillets, which makes it the most comfortable tool for hard-surface concept work. And per [Womp's own comparison](https://womp.com/blogs/womp-vs-tinkercad-vs-blender-the-ultimate-3d-software-comparison-for-beginners-in-2025/), as of July 2026 its free tier includes core tools, standard materials, and model export including STL.

## Selecting by use case

| What you're making | Recommended path |
|---|---|
| Game / animation assets | Tripo (quads + auto-rig) or Hunyuan 3D (through animation), finished in Blender; Rodin also added auto-rigging in 2026-11 |
| E-commerce / render stills | Rodin Gen-2.5 — highest texture realism |
| Fast exploration, still evaluating | Tripo free tier (200 credits ≈ 13 models) or Meshy free tier (100 credits; downloads limited to untextured Meshy 6 Lite models) |
| 3D printing (replicating an object) | Scan with KIRI Engine or RealityScan → repair in Blender |
| 3D printing (functional, dimensioned parts) | AdamCAD or Fusion 360 — don't use AI generation |
| High volume / commercial compliance | Self-host TRELLIS.2 (MIT) or Hunyuan3D 2.1 |

## Three things that bite

**Licensing bites harder than quality.** Commercial terms vary widely — Meshy's free tier is CC BY 4.0 (attribution required for commercial use, and most models can't be downloaded), with private assets starting at Pro; Tripo's free-tier models are public and non-commercial. Confirm before you generate, not after you've built a library you can't ship.

**AI-generated meshes are hostile to 3D printing.** Non-manifold geometry, holes, and trapped internal shells are the norm; feeding them straight to a slicer usually fails. Tripo's auto-repair helps, but still run everything through Blender's 3D Print Toolbox.

**Credit costs are non-linear.** A "full generation" is typically billed as two stages — model plus texture — and once you add retries, prompt edits, and style changes, real consumption often lands at three to five times your estimate. To evaluate seriously, run one real end-to-end case on the free tier before choosing a subscription tier.

## The bottom line

The core trade-off in 2026 isn't "which AI is strongest" — it's **which part of the process you're willing to give up control over**. AI generation trades away dimensional and topological control for speed. Scanning trades away imaginative freedom for accuracy. CAD trades away speed and organic form for control.

In practice the most efficient setup is a hybrid: block out with AI generation or a scan, finish in Blender, and route any dimensionally-critical parts through CAD separately. Committing entirely to one path means hitting a wall somewhere in the pipeline.

## Changelog

- 2026-11-23: Versions and prices updated to 2026-11. Meshy is now Meshy 7.1 (7 in 2026-08, 7.1 in 2026-09); free credits dropped from 200 to 100 a month, the free license is now CC BY 4.0 (commercial use with attribution) with downloads limited to untextured Meshy 6 Lite models, and per-generation credit costs follow the current Help Center table. Tripo is now H3.1, with P1.0, the H3.5 preview, and the v2.5 API shutdown date added; prices are now Pro $20/mo and Max $90/mo billed yearly. Rodin is still Gen-2.5, with 8K textures for all users, Agent-Ready, and auto-rigging added; the Business unlock changed from "4K textures" to "high-resolution textures." Hunyuan 3D now notes open weights still stop at 2.1. Polycam tiers follow the official pricing page.

## References

- [Meshy official pricing](https://www.meshy.ai/pricing) — plans, credits, and licensing
- [Meshy Help Center: credit cost per generation task](https://help.meshy.ai/en/articles/10000507-how-many-credits-does-each-generation-task-cost)
- [Meshy Help Center: what the Free plan includes](https://help.meshy.ai/en/articles/15696428-what-is-included-on-the-free-plan) — download limits and CC BY 4.0
- [Meshy-6 launch post](https://www.meshy.ai/blog/meshy-6-launch)
- [Meshy 7 announcement (PR Newswire)](https://www.prnewswire.com/news-releases/meshy-releases-meshy-7-a-new-foundation-model-that-sets-a-new-bar-for-image-3d-alignment-302849368.html)
- [Meshy 7.1 launch post](https://www.meshy.ai/blog/meshy-7-1-launch)
- [Tripo AI official pricing](https://www.tripo3d.ai/pricing)
- [Tripo H3.1 model page (Tripo Developers)](https://developers.tripo3d.com/en/models/v3-1)
- [Tripo legacy API model deprecation notice](https://developers.tripo3d.com/en/blog/legacy-model-deprecation)
- [Tripo AI previews H3.5 at Formnext (PR Newswire)](https://www.prnewswire.com/news-releases/tripo-ai-gives-a-first-look-at-its-upcoming-print-ready-generative-model-with-intricate-true-to-life-3d-printed-creations-at-formnext-302939775.html)
- [Tripo AI vs. other AI 3D generators (official)](https://www.tripo3d.ai/tutorials/tripo-ai-vs-other-ai-3d-generators)
- [Hyper3D Rodin official pricing](https://hyper3d.ai/pricing) — plans and the API / high-res texture / quad unlock threshold
- [Hyper3D changelog](https://hyper3d.ai/changelog) — Gen-2.5 updates and auto-rigging
- [Tencent Hunyuan 3D official site](https://3d.hunyuan.tencent.com/) (in Chinese)
- [Hunyuan3D-2 GitHub repo](https://github.com/Tencent-Hunyuan/Hunyuan3D-2) — model variants, VRAM requirements, release timeline
- [Hunyuan3D 2.5 technical report (arXiv:2506.16504)](https://arxiv.org/abs/2506.16504)
- [TRELLIS GitHub repo (Microsoft)](https://github.com/microsoft/TRELLIS)
- [TripoSG GitHub repo](https://github.com/VAST-AI-Research/TripoSG)
- [PartCrafter GitHub repo (NeurIPS 2025)](https://github.com/wgsxm/PartCrafter)
- [InstantMesh GitHub repo](https://github.com/TencentARC/InstantMesh)
- [State of AI 3D Generation 2026 (3D AI Studio)](https://www.3daistudio.com/state-of-ai-3d-generation-2026) — TRELLIS.2 specs and open-source status
- [Smartphone 3D scanning app comparison 2026 (SwiftWand)](https://swiftwand.com/en/smartphone-3d-scanning-app-comparison-2026-en/) — Polycam pricing changes
- [KIRI Engine](https://www.kiriengine.app/)
- [RealityScan (Epic Games)](https://www.realityscan.com/)
- [Scaniverse (Niantic)](https://scaniverse.com/)
- [Polycam](https://poly.cam/)
- [Polycam official pricing](https://poly.cam/pricing)
- [Text-to-CAD tools compared: Zoo vs Adam vs Spectral Labs SGS-1 (Leo AI)](https://www.getleo.ai/blog/text-to-cad-tools-comparison-guide)
- [AdamCAD](https://www.adamcad.com/)
- [Zoo Text-to-CAD](https://zoo.dev/text-to-cad)
- [Blender](https://www.blender.org/)
- [Plasticity](https://www.plasticity.xyz/)
- [Nomad Sculpt](https://nomadsculpt.com/)
- [Womp](https://womp.com/)
- [Best 3D Modeling & CAD Software for 3D Printing 2026 (3Dprinting.com)](https://3dprinting.com/software-guides/best-3d-modeling-cad-software/)
- Related on this site: [3D Generative Models in 2026: A Technical Map from Lyra 2.0](/posts/ai/2026-07-22-3d-generative-models-landscape-en) (in Chinese)
