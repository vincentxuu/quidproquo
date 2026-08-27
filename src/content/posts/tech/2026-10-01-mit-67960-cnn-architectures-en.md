---
title: "MIT 6.7960 L05: CNN Architectures — From Convolution Kernels to Translation Equivariance"
date: 2026-10-01
category: tech
type: deep-dive
tags: [mit-67960, deep-learning, pytorch, cnn, convolution, translation-equivariance, pooling]
lang: en
series:
  name: "MIT 6.7960 Fall 2024 OCW Guide"
  order: 7
additionalSeries:
  - "Global AI/CS Course Map"
tldr: "Lec 4 core: why CNN is the natural choice for grid data — convolution, translation equivariance, pooling, and classic architectures in one go"
description: "MIT 6.7960 Fall 2024 OCW Lecture 4: Architectures: Grids. Deep dive into why CNNs suit image data, covering convolution operations, translation equivariance, pooling layers, receptive fields, classic architecture evolution, with runnable PyTorch implementation examples."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-10-01-mit-67960-cnn-architectures)

[MIT 6.7960 Fall 2024 OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) Lecture 4 [Architectures: Grids](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec04_mp4/) (YouTube: `bxVkZ4M-hIE`) is taught by Phillip Isola. This lecture starts from "why MLPs fail on images" and derives CNN's three design principles: **local connectivity**, **weight sharing**, and **translation equivariance**. Paired with [Vision Book Ch.24](https://visionbook.mit.edu/convolutional_neural_nets.html) as required reading, this article restructures the lecture highlights into a practical CNN design framework with runnable PyTorch code.

## Why MLPs Fail on Images

| Problem | MLP Behavior | CNN Solution |
|---|---|---|
| **Parameter explosion** | 1000×1000 input → 1M params, FC layer params grow quadratically | 3×3×C_in×C_out kernel, params independent of input size |
| **Spatial structure lost** | `flatten()` turns 2D to 1D, neighborhood relations destroyed | Convolution preserves 2D topology, neighboring pixels jointly determine output |
| **Translation non-equivariance** | Shift image by few pixels → completely different MLP output | **Translation equivariance**: input shift → feature map shifts synchronously |

**Key insight**: Isola emphasizes in the lecture that CNN is not an invented trick but a **mathematical necessity for grid data** — when data has translation symmetry, weight sharing is the only linear operator satisfying equivariance (per group representation theory).

## Convolution Operation: Core Mathematical Mechanism

### Discrete Convolution Definition

For input `x ∈ ℝ^(H×W×C_in)`, kernel `w ∈ ℝ^(k×k×C_in×C_out)`:

```
y[i, j, c_out] = Σ_u Σ_v Σ_c_in  x[i+u, j+v, c_in] × w[u, v, c_in, c_out] + b[c_out]
```

where `u, v ∈ [-k//2, k//2]` (center-origin).

### Key Hyperparameters Reference

| Parameter | Symbol | Typical Values | Output Size Effect |
|---|---|---|---|
| **Kernel size** | k | 3, 5, 7 | Larger kernel = larger receptive field |
| **Stride** | s | 1, 2 | `H_out = ⌊(H_in + 2p - k)/s⌋ + 1` |
| **Padding** | p | 0, 1, k//2 | `p=k//2` → `H_out = H_in` (same padding) |
| **Dilation** | d | 1, 2 | `k_eff = k + (k-1)(d-1)`, dilated convolution |

### PyTorch Convolution Size Calculator

```python
"""Convolution output size calculation and verification"""
import torch
import torch.nn as nn

def conv_output_size(H_in, k=3, s=1, p=1, d=1):
    """Calculate output H/W"""
    return (H_in + 2*p - d*(k-1) - 1) // s + 1

# Common config verification
configs = [
    (224, 3, 1, 1, 1),  # ResNet stem: 224→224
    (224, 7, 2, 3, 1),  # ResNet stem: 224→112
    (32, 3, 1, 1, 1),   # CIFAR: 32→32
    (32, 3, 2, 1, 1),   # Downsampling: 32→16
]
for H, k, s, p, d in configs:
    print(f"H_in={H}, k={k}, s={s}, p={p}, d={d} → H_out={conv_output_size(H,k,s,p,d)}")

# Actual run verification
x = torch.randn(1, 3, 224, 224)
conv = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
print(f"Actual output: {conv(x).shape}")  # torch.Size([1, 64, 112, 112])
```

## Translation Equivariance: CNN's Mathematical Foundation

### Definition

Let translation operator `T_Δ` shift input by `Δ=(Δ_h, Δ_w)`. A CNN layer `f` satisfies **translation equivariance** iff:

```
f(T_Δ x) = T_Δ f(x)
```

That is: **translate then convolve = convolve then translate**.

### Why FC Layers Fail

MLP weight matrix `W ∈ ℝ^(HW×C_out)` has independent weights per input position; shifting input produces completely different weighted sums.

### Why Convolution Succeeds

Convolution kernel `w` shares weights across spatial dimensions; shifting input only changes summation indices, kernel itself unchanged.

```python
"""Verify translation equivariance"""
import torch
import torch.nn as nn
import torch.nn.functional as F

def translate(x, dh, dw):
    """Circular shift (demo)"""
    return torch.roll(x, shifts=(dh, dw), dims=(-2, -1))

torch.manual_seed(42)
x = torch.randn(1, 3, 32, 32)
conv = nn.Conv2d(3, 16, 3, padding=1, bias=False)

# Translate then convolve
x_translated = translate(x, 2, 3)
out1 = conv(x_translated)

# Convolve then translate
out2 = translate(conv(x), 2, 3)

print(f"Equivariance error: {(out1 - out2).abs().max().item():.2e}")  # ~1e-7 (numerical)
```

## Pooling: Downsampling and Invariance

| Pooling Type | Formula | Properties | Modern Usage |
|---|---|---|---|
| **MaxPool** | `max(x[i:i+k, j:j+k])` | Keeps strongest activation, strong translation invariance | ResNet, VGG downsampling |
| **AvgPool** | `mean(x[i:i+k, j:j+k])` | Smooth, preserves background info | GlobalAvgPool replaces FC |
| **Strided Conv** | `conv(s=2)` | Learnable downsampling, parameter efficient | Modern archs preferred (ResNet-D, ConvNeXt) |

**Key concept**: MaxPool provides **local translation invariance** — small shifts don't change max position. But excessive pooling loses spatial precision; modern architectures favor **strided conv + minimal pooling**.

## Receptive Field: Theory vs Practice

### Theoretical Receptive Field (RF)

```
RF_0 = 1
RF_l = RF_{l-1} + (k_l - 1) × ∏_{i<l} s_i
```

### Effective Receptive Field (ERF)

In practice gradients concentrate at center with Gaussian distribution. Luo et al. (2016) show: **effective RF is far smaller than theoretical**, growing exponentially with depth.

```python
"""Calculate theoretical receptive field"""
def receptive_field(layers):
    """layers: list of (k, s) tuples"""
    rf = 1
    stride_prod = 1
    for k, s in layers:
        rf = rf + (k - 1) * stride_prod
        stride_prod *= s
    return rf

# ResNet-50 early layers
resnet_stem = [(7, 2), (3, 2)]  # conv1 7×7 s2, maxpool 3×3 s2
resnet_layer1 = [(3, 1)] * 3    # 3×3 s1 × 3
resnet_layer2 = [(3, 2)] + [(3, 1)] * 3  # downsample + 3×3 s1 × 3

print(f"Stem RF: {receptive_field(resnet_stem)}")           # 11
print(f"Layer1 RF: {receptive_field(resnet_stem + resnet_layer1)}")  # 35
print(f"Layer2 RF: {receptive_field(resnet_stem + resnet_layer1 + resnet_layer2)}")  # 99
```

## Classic Architecture Evolution: From LeNet to VGG

| Architecture | Year | Key Innovation | Params | Top-1 Acc (ImageNet) |
|---|---|---|---|---|
| **LeNet-5** | 1998 | Conv+Pool+FC, digit recognition | 60K | N/A |
| **AlexNet** | 2012 | ReLU, Dropout, GPU training, LRN | 60M | 57.1% |
| **VGG-16/19** | 2014 | All 3×3 conv, depth stacking, uniform config | 138M | 71.5% |
| **GoogLeNet** | 2014 | Inception module, 1×1 bottleneck, GlobalAvgPool | 6.8M | 69.8% |

**VGG's core insight**: Two 3×3 convs = one 5×5 conv (same RF), but fewer params (2×3²C² vs 5²C²), more nonlinearities. This established the "small kernel, deep stack" modern paradigm.

## Complete Runnable PyTorch Example: Building CNN from Scratch

```python
"""Complete CNN implementation: Conv → BN → ReLU → Pool → GlobalAvgPool → Head"""
import torch
import torch.nn as nn
import torch.nn.functional as F

class ConvBlock(nn.Module):
    """Standard conv block: Conv → BN → ReLU"""
    def __init__(self, in_ch, out_ch, kernel=3, stride=1, padding=1):
        super().__init__()
        self.conv = nn.Conv2d(in_ch, out_ch, kernel, stride, padding, bias=False)
        self.bn = nn.BatchNorm2d(out_ch)
    
    def forward(self, x):
        return F.relu(self.bn(self.conv(x)))

class SimpleCNN(nn.Module):
    """CIFAR-10 level simple CNN"""
    def __init__(self, num_classes=10):
        super().__init__()
        self.stem = nn.Sequential(
            ConvBlock(3, 32),           # 32×32
            ConvBlock(32, 64),          # 32×32
            nn.MaxPool2d(2),            # 16×16
            ConvBlock(64, 128),         # 16×16
            ConvBlock(128, 128),        # 16×16
            nn.MaxPool2d(2),            # 8×8
            ConvBlock(128, 256),        # 8×8
            ConvBlock(256, 256),        # 8×8
            nn.AdaptiveAvgPool2d(1),    # 1×1 (GlobalAvgPool)
        )
        self.head = nn.Linear(256, num_classes)
    
    def forward(self, x):
        x = self.stem(x)
        x = x.view(x.size(0), -1)
        return self.head(x)

# Verify
model = SimpleCNN()
x = torch.randn(2, 3, 32, 32)
out = model(x)
print(f"Output shape: {out.shape}")  # torch.Size([2, 10])
print(f"Params: {sum(p.numel() for p in model.parameters())/1e6:.2f}M")

# Empirical receptive field
def compute_rf(model, input_size=32):
    x = torch.randn(1, 3, input_size, input_size, requires_grad=True)
    out = model(x)
    out[0, 0].backward()
    grad_map = x.grad.abs().sum(dim=1).squeeze()  # [H, W]
    rf_pixels = (grad_map > grad_map.max() * 0.01).sum().item()
    return rf_pixels

print(f"Empirical RF pixels: {compute_rf(model)}")
```

## Common Pitfalls & Avoidance Guide

| Symptom | Likely Cause | Fix |
|---|---|---|
| Output size mismatch | Padding/stride miscalculated | Use `conv_output_size()` verification, or `nn.LazyConv2d` auto-inference |
| Training diverges, loss oscillates | LR too large, no BN | Add `BatchNorm2d`, LR ÷ 10, use `AdamW` |
| OOM (out of memory) | Batch too large, feature maps too big | Reduce batch size, use `grad_checkpoint`, replace pooling with strided conv |
| Val accuracy plateaus | Insufficient capacity, over-regularization | Widen channels, reduce dropout, check data augmentation |
| Slow inference | Large kernels, no grouped conv | Use depthwise separable conv, `torch.compile()`, ONNX export |

## Video Timestamps

- 0:00–12:00 MLP failure modes on images, parameter explosion
- 12:00–28:00 Convolution derivation, weight sharing, translation equivariance proof
- 28:00–40:00 Pooling layers, receptive field calculation, dilated convolution
- 40:00–55:00 Classic architecture evolution: LeNet → AlexNet → VGG → GoogLeNet
- 55:00–1:10:00 Modern CNN design principles, implementation details

## References

- [MIT 6.7960 Fall 2024 Lec 04: Architectures: Grids](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec04_mp4/) — Official video (YouTube: `bxVkZ4M-hIE`)
- [Lecture 4 Slides (PDF)](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec4_pdf/) — Isola lecture slides
- [Foundations of Computer Vision, Ch.24: Convolutional Neural Nets](https://visionbook.mit.edu/convolutional_neural_nets.html) — Required textbook chapter
- [Understanding the Effective Receptive Field in Deep CNNs (Luo et al., 2016)](https://arxiv.org/abs/1701.04128) — Effective receptive field analysis
- [Very Deep Convolutional Networks (VGG, arXiv:1409.1556)](https://arxiv.org/abs/1409.1556) — Simonyan & Zisserman
- [Going Deeper with Convolutions (GoogLeNet, arXiv:1409.4842)](https://arxiv.org/abs/1409.4842) — Szegedy et al.
- [PyTorch Conv2d Official Docs](https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html) — API reference
- On this site: [MIT 6.7960 L04: Regularization in Practice](/posts/tech/2026-09-17-mit-67960-regularization-en) — BN, Dropout regularization details