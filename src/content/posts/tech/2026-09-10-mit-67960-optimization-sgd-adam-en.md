---
title: "MIT 6.7960 L03: Optimization Overview — SGD, Adam, LR Schedules & Scaling Rules"
date: 2026-09-10
category: tech
type: deep-dive
tags: [mit-67960, deep-learning, pytorch, optimization, sgd, adam, learning-rate-schedule]
lang: en
series:
  name: "MIT 6.7960 Fall 2024 OCW Guide"
  order: 4
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 11
tldr: "From SGD to Adam: pick the right optimizer and scale LR with batch size using scaling rules"
description: "MIT 6.7960 Fall 2024 OCW Lecture 7: Core concepts of deep learning optimization, covering SGD with momentum, Adam/AdamW, learning rate schedules (cosine, warmup, decay), scaling rules, and how to set hyperparameters for batch size and model scale. Includes runnable PyTorch implementation examples."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-09-10-mit-67960-optimization-sgd-adam)

[MIT 6.7960 Fall 2024 OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) Lecture 7 [Scaling Rules for Optimization](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec07_mp4/) is taught by Jeremy Bernstein. This lecture doesn't just list optimizers — it derives from **gradient descent dynamics** why large batches need large learning rates, why Adam fails in certain regimes, and how to use "scaling rules" to transfer hyperparameters from small-batch experiments to large-scale training. This article restructures the lecture highlights into a practical decision framework with runnable PyTorch code.

## Optimizer Genealogy: From SGD to Adam

The main thread of deep learning optimizer evolution: **how to stably converge to good solutions in high-dimensional non-convex landscapes with minimal hyperparameter tuning**.

| Optimizer | Core Idea | Best For | Drawbacks |
|---|---|---|---|
| **SGD** | Pure gradient descent, optional momentum | Small models, convex problems, when theory guarantees matter | Slow convergence on deep nets, needs careful LR tuning |
| **SGD + Momentum** | Accumulate historical gradient direction, cross saddle points | Image classification, ResNet-style architectures | Still needs manual LR, sensitive to ill-conditioning |
| **Adam** | 1st-order momentum + 2nd-order adaptive LR | NLP, Transformers, rapid prototyping | Diverges at large batch, weight decay must be decoupled |
| **AdamW** | Adam + decoupled weight decay | Modern LLM/ViT training default | Same as Adam, but regularization is correct |
| **Lion / Sophia** | Sign gradient / 2nd-order approximation | Large model pre-training experiments | Newer ecosystem, hyperparameter-sensitive |

**Key insight**: Bernstein emphasizes in the lecture that **optimizer choice matters less than "scaling rules"** — the same optimizer fails if learning rate, batch size, and weight decay aren't scaled by the rules.

## Scaling Rules: How to Adjust LR for Large Batches

The core formula derived in the lecture (**Linear Scaling Rule**):

```
lr_new = lr_base × (batch_size_new / batch_size_base)
```

Prerequisites:
- Using **SGD + Momentum** or **AdamW** (adaptive optimizers approximately satisfy this)
- Learning rate in the "stable regime" (too large → divergence, too small → slow convergence)
- Warmup steps scale proportionally: `warmup_steps_new = warmup_base × (batch_size_new / batch_size_base)`

**Why it works**: Large-batch gradient variance drops ∝ 1/√B, signal-to-noise ratio improves, allowing larger step sizes. But beyond "critical batch size", returns diminish or diverge.

In practice, **sqrt scaling** (LR ∝ √B) is more stable for Transformers, per [Kaplan et al. 2020](https://arxiv.org/abs/2005.10242) and [Chinchilla](https://arxiv.org/abs/2203.15556) experiments.

## Learning Rate Schedules: Warmup → Cosine → Decay

Modern standard schedule (**Warmup + Cosine Annealing**):

```python
import torch
from torch.optim.lr_scheduler import LambdaLR, CosineAnnealingLR, SequentialLR

def get_lr_scheduler(optimizer, warmup_steps, total_steps, min_lr_ratio=0.1):
    """Warmup + Cosine decay, returns a scheduler ready to step()"""
    def warmup_lambda(step):
        return min(1.0, step / warmup_steps)
    
    warmup_scheduler = LambdaLR(optimizer, warmup_lambda)
    cosine_scheduler = CosineAnnealingLR(
        optimizer, 
        T_max=total_steps - warmup_steps,
        eta_min=optimizer.param_groups[0]['lr'] * min_lr_ratio
    )
    return SequentialLR(optimizer, [warmup_scheduler, cosine_scheduler], [warmup_steps])

# Usage example
model = torch.nn.Linear(512, 10)
optimizer = torch.optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.1)
scheduler = get_lr_scheduler(optimizer, warmup_steps=2000, total_steps=100_000)

for step in range(100_000):
    loss = model(torch.randn(32, 512)).sum()
    loss.backward()
    optimizer.step()
    scheduler.step()
    optimizer.zero_grad()
```

**Video timestamps**:
- 0:00–12:00 SGD momentum & Nesterov acceleration derivation
- 12:00–28:00 Adam/AdamW internals & weight decay decoupling
- 28:00–42:00 Scaling rules derivation & critical batch size
- 42:00–55:00 LR schedules in practice (warmup, cosine, constant, reduce-on-plateau)
- 55:00–1:10:00 Experiments: convergence curves across batch sizes

## Practical Decision Tree: Choosing Optimizer & Hyperparameters for a New Project

```
START: New model, new dataset
│
├─ Is it a Transformer / LLM / ViT large model?
│   ├─ Yes → AdamW (lr=3e-4, wd=0.1, β=(0.9,0.95)) + Warmup+Cosine
│   └─ No → Is it a CNN (ResNet/EfficientNet)?
│       ├─ Yes → SGD + Momentum (lr=0.1, momentum=0.9, wd=1e-4) + Cosine
│       └─ No → Try AdamW first (lr=1e-3, wd=0.01), watch loss curve
│
├─ Scaling up batch size?
│   ├─ Yes → Linear scale LR, proportional warmup increase, monitor grad norm
│   └─ No → Keep base config
│
└─ Observe first 1000 training steps:
    ├─ Loss explodes → LR ÷ 10, add gradient clipping (1.0)
    ├─ Loss oscillates → LR ÷ 3, extend warmup
    └─ Smooth descent → Keep going, log best checkpoint
```

## Complete Runnable PyTorch Example: Optimizer Comparison Experiment

```python
"""Optimizer comparison: SGD vs Adam vs AdamW convergence on MLP"""
import torch
import torch.nn as nn
import matplotlib.pyplot as plt

class MLP(nn.Module):
    def __init__(self, dim=256, depth=4):
        super().__init__()
        layers = []
        for _ in range(depth):
            layers += [nn.Linear(dim, dim), nn.ReLU()]
        layers.append(nn.Linear(dim, 10))
        self.net = nn.Sequential(*layers)
    
    def forward(self, x):
        return self.net(x)

def train_one_epoch(model, opt, scheduler, loader, device):
    model.train()
    total_loss = 0
    for x, y in loader:
        x, y = x.to(device), y.to(device)
        opt.zero_grad()
        loss = nn.functional.cross_entropy(model(x), y)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
        opt.step()
        if scheduler:
            scheduler.step()
        total_loss += loss.item()
    return total_loss / len(loader)

# Synthetic data
torch.manual_seed(42)
train_data = torch.utils.data.TensorDataset(
    torch.randn(5000, 256), torch.randint(0, 10, (5000,))
)
loader = torch.utils.data.DataLoader(train_data, batch_size=128, shuffle=True)
device = 'cuda' if torch.cuda.is_available() else 'cpu'

# Three optimizer configs
configs = {
    'SGD+Momentum': dict(lr=0.1, momentum=0.9, weight_decay=1e-4, opt_fn=torch.optim.SGD),
    'Adam': dict(lr=3e-4, betas=(0.9, 0.999), weight_decay=0.1, opt_fn=torch.optim.Adam),
    'AdamW': dict(lr=3e-4, betas=(0.9, 0.95), weight_decay=0.1, opt_fn=torch.optim.AdamW),
}

results = {}
for name, cfg in configs.items():
    opt_fn = cfg.pop('opt_fn')
    model = MLP().to(device)
    opt = opt_fn(model.parameters(), **cfg)
    scheduler = get_lr_scheduler(opt, warmup_steps=50, total_steps=500)
    
    losses = []
    for epoch in range(20):
        loss = train_one_epoch(model, opt, scheduler, loader, device)
        losses.append(loss)
    results[name] = losses
    print(f"{name}: final loss = {losses[-1]:.4f}")

# Plot
plt.figure(figsize=(8, 5))
for name, losses in results.items():
    plt.plot(losses, label=name, marker='o')
plt.yscale('log')
plt.xlabel('Epoch')
plt.ylabel('Loss (log scale)')
plt.title('Optimizer Comparison on Synthetic MLP Task')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('optimizer_comparison.png', dpi=150)
print("Saved plot to optimizer_comparison.png")
```

## Common Pitfalls & Avoidance Guide

| Symptom | Likely Cause | Fix |
|---|---|---|
| Loss becomes NaN in first steps | LR too large, no gradient clipping | LR ÷ 10, add `clip_grad_norm_(1.0)` |
| Val loss flat, train loss drops | Overfitting, weight decay too small | Increase wd, add dropout, early stopping |
| Large batch won't converge | Linear scaling breaks | Switch to sqrt scaling, extend warmup, check BN stats |
| AdamW weight decay ineffective | Used `weight_decay` param but optimizer is Adam | Use `torch.optim.AdamW` (decoupled) |

## References

- [MIT 6.7960 Fall 2024 Lec 07: Scaling Rules for Optimization](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec07_mp4/) — Official video (YouTube: `Q1HOKrNeh2M`)
- [Lecture 7 Slides (PDF)](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec7_pdf/) — Bernstein lecture slides
- [Training Compute-Optimal LLMs (Chinchilla, arXiv:2203.15556)](https://arxiv.org/abs/2203.15556) — Scaling rules empirical evidence
- [Fixing Weight Decay Regularization in Adam (AdamW, arXiv:1711.05101)](https://arxiv.org/abs/1711.05101) — Loshchilov & Hutter original paper
- [An Empirical Model of Large-Batch Training (arXiv:1812.06162)](https://arxiv.org/abs/1812.06162) — Critical batch size theory
- [PyTorch Optimizers Official Docs](https://pytorch.org/docs/stable/optim.html) — Optimizer API reference
- On this site: [MIT 6.7960 Guide: One Course, Two Official Editions](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en) — Series overview & version routing