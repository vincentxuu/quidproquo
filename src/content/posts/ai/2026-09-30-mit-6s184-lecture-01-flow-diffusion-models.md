---
title: "MIT 6.S184 L1：生成就是取樣，ODE 與 SDE 是機器"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 1
tldr: "MIT 6.S184 第 1 講先把「生成一張狗的圖」改寫成「從資料分佈取樣」，再給出取樣的機器：從高斯雜訊出發，沿著神經網路給的向量場模擬一條 ODE（flow model），或在每一步再加一點 Brownian motion 的雜訊，變成 SDE（diffusion model）。實際模擬各用一個最簡單的數值方法：Euler 和 Euler–Maruyama。怎麼訓練那個向量場，留到第 2 講。"
description: "MIT 6.S184（IAP 2026）第 1 講導讀，依講義 §1.3、§2、Slides 1 與錄影：Key Idea 1–4、向量場／ODE／flow、Theorem 3 與線性向量場例子、Algorithm 1 Euler 取樣、Brownian motion 與 SDE、Theorem 5、Ornstein–Uhlenbeck 過程、Algorithm 2 Euler–Maruyama，以及 Summary 7。"
draft: false
glossary:
  - term: "向量場"
    aliases: ["vector field"]
    definition: "對每個時間 t 和位置 x 給出一個速度向量 u_t(x) 的函數；ODE 的軌跡沿著它走。"
    context: "flow model 裡，神經網路參數化的就是向量場，不是 flow 本身。"
  - term: "Brownian motion"
    aliases: ["Wiener process", "布朗運動"]
    definition: "從 0 出發、軌跡連續、增量服從常態且彼此獨立的隨機過程，可以想成連續時間的隨機漫步。"
    context: "SDE 的隨機項由它驅動。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en)

> **版本說明**：本文依據 [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026 的[講義](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §1.3 與 §2（pp.4–13）、[Slides 1](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf)，以及[第 1 講錄影](https://www.youtube.com/watch?v=9eJQQVrUUoI)。定理、例子與演算法編號都照講義。2026-09-30 核對。

**系列位置**：上一篇 [系列總覽](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)｜下一篇 [Lab 1：模擬 ODE 與 SDE](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes)

講義開頭引了 Song 等人的一句話：從資料造出雜訊很容易，從雜訊造出資料才是生成模型。第 1 講就是把這句話變成數學：先定義「生成」到底是什麼，再給出把雜訊推成資料的兩台機器。

這一講**不談怎麼訓練**。你會看到一個神經網路向量場 `u_t^θ`，但它的參數怎麼學，是[第 2 講](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)的事。

## 先把「生成」講精確：四個 Key Idea

講義 §1.3 用四個 Key Idea 把問題形式化。

**Key Idea 1：物件是向量。** 一張 H×W 的 RGB 圖片是 `R^{H×W×3}` 裡的一個元素；T 幀的影片是 `R^{T×H×W×3}`；N 個原子的分子結構可以粗略寫成 `R^{3×N}`。攤平之後，要生成的東西都是某個 `z ∈ R^d`。文字是例外，通常當成離散物件處理，留到講義 §7。

**Key Idea 2：生成就是取樣。** 「一張狗的圖」沒有唯一的最佳答案，只有比較像或比較不像。機器學習把這種多樣性寫成一個機率分佈，叫資料分佈 `p_data`；越像狗的圖，`p_data(z)` 越大。於是「好不好」這種主觀判斷，被換成「在 `p_data` 下有多可能」。生成一個物件，就是從 `p_data` 取一個樣本。Slides 1 特別標註：我們不知道這個機率密度長什麼樣。

**Key Idea 3：資料集。** 我們手上只有有限個從 `p_data` 獨立抽出的樣本 `z_1, …, z_N`。圖片可以從網路收集，影片可以用 YouTube，蛋白質結構可以用 Protein Data Bank。

**Key Idea 4：guided generation。** 想要「一隻狗在雪山下坡跑」的圖，就是從條件分佈 `p_data(·|y)` 取樣，`y` 是條件（例如 prompt）。講義說，無條件生成的技術可以直接推廣到有條件的情況，所以前三節幾乎只談無條件生成。條件生成要等到[第 3-B 講](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance)。

講義最後把**生成模型**定義成一個演算法：它把簡單初始分佈（例如高斯）的樣本，轉成（近似）`p_data` 的樣本。本課只談 flow 與 diffusion 這兩種做法，講義也提醒還有很多其他生成模型。

## 機器一號：ODE 與 flow model

### 向量場、ODE、flow 是同一件事的三種描述

想像空間裡每個點、每個時刻都標著一個箭頭，告訴你「現在往哪走、走多快」。這就是**向量場** `u_t(x)`。從某個起點 `x_0` 出發、一路順著箭頭走，畫出的軌跡就是 ODE 的解。**flow** `ψ_t(x_0)` 則回答：從 `x_0` 出發，到時刻 t 你在哪？

講義的說法是：向量場定義 ODE，ODE 的解是 flow，三者直覺上是同一個物件。

<details>
<summary>講義 eq. (1)、(2)：ODE 與 flow 的定義</summary>

```text
ODE:    d/dt X_t = u_t(X_t),        X_0 = x_0            (1a)(1b)
flow:   ψ : R^d × [0,1] → R^d,  (x_0, t) ↦ ψ_t(x_0)
        d/dt ψ_t(x_0) = u_t(ψ_t(x_0)),   ψ_0(x_0) = x_0  (2)
```

給定初始條件，軌跡就是 `X_t = ψ_t(X_0)`。

</details>

解存不存在、唯不唯一？**Theorem 3**（Flow existence and uniqueness）說：只要 `u` 連續可微且導數有界，ODE 就有唯一解 `ψ_t`，而且每個 `ψ_t` 都是 diffeomorphism（可微、反函數也可微）。講義特別安撫讀者：機器學習用神經網路參數化 `u_t`，導數總是有界，所以這個定理對你來說是好消息，不是負擔。Slides 1 把它標成 Picard–Lindelöf 定理，並補一句：更一般地，向量場 Lipschitz 就夠。

**Example 4** 是最簡單的例子：線性向量場 `u_t(x) = −θx`（θ>0），flow 是 `ψ_t(x_0) = exp(−θt) x_0`，軌跡指數收斂到 0。後面的 Ornstein–Uhlenbeck 過程就是在它上面加雜訊。

<details>
<summary>Example 4 的驗證</summary>

```text
ψ_0(x_0) = x_0
d/dt ψ_t(x_0) = d/dt (exp(−θt) x_0) = −θ exp(−θt) x_0 = −θ ψ_t(x_0) = u_t(ψ_t(x_0))
```

中間用的是連鎖律。

</details>

### Euler 方法：一次走一小步

向量場一複雜，flow 就算不出封閉解，只能數值模擬。最簡單的是 **Euler 方法**：在目前位置查箭頭，沿著它走 h 那麼長，重複 n 次（h = 1/n）。

```text
X_{t+h} = X_t + h · u_t(X_t)        (t = 0, h, 2h, …, 1−h)      講義 eq. (4)
```

講義說這門課用 Euler 就夠了，順便示範一個比較精細的 Heun 方法：先用 Euler 猜下一步，再用「現在」與「猜到的位置」兩處向量場的平均修正。Slides 1 用一張圖說明步長取捨：步長大比較快但誤差大，步長小誤差低但比較慢。

### Flow model：把起點變成隨機的

ODE 本身是確定性的，但生成需要隨機。講義的做法很直接：讓起點隨機。從一個容易取樣的初始分佈 `p_init` 抽 `X_0`（大多數時候是標準高斯 `N(0, I_d)`），再用神經網路向量場 `u_t^θ` 模擬 ODE。目標是讓終點 `X_1` 的分佈等於 `p_data`。

講義特別強調一個容易搞混的地方：**雖然叫 flow model，神經網路參數化的是向量場，不是 flow。** 要得到 flow，得模擬 ODE。

<details>
<summary>Algorithm 1：用 Euler 方法從 flow model 取樣</summary>

```text
Require: 神經網路向量場 u_t^θ，步數 n
1: t = 0
2: h = 1/n
3: 抽 X_0 ~ p_init
4: for i = 1, …, n:
5:     X_{t+h} = X_t + h · u_t^θ(X_t)
6:     t ← t + h
7: return X_1
```

</details>

這裡第一次出現講義的時間慣例：**t=0 是雜訊，t=1 是資料**。很多 diffusion 文獻方向相反（講義附錄 E 有提醒），跟其他材料對照時要先確認。

## 機器二號：SDE 與 diffusion model

### Brownian motion：連續的隨機漫步

SDE 在 ODE 上加入隨機性，隨機性的來源是 **Brownian motion** `W_t`。講義請你把它想成「連續的隨機漫步」。它的定義是：`W_0 = 0`、軌跡連續，加上兩個條件：

1. **常態增量**：`W_t − W_s ~ N(0, (t−s) I_d)`，變異數隨時間線性增加。
2. **獨立增量**：不重疊時段的增量彼此獨立。

模擬它只要一行：每一步加一個高斯雜訊，乘上 `√h`。

```text
W_{t+h} = W_t + √h · ε_t,    ε_t ~ N(0, I_d)      講義 eq. (5)
```

為什麼是 `√h` 不是 `h`？因為常態增量要求 h 時間內的變異數是 h，標準差就是 `√h`。講義還附了一個有趣的性質：Brownian motion 的路徑連續（畫的時候筆不用離開紙），但長度無限（你永遠畫不完）。

### 從 ODE 到 SDE

SDE 的路徑不可微，不能再寫 `d/dt X_t`。講義的做法是先把 ODE 改寫成「每一步往 `u_t(X_t)` 走一小段」的無窮小更新形式，再在每一步加上 Brownian motion 的貢獻：

<details>
<summary>講義 eq. (6)、(7)：SDE 的定義</summary>

```text
X_{t+h} = X_t + h·u_t(X_t) + σ_t (W_{t+h} − W_t) + h·R_t(h)      (6)
          └── 確定性 ──┘   └──── 隨機 ────┘   └ 誤差項 ┘

符號寫法：dX_t = u_t(X_t) dt + σ_t dW_t,   X_0 = x_0              (7)
```

`σ_t ≥ 0` 叫 diffusion coefficient。講義提醒：`dX_t` 這個寫法只是 eq. (6) 的非正式記號。

</details>

SDE 沒有 flow map 了，因為 `X_t` 不再由 `X_0` 完全決定。但存在唯一性照樣成立：**Theorem 5** 說，只要 `u` 連續可微且導數有界、`σ_t` 連續，SDE 就有唯一解。講義不證明它，理由是「如果這是隨機微積分課，我們要花好幾講證明它」。

一個重要的觀察：**每個 ODE 都是 σ_t = 0 的 SDE。** 所以之後講 SDE 時，ODE 都算特例。

### Example 6：Ornstein–Uhlenbeck 過程

把 Example 4 的線性向量場加上常數雜訊，就得到 **Ornstein–Uhlenbeck（OU）過程**：

```text
dX_t = −θ X_t dt + σ dW_t      講義 eq. (8)
```

兩股力量在拉扯：向量場 `−θx` 永遠把點拉回 0，`σ` 永遠加雜訊。結果是模擬夠久（t→∞）時，分佈收斂到高斯 `N(0, σ²/(2θ))`。σ=0 時就退回 Example 4 的 flow。講義 Figure 3 用 θ=0.25 和幾個不同的 σ 畫出這個對比，[Lab 1](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes) 會讓你親手重畫。

### Euler–Maruyama：SDE 版的 Euler

講義說，如果 SDE 的抽象定義讓你卡住，就換個問題：怎麼模擬它？答案是 **Euler–Maruyama 方法**，它之於 SDE 就像 Euler 之於 ODE：往 `u_t(X_t)` 走一小步，再加上一點乘了 `√h·σ_t` 的高斯雜訊。

```text
X_{t+h} = X_t + h·u_t(X_t) + √h·σ_t·ε_t,    ε_t ~ N(0, I_d)      講義 eq. (9)
```

這門課（包括 lab）模擬 SDE 時，通常都用它。

### Diffusion model

跟 flow model 一樣的手法：從 `p_init` 抽起點，用神經網路參數化向量場 `u_t^θ`，再加上一個**固定的** diffusion coefficient `σ_t`。

<details>
<summary>Algorithm 2：用 Euler–Maruyama 從 diffusion model 取樣</summary>

```text
Require: 神經網路 u_t^θ，步數 n，diffusion coefficient σ_t
1: t = 0
2: h = 1/n
3: 抽 X_0 ~ p_init
4: for i = 1, …, n:
5:     抽 ε ~ N(0, I_d)
6:     X_{t+h} = X_t + h · u_t^θ(X_t) + σ_t · √h · ε
7:     t ← t + h
8: return X_1
```

</details>

## Summary 7：這一講的全部

講義用 Summary 7 收尾，整理成一張表最清楚：

| | 內容 |
|---|---|
| 神經網路 | `u^θ : R^d × [0,1] → R^d`，參數化向量場 |
| 固定的 | `σ_t : [0,1] → [0, ∞)`，diffusion coefficient |
| 初始化 | `X_0 ~ p_init`，例如高斯 |
| 模擬 | `dX_t = u_t^θ(X_t) dt + σ_t dW_t`，從 t=0 模擬到 t=1 |
| 目標 | `X_1 ~ p_data` |

最後一句是：**σ_t = 0 的 diffusion model 就是 flow model。**

## 讀完這講，你應該能

- 用一句話說出「生成」的數學定義：從 `p_data` 取樣。
- 分清楚向量場、ODE、flow 的關係，並說出 flow model 的神經網路參數化的是哪一個。
- 寫出 Euler 與 Euler–Maruyama 的更新式，並解釋雜訊項為什麼乘 `√h`。
- 說出 OU 過程收斂到什麼分佈。

**今晚就能做的事**：讀講義 pp.7–13，然後打開 [Lab 1](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes) 的 Question 1.1，把兩個 `step` 函式寫出來。

## 延伸閱讀

- 機率概念生疏：講義附錄 A（A Reminder on Probability Theory），或本站 [Stanford CS109 導讀](/posts/learning/2026-08-21-stanford-cs109-probability)
- 生成模型的整體介紹：[MIT 6.S191 L4：生成模型](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling)
- DDPM 視角（時間方向相反）：[CMU 11-785 L23：Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion)

## 參考資料

- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — 第 1 講主題列表
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（講義 PDF）](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §1.3 Key Idea 1–4、Summary 2；§2 eq. (1)–(9)、Theorem 3、Example 4、Algorithm 1、Theorem 5、Example 6、Algorithm 2、Summary 7；附錄 E 時間慣例
- [Slides 1（20260120_Lecture_01.pdf）](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf) — 課程目標、Picard–Lindelöf、Euler 步長取捨、Logistics
- [第 1 講錄影：Flow and Diffusion Models (2026)](https://www.youtube.com/watch?v=9eJQQVrUUoI)
