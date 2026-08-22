---
title: "CMU 07-280 Lecture 15: Separating Pretraining, Transfer Learning, and Fine-Tuning"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, transfer-learning, fine-tuning, representation-learning]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 15
type: deep-dive
tldr: "Lecture 15 splits a pretrained model into representation g and task head h: freeze g and train only the head, or fine-tune some or all parameters at a smaller learning rate depending on data volume and source-target distance."
description: "A reading of CMU 07-280 Spring 2026 Lecture 15: representation learning, pretraining, frozen features, fine-tuning, and foundation models."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-15-transfer-learning)

Lecture 15, **Pre-training/Transfer Learning/Fine-tuning**, took place on March 12, 2026. Lecture 14 explained how CNNs learn visual features. This lecture asks which capabilities to preserve and which parameters to relearn when a new task has less data. There is no public lecture-by-lecture recording; this article uses the public lecture note and HW8.

## Official material and scope

The primary sources are the [Transfer Learning lecture note](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_Transfer_Learning.pdf) and [HW8 written component](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf). The schedule also links a PyTorch Basics tutorial, but this article's core claims do not depend on it. There is no dedicated Spring 2026 recitation; Recitation 8 focuses on CNN shapes and parameters.

## The inherited problem: why not restart for every new task?

The official material compares two face-classification tasks. Task A has abundant data; Task B has little data but similar input structure. Training B from scratch repays the cost of learning edges, shapes, and higher-level features. Transfer learning bets that part of A's representation remains useful for B.

Split the model as

```text
x → g(x) → h(g(x)) → output
```

`g:X→Rᵈ` is the backbone or representation and `h` is the new task head. If `g` makes Task B nearly linearly separable, `h` can be a small linear classifier.

## Complete conceptual path: pretraining, feature extraction, and fine-tuning

The terms occupy different stages:

- **Pretraining** learns a broad representation from large data and a proxy task for later adaptation.
- **Frozen feature extraction** fixes `g` and trains only `h`. It reduces compute and overfitting freedom but cannot adapt the representation to a new domain.
- **Fine-tuning** continues backpropagation on Task B and updates some or all pretrained parameters, usually with a smaller learning rate to avoid rapidly destroying prior capability.

The lecture uses masked-image prediction as self-supervised pretraining. Pixels are hidden computationally, and the original image supplies the target without human labels. The proxy task need not be a product goal; it forces `g` to learn transferable structure. A foundation model is pretrained on a broad corpus so that it can be adapted across many downstream tasks.

Freezing is not a doctrine. With very little data and similar source and target domains, it is a robust starting point. More data or a larger domain gap can justify progressive unfreezing. Updating every layer at a large learning rate risks catastrophic forgetting; never updating the backbone risks representation mismatch.

## Reproducible mini-example: trainable parameters under two strategies

Suppose a pretrained backbone has 1,000,000 parameters and outputs a 1,000-dimensional vector. A five-class linear head has

```text
1,000×5 + 5 = 5,005 parameters
```

The frozen strategy trains 5,005 values; full fine-tuning trains 1,005,005. Forward cost may be similar, but backward memory and adjustable freedom differ sharply. Compare them with fixed splits and metrics while recording both validation gaps and training cost.

## Recitation and homework connection

HW8 is the lecture's complete practical counterpart. Students first train AlexNet from scratch on two ImageNet-subset sizes and inspect overfitting. They compare parameter and layer counts across AlexNet and MobileNet, run frozen and unfrozen fine-tuning, and finally move pretrained frozen models to an ASL task.

The design does not permit memorizing “pretraining is better.” Model choice must use loss, accuracy, train-validation gaps, and suspicious curves. The complete notebooks and autograder are not all anonymously available, so self-learners can rebuild a reduced experiment but should not claim to have reproduced the enrolled assignment exactly.

## Extension: linear probe, partial unfreezing, and full fine-tuning

Training only a head is often called linear probing and tests whether the representation already contains useful task information. If a probe works well, full fine-tuning may be unnecessary. If it fails, unfreeze the last block, then more blocks, and finally the whole network. Staged unfreezing turns one large decision into an observable sequence.

Lecture 16 moves from architecture back to probabilistic assumptions. Cross-entropy and squared error are not merely conventions; maximum likelihood derives them from different data-generation models.

## What to do tonight

Choose a small pretrained vision model and a two-class dataset. First freeze the backbone and train a linear head. Then unfreeze only the final block with the same split and epochs. Record trainable parameters, best validation accuracy, train-validation gap, and time per epoch rather than comparing only final accuracy.

## References

- [CMU 07-280 Transfer Learning lecture note](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_Transfer_Learning.pdf)
- [HW8: AlexNet, MobileNet, and transfer-learning experiments](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf)
- [CMU 07-280 Computer Vision lecture note](https://www.cs.cmu.edu/~07280/lectures/07280_Computer_Vision.pdf)
