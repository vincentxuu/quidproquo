---
title: "MIT 6.7960 L01: Course Introduction — A Map of Deep Learning, Why Depth Works, and Your First Training Loop"
date: 2026-08-30
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - course-overview
  - introduction
  - pytorch
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW, Lecture 1: why deep learning exploded after the 2010s, what this course covers (architectures, training, generative, transfer, scaling, LLMs), how to use the OCW resources, and a ~30-line PyTorch training loop to verify your environment works."
tldr: "Lecture 1 is the 6.7960 opener: deep learning took off because data + compute + algorithms matured together; the course threads from architectures (CNN/GNN/Transformer) through training, representation, generation, transfer, scaling, and LLMs; ends with a ~30-line PyTorch training loop to confirm your environment works."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 2
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 28
---

> 🌏 [中文版](/posts/tech/2027-01-07-mit-67960-l01-introduction)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Source**: based on **MIT 6.7960 Fall 2024 OCW** (corresponds to OCW Lec 01). Videos, slides, and assignments are all open on [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is the course introduction, taught by Sara Beery according to the OCW video description.

---

## Course video sources
Rechecked against the live MIT OCW Fall 2024 gallery on 2026-10-10: the lecture number matches and the video is public and embeddable. Lecture numbering and topics follow OCW.

```youtube
url: https://www.youtube.com/watch?v=6FkRvTtUc-o
title: MIT 6.7960 Fall 2024 — Lec 01. Introduction to Deep Learning
```

Original videos: [MIT 6.7960 Fall 2024 — Lec 01. Introduction to Deep Learning](https://www.youtube.com/watch?v=6FkRvTtUc-o)

Course and recording entries:

- [MIT OCW — Lec 01. Introduction to Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec01_mp4/)
- [MIT 6.7960 Fall 2024 — official lecture video gallery](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): read the Lec 01 transcript (Sara Beery, 1:00:51): the video is a course introduction covering the rise and history of deep learning (AlexNet and GPUs at about 30%), course rules and assignment policy (about 15%–25%), neural-network / MLP basics and optimization (about 40%–80%), and tensor and PyTorch concepts (about 13%–15% and 90%); the transcript has no line-by-line training-loop demo, and the old claims that "Lecture 1 is the only one with no math, no architecture" and that the "instructor team takes turns" did not hold and were rewritten.

## 1. Why deep learning exploded after the 2010s

LeCun, Bengio, and Hinton's 2015 *Nature* survey makes the case clearly: **three forces matured at the same time.**

1. **Data** — ImageNet (2009) made 1M labeled images a public resource; web-crawl text reached the TB scale by the mid-late 2010s; YouTube and Wikipedia became free unlabeled corpora.
2. **Compute** — NVIDIA CUDA (2007) made GPUs general-purpose; AlexNet (2012) trained for days on two GTX 580s; today a single H100 trains overnight what was a dream back then.
3. **Algorithms** — ReLU solved vanishing gradients in deep nets; BatchNorm stabilized deep training; ResNet (2015) made "going deeper" actually work; Attention/Transformer (2017) jumped sequence models a generation.

Any one alone is not enough. All three at once is what took deep learning from the lab to industry.

## 2. The course map

6.7960 starts from "why deep" (L03) and threads:

- **Architectures**: CNN / GNN (L05) / Transformer (L08) — networks for different data structures.
- **Training**: SGD / Adam / regularization / inductive biases (theory in L13).
- **Representation learning**: reconstruction / contrastive / theory (L11–L13).
- **Generative models**: likelihood, GAN, VAE (L14–L16), diffusion and text-to-image.
- **Transfer and generalization**: OOD (L17), transfer learning (L18–L19).
- **Scale**: scaling laws (L20) → LLMs (L21).
- **Deployment**: geometric deep learning (L23), inference optimization (L24).

This lecture is the course introduction: the video itself covers opening motivation and history, course rules and assignment policy, and basic ideas of neural networks / MLPs and training; the course map above and the training loop below are this site's supplement, not segment-by-segment video content.

## 3. Why "deep"

A full lecture later (L03 Approximation Theory) rigorously proves: **depth gives exponential width savings on compositional functions.** Here is the intuition: many functions (e.g. "is there a cat in this image") are inherently hierarchical (edges → textures → parts → objects), and deep nets' hierarchical representations match that exactly; a shallow net, no matter how wide, can't learn it.

This is also why "going deeper" recurs throughout the course.

## 4. How to use the course resources

- **OCW**: all lecture videos, slides, and 3 problem sets (PS1–PS3) are public, no registration. Fall 2024 is the first complete OCW version.
- **Recommended reading**:
  - Goodfellow, Bengio, Courville *Deep Learning* (free online) — textbook-level "map."
  - Murphy *Probabilistic Machine Learning* — deep learning through a probabilistic lens.
  - Bernstein's *Deep Learning Theory Notes* (OCW readings page) — leans theoretical, but clearly written.
- **Problem sets**: PS1 hand-derive MLP backprop, PS2 implement CNN, PS3 sequence/attention. Not graded but strongly recommended.

## 5. The first training loop

Whether or not you know PyTorch, these ~30 lines are the minimum "environment works" test:

```python
import torch, torch.nn as nn, torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

tf = transforms.Compose([transforms.ToTensor(), transforms.Lambda(lambda x: x.view(-1))])
train = DataLoader(datasets.MNIST('.', download=True, train=True, transform=tf),
                   batch_size=64, shuffle=True)
model = nn.Sequential(nn.Linear(784, 128), nn.ReLU(), nn.Linear(128, 10))
opt = optim.Adam(model.parameters(), lr=1e-3)
loss_fn = nn.CrossEntropyLoss()
for epoch in range(1):
    for x, y in train:
        opt.zero_grad(); loss_fn(model(x), y).backward(); opt.step()
print("env OK, params:", sum(p.numel() for p in model.parameters()))
```

Get something like `env OK, params: 101770` and you know PyTorch + data + GPU/CPU all work. The next 23 lectures are just adding things to this loop.

## 6. How to read this series

If you're just auditing:
- **Engineer**: skim L03 → L07 → L08 → L14 → L20 → L21 → L24, for theory and modern LLM engineering practice.
- **Researcher**: read L03 through L24 in order, and actually do PS1–PS3.
- **Practitioner**: L14–L17 + L18–L19 give you deployment and transfer judgment.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”
- 2026-10-10: Checked the video content against its transcript. Rewrote the unsupported claims "the only lecture with no math or architecture" and "instructor team takes turns", and noted that the course map and training loop are this site's supplement.

## References

- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- LeCun, Bengio & Hinton, *Deep Learning* (Nature, 2015): [nature.com/articles/nature14539](https://www.nature.com/articles/nature14539)
- Goodfellow, Bengio & Courville, *Deep Learning* textbook (free online): [deeplearningbook.org](https://www.deeplearningbook.org/)
- MIT 6.7960 readings page (recommended texts): [OCW readings](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/readings/)
