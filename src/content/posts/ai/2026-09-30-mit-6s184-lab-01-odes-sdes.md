---
title: "MIT 6.S184 Lab 1：模擬 ODE 與 SDE"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, generative-ai, score-matching]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 2
tldr: "MIT 6.S184 Lab 1 分三部分：先寫 Euler 和 Euler–Maruyama 的 step 函式，再用它們模擬 Brownian motion 與 Ornstein–Uhlenbeck 過程，觀察 σ 和 θ 怎麼決定軌跡與終點分佈，最後實作 Langevin dynamics，看一團點怎麼被推向一個五峰高斯混合，並用一段手算證明 OU 過程就是目標為高斯的 Langevin dynamics。題目、程式框架與官方解答都在 GitHub；校外讀者沒有 Gradescope 評分，只能自己對解答。"
description: "MIT 6.S184（IAP 2026）Lab 1 導讀：lab_one.ipynb 的結構、每題在考什麼（Q1.1 Euler／Euler–Maruyama、Q2.1 Brownian motion、Q2.2 OU 過程與 σ²/2θ、Q3.1 LangevinSDE、Q3.2 OU 即 Langevin），對照講義 Algorithm 1–2、Example 6、Remark 20，以及怎麼用官方解答自我檢查。不貼完整解答。"
draft: false
glossary:
  - term: "Langevin dynamics"
    definition: "漂移項是 (σ²/2)∇log p(x)、再加上 σ dW_t 的 SDE；在溫和條件下，它會把任意初始分佈推向 p，而且 p 是它的穩態分佈。"
    context: "Lab 1 Part 3 的主角，講義 Remark 20 的特例。"
  - term: "score"
    aliases: ["score function", "分數函數"]
    definition: "log 密度的梯度 ∇log p(x)，指向密度上升最快的方向。"
    context: "Lab 1 用它建 Langevin dynamics；講義 §4 會正式展開。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en)

> **版本說明**：本文依據 [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026 的 Lab 1：[`labs/lab_one.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_one.ipynb) 與官方解答 [`solutions/lab_one_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_one_complete.ipynb)（branch `2026`），對照[講義](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) Algorithm 1–2、Example 6 與 Remark 20。2026-09-30 核對。本文只說明每題在考什麼，不貼完整解答。

**系列位置**：上一篇 [L1：生成就是取樣，ODE 與 SDE 是機器](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models)｜下一篇 [L2：Flow matching，從條件路徑學邊際向量場](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)｜[系列總覽](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)

[第 1 講](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models)給了兩條更新式：Euler 和 Euler–Maruyama。Lab 1 要你把它們寫成程式，然後拿來看三種 SDE 的行為。整份 lab 不訓練任何神經網路，向量場都是手寫的，目的是讓你先對「模擬一條 SDE」有手感。

## 課程影片來源

請由官方課程入口核對本文對應講次；本次未核實可直接嵌入的該篇公開錄影。

課程與錄影入口：

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## 開始前

課程網站上這個 lab 叫 **Lab 1: Working with ODEs and SDEs**，notebook 標題是 Lab One: Simulating ODEs and SDEs。網站的流程是：

1. 從 GitHub 下載 `.ipynb`，用 Jupyter 或 Google Colab 打開。
2. 做完所有題目。
3. 匯出 PDF，透過 Canvas 交到 Gradescope（不要清掉 cell 輸出）。

第 3 步只有 MIT 修課生能做。校外讀者的回饋來源只有官方解答，所以建議先自己寫完、跑出圖，再打開 `lab_one_complete.ipynb` 對。

環境需求在第一個 code cell：PyTorch（用到 `torch.func` 的 `vmap` 與 `jacrev`）、matplotlib、seaborn、tqdm。有 GPU 會用 CUDA，沒有就跑 CPU；這份 lab 的計算量不大。

[README 的 changelog](https://github.com/eje24/iap-diffusion-labs/tree/2026) 跟 Lab 1 有關的紀錄有兩筆：1/22/25 修了幾個錯字，3/9/25 修了 Langevin dynamics 的 timestep bug。直接從 2026 branch 下載就是修正後的版本。

## Part 0：兩個抽象類別

notebook 先定義 `ODE` 與 `SDE` 兩個抽象類別。`ODE` 只要一個 `drift_coefficient(xt, t)`，`SDE` 多一個 `diffusion_coefficient(xt, t)`。drift coefficient 就是講義的向量場 `u_t(x)`，diffusion coefficient 就是 `σ_t`。

notebook 提醒：ODE 本來就能看成 diffusion coefficient 為 0 的 SDE，這裡分開寫是出於教學與效能考量。

## Part 1：Question 1.1，兩個 step 函式

`Simulator` 基底類別已經寫好 `simulate` 迴圈：沿著給定的時間網格 `ts`，每一步算出步長 `h`，呼叫 `step`。你要填的是：

- `EulerSimulator.step`：對應講義 eq. (4)、[Algorithm 1](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models) 的第 5 行。
- `EulerMaruyamaSimulator.step`：對應講義 eq. (9)、Algorithm 2 的第 5–6 行。

**這題在考什麼**：確認你把 diffusion coefficient 乘上 `√h` 和一個與 `xt` 同形狀的標準高斯雜訊，而不是乘 `h`。notebook 在 cell 裡寫了公式，照著翻成 tensor 運算即可。notebook 接著提醒：diffusion coefficient 為 0 時，兩個 simulator 完全等價。

**自我檢查**：Euler–Maruyama 的一步，是 Euler 的一步再加一個雜訊項。你的程式如果寫不出這個結構，就是寫錯了。

## Part 2：看 SDE 的軌跡

### Question 2.1：Brownian motion

設 `u_t = 0`、`σ_t = σ`，就是 scaled Brownian motion `dX_t = σ dW_t`。你要：

1. 先回答一題直覺題：σ 很大或接近 0 時，軌跡會長什麼樣？
2. 填 `BrownianMotion` 的兩個 coefficient。
3. 跑預設的繪圖 cell（500 條軌跡、時間 0 到 5），再回答：改變 σ 會怎樣？

官方解答對最後一題的回答只有一句：終點值分佈的變異數變大。這跟講義 eq. (5) 的常態增量直接對得上。

### Question 2.2：Ornstein–Uhlenbeck 過程

設 `u_t(x) = −θx`、`σ_t = σ`，就是講義 [Example 6](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models) 的 OU 過程。流程類似：

1. 直覺題：θ 很小或很大時，軌跡會怎樣？
2. 填 `OUProcess` 的兩個 coefficient。
3. 預設的比較 cell 用 θ=0.25、σ ∈ {0, 0.5, 2.0}，跟講義 Figure 3 的設定同一個 θ。上排畫軌跡，下排畫終點分佈。
4. 觀察題：軌跡收斂到一個點還是一個分佈？要寫成「當 θ 或 σ 上升／下降時，我們看到……」兩句話。

提示是盯著比值 **D = σ²/(2θ)**。這正是講義 Example 6 說的極限分佈 `N(0, σ²/(2θ))` 的變異數。接下來的 cell 把 D 固定在 0.25、1、4，σ 取 1、2、10，排成九宮格讓你看。

官方解答的結論分兩個方向讀：同一列（D 固定）時，σ 越大，收斂到同一個高斯的速度越快；同一欄（σ 固定）時，D 越大，終點分佈越寬。

**這一節在考什麼**：把「向量場往回拉、雜訊往外推」的拉扯，跟極限分佈的變異數公式連起來。

## Part 3：用 SDE 搬動整個分佈

Part 2 看的是單一軌跡，Part 3 改看一整團點。notebook 的說法是：我們真正在乎的是 SDE 怎麼轉換**分佈**，因為最終目標是把高斯雜訊轉成 `p_data`。

這裡先介紹 **score**：log 密度的梯度 `∇log p(x)`。notebook 的 `Density` 類別用 `vmap(jacrev(log_density))` 自動算它，你不用手寫。準備好的分佈有 2D 高斯與兩種 Gaussian mixture（隨機擺放的、對稱排列的）。

### Question 3.1：LangevinSDE

實作 overdamped Langevin dynamics：

```text
dX_t = ½ σ² ∇log p(X_t) dt + σ dW_t
```

填 `LangevinSDE` 的兩個 coefficient。drift 用得到 `self.density.score(xt)`。

預設實驗：目標是一個 5 峰的 Gaussian mixture，σ=0.6，起點從一個很寬的高斯（共變異數 20·I）抽 1000 個點，模擬 t 從 0 到 5。然後要你改 σ、步數、時間範圍、起點分佈和目標，回答看到了什麼、為什麼。官方解答的觀察是：分佈會收斂到建構 Langevin dynamics 用的那個分佈，而且 σ 越大收斂越快。

這對應講義 **Remark 20**（Langevin dynamics，p.29）：當機率路徑是常數 `p_t = p`，得到的 SDE 就是 Langevin dynamics；`p` 是它的穩態分佈，而且在溫和條件下，從別的分佈出發也會收斂到 `p`。講義 Figure 10 畫的正是 5 峰高斯混合下的粒子演化。Remark 20 在講義 §4.2，對應[第 3-A 講](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)；notebook 內文寫「In Lecture 2, we will make this notion of driving more precise」，跟 2026 講義的章節編排不完全一致，讀的時候以講義 §4.2 為準。

之後兩個 cell 是選做的動畫，需要 `ffmpeg`（notebook 建議用 conda 裝，`pip install ffmpeg` 多半不行）與 `celluloid`。

### Question 3.2：OU 就是 Langevin dynamics

最後是一段手算，兩小題：

1. 證明 `p(x) = N(0, σ²/(2θ))` 時，score 是 `−(2θ/σ²) x`。notebook 給了這個高斯的密度函數當提示。
2. 由此推出：目標是這個高斯的 Langevin dynamics，就是 OU 過程 `dX_t = −θX_t dt + σ dW_t`。

**這題在考什麼**：把 Part 2 的 OU 和 Part 3 的 Langevin 接起來。對 log 密度取導數，常數項消失，剩下一個線性函數；代回 Langevin 的 drift，`½σ²` 剛好把 `2θ/σ²` 約成 θ。講義 Remark 20 最後一句說的也是這件事：OU 過程是目標為高斯時的 Langevin dynamics 特例，也是早期 diffusion model 的基礎。

## 做完這個 lab，你應該能

- 把任意 `drift_coefficient`／`diffusion_coefficient` 組合丟進 simulator 跑出軌跡。
- 從圖上讀出 σ 與 θ 各自的作用，並用 σ²/(2θ) 解釋 OU 的終點分佈。
- 說出 Langevin dynamics 為什麼需要 score，以及它跟 OU 的關係。

**今晚就能做的事**：只做 Question 1.1 和 2.2 的前三步，跑出 θ=0.25 的三張圖，跟講義 Figure 3 並排比對。

## 延伸閱讀

- 這些模擬器在 Lab 2 會被重用，搭配訓練好的向量場：[Lab 2：親手寫 flow matching 與 score matching](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching)
- score 與 Langevin 的正式推導：[L3A：分數函數、SDE 取樣與 score matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)

## 更新紀錄

- 2026-10-10：補上課程影片來源與錄影取得方式。

## 參考資料

- [lab_one.ipynb（branch 2026）](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_one.ipynb) — 題目結構、預設參數、提示
- [lab_one_complete.ipynb（官方解答）](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_one_complete.ipynb) — 各觀察題的官方回答
- [eje24/iap-diffusion-labs README](https://github.com/eje24/iap-diffusion-labs/tree/2026) — changelog（1/22/25、3/9/25）
- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — Labs 區的繳交流程
- [Holderrieth & Erives 講義 PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — eq. (4)、(5)、(9)，Algorithm 1–2，Example 6、Figure 3，Remark 20、Figure 10
