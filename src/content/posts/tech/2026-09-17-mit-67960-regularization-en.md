---
title: "MIT 6.7960 L04: Regularization in Practice — Weight Decay, Dropout, Batch Norm & Label Smoothing"
date: 2026-08-30
category: tech
type: deep-dive
tags: [mit-67960, deep-learning, pytorch, regularization, weight-decay, dropout, batch-norm, label-smoothing]
lang: en
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 5
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 12
tldr: "Regularization isn't just anti-overfitting — mechanisms & combo strategies for WD, Dropout, BN, Label Smoothing"
description: "MIT 6.7960 Fall 2024 OCW Lecture 9: Hacker's Guide to Deep Learning. Deep dive into Weight Decay (including AdamW decoupling), Dropout inference scaling, Batch Norm train/eval mode differences, Label Smoothing & Mixup, and their combination conventions in modern architectures. Includes runnable PyTorch implementation examples."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-09-17-mit-67960-regularization)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

[MIT 6.7960 Fall 2024 OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) This site's L04 post treats regularization as an "engineering toolbox": what concrete problem each technique solves, how to use it correctly, and how to combine it with others, with a practical decision table and runnable PyTorch code. The content is this site's synthesis of the general literature, not a segment-by-segment summary of any one lecture; OCW has no lecture dedicated to weight decay, dropout or batch norm (see "Course video sources" below).

## Course video sources
Rechecked against the live MIT OCW Fall 2024 gallery and the Lec 06 page on 2026-10-10: the “L04” in this article’s title is this site’s series numbering (OCW Lec 04 is Architectures: Grids). OCW has no lecture dedicated to weight decay, dropout, batch norm or label smoothing; the official summary of Lec 06 Generalization Theory covers overparameterization, double descent, limits of VC dimension and inductive biases, so it is related background only. It does not verify this article’s content.

```youtube
url: https://www.youtube.com/watch?v=EiO8BBa-xdc
title: MIT 6.7960 Fall 2024 — Lec 06. Generalization Theory
```

Original videos: [MIT 6.7960 Fall 2024 — Lec 06. Generalization Theory](https://www.youtube.com/watch?v=EiO8BBa-xdc)

Course and recording entries:

- [MIT OCW — Lec 06. Generalization Theory](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec06_mp4/)
- [MIT 6.7960 Fall 2024 — official lecture video gallery](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/)

Checked: 2026-10-10.

Numbering note: the L03–L06 numbers of these four posts were planned by this site early on from a generic deep-learning teaching order (optimization, regularization, CNN, modern CNN) without matching each one to the OCW lecture list. OCW Fall 2024 Lec 03–06 are actually Approximation Theory, Architectures: Grids, Architectures: Graphs and Generalization Theory, so these four L numbers differ from OCW lecture numbers. The original numbers are kept to avoid changing URLs and titles; numbering lines up with OCW again from L07.

Content check: verified against the video transcript (2026-10-10): read the transcripts of the embedded Lec 06 (Phillip Isola) and the related Lec 09 (Phillip Isola); the old "video timestamps" section (fixed minute ranges for weight decay / dropout / batch norm / label smoothing) matched no video and was removed and replaced with an approximate transcript-based mapping; the claim that Lec 09 is taught by Sara Beery was wrong (the lecturer is Isola) and was corrected; Lec 09 explicitly advises against batch norm, which is now stated.

## Four Pillars of Regularization: Mechanism, Effect, Use Cases

| Technique | Core Mechanism | Problem Solved | Modern Default |
|---|---|---|---|
| **Weight Decay (L2)** | Shrink weights toward origin ≈ Gaussian prior | Large weights → numerical instability, generalization gap | AdamW: 0.1, SGD: 1e-4 |
| **Dropout** | Randomly zero neurons during training, scale at inference | Co-adaptation, ensemble approximation | 0.1–0.3 (Transformer), 0.5 (MLP) |
| **Batch Norm** | Batch statistics standardization + learnable scale/shift | Internal covariate shift, grad vanish/explode, implicit regularization | momentum=0.1, eps=1e-5 |
| **Label Smoothing** | Hard labels → soft dist (1-ε, ε/(K-1)) | Overconfidence, calibration error, KD foundation | ε=0.1 (classification), 0.0 (distillation teacher) |

**Key concept**: regularization isn't "stronger = better" (this is the article's own takeaway, not a quote from a lecturer in the video) — **the goal is to reserve effective capacity for patterns the data needs to learn, while suppressing noise capacity**. Over-regularization causes underfitting, especially with large models and large datasets.

## Weight Decay: The Critical Adam vs AdamW Difference

**Adam's weight decay has a bug**: Original Adam adds L2 penalty directly to gradient `g ← g + λw`, but adaptive LR scales this term too, diluting weight decay effect for large-gradient parameters.

**AdamW decouples**:
```python
# Adam (wrong way)
g = grad + λ * w
m = β1*m + (1-β1)*g
v = β2*v + (1-β2)*g²
w = w - lr * m / (√v + ε)

# AdamW (correct way)
m = β1*m + (1-β1)*grad
v = β2*v + (1-β2)*grad²
w = w - lr * (m / (√v + ε) + λ * w)  # weight decay acts directly on weights
```

In practice **always use `torch.optim.AdamW`**, never `Adam` with `weight_decay` parameter.

## Dropout: The Train/Inference Scaling Trap

Standard Dropout (Inverted Dropout):
- Training: `x * mask / (1-p)` where `mask ~ Bernoulli(1-p)`
- Inference: `x` (no mask, no scaling — training already corrected expectation)

```python
# PyTorch nn.Dropout has inverted scaling built-in
dropout = nn.Dropout(p=0.1)  # Transformer attention commonly uses 0.1

# Manual version (educational)
def dropout_forward(x, p, training):
    if not training:
        return x
    mask = (torch.rand_like(x) > p).float()
    return x * mask / (1 - p)
```

**Common mistake**: Forgetting `model.eval()` at inference, so Dropout still randomly zeros, causing unstable outputs.

## Batch Norm: Train/Eval Statistics Switching

Batch Norm maintains running statistics:
- Training: normalize with current batch `mean, var`, update `running_mean, running_var` (momentum update)
- Inference: normalize with accumulated `running_mean, running_var`

```python
bn = nn.BatchNorm1d(256, momentum=0.1, eps=1e-5)

# Training mode
model.train()
out = bn(x)  # uses batch statistics

# Inference mode
model.eval()
out = bn(x)  # uses running statistics
```

**Critical details**:
- Small batches (< 16) → BN statistics noisy → switch to **Group Norm** or **Layer Norm**
- Fine-tuning pretrained models: **freeze BN statistics** (`model.eval()` only on BN layers) to prevent catastrophic forgetting
- SyncBN (multi-GPU synced statistics) required for large-batch distributed training

## Label Smoothing & Mixup: Label-Side Regularization

**Label Smoothing**:
```python
def label_smoothing_loss(logits, targets, epsilon=0.1):
    """logits: [B, C], targets: [B] (class indices)"""
    log_probs = torch.log_softmax(logits, dim=-1)
    n_classes = logits.size(-1)
    # one-hot -> smoothed
    true_dist = torch.zeros_like(log_probs).scatter_(1, targets.unsqueeze(1), 1.0)
    true_dist = true_dist * (1 - epsilon) + epsilon / n_classes
    return torch.mean(torch.sum(-true_dist * log_probs, dim=-1))

# PyTorch built-in (>= 1.10)
loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)
```

**Mixup**: Linear interpolation of two samples
```python
def mixup_data(x, y, alpha=0.2):
    lam = np.random.beta(alpha, alpha)
    index = torch.randperm(x.size(0))
    mixed_x = lam * x + (1 - lam) * x[index]
    y_a, y_b = y, y[index]
    return mixed_x, y_a, y_b, lam

def mixup_loss(criterion, pred, y_a, y_b, lam):
    return lam * criterion(pred, y_a) + (1 - lam) * criterion(pred, y_b)
```

## Modern Architecture Regularization Combination Conventions

| Architecture | Weight Decay | Dropout | Batch/Layer Norm | Label Smoothing | Mixup/CutMix |
|---|---|---|---|---|---|
| **ResNet (ImageNet)** | 1e-4 (SGD) | None | BN | 0.1 | CutMix α=1.0 |
| **ViT / DeiT** | 0.1 (AdamW) | 0.1 (attn + MLP) | LN | 0.1 | Mixup α=0.8 |
| **BERT / GPT** | 0.1 (AdamW) | 0.1 (residual) | LN | None (MLM uses whole-word mask) | None |
| **EfficientNet** | 1e-5 (RMSProp) | 0.2 (stochastic depth) | BN | 0.1 | Mixup α=0.2 |

**Stochastic Depth** (DropPath) is the hidden regularization in modern CNN/ViT:
```python
def drop_path(x, drop_prob=0.1, training=True):
    if not training or drop_prob == 0.:
        return x
    keep_prob = 1 - drop_prob
    shape = (x.shape[0],) + (1,) * (x.ndim - 1)
    random_tensor = keep_prob + torch.rand(shape, dtype=x.dtype, device=x.device)
    random_tensor.floor_()
    return x.div(keep_prob) * random_tensor
```

## How This Maps to the Videos (from the transcripts, not a segment-by-segment summary)

The four pillars here (weight decay, dropout, batch norm, label smoothing) are this site's synthesis of the general literature and have no single matching video, so no timecodes are given. Positions below are approximate, estimated from where topics fall in each transcript, not exact timestamps:

- Embedded Lec 06 Generalization Theory (taught by Phillip Isola, about 1 h 20 min): roughly 43%–57% is double descent, with a remark that whether it shows up depends on optimization details such as momentum and weight decay; roughly 67%–81% is the limits of VC theory; at roughly 92% weight decay is explained as an explicit regularizer that makes the optimizer prefer low-norm solutions. Only that short passage overlaps this article directly; dropout, batch norm and label smoothing do not appear in the transcript.
- Related but not embedded [Lec 09 Hacker's Guide to Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec09_mp4/) (taught by Phillip Isola, about 1 h 16 min): roughly 29%–31% and 85% discuss normalization layers, and at roughly 85% he explicitly advises "don't use batch norm" (performance depends strongly on batch size and train/test behavior differs); roughly 40%–50% is data augmentation; the ending (about 99%) only says every regularizer has its own effect and you need some regularization. The transcript does not go through weight decay, dropout or label smoothing one by one.

So this article's listing of batch norm as one of four pillars differs from Lec 09's advice; read the table as general practice, not as a conclusion of the MIT course.

## Complete Runnable PyTorch Example: Regularization Ablation Experiment

```python
"""Regularization ablation: test combos on CIFAR-10"""
import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

class SimpleCNN(nn.Module):
    def __init__(self, dropout=0.0, use_bn=True, num_classes=10):
        super().__init__()
        self.use_bn = use_bn
        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(32) if use_bn else nn.Identity()
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.bn2 = nn.BatchNorm2d(64) if use_bn else nn.Identity()
        self.pool = nn.MaxPool2d(2, 2)
        self.dropout = nn.Dropout(dropout)
        self.fc = nn.Linear(64 * 8 * 8, num_classes)
    
    def forward(self, x):
        x = self.pool(torch.relu(self.bn1(self.conv1(x))))
        x = self.pool(torch.relu(self.bn2(self.conv2(x))))
        x = x.view(x.size(0), -1)
        x = self.dropout(x)
        return self.fc(x)

def train_eval(config, epochs=5):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    
    # Data
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2470, 0.2435, 0.2616))
    ])
    train_set = datasets.CIFAR10('./data', train=True, download=True, transform=transform)
    test_set = datasets.CIFAR10('./data', train=False, download=True, transform=transform)
    train_loader = DataLoader(train_set, batch_size=128, shuffle=True)
    test_loader = DataLoader(test_set, batch_size=256, shuffle=False)
    
    # Model & optimizer
    model = SimpleCNN(dropout=config['dropout'], use_bn=config['bn']).to(device)
    opt = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=config['wd'])
    criterion = nn.CrossEntropyLoss(label_smoothing=config['label_smooth'])
    
    # Train
    for epoch in range(epochs):
        model.train()
        for x, y in train_loader:
            x, y = x.to(device), y.to(device)
            opt.zero_grad()
            loss = criterion(model(x), y)
            loss.backward()
            opt.step()
    
    # Evaluate
    model.eval()
    correct = 0
    with torch.no_grad():
        for x, y in test_loader:
            x, y = x.to(device), y.to(device)
            pred = model(x).argmax(1)
            correct += (pred == y).sum().item()
    acc = correct / len(test_set)
    return acc

# Ablation configs
configs = {
    'Baseline': dict(dropout=0.0, bn=True, wd=0.0, label_smooth=0.0),
    '+WeightDecay': dict(dropout=0.0, bn=True, wd=1e-4, label_smooth=0.0),
    '+Dropout': dict(dropout=0.2, bn=True, wd=1e-4, label_smooth=0.0),
    '+LabelSmooth': dict(dropout=0.2, bn=True, wd=1e-4, label_smooth=0.1),
    'NoBN+GroupNorm': dict(dropout=0.2, bn=False, wd=1e-4, label_smooth=0.1),  # needs model change
}

print("Regularization Ablation on CIFAR-10 (5 epochs)")
for name, cfg in configs.items():
    if name == 'NoBN+GroupNorm':
        continue  # skip config needing architecture change
    acc = train_eval(cfg)
    print(f"{name:20s}: Test Acc = {acc*100:.2f}%")
```

## Common Pitfalls & Avoidance Guide

| Symptom | Likely Cause | Fix |
|---|---|---|
| Train loss OK, val loss high & not dropping | Regularization too strong, or model capacity too low | Reduce wd, dropout, label_smooth; increase model width |
| BN layer gives different inference results each run | Forgot `model.eval()` | Always call `model.eval()` before inference |
| AdamW weight decay ineffective | Used `optim.Adam(weight_decay=...)` | Switch to `optim.AdamW(weight_decay=...)` |
| Mixup loss calculation wrong | Direct CE on mixed labels | Use `mixup_loss` linear combo of two CEs |
| Small batch BN statistics unstable | Batch size < 16 | Switch to GroupNorm(32) or LayerNorm |

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The embedded Lec 06 Generalization Theory is not the lecture for this topic (weight decay, dropout, batch norm), so the status is now “Related supplementary video included; the original lecture recording has not been verified”, and the video-timestamps section is noted as not tied to any official video.
- 2026-10-10: Checked the video content against its transcript. Removed the "video timestamps" section that matched no video and replaced it with a transcript-based mapping; corrected the Lec 09 lecturer to Phillip Isola (was wrongly Sara Beery) and noted that Lec 09 advises against batch norm.

## References

- [MIT 6.7960 Fall 2024 Lec 09: Hacker's Guide to Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec09_mp4/) — Official video (YouTube: `DC2Hw9DiLCg`, taught by Phillip Isola; relevant here only in the normalization and closing passages)
- [Lecture 9 Slides (PDF)](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec9_pdf/) — Lec 09 lecture slides
- [Fixing Weight Decay Regularization in Adam (AdamW, arXiv:1711.05101)](https://arxiv.org/abs/1711.05101) — Loshchilov & Hutter
- [Dropout: A Simple Way to Prevent Neural Networks from Overfitting (Srivastava et al., 2014)](https://jmlr.org/papers/v15/srivastava14a.html) — Dropout original paper
- [Batch Normalization (Ioffe & Szegedy, 2015)](https://arxiv.org/abs/1502.03167) — BN original paper
- [When Does Label Smoothing Help? (Müller et al., 2019)](https://arxiv.org/abs/1906.02629) — Label Smoothing analysis
- [mixup: Beyond Empirical Risk Minimization (Zhang et al., 2018)](https://arxiv.org/abs/1710.09412) — Mixup original paper
- [PyTorch nn.Dropout Docs](https://pytorch.org/docs/stable/generated/torch.nn.Dropout.html) — API reference
- [PyTorch nn.BatchNorm Docs](https://pytorch.org/docs/stable/generated/torch.nn.BatchNorm1d.html) — API reference
- On this site: [MIT 6.7960 L03: Optimization Overview](/posts/tech/2026-09-10-mit-67960-optimization-sgd-adam-en) — Previous lecture on optimizer setup