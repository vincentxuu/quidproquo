---
title: "MIT 6.7960 L04：正則化實戰——Weight Decay、Dropout、Batch Norm 與標籤平滑"
date: 2026-09-17
category: tech
type: deep-dive
tags: [mit-67960, deep-learning, pytorch, regularization, weight-decay, dropout, batch-norm, label-smoothing]
lang: zh-TW
series:
  name: "MIT 6.7960 Fall 2024 OCW 導讀"
  order: 5
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 12
tldr: "正則化不只是防過擬合——Weight Decay、Dropout、BN、Label Smoothing 的機制與組合策略一次看懂"
description: "MIT 6.7960 Fall 2024 OCW 第 9 講：Hacker's Guide to Deep Learning。深入解析 Weight Decay（含 AdamW 解耦）、Dropout 的推論時縮放、Batch Norm 訓練/推論模式差異、Label Smoothing 與 Mixup，以及它們在現代架構中的組合慣例。附可直接執行的 PyTorch 實作範例。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-09-17-mit-67960-regularization-en)

[MIT 6.7960 Fall 2024 OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) 第 9 講 [Hacker's Guide to Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec09_mp4/) 由 Sara Beery 授課。這講把正則化視為「工程工具箱」而非純理論：每種技巧解決什麼具體問題、怎麼正確用、怎麼跟其他技巧組合。這篇文章把講義重點整理成可直接套用的正則化決策表，並附上可跑的 PyTorch 程式碼。

## 正則化四大支柱：機制、效果、適用場景

| 技巧 | 核心機制 | 解決的問題 | 現代預設值 |
|---|---|---|---|
| **Weight Decay (L2)** | 權重向原點收縮，等價於高斯先驗 | 大權重導致的數值不穩、泛化間隙 | AdamW: 0.1, SGD: 1e-4 |
| **Dropout** | 訓練時隨機歸零神經元，推論時縮放 | 共適應、集成效應近似 | 0.1–0.3 (Transformer), 0.5 (MLP) |
| **Batch Norm** | 批次統計量標準化 + 可學習縮放平移 | 內部協變量偏移、梯度消失/爆炸、隱性正則化 | momentum=0.1, eps=1e-5 |
| **Label Smoothing** | 硬標籤 → 軟分布 (1-ε, ε/(K-1)) | 過度自信、校準誤差、知識蒸餾基礎 | ε=0.1 (分類), 0.0 (蒸餾教師) |

**關鍵觀念**：Beery 強調正則化不是「越強越好」——**目標是把有效容量留給資料要學的模式，把雜訊容量壓掉**。過度正則化會導致 underfitting，特別是在大模型、大資料下。

## Weight Decay：Adam vs AdamW 的關鍵差異

**Adam 的 weight decay 有 bug**：原始 Adam 把 L2 懲罰項直接加在梯度上 `g ← g + λw`，但自適應學習率會把這項也縮放，導致大梯度參數的 weight decay 效果被稀釋。

**AdamW 解耦**：
```python
# Adam (錯誤做法)
g = grad + λ * w
m = β1*m + (1-β1)*g
v = β2*v + (1-β2)*g²
w = w - lr * m / (√v + ε)

# AdamW (正確做法)
m = β1*m + (1-β1)*grad
v = β2*v + (1-β2)*grad²
w = w - lr * (m / (√v + ε) + λ * w)  # weight decay 直接作用在權重上
```

實務上**永遠用 `torch.optim.AdamW`**，不要用 `Adam` 加 `weight_decay` 參數。

## Dropout：訓練 vs 推論的縮放陷阱

標準 Dropout（Inverted Dropout）：
- 訓練：`x * mask / (1-p)` 其中 `mask ~ Bernoulli(1-p)`
- 推論：`x`（不乘 mask，也不縮放，因為訓練已經期望值校正）

```python
# PyTorch nn.Dropout 已內建 inverted scaling
dropout = nn.Dropout(p=0.1)  # Transformer 注意力後常用 0.1

# 手寫版本（教學用）
def dropout_forward(x, p, training):
    if not training:
        return x
    mask = (torch.rand_like(x) > p).float()
    return x * mask / (1 - p)
```

**常見錯誤**：推論忘記 `model.eval()`，導致 Dropout 仍在隨機歸零，輸出不穩定。

## Batch Norm：訓練/推模式的統計量切換

Batch Norm 維護 running statistics：
- 訓練：用當前 batch 的 `mean, var` 正規化，同時更新 `running_mean, running_var`（動量更新）
- 推論：用累積的 `running_mean, running_var` 正規化

```python
bn = nn.BatchNorm1d(256, momentum=0.1, eps=1e-5)

# 訓練模式
model.train()
out = bn(x)  # 用 batch 統計量

# 推論模式
model.eval()
out = bn(x)  # 用 running 統計量
```

**關鍵細節**：
- 小批次（< 16）時 BN 統計量噪聲大 → 改用 **Group Norm** 或 **Layer Norm**
- 預訓練模型微調時：**凍結 BN 統計量**（`model.eval()` 只對 BN 層）可防災難性遺忘
- SyncBN（多 GPU 同步統計量）對大批次分佈式訓練必要

## Label Smoothing & Mixup：標籤端正則化

**Label Smoothing**：
```python
def label_smoothing_loss(logits, targets, epsilon=0.1):
    """logits: [B, C], targets: [B] (class indices)"""
    log_probs = torch.log_softmax(logits, dim=-1)
    n_classes = logits.size(-1)
    # one-hot -> smoothed
    true_dist = torch.zeros_like(log_probs).scatter_(1, targets.unsqueeze(1), 1.0)
    true_dist = true_dist * (1 - epsilon) + epsilon / n_classes
    return torch.mean(torch.sum(-true_dist * log_probs, dim=-1))

# PyTorch 內建 (>= 1.10)
loss_fn = nn.CrossEntropyLoss(label_smoothing=0.1)
```

**Mixup**：兩樣本線性插值
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

## 現代架構的正則化組合慣例

| 架構 | Weight Decay | Dropout | Batch/Layer Norm | Label Smoothing | Mixup/CutMix |
|---|---|---|---|---|---|
| **ResNet (ImageNet)** | 1e-4 (SGD) | 無 | BN | 0.1 | CutMix α=1.0 |
| **ViT / DeiT** | 0.1 (AdamW) | 0.1 (attn + MLP) | LN | 0.1 | Mixup α=0.8 |
| **BERT / GPT** | 0.1 (AdamW) | 0.1 (residual) | LN | 無 (MLM 用整詞遮蔽) | 無 |
| **EfficientNet** | 1e-5 (RMSProp) | 0.2 (stochastic depth) | BN | 0.1 | Mixup α=0.2 |

**Stochastic Depth**（DropPath）是現代 CNN/ViT 的隱藏正則化：
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

## 影片時間戳

- 0:00–15:00 Weight Decay 理論與 AdamW 解耦推導
- 15:00–30:00 Dropout 機制、inverted scaling、推論模式
- 30:00–45:00 Batch Norm 訓練/推論統計量、SyncBN、小批次替代方案
- 45:00–58:00 Label Smoothing、Mixup、CutMix、知識蒸餾連結
- 58:00–1:10:00 實戰清單：新專案正則化配置檢查表

## PyTorch 完整可跑範例：正則化消融實驗

```python
"""正則化消融：在 CIFAR-10 上測試各組合效果"""
import torch
import torch.nn as nn
import torch.optim as optim
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
    
    # 資料
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2470, 0.2435, 0.2616))
    ])
    train_set = datasets.CIFAR10('./data', train=True, download=True, transform=transform)
    test_set = datasets.CIFAR10('./data', train=False, download=True, transform=transform)
    train_loader = DataLoader(train_set, batch_size=128, shuffle=True)
    test_loader = DataLoader(test_set, batch_size=256, shuffle=False)
    
    # 模型與優化器
    model = SimpleCNN(dropout=config['dropout'], use_bn=config['bn']).to(device)
    opt = optim.AdamW(model.parameters(), lr=1e-3, weight_decay=config['wd'])
    criterion = nn.CrossEntropyLoss(label_smoothing=config['label_smooth'])
    
    # 訓練
    for epoch in range(epochs):
        model.train()
        for x, y in train_loader:
            x, y = x.to(device), y.to(device)
            opt.zero_grad()
            loss = criterion(model(x), y)
            loss.backward()
            opt.step()
    
    # 評估
    model.eval()
    correct = 0
    with torch.no_grad():
        for x, y in test_loader:
            x, y = x.to(device), y.to(device)
            pred = model(x).argmax(1)
            correct += (pred == y).sum().item()
    acc = correct / len(test_set)
    return acc

# 消融配置
configs = {
    'Baseline': dict(dropout=0.0, bn=True, wd=0.0, label_smooth=0.0),
    '+WeightDecay': dict(dropout=0.0, bn=True, wd=1e-4, label_smooth=0.0),
    '+Dropout': dict(dropout=0.2, bn=True, wd=1e-4, label_smooth=0.0),
    '+LabelSmooth': dict(dropout=0.2, bn=True, wd=1e-4, label_smooth=0.1),
    'NoBN+GroupNorm': dict(dropout=0.2, bn=False, wd=1e-4, label_smooth=0.1),  # 需改模型
}

print("Regularization Ablation on CIFAR-10 (5 epochs)")
for name, cfg in configs.items():
    if name == 'NoBN+GroupNorm':
        continue  # 略過需改架構的配置
    acc = train_eval(cfg)
    print(f"{name:20s}: Test Acc = {acc*100:.2f}%")
```

## 常見坑與避雷指南

| 症狀 | 可能原因 | 修正 |
|---|---|---|
| 訓練 loss 正常、驗證 loss 高且不降 | 正則化太強、或模型容量不足 | 減小 wd、dropout、label_smooth；增加模型寬度 |
| BN 層推論結果每次不同 | 忘記 `model.eval()` | 推論前必呼叫 `model.eval()` |
| AdamW weight decay 不生效 | 用了 `optim.Adam(weight_decay=...)` | 改用 `optim.AdamW(weight_decay=...)` |
| Mixup 後 loss 計算錯誤 | 直接用混合標籤算 CE | 用 `mixup_loss` 線性組合兩個 CE |
| 小批次 BN 統計量不穩 | Batch size < 16 | 改 GroupNorm(32) 或 LayerNorm |

## 參考資料

- [MIT 6.7960 Fall 2024 Lec 09: Hacker's Guide to Deep Learning](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec09_mp4/) — 官方影片（YouTube: `DC2Hw9DiLCg`）
- [Lecture 9 Slides (PDF)](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec9_pdf/) — Beery 講義投影片
- [Fixing Weight Decay Regularization in Adam (AdamW, arXiv:1711.05101)](https://arxiv.org/abs/1711.05101) — Loshchilov & Hutter
- [Dropout: A Simple Way to Prevent Neural Networks from Overfitting (Srivastava et al., 2014)](https://jmlr.org/papers/v15/srivastava14a.html) — Dropout 原論文
- [Batch Normalization (Ioffe & Szegedy, 2015)](https://arxiv.org/abs/1502.03167) — BN 原論文
- [When Does Label Smoothing Help? (Müller et al., 2019)](https://arxiv.org/abs/1906.02629) — Label Smoothing 分析
- [mixup: Beyond Empirical Risk Minimization (Zhang et al., 2018)](https://arxiv.org/abs/1710.09412) — Mixup 原論文
- [PyTorch nn.Dropout 文件](https://pytorch.org/docs/stable/generated/torch.nn.Dropout.html) — API 參考
- [PyTorch nn.BatchNorm 文件](https://pytorch.org/docs/stable/generated/torch.nn.BatchNorm1d.html) — API 參考
- 站內：[MIT 6.7960 L03：優化總覽](/posts/tech/2026-09-10-mit-67960-optimization-sgd-adam) — 上一講優化器設定