---
title: "MIT 6.7960 L12：表示學習（相似性式）—— 度量學習、對比學習與 InfoNCE"
date: 2026-08-30
category: tech
tags:
  - mit-67960
  - deep-learning
  - representation-learning
  - contrastive-learning
  - infonce
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 12 講（Sara Beery）：從度量學習到對比學習，InfoNCE 的資訊論直覺，alignment 與 uniformity 兩大性質，以及 hard negative 的選法。"
tldr: "相似性式表示學習不重建輸入，而是直接塑造潛空間的幾何：讓同類表示靠近、異類推遠。InfoNCE 把這件事寫成『在一堆負樣本裡認出正樣本』的分類問題，而 alignment / uniformity 給了它可解釋的評價指標。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 14
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 21
---

> 🌏 [English version](/posts/tech/2026-11-19-mit-67960-l12-representation-similarity-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Sara Beery** 授課，必讀材料同 L11 的 *Representation Learning*，選讀含 *Alignment and Uniformity* 與對比學習專文。

---

## 重建式不夠時：直接定義「相似性」

L11 的重建式學習是「把輸入壓回去」間接逼出好表示。但很多時候我們關心的就是**兩個樣本像不像**——搜尋引擎、推薦、人臉驗證都是這種需求。這時更直接的做法是**相似性式（similarity-based）表示學習**：不去重建，而去**塑造潛空間的幾何**。

核心目標只有一句：**同類樣本的表示靠近，異類樣本的表示推遠**。

## 從度量學習到對比學習

早期做法是 **metric learning**：設計一個損失（如 triplet loss）讓 anchor 與正樣本距離小於 anchor 與負樣本距離加一個 margin。問題是它一次只看一對（anchor / pos / neg），資訊效率不高。

**對比學習（contrastive learning）** 把規模放大：每個樣本配一個正樣本（通常是同一張圖的增強視圖）+ 一堆負樣本（batch 裡其他樣本），目標是**在一堆負樣本中把正樣本認出來**。這本質上是個 `K+1` 分類問題。

## InfoNCE：把對比寫成分類

InfoNCE 是最常用的對比損失，資訊論視角乾淨：

```
L = −log  exp(sim(z_i, z_i⁺) / τ) / Σ_{j=0..K} exp(sim(z_i, z_j) / τ)
```

- `z_i` 是 anchor，`z_i⁺` 是正樣本，`z_j`（j≠i）是負樣本。
- `sim` 通常用餘弦相似度，`τ` 是溫度，控制分布的尖銳程度。
- 分母把「所有候選」都納入，逼模型在 K 個干擾項中找出唯一正確的那個。

PyTorch 實作（簡化版，NT-Xent 風格）：

```python
import torch
import torch.nn.functional as F

def info_nce(z, z_pos, temperature=0.1):
    # z, z_pos: (batch, dim)，已 L2-normalized
    z = F.normalize(z, dim=-1)
    z_pos = F.normalize(z_pos, dim=-1)
    batch = torch.cat([z, z_pos], dim=0)          # 2N
    sim = torch.matmul(batch, batch.t()) / temperature
    N = z.size(0)
    # 正樣本對：i 與 i+N 互為正樣本
    labels = torch.arange(N, device=z.device)
    logits = torch.cat([sim[:N, N:], sim[N:, :N]], dim=1)
    return F.cross_entropy(logits, labels)
```

## Alignment 與 Uniformity：兩個可解釋的性質

Wang & Isola (2020) 給了對比表示兩條簡潔的評價準則：

- **Alignment（對齊）**：正樣本對的表示應該靠得近（期望距離小）。
- **Uniformity（均勻）**：所有表示的分布應該盡量均勻地攤在單位超球面上，不要塌縮成一點。

這兩條看似矛盾，其實互補：對齊保證「同類聚在一起」，均勻保證「不同類有空間分開、資訊不丟失」。一個好的對比表示應該同時滿足兩者。這也解釋了很多工程現象——如果只用 alignment（例如單純讓正對距離=0），模型會塌縮（collapse）成常數向量；必須有 uniformity 的推力才撐得住。

## Hard Negative：讓對比「有難度」

負樣本如果隨便從 batch 抽，大多會是「太簡單」的（明顯不同類），模型學不到東西。 **Hard negative** 是「和 anchor 相似、但其實不同類」的樣本，逼模型區分細微差異。

常用策略：

- **in-batch hard negatives**：在 batch 內挑相似度最高的非正樣本。
- **預計算檢索**：用現有表示撈出最近的幾個作為 hard negative。
- **溫度退火／損失加權**：對困難負樣本給更高權重。

但要小心：**太 hard 的負樣本可能是標錯的（false negative）**——例如同一隻貓的兩張不同照片被當成負對，反而傷害訓練。所以 hard negative mining 需要配合資料品質與適度隨機。

## 為什麼這對實作重要

- **自監督預訓練的標準配方**：SimCLR、MoCo、CLIP 全是對比學習的變體。
- **溫度 τ 很關鍵**：太小會過度關注 hard negative（易崩），太大則所有負樣本等權（學不動）。
- **防崩縮是頭號難題**：除了 uniformity 推力，還有 stop-gradient（BYOL）、predictor（SimSiam）等不用負樣本的解法。
- **正樣本從哪來**：通常是資料增強（crop、color jitter、mask），增強的強度直接決定學到的不變性。

下一講（L13）會從理論視角看：為什麼架構的歸納偏置（inductive bias）決定了表示長什麼樣，以及寬網路與高斯過程的神祕對應。

## 參考資料

- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Oord et al., *Representation Learning with Contrastive Predictive Coding (CPC / InfoNCE)*：[arXiv:1807.03748](https://arxiv.org/abs/1807.03748)
- Chen et al., *SimCLR*：[arXiv:2002.05709](https://arxiv.org/abs/2002.05709)
- Wang & Isola, *Understanding Contrastive Representation Learning via Alignment and Uniformity*：[arXiv:2005.10242](https://arxiv.org/abs/2005.10242)
