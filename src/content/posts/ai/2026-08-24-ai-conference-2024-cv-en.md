---
title: "2024 AI Conference Review: Computer Vision"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, cvpr, eccv, computer-vision, "2024", video-generation, gaussian-splatting]
lang: en
tldr: "In 2024, 3D Gaussian Splatting took over 3D reconstruction, video generation moved from research toward products, and vision-language models spread into specialized domains. CVPR received a record 11,500-plus submissions; its Best Papers were Google Research's Generative Image Dynamics and the UCSD/Google collaboration Rich Human Feedback for Text-to-Image Generation. ECCV gave its Best Paper award to Columbia's Minimalist Vision with Freeform Pixels, an unconventional return to the physics of optics."
description: "A review of award-winning and influential work from CVPR and ECCV 2024, four major technical trends—the 3DGS boom, productization of video generation, specialized vision-language models, and the peak of autonomous-driving perception research—and how the year differed from 2023."
draft: false
series:
  name: "AI 頂會導讀"
  order: 20
glossary:
  - term: "3DGS"
    definition: "Short for 3D Gaussian Splatting. It represents a scene with a set of 3D Gaussian ellipsoids and rasterizes them directly into 2D images for real-time rendering. Introduced by Kerbl et al. in late 2023, it displaced NeRF as the mainstream approach to 3D reconstruction during 2024."
    context: "CVPR 2024 Best Student Paper Mip-Splatting and Honorable Mention pixelSplat both improved 3DGS."
  - term: "world model"
    definition: "In autonomous driving, a generative model that predicts future scenes from current observations. These models usually use diffusion or autoregressive architectures and output multiview video or a 3D scene representation."
    context: "CVPR 2024 featured several world-model papers for autonomous-driving planning, including Drive-WM, GenAD, and DriveWorld."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-2024-cv)

> This is the 2024 computer-vision installment of the [AI Conference Review](/posts/ai/2026-08-23-what-is-ai-top-conference) series (zh-TW only).

Computer-vision research in 2024 had a clear theme: **generative AI expanded from 2D into 3D and video**. After 3D Gaussian Splatting (3DGS) arrived abruptly in late 2023, 3DGS papers flooded both major conferences in 2024. Sora's announcement early in the year pushed video generation into the spotlight, while vision-language models moved from general-purpose systems into medicine, biology, autonomous driving, and other specialized domains. CVPR submissions exceeded 11,500 for the first time, and ECCV received 8,585—both record highs.

## CVPR 2024

**11,532 submissions / 2,719 accepted / 23.6% acceptance**, held in Seattle.

### Best Paper Awards

| Award | Paper | Team | Contribution |
|---|---|---|---|
| Best Paper | Generative Image Dynamics | Zhengqi Li, Richard Tucker, Noah Snavely, Aleksander Holynski (Google Research) | Models natural oscillatory dynamics from a single still image to produce photorealistic looping animations and interactive simulations |
| Best Paper | Rich Human Feedback for Text-to-Image Generation | Youwei Liang et al. (UCSD / Google Research / USC / Cambridge / Brandeis) | The first rich human-feedback dataset for text-to-image generation, used to train a multimodal Transformer to predict and improve generation quality |
| Honorable Mention | EventPS: Real-Time Photometric Stereo Using an Event Camera | Bohan Yu et al. | Real-time photometric stereo reconstruction with an event camera |
| Honorable Mention | pixelSplat: 3D Gaussian Splats from Image Pairs for Scalable Generalizable 3D Reconstruction | David Charatan, Sizhe Li, Andrea Tagliasacchi, Vincent Sitzmann | Predicts 3D Gaussian splats directly from image pairs for scalable, generalizable 3D reconstruction |

### Best Student Paper Awards

| Award | Paper | Team | Contribution |
|---|---|---|---|
| Best Student Paper | Mip-Splatting: Alias-free 3D Gaussian Splatting | Zehao Yu, Anpei Chen, Binbin Huang, Torsten Sattler, Andreas Geiger (Tübingen / ShanghaiTech / CTU Prague) | Introduces a 3D smoothing filter and 2D Mip filter to eliminate 3DGS aliasing across sampling rates |
| Best Student Paper | BioCLIP: A Vision Foundation Model for the Tree of Life | Samuel Stevens et al. (Ohio State / Microsoft Research / UC Irvine / RPI) | A vision foundation model trained on 10 million biological images that substantially outperforms general models on zero-shot and few-shot species classification |
| Student Honorable Mention | SpiderMatch: 3D Shape Matching with Global Optimality and Geometric Consistency | | A globally optimal solution for 3D shape matching |
| Student Honorable Mention | Image Processing GNN: Breaking Rigidity in Super-Resolution | | Uses GNNs to overcome structural constraints in super-resolution |
| Student Honorable Mention | Objects as Volumes: A Stochastic Geometry View of Opaque Solids | | Interprets opaque objects through stochastic geometry |
| Student Honorable Mention | Comparing the Decision-Making Mechanisms by Transformers and CNNs via Explanation Methods | | Compares Transformer and CNN decision mechanisms using interpretability methods |

### Longuet-Higgins Prize (Test of Time)

The prize went to the most enduring CVPR 2014 paper: **Rich Feature Hierarchies for Accurate Object Detection and Semantic Segmentation** (R-CNN), by Ross Girshick, Jeff Donahue, Trevor Darrell, and Jitendra Malik. R-CNN established the deep-learning paradigm for object detection and directly led to Fast R-CNN, Faster R-CNN, and Mask R-CNN. That line remains part of the field's foundational architecture.

### Influential Papers Outside the Awards

**The 3DGS ecosystem.** CVPR 2024 marked the full-scale breakout of 3DGS. Beyond Mip-Splatting and pixelSplat, major work included:

- **4D Gaussian Splatting for Real-Time Dynamic Scene Rendering** (Guanjun Wu et al., HUST / Huawei) extended 3DGS to dynamic scenes. It modeled Gaussian deformation with neural voxel encoding and rendered 800×800 images at 82 FPS.
- **PhysGaussian: Physics-Integrated 3D Gaussians for Inverse Rendering** (UCLA / Zhejiang / Utah) embedded stress, plasticity, elasticity, and other physical simulation directly into 3DGS, avoiding mesh conversion.
- **DrivingGaussian: Composite Gaussian Splatting for Surrounding Dynamic Autonomous Driving Scenes** (Xiaoyu Zhou et al.) applied 3DGS to dynamic reconstruction of autonomous-driving environments.

**Video generation and world models.** OpenAI released its Sora technical report in February 2024. Sora was not itself a conference paper, but it accelerated the broader video-generation field:

- **GenAD: Generalized Predictive Model for Autonomous Driving** (Jiazhi Yang et al., OpenDriveLab / HKU / Tübingen) was the first large-scale video-prediction model for autonomous driving. Trained on more than 2,000 hours of driving video, it could generalize zero-shot to unseen driving datasets.
- **Drive-WM: Driving into the Future** (Yuqi Wang et al.) introduced the first driving world model compatible with existing end-to-end planning systems, generating multiple possible futures under different driving actions.

**Multimodal understanding.**

- **MMMU: A Massive Multi-discipline Multimodal Understanding and Reasoning Benchmark for Expert AGI** (Xiang Yue et al.) introduced a cross-disciplinary multimodal benchmark and ranked near the top of Paper Digest's influence list.

## ECCV 2024

**8,585 submissions / 2,387 accepted / 27.8% acceptance**, held in Milan. It was the largest submission pool in ECCV history.

### Best Paper Award

**Minimalist Vision with Freeform Pixels** — Jeremy Klotz, Shree K. Nayar (Columbia University)

This was an unconventional Best Paper. In a year when most of computer vision was chasing large models and generative AI, ECCV gave its top award to work that returned to the basic physics of optics. The paper explored how free-form sensor pixels, rather than a conventional rectangular grid, could produce more efficient vision systems. Shree Nayar is one of Columbia's pioneers in computational photography, and this work continued his long-standing focus on hardware-algorithm co-design.

### Best Paper Honorable Mentions

| Paper | Team | Contribution |
|---|---|---|
| Rasterized Edge Gradients: Handling Discontinuities Differentially | Stanislav Pidhorskyi, Tomas Simon, Gabriel Schwartz, He Wen, Yaser Sheikh, Jason Saragih (Meta) | Addresses gradient computation at edge discontinuities in differentiable rendering |
| Concept Arithmetics for Circumventing Concept Inhibition in Diffusion Models | Vitali Petsiuk, Kate Saenko (Boston University) | Uses concept arithmetic to bypass concept-inhibition mechanisms in diffusion models, exposing weaknesses in safety safeguards |

### Best Paper Candidates Worth Watching

ECCV published its full Best Paper Candidate list. Several entries stand out:

- **Sapiens: Foundation for Human Vision Models** (Rawal Khirodkar et al., Meta Codec Avatars Lab) introduced foundation models pretrained on 300 million human images. The family covered 2D pose estimation, body-part segmentation, depth estimation, and surface-normal prediction, with models from 0.3B to 2B parameters substantially outperforming prior methods. On Humans-5K, it exceeded the previous state of the art by 7.6 mAP, demonstrating the power of large-scale, domain-specific pretraining.
- **PointLLM: Empowering Large Language Models to Understand Point Clouds** (Runsen Xu et al., CUHK / OpenRobotLab) was the first system to let an LLM understand 3D point clouds. Its point-cloud/text instruction dataset contained 730,000 examples; in human evaluation, its object descriptions beat human annotations on more than 50% of samples. Every reviewer rated it "strong accept."
- **PathMMU: A Massive Multimodal Expert-Level Benchmark for Understanding and Reasoning in Pathology** (Yuxuan Sun et al.) introduced a large-scale multimodal benchmark for pathology.
- **SEA-RAFT: Simple, Efficient, Accurate RAFT for Optical Flow** simplified and improved the classic RAFT optical-flow method.

### Koenderink Prize (Test of Time)

The 2024 prize went jointly to two ECCV 2014 papers:

- **LSD-SLAM: Large-Scale Direct Monocular SLAM** (Jakob Engel, Thomas Schöps, Daniel Cremers, TU Munich) pioneered direct monocular SLAM without keypoints and remains an important baseline in visual localization.
- **Microsoft COCO: Common Objects in Context** (Tsung-Yi Lin et al.) became the standard benchmark for object detection, instance segmentation, keypoint detection, and related tasks. With more than ten thousand citations, it is an infrastructure-level contribution to the field.

## Four Major Computer-Vision Trends in 2024

### 1. 3DGS Took Over 3D Reconstruction

After Kerbl et al. published the original 3D Gaussian Splatting paper in late 2023, both 2024 conferences filled with follow-up work. The number of 3DGS papers at CVPR jumped from zero in 2023—the original appeared at SIGGRAPH 2023, too late for the CVPR 2024 deadline—to dozens. Best Student Paper Mip-Splatting, Honorable Mention pixelSplat, and many oral and spotlight papers all improved or applied 3DGS.

Compared with NeRF, 3DGS offered:

- **Real-time rendering:** the original 3DGS already achieved more than 30 FPS, with later versions running faster.
- **Explicit representation:** each Gaussian is an editable geometric element, making editing, physical simulation, and dynamic modeling easier.
- **Training efficiency:** minutes of training instead of hours for NeRF.

Extensions in 2024 covered 4D dynamic scenes (4D-GS), physics integration (PhysGaussian), autonomous-driving reconstruction (DrivingGaussian), direct prediction from image pairs (pixelSplat), and anti-aliasing (Mip-Splatting). NeRF did not disappear, but 3DGS became the default starting point for new work.

### 2. Video Generation Moved from Research Toward Products

Sora's announcement in early 2024 marked a dividing line. Although Sora was not a conference paper, it demonstrated that large-scale video generation was feasible and accelerated the field. Both CVPR Best Papers—Generative Image Dynamics and Rich Human Feedback for Text-to-Image Generation—were directly related to generative vision.

Autonomous-driving researchers embraced video generation particularly aggressively. GenAD, Drive-WM, Panacea, DriveWorld, and other papers used diffusion models to generate multiview driving video, both as data augmentation and as world models for planning. "Using generative models to understand the world" moved from LeCun's conceptual proposal to a measurable research program.

### 3. Vision-Language Models Entered Specialized Domains

Vision-language models in 2024 were no longer limited to general image-text alignment. They moved deeply into particular fields:

- **Biology:** BioCLIP, a CVPR Best Student Paper, trained on 10 million biological images for species identification.
- **Pathology:** ECCV Best Paper Candidate PathMMU evaluated multimodal reasoning over pathology slides.
- **Human understanding:** ECCV Best Paper Candidate Sapiens used dedicated pretraining on 300 million human images.
- **3D understanding:** ECCV Best Paper Candidate PointLLM enabled LLMs to understand 3D point clouds.
- **Autonomous driving:** many papers used MLLMs for driving-scene understanding and instruction following.

This reflected a wider trend: marginal gains from general foundation models were shrinking, while domain-specific pretraining or fine-tuning on high-quality specialist data could still deliver large performance improvements.

### 4. Autonomous-Driving Perception Reached a Peak

CVPR 2024 had the highest density of autonomous-driving papers yet. Beyond video generation and world models, the conference featured substantial high-quality work on bird's-eye-view perception, end-to-end driving, and multimodal driving understanding. The demand came directly from industry: Tesla FSD, Waymo, and numerous Chinese autonomous-driving companies were investing heavily, and academic work accelerated with the industry's pace.

## Compared with 2023

| Dimension | 2023 | 2024 |
|---|---|---|
| Mainstream 3D reconstruction | NeRF remained dominant; 3DGS had just appeared | 3DGS took over; NeRF moved to the margins |
| Video generation | Academic exploration; LDM-to-video work was just beginning | Sora triggered a productization wave; autonomous-driving world models surged |
| Vision-language | General CLIP-style models dominated | Domain-specific models for biology, medicine, humans, and 3D |
| Autonomous driving | Primarily BEV perception and planning | Added world models, video generation, and MLLMs |
| Best Paper profile | Visual Programming without training; planning-oriented autonomous driving | Generative dynamics and rich human feedback |

## Looking Back: Which 2024 Papers Had the Deepest Impact?

1. **The 3D Gaussian Splatting ecosystem.** Mip-Splatting, pixelSplat, 4D-GS, and related work established 3DGS as a standard 3D representation. Much subsequent work in 3D generation, editing, and simulation built on it.
2. **Sapiens** (Meta) showed the overwhelming advantage of domain-specific large-scale pretraining over general pretraining plus fine-tuning for human-understanding tasks. It influenced the design of later specialist foundation models.
3. **Autonomous-driving world models** (GenAD and Drive-WM) demonstrated the viability of generative-model-based planning in 2024, later encouraging NVIDIA, Wayve, and others to add world models to product roadmaps.
4. **Rich Human Feedback for T2I** provided the first systematic human-feedback framework for text-to-image generation, supplying a foundational dataset and methodology for later RLHF- and DPO-based improvements to visual generators.
5. **Microsoft COCO receiving the Koenderink Prize** reminded the community that a dataset from a decade earlier remained one of its most important pieces of infrastructure. Good benchmarks often outlive good models.

---

## References

- [CVPR 2024 Best Paper Award Winners (official)](https://cvpr.thecvf.com/Conferences/2024/News/Awards)
- [CVPR 2024 Best Paper Award Winners (IEEE Computer Society)](https://www.computer.org/press-room/cvpr-2024-announces-best-paper-award-winners)
- [ECCV 2024 Awards (official)](https://eccv.ecva.net/Conferences/2024/Awards)
- [ECCV 2024 Awards Detail (virtual venue)](https://eccv2024.ecva.net/virtual/2024/awards_detail)
- [Columbia University — Outstanding Research and Best Paper Honors at ECCV 2024](https://www.cs.columbia.edu/2024/outstanding-research-and-best-paper-honors-at-eccv-2024/)
- [Computer Vision Awards — Best Paper / Longuet-Higgins Prize winners](https://www.thecvf.com/?page_id=413)
- [ECCV Paper Awards — Koenderink Prize winners (IEEE TCPAMI)](https://tc.computer.org/tcpami/awards/eccv-paper-awards/)
- [Longuet-Higgins Prize winners (IEEE TCPAMI)](https://tc.computer.org/tcpami/awards/longuet-higgins-prize/)
- [CVPR 2024 Breaks Paper and Attendance Records](https://cvpr.thecvf.com/Conferences/2024/News/Wrap_Release)
- [Springer — Computer Vision ECCV 2024 Proceedings](https://link.springer.com/book/10.1007/978-3-031-72855-6)
- [SarahRastegar/Best-Papers-Top-Venues](https://github.com/SarahRastegar/Best-Papers-Top-Venues)
- [52CV/CVPR-2024-Papers](https://github.com/52CV/CVPR-2024-Papers)
- [4 Key Trends in CVPR 2024 (VESSL AI)](https://vessl.ai/en/blog/cvpr2024)
- [Paper Digest — Most Influential CVPR Papers (2024-09)](https://www.paperdigest.org/2024/09/most-influential-cvpr-papers-2024-09)
- [Recent advances in 3D Gaussian splatting (Computational Visual Media, Springer)](https://link.springer.com/article/10.1007/s41095-024-0436-y)
