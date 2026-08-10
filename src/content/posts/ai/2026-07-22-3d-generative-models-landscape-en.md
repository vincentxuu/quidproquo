---
title: "Where 3D Generative Models Stand: Reading the 2026 Technical Map Through Lyra 2.0"
date: 2026-07-22
category: ai
type: deep-dive
tags:
  - 3d-generation
  - gaussian-splatting
  - video-diffusion
  - 3d-reconstruction
  - lyra
  - cvpr-2026
  - nerf
  - embodied-ai
lang: en
tldr: "The dominant paradigm in 3D generation in 2026 is video diffusion feeding feed-forward 3D reconstruction, and Lyra 2.0 is the flagship of that line. But three Best Papers at CVPR 2026 point at what comes next: SAM 3D brings foundation-model-scale object reconstruction, D4RT rebuilds dynamic 4D scenes in seconds from a unified transformer, and O-Voxel replaces Gaussians with structured latents. 3DGS still rules, but surface primitives are challenging it, and pixel-space diffusion is pushing back against latent space."
description: "Starting from NVIDIA's Lyra 2.0 and working outwards across the 2025–2026 literature: the generative-reconstruction consensus pipeline, 3DGS's dominance and its challengers, feed-forward methods displacing per-scene optimization, the rise of dynamic 4D, and what three CVPR 2026 Best Papers say about the next wave."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-07-22-3d-generative-models-landscape)

I have been reading up on 3D model generation, starting from NVIDIA's [Lyra 2.0](https://arxiv.org/abs/2604.13036) in April and pulling in twenty-odd papers around it. This is not a paper-by-paper summary. It takes the whole map at once and answers one question: **as of mid-2026, if you want to understand 3D generative models from scratch, what should you read, what can you skip, and which turns matter?**

The short version: the field is going through one convergence and one impending split. The convergence is that "video diffusion plus feed-forward reconstruction" has become the consensus pipeline. The split is that 3DGS's monopoly is being challenged by surface primitives and structured latents, while pixel-space diffusion is mounting a counterattack on latent space.

## 1. What Lyra 2.0 is actually solving

Lyra 2.0's task: take one image, let the user define a camera trajectory, and generate a 3D world you can freely explore. The idea is not new — use a video diffusion model to generate camera-controlled video, then lift that video into a scene with 3D reconstruction. Lyra 1.0 and Gen3C both did it. What Lyra 2.0 tackles is the two walls you hit when you try to do this at scale.

**Spatial forgetting.** The camera moves far enough away that previously seen regions fall out of the temporal context window. On the way back, the model can only hallucinate from scratch, and the structure stops being continuous. Lyra 2.0's approach is to maintain per-frame 3D geometry but use it only for information routing — retrieving the historical frames most relevant to the target view, establishing dense correspondence — while appearance synthesis stays with the generative model. That decoupling, geometry for routing and generation for appearance, is the paper's most important design decision. Earlier methods fed reconstructed 3D straight back in as conditioning, so generation artifacts contaminated the 3D, and the contaminated 3D contaminated the next round of generation. Error amplification.

**Temporal drifting.** Autoregressive generation accumulates error by nature. Small artifacts at each step become serious color shift and structural distortion after a few dozen. Lyra 2.0 trains on self-augmented histories — the model sees its own degraded output during training and learns to correct rather than propagate. It is a clever inversion: rather than trying to make the model not make mistakes, teach it to recover from them.

The final output is 3D Gaussian splats plus a surface mesh, using a modified Depth Anything v3 for feed-forward reconstruction and OpenVDB for hierarchical mesh extraction.

## 2. The consensus pipeline of 2026

Lyra 2.0 is not an isolated case. Lay out the scene-level 3D generation papers from 2025 and 2026 and almost everyone is working on the same pipeline:

```
single image / text → camera-controlled video diffusion → multi-view video → feed-forward 3D reconstruction → 3DGS / mesh
```

What differs is how each segment is built:

| Paper | Video generation strategy | Consistency mechanism | 3D representation |
|------|------------|-----------|---------|
| Lyra 1.0 (ICLR 2026) | Self-distillation; RGB decoder supervises the 3DGS decoder | Distillation inside latent space | 3DGS |
| Gen3R (CVPR 2026) | VGGT as a geometry VAE, aligned with the video diffusion appearance latents | Joint generation of geometry × appearance latents | Point cloud + depth + pose |
| WorldStereo (2026-03) | Two geometric memory modules injected into the VDM | Global memory + stereo memory | Point cloud |
| GGS (ICCV 2025) | A 3D Gaussian feature field integrated inside the U-Net | Feature space rather than latent space | 3DGS |
| Rein3D (2026-04) | Panoramic video-to-video diffusion for inpainting | Panoramic prior + radial exploration | 3DGS |

Two reasons this pipeline became the consensus. First, video diffusion models are trained on internet video, whose scale and diversity dwarf any 3D dataset, so the 3D prior they carry implicitly is very good. Second, separating generation from reconstruction lets both sides evolve independently — video models keep improving, reconstruction models keep improving, and the pipeline benefits automatically.

Gen3R deserves separate mention: it converts the reconstruction model VGGT into a geometry VAE so that geometry latents and appearance latents are jointly generated in the same space. This is not "generate a video then reconstruct it" — the generation process itself produces 3D geometry. CVPR 2026 accepting it signals that the community endorses fusing reconstruction and generation.

## 3. The pursuit of pure feed-forward

Downstream of that pipeline — from video frames to a 3D representation — a quiet revolution is under way: **eliminating per-scene optimization**.

Traditional 3DGS and NeRF need minutes to hours of optimization per scene. Feed-forward methods need one forward pass and emit 3D directly. The notable ones:

- **Depth Anything v3** — per-pixel prediction of 3DGS attributes; Lyra 2.0 adopts it directly
- **AnySplat** — feed-forward 3DGS prediction from unconstrained arbitrary views, no known camera parameters required
- **AnchorSplat** (CVPR 2026) — anchor-aligned Gaussians instead of pixel-aligned ones, beating AnySplat with 1/20 the Gaussian count
- **tttLRM** (CVPR 2026 Highlight) — Test-Time Training layers for linear-complexity long-context autoregressive 3D reconstruction

The most recent, **PRISM** (2026-06), is more radical still: it drops diffusion sampling entirely. Observing that a geometric forward warp already covers most of the target view, only a small residual needs an encoder to correct it. Inference drops from minutes to 36 seconds and quality stays competitive.

The direction is unambiguous: **3D generation is heading towards "one image in, 3D out, under a minute."**

## 4. 3DGS's reign and its challengers

Open almost any 3D paper from 2025 or 2026 and 3D Gaussian Splatting is the final representation. NeRF has essentially left the stage — not because its results are worse, but because 3DGS's real-time rendering and explicit representation suit downstream applications far better.

But 3DGS has a fundamental problem: **it has no surface**. A Gaussian is a semi-transparent ellipsoid. It renders beautifully, but you cannot get a clean mesh out of it to drop into a game engine or a physics simulator. Lyra 2.0 post-processes with OpenVDB marching cubes to extract a mesh, but that is essentially "make a pile of ellipsoids, then squeeze a surface out of them."

CVPR 2026 Best Paper **O-Voxel** (Native and Compact Structured Latents for 3D Generation) and the recent **FLAT** (2026-06) represent two different lines of attack.

**O-Voxel** proposes a structured latent representation that encodes precise geometry and surface attributes in latent space itself. The 3D assets it generates are far better than Gaussian-based methods produce. This is a change at the level of representation.

**FLAT** is more direct: it is the first to decode triangle splats rather than Gaussian splats from video diffusion latents. Triangles define surfaces natively. The paper solves the gradient-flow problem in triangle prediction (ray-centered rotation parameterization plus a product window function), and with light test-time refinement it produces a fully opaque, game-engine-ready representation.

Which suggests: **3DGS may be transitional**. It is the bridge from NeRF to a genuinely production-ready 3D representation, but the destination may be generating meshes or surface primitives directly.

## 5. Pixel space pushes back

Another signal worth noting is **PixWorld** (2026-07, the most recent of these), which challenges latent-space diffusion's monopoly.

Nearly every 3D generation method from 2025–2026 works in latent space — compress the image with a VAE, run diffusion on the latents, decode back. PixWorld's argument is that latent encoding loses information by construction, and that defining the diffusion objective on latent features rather than on the underlying 3D representation hurts too. Both damage quality.

PixWorld runs diffusion directly in pixel space, with supervision defined on rendered images and no VAE or RAE. It adds a geometry perception loss that supplies 3D structural supervision from the feature space of a pretrained 3D foundation model.

The result: it consistently beats latent-space generation methods and matches state-of-the-art reconstruction methods.

This does not necessarily mean latent space is finished, but it opens a direction that had been overlooked. Pixel space costs more compute; if its quality ceiling is genuinely higher, hardware will catch up eventually.

## 6. What the CVPR 2026 Best Papers say about the next wave

The 3D-related Best Papers selected from 16,000+ CVPR 2026 submissions are worth taking seriously, because they indicate what the community thinks matters most.

**D4RT** (Google DeepMind / Oxford) — a unified transformer architecture that reconstructs the complete geometry of a dynamic 4D scene from video in seconds. Lightweight and scalable. The signal in it winning Best Paper: **dynamic 4D is no longer an appendage of 3D but a first-class citizen**.

**SAM 3D** (Meta) — a 1.2B-parameter Flow Transformer with an MoT architecture, predicting per-object geometry, texture and spatial layout from a single natural image and assembling them into a complete 3D scene. Paired with a human-in-the-loop post-training data engine and DPO preference alignment, it wins human preference tests 5:1. Open source. The signal: **3D reconstruction and generation are entering the foundation-model era, and post-training alignment is now standard equipment**.

**O-Voxel** (Tsinghua / Microsoft Research) — native 3D generation from structured latents. Same signal as the previous section: **the representation matters more than the method**.

The three point at 4D, foundation models, and representational change respectively. If you were betting on 2027, those three deserve more attention than "a better video diffusion model."

## 7. A reading map for researchers

A suggested reading order, arranged by dependency and importance.

**Essential — understand the base paradigm:**
1. **Lyra 1.0** — the self-distillation framework; the origin of video diffusion → 3DGS
2. **Lyra 2.0** — anti-forgetting and anti-drifting for long-sequence consistency
3. **Gen3R** — fusing reconstruction and generation, CVPR 2026

**Core — get the current state of the art:**
4. **SAM 3D** — object-level foundation model, CVPR 2026 Best Paper
5. **D4RT** — dynamic 4D reconstruction, CVPR 2026 Best Paper
6. **AnchorSplat** — the efficiency frontier of feed-forward reconstruction

**Frontier — understand where it is going:**
7. **FLAT** — triangle splats replacing Gaussians
8. **PixWorld** — pixel space versus latent space
9. **PRISM** — removing diffusion sampling, 36-second inference

**Optional, by interest:**
- Diff4Splat / ActionMesh — dynamic 4D generation (for games or animation)
- Rein3D — indoor scenes (for VR/AR)
- SAGE — environment generation for embodied AI (for robotics)
- TIGON — text-plus-image bimodal 3D generation

## Where this goes

3D generation sits at an interesting moment: the base pipeline has converged (video diffusion plus feed-forward reconstruction), but the layer above it — representation and training paradigm — has not settled. 3DGS may be transitional. Latent space may not be the only option. Foundation models plus post-training alignment are spreading from NLP and 2D vision into 3D.

If you are building applications — games, VR/AR, robot training environments — tools at the Lyra 2.0 or SAM 3D level are usable today. If you are doing research, representational change (FLAT, O-Voxel) and the pixel-space route (PixWorld) probably carry more long-term value than continuing to tune parameters on latent-space 3DGS.

Dynamic 4D is the next inflection point with the highest certainty. D4RT taking Best Paper was not an accident — static 3D quality is already "good enough," and the real gap is in motion.

## References

- [Lyra 2.0: Explorable Generative 3D Worlds](https://arxiv.org/abs/2604.13036) — Tianchang Shen, Xuanchi Ren et al., NVIDIA, 2026-04
- [Lyra: Generative 3D Scene Reconstruction via Video Diffusion Model Self-Distillation](https://arxiv.org/abs/2509.19296) — Sherwin Bahmani et al., NVIDIA, ICLR 2026
- [Gen3R: 3D Scene Generation Meets Feed-Forward Reconstruction](https://arxiv.org/abs/2601.04090) — Jiaxin Huang et al., CVPR 2026
- [D4RT: Efficiently Reconstructing Dynamic Scenes One D4RT at a Time](https://cvpr.thecvf.com/Conferences/2026/News/Best_Papers) — Chuhan Zhang et al., Google DeepMind / Oxford, CVPR 2026 Best Paper
- [SAM 3D: 3Dfy Anything in Images](https://ai.meta.com/sam3d) — Xingyu Chen et al., Meta, CVPR 2026 Best Paper
- [Native and Compact Structured Latents for 3D Generation (O-Voxel)](https://cvpr.thecvf.com/Conferences/2026/News/Best_Papers) — Jianfeng Xiang et al., Tsinghua / Microsoft Research, CVPR 2026 Best Paper
- [PixWorld: Unifying 3D Scene Generation and Reconstruction in Pixel Space](https://arxiv.org/abs/2607.05373) — arXiv 2026-07
- [FLAT: Feedforward Latent Triangle Splatting](https://arxiv.org/abs/2606.24876) — arXiv 2026-06
- [PRISM: Feed-Forward Single-Image 3D Reconstruction via Geometric Warp-Residual Modeling](https://arxiv.org/abs/2606.25430) — arXiv 2026-06
- [WorldStereo: Bridging Camera-Guided Video Generation and Scene Reconstruction](https://arxiv.org/abs/2603.02049) — arXiv 2026-03
- [Rein3D: Reinforced 3D Indoor Scene Generation](https://arxiv.org/abs/2604.10578) — arXiv 2026-04
- [Generative Gaussian Splatting (GGS)](https://arxiv.org/abs/2503.13272) — Katja Schwarz et al., Meta, ICCV 2025
- [Diff4Splat: Controllable 4D Scene Generation](https://arxiv.org/abs/2511.00503) — CVPR 2026
- [Uni3R: Unified 3D Reconstruction and Semantic Understanding](https://openaccess.thecvf.com/content/CVPR2026/papers/Sun_Uni3R_Unified_3D_Reconstruction_and_Semantic_Understanding_via_Generalizable_Gaussian_CVPR_2026_paper.pdf) — CVPR 2026
- [AnchorSplat: Feed-Forward 3D Gaussian Splatting with 3D Geometric Priors](https://openaccess.thecvf.com/content/CVPR2026/papers/Zhang_AnchorSplat_Feed-Forward_3D_Gaussian_Splatting_With_3D_Geometric_Priors_CVPR_2026_paper.pdf) — CVPR 2026
- [tttLRM: Test-Time Training for Long Context and Autoregressive 3D Reconstruction](https://cvpr.thecvf.com/virtual/2026/events/Highlights2026) — CVPR 2026 Highlight
- [VidSplat: Gaussian Splatting Reconstruction with Geometry-Guided Video Diffusion Priors](https://arxiv.org/abs/2605.11424) — arXiv 2026-05
- [TIGON: Text-Image Conditioned 3D Generation](https://openaccess.thecvf.com/content/CVPR2026/papers/Cen_Text-Image_Conditioned_3D_Generation_CVPR_2026_paper.pdf) — CVPR 2026
- [SAGE: Scalable Agentic 3D Scene Generation for Embodied AI](https://openaccess.thecvf.com/content/CVPR2026/papers/Xia_SAGE_Scalable_Agentic_3D_Scene_Generation_for_Embodied_AI_CVPR_2026_paper.pdf) — CVPR 2026
- [ActionMesh: Animated 3D Mesh Generation with Temporal 3D Diffusion](https://cvpr.thecvf.com/virtual/2026/events/Highlights2026) — CVPR 2026

## Related

- [The 2026 Map of 3D Modeling Tools: AI Generation, Scanning, CAD, and Hand Modeling](/posts/ai/2026-07-27-3d-modeling-tools-landscape-en) — the tool-selection companion to this paper-level map: what you can actually start using this afternoon
