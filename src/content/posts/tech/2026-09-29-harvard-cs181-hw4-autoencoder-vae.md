---
title: "Harvard CS181 HW4（中）：Autoencoder 為何不能生成，VAE 補了什麼"
date: 2026-09-29
category: tech
tags: [harvard, cs181, vae, generative-models, homework, machine-learning]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 7
type: guide
tldr: "HW4 Problem 2 先在 CelebA 64×64 上訓練卷積 autoencoder，再讓你從 N(0, I) 隨機取樣，看它生不出臉；接著推 ELBO、reparameterization 與封閉形式 KL，最後把同一個骨幹改成 VAE，比較兩者的重建與取樣。"
description: "Harvard CS1810 Spring 2026 HW4 Problem 2 逐題導讀：卷積 autoencoder、latent 取樣失敗的原因、ELBO 推導、reparameterization trick、高斯 KL 封閉解與 VAE 實作，並標出 notebook 裡兩種 loss 尺度不同的細節。"
draft: false
glossary:
  - term: "ELBO"
    aliases: ["Evidence Lower Bound", "證據下界"]
    definition: "log p(x) 的一個下界，等於「期望重建對數似然」減掉「近似後驗與先驗的 KL」。最大化它可以取代無法直接計算的 log p(x)。"
    context: "HW4 Problem 2 要你從 KL 定義推出它，再改寫成重建項減 KL 項。"
  - term: "reparameterization trick"
    aliases: ["重參數化技巧"]
    definition: "把 z ~ N(μ, σ²) 改寫成 z = μ + σ ⊙ ε，ε ~ N(0, I)，隨機性移到與參數無關的 ε，梯度就能穿過取樣步驟傳回 μ 與 σ。"
    context: "VAE 能用反向傳播訓練 encoder 的關鍵。"
  - term: "KL divergence"
    aliases: ["KL 散度", "Kullback–Leibler divergence"]
    definition: "衡量一個機率分布相對另一個分布差多遠的量，永遠大於等於 0，兩者相同時為 0；不對稱。"
    context: "VAE loss 用它把 encoder 的輸出分布拉向 N(0, I)。"
---

> 🌏 [English version](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> ⚠️ **版本與存取**：以 [CS1810 Spring 2026 HW4](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw4)（`hw4_release.tex/ipynb`）與 [Section 6 講義](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf)為準，2026-09-29 實際打開。本課整體為 **A3**，但官方課表未列對應講次的公開錄影、沒有作業解答。Section 6 的 autoencoder 段落講到 sparse 與 denoising AE 為止，**沒有涵蓋 VAE**；Week 6 的 Representation Learning / Autoencoders 講課投影片本篇沒有取得，所以 VAE 部分只根據作業題目本身。

這是 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)第 7 篇，接在 [HW4（上）Transformer](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer) 之後。

## 課程影片來源

已核對 CS1810 Spring 2026 官方課表與 syllabus：本文依據作業、section 或考試教材導讀，對應條目未列公開講課影片；官方提供講課投影片與 section 教材。這表示公開課表未提供對應影片，不代表課程從未錄影。

官方來源：

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

查核日期：2026-10-10。

## 場景：它能把臉還原，卻畫不出一張新臉

HW4 Problem 2 的開場很有說服力。你先訓練一個卷積 autoencoder，把 CelebA 的臉壓成 128 維向量再還原，重建看起來不錯。然後題目要你做一件看似合理的事：從標準常態 `N(0, I)` 隨機抽一個 128 維向量，丟給 decoder。出來的東西通常不像臉。

整題就在回答一個問題：**一個能重建的 latent space，為什麼不能拿來生成？VAE 又加了什麼，讓隨便抽一個點也能解碼成像樣的圖？**

題目標題寫 76 分，但各小題標示的分數加起來是 78（12+4、4、8+4+8、4+4+4、8+6+12）。以 Gradescope 實際配分為準，這裡只提醒有落差。

## 直覺：地圖上的空白

把 latent space 想成一張地圖。Autoencoder 的訓練目標只有一個：每張訓練圖的座標，decoder 都要能還原回去。它沒有被要求讓座標落在哪一區，也沒有被要求座標之間的空地有意義。結果是訓練資料散落在地圖上某些奇怪的角落，中間大片空白區域 decoder 從來沒見過。

從 `N(0, I)` 抽樣，等於閉著眼睛往地圖中心附近丟飛鏢。飛鏢多半落在空白處，decoder 只能亂畫。

VAE 的修正是：**規定所有座標都要擠在 `N(0, I)` 那一團裡，而且每張圖不是一個點，是一小片霧**。霧跟霧之間彼此重疊，空白就被填掉了。之後從 `N(0, I)` 抽樣，才會落在 decoder 看過的地方。

## 機制：五個步驟對應五組小題

### 1. Autoencoder 與取樣失敗（1(a) 12 分、1(b) 4 分）

Encoder `f_φ` 把 `x` 壓成 `d` 維 `z`，decoder `g_θ` 還原成 `x̂`，loss 是重建誤差的平均平方和。題目特別強調：**讓一個模型成為 autoencoder 的是「編碼器—解碼器配對加上重建 loss」這個訓練方式，不是某種架構**。

notebook 給了明確的架構指引：

- 資料：Hugging Face 上的 `tpremoli/CelebA-attrs`，訓練集只取前 30,000 張加速，`CenterCrop(178)` 後縮成 64×64
- Encoder：4 層 stride-2 `Conv2d`（通道 3→32→64→128→256），每層接 `BatchNorm2d` + `ReLU`，空間 64→32→16→8→4，攤平成 4096 維後 `Linear(4096, 128)`
- Decoder：用 `ConvTranspose2d` 鏡像回去，最後一層 `Sigmoid`
- 訓練 20 epoch、Adam `lr=1e-3`

1(a) 要附訓練與測試 loss 曲線、前 5 張測試圖與重建；1(b) 用 1–2 句解釋為什麼 AE 沒有理由讓 `N(0, I)` 的樣本解碼成有意義的輸出。上面「地圖上的空白」就是這題要你講的東西。

### 2. 為什麼不直接最大化 log p(x)（2(a) 4 分）

想生成，自然的想法是學出資料分布，用最大概似訓練：

```text
log p(x) = log ∫ p(x | z) p(z) dz
```

問題是這個積分算不出來：`p(x | z)` 是神經網路，`z` 是高維的。題目追問：為什麼不能抽很多 `z ~ p(z)` 再平均 `p(x | z)`？作答方向是想一想：對一張特定的臉，高維空間裡隨機抽到的 `z` 有多少比例會讓 `p(x | z)` 不是幾乎為 0？

### 3. 推出 ELBO（2(b) 共 20 分）

既然真正的後驗 `p(z | x)` 算不出來，就引進一個網路 `q_φ(z | x)` 當近似後驗，用 KL 散度衡量它跟真後驗差多少。三小題依序：

1. 用 Bayes 展開 `log p(z | x)`，整理出 `log p(x) = KL(q ‖ p(z|x)) + ELBO`
2. 因為 KL ≥ 0，所以 `ELBO ≤ log p(x)`，最大化 ELBO 是合理的替代目標
3. 把 `log p(x, z)` 拆成 `log p(x | z) + log p(z)`，改寫成「重建項 − KL(q ‖ p(z))」

<details>
<summary>推導骨架（每一步用到什麼）</summary>

**步驟 1**：從
`KL(q ‖ p(z|x)) = E_q[log q(z|x) − log p(z|x)]`
代入 `log p(z|x) = log p(x, z) − log p(x)`。`log p(x)` 跟 `z` 無關，可以移出期望值。移項後，剩下的期望值就是題目定義的 ELBO。

**步驟 2**：KL 非負，所以 `log p(x) ≥ ELBO`，等號在 `q` 等於真後驗時成立。最大化 ELBO 同時做兩件事：把 `log p(x)` 往上推，並讓 `q` 貼近真後驗。

**步驟 3**：把 `E_q[log p(x, z) − log q]` 裡的 `log p(x, z)` 拆開，`E_q[log p(z) − log q]` 正好是 `−KL(q ‖ p(z))`。

</details>

### 4. 讀懂 VAE loss 的兩項（2(c) 共 12 分）

負的 ELBO 就是 VAE loss：

```text
L_VAE = −E_q[log p(x | z)] + KL(q_φ(z | x) ‖ p(z))
```

三小題問的都是詮釋：

- 第一項怎麼接回第 1 部分的重建 loss（當 `p(x|z)` 是固定變異數的高斯時，負對數似然就是平方誤差加常數）
- 第二項怎麼解決 1(b) 的問題：它懲罰 encoder 輸出偏離 `N(0, I)`，等於把所有「霧」往同一團拉
- 兩項互相拉扯的結果：跟 AE 比，VAE 的重建通常比較模糊，但取樣出來的圖比較像樣。題目把這題叫「Tensity」

### 5. Reparameterization、KL 封閉解與實作（3(a) 8 分、3(b) 6 分、3(c) 12 分）

VAE 的 encoder 共用同一個卷積骨幹，攤平後接兩個線性頭：`fc_mu` 輸出 `μ`，`fc_logvar` 輸出 `log σ²`。

**3(a) Reparameterization**：取樣這個動作對分布參數不可微。改寫成 `z = μ + σ ⊙ ε`、`ε ~ N(0, I)`，隨機性全在 `ε`，`z` 對 `μ`、`σ` 是確定的可微函數，梯度就能傳回 encoder。題目要你證明這樣得到的 `z` 分布確實是 `q_φ(z | x)`。

**3(b) KL 封閉解**：當 `q = N(μ, diag(σ²))`、`p = N(0, I)`，要推出

```text
KL(q ‖ p) = ½ Σⱼ (μⱼ² + σⱼ² − ln σⱼ² − 1)
```

<details>
<summary>推導提示</summary>

對角高斯的 KL 可以逐座標相加。對單一座標 `j`，寫出 `log q(zⱼ) − log p(zⱼ)` 的高斯密度，兩個 `½ log 2π` 抵銷，剩下 `−½ ln σⱼ² − (zⱼ − μⱼ)²/(2σⱼ²) + zⱼ²/2`。取 `q` 下的期望值，用題目給的 `E[zⱼ] = μⱼ`、`E[zⱼ²] = μⱼ² + σⱼ²`：第二項期望值是 `½`，第三項是 `½(μⱼ² + σⱼ²)`。

</details>

**3(c) 實作**：notebook 已經把 `vae_loss` 寫好給你，KL 那行正是 3(b) 的公式用 `logvar` 表示的版本。你要補的是 encoder 骨幹、`reparameterize`（由 `logvar` 算出 `std`，再抽 `eps`），訓練 30 epoch，畫出重建、KL、總 loss 三組訓練與測試曲線，附重建圖，再從 `N(0, I)` 取樣，跟 1(b) 比較。

有一個 notebook 細節值得注意：**AE 的測試 loss 用 `F.mse_loss` 預設的逐像素平均，VAE 的重建項用 `reduction="sum"` 再除以 batch 大小**。一張 3×64×64 的圖有 12,288 個像素，兩種 loss 的數值尺度差很多，別直接拿兩張 loss 曲線的數字比大小。比較 AE 和 VAE 要看圖，不是看 loss 數字。

## 連回生成模型

VAE 的「encoder 把圖壓成分布、decoder 從 latent 還原」這個結構，後來成了影像生成系統的零件之一，例如 [Latent Diffusion](https://arxiv.org/abs/2112.10752) 先用一個 autoencoder 把圖壓進 latent space，再在 latent 裡做擴散生成。HW4 只到原始 VAE 為止；CS181 在 Week 10 接著講 Self-Supervised Learning / Generative Models 與 Contrastive Learning、GANs、EBMs（見[官方課表](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)），對應 HW5。

另外，Section 6 §2.5 有一個跟下一份作業直接相關的結論：線性 encoder／decoder 加平方誤差的 autoencoder，最佳解張成的子空間就是前 m 個主成分，也就是 PCA。非線性 AE 可以看成 PCA 的非線性推廣。這會在 HW5 的 PCA 題再遇到。

## 想深入

- [CMU 11-785 Lecture 22：變分自編碼器](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders)：同一套 ELBO 推導的另一個講法
- [Kingma & Welling 2013, Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114)：VAE 原始論文，reparameterization 與高斯 KL 封閉解都在這裡

## 上一篇／下一篇

- 上一篇：[HW4（上）：Transformer 從手算注意力到多頭](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer)
- 下一篇：[HW4（下）：決策樹、隨機森林與 Mixture of Experts](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。重讀官方課表與 syllabus，仍未列出此主題的公開講課影片。

## 參考資料

- [CS1810 Spring 2026 HW4 題目 hw4_release.tex](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex)
- [CS1810 Spring 2026 HW4 notebook hw4_release.ipynb](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.ipynb)
- [CS1810 Spring 2026 Section 6（Autoencoders and Representation Learning 在 §2）](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf)（[solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06_soln.pdf)）
- [CS1810 Spring 2026 官方課表（Google Sheet）](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CelebA-attrs dataset（Hugging Face, notebook 使用的版本）](https://huggingface.co/datasets/tpremoli/CelebA-attrs)
- [Kingma & Welling 2013, Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114)
- [Rombach et al. 2022, High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
- [CS181 2026 課程網站](https://harvard-ml-courses.github.io/cs181-web/)
