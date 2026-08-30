---
title: "MIT 6.7960 L03：優化總覽——SGD、Adam、學習率排程與縮放規則"
date: 2026-08-30
category: tech
type: deep-dive
tags: [mit-67960, deep-learning, pytorch, optimization, sgd, adam, learning-rate-schedule]
lang: zh-TW
series:
  name: "MIT 6.7960 Fall 2024 OCW 導讀"
  order: 4
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 11
tldr: "從 SGD 到 Adam，用縮放規則一次搞懂深度學習優化器怎麼選、學習率怎麼調"
description: "MIT 6.7960 Fall 2024 OCW 第 7 講：深度學習優化的核心概念，涵蓋 SGD 動量、Adam/AdamW、學習率排程（cosine、warmup、decay）、縮放規則，以及如何根據批次大小與模型規模設定超參數。附可直接執行的 PyTorch 實作範例。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-09-10-mit-67960-optimization-sgd-adam-en)

[MIT 6.7960 Fall 2024 OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) 第 7 講 [Scaling Rules for Optimization](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec07_mp4/)（縮放規則與優化）由 Jeremy Bernstein 授課。這講不只是列優化器清單，而是從**梯度下降的動力學**出發，推導為什麼大批次需要大學習率、為什麼 Adam 在某些情況下會失效、以及怎麼用「縮放規則」把小批次實驗的超參數轉移到大規模訓練。這篇文章把講義重點重組成可直接套用的決策框架，並附上可跑的 PyTorch 程式碼。

## 優化器的譜系：從 SGD 到 Adam

深度學習優化器演進的主線是：**怎麼在高維非凸地形裡，用最少的超參數調整，穩定收斂到好解**。

| 優化器 | 核心思想 | 適用情境 | 缺點 |
|---|---|---|---|
| **SGD** | 純梯度下降，可加動量 | 小模型、凸問題、要理論保證時 | 深層網路收斂慢、需精心調 LR |
| **SGD + Momentum** | 累積歷史梯度方向，穿越鞍點 | 影像分類、ResNet 類架構 | 仍需手調 LR、對 ill-conditioned 敏感 |
| **Adam** | 一階動量 + 二階自適應學習率 | NLP、Transformer、快速原型 | 大批次易發散、weight decay 需分離 |
| **AdamW** | Adam + 解耦 weight decay | 現代 LLM/ViT 訓練預設 | 同 Adam，但正則化更正確 |
| **Lion / Sophia** | 符號梯度 / 二階近似 | 大模型預訓練嘗試 | 生態較新、超參數敏感 |

**關鍵洞見**：Bernstein 在講義中強調，**優化器選擇不如「縮放規則」重要**——同樣的優化器，學習率、批次大小、權重衰減若不按規則縮放，大模型照樣訓不動。

## 縮放規則：大批次怎麼調學習率

講義推導的核心公式（**Linear Scaling Rule**）：

```
lr_new = lr_base × (batch_size_new / batch_size_base)
```

前提條件：
- 使用 **SGD + Momentum** 或 **AdamW**（自適應優化器近似成立）
- 學習率在「穩定區間」內（太大會發散、太小收斂慢）
- Warmup 步數同比例增長：`warmup_steps_new = warmup_base × (batch_size_new / batch_size_base)`

**為什麼有效**：大批次梯度方差下降 ∝ 1/√B，信噪比提升，可以承受更大步長。但超過「critical batch size」後，收益遞減甚至發散。

實務上對 Transformer 採用 **sqrt scaling**（學習率 ∝ √B）更穩健，見 [Kaplan et al. 2020](https://arxiv.org/abs/2005.10242) 與 [Chinchilla](https://arxiv.org/abs/2203.15556) 的實驗。

## 學習率排程：Warmup → Cosine → Decay

現代標準排程（**Warmup + Cosine Annealing**）：

```python
import torch
from torch.optim.lr_scheduler import LambdaLR, CosineAnnealingLR, SequentialLR

def get_lr_scheduler(optimizer, warmup_steps, total_steps, min_lr_ratio=0.1):
    """Warmup + Cosine decay，回傳可直接 step() 的 scheduler"""
    def warmup_lambda(step):
        return min(1.0, step / warmup_steps)
    
    warmup_scheduler = LambdaLR(optimizer, warmup_lambda)
    cosine_scheduler = CosineAnnealingLR(
        optimizer, 
        T_max=total_steps - warmup_steps,
        eta_min=optimizer.param_groups[0]['lr'] * min_lr_ratio
    )
    return SequentialLR(optimizer, [warmup_scheduler, cosine_scheduler], [warmup_steps])

# 使用範例
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

**影片時間戳**：
- 0:00–12:00 SGD 動量與 Nesterov 加速推導
- 12:00–28:00 Adam/AdamW 內部機制與 weight decay 解耦
- 28:00–42:00 縮放規則推導與 critical batch size
- 42:00–55:00 學習率排程實務（warmup、cosine、constant、reduce-on-plateau）
- 55:00–1:10:00 實驗展示：不同批次大小下的收斂曲線對比

## 實戰決策樹：新專案怎麼選優化器與超參數

```
START: 新模型、新資料集
│
├─ 是不是 Transformer / LLM / ViT 大模型？
│   ├─ 是 → AdamW (lr=3e-4, wd=0.1, β=(0.9,0.95)) + Warmup+Cosine
│   └─ 否 → 是 CNN (ResNet/EfficientNet)？
│       ├─ 是 → SGD + Momentum (lr=0.1, momentum=0.9, wd=1e-4) + Cosine
│       └─ 否 → 先試 AdamW (lr=1e-3, wd=0.01)，觀察 loss curve
│
├─ 批次大小要放大？
│   ├─ 是 → 線性縮放 lr、同比例增 warmup、監控 gradient norm
│   └─ 否 → 維持 base config
│
└─ 觀察訓練前 1000 steps：
    ├─ Loss 爆炸 → lr 除 10、加 gradient clipping (1.0)
    ├─ Loss 震盪不下降 → lr 除 3、延長 warmup
    └─ Loss 平滑下降 → 繼續跑、記錄 best checkpoint
```

## PyTorch 完整可跑範例：優化器對比實驗

```python
"""優化器對比：SGD vs AdamW 在 MLP 上的收斂行為"""
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

# 合成資料
torch.manual_seed(42)
train_data = torch.utils.data.TensorDataset(
    torch.randn(5000, 256), torch.randint(0, 10, (5000,))
)
loader = torch.utils.data.DataLoader(train_data, batch_size=128, shuffle=True)
device = 'cuda' if torch.cuda.is_available() else 'cpu'

# 三組優化器設定
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

# 繪圖
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

## 常見坑與避雷指南

| 症狀 | 可能原因 | 修正 |
|---|---|---|
| Loss 前幾步就變 NaN | lr 太大、無 gradient clipping | lr ÷ 10、加 `clip_grad_norm_(1.0)` |
| 驗證 loss 不降、訓練 loss 降 | 過擬合、weight decay 太小 | 調大 wd、加 dropout、早停 |
| 大批次訓練不收斂 | Linear scaling 失效 | 改 sqrt scaling、延長 warmup、檢查 batch norm 統計量 |
| AdamW 權重衰減無效 | 用了 `weight_decay` 參數但優化器是 Adam | 改用 `torch.optim.AdamW`（解耦） |

## 參考資料

- [MIT 6.7960 Fall 2024 Lec 07: Scaling Rules for Optimization](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec07_mp4/) — 官方影片（YouTube: `Q1HOKrNeh2M`）
- [Lecture 7 Slides (PDF)](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec7_pdf/) — Bernstein 講義投影片
- [Training Compute-Optimal LLMs (Chinchilla, arXiv:2203.15556)](https://arxiv.org/abs/2203.15556) — 縮放規則實驗證據
- [Fixing Weight Decay Regularization in Adam (AdamW, arXiv:1711.05101)](https://arxiv.org/abs/1711.05101) — Loshchilov & Hutter 原論文
- [An Empirical Model of Large-Batch Training (arXiv:1812.06162)](https://arxiv.org/abs/1812.06162) — Critical batch size 理論分析
- [PyTorch Optimizers 官方文件](https://pytorch.org/docs/stable/optim.html) — 各優化器 API 參考
- 站內：[MIT 6.7960 導讀：一門課兩個官方版本](/posts/ai/2026-08-26-mit-67960-deep-learning-guide) — 系列概覽與版本分流