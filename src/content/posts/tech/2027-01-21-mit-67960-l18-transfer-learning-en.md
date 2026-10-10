---
title: "MIT 6.7960 L18: Transfer Learning — Pretraining, Feature Extraction, and Fine-Tuning Strategies"
date: 2026-08-30
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - transfer-learning
  - pretraining
  - fine-tuning
  - simclr
  - mae
  - self-supervised
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW, Lecture 18: why do features learned via ImageNet or large-scale self-supervised pretraining transfer directly to downstream tasks? The trade-offs between feature extraction vs full fine-tuning vs parameter-efficient fine-tuning (adapter / LoRA), and how SimCLR / MAE changed the game."
tldr: "Transfer learning's core insight is 'features learned on big data are good general-purpose representations': freeze the backbone and train only a linear head when downstream data is tiny; full fine-tune when data is plentiful; reach for LoRA / adapter when compute is tight. SimCLR and MAE removed the need for upstream labels and pushed downstream quality another notch."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 21
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 30
---

> 🌏 [中文版](/posts/tech/2027-01-21-mit-67960-l18-transfer-learning)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Source**: based on **MIT 6.7960 Fall 2024 OCW** (corresponds to OCW Lec 18). Videos, slides, and assignments are all open on [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/).

---

## Course video sources
Rechecked against the live MIT OCW Fall 2024 gallery on 2026-10-10: the lecture number matches and the video is public and embeddable. Lecture numbering and topics follow OCW.

```youtube
url: https://www.youtube.com/watch?v=tNfuZ9Imt3M
title: MIT 6.7960 Fall 2024 — Lec 18. Transfer Learning: Models
```

Original videos: [MIT 6.7960 Fall 2024 — Lec 18. Transfer Learning: Models](https://www.youtube.com/watch?v=tNfuZ9Imt3M)

Course and recording entries:

- [MIT OCW — Lec 18. Transfer Learning: Models](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec18_mp4/)
- [MIT 6.7960 Fall 2024 — official lecture video gallery](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): read the Lec 18 transcript (Sara Beery, 1:25:41): the topic is indeed transfer learning, but the transcript covers pretraining/fine-tuning trade-offs, domain adaptation, distillation, and foundation models with adapters/prompting; LoRA, SimCLR, MAE and the "feature extraction / full fine-tuning / parameter-efficient fine-tuning" split do not appear, so the "Three fine-tuning strategies" section now carries a note marking it as this site's supplement.

## Why transfer works

Empirical observation: a network trained on a big dataset (ImageNet 1.2M, LAION 400M, web-crawl text) learns **generic visual features** (edges, textures, color gradients) in its early layers, and only the last few layers bind to the specific task. Moving those mid-level representations to a small-data task (say a few hundred medical images) usually beats training from scratch.

The intuition: across many data sources, the structure of "good features" is shared — low-level edges/textures early, semantics late. The bigger the pretraining data and the deeper the model, the stronger that sharing.

## Three fine-tuning strategies

> Video note: the Lec 18 transcript covers the trade-offs of pretraining and fine-tuning (about 2%–33%), domain adaptation (about 38%–49%), knowledge distillation (about 42%–62%) and foundation models with adapters / prompting (about 62%–99%); LoRA, SimCLR, MAE and the concrete form of the three strategies below are not in the transcript and are this site's supplement.

### 1. Feature extraction (freeze the backbone)

Freeze the entire backbone, train only a new linear (or shallow) head. Cheapest to train, finishes in minutes. Works best when downstream data is small and the domain is close to pretrain (natural images ↔ natural images).

```python
import torchvision
backbone = torchvision.models.resnet18(weights="IMAGENET1K_V1")
for p in backbone.parameters(): p.requires_grad_(False)
backbone.fc = torch.nn.Linear(backbone.fc.in_features, 10)
opt = torch.optim.Adam(backbone.fc.parameters(), lr=1e-3)
```

### 2. Full fine-tuning

Unfreeze all parameters, used when downstream data is plentiful. The backbone learning rate is usually **1/10 of the head's** (avoid "washing away" the generic features), paired with a cosine LR schedule and early stopping.

Highest-quality ceiling, but most expensive — fine-tuning a 7B LLM one pass can take several GPU-months.

### 3. Parameter-efficient fine-tuning (PEFT)

Train <1% of the parameters, yet approach full fine-tuning quality. Three main tools (LoRA detailed in L19):

- **Adapter**: insert a bottleneck layer into each transformer block (Houlsby 2019).
- **LoRA**: factorize the weight update ΔW as `A·B` low-rank matrices (Hu 2021), freeze the original W.
- **Prefix tuning**: prepend a learnable token to K/V (Lester 2021).

Cost is a bit of extra latency; the win is 10–100x lower training cost and the ability to store a "small adapter" per downstream task.

## Self-supervised pretraining: skip the label cost

ImageNet labeling costs thousands of human hours, and many domains have no labels at all (medical, satellite, scientific imagery). Self-supervised pretraining turns unlabeled data into a training signal via pretext tasks:

- **SimCLR (Chen 2020)**: two augmentations of the same image are positive pairs, different images are negative pairs, pull together / push apart with an InfoNCE loss. Learned representations are close to supervised on ImageNet linear-probe.
- **MAE (He 2022)**: mask 75% of image patches and reconstruct the masked ones from the visible ones. ViT is especially suited to this; downstream detection / segmentation both strong.
- **DINO, CMAE, BYOL**: various self-supervised variants; the common core is letting the model learn the inherent alignment / structure of the data.

Practically, **self-supervised pretraining + downstream fine-tuning** already beats supervised pretraining on many tasks (especially medical and remote sensing).

## Practical workflow

1. **Pick a backbone**: pretraining data domain should be "close or larger" than downstream. For natural images: DINOv2 or ImageNet supervised first; for multimodal: CLIP; for medical / remote sensing: consider domain-specific pretraining.
2. **Decide strategy**: data < 1k → feature extraction; 1k–100k → adapter / LoRA; > 100k → full fine-tuning.
3. **Freeze backbone LR**: during fine-tuning, backbone 1e-5, head 1e-4 — a one-order gap.
4. **Honest evaluation**: check performance on a domain-shifted test set (see L17).

## When transfer fails

- Downstream task is **too far from pretraining** (natural-image pretrain applied to audio).
- Downstream has **enough data to train from scratch** (millions + enough compute) — sometimes pretraining caps the ceiling.
- Pretraining task is **too narrow** (cat-vs-dog only) — transferring to "car model classification" is poor.

## Bridge to L19

L19 goes deeper into the PEFT that L18 left as a preview (LoRA math derivation, prefix tuning details), the foundation-model era and in-context learning, and catastrophic forgetting.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”
- 2026-10-10: Checked the video content against its transcript. Added a note to "Three fine-tuning strategies": LoRA, SimCLR, MAE and that three-way split are not in the video.

## References

- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Chen et al., *A Simple Framework for Contrastive Learning of Visual Representations (SimCLR)* (2020): [arXiv:2002.05709](https://arxiv.org/abs/2002.05709)
- He et al., *Masked Autoencoders Are Scalable Vision Learners (MAE)* (2021): [arXiv:2111.06377](https://arxiv.org/abs/2111.06377)
- He et al., *Momentum Contrast for Unsupervised Visual Representation Learning (MoCo)* (2019): [arXiv:1911.05722](https://arxiv.org/abs/1911.05722)
