---
title: "CMU 07-280 Lecture 14: Encoding Image Structure with Convolutional Networks"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, computer-vision, cnn, alexnet]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 14
type: deep-dive
tldr: "Lecture 14 replaces dense image models with local connectivity and parameter sharing, moving from convolution, stride, padding, and pooling to AlexNet, GPU data parallelism, ResNet skip connections, and BatchNorm."
description: "A reading of CMU 07-280 Spring 2026 Lecture 14: convolution shapes, parameter counts, CNNs, AlexNet, GPUs, ResNet, and BatchNorm."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-14-computer-vision-cnns)

Lecture 14, **Computer Vision**, took place on March 10, 2026. It puts the previous neural-network and backpropagation machinery into images. Instead of treating every pixel as an unrelated feature, one small kernel is reused across locations. No public lecture-by-lecture recording exists; this reading uses the lecture note, CNN pre-reading, Recitation 8, and homework material.

## Official material and scope

The sources are the [Computer Vision lecture note](https://www.cs.cmu.edu/~07280/lectures/07280_Computer_Vision.pdf), [CNN pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_CNNs.pdf), [Recitation 8 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec8_sol.pdf), HW7, and HW8. HW7 diagnoses a single-hidden-layer network; HW8 moves into AlexNet and transfer experiments.

## The inherited problem: what does a fully connected network ignore?

Flattening an `H×W×C` image makes every dense output independently connect to every pixel. It does not use local relations among neighboring pixels, and the same edge appearing elsewhere requires different weights. CNNs introduce local connectivity and parameter sharing.

A two-dimensional convolution slides a kernel across the input:

```text
z[i,j] = Σu Σv x[i+u,j+v] w[u,v]
```

Multiple input channels add another sum, and each output channel owns a set of kernels plus a bias.

## Complete conceptual path: separate output shape from parameter count

For input width `W`, kernel size `K`, padding `P`, and stride `S`, output width is

```text
W' = floor((W + 2P - K)/S + 1)
```

Height follows the same rule. This is activation-map shape, not parameter count. With `C_in` input channels and `C_out` filters, a square-kernel layer has

```text
C_out × (C_in × K × K + 1)
```

parameters. Output positions do not appear because one kernel is shared across all of them. Pooling reduces spatial dimensions without weights; ReLU also has no weights. CNNs repeatedly extract local features through convolution, pooling, and nonlinearities before flattening into fully connected classification layers.

The official material then connects basic CNNs to training advances. AlexNet combined ReLU, GPUs, deeper architecture, augmentation, and dropout. ResNet adds an explicit identity route through skip connections, easing deep-network optimization. BatchNorm normalizes minibatch activations and learns scale and shift, with observed benefits including more stable gradients.

## Reproducible mini-example: shape and parameters in one convolution

Take an RGB input `3×32×32`, 16 filters of size `5×5`, stride one, and padding two:

```text
W' = (32 + 4 - 5)/1 + 1 = 32
output shape = 16×32×32
parameters = 16×(3×5×5 + 1) = 1,216
```

A dense connection from all pixels to only 16 outputs would require `16×(3×32×32+1)=49,168` parameters while discarding the spatial feature map. The contrast makes parameter sharing concrete.

## Recitation and homework connection

Recitation 8 computes every shape in a pipeline from `3×128×128` through pooling, a large `17×17` convolution, another pooling layer, and fully connected layers. Most parameters in that example lie in the dense section, forcing a distinction between a large feature map and a large parameter count.

HW7 establishes training diagnostics through learning rate, hidden width, confusion matrices, and weight visualization. HW8 trains AlexNet from scratch, compares overfitting under different data volumes, and contrasts TorchVision AlexNet with MobileNet. The complete notebook and autograder experience is restricted, but the written prompts preserve the intended experimental judgments.

## Extension: CNN versus ViT

The official note identifies CNNs and Vision Transformers as dominant approaches. CNNs impose locality and shared-kernel priors and are often efficient under limited data; ViTs turn image patches into tokens and use attention for more global interactions, often with more parameters and data. This is the course's broad comparison, not a guarantee across every dataset.

Lecture 15 reuses learned visual representations. With little data for a new task, one need not relearn edges, textures, and shapes from scratch; a pretrained backbone can be frozen or fine-tuned.

## What to do tonight

Hand-compute a valid convolution between a `1×4×4` input and a `2×2` kernel, writing all four products at each position. Then calculate shapes and parameters for `3×64×64 → Conv(32,3×3,pad=1) → MaxPool(2)`. Deliberately multiply parameter count by output positions, then explain why that is wrong.

## References

- [CMU 07-280 Computer Vision lecture note](https://www.cs.cmu.edu/~07280/lectures/07280_Computer_Vision.pdf)
- [Convolutional Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_CNNs.pdf)
- [Recitation 8 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec8_sol.pdf)
- [HW7 written component](https://www.cs.cmu.edu/~07280/assignments/hw7_blank.pdf)
- [HW8: Building AlexNet](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf)
