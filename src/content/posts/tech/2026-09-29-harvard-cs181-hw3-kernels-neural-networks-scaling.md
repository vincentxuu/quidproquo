---
title: "Harvard CS181 HW3：核方法、神經網路與 Scaling Law"
date: 2026-09-29
category: tech
tags: [cs181, harvard, kernel-methods, neural-networks, backpropagation, scaling-laws, homework]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 4
type: guide
tldr: "CS181 Spring 2026 的 HW3（due 3/23）三題 100 分：先把多項式與 RBF kernel 拆回特徵映射、從 ridge 推到 dual 係數 α 與 support vector 直覺；再手推兩層 sigmoid 網路的 backprop；最後佔一半分數的是在 Fashion-MNIST 上訓練 ResNet，自己量出 scaling law，用 C≈6ND 推算固定算力下模型與資料該怎麼分。"
description: "逐題導讀 Harvard CS1810 Spring 2026 Homework 3（Neural Networks and Kernels）：kernel 與 feature map、dual α 與 support vectors、backprop 與 forward-mode autodiff、ResNet scaling law 與 Chinchilla 問題，對應第 4–6 週講題與 Section 4／5。不含解答。"
draft: false
glossary:
  - term: "kernel trick"
    aliases: ["核技巧"]
    definition: "只計算兩個輸入在特徵空間的內積 K(x, x')，而不真的把特徵向量 φ(x) 算出來。"
    advanced: "ridge regression 的解可以改寫成 α = (K + λI)⁻¹y，預測變成對訓練點的加權和 Σ α_n K(x_n, x*)。"
    context: "HW3 Problem 1 從多項式 kernel 一路推到 RBF kernel，說明為什麼 RBF 非用這招不可。"
  - term: "neural scaling law"
    aliases: ["scaling law", "規模律"]
    definition: "測試損失隨模型參數量 N 與資料量 D 以冪次律下降的經驗規律。"
    advanced: "HW3 採用 L(N, D) ≈ a/N^α + b/D^β + L∞ 的形式，並強調這是經驗觀察，沒有第一原理推導。"
    context: "Problem 3 要你在小規模上自己量出 α、β。"
---

> 🌏 [English version](/posts/tech/2026-09-29-harvard-cs181-hw3-kernels-neural-networks-scaling-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> ⚠️ **版本與存取**：本篇以 [CS181 s26 homeworks 的 hw3](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw3) 與 [2026 官方 schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ) 為準。Section 4、5 是 **Spring 2026** 講義；課站的 NN 與 SVM scribe notes 是 **2024 學期**筆記（lec10 標頭 `2/22/24`）。2026 的 Neural Networks II／III、CNNs 與 scaling law 內容沒有對應的公開講義，本篇不推測講課內容。整門課為 **A3**：作業與 section 解答公開，官方課表未列對應講次的公開錄影、無作業解答。

[Harvard CS181](https://harvard-ml-courses.github.io/cs181-web/) HW3 的標題是 **Neural Networks and Kernels**，依 `hw3_release.tex` 截止時間是 2026 年 3 月 23 日 23:59。三題的配分是 30、20、50，佔一半分數的是第三題：**自己量 scaling law**。

[上一篇 HW2](/posts/tech/2026-09-29-harvard-cs181-hw2-classification-bias-variance) 的特徵都是人手挑的基底。HW3 走完一條線：手工特徵映射 → kernel 讓特徵維度可以無限大 → 神經網路自己學特徵 → 模型和資料該放大多少才划算。本篇逐題說明每題的要求與對應講義，**不給解答**。

## 課程影片來源

已核對 CS1810 Spring 2026 官方課表與 syllabus：本文依據作業、section 或考試教材導讀，對應條目未列公開講課影片；官方提供講課投影片與 section 教材。這表示公開課表未提供對應影片，不代表課程從未錄影。

官方來源：

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

查核日期：2026-10-10。

## TL;DR

- **Problem 1（30 分）**：多項式 kernel 展開成 6 維特徵、同心圓資料在 `(x₁, x₂, x₁²+x₂²)` 空間變得可分、ridge 改寫成 dual 係數 `α`、再到 RBF kernel 的兩個極限。
- **Problem 2（20 分）**：兩層 sigmoid MLP 的維度檢查與 backprop 偏導數，加一題 forward-mode autodiff。
- **Problem 3（50 分）**：Fashion-MNIST 上的深度可變 ResNet，量 `α̂`、`β̂`，用 `C ≈ 6ND` 推算力最適配置，並回答 Chinchilla 問題。
- **先讀**：作業明講可參考 [Section 4（Richer Features and Neural Networks）](https://harvard-ml-courses.github.io/cs181-web/static/sec04/sec04.pdf)；Problem 3 另看 [Section 5](https://harvard-ml-courses.github.io/cs181-web/static/sec05/sec05.pdf) 的 ResNet 與 PyTorch 段。
- **時程注意**：HW3 期間夾著 3 月 10 日的期中考與春假。

## HW3 在 2026 課表的位置

HW3 在 2 月 27 日（HW2 截止當天）發布，3 月 23 日（春假後第一個週一）截止，同一天發布 HW4。

| 週 | 講題（Tue／Thu） | Section |
|---|---|---|
| 4 | Richer Features ／ Neural Networks I | S3: Classification |
| 5 | Neural Networks II ／ Neural Networks III / CNNs | S4: Kernel methods and NNs |
| 6 | Representation Learning / Autoencoders ／ Transformers | S5: NN training and architectures（附 Colab 教學） |
| 7 | **Midterm（in-class，3/10）** ／ Non-parametric Models / Decision Trees | — |
| 8 | Spring Break | — |

2024 scribe notes 可當補充，但要標年份：[lec08](https://harvard-ml-courses.github.io/cs181-web/static/lec08/08-scribe-notes.pdf)（神經網路、XOR 與圓環例子）、[lec09](https://harvard-ml-courses.github.io/cs181-web/static/lec09/09-scribe-notes.pdf)（backprop）、[lec10](https://harvard-ml-courses.github.io/cs181-web/static/lec10/10-scribe-notes.pdf) 與 [lec11](https://harvard-ml-courses.github.io/cs181-web/static/lec11/11-scribe-notes.pdf)（SVM：max margin、hard／soft margin、dual）。2026 課表沒有獨立的 SVM 講題，HW3 只在 Problem 1 的 3(d) 用到 support vector 的概念。

## 這份作業的一條線

```mermaid
flowchart LR
  A["手工特徵<br/>φ(x) 6 維"] --> B["kernel<br/>只算 K(x,x')"]
  B --> C["RBF<br/>特徵維度無限"]
  C --> D["神經網路<br/>自己學 φ"]
  D --> E["scaling law<br/>N 與 D 怎麼分"]
```

[Section 4](https://harvard-ml-courses.github.io/cs181-web/static/sec04/sec04.pdf) 的結構跟這條線幾乎一樣：§1 從 feature space 的 ridge regression 推到 kernel methods，§2 講 perceptron、神經網路如何學特徵、universal approximation，最後是 forward／backward pass 練習。

## Problem 1：Kernel 與特徵映射（30 分）

四個部分：

1. **展開多項式 kernel**：`K(x, x') = (1 + xᵀx')²`，對 `x ∈ ℝ²` 展開，找出 `φ: ℝ² → ℝ⁶`，並用 `x = (1,0)`、`x' = (1,1)` 驗算兩邊相等。
2. **視覺化**：notebook 會生成 400 點的同心圓資料（內圈半徑約 0.5、外圈約 1.5）。先在原空間畫圖判斷是否線性可分，再畫 `(x₁, x₂, x₁²+x₂²)` 的 3D 散佈圖，最後用純 `numpy`、`λ = 0.01` 在特徵空間做 ridge regression 並畫決策邊界。
3. **從特徵空間到 kernel 空間**：證明 `α = (K + λI)⁻¹y` 時，預測可寫成 `f(x*) = Σ α_n K(x_n, x*)`。題目提示你設 `w = Φᵀα` 再代回 normal equation。接著實作 kernel ridge，把每個訓練點畫成大小正比於 `|α_n|` 的點，觀察哪些點權重最大，並推想哪些點會成為 SVM 的 support vectors。
4. **RBF kernel**：把 `exp(−‖x−x'‖²/2σ²)` 拆成三個指數相乘、對耦合項做 Taylor 展開，說明為什麼 RBF 非用 kernel trick 不可，再證明 `σ → 0` 與 `σ → ∞` 的兩個極限行為。

**卡住時**：第 3 部分的證明，Section 4 §1.2 用 `w = w∥ + w⊥` 的分解證明最佳解落在訓練特徵張成的空間，這是同一個想法的另一種寫法。

## Problem 2：神經網路（20 分）

架構是 `ŷ = σ(W₂ σ(W₁x + b₁) + b₂)`，二元分類、交叉熵損失。題目分三段：

- 寫出 `W₁, b₁, W₂, b₂` 與中間變數 `a₁, z₁, a₂` 的維度（用 `N`、`M`、`H` 表示）。題目直接說檢查 shape 是 debug 的主要手段。
- 單一資料點下，依序求 `∂L/∂b₂`、`∂L/∂W₂ʰ`、`∂L/∂b₁ʰ`、`∂L/∂W₁ʰʲ`。
- Forward-mode autodiff：`f(x₁, x₂) = ln(sin x₁) + x₁ exp(x₂)` 已拆成 `v₁…v₇`，在 `x₁ = π/6`、`x₂ = 1` 算所有中間值與對 `x₁` 的導數。

<details>
<summary>練手順序建議</summary>

先做 [Section 5 §1.2](https://harvard-ml-courses.github.io/cs181-web/static/sec05/sec05.pdf) 的純量兩層網路（有具體數值 `x = 2, y = 1, w₁ = 0.5`…），手算一次再回來做向量版。Section 5 也整理了 ReLU、sigmoid、tanh 的導數，並提醒 sigmoid 導數最大值只有 1/4，這跟 vanishing gradient 有關。

</details>

## Problem 3：Neural Scaling Laws（50 分）

作業採用的經驗式是：

```text
L(N, D) ≈ a / N^α  +  b / D^β  +  L∞
```

`N` 是可訓練參數量，`D` 是訓練樣本數。作業用 bias-variance 的語言解釋三項：`a/N^α` 是近似誤差，`b/D^β` 是估計誤差，`L∞` 是不可約誤差。它也明講：

> "There is no first-principles derivation of *why* this particular functional form holds, it is an empirical observation."

**架構**：base channel `C = 64` 固定，只改殘差區塊數 `K`。Stem 是 `Conv2d → BatchNorm2d → ReLU → MaxPool2d(2)`，接 `K` 個 ResBlock，Head 是 `AdaptiveAvgPool2d(1) → Flatten → Linear(C, 10)`。[Fashion-MNIST](https://github.com/zalandoresearch/fashion-mnist) 有 60,000 張訓練圖、10,000 張測試圖，28×28 單通道。

三個部分：

| 部分 | 配分 | 要做的事 |
|---|---|---|
| (a) | 22 | 寫出參數量 `N(K)` 公式與訓練程式；固定 `K = 12`，在 `D ∈ {1000, …, 50000}` 七種資料量上訓練；畫兩張 log-log 圖、擬合出 `α̂`、`β̂` 與 R²，並解釋為什麼取 log 前要先減掉 `L̂∞` |
| (b) | 10 | 假設 `C_compute ≈ 6ND`，代入約束後對 `N` 最小化，證明 `N* ∝ C^{β/(α+β)}`、`D* ∝ C^{α/(α+β)}`；用你量到的指數回答算力翻倍時 `N`、`D` 各放大幾倍；最後問 α ≫ β 或 α ≪ β 時策略會怎麼變 |
| (c) | 8 | 只用擬合出的規律預測 `D = 60000` 的損失，再實際訓練驗證；以及 `K = 12` 需要多少資料才能追上 `K = 18` 在全資料上的 0.2195 |

(b) 的最後一問引用 Chinchilla（[Hoffmann et al., 2022](https://arxiv.org/abs/2203.15556)）：作業寫該研究發現大型語言模型的 `α ≈ β`，因此 `N` 與 `D` 應等比例放大。

**跑之前要知道的**：

- notebook 已附上 `K ∈ {1, 2, 3, 5, 8, 12, 18}` 在全資料上**預先算好**的 model sweep 結果，你主要自己訓練的是 `K = 12` 的 data sweep 與 (c) 的驗證。
- 設定是 `MAX_EPOCHS = 40` 搭配 early stopping，種子固定為 181。
- notebook 部分說明文字與 `.tex` 不一致（例如一段 markdown 寫資料量從 500 到 40,000，程式碼的 `D_VALUES` 卻是 1,000 到 50,000）。以 `.tex` 題目為準，拿不準就上 Ed 問。
- [Section 5 §3](https://harvard-ml-courses.github.io/cs181-web/static/sec05/sec05.pdf) 指向一份在 MNIST 上訓練 ResNet 的 Google Colab 教學，連結在官方 schedule 的 S5 欄位。

## 開工步驟

1. `git clone https://github.com/harvard-ml-courses/cs181-s26-homeworks`，進 `hw3/`，照 notebook 第一格建 venv 並 `pip install -r requirements.txt`。
2. 先做 Problem 1 的推導與同心圓視覺化，這部分只要 `numpy` 與 `matplotlib`。
3. Problem 2 全是紙筆，適合跟期中考複習一起做。
4. Problem 3 需要 GPU 或耐心，最早開始跑 data sweep。訓練在背景跑的同時可以寫 (b) 的推導。
5. 繳交：writeup PDF 交 Gradescope `HW3`，`.tex` 與程式碼交 `HW3 - Supplemental`。

## 延伸閱讀

- [Stanford CS336：Scaling Laws 基礎](/posts/ai/2026-08-22-cs336-scaling-laws-foundations) 與 [實務](/posts/ai/2026-08-22-cs336-scaling-laws-practice)：大模型尺度的同一個問題
- [CS224N：Backprop 與神經網路](/posts/ai/2026-08-22-cs224n-backprop-neural-nets)
- [CMU 11-785：Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation)

## 系列導覽

- 上一篇：[HW2 分類與偏差—變異](/posts/tech/2026-09-29-harvard-cs181-hw2-classification-bias-variance)
- 下一篇：[期中檢核：用官方 checklist 盤點 HW0–HW3](/posts/tech/2026-09-29-harvard-cs181-midterm-checkpoint)
- 系列總覽：[CS181 導讀總覽](/posts/tech/2026-08-27-harvard-cs181-overview)

## 更新紀錄

- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。

## 參考資料

- [CS181 2026 課程網站](https://harvard-ml-courses.github.io/cs181-web/)
- [CS181 2026 schedule（Google Sheet）](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [s26 hw3 目錄](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw3)
- [hw3_release.tex](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw3/hw3_release.tex)
- [hw3_release.pdf](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw3/hw3_release.pdf)
- [hw3_release.ipynb](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw3/hw3_release.ipynb)
- [Section 4：Richer Features and Neural Networks（2026）](https://harvard-ml-courses.github.io/cs181-web/static/sec04/sec04.pdf)／[解答](https://harvard-ml-courses.github.io/cs181-web/static/sec04/sec04_soln.pdf)
- [Section 5：Neural Network Training and Architectures（2026）](https://harvard-ml-courses.github.io/cs181-web/static/sec05/sec05.pdf)／[解答](https://harvard-ml-courses.github.io/cs181-web/static/sec05/sec05_soln.pdf)
- 2024 scribe notes：[lec08](https://harvard-ml-courses.github.io/cs181-web/static/lec08/08-scribe-notes.pdf)、[lec09](https://harvard-ml-courses.github.io/cs181-web/static/lec09/09-scribe-notes.pdf)、[lec10](https://harvard-ml-courses.github.io/cs181-web/static/lec10/10-scribe-notes.pdf)、[lec11](https://harvard-ml-courses.github.io/cs181-web/static/lec11/11-scribe-notes.pdf)
- [Hoffmann et al. (2022), Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)
- [Fashion-MNIST](https://github.com/zalandoresearch/fashion-mnist)
