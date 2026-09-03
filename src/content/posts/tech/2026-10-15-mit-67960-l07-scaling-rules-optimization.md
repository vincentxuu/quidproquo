---
title: "MIT 6.7960 L07：優化縮放定律 —— 譜視角、特徵學習與超參數遷移"
date: 2026-08-30
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - optimization
  - scaling
  - maximal-update-parameterization
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 7 講（Jeremy Bernstein）：用譜/幾何視角看神經網路優化，特徵學習與 lazy training 的分野，超參數跨寬度/深度遷移（μP），以及 critical batch size 等優化縮放定律。"
tldr: "優化不是孤立的數值問題：用譜視角看 SGD，權重更新的『量』決定特徵學習；Maximal Update Parameterization 讓學習率與初始化跨寬度遷移，critical batch size 決定算力換取收斂的邊際。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 9
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 16
---

> 🌏 [English version](/posts/tech/2026-10-15-mit-67960-l07-scaling-rules-optimization-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Jeremy Bernstein** 授課，必讀材料為他的筆記 *Steepest Descent*。

---

## 為什麼要單獨講「優化的縮放定律」

前面 L03 講了 SGD / Adam 的機制，L04 講了正則化，L06 講了 CNN 架構。但這些都假設一件事：**網路夠小、超參數夠好調**。一旦你把寬度從 256 拉到 8192、深度從 12 層堆到 100 層，原本調好的 learning rate 會瞬間爆炸或僵死。

第 7 講的核心論點是：**優化行為會隨網路規模系統性地變化，而這種變化是可預測、可遷移的**。你不需要對每一個新寬度重新 grid search——只要理解背後的「縮放定律」，就能直接把小網路的超參數搬到大型網路上。

## 從譜視角看神經網路計算

Bernstein 這一講最有啟發的地方，是把整個前向/反向傳播看成是**矩陣的譜（eigenvalue spectrum）在作用**。

考慮一層線性變換 `y = Wx`。`W` 的奇異值分佈決定了這層是「放大某些方向」還是「壓扁所有方向」。深層網路串接多個 `W` 時，若各層奇異值都大於 1，訊號指數放大（exploding）；都小於 1，訊號指數衰減（vanishing）。所謂好的初始化（Xavier / Kaiming），本質上就是在讓每一層的譜半徑接近 1，使訊號在深層網路中穩定傳播。

反過來看優化：SGD 的更新 `ΔW = -η · g` 其實是在參數空間裡沿著梯度方向走一步。梯度的「方向」由損失曲面決定，但步長 `η` 與 `g` 的「尺度」會隨網路寬度劇烈變化。這就是為什麼寬度一變，原本的 `η` 立刻不能用。

## 特徵學習 vs Lazy Training

這一講點出一個常被忽略的分野：

- **Lazy training（惰性訓練）**：初始化後網路函數幾乎不動，權重只在初始化附近微調。無限寬 NTK 極限下的網路就是這種。好處是理論好分析，壞處是學不到「特徵」——本質上只是把預設的基底做線性組合。
- **Feature learning（特徵學習）**：權重的更新量足夠大，使得網路內部真的重組出對任務有用的表示。這才是深度學習真正厲害的地方。

關鍵變數是**每次更新的幅度（update scale）**。如果 `η` 太小或梯度被過度縮放，網路退化成 lazy regime；如果更新量恰到好處，就進入 feature-learning regime。這給了「怎麼設學習率」一個原則性答案，而不是玄學調參。

## 超參數遷移：Maximal Update Parameterization (μP)

這是整講最實用的結論。Yang et al. (2022) 的 **Maximal Update Parameterization** 證明：存在一種參數化方式，使得**在無限寬極限下，每一層權重的更新量保持有限且與寬度無關**。

直覺：

- 標準 parameterization 裡，某層權重 `W ∈ R^{d×d}`，初始化方差若取 `1/d`，隨 `d` 增大，單次更新的絕對量會縮放。
- μP 的做法是讓輸入側的縮放為 `1/d_in`、輸出側為 `1`（而不是標準的 `1/d_in` 兩邊都縮），使得「權重更新的尺度」在寬度變化時保持常數。

結果：**在小型網路（比如寬度 256）上調好的 learning rate、初始化、以及各項縮放超參數，可以直接套用到寬度 8192 的大型網路上，幾乎不用重調**。這對要訓練基礎模型的團隊是巨大的省時——你只需要在小網路上做一次昂貴的搜尋，再線性外推。

PyTorch 裡可以手動實作 μP 的縮放：

```python
import torch
import torch.nn as nn

class LinearMUP(nn.Module):
    def __init__(self, in_features, out_features, use_mup=True):
        super().__init__()
        self.weight = nn.Parameter(torch.empty(out_features, in_features))
        # μP: std ~ 1/in_features（輸入側縮放），標準 PyTorch 預設是 1/fan_avg
        std = (1.0 / in_features) if use_mup else (1.0 / ((in_features + out_features) / 2)) ** 0.5
        nn.init.normal_(self.weight, 0.0, std)
        self.scale = in_features if use_mup else 1.0  # 前向再做一次 1/in 補償

    def forward(self, x):
        return (self.weight @ x.T).T / self.scale
```

重點不是上面這段程式碼本身，而是它表達的哲學：**參數化決定了超參數如何隨規模縮放**。想讓超參數可遷移，就要設計對的參數化。

## 優化縮放定律：Critical Batch Size

另一條定律來自 McCandlish et al. (2018) 的 *An Empirical Model of Large-Batch Training*。他們發現：給定一個固定算力預算，存在一個 **critical batch size `B_crit`**，

- 當 `batch size < B_crit`：增大 batch 幾乎線性地加快收斂（用更多平行算力換時間）。
- 當 `batch size > B_crit`：邊際效益驟降，繼續加大 batch 只是在浪費算力，因為你被迫用更大的 learning rate，而優化器開始在更平的損失盆地的錯誤方向上邁大步。

實務意涵很直接：不要無腦用最大 batch。算一下你的 `B_crit`（通常可透過小 batch 實驗外推），把 batch 設在臨界值附近，剩下的算力拿去跑更多實驗或更大的模型，而不是單純把一個訓練跑得「看起來更快」。

## 為什麼這對實作重要

這一講把三件原本零散的事串起來：

1. **初始化 / 學習率不是孤立超參數**，它們和網路寬度、深度耦合。
2. **特徵學習需要足夠的更新量**，太小就退化成 lazy regime，大模型尤甚。
3. **縮放是可預測的**：μP 解決「寬度遷移」，critical batch size 解決「算力分配」。

對工程師來說，最直接的收穫是：下次要從 1 億參數擴到 100 億，先在小網路上用 μP 調好超參數，再線性外推，而不是重新 grid search 一輪。

## 參考資料
- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Jeremy Bernstein, *Steepest Descent*（本講必讀筆記）：[作者頁](https://www.jeremybernstein.com/)
- Yang et al., *Tensor Programs V: Tuning Large Neural Networks via Zero-Shot Hyperparameter Transfer* (μP), 2022：[arXiv:2203.03466](https://arxiv.org/abs/2203.03466)
- McCandlish et al., *An Empirical Model of Large-Batch Training*, 2018：[arXiv:1812.06162](https://arxiv.org/abs/1812.06162)
- Kaplan et al., *Scaling Laws for Neural Language Models*, 2020：[arXiv:2001.08361](https://arxiv.org/abs/2001.08361)

