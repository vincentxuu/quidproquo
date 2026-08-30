---
title: "A Guide to the Top AI Conferences of 2023: Computer Vision"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, cvpr, iccv, computer-vision, "2023", segment-anything, gaussian-splatting]
lang: en
tldr: "In 2023, computer vision moved from seeing images to understanding, generating, and controlling them. Segment Anything turned segmentation into a general zero-shot capability, ControlNet made diffusion models precisely controllable, and 3D Gaussian Splatting challenged NeRF with real-time rendering. CVPR received more than 9,000 submissions and ICCV more than 8,000 as both conferences returned to in-person events."
description: "A review of the award-winning and influential papers from CVPR and ICCV 2023, three major technical trends—foundation segmentation models, controllable generation, and new 3D representations—and which work still shaped the field in 2026."
draft: false
series:
  name: "AI Conference Guide"
  order: 16
glossary:
  - term: "SAM"
    definition: "Segment Anything Model, a foundation segmentation model released by Meta AI in 2023. Its promptable architecture performs zero-shot segmentation on arbitrary images, and its SA-1B training dataset contains more than 1.1 billion masks."
    context: "An ICCV 2023 Best Paper Honorable Mention that led to SAM 2 for video, EfficientSAM, FastSAM, and many other variants."
  - term: "ControlNet"
    definition: "A trainable control branch attached to a pretrained diffusion model such as Stable Diffusion. It lets users control generated results with conditions such as edge maps, depth maps, and pose skeletons without retraining the underlying model."
    context: "A co-winner of the ICCV 2023 Best Paper (Marr Prize) that changed how the community approached controllable generation."
  - term: "3D Gaussian Splatting"
    definition: "A scene representation built from millions of 3D Gaussian ellipsoids with position, color, opacity, and shape parameters. Rendering projects them directly onto the screen through differentiable rasterization rather than ray marching."
    context: "Published at SIGGRAPH 2023, it challenged NeRF with real-time rendering and differentiable training and became a major direction in 3D representation research."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2023-cv)

Computer vision returned to a long-missed in-person conference format in 2023: CVPR convened in Vancouver and ICCV in Paris. The more consequential change, however, was in the papers themselves. Diffusion models progressed from generating images to controlling them. Segmentation moved from task-specific training toward a general zero-shot capability. And 3D representations began shifting from NeRF's implicit fields to the explicit representation of Gaussian Splatting. This article reviews the award winners, influential research, and three technical trends that defined computer vision in 2023.

## CVPR 2023

**Key figures:** 9,155 submissions, 2,359 accepted papers, and a 25.8% acceptance rate. The in-person conference took place in Vancouver, Canada, from June 18 to 22, 2023. Of the 2,359 accepted papers, the conference selected 235 Highlight Papers—roughly 10%—before choosing the final award winners.

### Best Paper Awards (two co-winners)

**Visual Programming: Compositional Visual Reasoning Without Training**  
Tanmay Gupta and Aniruddha Kembhavi (Allen Institute for AI)

Rather than train any new neural network, the method asks an LLM—GPT-3 or Codex—to translate a visual reasoning question into Python. The program then composes existing vision modules for tasks such as object detection, depth estimation, and image segmentation. The central insight is that a massive end-to-end model does not need to learn every reasoning skill: code can provide the compositional logic while vision models handle perception. The system achieved competitive results on benchmarks including GQA and NLVR2 without task-specific training. It anticipated the later visual-agent pattern of using an LLM as the reasoning engine and vision models as tools.

**Planning-oriented Autonomous Driving (UniAD)**  
Yihan Hu, Jiazhi Yang, Li Chen, et al. (Shanghai AI Laboratory / Wuhan University / The Chinese University of Hong Kong)

UniAD integrates perception—detection, tracking, and mapping—prediction, and planning into one Transformer architecture. Its planning-oriented design makes every subtask serve the final trajectory plan. Previous systems optimized each module separately and then connected them, which could accumulate errors and leave module objectives misaligned. UniAD surpassed separate state-of-the-art systems across its nuScenes subtasks and provided the first demonstration of a unified end-to-end autonomous-driving system across a multi-task benchmark.

### Best Paper Honorable Mention

**DynIBaR: Neural Dynamic Image-Based Rendering**  
Zhengqi Li, Qianqian Wang, Forrester Cole, Richard Tucker, and Noah Snavely (Google Research)

DynIBaR synthesizes novel views from a monocular video, including scenes with moving objects rather than only static environments. It decomposes a scene into a static background represented with NeRF and a dynamic foreground represented with a motion trajectory field, then combines those components with image-based rendering to interpolate across both space and time. On Nvidia Dynamic Scenes and the authors' own outdoor videos, it produced markedly better results than earlier dynamic-NeRF methods.

### Best Student Paper

**3D Registration with Maximal Cliques**  
Xiyu Zhang, Jiaqi Yang, Shikun Zhang, and Yanning Zhang (Northwestern Polytechnical University)

This paper reformulates 3D point-cloud registration as a maximal-clique problem. It searches maximal cliques in a consistency graph to identify inlier correspondences. The method is simple, fast, and robust even with severe outlier contamination, and it achieved state-of-the-art results on 3DMatch, 3DLoMatch, and KITTI.

### Best Student Paper Honorable Mention

**DreamBooth: Fine Tuning Text-to-Image Diffusion Models for Subject-Driven Generation**  
Nataniel Ruiz, Yuanzhen Li, Varun Jampani, Yael Pritch, Michael Rubinstein, and Kfir Aberman (Google Research / Boston University)

With just three to five photographs of a specific subject—a pet, object, or person—DreamBooth can embed that subject in a pretrained text-to-image model. Text prompts can then place it in arbitrary scenes. The method uses a special identifier token and a class-specific prior-preservation loss to prevent language drift. From a 2026 vantage point, DreamBooth opened the research direction of personalized generation. Later work such as IP-Adapter, InstantID, and PhotoMaker adopted the problem it defined.

### Other influential papers

- **InstructPix2Pix: Learning to Follow Image Editing Instructions** (Tim Brooks, Aleksander Holynski, and Alexei A. Efros, UC Berkeley / Google Research)—GPT-3 generates editing instructions and Stable Diffusion generates training pairs, producing a model that edits images directly from natural-language instructions. It requires no per-image optimization and completes an edit in a single forward pass.
- **ODISE: Open-Vocabulary Panoptic Segmentation with Text-to-Image Diffusion Models** (Jiarui Xu et al., NVIDIA / UT Austin / Cornell)—uses internal representations learned by text-to-image diffusion models for open-vocabulary panoptic segmentation, showing that their intermediate features support semantic understanding as well as generation.
- **Magic3D: High-Resolution Text-to-3D Content Creation** (Chen-Hsuan Lin et al., NVIDIA)—uses a coarse-to-fine, two-stage pipeline for text-to-3D generation. A low-resolution NeRF with an SDS loss first produces a rough shape, then a high-resolution mesh refines the details. It was twice as fast as DreamFusion and produced eight times the resolution.
- **Scaling Up Visual and Vision-Language Representation Learning With Noisy Text Supervision**—extends the CLIP approach to large-scale vision-language pretraining and studies how larger, noisier web datasets affect representation learning.

## ICCV 2023

**Key figures:** 8,088 submissions, 2,160 accepted papers, and a 26.7% acceptance rate. The in-person conference took place in Paris, France, from October 2 to 6, 2023.

### Best Paper (Marr Prize; two co-winners)

**Adding Conditional Control to Text-to-Image Diffusion Models (ControlNet)**  
Lvmin Zhang, Anyi Rao, and Maneesh Agrawala (Stanford University)

ControlNet adds a trainable side network to a pretrained diffusion model. Conditions such as Canny edges, depth maps, human pose skeletons, and semantic segmentation maps can then precisely control image composition and structure while preserving the underlying model's generation quality. The method makes a locked copy of Stable Diffusion's encoder layers and trains only newly added zero-convolution layers in the side network, keeping training costs low.

Its impact went far beyond the paper. ControlNet fundamentally changed how creators used diffusion models, replacing trial-and-error prompt adjustment with a workflow in which a sketch or pose photo determines the generated composition. Within months of its release, the open-source community produced dozens of control-condition variants—including tile, inpainting, and reference-only modes—and ControlNet became a standard part of Stable Diffusion WebUI.

**Passive Ultra-Wideband Single-Photon Imaging**  
Mian Wei, Sotiris Nousias, Rahul Gulve, David B. Lindell, and Kiriakos N. Kutulakos (University of Toronto)

This work uses a single-photon detector, or SPAD, for passive ultra-wideband imaging without an actively emitted light source. It captures time-resolved scene information under extremely low light. A physical-optics and computational-imaging paper winning the Marr Prize is relatively unusual in the computer-vision community, reflecting ICCV reviewers' attention to research beyond software algorithms alone.

### Best Paper Honorable Mention

**Segment Anything (SAM)**  
Alexander Kirillov, Eric Mintun, Nikhila Ravi, Hanzi Mao, et al. (Meta AI)

SAM is a promptable foundation model for segmentation, trained on the SA-1B dataset of more than 1.1 billion masks. Given an image and a prompt—a point, box, text, or mask—it returns a segmentation of the requested region. Its architecture contains a heavyweight image encoder (ViT-H), a lightweight prompt encoder, and a fast mask decoder. The image encoder runs only once, after which the model can respond to different prompts in real time.

SAM mattered not simply because it was a better segmentation model, but because it changed the task definition. Instead of training a segmenter for a specific class, users gained a general segmentation engine that could segment whatever they pointed to. By 2026, the "segment-then-X" pattern it enabled had spread through nearly every downstream task requiring pixel-level understanding, from video editing and medical imaging to robot perception. SAM 2 extended the approach to video in 2024, and SAM's influence continued to grow.

### Best Student Paper

**Tracking Everything Everywhere All at Once (OmniMotion)**  
Qianqian Wang, Yen-Yu Chang, Ruojin Cai, Zhengqi Li, Bharath Hariharan, Aleksander Holynski, and Noah Snavely (Cornell University / Google Research / UC Berkeley)

OmniMotion estimates the complete long-range trajectory of every pixel in a video. It goes beyond optical flow, which measures motion between adjacent frames, to recover a globally consistent motion field across the full sequence. A quasi-3D canonical space unifies motion across frames, and test-time optimization fits the model to each video. The approach substantially outperformed earlier optical-flow and point-tracking methods on long-range dense tracking.

### Other influential papers

- **DINOv2: Learning Robust Visual Features Without Supervision** (Maxime Oquab et al., Meta AI)—technically released as an arXiv preprint in April 2023, but widely discussed during ICCV. It learns general-purpose visual features from a curated, large-scale unlabeled dataset and approaches or exceeds supervised pretrained backbones on downstream tasks. DINOv2 became a default visual encoder for many later projects.
- **Scalable Diffusion Models with Transformers (DiT)** (William Peebles and Saining Xie, UC Berkeley / New York University)—replaces the U-Net diffusion-model backbone with a Transformer and shows that scaling laws also apply to diffusion models. DiT later became an architectural foundation for video-generation systems such as Sora.
- **ImageBind: One Embedding Space To Bind Them All** (Rohit Girdhar et al., Meta AI)—aligns images, text, audio, depth, thermal data, and IMU measurements in a single embedding space. It needs only image-text pairs and naturally paired images and other modalities, rather than joint labels across all six modalities.

## Three major computer-vision trends in 2023

### Trend 1: Foundation models enter computer vision—from CLIP to SAM

If CLIP in 2021 proved the concept of a computer-vision foundation model, SAM in 2023 was the first to change day-to-day workflows. SAM showed that a promptable model trained on a sufficiently large dataset could handle arbitrary segmentation tasks out of the box, without retraining for every downstream task. DINOv2 approached the same goal from another direction by providing a general-purpose visual-feature backbone ready for reuse.

Together, they signaled that the field had accepted the idea of one large model solving a broad class of problems instead of training a specialist for every task. That was still a minority view in 2021 and 2022; by 2023, it had become a mainstream consensus.

### Trend 2: Controllable generation replaces random generation

Stable Diffusion and DALL-E 2 established the viability of text-to-image generation in 2022, but users still had little control over composition, pose, or style. In 2023, ControlNet, DreamBooth, and InstructPix2Pix tackled the problem from three directions:

- **ControlNet:** controls spatial composition with structured conditions such as edges, depth, and pose
- **DreamBooth:** controls subject identity from a small set of photographs
- **InstructPix2Pix:** controls editing direction through natural-language instructions

Together, the three methods turned diffusion models from entertaining toys into practical creative tools. CVPR 2023's official trend report also ranked "Render the Real" as its top trend, showing that conference organizers had observed the same shift.

### Trend 3: New 3D representations—from NeRF to Gaussian Splatting

Since NeRF won an ECCV Best Paper award in 2020, it had inspired hundreds of follow-up papers by 2023. Yet NeRF has a fundamental limitation: an implicit MLP represents the scene, and rendering requires many queries along every ray through ray marching. The result is slow and memory-intensive.

Published at SIGGRAPH 2023, **3D Gaussian Splatting** by Bernhard Kerbl, Georgios Kopanas, Thomas Leimkühler, and George Drettakis (INRIA / Max Planck Institute) changed the representation itself. Millions of parameterized 3D Gaussian ellipsoids explicitly represent a scene. Differentiable rasterization replaces ray marching at render time, reaching real-time rates of more than 30 fps while retaining high quality.

Although 3DGS was not a CVPR or ICCV paper, its impact on the computer-vision community was already evident in the second half of 2023. Multiple NeRF papers at ICCV 2023 began citing or comparing against it. By CVPR and ECCV 2024, the number of 3DGS variants had exploded, and Mip-Splatting received a CVPR 2024 Honorable Mention.

At the same time, CVPR 2023's DynIBaR, a Best Paper Honorable Mention, and ICCV 2023's OmniMotion, the Best Student Paper, addressed novel-view synthesis and long-range tracking in dynamic scenes. Understanding dynamic scenes was the next frontier shared by NeRF and 3DGS approaches.

## What changed from 2022

| Dimension | 2022 | 2023 |
|---|---|---|
| Generative models | Diffusion models could generate (Latent Diffusion, Imagen) | Diffusion models became controllable (ControlNet, DreamBooth, InstructPix2Pix) |
| Segmentation | Still required task-specific training | SAM enabled general zero-shot segmentation |
| 3D representations | NeRF variants proliferated (Instant-NGP, Mip-NeRF 360) | 3DGS offered an explicit alternative and began challenging NeRF |
| Vision foundation models | MAE, BEiT v2 (self-supervised pretraining) | DINOv2, SAM (ready-to-use general features and segmentation) |
| Autonomous driving | Primarily modular | UniAD advanced a unified end-to-end architecture |
| Submissions | CVPR 8,161 / ECCV ~6,773 | CVPR 9,155 / ICCV 8,088 |

## Looking back from 2026: the most consequential papers of 2023

1. **Segment Anything (SAM)**—the "segment-then-X" pattern spread through nearly every field requiring pixel-level understanding. SAM 2 expanded it to video, while EfficientSAM, FastSAM, and similar variants brought it to edge devices. New papers in 2026 still used SAM extensively as a preprocessing step.
2. **ControlNet**—controllable generation moved from research into products, and ControlNet became a standard component of Stable Diffusion WebUI and ComfyUI. Later work including IP-Adapter, T2I-Adapter, and ControlNet++ (2024) built on its framework.
3. **3D Gaussian Splatting**—although published at SIGGRAPH rather than a computer-vision conference, 3DGS had overtaken NeRF as the dominant 3D representation method at 2024 and 2025 computer-vision conferences. The number of related papers at CVPR, ECCV, and ICCV grew exponentially during those years.
4. **DreamBooth**—personalized generation became a research area in its own right, with IP-Adapter, InstantID, PhotoMaker, and other later work inheriting the problem framing DreamBooth established.
5. **DiT (Diffusion Transformer)**—the use of a Transformer as a diffusion-model backbone was adopted directly by next-generation models including Sora (2024) and Stable Diffusion 3 (2024). DiT's scaling analysis became an important basis for architecture choices.

---

## References

- [CVPR 2023 Best Paper Award Winners Announced (official)](https://cvpr.thecvf.com/Conferences/2023/BestPaperAwards)
- [CVPR Reveals Top Five Trends in Computer Vision (official trend report)](https://cvpr.thecvf.com/Conferences/2023/TopTrends)
- [CVPR 2023 Closing Statement (official submission and acceptance statistics)](https://cvpr.thecvf.com/Conferences/2023/ClosingStatement)
- [Computer Vision Awards — The Computer Vision Foundation (historical ICCV award winners)](https://www.thecvf.com/?page_id=413)
- [ICCV Paper Awards — IEEE TCPAMI (historical Marr Prize winners)](https://tc.computer.org/tcpami/awards/iccv-paper-awards/)
- [Best Papers of Top Venues — GitHub (cross-conference award-paper index)](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [ICCV 2023 Top Papers, General Trends, and Personal Picks — AI Summer](https://theaisummer.com/iccv-2023/)
- [Segment Anything — Kirillov et al. (ICCV 2023)](https://segment-anything.com/)
- [ControlNet — Adding Conditional Control to Text-to-Image Diffusion Models (ICCV 2023)](https://arxiv.org/abs/2302.05543)
- [DreamBooth — Fine Tuning Text-to-Image Diffusion Models for Subject-Driven Generation (CVPR 2023)](https://dreambooth.github.io/)
- [3D Gaussian Splatting for Real-Time Radiance Field Rendering — Kerbl et al. (SIGGRAPH 2023)](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/)
- [DINOv2: Learning Robust Visual Features Without Supervision — Oquab et al. (arXiv 2023)](https://arxiv.org/abs/2304.07193)
- [Scalable Diffusion Models with Transformers (DiT) — Peebles & Xie (ICCV 2023)](https://arxiv.org/abs/2212.09748)
- [Planning-oriented Autonomous Driving (UniAD) — Hu et al. (CVPR 2023)](https://arxiv.org/abs/2212.10156)
- [Visual Programming: Compositional Visual Reasoning Without Training — Gupta & Kembhavi (CVPR 2023)](https://arxiv.org/abs/2211.11559)
- [InstructPix2Pix: Learning to Follow Image Editing Instructions — Brooks et al. (CVPR 2023)](https://arxiv.org/abs/2211.09800)
