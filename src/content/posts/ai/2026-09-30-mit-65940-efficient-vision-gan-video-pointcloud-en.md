---
title: "MIT 6.5940 L16–L17 Efficient Vision: What ViTs, GANs, Video, and Point Clouds Each Waste"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, vision-transformer, computer-vision, gan, efficient-ml]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 20
tldr: "Lecture 16 covers ViTs. At high resolution, attention cost grows with the square of the resolution. Window attention (Swin) confines computation to local windows, EfficientViT uses ReLU linear attention to get linear cost and then restores local and multi-scale ability, and SparseViT prunes unimportant windows. Self-supervised learning (contrastive learning, CLIP, MAE) answers the ViT's hunger for labeled data. HART pairs discrete tokens with residual diffusion and reaches several times the throughput of diffusion models. Lecture 17 targets three kinds of redundancy: 2D spatial in GANs (GAN Compression, AnyCost GAN, DiffAugment), temporal in video (TSM, temporal modeling at zero FLOPs), and 3D sparsity in point clouds (PVCNN, SPVCNN, BEVFusion). The Fall 2026 schedule drops Lecture 17."
description: "A combined guide to Lectures 16 (Vision Transformer) and 17 (GAN, Video, and Point Cloud) of MIT 6.5940 EfficientML (Fall 2024): ViT basics, window/linear/sparse attention, EfficientViT, SparseViT, contrastive learning and MAE, VAR and HART; GAN Compression, AnyCost GAN, DiffAugment, TSM, PVCNN, SPVCNN, and BEVFusion. Includes the Fall 2026 schedule change."
draft: false
glossary:
  - term: "linear attention"
    aliases: ["ReLU linear attention"]
    definition: "Replace softmax with a kernel such as ReLU, then use the associativity of matrix multiplication to compute KᵀV (d×d) first and multiply by Q afterward. Attention cost drops from quadratic to linear in the number of tokens. The price: it can't produce sharp attention distributions, so it captures global context well and local detail poorly."
    context: "Lecture 16, pages 29–33; the core operation in EfficientViT."
  - term: "TSM"
    aliases: ["Temporal Shift Module"]
    definition: "Shifts part of a 2D CNN's feature-map channels one step forward or backward along the time axis so neighboring frames exchange information. It gives a 2D CNN temporal modeling with zero extra FLOPs or parameters."
    context: "Lecture 17, pages 61–79. The bi-directional version is for offline video; the uni-directional version (shifting only from past to future) is for live streams."
  - term: "HART"
    aliases: ["Hybrid Autoregressive Transformer"]
    definition: "An autoregressive image generator from Song Han's lab. Its tokenizer decodes both discrete and continuous tokens and splits a continuous token into a discrete token plus a residual. An autoregressive Transformer generates the discrete part, and a small residual diffusion model (an MLP) fills in the residual."
    context: "Lecture 16, pages 65–84. The slides claim 4.5–7.7x the throughput of diffusion models at similar image quality."
  - term: "point-voxel convolution"
    aliases: ["PVConv", "PVCNN"]
    definition: "A two-branch convolution for 3D point clouds. The voxel branch converts points to a regular grid and convolves, handling neighborhood aggregation. The point branch applies an MLP to each point and keeps full resolution. The two are then fused."
    context: "Lecture 17, pages 88–98. SPVConv swaps the voxel branch for sparse convolution."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024.** It is post 20 in the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series and combines Lectures 16 and 17.

**Series**: previous [L15 Long-Context LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm-en) | next [L18 Accelerating Diffusion](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**Official materials**:

- Lecture 16, Vision Transformer (2024-10-31): [Lec16-Vision-Transformers.pdf](https://www.dropbox.com/scl/fi/lr3jlbzoa1du3og22wbiw/Lec16-Vision-Transformers.pdf?rlkey=6ejlatw4kpfzxgxg7zx2a6zo2&st=7btq6r53&dl=0) (85 pages), [recording](https://www.youtube.com/watch?v=v0jYDgaVzlk)
- Lecture 17, GAN, Video, and Point Cloud (2024-11-05): [Lec17-Efficient-GANs-Video-PointCloud.pdf](https://www.dropbox.com/scl/fi/6o45qs8xm20qhzkc192bv/Lec17-Efficient-GANs-Video-PointCloud.pdf?rlkey=71hrp50kjtl8zz8w7jntvbwn0&st=ywq378y5&dl=0) (106 pages), [recording](https://www.youtube.com/watch?v=o_60Yhb79W8)

"L16 page N" and "L17 page N" below refer to page numbers in these two PDFs. Access level **A3**: slides and video are public, and no lab goes with these lectures. Checked on 2026-09-30.

**Fall 2026 comparison**: The [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) keeps "Vision Transformer" (Lecture 16, November 5) but **drops the GAN, Video, and Point Cloud lecture**. Lectures 17 and 18 become Diffusion Model Part I and Part II. As of 2026-09-30 none of these are up yet. For now, the Fall 2024 materials are the only way to study Lecture 17's content.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the lecture numbers and recording links match and the videos are public and embeddable.

```youtube
url: https://www.youtube.com/watch?v=v0jYDgaVzlk
title: EfficientML.ai Lecture 16 - Vision Transformer (MIT 6.5940, Fall 2024)
```

```youtube
url: https://www.youtube.com/watch?v=o_60Yhb79W8
title: EfficientML.ai Lecture 17 - GAN, Video, Point Cloud (MIT 6.5940, Fall 2024)
```

Original videos: [EfficientML.ai Lecture 16 - Vision Transformer (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=v0jYDgaVzlk), [EfficientML.ai Lecture 17 - GAN, Video, Point Cloud (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=o_60Yhb79W8)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

Checked: 2026-10-10.

## Why these two lectures go together

The first fifteen lectures centered on CNN classifiers and LLMs. These two turn to the special structure of vision workloads: high-resolution images, generative models, video, and 3D point clouds. L17 page 2 states the idea plainly: each data type has its own redundancy. GANs have 2D spatial redundancy, video has temporal redundancy, and point clouds have 3D spatial redundancy (and extreme sparsity). Find the redundancy and you know where to save.

| Lecture | Section | Key techniques |
|---|---|---|
| L16 | ViT basics | Patch embedding, data scale vs CNNs |
| L16 | Efficient ViT | Window attention (Swin), linear attention (EfficientViT), sparse attention (SparseViT) |
| L16 | Self-supervised ViT | Contrastive learning, CLIP, MAE |
| L16 | ViT and autoregressive generation | VQ, VAR, HART |
| L17 | Efficient GANs | GAN Compression, AnyCost GAN, DiffAugment |
| L17 | Efficient video understanding | 2D vs 3D CNN trade-offs, TSM |
| L17 | Efficient point clouds | PVCNN, SPVCNN, BEVFusion |

## Lecture 16: Vision Transformer

### ViT basics: how many tokens is an image?

[ViT](https://arxiv.org/abs/2010.11929) cuts an image into patches and treats each patch as a token (L16 pages 4–8). The slide's toy example: a 96×96 image with 32×32 patches gives 3×3=9 tokens. Each token flattens to 3×32×32=3072 dimensions and is projected linearly to the ViT hidden size of 768, so that layer has 3072×768≈2.36M parameters. In practice it's a 32×32 convolution with stride 32.

Pages 10–11 give the ViT paper's classic result. With limited data, ViT loses to CNNs. Only after pretraining on a large dataset does it pull ahead. That result comes back in the self-supervised section.

### Why high resolution is a problem

Dense prediction tasks such as segmentation, super-resolution, and autonomous driving need high resolution; low resolution loses detail and small objects (L16 pages 14–21). The catch: ViT computation **grows with the square of the input resolution** (page 16). Page 17 offers a comparison on Jetson AGX Orin (TensorRT, fp16, batch 1) for Cityscapes segmentation: SegFormer runs at 1.6 FPS with 82.4 mIoU, EfficientViT at 21.8 FPS with 82.7 mIoU.

The three attention variants that follow are three ways to save.

### Window attention: compute only within local windows

[Swin Transformer](https://arxiv.org/abs/2103.14030) (L16 pages 23–26) confines attention to fixed-size local windows (for example 7×7). Each window has a fixed token count, so total cost is linear in image size, and the feature map is downsampled stage by stage. The problem is that windows don't exchange information. The fix is to shift the windows in the next block. Page 27 extends the idea to point clouds: [FlatFormer](https://arxiv.org/abs/2301.08739) handles 99.9%-sparse 3D point clouds with equal-size grouped sparse windows.

### Linear attention: change the multiplication order

**Intuition** (L16 pages 29–30). Softmax attention computes $QK^\top$ first, an n×n matrix, so it costs $O(n^2)$. Replace softmax with ReLU and you can use the associativity of matrix multiplication, $(ab)c = a(bc)$. Compute $K^\top V$ first (only d×d), then multiply by Q. The cost becomes $O(n)$.

**The price** (pages 31–32). There's no free lunch. ReLU linear attention can't produce sharp attention distributions. It captures global context well but local detail poorly, and it lacks multi-scale learning.

**EfficientViT's fix** (page 33). [EfficientViT](https://arxiv.org/abs/2205.14756) does two things. It aggregates nearby tokens with small convolutions to build multi-scale Q/K/V before the linear attention. And it adds depthwise convolution to the FFN to restore local information. Pages 34–39 report results on Cityscapes segmentation, super-resolution (up to 6.4x faster), Segment Anything, and ImageNet classification.

### Sparse attention: not every window is worth computing

[SparseViT](https://arxiv.org/abs/2303.17605) (L16 pages 41–46) asks whether sparse high-resolution input can beat dense low-resolution input. Three steps: prune activations window by window (with non-uniform sparsity across layers), adapt training to the sparsity, and search per-layer sparsity under a resource constraint. Page 46 visualizes the windows kept under different latency budgets (24 ms and 19 ms). It's the same idea as [pruning in L3–L4](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en), applied to activations instead of weights.

### Self-supervised learning: ViTs need big data, and labels are expensive

L16 pages 48–49 tie back to the earlier result. ViTs need large datasets, labeling large datasets is expensive, so train on unlabeled data.

- **Contrastive learning** (pages 51–53): two random views of the same image are positives; views of other images are negatives. The slides cite [Chen et al. (MoCo v3)](https://arxiv.org/abs/2104.02057): training large ViTs directly on small datasets mostly gets worse as the model grows, while self-supervised ViTs get better with size.
- **CLIP** (pages 54–56): [CLIP](https://arxiv.org/abs/2103.00020) runs contrastive learning on large numbers of image-text pairs. At inference it does zero-shot, open-vocabulary classification with no fine-tuning and any number of classes.
- **MAE** (pages 57–61): [MAE](https://arxiv.org/abs/2111.06377) masks random patches and predicts them back, like BERT's masked language model. Two design choices. The encoder-decoder is asymmetric: a heavy encoder processes only the unmasked tokens, and a light decoder processes all of them. The mask ratio is 75%, far above BERT's 15%, because images have lower information density than language. Page 61 shows MAE beating MoCo v3 under both partial and full fine-tuning.

Processing only the unmasked 25% of tokens makes MAE an efficiency design in its own right.

### Autoregressive image generation and HART

The last section of L16 asks: ViTs "see" visual tokens, so can a model also "generate" them?

- **VQ turns images into discrete tokens** (pages 67–68): vector quantization maps each patch to its nearest entry in a codebook. Page 68 points out that VQ generalizes the codebook quantization in [Deep Compression](https://arxiv.org/abs/1510.00149), the same [k-means quantization from L5](/posts/ai/2026-09-30-mit-65940-quantization-basics-en).
- **VAR** (pages 69–70): [VAR](https://arxiv.org/abs/2404.02905) swaps "predict the next token" for "predict the next scale", generating a whole resolution level at a time, which is faster than token by token.
- **The trouble with discrete tokenizers** (pages 71–72): reconstruction quality is poor, and detail blurs at high resolution.

**HART's approach** (pages 73–81). [HART](https://arxiv.org/abs/2410.10812) uses a tokenizer that decodes both discrete and continuous tokens and splits a continuous token into "discrete token + residual token". Generation has two parts:

1. A scalable-resolution autoregressive Transformer generates the discrete tokens (following VAR).
2. A residual diffusion model built from a small MLP fills in the residual tokens.

**Why it's fast** (page 65): diffusion models usually run a full Transformer at the highest resolution for about 20 steps. HART samples in 10–14 steps, and only the last step runs at the highest resolution. Page 82 concludes that HART reaches 4.5–7.7x the throughput of diffusion models at similar quality (1024px), and page 65 shows up to 9.6x at 512px. Page 84 demos it running at interactive speed on a laptop with a 4090 mobile GPU.

## Lecture 17: GANs, video, and point clouds

### Efficient GANs

**Background** (L17 pages 5–11). A GAN trains a generator G against a discriminator D. D is used only in training, so G is what you need to speed up at inference. Page 11's main point: generative models are far more expensive than recognition models.

**GAN Compression** (pages 13–17). [GAN Compression](https://arxiv.org/abs/2003.08936) compresses conditional GANs. It distills a pretrained teacher generator into a "super student" generator (with L2 feature matching), then uses NAS to choose per-layer channel counts, evaluating candidates from a pool and fine-tuning the pick. Pages 15–16 report compression of 11.8x for pix2pix, 21.2x for CycleGAN, and 8.8x for GauGAN. The method connects [NAS from L7–L8](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en) with [distillation from L9](/posts/ai/2026-09-30-mit-65940-knowledge-distillation-en).

**AnyCost GAN** (pages 19–33). **The situation**: when you edit an image with a GAN, every adjustment waits for full generation, which makes interaction hard. **Intuition**: ray tracing gives fast previews by sampling fewer rays. Can a GAN do the same? **Mechanism**: [AnyCost GAN](https://arxiv.org/abs/2103.03243) trains a generator that produces consistent output at different resolutions and channel counts. During editing, a small subnet renders instant previews, and the full model produces the final output. Randomly sampling channel counts during training causes two problems. Subnets produce inconsistent outputs, fixed with a distillation loss. And a single discriminator can't give useful feedback to every sub-generator, fixed with a discriminator conditioned on the generator architecture.

**DiffAugment** (pages 35–45). Now the problem is data. FFHQ has 70,000 curated faces, and collecting and labeling data takes a long time. Page 37 gives StyleGAN2's FID at 100%, 20%, and 10% of the training data: 11.1, 23.1, and 36.0 (lower is better). With less data it gets clearly worse, because the discriminator overfits. Data augmentation is the usual fix for overfitting, but how do you augment a GAN?

| Approach | Problem |
|---|---|
| Augment real images only | Generated images pick up the augmentation artifacts (page 40) |
| Augment real and fake images, but only when updating D | Unbalanced optimization breaks training (page 41) |
| **[DiffAugment](https://arxiv.org/abs/2006.10738)**: augment real and fake images for both D and G updates, with differentiable augmentations | Clear gains with little data; generation works even from 100 images (pages 42–45) |

### Efficient video understanding: TSM

**The 2D vs 3D CNN trade-off** (L17 pages 51–59):

- **2D CNNs**: run sampled frames through a 2D CNN separately and aggregate the scores, or add optical flow in a two-stream setup, or append an LSTM. Pros: cheap, and image models can be reused. Cons: no temporal modeling, optical flow is slower than the network itself, and late fusion misses low-level temporal relationships.
- **3D CNNs** (C3D, I3D): convolve over time as well, modeling space and time jointly. The extra dimension makes models bigger and more expensive. I3D initializes 3D kernels by "inflating" 2D weights, repeating them along the time axis.

Page 59 asks: can we get 3D CNN performance at 2D CNN cost?

**How TSM works** (pages 61–64). [TSM](https://arxiv.org/abs/1811.08383) shifts part of the channels along the time axis. The bi-directional version shifts some channels forward and some backward so neighboring frames exchange information; it's for offline video. The uni-directional version shifts only from past to future and is for live streams. It drops into an off-the-shelf 2D CNN at **zero FLOPs and zero parameters**. Page 64's implementation is a few lines:

```python
# shape of x: [N, T, C, H, W]
out = torch.zeros_like(x)
fold = c // fold_div
out[:, :-1, :fold] = x[:, 1:, :fold]  # shift left
out[:, 1:, fold: 2 * fold] = x[:, :-1, fold: 2 * fold]  # shift right
out[:, :, 2 * fold:] = x[:, :, 2 * fold:]  # not shift
return out
```

**Results** (pages 65–76):

- On Something-Something, TSM uses 3x less computation than the ECO family and 6x less than the Non-local I3D family while performing better.
- On a Tesla P100 at batch 1: I3D takes 164.3 ms per video at 41.6% accuracy; TSM takes 17.4 ms at 43.4%.
- Scaled up on the SUMMIT supercomputer: training an 8-frame ResNet-50 TSM on Kinetics takes 49 hours 50 minutes on 1 node (6 GPUs) and 14 minutes on 256 nodes (1536 GPUs), with accuracy staying around 74%.

### Efficient point clouds: PVCNN, SPVCNN, BEVFusion

**The challenge** (L17 pages 82–86). A point cloud is an unordered set of 3D points (x, y, z plus features). It's extremely sparse (sometimes under 0.1% density) and stored irregularly in memory, so ordinary CNNs can't process it. And models often have to run on resource-limited devices such as self-driving cars and AR headsets.

**PVCNN** (pages 88–93). Both existing approaches have bottlenecks. Voxel methods lose over 40% of the information under 8GB of GPU memory. Point methods do lots of irregular memory access, and page 89 reminds you that off-chip DRAM access costs far more than arithmetic, with random access risking bank conflicts. [PVCNN](https://arxiv.org/abs/1907.03739) uses both. The voxel branch is regular, with no irregular access, which suits neighborhood aggregation. The point branch keeps high resolution and limits the information lost to voxelization. Page 93's indoor segmentation demo: PointNet uses 1.9 GB of memory and 1.9 seconds, PVCNN uses 1.2 GB and 1.0 second.

**SPVCNN** (pages 94–98). [SPVConv](https://arxiv.org/abs/2007.16100) replaces the voxel branch with sparse convolution, so large scenes don't pay the cost of a dense grid. It pairs that with 3D NAS (a super network, evolutionary search, and a latency predictor) to find architectures under a latency target.

**BEVFusion** (pages 100–105). A self-driving car has several cameras (perspective view) and LiDAR (3D view). Fusing them requires a shared space that every sensor can convert into with little loss and that suits different 3D tasks. [BEVFusion](https://arxiv.org/abs/2205.13542) picks bird's-eye view (BEV). Cameras go through a dense branch and LiDAR through a sparse branch; each converts to BEV, the features fuse, and task heads handle detection, map segmentation, and more. Page 105 says it ranked first on the Waymo leaderboard as of November 9, 2022.

## Ideas the two lectures share

Two threads run through both:

- **Find the structural redundancy, then save**: locality in ViTs (window attention), similarity between neighboring video frames (TSM), sparsity in point clouds (SPVConv), and the low information density of image tokens (MAE masks 75%).
- **Earlier techniques get recombined**: SparseViT is pruning, GAN Compression is NAS plus distillation, VQ is k-means quantization, and PVCNN's argument comes back to memory access cost. The F24 course page files these lectures under "Chapter II: Domain-Specific Optimization", which describes exactly this: rebuilding the existing toolkit around the properties of the data.

## How to self-study these lectures

1. The associativity diagram on L16 page 30 is the one slide worth pausing on. Write out the matrix shapes for both multiplication orders of $QK^\top V$ and confirm which one is $O(n)$.
2. Copy the TSM code from L17 page 64 into a notebook, run it on a random `[N, T, C, H, W]` tensor, and print one channel's values along the time axis before and after the shift.
3. One thing you can do tonight: using the method on L16 page 5, count the tokens a patch-16 ViT gets at 224×224 and at 1024×1024 input ((224/16)² and (1024/16)²). Square those counts to estimate how much bigger the attention matrix gets, then compare with the GMACs curve on page 16.

## Further reading

- Same series: [L15 Long-Context LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm-en), [L14 LLM Post-Training](/posts/ai/2026-09-30-mit-65940-llm-post-training-en) (image tokenization in VILA-U), [L18 Accelerating Diffusion](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency-en)
- ViT and self-supervised learning: [CS231N L8: attention, Transformers, and ViT](/posts/ai/2026-09-30-cs231n-attention-transformers-vit-en), [CS231N L12: self-supervised learning](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en)
- GANs: [CS231N L13: autoregressive models, VAEs, and GANs](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en)
- Video and 3D: [CS231N L10: video understanding](/posts/ai/2026-09-30-cs231n-video-understanding-en), [CS231N L15: 3D vision](/posts/ai/2026-09-30-cs231n-3d-vision-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”

## References

- [Lec16-Vision-Transformers.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/lr3jlbzoa1du3og22wbiw/Lec16-Vision-Transformers.pdf?rlkey=6ejlatw4kpfzxgxg7zx2a6zo2&st=7btq6r53&dl=0), [Lecture 16 recording](https://www.youtube.com/watch?v=v0jYDgaVzlk)
- [Lec17-Efficient-GANs-Video-PointCloud.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/6o45qs8xm20qhzkc192bv/Lec17-Efficient-GANs-Video-PointCloud.pdf?rlkey=71hrp50kjtl8zz8w7jntvbwn0&st=ywq378y5&dl=0), [Lecture 17 recording](https://www.youtube.com/watch?v=o_60Yhb79W8)
- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — schedule and dates
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Lecture 16 kept, Lecture 17 replaced by Diffusion Part I
- [Dosovitskiy et al., ViT](https://arxiv.org/abs/2010.11929), [Liu et al., Swin Transformer](https://arxiv.org/abs/2103.14030), [Liu et al., FlatFormer](https://arxiv.org/abs/2301.08739)
- [Cai et al., EfficientViT](https://arxiv.org/abs/2205.14756), [Chen et al., SparseViT](https://arxiv.org/abs/2303.17605)
- [Chen et al., An Empirical Study of Training Self-Supervised ViTs (MoCo v3)](https://arxiv.org/abs/2104.02057), [Radford et al., CLIP](https://arxiv.org/abs/2103.00020), [He et al., MAE](https://arxiv.org/abs/2111.06377)
- [Han et al., Deep Compression](https://arxiv.org/abs/1510.00149), [Tian et al., VAR](https://arxiv.org/abs/2404.02905), [Tang et al., HART](https://arxiv.org/abs/2410.10812)
- [Li et al., GAN Compression](https://arxiv.org/abs/2003.08936), [Lin et al., AnyCost GAN](https://arxiv.org/abs/2103.03243), [Zhao et al., DiffAugment](https://arxiv.org/abs/2006.10738)
- [Lin et al., TSM](https://arxiv.org/abs/1811.08383)
- [Liu et al., PVCNN](https://arxiv.org/abs/1907.03739), [Tang et al., SPVNAS/SPVConv](https://arxiv.org/abs/2007.16100), [Liu et al., BEVFusion](https://arxiv.org/abs/2205.13542)
