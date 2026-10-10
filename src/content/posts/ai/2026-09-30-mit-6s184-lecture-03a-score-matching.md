---
title: "MIT 6.S184 L3A：分數函數、SDE 取樣與 score matching"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, score-matching, generative-ai]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 4
tldr: "分數函數是 log 密度的梯度，指向機率上升最快的方向。在高斯路徑上，它和上一講的向量場都是 x 與 z 的線性函數，所以可以互相換算（講義 Proposition 1）：學會一個，就等於學會另一個。有了分數，就能在 ODE 上加任意強度的雜訊變成 SDE，而且每個時刻的分佈不變（Theorem 17）。分數本身也能用跟 flow matching 同一招學：回歸條件分數。這在高斯路徑上等於讓網路預測當初加進去的雜訊，也就是 DDPM 的訓練目標。"
description: "MIT 6.S184（IAP 2026）第 3 講前半（3-A）導讀，依講義 §4 與 Slides 3 前半：條件與邊際分數函數、Example 15、Proposition 1 轉換公式、Remark 16 denoiser、SDE extension trick（Theorem 17、Example 18）、Fokker–Planck 方程（Theorem 19）、Langevin dynamics（Remark 20）、denoising score matching（Theorem 22、Example 23）、Algorithm 4 與 Summary 24。"
draft: false
glossary:
  - term: "分數函數"
    aliases: ["score function", "score"]
    definition: "分佈 q 的 log 密度對 x 的梯度 ∇ log q(x)，指向 log-likelihood 上升最快的方向。"
    context: "講義 §4.1。Diffusion model 文獻多半從它出發，flow matching 則從向量場出發；在高斯路徑上兩者可互換。"
  - term: "SDE extension trick"
    definition: "在邊際向量場上加上 (σ_t²/2)·∇log p_t 的修正項與 σ_t dW_t 的雜訊，得到一個 SDE，它的每個時刻分佈仍是 p_t。σ_t ≥ 0 可任選。"
    context: "講義 Theorem 17，讓訓練好的 flow model 也能用隨機的 SDE 取樣。"
  - term: "denoising score matching"
    aliases: ["DSM", "conditional score matching"]
    definition: "用算得出來的條件分數 ∇log p_t(x|z) 當回歸目標來學邊際分數；在高斯路徑上等價於讓網路預測加進去的雜訊。"
    context: "講義 Theorem 22 與 Example 23，DDPM 的 noise prediction loss 就是它的重新參數化。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en)

**影片狀態：已附影片。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依 [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026 版，2026-09-30 對照[講義 PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §4（pp.25–33）與 [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) 前半（到 Key takeaway 為止）撰寫，[第 3-A 講錄影](https://www.youtube.com/watch?v=ngC3QnYSVNM)可搭配觀看。Slides 3 由 3-A 與 3-B 共用，後半的 guidance 留給 [L3B](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance)。存取等級 **A3 足以自學**。

**系列位置**：[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)第 4 篇｜上一篇 [L2：Flow matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)｜下一篇 [Lab 2：親手寫 flow matching 與 score matching](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching)

[上一講](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)只處理 flow model：學一個邊際向量場，沿著它跑 ODE。可是第 1 講的機器還有另一種：diffusion model，也就是在 ODE 上再加 Brownian motion 的 SDE。它要怎麼訓練？

這一講的聚焦問題：**什麼是分數函數，為什麼學到它（或學到向量場）就能用 SDE 取樣？** 答案會順便說明 diffusion model 跟 flow matching 是什麼關係。

時間方向跟前面一樣：**t=0 是雜訊，t=1 是資料**。

## 課程影片來源
2026-10-10 已即時回官方課程頁核對講次與影片連結，影片公開且允許嵌入。

```youtube
url: https://www.youtube.com/watch?v=ngC3QnYSVNM
title: MIT 6.S184: Flow Matching and Diffusion Models - Lecture 03A - Score Functions (2026)
```

原始影片：[MIT 6.S184: Flow Matching and Diffusion Models - Lecture 03A - Score Functions (2026)](https://www.youtube.com/watch?v=ngC3QnYSVNM)

課程與錄影入口：

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

查核日期：2026-10-10。

## 分數函數：往機率更高的方向指

對任意分佈 `q(x)`，它的**分數函數**是 `∇ log q(x)`，log-likelihood 對 x 的梯度（§4.1，p.25）。直覺很單純：它指向 log-likelihood 上升最快的方向。講義 Figure 8 把它畫成一片指向高密度區的箭頭。

講義說 diffusion model 文獻走的是分數的視角，這一節就是把上一講的內容用分數的語言重講一次。

套到上一講的機率路徑，有兩種分數：

- **條件分數** `∇ log p_t(x|z)`：只看單一資料點。
- **邊際分數** `∇ log p_t(x)`：看整個資料分佈。

兩者的關係跟向量場一模一樣，邊際分數就是條件分數的後驗加權平均（eq. 38）：

```text
∇ log p_t(x) = ∫ ∇ log p_t(x|z) · p_t(x|z) p_data(z) / p_t(x) dz      (38)
```

講義的證明只用了 `∂_y log y = 1/y` 和連鎖律（eq. 39）。

**Example 15** 算出高斯路徑 `N(α_t z, β_t² I_d)` 的條件分數：

```text
∇ log p_t(x|z) = −(x − α_t z) / β_t²          (40)
```

## 向量場和分數可以互換

注意 eq. (40) 是 x 和 z 的線性函數。上一講的條件向量場 eq. (20) 也是。Slides 3 的說法是：兩個都是線性函數，只是係數不同。所以它們可以互相換算。

**Proposition 1（轉換公式，p.26）**：在高斯路徑上，

```text
u_t(x|z) = a_t ∇ log p_t(x|z) + b_t x         (41)
u_t(x)   = a_t ∇ log p_t(x)   + b_t x         (42)
a_t = β_t² (α̇_t / α_t) − β̇_t β_t,   b_t = α̇_t / α_t
```

條件版是代數硬算；邊際版是兩邊一起做後驗加權積分，再用 eq. (38) 和「後驗積分成 1」。

講義形容這個結果很驚人：**學會邊際向量場，就等於學會了分數，反之亦然。** Slides 3 補一句：早期 diffusion model 學的是分數，再轉換成向量場，這兩者是等價的。

<details>
<summary>Remark 16：denoiser，另一種等價的參數化（p.26）</summary>

轉換之所以成立，是因為邊際化之後，向量場和分數都只是後驗平均 `E_{z|x}[z]` 的線性重新參數化。所以任何能還原 `E_{z|x}[z]` 的量，都能拿來還原向量場和分數，而且在數值與訓練穩定性上有時更好。

最常見的選擇就是後驗平均本身，稱為 **denoiser**：

```text
D_t(x|z) = z,   D_t(x) = ∫ z · p_t(x|z) p_data(z) / p_t(x) dz
                       = (β_t u_t(x) − β̇_t x) / (α̇_t β_t − α_t β̇_t)     (43)
```

直覺是：給定帶雜訊的 x，乾淨資料 z 的期望值。講義說大家常把這類模型叫 denoising diffusion model，因為學 `D_t` 跟學 `u_t` 在理論上等價。講義也留了一題思考：denoiser 一定會輸出「乾淨」的資料點嗎？

</details>

## 用 SDE 取樣：加雜訊，但分佈不變

目前為止，我們能讓 ODE 的軌跡沿著機率路徑走。有了分數，就能把這個結果推廣到 SDE。

**Theorem 17（SDE extension trick，pp.27–28）**：對任意 diffusion coefficient `σ_t ≥ 0`，

```text
X_0 ~ p_init,
dX_t = [ u_t(X_t) + (σ_t² / 2) ∇ log p_t(X_t) ] dt + σ_t dW_t      (44)
⇒  X_t ~ p_t  (0 ≤ t ≤ 1)                                           (45)
```

也就是在原本的向量場上加兩樣東西：一項 `σ_t dW_t` 的雜訊，和一項往高機率方向拉的分數修正。雜訊把粒子打散，分數修正把它拉回來，兩者抵銷，**每個時刻的分佈都不變**，所以 `X_1 ~ p_data`。講義 Figure 9 顯示，軌跡變得鋸齒狀，但分佈跟 ODE 版一樣。

講義強調這個結果最驚人的地方：**σ_t 可以在網路訓練完之後才選**。

理論上任何 σ_t 都行。實務上有兩種誤差：網路沒有完美學到向量場和分數（訓練誤差），以及 σ_t 很大時 Euler–Maruyama 需要極小的步長（模擬誤差）。所以對一個訓練好的模型，存在一個可以用實驗找出的最佳 σ_t。講義註腳特別說明，「最佳 σ_t」是不完美訓練和有限算力的產物，不是連續極限下的理論性質。

Slides 3 把「為什麼要用 SDE」講得更直白：

- 理論上所有 diffusion coefficient 結果都一樣。
- 實務上有訓練誤差和模擬誤差。
- 下游應用（fine-tuning、inference-time optimization 等）可能需要隨機的演化。
- 好消息：ODE 取樣常常效果最好。**SDE 取樣是選項，不是必須。**

**Example 18（p.28）**：在高斯路徑上，用 Proposition 1 可以把整個 SDE 只用分數寫出來。

```text
dX_t = [ (a_t + σ_t²/2) ∇ log p_t(X_t) + b_t X_t ] dt + σ_t dW_t     (46)–(47)
```

### 為什麼分佈不變：Fokker–Planck 方程

上一講用 continuity equation 證明 ODE 沿著路徑走；SDE 需要它的推廣版。這是第二個偏微分方程，一樣先抓直覺。

**Theorem 19（Fokker–Planck equation，p.29）**：SDE `dX_t = u_t(X_t) dt + σ_t dW_t` 的分佈 `X_t ~ p_t`，若且唯若

```text
∂_t p_t(x) = −div(p_t u_t)(x) + (σ_t² / 2) Δp_t(x)      (49)
```

`Δ` 是 Laplacian（eq. 48）。σ_t = 0 時就退回 continuity equation。多出來的 Laplacian 項，講義用熱傳導類比：熱方程裡也有同一項，而熱方程其實是 Fokker–Planck 的特例。熱會在介質中擴散；我們加的是一個數學上的擴散過程，所以多一項 Laplacian。Slides 3 把它畫成「dispersion」。

<details>
<summary>用 Fokker–Planck 證明 Theorem 17（講義 p.29）</summary>

要證明 eq. (44) 的 SDE 滿足 `p_t` 的 Fokker–Planck 方程：

```text
∂_t p_t = −div(p_t u_t)                                         Theorem 11
        = −div(p_t u_t) − (σ_t²/2) Δp_t + (σ_t²/2) Δp_t         加減同一項
        = −div(p_t u_t) − div((σ_t²/2) ∇p_t) + (σ_t²/2) Δp_t    Laplacian 定義
        = −div(p_t u_t) − div(p_t (σ_t²/2) ∇log p_t) + (σ_t²/2) Δp_t   ∇log p_t = ∇p_t / p_t
        = −div(p_t [u_t + (σ_t²/2) ∇log p_t]) + (σ_t²/2) Δp_t   div 是線性的
```

最後一行正是漂移項為 `u_t + (σ_t²/2)∇log p_t` 的 Fokker–Planck 方程。Fokker–Planck 本身的完整證明在講義附錄 B（p.72 起）。

</details>

### 特例：Langevin dynamics

**Remark 20**（講義標為 Optional，pp.29–30）：如果機率路徑不隨時間變，`p_t = p`，那就設 `u_t = 0`，得到

```text
dX_t = (σ_t² / 2) ∇ log p(X_t) dt + σ_t dW_t        (50)
```

這就是 **Langevin dynamics**。由 Theorem 17，p 是它的穩態分佈：從 p 出發，永遠停在 p。在溫和條件下，從別的分佈出發也會收斂到 p。講義說它是分子動力學模擬和許多 MCMC 方法的基礎；p 是高斯時，就得到 Ornstein–Uhlenbeck 過程，也是 diffusion model 最早期的形式基礎。[Lab 1](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes) Part 3 就是在做這件事。

**Remark 21**（Optional）只提一句：GLASS Flows 是一個取樣技巧，能純粹用 ODE 得到跟 SDE 一樣的隨機轉移。

## Score matching：分數也能用同一招學

最後一塊：怎麼學邊際分數 `∇ log p_t(x)`？在高斯路徑上，直接用 Proposition 1 從向量場換算就好。一般情況下，講義說也可以直接學。

用一個 score network `s_t^θ`，照上一講的套路寫兩個 loss（§4.3，p.31）：

```text
L_SM(θ)  = E_{t, z~p_data, x~p_t(·|z)} ‖s_t^θ(x) − ∇ log p_t(x)‖²      score matching
L_CSM(θ) = E_{t, z~p_data, x~p_t(·|z)} ‖s_t^θ(x) − ∇ log p_t(x|z)‖²    conditional score matching
```

邊際分數算不出來，條件分數算得出來。

**Theorem 22**：`L_SM(θ) = L_CSM(θ) + C`，梯度相同，最小化後 `s_t^θ = ∇ log p_t`。證明跟上一講的 Theorem 12 完全一樣，因為 eq. (38) 和 eq. (18) 長得一樣，把向量場換成分數就行。

### 在高斯路徑上：預測雜訊

**Example 23（Denoising Diffusion Models，pp.31–32）**把條件分數 eq. (51) 代進去，再把 x 換成 `α_t z + β_t ε`：

```text
∇ log p_t(x|z) = −(x − α_t z) / β_t²                                   (51)
L_CSM(θ) = E ‖s_t^θ(α_t z + β_t ε) + ε / β_t‖²
         = E [ (1/β_t²) ‖β_t s_t^θ(α_t z + β_t ε) + ε‖² ]
```

網路實際上在學的是：**預測當初用來污染資料點的雜訊**。這就是「denoising」score matching 名稱的由來。Slides 3 用大字寫著同一件事。

但這個 loss 在 `β_t ≈ 0` 時數值不穩定，也就是只有加了夠多雜訊才有效。講義說，早期的 [Denoising Diffusion Probabilistic Models（DDPM）](https://arxiv.org/abs/2006.11239)因此拿掉常數 `1/β_t²`，並把 score network 重新參數化成 noise predictor `ε_t^θ = −β_t s_t^θ`：

```text
L_DDPM(θ) = E_{t~Unif, z~p_data, ε~N(0,I_d)} ‖ε_t^θ(α_t z + β_t ε) − ε‖²
```

**Algorithm 4（p.32）**把整個訓練程序寫成跟上一講 Algorithm 3 幾乎一樣的形狀：

```text
對每個 mini-batch：
  從資料集抽 z
  抽 t ~ Unif[0,1]
  抽 ε ~ N(0, I_d)
  x_t = α_t z + β_t ε
  L(θ) = ‖s_t^θ(x_t) + ε/β_t‖²     或   L(θ) = ‖ε_t^θ(x_t) − ε‖²
  用梯度下降更新 θ
```

## Summary 24：這一講的全部

講義 pp.32–33 的 Summary 24，加上 Slides 3 的 Key takeaway，可以收成三句話：

1. **轉換公式**：在高斯路徑上，學邊際向量場和學分數是等價的（Proposition 1）。
2. **Denoising score matching**：用條件分數當目標，就能簡單地學到邊際分數（Theorem 22）。
3. **用分數取樣**：想要多少雜訊就加多少，再對向量場做分數修正（Theorem 17，eq. 52–53）。

在高斯路徑上，不需要分別訓練 `s_t^θ` 和 `u_t^θ`，用 Proposition 1 互換即可。

## Flow matching 和 diffusion 到底什麼關係

把兩講放在一起看：

| | L2 Flow matching | L3A Score matching |
|---|---|---|
| 學的物件 | 邊際向量場 `u_t(x)` | 邊際分數 `∇ log p_t(x)` |
| 回歸目標 | 條件向量場 `u_t(x\|z)` | 條件分數 `∇ log p_t(x\|z)` |
| 等價定理 | Theorem 12 | Theorem 22 |
| 取樣 | ODE | 任意 σ_t 的 SDE（σ_t = 0 就是 ODE） |
| 高斯路徑上 | 預測 `α̇_t z + β̇_t ε` | 預測雜訊 ε |

在高斯路徑上，兩邊學到的東西可以用 Proposition 1 互換。差別主要在參數化、數值穩定性，以及取樣時要不要加雜訊。

## 讀完這講，你應該能

- 寫出高斯路徑的條件分數，並說明它為什麼能跟條件向量場互換。
- 解釋 SDE extension trick 裡分數修正項的作用，以及為什麼 σ_t 可以訓練後才選。
- 說出 Fokker–Planck 比 continuity equation 多了哪一項、代表什麼。
- 從 denoising score matching 推到 DDPM 的 noise prediction loss。

**今晚就能做的事**：讀講義 pp.25–27，把 eq. (40) 代進 eq. (41)，驗證右邊真的等於上一講的 eq. (20)。這個代數正是 [Lab 2](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching) Question 3.3 要你寫成程式的東西。

## 延伸閱讀

- DDPM 視角：[CMU 11-785 L23：擴散模型](/posts/ai/2026-08-22-cmu-11785-23-diffusion)。**注意時間方向相反**：Slides 3 的「A guide to the diffusion literature」區分 flow time convention（資料在 t=1、雜訊在 t=0，本課採用）和 diffusion time convention（資料在 t=0、雜訊在 t→∞）。講義附錄 E 也提醒，流行的寫法是 t=0 對應 `p_data`。DDPM 屬於後者，對照公式前先把 t 翻過來。
- 另一份講義的 diffusion 章節：[Stanford CS229 2026 講義第 14 章：Diffusion models](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models)
- 講義附錄 E（A Guide to the Diffusion Model Literature）：說明離散時間 vs 連續時間、forward process vs 機率路徑、反向時間慣例，以及 flow matching 與 stochastic interpolants 的關係，把文獻的寫法對回本課的語言

系列導覽：上一篇 [L2：Flow matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)｜下一篇 [Lab 2：親手寫 flow matching 與 score matching](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching)｜[回系列總覽](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-10-10：重查影片狀態。即時核對官方課程頁，講次與影片連結一致且影片公開，狀態改為「已附影片」。

## 參考資料

- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — 第 3-A 講主題列表
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（講義 PDF）](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §4：eq. (38)–(54)、Example 15、Proposition 1、Remark 16、Theorem 17、Example 18、Theorem 19、Remark 20–21、Theorem 22、Example 23、Algorithm 4、Summary 24；附錄 B、E
- [arXiv 2506.02070](https://arxiv.org/abs/2506.02070) — 講義的 arXiv 版本
- [Slides 3（20260123_Lecture_03.pdf）](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) — 前半：分數函數、轉換公式、denoising score matching、Fokker–Planck 圖解、為什麼要 SDE、Langevin、Key takeaway；後半的 time conventions 對照
- [第 3-A 講錄影：Score Functions (2026)](https://www.youtube.com/watch?v=ngC3QnYSVNM)
- [Ho, Jain & Abbeel 2020, Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) — 講義引用的 DDPM 原論文
