---
title: "Harvard CS181 HW4（下）：決策樹、隨機森林與 Mixture of Experts"
date: 2026-09-29
category: tech
tags: [harvard, cs181, decision-trees, ensemble, mixture-of-experts, homework]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 8
type: guide
tldr: "HW4 Problem 3 用三步量化「多棵樹投票為什麼會準」：Hoeffding 界在 p=0.6 時要 B≈691 棵獨立樹才壓到 10⁻⁶；樹之間相關係數 ρ 讓集成變異數卡在 ρσ²；最後比較隨機森林的密集集成與 MoE 的稀疏路由。"
description: "Harvard CS1810 Spring 2026 HW4 Problem 3 逐題導讀：多數決集成的 Hoeffding 錯誤率上界、相關樹的集成變異數公式 ρσ² + (1−ρ)σ²/B、特徵子抽樣 m=⌊√d⌋ 的取捨，以及隨機森林與 Mixture of Experts 在容量與運算成本上的差異。"
draft: false
glossary:
  - term: "Hoeffding's inequality"
    aliases: ["Hoeffding 不等式"]
    definition: "一種集中不等式：多個獨立且有界的隨機變數取平均後，偏離期望值超過 t 的機率，會隨樣本數以指數速度下降。"
    context: "HW4 Problem 3 用它推多數決集成的錯誤率上界。"
  - term: "random forest"
    aliases: ["隨機森林"]
    definition: "bagging 決策樹再加上「每次分裂只從隨機抽出的 m 個特徵中選」，目的是降低樹之間的相關性。"
    context: "Section 6 給的經驗法則是分類 m≈√d、迴歸 m≈d/3。"
---

> 🌏 [English version](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en)

> ⚠️ **版本與存取**：以 [CS1810 Spring 2026 HW4](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw4) 的 `hw4_release.tex` 與 [Section 6 講義](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf) §3 為準，2026-09-29 實際打開。本課整體為 **A3**，沒有當期錄影、沒有作業解答。Week 7 的 Non-parametric Models / Decision Trees 講課投影片本篇沒有取得。Problem 3 是純紙筆題，notebook 裡沒有對應程式；題目標題沒寫總分，各小題標示加起來是 35 分。

這是 [Harvard CS181 逐週導讀](/posts/tech/2026-08-27-harvard-cs181-overview)第 8 篇，HW4 的最後一題。前兩篇是 [Transformer](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer) 和 [Autoencoder 到 VAE](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae)。

## 先補：這題不考怎麼長一棵樹

[HW4 題目](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex)開頭明講：這份作業沒有要你手算建一棵決策樹，想複習的話請做 Section 6 講義最後那題練習。

那題練習在 [Section 6](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf) §3.3：6 天的跑步紀錄，兩個特徵 Outlook 與 Humidity，要你算整體 entropy、比較兩個特徵的 information gain 選根節點、畫出最終的樹，[解答版](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06_soln.pdf)有答案。建議先做這題再進 Problem 3，因為 Problem 3 假設你已經知道單棵樹為什麼不穩定：Section 6 §3.4 的說法是，小小的資料變動就可能長出不同的樹，所以實務上用淺樹求可解釋性、用集成求準確度。

Problem 3 就是在問：**集成到底能把準確度推多高、被什麼卡住、跟 LLM 裡的 MoE 差在哪**。

## 1. 獨立的樹投票：Hoeffding 界（15 分）

設定：`B` 棵獨立訓練的二元分類器，在某個測試點上各自答對的機率都是 `p > ½`，以多數決預測。答對的棵數 `X ~ Binomial(B, p)`，`X > B/2` 時集成答對。

### (a) 5 分：推出錯誤率上界

題目給了 Hoeffding 不等式的形式，要你證明：

```text
P(X ≤ B/2) ≤ exp(−2B(p − ½)²)
```

提示是：集成出錯等於平均值 `Z̄ = X/B ≤ ½`。每個 `Zᵢ ∈ {0, 1}`，所以 `bᵢ − aᵢ = 1`，分母就是 `B`；把 `t` 設成 `p − ½` 代進去即可。

### (b) 5 分：代數字

`p = 0.6` 時 `(p − ½)² = 0.01`，上界變成 `exp(−0.02B)`：

| B | Hoeffding 上界 | 精確二項尾機率（本文另算） |
|---|---|---|
| 10 | `e^(−0.2)` ≈ 0.82 | ≈ 0.37 |
| 100 | `e^(−2)` ≈ 0.135 | ≈ 0.027 |
| 1000 | `e^(−20)` ≈ 2.1×10⁻⁹ | ≈ 1.0×10⁻¹⁰ |

要讓上界低於 10⁻⁶，需要 `0.02B > ln 10⁶ ≈ 13.8`，也就是 `B ≥ 691`。右欄是我用 Python 直接加總二項機率算的（平手算錯），不是作業要求，放著是為了看出 Hoeffding 界有多保守。

題目最後問「這樣好嗎、有必要嗎」，沒有標準答案，但可以從兩個方向想：10⁻⁶ 的錯誤率在多數應用裡遠超需要；而且這整個推導建立在「樹彼此獨立」上，下一小題就要拆掉這個假設。

### (c) 5 分：相關性與特徵子抽樣

實際上 bagging 的樹是在重疊的 bootstrap 樣本上訓練的，彼此相關。題目要你用直覺解釋兩件事：

- 相關性為什麼削弱收斂保證：如果所有樹都在同一批點上犯錯，投票再多也修不掉那個錯
- 隨機森林的特徵子抽樣（每次分裂只看 `m` 個隨機特徵）怎麼降低相關性：強特徵不會每棵樹都拿來當根，樹的結構被迫分歧

## 2. 相關的樹：集成變異數公式（16 分）

把 1(c) 的直覺寫成公式。`B` 棵樹，預測變異數都是 `σ²`，任兩棵的相關係數都是 `ρ`。

### (a) 8 分：證明

```text
Var( (1/B) Σ T_b(x) ) = ρσ² + (1 − ρ)σ²/B
```

<details>
<summary>推導骨架</summary>

總和的變異數是 `Σᵢ Σⱼ Cov(Tᵢ, Tⱼ)`。拆成對角與非對角：

- 對角 `i = j`：`B` 項，每項 `σ²`
- 非對角 `i ≠ j`：`B(B − 1)` 項，每項 `ρσ²`

再乘上 `1/B²`，整理成 `ρσ²` 加上一個會隨 `B` 變小的項。

</details>

### (b) 4 分：讀公式

- `B → ∞` 時第二項消失，變異數收斂到 `ρσ²`。只要 `ρ > 0`，再多樹都壓不到 0
- `ρ = 0` 是 1(a) 的獨立情境，變異數以 `1/B` 下降；`ρ = 1` 等於同一棵樹複製 `B` 次，集成完全沒用。題目要你各舉一個實際場景，例如 bootstrap 樣本幾乎一樣、或所有樹都選到同一個壓倒性特徵，都會把 `ρ` 推向 1

### (c) 4 分：為什麼 m = 1 不好

分類的預設是 `m = ⌊√d⌋`。`m = 1` 讓每次分裂只能在一個隨機特徵上切，`ρ` 最小，但每棵樹常被迫用沒用的特徵分裂，單棵樹本身變差。用 (a) 的公式來看：`m` 同時影響 `ρ` 和單棵樹的誤差，降 `ρ` 的代價是單棵樹變弱，題目要你講出這個取捨。

Section 6 §3.5 的經驗法則是分類 `m ≈ √d`、迴歸 `m ≈ d/3`。

## 3. 隨機森林 vs. Mixture of Experts（4 分）

題目把兩者放在同一個框架裡：

- **隨機森林是密集集成**：每棵樹都處理每個輸入
- **MoE 是稀疏集成**：學出來的 gating network 把每個輸入只送給少數幾個 expert，輸出是加權組合 `y = Σ g_k(x) E_k(x)`，大部分 `g_k = 0`

題目舉的例子是 Mixtral 8x7B：總參數約 47B，每個 token 只路由到 8 個 expert 中的 2 個，啟用約 13B（數字出自作業題目，原始來源見 [Mixtral 論文](https://arxiv.org/abs/2401.04088)）。題目也點出兩個差異：MoE 的 expert 會專門化，隨機森林的樹不會；MoE 有 expert collapse 的問題（gating 把大部分輸入都送給一兩個 expert），通常用輔助的 load-balancing loss 處理。

作答要用 3–5 句比較兩者怎麼處理容量與運算成本的取捨，並回答隨機森林為什麼不能像 MoE 那樣 scale up。思考方向：隨機森林每多一棵樹，推論成本就線性增加，而且根據第 2 部分，多加的樹對變異數的幫助會卡在 `ρσ²`；MoE 的總參數可以一直加，每個輸入的運算量卻由路由到的 expert 數決定。

## 連回 LLM

你今天用到的不少大型模型是 MoE 架構。回頭看這題的設定，會發現「集成」這個古典想法在 LLM 裡換了一個方向：隨機森林靠平均很多相似的模型降低變異數，MoE 靠路由讓不同 expert 分工，用稀疏啟用換取更大的總容量。

HW4 到這裡結束。下一份作業 HW5 進入沒有標籤的學習：分群、PCA 與自監督學習。

## 延伸閱讀

- [CS336 Lecture 4：Attention 不只一種，MoE 也不是免費擴大模型](/posts/ai/2026-08-22-cs336-attention-moe)：MoE routing、load balancing 與 expert parallelism 的系統面
- [泛化：偏差變異、雙降與樣本複雜度（CS229 筆記第 8 章）](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization)：Hoeffding 不等式在學習理論裡的另一個用途
- [Breiman 2001, Random Forests](https://doi.org/10.1023/A:1010933404324)：隨機森林原始論文

## 上一篇／下一篇

- 上一篇：[HW4（中）：Autoencoder 為何不能生成，VAE 補了什麼](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae)
- 下一篇：[HW5（上）：K-means、HAC 與 PCA](/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca)

## 參考資料

- [CS1810 Spring 2026 HW4 題目 hw4_release.tex](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex)
- [CS1810 Spring 2026 HW4 題目 PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.pdf)
- [CS1810 Spring 2026 Section 6（Decision Trees 在 §3）](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf)（[solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06_soln.pdf)）
- [CS1810 Spring 2026 官方課表（Google Sheet）](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [Jiang et al. 2024, Mixtral of Experts](https://arxiv.org/abs/2401.04088)
- [Breiman 2001, Random Forests](https://doi.org/10.1023/A:1010933404324)
- [CS181 2026 課程網站](https://harvard-ml-courses.github.io/cs181-web/)
