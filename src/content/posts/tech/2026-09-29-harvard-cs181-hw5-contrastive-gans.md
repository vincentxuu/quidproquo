---
title: "Harvard CS181 HW5（下）：SimCLR 對比學習與 GAN，不靠標籤學表示、不靠似然做生成"
date: 2026-09-29
category: tech
tags: [harvard, cs181, machine-learning, homework, self-supervised-learning, contrastive-learning, gan, generative-models]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 10
type: guide
tldr: "HW5 的 Problem 1–2 都是「把學習變成分類題」：SimCLR 的 NT-Xent 損失是在 2N−1 個候選裡找出同一張圖的另一個增強版本，GAN 的判別器是在分真假。作業要你推出這兩件事的數學（交叉熵等價、最佳判別器與 JS divergence），再在 FashionMNIST 與 MNIST 上把兩套訓練迴圈寫出來。"
description: "逐週導讀 Harvard CS1810 Spring 2026 HW5（due 2026-04-19）Problem 1–2：SimCLR 的 NT-Xent 損失、溫度 τ、表示坍縮與資料增強、投影頭與線性評估，以及原始 minimax GAN 的最佳判別器、Jensen–Shannon divergence 詮釋與交替訓練迴圈。對照 schedule 第 10 週與 Section 8。"
draft: false
glossary:
  - term: "NT-Xent"
    aliases: ["NT-Xent loss", "normalized temperature-scaled cross-entropy"]
    definition: "SimCLR 用的對比損失：把一個增強視圖跟同批所有其他視圖的餘弦相似度除以溫度 τ 後做 softmax，要求同一張圖的另一個視圖機率最高。"
    context: "HW5 Problem 1 要推導它等價於交叉熵，並在 notebook 裡實作。"
  - term: "Jensen–Shannon divergence"
    aliases: ["JS divergence", "JSD"]
    definition: "衡量兩個機率分布差異的對稱量，等於兩個分布各自對它們平均分布的 KL divergence 取平均；兩分布相同時為 0。"
    context: "HW5 Problem 2 要證明判別器最佳時，GAN 目標等於常數加上 JS divergence 項。"
---

> 🌏 [English version](/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans-en)

> ⚠️ **版本與存取**：以 [CS1810 Spring 2026 HW5](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw5)（`hw5_release.tex/.pdf/.ipynb`）、[官方 schedule](https://harvard-ml-courses.github.io/cs181-web/schedule) 第 10 週、[Section 8](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08.pdf)（標頭 Spring 2026）為準。第 10 週的講題（SSL、Contrastive、GAN、EBM）是 2026 新排的，**2024 scribe notes 沒有對應講義**，課程也無當期錄影，所以本篇的講課側資訊只來自 Section 8 與作業本身。作業解答未公開，Section 8 有 [soln](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08_soln.pdf)。存取分級 **A3**，同[系列總覽](/posts/tech/2026-08-27-harvard-cs181-overview)。

本篇是 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)第 10 篇。上一篇是 [HW5（上）：K-means、HAC 與 PCA](/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca)，下一篇是 [HW6（一）：自迴歸模型的解碼、KV Cache 與 Speculative Decoding](/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding)。

上一篇的 K-means 與 PCA 都在「重建」：用群中心或幾個主成分把影像拼回來，誤差越小越好。這篇的兩題換了思路。SimCLR 不重建任何東西，只要求網路認出「這兩張是同一張圖的不同裁切」。GAN 不算資料的似然，只要生成的樣本騙得過一個判別器。兩題的共同點是 [Section 8](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08.pdf) 第 5 節的標題：**把學習看成一個分類問題**。

## 在 2026 課表的位置

| 項目 | 官方內容 |
|---|---|
| 對應講課 | 第 10 週：Mar 31「Self-Supervised Learning / Generative Models」、Apr 2「Contrastive Learning, GANs, and EBMs」 |
| 對應 section | Section 8「Deep Learning Medley: Self-Supervised Learning and Generative Modeling, Contrastive Learning, GANs, Energy-Based Models」（schedule 排在第 11 週那格，寫作「S8: Generative Modeling Medley」） |
| 作業 | HW5 Problem 1（SimCLR）、Problem 2（GANs）；2026-04-03 釋出，`\duedate` April 19, 2026 11:59pm |
| 程式 | 同一本 `hw5_release.ipynb` 的 Problem 1、Problem 2 兩段 |

HW5 的 tex 沒有寫各題分數。

## Problem 1：SimCLR 與對比學習

### 設定

一批 N 張圖，每張做兩次隨機增強，得到 2N 個視圖；同一張圖的兩個視圖是正樣本對。每個視圖經過編碼器 f、投影頭 g，再做 ℓ2 正規化得到 z。對正樣本對 (i, j)，NT-Xent 損失是：

```text
ℓ(i,j) = −log [ exp(zᵢᵀzⱼ/τ) / Σ_{k≠i} exp(zᵢᵀzₖ/τ) ]
```

分母對其餘 2N−1 個視圖加總，τ 是溫度。

### 四個小題

**1. NT-Xent 與溫度。**
(a) 證明 ℓ(i,j) 等價於一個 (2N−1) 類分類的交叉熵：正確類別是 j，其餘 2N−2 個是負樣本。
(b) 看負樣本 k 拿到的 softmax 權重 wₖ，說明 τ→0⁺ 和 τ→∞ 各會發生什麼，以及為什麼實務上選中間值。

(a) 的直覺在 Section 8 第 5 節已經寫出來：InfoNCE 就是一個 softmax 分類，模型要在一堆候選裡選出真正的配對。(b) 可以這樣想：τ 越小，softmax 越接近 argmax，權重幾乎全壓在最像的那個負樣本上；τ 越大，所有負樣本權重趨於一樣，模型分不出難易。notebook 的公開測試 `test_nt_xent_temperature_effect` 檢查的正是「溫度低時損失較高」。

**2. 表示坍縮與資料增強。**
(a) 如果編碼器把所有輸入都映到同一個單位向量 c，所有相似度都是 1，此時 ℓ(i,j) 等於多少？
(b) 為什麼下游任務常用編碼器輸出 h = f(x)，而不是投影頭輸出 z = g(f(x))？
(c) 增強太強或太弱，各會對學到的表示造成什麼影響？

(a) 算完你會得到一個只跟 N 有關的常數。這個數字說明坍縮解不是損失的最小值，負樣本項會把它推開。(c) 可以對照 notebook 實際用的增強：`RandomResizedCrop(28, scale=(0.6, 1.0))`、水平翻轉、±15° 旋轉、機率 0.5 的高斯模糊。想一想，如果把裁切比例放寬到只剩 10% 的畫面，兩個視圖還看得出是同一件衣服嗎？

**3. 實作（程式）。** 兩個元件：
- 兩層投影頭：`Linear → ReLU → Linear`
- NT-Xent 損失，題目把流程拆成六步：ℓ2 正規化 → 串成 2N×d 矩陣 → 算 2N×2N 餘弦相似度並乘 1/τ → 遮掉自己對自己 → 找出每個視圖的正樣本索引 → 以正樣本索引為目標算交叉熵

notebook 的註解補了兩個細節：對角線設成 `-inf`；前 N 個視圖的正樣本在 `i+N`，後 N 個在 `i-N`。寫完先跑「Check 1.2.c: Hand Calculation」（τ=1.0 的手算值）和「Check 1.2.d: Public Test Cases」。

**4. 訓練與線性評估（程式）。**
(a) 在 FashionMNIST 上不看標籤預訓練編碼器與投影頭；
(b) 凍結編碼器，在學到的特徵上做線性評估；
(c) 跟同架構的監督式 baseline 比準確率。

notebook 給的超參數：`SIMCLR_EPOCHS = 10`、`SIMCLR_BATCH_SIZE = 512`、`SIMCLR_LR = 1e-3`、`SIMCLR_TEMPERATURE = 0.5`、投影頭隱藏層 128、輸出 64 維。線性評估預設 20 epoch、監督式 baseline 10 epoch。預訓練是最花時間的一步，notebook 提供 `RUN_SIMCLR_TRAINING` 開關，開發前面幾格時可以先關掉。

## Problem 2：GAN 與 Jensen–Shannon divergence

### 設定

原始 minimax 目標：

```text
min_G max_D V(D,G) = E_{x~p_data}[log D(x)] + E_{z~p_z}[log(1 − D(G(z)))]
```

p_g 是 x = G(z) 誘導出來的分布。

### 三個小題

**1. 把 GAN 解讀成 JS divergence（書面）。** 固定 G：
(a) 用 p_data(x) 與 p_g(x) 寫出最佳判別器 D*(x)；
(b) 把 D* 代回目標，證明結果是常數加上 JS divergence 項；
(c) 用文字說明這對生成器的目標意味著什麼。

(a) 的關鍵是 V 可以寫成對 x 的積分，對每個 x 分別對 D(x) 最大化；Section 8 第 7.1 節直接給了答案的形式，可以拿來核對。(b) 代回去之後，把 log 裡的分母湊成「兩分布的平均」，就能看出兩個 KL 項。(c) 的結論是：判別器夠強時，生成器在最小化 p_g 和 p_data 之間的 JS divergence。

**2. 從推導到訓練演算法（書面）。** 寫出判別器目標、生成器目標，描述實務上的交替訓練。

這裡要注意 Section 8 第 6 節寫的生成器損失是 `L_G = E_z[−log D(G(z))]`，不是直接最小化 minimax 裡的 `log(1 − D(G(z)))`。兩者的訓練動態有相同的固定點，但[原始 GAN 論文](https://arxiv.org/abs/1406.2661)指出，訓練初期判別器能輕易分辨假樣本，`log(1 − D(G(z)))` 會飽和、梯度太小，改成最大化 `log D(G(z))` 梯度比較強。作業問的是「實務上用的」訓練迴圈，寫的時候說清楚你用的是哪一個、為什麼。

**3. 實作（程式）。** 在 notebook 裡：定義生成器與判別器、實作判別器在真假兩批上的損失、實作生成器損失、寫一個 epoch 的交替更新、跑多個 epoch 並視覺化生成樣本。

notebook 的設定：MNIST、`batch_size = 128`、`latent_dim = 100`、影像攤平成 `28 * 28`、像素正規化到 `[-1, 1]`（配合生成器輸出範圍）、兩個 Adam 優化器 `lr = 2e-4`、`num_epochs = 20`。Subpart 2.1.d 的說明寫得很清楚：判別器用真實影像與 **detach 過的**假影像更新，生成器再用一批新的雜訊更新。忘了 detach，判別器的梯度會流進生成器。

## 兩題怎麼接起來

Section 8 最後用 energy-based model 把三件事統一：

| 方法 | 「能量」是什麼 | 負樣本從哪來 | 目標 |
|---|---|---|---|
| 對比學習 | 相似度函數 | 資料集裡的其他樣本 | 分辨正負樣本 |
| GAN | 判別器的 logit | 生成器產生的樣本 | 對抗訓練 |
| EBM | 明確建模的 E(x) | 雜訊、生成器或 MCMC | 用推—拉動態最大化似然 |

Section 8 第 5 節末尾給了從 SimCLR 走到 GAN 的理由：隨機抽到的負樣本太容易分，模型只學到表面線索；高維空間裡自然出現的「難負樣本」又很少。那能不能**學一個會產生難負樣本的分布**？這就是生成器。做 Problem 2 時把判別器當成「分真假的分類器」、把生成器當成「越來越難纏的負樣本產生器」，兩題就是同一個故事的前後半。

EBM 這一段作業沒有出題，只在 Section 8 出現。

## 做題順序建議

1. 先寫 Problem 1 的兩個書面小題。(1a) 的交叉熵等價寫出來後，第 3 小題的實作步驟 vi「以正樣本索引為目標算交叉熵」就是它的直接翻譯。
2. 寫 NT-Xent 時先過手算檢查，再過公開測試，最後才打開 `RUN_SIMCLR_TRAINING`。
3. Problem 2 先推 D*，用 Section 8 第 7.1 節核對，再代回去湊 JS divergence。
4. GAN 訓練迴圈先跑 1 個 epoch，印出判別器與生成器的損失，確認兩者都在動，再跑滿 20 個。

## 自我檢測

- NT-Xent 的分母為什麼排除 k = i，卻包含正樣本 j？
- τ 很小時，哪一個負樣本主宰梯度？這對「難負樣本」意味著什麼？
- 坍縮解的損失值算出來是多少？它跟隨機猜的交叉熵有什麼關係？
- 判別器最佳時 D*(x) = 1/2 代表什麼？
- 為什麼更新判別器時要 detach 假影像？

## 延伸閱讀

- 站內 [CS230 導讀：Supervised、Self-Supervised 與 Weakly Supervised Learning](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained)，從 triplet loss 一路講到 SimCLR 的動機。
- 原始論文：[Chen et al., SimCLR (2020)](https://arxiv.org/abs/2002.05709)、[Goodfellow et al., Generative Adversarial Networks (2014)](https://arxiv.org/abs/1406.2661)。

## 參考資料

- [CS1810 Spring 2026 HW5 資料夾（GitHub）](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw5)：`hw5_release.tex`、`hw5_release.pdf`、`hw5_release.ipynb`
- [HW5 題目 PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw5/hw5_release.pdf)
- [CS1810 2026 官方 schedule](https://harvard-ml-courses.github.io/cs181-web/schedule)（第 10–11 週列；2026-09-29 以 Google Sheet CSV 匯出查閱）
- [Section 8：Deep Learning Medley（Spring 2026）](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08.pdf)／[解答](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08_soln.pdf)
- [CS1810 2026 Syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)
- [Chen et al., A Simple Framework for Contrastive Learning of Visual Representations (2020)](https://arxiv.org/abs/2002.05709)
- [Goodfellow et al., Generative Adversarial Networks (2014)](https://arxiv.org/abs/1406.2661)
- [Harvard CS181 逐週導讀（系列總覽）](/posts/tech/2026-08-27-harvard-cs181-overview)
