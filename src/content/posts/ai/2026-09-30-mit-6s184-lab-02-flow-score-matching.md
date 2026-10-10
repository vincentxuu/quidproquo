---
title: "MIT 6.S184 Lab 2：親手寫 flow matching 與 score matching"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, flow-matching, score-matching, pytorch]
lang: zh-TW
series:
  name: "MIT 6.S184 導讀"
  order: 5
tldr: "Lab 2 把講義 §3–4 寫成 PyTorch：先實作高斯條件路徑、條件向量場、條件分數，再用兩個幾乎一樣的 trainer 分別做 flow matching 和 score matching，接著用 Proposition 1 從學到的向量場換算出分數，最後換成線性路徑，讓一個圓環分佈流成棋盤格。全部在 2D 玩具資料上跑。README 記載 1/11/26 修過一個 diffusion coefficient 的 bug；2026-09-30 查看時，這個修正只出現在解答 notebook，學生版還沒改，做之前要自己補上。"
description: "MIT 6.S184（IAP 2026）Lab 2 導讀，依 labs/lab_two.ipynb 與 solutions/lab_two_complete.ipynb：Problem 2.1–2.4（α_t／β_t、高斯條件路徑、條件向量場、條件分數）、Problem 3.1 flow matching 訓練、3.2 conditional score matching、Question 3.3 ScoreFromVectorField、Part 4 線性條件路徑與任意分佈之間的 flow matching，以及 1/11/26 changelog 修正的現況。"
draft: false
glossary:
  - term: "線性條件路徑"
    aliases: ["linear conditional probability path"]
    definition: "固定資料點 z，令 X_t = (1−t)X_0 + t z，X_0 從任意來源分佈抽樣；條件向量場是 (z − x)/(1 − t)。"
    context: "Lab 2 Part 4。它不要求來源分佈是高斯，所以能在任意兩個分佈之間做 flow matching，但沒有條件分數的封閉解。"
---

> 🌏 [English version](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en)

**影片狀態：僅附官方入口或錄影清單。** [影片來源與說明](#課程影片來源)

> **版本說明**：本文依 [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026 版的 Lab 2，2026-09-30 對照 [labs repo（branch 2026）](https://github.com/eje24/iap-diffusion-labs/tree/2026)的 [`labs/lab_two.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_two.ipynb)、[`solutions/lab_two_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_two_complete.ipynb) 與 README changelog 撰寫。存取等級 **A3 足以自學**：notebook 與官方解答都公開，但繳交評分只給 MIT 修課生。

**系列位置**：[MIT 6.S184 導讀](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)第 5 篇｜上一篇 [L3A：分數函數、SDE 取樣與 score matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)｜下一篇 [L3B：Guidance 與 classifier-free guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance)

[L2](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching) 和 [L3A](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching) 推了一堆公式：條件路徑、條件向量場、條件分數、兩個 loss、一個轉換公式。Lab 2 要你把它們全部寫成程式，並親眼看到「回歸條件目標，真的學到邊際目標」。

notebook 開頭說，這個 lab 是 flow matching 和 score matching 的直覺式動手導覽。全部在 2D 玩具分佈上跑；Problem 3.1 的訓練格，notebook 說大約要一分鐘。

這篇不貼完整解答，只講每一題在考什麼、跟講義哪裡對應、怎麼對官方解答。

## 課程影片來源

請由官方課程入口核對本文對應講次；本次未核實可直接嵌入的該篇公開錄影。

課程與錄影入口：

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## 開始之前：三件事

**1. 取得 notebook。** 課程網站的 Lab 2 入口是 Google Drive 連結；網站流程是從 GitHub 下載 `.ipynb`，用 Jupyter 或 Colab 打開。本文以 GitHub 版為準，因為解答在同一個 repo。

**2. 補上 1/11/26 的修正。** README changelog 最新一筆是：

> 1/11/26: Lab 2: Fix "doubly stochastic" diffusion coefficient bug in `ConditionalVectorFieldSDE` and `LangevinFlowSDE`

問題出在這裡：Lab 1 寫好的 `EulerMaruyamaSimulator.step` 已經會乘上 `torch.randn_like(xt)`，所以 SDE 的 `diffusion_coefficient` 只該回傳 σ。如果它自己也乘一次 `randn_like`，雜訊就變成兩個高斯相乘，也就是「doubly stochastic」。

2026-09-30 查看 branch 2026 時，**解答版的兩個 class 已經改成 `return self.sigma`，學生版 `labs/lab_two.ipynb` 還是 `return self.sigma * torch.randn_like(x)`**。做 lab 前，把學生版這兩處改成跟解答一樣：

```python
def diffusion_coefficient(self, x: torch.Tensor, t: torch.Tensor) -> torch.Tensor:
    return self.sigma
```

**3. 一個小坑。** 學生版 `GaussianConditionalProbabilityPath.sample_conditioning_variable` 寫的是 `return p_data.sample(num_samples)`，用到的是 notebook 的全域變數 `p_data`；解答版是 `self.p_data`。照順序跑不會出錯，但你換資料分佈實驗時，結果可能跟預期不一樣。建議順手改成 `self.p_data`。

## Part 0–1：工具與介面

Part 0 沒有題目，都是 Lab 1 做過的東西：`ODE`、`SDE`、`EulerSimulator`、`EulerMaruyamaSimulator`、高斯與高斯混合分佈、畫圖工具。

Part 1 定義抽象類別 `ConditionalProbabilityPath`，規定一條條件路徑要提供四個方法：

| 方法 | 對應講義 |
|---|---|
| `sample_conditioning_variable` | 抽 `z ~ p_data` |
| `sample_conditional_path` | 從 `p_t(x\|z)` 抽樣 |
| `conditional_vector_field` | `u_t(x\|z)` |
| `conditional_score` | `∇ log p_t(x\|z)` |

`sample_marginal_path` 已經寫好：先抽 z，再抽 x，正是講義 eq. (12) 的兩步抽樣。整個 lab 你要實作兩個子類別：高斯路徑和線性路徑。

## Part 2：高斯條件路徑的四個零件

這一部分的目標是把標準高斯 `N(0, I_d)` 變成一個 5 個 mode 的 2D 高斯混合。

### Problem 2.1：α_t 與 β_t

實作 `LinearAlpha` 與 `SquareRootBeta` 的 `__call__`。注意這裡用的是 **`α_t = t`、`β_t = √(1−t)`**，不是講義 Algorithm 3 的 CondOT（`β_t = 1−t`）。導數 `dt` 已經幫你寫好。

考點只是讀懂合約：`α_0 = β_1 = 0`、`α_1 = β_0 = 1`，對應講義 Example 8 的邊界條件。

### Problem 2.2：從條件路徑抽樣

實作 `sample_conditional_path`，從 `N(α_t z, β_t² I_d)` 抽樣。提示是 `X = μ + σZ`。這就是講義 eq. (16)／(28) 的 `x = α_t z + β_t ε`。

notebook 請你把畫出的圖跟講義 Figure 6 標著「Ground-Truth Conditional Probability Path」的那一張比對。

### Problem 2.3：條件向量場

實作 `conditional_vector_field`，公式直接給了，就是講義 eq. (20)。用 `self.alpha.dt(t)` 和 `self.beta.dt(t)` 取導數。

下一格會模擬 `dX_t = u_t(X_t|z) dt`，畫出所有軌跡收斂到同一個 z。這就是 L2 說的「條件向量場單獨看沒什麼用」：它只會重新產生那一個資料點。

notebook 在這裡留了一段重要的提醒：`sample_conditioning_variable` 實際上是在從 `p_data` 抽樣，那不就是我們想學的東西嗎？答案是，實務上它回傳的是有限訓練集裡的點，形式上假設這些點是從 `p_data` 獨立抽出的。

### Problem 2.4：條件分數

實作 `conditional_score`，公式 `(α_t z − x) / β_t²`，就是講義 Example 15 的 eq. (40)。

下一格用 SDE extension trick（講義 Theorem 17）模擬條件 SDE，檢查 SDE 的樣本跟直接從條件路徑抽的樣本一致。

notebook 附了一段數值問題的說明：σ 大一點就會出怪事。原因是 t→1 時 `β_t → 0`，漂移項裡的 `σ² (α_t z − X_t) / β_t²` 會爆掉，而且爆的程度跟 σ 平方成正比；有限步數模擬不出這種爆炸。實務上的繞法是取 `σ_t = β_t`，讓雜訊跟著降下來，抵銷爆炸。

## Part 3：兩個 trainer，一個轉換公式

### Problem 3.1：Flow matching

實作 `ConditionalFlowMatchingTrainer.get_train_loss`，也就是講義 eq. (26) 的 CFM loss 的 Monte Carlo 估計。提示把每一步都指出來了：

1. `self.path.p_data.sample(batch_size)` 抽 z
2. `torch.rand(batch_size, 1)` 抽 t
3. `self.path.sample_conditional_path(z, t)` 抽 x
4. 比較 `self.model(x, t)` 與 `self.path.conditional_vector_field(x, z, t)` 的均方誤差

這跟講義 Algorithm 3 是同一件事，只是路徑換成 `β_t = √(1−t)`。notebook 的設定是 4 層、每層 64 的 MLP，5000 步，batch 1000。

notebook 用粗體提醒：**loss 應該收斂，但不會收斂到 0。** 這正好呼應 L2 的 Theorem 12：CFM loss 跟 FM loss 差一個常數，所以就算網路完美學到邊際向量場，CFM loss 也不會是 0。

訓練完，把 `flow_model` 包成 ODE，用 `EulerSimulator` 模擬，看樣本是否落在 5 個 mode 上。

### Problem 3.2：Score matching

實作 `ConditionalScoreMatchingTrainer.get_train_loss`，講義 §4.3 的 conditional score matching loss。結構跟 3.1 完全一樣，只把目標換成 `self.path.conditional_score(x, z, t)`，網路換成 `MLPScore`。提示叫你重用 2.4 的實作。

訓練完，把 `flow_model` 和 `score_model` 一起包進 `LangevinFlowSDE`，模擬

```text
dX_t = [u_t^θ(x) + (σ²/2) s_t^θ(x)] dt + σ dW_t
```

也就是講義 Theorem 17，用學到的向量場和學到的分數拼成 SDE。notebook 預設 `sigma = 2.0`，註解提醒不要設太大，否則會有數值問題。**這裡用的 `LangevinFlowSDE` 就是 changelog 修過的那個 class**，記得先補上修正。

做完 3.1 和 3.2，你會發現兩個 trainer 的程式碼幾乎一字不差。這就是 L3A 表格裡「Theorem 12 和 Theorem 22 證明完全一樣」的程式版。

### Question 3.3：從向量場推出分數

實作 `ScoreFromVectorField.forward`：不另外訓練，直接用 3.1 學到的向量場換算出分數。依據是講義 Proposition 1。

notebook 推好了公式：

```text
s̃_t^θ(x) = (α_t u_t^θ(x) − α̇_t x) / (β_t² α̇_t − α_t β̇_t β_t)
```

讀的時候注意一個記號差異：notebook 寫成 `u = a_t x + b_t ∇log p_t`，把 `α̇_t/α_t` 叫 `a_t`；講義 Proposition 1 則寫成 `u = a_t ∇log p_t + b_t x`，`a_t`、`b_t` 的名字剛好對調。係數本身一致，只是名字交換，對照時別被搞混。

代入 `α_t = t`、`β_t = √(1−t)`，分母是 `1 − t/2`，t=1 時為 0，所以畫圖時用 `t = 1 − ε` 代替。

下一格把兩種分數畫成向量場比較：上排是 3.2 用 score matching 學的，下排是從向量場換算的。notebook 說兩者大概不會一模一樣，但應該大致指向同一方向，特別是在 mode 附近。

## Part 4：線性路徑，在任意兩個分佈之間流動

最後一部分換一條路徑。固定資料點 z，定義內插

```text
X_t = (1 − t) X_0 + t z,     X_0 ~ p_simple
```

它滿足 `p_0(x|z) = p_simple`、`p_1(x|z) = δ_z`，條件向量場是 `(z − x)/(1 − t)`，t 在 [0,1) 上有定義。

notebook 點出這條路徑跟高斯路徑的兩個差別：

1. **沒有條件分數的封閉解**，所以 `conditional_score` 故意不實作，解答版直接丟例外。
2. **`p_simple` 不必是高斯。** 這是整個 Part 4 的重點。

### Problem 4.1：實作線性路徑

實作 `LinearConditionalProbabilityPath` 的 `sample_conditional_path` 與 `conditional_vector_field`。檢查方法是看三排圖是否一致：用 `sample_conditional_path` 畫的條件路徑、用 `conditional_vector_field` 模擬出的條件路徑，以及 `sample_marginal_path` 畫的邊際路徑。

### Part 4.2：在棋盤格上訓練

用同一個 `ConditionalFlowMatchingTrainer`，從標準高斯流到 4×4 的棋盤格分佈（`CheckerboardSampleable`）。notebook 再提醒一次：loss 會收斂，但不一定到 0。

### Problem 4.3：從圓環流到棋盤格

把 `p_simple` 換成 `CirclesSampleable`，目標仍是棋盤格。模型加大到 4 層、每層 100，訓練 20000 步。題目只問一句：換換看不同的 `p_simple` 和 `p_data`，你觀察到什麼？

這對應 [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) 的一頁：本課介紹的方法可以把任意分佈轉成任意分佈，例子包括無聲影片到有聲影片、低解析度影像到高解析度影像。

## 怎麼對解答

打開 [`solutions/lab_two_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_two_complete.ipynb)，逐題比對。這是校外讀者唯一的回饋來源，因為網站寫的繳交方式是匯出 PDF、透過 Canvas 交到 Gradescope。

幾個自我檢查點：

| 題目 | 對了的樣子 |
|---|---|
| 2.2 | 條件路徑的圖跟講義 Figure 6 的 ground truth 一致 |
| 2.3 | 所有 ODE 軌跡收斂到紅色星號 z |
| 2.4 | SDE 樣本跟直接抽的條件路徑樣本分佈一致（σ 不要太大） |
| 3.1、3.2 | loss 收斂到非零值；樣本落在 5 個 mode |
| 3.3 | 兩排分數場大致同向，mode 附近尤其明顯 |
| 4.1 | 三排圖彼此一致 |

## 讀完這篇，你應該能

- 說出一條條件路徑在程式裡需要哪四個零件。
- 解釋為什麼 flow matching 和 score matching 的 trainer 幾乎一樣，以及為什麼 loss 不會到 0。
- 用 Proposition 1 從學到的向量場換算分數，並說出分母在哪裡會變成 0。
- 說出線性路徑相對於高斯路徑的得與失。

**今晚就能做的事**：下載 `labs/lab_two.ipynb`，先把 `ConditionalVectorFieldSDE` 和 `LangevinFlowSDE` 的 `diffusion_coefficient` 改成 `return self.sigma`，然後做完 Problem 2.1–2.3。三題加起來只有幾行，但能確認你讀懂了高斯路徑的全部公式。

## 延伸閱讀

- 公式來源：[L2：Flow matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)（Problem 2.1–2.3、3.1、Part 4）、[L3A：分數函數與 score matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)（Problem 2.4、3.2、3.3）
- 模擬器從哪來：[Lab 1：模擬 ODE 與 SDE](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes)
- 另一門課的 flow matching 作業：[Berkeley CS189 HW2：回歸、GMM 與 flow matching](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching)

系列導覽：上一篇 [L3A：分數函數、SDE 取樣與 score matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)｜下一篇 [L3B：Guidance 與 classifier-free guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance)｜[回系列總覽](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [MIT 6.S184 課程網站（IAP 2026）](https://diffusion.csail.mit.edu/2026/index.html) — Labs 區：做題流程、繳交方式、Lab 2 入口、解答連結
- [eje24/iap-diffusion-labs（branch 2026）](https://github.com/eje24/iap-diffusion-labs/tree/2026) — README changelog（1/11/26 修正）
- [`labs/lab_two.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_two.ipynb) — 學生版題目
- [`solutions/lab_two_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_two_complete.ipynb) — 官方解答
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models（講義 PDF）](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — Example 8、eq. (16)、(20)、(26)、(40)、Algorithm 3–4、Proposition 1、Theorem 17、Figure 6
- [Slides 3（20260123_Lecture_03.pdf）](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) — 任意分佈之間的 bridging 範例
