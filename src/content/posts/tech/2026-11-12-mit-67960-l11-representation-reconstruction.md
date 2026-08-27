---
title: "MIT 6.7960 L11：表示學習（重建式）—— 自編碼器、VQ 與自監督"
date: 2026-11-12
category: tech
tags:
  - mit-67960
  - deep-learning
  - representation-learning
  - autoencoder
  - self-supervised
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 11 講（Phillip Isola）：什麼是表示學習、為什麼大腦與網路都需要好表示，自編碼器與向量量化（VQ），以及用「重建損失」做自監督學習的核心思路。"
tldr: "表示學習的目標是把原始資料壓成「好用」的向量：自編碼器用重建逼出有意義的潛空間，VQ 把連續表示離散化成碼本，自監督則用『遮住一部分再重建』來免費產生監督訊號。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 13
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 20
---

> 🌏 [English version](/posts/tech/2026-11-12-mit-67960-l11-representation-reconstruction-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Phillip Isola** 授課，必讀材料為 *Representation Learning*。

---

## 什麼是「表示」，為什麼它重要

深度學習真正的產品不是最後那層分類器，而是**中間那個把輸入壓縮成的向量表示（representation）**。同一張貓的圖，經過好的表示之後，貓與貓會在向量空間裡靠近、貓與汽車會遠離——下游任務（分類、檢索、生成）都因此變簡單。

這一講點出一個有趣的事實：**大腦也在做表示學習**。視覺皮層的細胞對特定朝向、運動、物體選擇性放電，本質上就是一組學來的表示。所以我們追求的不是某個神秘技巧，而是一個可計算、可訓練的「好表示」定義。

## 自編碼器：用重建逼出潛空間

最經典的框架是 **autoencoder**：

```
輸入 x → 編碼器 Encoder → 潛向量 z → 解碼器 Decoder → 重建 x̂
目標：min ‖x − x̂‖²
```

編碼器把 `x` 壓成低維 `z`，解碼器再從 `z` 還原。因為 `z` 的維度遠小於 `x`，網路被迫**丟掉冗餘、保留重建所需的最關鍵資訊**——這正是表示學習。

PyTorch 最小實作：

```python
import torch.nn as nn

class Autoencoder(nn.Module):
    def __init__(self, in_dim=784, hidden=256, latent=32):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Flatten(),
            nn.Linear(in_dim, hidden), nn.ReLU(),
            nn.Linear(hidden, latent),
        )
        self.decoder = nn.Sequential(
            nn.Linear(latent, hidden), nn.ReLU(),
            nn.Linear(hidden, in_dim), nn.Sigmoid(),
        )

    def forward(self, x):
        z = self.encoder(x)
        return self.decoder(z), z
```

訓練時只優化 `‖x − x̂‖²`，`z` 會自然長成一個有意義的潛空間（雖然不一定「語意解耦」，但確實 capture 了主要變異）。

## 向量量化（VQ）：把表示離散化

純連續 `z` 有個問題：潛空間可能是不連續、破碎的。 **Vector Quantisation (VQ)** 的解法是引入一個**碼本（codebook）** `e_1 … e_K`，把 `z` 替換成碼本裡「最近的」那個向量：

```
z_q = argmin_k ‖z − e_k‖   →   用 e_k 當作離散表示
```

這讓表示變成**離散索引**（像文字的 token），好處是可以直接接語言模型、做生成，也讓潛空間更規整。VQ-VAE 就是這個想法配上變分推論，後來演化出 VQ-GAN、SoundStream 等一系列生成模型。

## 自監督：用重建「免費」產生監督

標註資料很貴，但**資料本身就有結構**。自監督學習的精髓是：設計一個「 pretext task（ pretext 任務）」，讓模型從資料內部產生監督訊號。重建式自監督最常見的做法是 **masking（遮罩）**：

- 把輸入的一部分蓋掉（圖片補洞、文字挖詞、語音遮段）。
- 逼模型根據剩餘部分重建被蓋住的部分。

因為「答案」就藏在輸入裡，不需要任何人標註。BERT 的 masked language modeling、MAE（Masked Autoencoder）的影像重建，都是這條思路。訓練完後，那個_encoder_ 產出的表示往往對下游任務極其通用——這也是今天大模型預訓練的基石。

## 幾個實作上要注意的點

- **瓶頸別太寬**：潛向量維度太大，自編碼器會學到「直接記憶」輸入（恆等映射），表示就退化成無意義的壓縮。
- **重建損失要看資料型態**：連續用 MSE、二值用 BCE、離散用 CE——選錯損失，潛空間性質差很多。
- **VQ 的碼本容易坍塌**：少數碼被頻繁使用、多數碼閒置。需要用 codebook loss + 使用頻率正則來緩解。
- **masking 的比例要夠高**：蓋太少模型靠局部插值就能過關，學不到全域結構。

## 為什麼這對實作重要

表示學習是連接「監督學習」與「生成模型 / 基礎模型」的橋樑：

- 想要**少標註做分類**？先用自監督預訓練一個好 encoder，再用少量標註 fine-tune。
- 想要**做生成**？離散表示（VQ）讓你能用語言模型的方式生成影像 / 語音。
- 想要**檢索 / 相似度**？好表示讓「最近鄰」就有意義。

下一講（L12）會從「重建」轉向「相似性」——用對比學習讓同類表示靠近、異類推遠。

## 參考資料

- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Bengio et al., *Representation Learning: A Review and New Perspectives*：[arXiv:1206.5538](https://arxiv.org/abs/1206.5538)
- Van den Oord et al., *Neural Discrete Representation Learning (VQ-VAE)*：[arXiv:1711.00937](https://arxiv.org/abs/1711.00937)
- 本講必讀 *Representation Learning*（見 [OCW readings](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/readings/)）
