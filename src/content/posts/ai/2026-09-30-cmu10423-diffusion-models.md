---
title: "CMU 10-423 L7：擴散模型入門——從加噪到學會去噪"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai, diffusion-model, deep-learning]
lang: zh-TW
series:
  name: "CMU 10-423 導讀"
  order: 7
tldr: "L7 把擴散模型拆成兩條 Markov 鏈：固定的前向過程一步步把圖片加噪成高斯雜訊，學出來的反向過程一步步去噪。精確的反向過程算不出來，但給定原圖 x₀ 時的後驗是封閉形式的高斯，所以可以拿它當學習目標。投影片比較三種參數化，實務上最好的是讓 U-Net 預測當初加進去的雜訊 ε，訓練迴圈只有八行。"
description: "CMU 10-423/623 Generative AI（Spring 2026）Lecture 7 導讀：無監督學習的共同目標、GAN→VAE→Diffusion 的模型對照、U-Net 架構、DDPM 的前向與反向過程、noise schedule、三個關鍵性質、預測均值／原圖／雜訊三種參數化，以及 ε 預測的訓練演算法與 L8 開頭的取樣演算法。"
draft: false
glossary:
  - term: "forward process"
    aliases: ["前向過程", "加噪過程"]
    definition: "擴散模型中固定、不需學習的 Markov 鏈 q(x_t | x_{t−1})，每一步把圖片縮放並加上高斯雜訊，走完 T 步後接近標準高斯。"
    context: "10-423 L7 用它和學出來的反向過程 p_θ(x_{t−1} | x_t) 對照。"
  - term: "noise schedule"
    aliases: ["雜訊排程"]
    definition: "前向過程每一步的係數 α_t 構成的固定序列，選擇原則是讓 q(x_T) 接近 N(0, I)，與反向過程的起點 p_θ(x_T) 一致。"
    context: "L7 投影片的 Defining the Forward Process 一節。"
---

> 🌏 [English version](/posts/ai/2026-09-30-cmu10423-diffusion-models-en)

> **版本說明**：本文依據 [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026。主要材料是 [Lecture 7 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture7-diffusion.pdf)（Diffusion models Part I，47 頁 PDF），取樣演算法一節取自 [Lecture 8 投影片](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf)開頭的複習段；readings 依[講次表](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)。事實皆於 2026-09-30 打開官方材料核對。存取等級 **A3**：投影片、作業與練習考卷公開；課堂錄影在 CMU Panopto，校外看不到。

**系列位置**：上一篇 [L6：生成對抗網路（GAN）](/posts/ai/2026-09-30-cmu10423-gans)｜下一篇 [L8–L9：變分推論、VAE 與擴散模型的 ELBO](/posts/ai/2026-09-30-cmu10423-variational-inference-vae)｜[系列總覽](/posts/ai/2026-09-30-cmu10423-generative-ai-overview)

GAN 能畫圖，但它有一個根本限制：算不出一張圖的機率 p_θ(x)，只能改用對抗遊戲來訓練。L7（2026 年 2 月 4 日）介紹的擴散模型走另一條路：先定義一個「把圖片慢慢變成雜訊」的過程，再訓練一個網路把這個過程倒著走回來。這也是 [HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm) 程式題要從零實作的模型。

## 先把三種模型放在同一張表上

投影片開頭用「無監督學習」重新定義問題：資料來自某個真實分布 p\*(x₀)，我們選一個容易取樣的 p_θ(x₀)，目標是讓 p_θ ≈ p\*。三種模型的差別在於「能不能直接最大化 log p_θ(x₀)」：

| 模型 | 能直接做 MLE 嗎 | 投影片的理由 | 實際怎麼學 |
|---|---|---|---|
| 自迴歸 LM | 可以 | 每一步是 Categorical，祖先取樣精確又快 | 對 log p_θ(x₀) 做梯度上升 |
| GAN | 不行 | 連 log p_θ(x₀) 或它的梯度都算不出來 | 改最佳化 minimax 損失 |
| VAE／擴散模型 | 「算是可以」 | 梯度算不出來 | 改最佳化變分下界（L8 詳談） |

接著投影片用一張「GAN → VAE → Diffusion」對照圖把三者都寫成潛變數模型：GAN 是 z ~ N(0, I) 加上一個確定性的 G_θ(z)；VAE 是 z 加上高斯解碼器，另配一個編碼器 q_φ(z | x)；擴散模型則是一整串潛變數 z_T → … → z_1 → z₀ = x。這張圖在 L8 和 L9 還會再出現兩次，值得先記住。

## 先認識 U-Net

擴散模型的去噪網路需要「輸入一張圖、輸出同樣大小的東西」，所以投影片先介紹 U-Net。它原本是為生物醫學影像分割設計的，關鍵性質是輸出層和輸入圖有相同的空間尺寸（通道數可以不同）。

- **收縮路徑**：每個 block 是兩層 3×3 卷積、ReLU、stride 2 的 max-pooling，重複 N 次，每次通道數加倍。
- **擴張路徑**：每個 block 是 2×2 卷積上採樣、和收縮路徑對應層的特徵串接、再兩層 3×3 卷積與 ReLU，重複 N 次，每次通道數減半。

投影片順帶介紹了 semantic segmentation（每個像素一個標籤）和 instance segmentation（還要區分同類別的不同個體），說明「逐像素預測」為什麼不是單純的分類問題。

## 兩條方向相反的鏈

擴散模型由兩個過程組成：

- **前向過程**：q(x₀) 是資料分布，每一步 q(x_t | x_{t−1}) 往圖片上加一點雜訊，走 T 步後變成純雜訊。這一步是固定的，不用學。
- **反向過程**：從 p_θ(x_T) = N(0, I) 開始，每一步 p_θ(x_{t−1} | x_t) 去掉一點雜訊，最後得到圖片。這是要學的部分。

投影片問了一個課堂問題：擴散模型的潛變數是哪些？（答案欄在講義版是空的，但從圖上看得出來：x₁ 到 x_T。）

在 DDPM（[Ho et al. 2020](https://arxiv.org/abs/2006.11239)）裡，兩個過程都是高斯：

<details>
<summary>DDPM 的前向與反向過程定義（投影片第 28 頁）</summary>

```text
前向： q(x_{0:T}) = q(x_0) Π_{t=1..T} q(x_t | x_{t−1})
      q(x_t | x_{t−1}) = N( √α_t · x_{t−1}, (1 − α_t) I )

反向： p_θ(x_{0:T}) = p_θ(x_T) Π_{t=1..T} p_θ(x_{t−1} | x_t)
      p_θ(x_T) = N(0, I)
      p_θ(x_{t−1} | x_t) = N( μ_θ(x_t, t), Σ_θ(x_t, t) )
```

</details>

既然前向過程很簡單，為什麼不直接把它精確地倒過來？投影片的回答是：q(x_{t−1} | x_t) 要把其他所有變數積分掉，而其中牽涉到 q(x₀)——真實資料分布一點也不簡單，所以這個反向條件分布算不出來。

**Noise schedule**：α_t 照一個固定排程選，目標是讓 q(x_T) 接近 N(0, I)，正好和反向過程的起點 p_θ(x_T) 對上。

## 高斯的四條規則，與兩個常見疑問

投影片插了一頁「高斯小抄」，後面反覆回來引用：兩個高斯相加、相減仍是高斯；高斯的均值如果是另一個高斯變數的**線性**函數，邊際和後驗都是高斯；如果是**非線性**函數，一般就不是高斯。

用這四條可以回答兩個疑問：

- **前向過程只是加噪，反向過程為什麼學得到有趣的東西？** 因為 q(x₀) 本身不是雜訊，p_θ 必須捕捉資料的變化。
- **每一步都是高斯，最後的 p_θ(x₀) 不也是高斯嗎？** 不是。前向過程把中間變數積分掉後仍是高斯（線性），但反向過程的均值 μ_θ 是神經網路（非線性），積分掉之後一般不是高斯。投影片說，T 夠長的擴散模型可以捕捉任何平滑的目標分布。

## 三個讓訓練變簡單的性質

**性質 1：一步跳到任意時間點。** 定義 ᾱ_t = α₁·α₂·…·α_t，就有 q(x_t | x₀) = N(√ᾱ_t x₀, (1 − ᾱ_t) I)。寫成取樣式：x_t = √ᾱ_t x₀ + √(1 − ᾱ_t) ε，ε ~ N(0, I)。投影片特別註明，這跟 VAE 用的 reparameterization trick 是同一招。

**性質 2：給定 x₀，反向一步是封閉形式。** q(x_{t−1} | x_t) 算不出來，但加上條件 x₀ 之後，q(x_{t−1} | x_t, x₀) 是一個均值為 μ̃_q(x_t, x₀)、變異數為 σ_t² 的高斯，兩者都有公式。

**性質 3：換一種寫法表示這個均值。** 把性質 1 移項得到 x₀ = (x_t − √(1 − ᾱ_t) ε) / √ᾱ_t，代回性質 2 的均值，就能用 x_t 和 ε 來表示 μ̃_q。投影片說，這種參數化在經驗上有助於學習 p_θ。

<details>
<summary>性質 2、3 的公式（投影片第 47、51 頁）</summary>

```text
q(x_{t−1} | x_t, x_0) = N( μ̃_q(x_t, x_0), σ_t² I )

μ̃_q(x_t, x_0) = [√ᾱ_{t−1}(1 − α_t) / (1 − ᾱ_t)] · x_0
              + [√α_t (1 − ᾱ_{t−1}) / (1 − ᾱ_t)] · x_t
σ_t² = (1 − ᾱ_{t−1})(1 − α_t) / (1 − ᾱ_t)

代入 x_0 = (x_t − √(1 − ᾱ_t) ε) / √ᾱ_t 之後：
μ̃_q = (1/√α_t) · ( x_t − (1 − α_t)/√(1 − ᾱ_t) · ε )
```

</details>

## 網路要預測什麼：三種選擇

直覺是：面對一張特定的訓練圖 x₀，學到的反向一步 p_θ(x_{t−1} | x_t) 應該盡量接近「精確的」q(x_{t−1} | x_t, x₀)。（為什麼這樣做是對的，要等 L8 用 ELBO 證明。）投影片據此提出兩個想法：

- **想法 1**：變異數不用學，直接設 Σ_θ = σ_t² I。
- **想法 2**：讓 μ_θ 靠近 μ̃_q，有三種參數化方式：

| 選項 | U-Net 預測什麼 | 損失（逐步） |
|---|---|---|
| A | 直接預測均值 μ̃_q | ‖μ̃_q − μ_θ(x_t, t)‖² |
| B | 預測原圖 x₀ | ‖x₀ − x_θ⁽⁰⁾(x_t, t)‖² |
| C | 預測當初加進去的雜訊 ε | ‖ε − ε_θ(x_t, t)‖² |

三種都把 t 當成 U-Net 的額外輸入特徵。投影片的結論是：**選項 C 在經驗上最好。**

## 訓練與取樣

選項 C 的訓練演算法只有八行：

<details>
<summary>Algorithm 1：Training（Option C，投影片第 55 頁）</summary>

```text
1: initialize θ
2: for e ∈ {1, …, E} do
3:   for x_0 ∈ D do
4:     t ~ Uniform(1, …, T)
5:     ε ~ N(0, I)
6:     x_t ← √ᾱ_t x_0 + √(1 − ᾱ_t) ε
7:     ℓ_t(θ) ← ‖ε − ε_θ(x_t, t)‖²
8:     θ ← θ − ∇_θ ℓ_t(θ)
```

</details>

每張圖每次只隨機挑一個時間點 t，利用性質 1 一步生成 x_t，再讓網路猜雜訊。L8 開頭的複習還補了選項 A 在「所有時間點都算」的版本，以及 A、B 的訓練迴圈。

取樣則是從 x_T ~ N(0, I) 開始，t 從 T 倒數到 1，每一步用網路算出 μ̂_t，再加上 σ_t 倍的新雜訊。以選項 C 為例，每一步先用 ε_θ 估出 x̂₀，再用性質 2 的公式組出 μ̂_t。這段演算法出現在 L8 投影片第 22–26 頁。

## 這一講在作業與考試裡的位置

- [HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm)（總分 60）的第 6 題 Understanding Diffusion Models 占 14 分，程式題 Programming: Diffusion Models 占 21 分：在 AFHQ 貓圖上實作 DDPM。
- Quiz 2（2 月 16 日）範圍是 L5–L9。
- [練習考卷](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)第 8 大題 Diffusion Models 共 8 分，附[解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)。

## 自學怎麼做

1. 先把「GAN → VAE → Diffusion」對照圖看懂，確定自己分得出三者的潛變數。
2. 自己推一次性質 1：只用「高斯相加仍是高斯」這條規則，從 q(x_t | x_{t−1}) 推到 q(x_t | x₀)。
3. 讀 [DDPM 論文](https://arxiv.org/abs/2006.11239)的 Algorithm 1 與 2，對照投影片的選項 C 訓練與取樣演算法。
4. 想知道擴散模型最早的出發點，讀 [Sohl-Dickstein et al. 2015](https://arxiv.org/abs/1503.03585)。
5. 用 PyTorch 寫一個玩具版：2D 資料點、T = 100、一個小 MLP 當 ε_θ，跑完上面的八行迴圈。這就是 HW2 程式題的縮小版。

## 延伸閱讀

- [MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)與[第 1 講：flow 與擴散模型](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models)——用 ODE／SDE 的角度重看擴散模型
- [CMU 11-785 導讀：擴散模型](/posts/ai/2026-08-22-cmu-11785-23-diffusion)
- [Stanford CS231n 導讀：生成模型與擴散](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)

## 參考資料

- [CMU 10-423/623/723 Generative AI 課程首頁（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [講次表（Schedule）](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)——L7 日期、標題與 readings
- [Lecture 7 投影片：Diffusion Models（Part I）](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture7-diffusion.pdf)——本文主要依據
- [Lecture 8 投影片：Diffusion Models（Part II）+ Intro to VAEs](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf)——訓練演算法 A/B 與取樣演算法
- [Coursework 頁](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)與 [HW2 handout（zip）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw2.zip)——HW2 配分表
- [Practice exam（Spring 2026）](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)與[解答](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Sohl-Dickstein et al., Deep Unsupervised Learning using Nonequilibrium Thermodynamics（ICML 2015）](https://arxiv.org/abs/1503.03585)——講次表 reading
- [Ho, Jain & Abbeel, Denoising Diffusion Probabilistic Models（NeurIPS 2020）](https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html)——講次表 reading；[arXiv 版](https://arxiv.org/abs/2006.11239)
