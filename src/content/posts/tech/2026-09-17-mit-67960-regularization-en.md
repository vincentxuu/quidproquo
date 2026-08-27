---
title: "MIT 6.7960 L04: Regularization in Practice — Weight Decay, Dropout, Batch Norm & Label Smoothing"
date: 2026-09-17
category: tech
type: deep-dive
tags: [mit-67960, deep-learning, pytorch, regularization, weight-decay, dropout, batch-norm, label-smoothing]
lang: en
series:
  name: "MIT 6.7960 Fall 2024 OCW Guide"
  order: 5
additionalSeries:
  - "Global AI/CS Course Map"
tldr: "Regularization isn't just anti-overfitting — mechanisms & combo strategies for WD, Dropout, BN, Label Smoothing"
description: "MIT 6.7960 Fall 2024 OCW Lecture 9: Hacker's Guide to Deep Learning. Deep dive into Weight Decay (including AdamW decoupling), Dropout inference scaling, Batch Norm train/eval mode differences, Label Smoothing & Mixup, and their combination conventions in modern architectures. Includes runnable PyTorch implementation examples."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-09-17-mit-67960-regularization)

[MIT 6.7960 Fall 2024 OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) Lecture 9 [Hacker's Guide to Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec09_mp4/) is taught by Sara Beery. This lecture treats regularization as an "engineering toolbox" rather than pure theory: what concrete problem each technique solves, how to use it correctly, and how to combine it with others. This article restructures the lecture highlights into a practical regularization decision table with runnable PyTorch code.

## Four Pillars of Regularization: Mechanism, Effect, Use Cases

| Technique | Core Mechanism | Problem Solved | Modern Default |
|---|---|---|---|
| **Weight Decay (L2)** | Shrink weights toward origin ≈ Gaussian prior | Large weights → numerical instability, generalization gap | AdamW: 0.1, SGD: 1e-4 |
| **Dropout** | Randomly zero neurons during training, scale at inference | Co-adaptation, ensemble approximation | 0.1–0.3 (Transformer), 0.5 (MLP) |
| **Batch Norm** | Batch statistics standardization + learnable scale/shift | Internal covariate shift, grad vanish/explode, implicit regularization | momentum=0.1, eps=1e-5 |
| **Label Smoothing** | Hard labels → soft dist (1-ε, ε/(K-1)) | Overconfidence, calibration error, KD foundation | ε=0.1 (classification), 0.0 (distillation teacher) |

**Key concept**: Beery emphasizes regularization isn't "stronger = better" — **the goal is to reserve effective capacity for patterns the data needs to learn, while suppressing noise capacity**. Over-regularization causes underfitting, especially with large models and large datasets.

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

## Video Timestamps

- 0:00–15:00 Weight Decay theory & AdamW decoupling derivation
- 15:00–30:00 Dropout mechanism, inverted scaling, inference mode
- 30:00–45:00 Batch Norm train/eval statistics, SyncBN, small-batch alternatives
- 45:00–58:00 Label Smoothing, Mixup, CutMix, knowledge distillation links
- 58:00–1:10:00 Practical checklist: new project regularization config audit

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

## References

- [MIT 6.7960 Fall 2024 Lec 09: Hacker's Guide to Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec09_mp4/) — Official video (YouTube: `DC2Hw9DiLCg`)
- [Lecture 9 Slides (PDF)](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec9_pdf/) — Beery lecture slides
- [Fixing Weight Decay Regularization in Adam (AdamW, arXiv:1711.05101)](https://arxiv.org/abs/1711.05101) — Loshchilov & Hutter
- [Dropout: A Simple Way to Prevent Neural Networks from Overfitting (Srivastava et al., 2014)](https://jmlr.org/papers/v15/srivastava14a.html) — Dropout original paper
- [Batch Normalization (Ioffe & Szegedy, 2015)](https://arxiv.org/abs/1502.03167) — BN original paper
- [When Does Label Smoothing Help? (Müller et al., 2019)](https://arxiv.org/abs/1906.02629) — Label Smoothing analysis
- [mixup: Beyond Empirical Risk Minimization (Zhang et al., 2018)](https://arxiv.org/abs/1710.09412) — Mixup original paper
- [PyTorch nn.Dropout Docs](https://pytorch.org/docs/stable/generated/torch.nn.Dropout.html) — API reference
- [PyTorch nn.BatchNorm Docs](https://pytorch.org/docs/stable/generated/torch.nn.BatchNorm1d.html) — API reference
- On this site: [MIT 6.7960 L03: Optimization Overview](/posts/tech/2026-09-10-mit-67960-optimization-sgd-adam-en) — Previous lecture on optimizer setup