---
title: "MIT 6.7960 L13：表示學習的理論視角 —— 歸納偏置、高斯過程與 NN–GP 對應"
date: 2026-11-26
category: tech
tags:
  - mit-67960
  - deep-learning
  - representation-learning
  - gaussian-process
  - neural-tangent-kernel
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 13 講（Jeremy Bernstein）：架構的歸納偏置如何決定表示，寬網路為什麼會收斂到高斯過程（NN–GP），以及神經切線核（NTK）如何用一個固定核描述無限寬網路的訓練動態。"
tldr: "把網路變寬到極限，它的隨機初始化輸出會變成一個高斯過程（NN–GP），而訓練動態則由神經切線核（NTK）固定下來。這套理論不只能用來分析，還反過來指導我們設計『對的歸納偏置』。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 15
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 22
---

> 🌏 [English version](/posts/tech/2026-11-26-mit-67960-l13-representation-theory-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Jeremy Bernstein** 授課，選讀含 *Kernel Methods for Deep Learning* 與 *Neural Networks as Gaussian Processes*。

---

## 歸納偏置：架構在「替你做假設」

前面談了很多「怎麼學表示」，但這一講先退一步問：**表示長什麼樣，其實在很大程度被架構本身決定了**。這就是 **inductive bias（歸納偏置）**——網路在還沒看到資料之前，就因為結構而偏好某一類函數。

- CNN 的局部連接 + 權重共享，等於假設「空間平移不變、局部相關」。
- RNN 的遞歸，等於假設「時間上共享同一套轉移規則」。
- Transformer 的全局注意力，等於假設「任意兩個位置都可能有依賴」。

所以選架構不是美學問題，而是在**選你要先相信資料的哪種結構**。這也解釋了為什麼圖片用 CNN 資料效率高、文字用 Transformer 上限高——歸納偏置和資料性質對得上，就贏在起跑點。

## 寬網路 → 高斯過程（NN–GP）

精彩的理論結果來了。考慮一個**單隱層、隱含層極寬**的網路，權重隨機初始化：

```
f(x) = Σ_{k=1}^{K} a_k · φ(w_kᵀ x + b_k)     （K → ∞）
```

根據**中心極限定理**，當 `K → ∞` 時，對任意一組輸入 `{x_1 … x_n}`，網路的輸出 `{f(x_1) … f(x_n)}` 會收斂到一個**多元高斯分佈**。也就是說：一個隨機初始化的無限寬網路，本身就是一個**高斯過程（Gaussian Process）**，其核函數由激活函數與權重分佈決定。這就是 **NN–GP（Neural Network – Gaussian Process）對應**（Neal 1994; Lee et al. 2018）。

直覺上：每一個寬隱層神經元是一個「隨機特徵」，把它們加總（權重隨機）就等於對一堆隨機特徵做平均——平均得越多，分佈越接近高斯。

可以用一個極簡的 numpy 片段感受這件事：

```python
import numpy as np

def nn_gp_sample(xs, K=200000, width=64):
    # 每個隱元對輸入做隨機投影再取 relu，最後對 K 個隱元平均
    rng = np.random.default_rng(0)
    out = np.zeros(len(xs))
    for _ in range(K):
        w = rng.normal(size=width)
        b = rng.normal()
        h = np.maximum(0, xs @ w + b)        # relu 隨機特徵
        a = rng.normal()                      # 隨機輸出權重
        out += a * h
    return out / np.sqrt(K)                   # 平均 → 趨近高斯

xs = np.linspace(-3, 3, 50)
samples = np.stack([nn_gp_sample(xs) for _ in range(5)])
```

跑出來的 5 條函數曲線，看起來就像從某個平滑 GP 抽出的樣本——這正是 NN–GP 的直覺。

## 訓練動態 → 神經切線核（NTK）

NN–GP 描述的是**隨機初始化**的網路。那訓練之後呢？ **神經切線核（NTK, Jacot et al. 2018）** 給了答案：在無限寬極限下，訓練過程中網路的「函數空間梯度」由一個**固定不動的核** `Θ` 決定，而且整個訓練軌跡可以寫成核回歸的閉式解。

換句話說：無限寬網路的訓練**等價於一個固定的核方法**。這有兩個重要含義：

1. **它解釋了為什麼極寬網路好訓**：NTK 是固定的、正定的，梯度下降收斂有保證。
2. **它也點出極寬網路的極限**：因為核固定，網路其實退化成「線性模型」，學不到特徵（回到 L07 講的 lazy training regime）。這正是為什麼**真實的深度學習優勢來自有限寬、feature learning regime**——NTK 描述不了那個區域。

## 這套理論對實作有什麼用

別以為這只是數學遊戲：

- **用 NTK / NN–GP 做貝氏式不確定性估計**：不用訓練就能對網路輸出建模不確定性。
- **指導架構設計**：歸納偏置決定表示，所以「先想清楚資料結構，再選架構」不是空話。
- **解釋 scaling 的邊界**：當寬度趨近無限，收益會飽和（核固定）；要繼續提升，得靠深度與 feature learning，而不是無腦加寬。

## 為什麼這對實作重要

這一講把前面零散的線索收口：**歸納偏置決定表示長相（L13 本體），寬度極限決定理論可分析但退化（NTK/NN–GP），而真正的深度學習威力在有限寬的 feature learning regime（L07）**。三者合起來，才是一個完整的「網路為什麼這樣學」的圖像。

下一講（L14）轉向生成模型：從密度 / 能量模型到 GAN、自回歸與擴散。

## 參考資料

- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Lee et al., *Deep Neural Networks as Gaussian Processes*：[arXiv:1711.00165](https://arxiv.org/abs/1711.00165)
- Matthews et al., *Gaussian Process Behaviour of Wide Neural Networks*：[arXiv:1804.11271](https://arxiv.org/abs/1804.11271)
- Jacot et al., *Neural Tangent Kernel*：[arXiv:1806.07572](https://arxiv.org/abs/1806.07572)
