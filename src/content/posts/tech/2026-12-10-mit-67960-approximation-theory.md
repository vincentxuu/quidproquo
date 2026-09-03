---
title: "MIT 6.7960 近似理論（Approximation Theory）—— 萬能近似、Barron 定理與深度為何有用"
date: 2026-08-30
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - approximation-theory
  - universal-approximation
  - barron
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 3 講（Jeremy Bernstein）：一個神經網路到底能多好地逼近任意函數？萬能近似定理、Barron 定理如何繞開維度災難，以及為什麼深度（而非只是寬度）在表達力上至關重要。"
tldr: "單層網路理論上能逼近任何連續函數（萬能近似），但寬度會隨維度指數爆炸；Barron 定理在特定的『Barron 函數類』下讓誤差只隨樣本數 √n 收斂、與維度脫鉤；而深度能對組合/階層函數帶來指數級的寬度節省——這正是深網比淺網強的根本原因。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 3
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 24
---

> 🌏 [English version](/posts/tech/2026-12-10-mit-67960-approximation-theory-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**（對應 OCW Lec 03）。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Jeremy Bernstein** 授課，選讀含 *Deep Learning Theory Notes*（第 2、5 節）。

---

## 一個最根本的問題

前面的講次在講「怎麼訓練」、後面講「架構」。但這一講先退一步問一個理論問題：**一個神經網路，到底能多好地逼近我們想要的函數？** 這不是數學清談——它直接決定了「網路夠不夠大、該加寬還是加深」。

## 萬能近似定理（Universal Approximation）

最著名的結論是：**一個帶非線性激活的單隱層網路，只要隱含層夠寬，就能在緊湊集上以任意精度逼近任何連續函數**。

形式化地，對任意連續 `f: K → R`（`K` 緊緻），存在足夠寬的

```
f̂(x) = Σ_{k=1}^{K} a_k · σ(w_kᵀ x + b_k)
```

使得 `‖f − f̂‖` 任意小。這條定理（Cybenko 1989; Hornik 1991）是「神經網路什麼都能學」的理論根據。

但重點在**「只要夠寬」**——到底要多寬？這正是下一節的關鍵。

## Barron 定理：繞開維度災難

萬能近似定理的證明是「存在性」的，沒有告訴你需要的寬度 `K`。悲觀地看，對一般函數，`K` 可能隨輸入維度 `d` **指數爆炸**——這就是所謂的維度災難。

**Barron 定理**給了一線生機：它定義了一類「Barron 函數」（頻譜以 `1/|ω|²` 衰減的函數，包含許多光滑函數），證明對這類函數，兩層網路的逼近誤差滿足

```
E[‖f − f̂‖²] ≤ C / K
```

其中 `C` **與輸入維度 `d` 無關**。也就是說，在 Barron 函數類上，樣本/寬度效率是 `O(1/√K)`，**不受維度詛咒**。這解釋了為什麼在低維度到中維度的許多實際問題上，淺網路表現得意外地好。

## 深度為什麼有用：指數級的表達力節省

如果單層網路理論上什麼都能逼近，那為什麼我們都用**很深**的網路？

答案是：**同樣的表達力，深度能大幅省寬度**。對某些函數（特別是組合式、階層式的函數），淺網路需要**指數級寬度**，而深網路只需**多項式寬度**。經典例子：用一個 `O(n)` 寬、`O(1)` 深的網路就能算出的階層函數，若強迫只用 2 層，則寬度需 `O(2ⁿ)`。

Telgarsky 與 Eldan & Shamir 等結果把這件事講嚴了：深度不是錦上添花，而是**表達效率的質變**。這也呼應了 L06（現代 CNN）與後面的 Transformer——深度帶來的階層表示，是淺網路用寬度換不來的。

## 一個最小實驗感受它

用兩層網路擬合一個 1D 函數，看寬度如何影響擬合：

```python
import torch, torch.nn as nn, torch.optim as optim

f_true = lambda x: torch.sin(3*x) + 0.3*torch.cos(7*x)
model = nn.Sequential(nn.Linear(1, 64), nn.Tanh(), nn.Linear(64, 1))
opt = optim.Adam(model.parameters(), lr=1e-2)
x = torch.linspace(-3, 3, 200).unsqueeze(1)
y = f_true(x)
for _ in range(2000):
    opt.zero_grad(); loss = ((model(x)-y)**2).mean(); loss.backward(); opt.step()
print("final MSE:", loss.item())
```

把隱含層寬度從 8 調到 1024，你會看到擬合從「欠擬合」到「絲滑」——這就是寬度在萬能近似定理裡的角色。注意這只是 1D；一旦 `d` 變大且函數不在 Barron 類，所需寬度就會飆升，此時加**深**比加寬更有效。

## 對實作的幾個啟發

- **寬度不是唯一槓桿**：低維、平滑的問題淺網就夠；高維、組合結構的問題，優先加深。
- **不要盲目堆寬度**：超寬淺網在理論上能逼近，但訓練與泛化都差，深網的歸納偏置更適合真實資料。
- **理論給了「為什麼深」的答案**：不是潮流，是表達效率（這也回扣 L13 的歸納偏置與 NTK 視角——極寬極限反而退化成線性核方法）。

## 參考資料

- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Telgarsky, *The Expressive Power of Neural Networks's Depth*：[arXiv:1702.07811](https://arxiv.org/abs/1702.07811)
- Eldan & Shamir, *Benefits of Depth in Neural Networks*：[arXiv:1602.04485](https://arxiv.org/abs/1602.04485)
- 本講選讀 *Deep Learning Theory Notes*（見 [OCW readings](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/readings/)）
