---
title: "CS231N L14：生成模型（二）——Diffusion 為什麼加噪再去噪就能生成圖片"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, generative-models, diffusion-model]
lang: zh-TW
series:
  name: "Stanford CS231N 導讀"
  order: 16
tldr: "CS231N Spring 2026 的 diffusion 講次沒有從 DDPM 的數學開始，而是先說「這個領域的術語和符號一團亂」，然後只教一個乾淨的現代版本：rectified flow。訓練時在資料和雜訊之間取一個點，讓網路預測從資料指向雜訊的速度；生成時從雜訊出發，往反方向走約 50 步。接著一路疊上實務零件：classifier-free guidance、偏重中間雜訊的排程、在 VAE latent 上做 diffusion、用 Transformer（DiT）當去噪器、蒸餾減少步數。最後才把 VP、VE、ε／v 預測收進一個「廣義 diffusion」框架，並交代 latent variable、score function、SDE 三種數學觀點。"
description: "Stanford CS231N（Spring 2026）Lecture 14 導讀：diffusion 的直覺、rectified flow（flow matching）的訓練與取樣、條件生成與 classifier-free guidance、雜訊排程、latent diffusion（VAE + GAN + diffusion）、Diffusion Transformer、文字生成圖片與影片、蒸餾、廣義 diffusion 框架與三種數學觀點，以及自迴歸模型在離散 latent 上的回歸。公式收在折疊區塊。"
draft: false
glossary:
  - term: "rectified flow"
    aliases: ["flow matching", "整流流"]
    definition: "一種 diffusion 的訓練方式：在資料點 x 和雜訊 z 之間的直線上取一點 x_t = (1−t)x + tz，讓網路預測速度 v = z − x；生成時從雜訊沿著預測速度的反方向一步步走回資料。"
    context: "CS231N L14 把它當成 diffusion 的「乾淨」入門版本。"
  - term: "classifier-free guidance"
    aliases: ["CFG", "無分類器引導"]
    definition: "訓練時隨機丟掉條件 y，讓同一個模型同時學會有條件和無條件的預測；取樣時用兩者的差放大條件的影響。代價是每一步要跑兩次模型。"
    context: "投影片形容它「實務上到處都在用」。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **來源年份：** 投影片與作業是 Spring 2026；錄影是 Spring 2025（YouTube）。兩者可能有差異，本文以 2026 投影片為準，錄影只當輔助。
>
> 這是 [Stanford CS231N 導讀](/posts/ai/2026-09-30-cs231n-course-overview)系列的第 16 篇。上一篇是 [L13：生成模型（一）自迴歸、VAE 與 GAN](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)，下一篇是 [L16：視覺與語言](/posts/ai/2026-09-30-cs231n-vision-language)。

[CS231N](https://cs231n.stanford.edu/) 2026 年 5 月 19 日那一講，[課表](https://cs231n.stanford.edu/schedule.html)只寫了一個主題：Diffusion models。官方材料是 122 頁的 [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf)，對應的公開錄影是 [Spring 2025 Lecture 14](https://www.youtube.com/watch?v=Edr4uZFh4EE)。

投影片前 35 頁其實是 GAN，[上一篇](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)已經整理過，這裡從第 36 頁的 diffusion 開始。

## 課程影片來源

本文以 Spring 2026 教材為準；下列 Spring 2025 公開錄影是補充教材，講次與內容可能有出入。

```youtube
url: https://www.youtube.com/watch?v=Edr4uZFh4EE
title: YouTube：CS231N Spring 2025 Lecture 14: Generative Models 2
```

原始影片：[YouTube：CS231N Spring 2025 Lecture 14: Generative Models 2](https://www.youtube.com/watch?v=Edr4uZFh4EE)

課程與錄影入口：

- [官方課程／講次來源](https://cs231n.stanford.edu/schedule.html)

## 場景：一個「符號一團亂」的領域

第 36 頁列出 diffusion 的五篇奠基論文：[Sohl-Dickstein et al. 2015](https://arxiv.org/abs/1503.03585)、Song & Ermon 2019、[Ho et al. 2020（DDPM）](https://arxiv.org/abs/2006.11239)、[Song et al. 2021（SDE）](https://arxiv.org/abs/2011.13456)、Song et al. 2021（DDIM）。

第 37 頁緊接著一個警告，是這一講最值得先記住的一句：**這個領域的術語和符號一團亂。** 數學形式很多，每篇論文的術語和記號差異極大。所以課程的選擇是：只教一個現代、「乾淨」的實作——**rectified flow**。

這個選擇會影響你讀其他材料的體驗。如果你先讀過 DDPM 論文，會發現本講的記號、時間方向、預測目標都不一樣；本講最後的「廣義 diffusion」才會把兩者接起來。

## 直覺：學會去掉一點點雜訊，重複很多次

第 41 頁把 diffusion 講成三句話：

1. 選一個雜訊分布，通常是單位高斯
2. 把資料 x 用不同程度 t 的雜訊弄髒，得到 x_t；t = 0 沒有雜訊，t = 1 完全是雜訊
3. 訓練一個神經網路 f_θ(x_t, t)，**只負責去掉一點點雜訊**

生成時從純雜訊 x₁ 出發，連續套用 f_θ 很多次，最後得到沒有雜訊的樣本 x₀。

跟上一講的分類圖對照，這就是「隱式密度、反覆迭代逼近樣本」那一格：模型不直接寫出 p(x)，也不像 GAN 一步生成，而是走很多小步。

## 機制一：rectified flow 的訓練與取樣

**訓練**（第 45 頁，依據 [Liu et al. 2022](https://arxiv.org/abs/2209.03003) 與 [Lipman et al. 2022（Flow Matching）](https://arxiv.org/abs/2210.02747)）：每次迭代取三樣東西——雜訊 z、資料 x、均勻分布的 t。在兩者之間的直線上取點 x_t，目標速度 v 是從資料指向雜訊的向量 z − x。網路的工作就是預測這個 v，損失是 L2 距離。

**取樣**（第 56 頁）：選步數 T（常用 T = 50），從雜訊取 x，從 t = 1 往 0 走，每一步算出 v_t 再往反方向跨 1/T。

第 46 頁說核心訓練迴圈「只有幾行程式」。投影片上的程式碼是圖片，以下是依第 45、56 頁步驟改寫的示意，**不是投影片原文**：

```python
# 訓練：一次迭代（依第 45 頁步驟改寫）
x = sample_data()                 # x ~ p_data
z = torch.randn_like(x)           # z ~ p_noise
t = torch.rand(x.shape[0])        # t ~ Uniform(0, 1)
x_t = (1 - t) * x + t * z
v = z - x
loss = ((f_theta(x_t, t) - v) ** 2).mean()

# 取樣（依第 56 頁步驟改寫）
x = torch.randn(shape)            # 從純雜訊出發
for t in torch.linspace(1, 0, T + 1)[:-1]:
    v_t = f_theta(x, t)
    x = x - v_t / T
```

<details>
<summary>公式：rectified flow（第 45、56 頁）</summary>

$$z \sim p_{noise},\quad x \sim p_{data},\quad t \sim \mathrm{Uniform}(0, 1)$$

$$x_t = (1 - t)\,x + t\,z,\qquad v = z - x$$

$$\mathcal{L} = \big\| f_\theta(x_t, t) - v \big\|_2^2$$

取樣時 t 依序走過 1, 1 − 1/T, 1 − 2/T, …, 0，每一步 x ← x − f_θ(x_t, t)/T。

</details>

## 機制二：讓生成聽話——條件與 CFG

**條件 rectified flow**（第 61 頁）：訓練時把條件 y（例如類別或文字）一起餵給網路，生成時就能指定 p_data(x | y)。投影片接著問：能不能控制「多強調」條件 y？

**Classifier-free guidance**（第 67–71 頁，[Ho & Salimans](https://arxiv.org/abs/2207.12598)）：訓練時隨機把 y 丟掉，讓同一個模型同時是有條件和無條件的模型。對某個 x_t：

- 無條件的速度 v_∅ 指向 p(x)
- 有條件的速度 v_y 指向 p(x | y)
- 兩者組合出的 v_cfg 更強烈地指向 p(x | y)

取樣時照 v_cfg 走。名字裡的「classifier-free」是相對於更早的做法：[Dhariwal & Nichol](https://arxiv.org/abs/2105.05233) 用另一個判別模型 p(y | x) 算出 log p(y | x) 對 x 的梯度當方向。投影片對 CFG 的評價是**實務上到處都在用、對高品質輸出非常重要**，代價是取樣成本加倍。

<details>
<summary>公式：CFG（第 67 頁）</summary>

$$v^{\varnothing} = f_\theta(x_t, y_\varnothing, t),\qquad v^{y} = f_\theta(x_t, y, t)$$

$$v^{cfg} = (1 + w)\,v^{y} - w\,v^{\varnothing}$$

w 越大，越強調條件 y。

</details>

## 機制三：哪個雜訊程度最難？

第 78 頁問：網路的最佳預測是什麼？因為可能有很多 (x, z) 組合產生同一個 x_t，網路只能對它們取平均。

- 完全是雜訊（t = 1）很簡單：最佳的 v 是 p_data 的平均
- 完全沒雜訊（t = 0）也很簡單：最佳的 v 是 p_noise 的平均
- **中間程度最難、最模糊**

但均勻取 t 等於給所有雜訊程度相同的權重。解法是**非均勻的雜訊排程**（第 81 頁）：把重點放在中間程度，常見選擇是 logit-normal 取樣；高解析度資料因為像素彼此相關，常再往高雜訊的方向偏移。這部分引用的是 [Esser et al. 2024](https://arxiv.org/abs/2403.03206)。

第 83 頁總結：rectified flow 是一個簡單、可擴展的設定，適用很多生成問題，**但直接用在高解析度資料上行不通**。這把我們帶到 latent diffusion。

## 機制四：現代 pipeline——VAE + GAN + diffusion

**Latent diffusion**（第 85–96 頁，[Rombach et al., CVPR 2022](https://arxiv.org/abs/2112.10752)）分兩階段：

1. 訓練編碼器與解碼器，把 H×W×3 的圖片壓成 H/D×W/D×C 的 latent。常見設定是 D = 8、C = 16，所以 256×256×3 的圖變成 32×32×16；編解碼器是帶 attention 的 CNN
2. 凍結編碼器，在 latent 上訓練 diffusion 模型去噪。生成時從隨機 latent 出發反覆去噪，最後跑解碼器得到圖片

投影片說 latent diffusion 是**今天最常見的形式**。

編解碼器怎麼訓練？這裡把上一講的兩個模型都請回來。**它就是一個 VAE**，通常 KL 先驗的權重很小；問題是解碼器的輸出常常很模糊。**再加一個判別器**，也就是 GAN 的做法。第 96 頁的結論是：**現代 LDM pipeline 同時用上 VAE、GAN 與 diffusion。**

**Diffusion Transformer**（第 99 頁，[Peebles & Xie, ICCV 2023](https://arxiv.org/abs/2212.09748)）：diffusion 模型用的是標準的 Transformer block，主要問題是怎麼注入條件。diffusion 時間步 t 最常用「預測縮放與平移」；文字、影像等條件常用 cross-attention 或 joint attention。

**文字生成圖片的實例**（第 101 頁）以 [FLUX.1 [dev]](https://github.com/black-forest-labs/flux) 為例：

| 零件 | 投影片寫的設定 |
|---|---|
| 文字編碼器 | T5 + CLIP |
| 編解碼器 | 8×8 降採樣 |
| diffusion 模型 | 12B 參數 |
| 影像 token | 2×2 patchify 之後是 64×64 = 1024 個 |

輸出是 1024×1024×3 的圖片，去噪的 latent 是 128×128×16。第 104–105 頁把同一套架構延伸到文字生成影片，並列出 2024–2025 年間一長串影片 diffusion 模型（Sora、Veo 2、MovieGen、Wan、Hunyuan 等）。

**蒸餾**（第 107 頁）：rectified flow 取樣要跑模型約 30–50 次，太慢。蒸餾演算法能減少步數，有時一路減到 1 步，也能把 CFG 直接「烤」進模型。

## 機制五：把各家符號收進同一個框架

到這裡才回頭處理第 37 頁的「符號一團亂」。第 110–114 頁的做法是把 rectified flow 的每個固定係數換成函數：

<details>
<summary>公式：廣義 diffusion（第 110–113 頁）</summary>

$$x_t = a(t)\,x + b(t)\,z,\qquad y_{gt} = c(t)\,x + d(t)\,z,\qquad \mathcal{L} = \| y_{gt} - f_\theta(x_t, t) \|_2^2$$

- **Rectified flow**：a(t) = 1 − t，b(t) = t，c(t) = −1，d(t) = 1
- **Variance Preserving（VP）**：a(t) = √σ(t)，b(t) = √(1 − σ(t))；x 和 z 獨立且變異數為 1 時，x_t 的變異數也是 1
- **Variance Exploding（VE）**：a(t) = 1，b(t) = σ(t)；σ(1) 要大到淹沒 x 的所有訊號
- **預測目標**：x-prediction（c = 1, d = 0）、ε-prediction（c = 0, d = 1）、v-prediction（c = b(t), d = −a(t)）

</details>

這些函數怎麼選？投影片的回答是：**通常透過某種數學形式推導出來。** 第 115–117 頁列出三種觀點：

| 觀點 | 投影片的說法 | 代表論文 |
|---|---|---|
| Latent variable model | 正向加高斯雜訊的過程已知，學一個網路近似反向過程，最佳化變分下界（**跟 VAE 一樣**） | Sohl-Dickstein 2015、DDPM |
| Score function | score 是 log p(x) 對 x 的梯度，一個指向高機率區域的向量場；diffusion 學的是 p_data 的 score | Song & Ermon 2019、DDPM |
| 隨機微分方程 | 把連續加噪過程寫成 SDE，diffusion 學的是近似解這個 SDE | Song et al. 2021 |

第 118 頁推薦 Sander Dieleman 的 [Perspectives on diffusion](https://sander.ai/2023/07/20/perspectives.html)，還加註「他所有的文章都很棒」。

## 連回模型：自迴歸捲土重來

第 119–120 頁回收上一講的伏筆。自迴歸模型在原始像素上太慢，但**在離散 latent 上效果很好**：訓練編解碼器把圖片轉成 H/D×W/D 的整數 latent，再用自迴歸模型建模這串離散 token；生成時從自迴歸模型取樣，交給解碼器。引用的是 [VQ-VAE](https://arxiv.org/abs/1711.00937)、VQ-VAE-2 與 [Taming Transformers](https://arxiv.org/abs/2012.09841) 這條線。

把兩講放在一起看，四種範式最後沒有誰淘汰誰：GAN 變成 LDM 解碼器的訓練零件，VAE 變成 latent 空間，自迴歸在離散 latent 上回歸，diffusion 則是今天產生圖片和影片的主力。

**作業的對應要注意。** [A3](https://cs231n.github.io/assignments2026/assignment3/) 的 Q3 要實作的是 **DDPM**（`DDPM.ipynb`，起始碼附 `unet.py`、`gaussian_diffusion.py`），不是講課主軸的 rectified flow。兩者的橋樑就是上面的廣義框架：起始碼 `gaussian_diffusion.py` 的註解寫著 x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · noise，正是 VP 的形式；`objective` 預設為 `pred_noise`（ε-prediction），另一個選項是 `pred_x_start`（x-prediction）。做作業前先讀一遍第 110–115 頁，會比較容易對上記號。作業細節見 [A3 導讀](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip)。

## 想深入

**官方材料**

- [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf)：diffusion 從第 36 頁開始
- 錄影：[Spring 2025 L14](https://www.youtube.com/watch?v=Edr4uZFh4EE)
- [A3](https://cs231n.github.io/assignments2026/assignment3/)：Q3 DDPM

**站內延伸閱讀**（各自完整，重疊部分不刪）

- [MIT 6.S184 導讀：Flow Matching 與 Diffusion](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)——整門課專講 flow matching 與 diffusion 的數學
- [CS229 2026 講義第 14 章：擴散模型](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models)——從 ELBO 角度推導
- [CMU 11-785 Lecture 23：擴散模型](/posts/ai/2026-08-22-cmu-11785-23-diffusion)
- [Berkeley CS189 HW2：迴歸、GMM 與 flow matching](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching)
- [CME295：Diffusion LLM](/posts/ai/2026-09-29-cme295-diffusion-llms)——把 diffusion 用在文字上

## 存取限制

依[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)的分級，這門課是 **A3**：2026 投影片、作業與起始碼公開，另有 2025 完整錄影。本講的缺口是 2026 錄影只放在 Canvas、限修課生觀看，Gradescope 的自動評分也不公開。

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [Stanford CS231N 課程首頁（Spring 2026）](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 課表](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2026 Lecture 14 投影片](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf)
- [YouTube：CS231N Spring 2025 Lecture 14: Generative Models 2](https://www.youtube.com/watch?v=Edr4uZFh4EE)
- [CS231N Assignment 3（Spring 2026）](https://cs231n.github.io/assignments2026/assignment3/)
- [Liu et al., Flow Straight and Fast（Rectified Flow）](https://arxiv.org/abs/2209.03003)
- [Lipman et al., Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747)
- [Ho et al., Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
- [Song et al., Score-Based Generative Modeling through SDEs](https://arxiv.org/abs/2011.13456)
- [Ho & Salimans, Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Rombach et al., High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
- [Peebles & Xie, Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748)
- [Esser et al., Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206)
- [Sander Dieleman, Perspectives on diffusion](https://sander.ai/2023/07/20/perspectives.html)
