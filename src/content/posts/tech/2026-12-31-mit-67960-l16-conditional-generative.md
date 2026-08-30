---
title: "MIT 6.7960 L16：條件生成模型（Conditional Generative Models）—— cGAN、cVAE 與 Classifier-Free Guidance"
date: 2026-08-30
category: tech
tags:
  - mit-67960
  - deep-learning
  - conditional-generative
  - cgan
  - cvae
  - classifier-free-guidance
  - diffusion
  - text-to-image
  - fall-2024
lang: zh-TW
description: "MIT 6.7960 Fall 2024 OCW 第 16 講（Phillip Isola）：怎麼讓生成模型聽「指示」？cGAN / cVAE 把條件 y（類別、文字、影像）注入生成器與判別器/編碼器；擴散時代靠 Classifier Guidance 與 Classifier-Free Guidance 控制生成；最後串到 text-to-image（Stable Diffusion、Imagen）的實際工作流。"
tldr: "條件生成的關鍵是「把 y 餵進模型」：cGAN 在 G/D 拼接 y，cVAE 把 y 當額外輸入進 encoder/decoder；擴散模型時代，Classifier Guidance 用外部分類器梯度把生成推向指定類別，Classifier-Free Guidance 則同訓練 conditional + unconditional 並在推論時線性組合兩者——後者是 Stable Diffusion / Imagen 的標準武器。"
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 19
additionalSeries:
  - name: "世界名校 AI／CS 課程地圖"
    order: 27
---

> 🌏 [English version](/posts/tech/2026-12-31-mit-67960-l16-conditional-generative-en)

> **教材版本**：基於 **MIT 6.7960 Fall 2024 OCW**（對應 OCW Lec 16）。影片、投影片、作業全公開於 [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)。本講由 **Phillip Isola** 授課。

---

## 從「生成」到「條件生成」

L14–L15 都在生成 `x`，但實務上我們更常需要的是**給條件 `y`，生成對應的 `x`**：`y` 可能是類別、句子、另一張影像。條件生成模型回答的問題是：`p(x | y)` 怎麼估、怎麼採樣。

## cGAN：把 y 塞進 G 和 D

最直接的做法是 **conditional GAN (Mirza & Osindero, 2014)**：把條件 `y` 與 `z`（噪聲）拼接送進生成器 `G`，把 `y` 與真/假樣本一起送進判別器 `D`。訓練目標不變：

```
min_G max_D  E[log D(x|y)] + E[log(1 − D(G(z|y)))]
```

直觀：生成器必須「根據 `y` 生成看起來對的東西」，判別器必須「看 `(x, y)` 判真假」。MNIST 條件生成（指定數字 0–9）是經典玩具實驗。

最小 cGAN 訓練骨架：

```python
import torch, torch.nn as nn
G = nn.Sequential(nn.Linear(z_dim+num_classes, 256), nn.ReLU(),
                  nn.Linear(256, 784), nn.Sigmoid())
D = nn.Sequential(nn.Linear(784+num_classes, 256), nn.LeakyReLU(),
                  nn.Linear(256, 1))
def embed(y, K):           # one-hot
    e = torch.zeros(y.size(0), K, device=y.device); e[range(y.size(0)), y] = 1; return e
# 訓練: D 看 (x, y); G 從 (z, y) 生 x
```

## cVAE：把 y 塞進 encoder / decoder

對 L15 的 VAE 同理：**conditional VAE** 把 `y` 當作 encoder / decoder 的額外輸入，

```
q(z | x, y),   p(x | z, y),   p(z)
```

ELBO 變成 `E_q[log p(x|z,y)] − KL(q(z|x,y) ‖ p(z))`。實務上 `y` 可類別 one-hot、文字 embedding、座標等。這是後來 text-to-image VAE / 影像修復（inpainting）變體的基礎。

## 擴散時代的條件控制

擴散模型把生成拆成「反覆去噪」（L14 提過），條件生成有兩條主流路線：

### Classifier Guidance（Dhariwal & Nichol 2021）

訓練好 conditional 擴散 `p_θ(x_t | x_{t+1}, y)` **之外**，另外訓練一個分類器 `p(y | x_t)`，在反噪過程中加一個「往指定類別」的梯度項：

```
x_{t−1} ← x_t − γ · ∇_{x_t} log p(y | x_t) + 噪聲
```

`γ` 控制條件強度，越大越「聽話」、多樣性下降。問題：需要另外訓練一個能在噪聲影像上分類的模型。

### Classifier-Free Guidance（Ho & Salimans 2022）

更乾淨的解法：**同一個模型同時訓練 conditional 和 unconditional 兩種**，實作上把 `y` 換成一個特殊的「空 token」得到 unconditional。推論時線性組合：

```
ε̂ = (1 + w) ε_θ(x_t | y) − w ε_θ(x_t | ∅)
```

`w` 控制聽話程度。`w = 0` 是純 conditional，`w` 越大越向條件貼齊（取樣多樣性下降）。**這是 Stable Diffusion、Imagen 等 text-to-image 的標準配備**。

## Text-to-Image 的實際工作流

把這幾講串起來，今天一個 text-to-image 系統大致是：

1. **文字編碼**（L11/L12 表示學習）：CLIP-style text encoder 把 prompt 變成 embedding `y`。
2. **條件生成**：用 Latent Diffusion（在 VAE 的 latent 空間做擴散，節省算力），Classifier-Free Guidance 把生成推向 prompt。
3. **解碼**：用 VQ-VAE / KL-VAE 的 decoder 把 latent 變回像素。

也就是 **VAE latent + 條件擴散 + CFG** 三者組合，是當前 SOTA 的基本配方。

## 取捨與常見失敗模式

- **CFG 權重太強**：影像會「過飽和」、紋理失真、少樣性。
- **Prompt 不夠具體**：模型退化成 mean-image（VAE 系的根本毛病）。
- **y 與 x 沒對齊**：微調階段用 LoRA / DreamBooth 把新概念「塞進」模型的條件空間。
- **可控性 vs 多樣性**：這是條件生成的根本權衡，沒有銀彈。

## 參考資料

- MIT 6.7960 OCW（Fall 2024）：[課程首頁](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Mirza & Osindero, *Conditional Generative Adversarial Nets*：[arXiv:1411.1784](https://arxiv.org/abs/1411.1784)
- Ho & Salimans, *Classifier-Free Diffusion Guidance*：[arXiv:2207.12598](https://arxiv.org/abs/2207.12598)
- Dhariwal & Nichol, *Diffusion Models Beat GANs on Image Synthesis*：[arXiv:2105.05233](https://arxiv.org/abs/2105.05233)
