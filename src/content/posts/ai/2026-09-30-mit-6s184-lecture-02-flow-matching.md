---
title: "MIT 6.S184 L2：Flow matching，從條件路徑學邊際向量場"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, flow-matching, diffusion-model, generative-ai]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 3
tldr: "我們想學的是「邊際向量場」：沿著它跑 ODE，雜訊會流成資料。問題是它要對整個資料集積分，算不出來。Flow matching 的解法是改成回歸「條件向量場」，也就是只把雜訊推向單一資料點的那個場，這個有公式。講義 Theorem 12 證明兩個 loss 只差一個常數、梯度相同。落到 CondOT 路徑上，訓練只剩一行：取資料 z、雜訊 ε、時間 t，讓網路在 tz+(1−t)ε 這個點預測 z−ε。"
description: "MIT 6.S184（IAP 2026）第 2 講導讀，依講義 §3 與 Slides 2：條件與邊際機率路徑、高斯條件路徑（Example 8）、條件向量場與 Example 10、marginalization trick（Theorem 9）、continuity equation（Theorem 11）、FM loss 與 CFM loss 的等價（Theorem 12）、Algorithm 3 CondOT 訓練、Example 13 與 Summary 14。"
draft: false
glossary:
  - term: "機率路徑"
    aliases: ["probability path"]
    definition: "一族隨時間 t 從 0 到 1 變化的分佈 p_t，t=0 是雜訊、t=1 是資料（或單一資料點），描述「中間每個時刻的分佈應該長什麼樣」。"
    context: "講義 §3.1。它只規定每個時刻的分佈，不規定單一粒子怎麼移動。"
  - term: "條件向量場"
    aliases: ["conditional vector field"]
    definition: "只針對單一資料點 z 設計的向量場 u_t(x|z)；沿著它跑 ODE，雜訊會收斂到 z。通常能用手算出公式。"
    context: "Flow matching 用它當回歸目標，間接學到算不出來的邊際向量場。"
  - term: "CondOT 路徑"
    aliases: ["CondOT probability path", "straight line schedule"]
    definition: "α_t = t、β_t = 1 − t 的高斯條件路徑 N(tz, (1−t)² I_d)，雜訊與資料之間做線性內插。"
    context: "講義 Algorithm 3 用的就是這條路徑，條件向量場化簡成 z − ε。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en)

**影片狀態：已附影片；播放未逐支確認。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依 [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026 版，2026-09-30 對照[講義 PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §3（pp.14–24）與 [Slides 2](https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf) 撰寫，[第 2 講錄影](https://www.youtube.com/watch?v=PNkMKWW8Khw)可搭配觀看。存取等級 **A3 足以自學**。公式編號一律指講義原文。

**系列位置**：[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)第 3 篇｜上一篇 [Lab 1：模擬 ODE 與 SDE](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes)｜下一篇 [L3A：分數函數、SDE 取樣與 score matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)

[第 1 講](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models)給了生成的機器：從高斯雜訊 `X_0 ~ p_init` 出發，沿著神經網路向量場 `u_t^θ` 跑 ODE，拿 t=1 的終點當樣本。可是沒訓練過的網路只會產出雜訊。

這一講回答一個問題：**要怎麼調 θ，讓 ODE 的終點 `X_1` 服從資料分佈 `p_data`？** 講義給的答案叫 flow matching，§3 開頭形容它簡單、可規模化，而且代表目前最先進的做法。

先記住時間方向：這門課的 **t=0 是雜訊，t=1 是資料**。很多 diffusion 文獻剛好相反，後面對照其他教材時要小心。

## 課程影片來源

影片連結已與本文採用版本的官方課程頁核對。

```youtube
url: https://www.youtube.com/watch?v=PNkMKWW8Khw
title: 第 2 講錄影：Flow Matching (2026)
```

原始影片：[第 2 講錄影：Flow Matching (2026)](https://www.youtube.com/watch?v=PNkMKWW8Khw)

課程與錄影入口：

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## 一張表先看懂整講

Slides 2 把這一講整理成一個 2×3 的「Flow Matching Matrix」。上排是「條件」，意思是只看**單一資料點**；下排是「邊際」，意思是看**整個資料分佈**。

| | 機率路徑 | 向量場 | 訓練 loss |
|---|---|---|---|
| 條件（單一資料點 z） | `p_t(x\|z)` | `u_t(x\|z)` | CFM loss |
| 邊際（整個資料集） | `p_t(x)` | `u_t(x)` | FM loss |
| 能不能算 | 上排都有公式 | 下排都算不出來 | 但下排可以透過上排學到 |

整講的推論是由左往右、由上往下。先定條件路徑，推出條件向量場，再證明它們平均起來就是邊際版本。最後一步證明：回歸條件向量場，等於回歸邊際向量場。

## 第一步：選一條從雜訊到資料的路

ODE 只規定起點（`p_init`）和終點（`p_data`），中間 0<t<1 的分佈可以自己選。**機率路徑**就是把這個選擇寫下來。

**條件機率路徑** `p_t(x|z)` 針對單一資料點 z：t=0 時是 `p_init`，t=1 時收縮成只會吐出 z 的 Dirac delta `δ_z`（eq. 11）。

**邊際機率路徑** `p_t(x)` 是先抽一個資料點 `z ~ p_data`，再從 `p_t(·|z)` 抽樣得到的分佈（eq. 12–13）。它從 `p_init` 內插到 `p_data`（eq. 14）。

講義特別提醒一個不對稱：**我們能從 `p_t` 抽樣，但算不出它的密度**，因為密度要對整個資料分佈積分。後面每一步都在繞過這個積分。

Slides 2 還補了一句值得記住的話：機率路徑只規定每個時刻的「快照」分佈，完全沒說單一粒子怎麼移動。粒子的動態是下一步向量場的事。

### 最重要的例子：高斯條件路徑

講義說高斯路徑是「目前為止最重要的例子」，建議讀者仔細讀（Example 8，p.15）。取兩個 noise scheduler `α_t`、`β_t`，都是連續可微的單調函數，邊界條件是 `α_0 = β_1 = 0`、`α_1 = β_0 = 1`：

```text
p_t(·|z) = N(α_t z, β_t² I_d)                               (15)
z ~ p_data, ε ~ N(0, I_d)  ⇒  x = α_t z + β_t ε ~ p_t       (16)
```

t=0 時 `α_0 = 0`、`β_0 = 1`，只剩雜訊；t=1 時 `α_1 = 1`、`β_1 = 0`，只剩資料點。t 越小，加的雜訊越多。

## 第二步：條件向量場，把雜訊推向單一資料點

路徑只是「希望」每個時刻的分佈長這樣。要真的讓粒子照著走，需要一個向量場。

對每個資料點 z，**條件向量場** `u_t(x|z)` 是任何能讓 ODE 產生條件路徑的向量場：從 `X_0 ~ p_init` 出發，沿著它走，`X_t ~ p_t(·|z)`（eq. 17）。它通常可以用代數手算出來。

高斯路徑的答案是 Example 10（p.17）：

```text
u_t(x|z) = (α̇_t − (β̇_t / β_t) α_t) z + (β̇_t / β_t) x        (20)
```

`α̇_t`、`β̇_t` 是對時間的導數。

<details>
<summary>Example 10 的證明（講義 p.18）</summary>

先定義條件 flow `ψ_t(x|z) = α_t z + β_t x`（eq. 21）。如果 `X_0 ~ N(0, I_d)`，那麼 `X_t = α_t z + β_t X_0 ~ N(α_t z, β_t² I_d)`，正好是條件路徑。

剩下的是從 flow 反推向量場。依 flow 的定義，`d/dt ψ_t(x|z) = u_t(ψ_t(x|z)|z)`：

```text
α̇_t z + β̇_t x = u_t(α_t z + β_t x | z)          對所有 x, z
把 x 換成 (x − α_t z)/β_t：
α̇_t z + β̇_t (x − α_t z)/β_t = u_t(x|z)
整理後就是 eq. (20)。
```

講義註腳說，也可以把它代進後面的 continuity equation 再驗算一次。

</details>

條件向量場單獨看起來沒什麼用：所有軌跡都會塌縮到同一個 z，等於只是重新產生已知的資料點。它的價值在下一步。

## 第三步：平均起來，就是我們要的邊際向量場

**Theorem 9（Marginalization trick，p.16）**：把條件向量場用下面的權重平均，得到的邊際向量場 `u_t(x)` 會讓 ODE 沿著邊際路徑走，所以 `X_1 ~ p_data`。

```text
u_t(x) = ∫ u_t(x|z) · p_t(x|z) p_data(z) / p_t(x) dz          (18)
X_0 ~ p_init,  dX_t/dt = u_t(X_t)  ⇒  X_t ~ p_t  (0 ≤ t ≤ 1)  (19)
```

權重 `p_t(x|z) p_data(z) / p_t(x)` 用貝氏定理看，就是「看到帶雜訊的 x 之後，它來自資料點 z 的後驗機率」。講義的直覺是：對每個可能的資料點 z，取「往 z 走」的速度，再依「我多相信 x 是從 z 來的」加權，全部平均起來。

問題也在這裡：這個積分要掃過整個資料分佈，**算不出來**。

### 為什麼平均真的有效：continuity equation

要證明 Theorem 9，講義用了一個數學與物理的基本工具。這是本系列第一次出現偏微分方程，不熟也沒關係，先抓直覺。

**Theorem 11（Continuity equation，p.19）**：ODE 的粒子分佈 `X_t ~ p_t`，若且唯若

```text
∂_t p_t(x) = −div(p_t u_t)(x)          對所有 x 與 0 ≤ t ≤ 1     (23)
```

左邊是位置 x 的機率密度隨時間怎麼變。右邊的 divergence 量的是向量場的淨流出，加負號就是淨流入，再乘上 x 當下的機率質量。**機率總量守恆（永遠積分成 1），所以某處變多，一定是從別處流進來。** Slides 2 畫的就是這張「流出減流入」的圖。

<details>
<summary>用 continuity equation 證明 Theorem 9（講義 p.19）</summary>

目標是證明 eq. (18) 的 `u_t` 滿足 continuity equation。

```text
∂_t p_t(x) = ∂_t ∫ p_t(x|z) p_data(z) dz
           = ∫ ∂_t p_t(x|z) p_data(z) dz
           = ∫ −div(p_t(·|z) u_t(·|z))(x) p_data(z) dz      條件路徑滿足 continuity eq.
           = −div( ∫ p_t(x|z) u_t(x|z) p_data(z) dz )       積分與 div 交換
           = −div( p_t(x) ∫ u_t(x|z) p_t(x|z) p_data(z) / p_t(x) dz )
           = −div(p_t u_t)(x)                                代入 eq. (18)
```

頭尾相接就是 continuity equation，再由 Theorem 11 得到 eq. (19)。Continuity equation 本身的完整證明在講義附錄 B（p.72 起）。

</details>

## 第四步：回歸條件向量場，等於回歸邊際向量場

最直接的訓練目標是讓網路逼近邊際向量場，用均方誤差：

```text
L_FM(θ)  = E_{t~Unif, x~p_t} ‖u_t^θ(x) − u_t(x)‖²                    (24)
         = E_{t~Unif, z~p_data, x~p_t(·|z)} ‖u_t^θ(x) − u_t(x)‖²     (25)
```

抽樣很容易：抽時間 t、抽資料點 z、加點雜訊得到 x。卡住的是 `u_t(x)` 本身，它就是上面那個算不出來的積分。

於是改用算得出來的條件向量場當目標，這就是 **conditional flow matching loss**：

```text
L_CFM(θ) = E_{t~Unif, z~p_data, x~p_t(·|z)} ‖u_t^θ(x) − u_t(x|z)‖²   (26)
```

直覺上這很可疑：我們在乎的是邊際向量場，憑什麼回歸條件向量場？

**Theorem 12（p.20）**給了答案：`L_FM(θ) = L_CFM(θ) + C`，C 跟 θ 無關，所以**兩者梯度相同**。用 SGD 最小化 CFM loss，就等於最小化 FM loss。在網路表達力無限的假設下，最小化 CFM loss 得到的網路就等於邊際向量場。講義的說法是：明著回歸算得出來的條件向量場，就是暗著回歸算不出來的邊際向量場。

<details>
<summary>Theorem 12 的證明骨架（講義 pp.20–21）</summary>

1. 把 `‖a − b‖² = ‖a‖² − 2aᵀb + ‖b‖²` 展開 FM loss。`‖u_t(x)‖²` 那項跟 θ 無關，記作常數 `C_1`。
2. 關鍵在交叉項。把期望值寫成積分，代入 eq. (18)，`p_t(x)` 會約掉：

```text
E_{t, x~p_t}[u_t^θ(x)ᵀ u_t(x)]
  = ∫∫ p_t(x) u_t^θ(x)ᵀ ∫ u_t(x|z) p_t(x|z) p_data(z) / p_t(x) dz dx dt
  = ∫∫∫ u_t^θ(x)ᵀ u_t(x|z) p_t(x|z) p_data(z) dz dx dt
  = E_{t, z~p_data, x~p_t(·|z)}[u_t^θ(x)ᵀ u_t(x|z)]
```

3. 交叉項從邊際版換成條件版之後，加減一項 `‖u_t(x|z)‖²` 湊回平方，就得到 `L_CFM(θ) + C_2 + C_1`。

</details>

講義點出這個演算法的三個特點：

1. **Simulation-free**：訓練時完全不用模擬 ODE，所以非常便宜。
2. **就是回歸**：跟監督式學習差不多。
3. **極度簡單**：很難想像比這更簡單的訓練目標。

訓練完，再用第 1 講的 Algorithm 1（Euler 法）模擬 `dX_t = u_t^θ(X_t) dt` 取樣（eq. 27）。這整套流程在文獻裡就叫 flow matching。

## 落到高斯路徑：訓練只剩一行

**Example 13（p.22）**把 CFM loss 套到高斯路徑。抽樣是 `x_t = α_t z + β_t ε`（eq. 28），條件向量場就是 eq. (20)，講義重寫成 eq. (29)。把 x 代換成 `α_t z + β_t ε` 之後，z 和 x 的係數會互相抵掉：

```text
L_CFM(θ) = E_{t~Unif, z~p_data, ε~N(0,I_d)} ‖u_t^θ(α_t z + β_t ε) − (α̇_t z + β̇_t ε)‖²   (31)
```

也就是：抽資料點、抽雜訊、算均方誤差。

再取最常見的特例 `α_t = t`、`β_t = 1 − t`，講義說這條路徑有時稱為 **(Gaussian) CondOT probability path**。此時 `α̇_t = 1`、`β̇_t = −1`，目標化簡成 `z − ε`。Slides 2 稱它 Straight Line Schedule：雜訊和資料之間做線性內插，網路要預測的是兩者的差。

**Algorithm 3（p.22）**就是這個特例：

```text
對每個 mini-batch：
  從資料集抽 z
  抽 t ~ Unif[0,1]
  抽 ε ~ N(0, I_d)
  x = t z + (1 − t) ε
  L(θ) = ‖u_t^θ(x) − (z − ε)‖²
  θ ← grad_update(L(θ))
```

講義說 Stable Diffusion 3、Meta 的 Movie Gen Video 都是用這個簡單的程序訓練的。Slides 2 也放了這兩個模型的生成範例。

## Summary 14：這一講的全部

講義 pp.23–24 的 Summary 14 把整講收成四步：

1. 選一條條件機率路徑 `p_t(x|z)`，滿足 `p_0(·|z) = p_init`、`p_1(·|z) = δ_z`。
2. 找一個條件向量場 `u_t(x|z)`，讓它的 flow 產生這條路徑（等價地說，滿足 continuity equation）。
3. 用 eq. (32) 平均出來的邊際向量場會讓 ODE 把雜訊變成資料。
4. 用 CFM loss 學它。

高斯路徑的三條公式（eq. 35–37）：

| 物件 | 公式 |
|---|---|
| 條件路徑 | `p_t(x\|z) = N(x; α_t z, β_t² I_d)` |
| 條件向量場 | `u_t(x\|z) = (α̇_t − (β̇_t/β_t) α_t) z + (β̇_t/β_t) x` |
| CFM loss | `E ‖u_t^θ(α_t z + β_t ε) − (α̇_t z + β̇_t ε)‖²` |

## 讀完這講，你應該能

- 說出條件與邊際機率路徑的差別，以及為什麼邊際版只能抽樣、不能算密度。
- 寫出高斯條件路徑與它的條件向量場。
- 用「後驗加權平均」解釋 marginalization trick。
- 用一句話說出 Theorem 12 為什麼讓 flow matching 可以訓練。
- 默寫 Algorithm 3。

**今晚就能做的事**：讀講義 pp.14–22，然後拿一張紙，把 `α_t = t`、`β_t = 1 − t` 代進 eq. (31)，自己推出 Algorithm 3 的目標 `z − ε`。推得出來，[Lab 2](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching) 的 Problem 3.1 就只剩寫程式。

## 延伸閱讀

- 下一步：同一條高斯路徑還有另一種看法，也就是 score function。見 [L3A：分數函數、SDE 取樣與 score matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)
- DDPM 視角：[CMU 11-785 L23：擴散模型](/posts/ai/2026-08-22-cmu-11785-23-diffusion)。對照時先確認時間方向，DDPM 系寫法通常是 t=0 為資料
- 另一門課的 flow matching 作業：[Berkeley CS189 HW2：回歸、GMM 與 flow matching](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching)
- 生成模型的整體介紹：[MIT 6.S191 L4：生成模型](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling)

系列導覽：上一篇 [Lab 1：模擬 ODE 與 SDE](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes)｜下一篇 [L3A：分數函數、SDE 取樣與 score matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)｜[回系列總覽](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — 第 2 講主題列表
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（講義 PDF）](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §3：eq. (10)–(37)、Example 8、Theorem 9、Example 10、Theorem 11、Theorem 12、Algorithm 3、Example 13、Summary 14；附錄 B
- [arXiv 2506.02070](https://arxiv.org/abs/2506.02070) — 講義的 arXiv 版本
- [Slides 2（20260122_Lecture_02.pdf）](https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf) — Flow Matching Matrix、機率路徑只規定快照、continuity equation 圖解、Straight Line Schedule、SD3 與 Movie Gen 範例
- [第 2 講錄影：Flow Matching (2026)](https://www.youtube.com/watch?v=PNkMKWW8Khw)
