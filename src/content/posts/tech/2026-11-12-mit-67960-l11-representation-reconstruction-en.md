---
title: "MIT 6.7960 L11: Representation Learning (Reconstruction-Based) — Autoencoders, VQ, Self-Supervision"
date: 2026-11-12
category: tech
tags:
  - mit-67960
  - deep-learning
  - representation-learning
  - autoencoder
  - self-supervised
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW Lecture 11 (Phillip Isola): what representation learning is, why brains and nets both need good representations, autoencoders and vector quantization (VQ), and the core idea of self-supervised learning with reconstruction losses."
tldr: "Representation learning compresses raw data into a 'useful' vector: autoencoders force a meaningful latent space via reconstruction, VQ discretizes it into a codebook, and self-supervision turns 'mask-and-reconstruct' into free supervision."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 13
additionalSeries:
  - "Global AI/CS Course Map"
---

> 🌏 [中文版](/posts/tech/2026-11-12-mit-67960-l11-representation-reconstruction)

> **Source version**: based on **MIT 6.7960 Fall 2024 OCW**. Videos, slides, and assignments are public at [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Phillip Isola**; the required reading is *Representation Learning*.

---

## What is a "representation" and why it matters

The real product of deep learning is not the final classifier layer but **the vector representation the network compresses the input into**. After a good representation, cats cluster near cats and far from cars in vector space — and every downstream task (classification, retrieval, generation) becomes easier.

This lecture makes a neat point: **the brain does representation learning too**. Visual cortex cells fire selectively for orientation, motion, or objects — that is exactly a learned representation. So we are not after a magic trick, but a computable, trainable definition of a "good representation".

## Autoencoders: squeeze a latent space via reconstruction

The classic framework is the **autoencoder**:

```
input x → Encoder → latent z → Decoder → reconstruction x̂
objective: min ‖x − x̂‖²
```

The encoder compresses `x` into a low-dimensional `z`; the decoder reconstructs from `z`. Because `z` is far smaller than `x`, the network is forced to **drop redundancy and keep only what reconstruction needs** — precisely representation learning.

A minimal PyTorch implementation:

```python
import torch.nn as nn

class Autoencoder(nn.Module):
    def __init__(self, in_dim=784, hidden=256, latent=32):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Flatten(),
            nn.Linear(in_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, latent),
        )
        self.decoder = nn.Sequential(
            nn.Linear(latent, hidden), nn.ReLU(),
            nn.Linear(hidden, in_dim), nn.Sigmoid(),
        )

    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z), z
```

Training only optimizes `‖x − x̂‖²`; `z` naturally grows into a meaningful latent space (though not necessarily "disentangled" — it does capture the dominant variation).

## Vector Quantization (VQ): discretize the representation

A pure continuous `z` has a problem: the latent space can be discontinuous and fragmented. **Vector Quantisation (VQ)** introduces a **codebook** `e_1 … e_K` and replaces `z` with the nearest codebook vector:

```
z_q = argmin_k ‖z − e_k‖   →   use e_k as the discrete representation
```

This turns the representation into **discrete indices** (like tokens of text), which lets you plug straight into a language model for generation and makes the latent space more regular. VQ-VAE pairs this with variational inference; it later evolved into VQ-GAN, SoundStream, and a line of generative models.

## Self-supervision: free supervision from reconstruction

Labels are expensive, but **data has structure on its own**. Self-supervised learning's essence is to design a **pretext task** that generates supervision from inside the data itself. The most common reconstruction-based pretext is **masking**:

- Mask out part of the input (inpainting for images, masked tokens for text, masked segments for speech).
- Force the model to reconstruct the masked part from the rest.

Because the "answer" is hidden in the input, no human labels are needed. BERT's masked language modeling and MAE's (Masked Autoencoder) image reconstruction are both this idea. After training, the *encoder's* representation is often extremely generalizable — the bedrock of today's large-model pretraining.

## Practical caveats

- **Don't make the bottleneck too wide**: if `z` is too large, the autoencoder learns an identity map and the representation degrades into meaningless compression.
- **Match the reconstruction loss to the data type**: MSE for continuous, BCE for binary, CE for discrete — the wrong loss badly hurts latent quality.
- **VQ codebooks collapse easily**: a few codes get overused, most sit idle. Mitigate with a codebook loss plus a usage-frequency regularizer.
- **Mask ratio must be high enough**: mask too little and the model wins by local interpolation, never learning global structure.

## Why this matters in practice

Representation learning bridges supervised learning and generative / foundation models:

- **Few-label classification?** Pretrain a good encoder self-supervised, then fine-tune with few labels.
- **Generation?** Discrete representations (VQ) let you generate images / speech the language-model way.
- **Retrieval / similarity?** A good representation makes "nearest neighbor" meaningful.

Next lecture (L12) shifts from "reconstruction" to "similarity" — contrastive learning pulls same-class representations together and pushes different ones apart.

## References

- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Bengio et al., *Representation Learning: A Review and New Perspectives*: [arXiv:1206.5538](https://arxiv.org/abs/1206.5538)
- Van den Oord et al., *Neural Discrete Representation Learning (VQ-VAE)*: [arXiv:1711.00937](https://arxiv.org/abs/1711.00937)
- Required reading *Representation Learning* (see [OCW readings](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/readings/))
