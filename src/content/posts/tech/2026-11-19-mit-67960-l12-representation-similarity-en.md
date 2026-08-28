---
title: "MIT 6.7960 L12: Representation Learning (Similarity-Based) — Metric Learning, Contrastive, InfoNCE"
date: 2026-11-19
category: tech
tags:
  - mit-67960
  - deep-learning
  - representation-learning
  - contrastive-learning
  - infonce
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW Lecture 12 (Sara Beery): from metric learning to contrastive learning, the information-theoretic intuition of InfoNCE, the alignment and uniformity properties, and how to mine hard negatives."
tldr: "Similarity-based representation learning does not reconstruct input; it directly shapes latent geometry: pull same-class representations together, push different ones apart. InfoNCE turns this into 'spot the positive among negatives', and alignment / uniformity give it interpretable metrics."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 14
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 20
---

> 🌏 [中文版](/posts/tech/2026-11-19-mit-67960-l12-representation-similarity)

> **Source version**: based on **MIT 6.7960 Fall 2024 OCW**. Videos, slides, and assignments are public at [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Sara Beery**; the required reading is the same *Representation Learning* as L11, with optional *Alignment and Uniformity* and contrastive-learning essays.

---

## When reconstruction is not enough: define "similarity" directly

L11's reconstruction learning indirectly squeezes a good representation by "compressing the input back". But often what we care about is simply **how alike two samples are** — search engines, recommendation, face verification are all this need. The more direct route is **similarity-based representation learning**: instead of reconstructing, **sculpt the geometry of the latent space**.

The whole goal in one sentence: **push same-class representations together, different-class representations apart**.

## From metric learning to contrastive learning

Early approaches were **metric learning**: design a loss (e.g., triplet loss) so the anchor–positive distance is smaller than anchor–negative by a margin. The trouble is it looks at one triple at a time (anchor / pos / neg) — low information efficiency.

**Contrastive learning** scales this up: each sample gets one positive (usually an augmented view of the same image) + a set of negatives (other samples in the batch), and the objective is to **pick the positive out of a crowd of negatives**. This is essentially a `K+1`-way classification.

## InfoNCE: casting contrast as classification

InfoNCE is the most common contrastive loss, with a clean information-theoretic reading:

```
L = −log  exp(sim(z_i, z_i⁺) / τ) / Σ_{j=0..K} exp(sim(z_i, z_j) / τ)
```

- `z_i` is the anchor, `z_i⁺` the positive, `z_j` (j≠i) the negatives.
- `sim` is usually cosine similarity; `τ` is temperature, controlling sharpness.
- The denominator includes *all* candidates, forcing the model to find the single correct one among K distractors.

A minimal PyTorch implementation (NT-Xent style):

```python
import torch
import torch.nn.functional as F

def info_nce(z, z_pos, temperature=0.1):
    # z, z_pos: (batch, dim), already L2-normalized
    z = F.normalize(z, dim=-1)
    z_pos = F.normalize(z_pos, dim=-1)
    batch = torch.cat([z, z_pos], dim=0)          # 2N
    sim = torch.matmul(batch, batch.t()) / temperature
    N = z.size(0)
    # positive pairs: i and i+N are mutual positives
    labels = torch.arange(N, device=z.device)
    logits = torch.cat([sim[:N, N:], sim[N:, :N]], dim=1)
    return F.cross_entropy(logits, labels)
```

## Alignment and uniformity: two interpretable properties

Wang & Isola (2020) give two crisp criteria for contrastive representations:

- **Alignment**: positive pairs should be close (small expected distance).
- **Uniformity**: all representations should spread as evenly as possible over the unit hypersphere, not collapse to a point.

These seem contradictory but are complementary: alignment guarantees "same class clusters", uniformity guarantees "different classes have room to separate and no information is lost". A good contrastive representation satisfies both — which also explains many engineering phenomena. If you optimize only alignment (e.g., force positive-pair distance to 0), the model *collapses* into a constant vector; you need the uniformity push to hold it up.

## Hard negatives: make contrast non-trivial

If negatives are sampled randomly from the batch, most are "too easy" (obviously different classes) and the model learns little. **Hard negatives** are samples that are *similar to the anchor but actually different* — they force the model to distinguish fine differences.

Common strategies:

- **In-batch hard negatives**: pick the highest-similarity non-positive within the batch.
- **Precomputed retrieval**: use existing representations to fetch the nearest few as hard negatives.
- **Temperature annealing / loss weighting**: up-weight difficult negatives.

But beware: **too-hard negatives may be false negatives** — e.g., two different photos of the same cat treated as a negative pair, which hurts training. Hard-negative mining therefore needs data quality and a dose of randomness.

## Why this matters in practice

- **The standard recipe for self-supervised pretraining**: SimCLR, MoCo, CLIP are all contrastive variants.
- **Temperature τ matters a lot**: too small over-focuses on hard negatives (collapse-prone); too large weights all negatives equally (learns slowly).
- **Anti-collapse is the #1 challenge**: beyond the uniformity push, there are negative-free solutions like stop-gradient (BYOL) and a predictor (SimSiam).
- **Where positives come from**: usually data augmentation (crop, color jitter, mask); augmentation strength directly sets which invariances are learned.

Next lecture (L13) takes the theoretical view: why the architecture's inductive bias decides what the representation looks like, and the mysterious correspondence between wide nets and Gaussian processes.

## References

- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Oord et al., *Representation Learning with Contrastive Predictive Coding (CPC / InfoNCE)*: [arXiv:1807.03748](https://arxiv.org/abs/1807.03748)
- Chen et al., *SimCLR*: [arXiv:2002.05709](https://arxiv.org/abs/2002.05709)
- Wang & Isola, *Understanding Contrastive Representation Learning via Alignment and Uniformity*: [arXiv:2005.10242](https://arxiv.org/abs/2005.10242)
