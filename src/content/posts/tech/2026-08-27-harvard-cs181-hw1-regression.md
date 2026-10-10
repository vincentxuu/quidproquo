---
title: "Harvard CS181 HW1：冰芯溫度迴歸 — kNN、核迴歸、基底函數與正則化四題導讀"
date: 2026-08-27
category: tech
tags: [harvard, cs181, regression, linear-regression, kernel-regression, knn, regularization, ice-core, python, machine-learning]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 2
type: guide
tldr: "HW1 用 80 萬年冰芯溫度資料串起四題：kNN 與核迴歸、最小平方法的幾何證明、基底函數迴歸、以及從機率觀點推出 ridge／LASSO 正則化，最後用 coordinate descent 實作 LASSO。"
description: "逐週導讀 Harvard CS181（CS1810 Spring 2026）HW1（due 2026-02-13），依官方 hw1_release.tex 逐題說明 kNN & Kernels、Geometric Least Squares、Basis Regression、Probabilistic View & Regularization 四題的重點與自測步驟。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-27-harvard-cs181-hw1-regression-en)

**影片狀態：已查核：官方公開頁未列對應錄影。** [影片來源與說明](#課程影片來源)

> ⚠️ **版本**：以 [CS181 2026 HW1](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw1) 的 `hw1_release.tex` 為準（課號 CS1810-S26，截止 2026-02-13 11:59 PM）。往年版本的題目與配分可能不同，對照時以你那一屆的 `.tex` 為主。

## 課程影片來源

已核對 CS1810 Spring 2026 官方課表與 syllabus：本文依據作業、section 或考試教材導讀，對應條目未列公開講課影片；官方提供講課投影片與 section 教材。這表示公開課表未提供對應影片，不代表課程從未錄影。

官方來源：

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

查核日期：2026-10-10。

## TL;DR

HW1 的主題是 **Regression**，四題全部圍繞同一份冰芯溫度資料：

1. **kNN and Kernels（35 分）**：跑 kNN、自己實作核迴歸，比較 test MSE 與複雜度。
2. **Geometric Least Squares（20 分）**：證明 OLS 就是把 `y` 正交投影到 `X` 的欄空間。
3. **Basis Regression（30 分）**：用多項式、RBF、cosine 四組基底函數做線性迴歸，判斷誰過擬合。
4. **Probabilistic View of Regression and Regularization（30 分）**：從高斯與 Laplace 先驗推出 ridge 與 LASSO，再用 coordinate descent 實作 LASSO。

做完四題，你會在同一份資料上看過非參數（kNN、核）與參數化（線性＋基底）兩類迴歸，也知道正則化在機率上對應什麼。

## 為什麼 HW1 值得單獨寫篇導讀

- **同一資料、多種模型**：作業開頭就說明，目標是在同一份資料上實作並比較 nearest neighbors、kernelized、linear 三種迴歸的取捨。
- **證明和程式各半**：第 2 題與第 4 題前半是推導，第 1、3 題與第 4 題最後一小題是 notebook 實作。只會寫程式或只會推導都會卡。
- **配分不小**：依 [2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)，HW1–HW6 各佔 11%。

## 資料簡介與取得方式

資料在 `hw1/data/` 底下，共兩個檔：

- `earth_temperature_sampled_train.csv`（57 行，含一行表頭）
- `earth_temperature_sampled_test.csv`（26 行，含一行表頭）

每行兩欄：冰芯樣本的**年代**（距今年數），以及該年溫度相對前 1,000 年平均的**差值（K）**。資料來自南極 EPICA Dome C 冰芯（Jouzel et al. 2007, *Science*）。因為年代數字很大，作業統一以「千年」為單位，提供的 notebook 已經幫你換算好。

```bash
curl -O https://raw.githubusercontent.com/harvard-ml-courses/cs181-s26-homeworks/main/hw1/data/earth_temperature_sampled_train.csv
```

## 作業四題逐題導讀

### Problem 1：kNN and Kernels（35 分）

兩種非參數迴歸都在這題。

- **kNN**：預測值是最近 `k` 個訓練點的 `y` 平均。實作已經給好，你要跑 `k = 1, 3, N−1` 畫圖、描述曲線怎麼隨 `k` 變化，再自己寫程式算各 `k` 的 test MSE。
- **核迴歸**：預測式是加權平均 `f_τ(x*) = Σ K_τ(x_n, x*) y_n / Σ K_τ(x_n, x*)`，核用 `K_τ(x, x') = exp(−(x − x')² / τ)`，`τ` 是長度尺度的平方。
  - 實作 `kernel_regressor`，在 800,000 BC 到 400,000 BC、每 1,000 年一點的範圍內，畫 `τ = 1, 50, 2500` 三條曲線。
  - 寫出 test MSE 的數學式，再算出三個 `τ` 的 MSE，解釋哪個最好、為什麼不該用訓練集挑 `τ`。
  - 比較 kNN 與核迴歸對訓練集大小 `N` 的時間與空間複雜度：模型要存什麼、預測一個新點要算多少。
  - 最後一小題問 `τ → 0` 時 `f_τ(x*)` 的極限形式。

### Problem 2：Geometric Least Squares（20 分）

這題不寫程式，全部是證明。背景是：`X ∈ ℝ^{N×D}` 的欄空間 `C(X)` 是 `ℝ^N` 的子空間，OLS 等於把 `y` 正交投影到這個子空間上。

1. 設 `w* = (XᵀX)⁻¹Xᵀy`、`ŷ = Xw*`，證明 `ŷ` 是 `y` 在 `C(X)` 上的正交投影。
2. 證明 `ŷ` 是 `C(X)` 中離 `y` 最近的向量，也就是對任何 `v ∈ C(X)` 都有 `‖y − ŷ‖² ≤ ‖y − v‖²`。提示是利用正交向量的畢氏定理。
3. 證明 hat matrix `P = X(XᵀX)⁻¹Xᵀ` 對稱、冪等，而且 rank 與 trace 都等於 `d`。可以直接引用「冪等矩陣的 rank 等於 trace」。
4. 殘差圖呈現 U 形而不是隨機散佈時，從「投影到欄空間」的角度解釋它代表什麼。

### Problem 3：Basis Regression（30 分）

原始輸入只有年份一維，這題用基底函數 `φ` 把它展開成更有表達力的特徵，再做線性迴歸。你要在 `make_basis` 裡實作四組基底，每組都要加 bias 項：

| 基底 | 形式 | 前處理 `f(x)` |
|---|---|---|
| (a) 多項式 | `φ_j(x) = f(x)^j`，`j = 1…9` | `x / 181` |
| (b) RBF | `φ_j(x) = exp(−(f(x) − μ_j)² / 5)`，`μ_j = (j + 7) / 8`，`j = 1…9` | `x / 400` |
| (c) cosine | `φ_j(x) = cos(f(x) / j)`，`j = 1…9` | `x / 1.81` |
| (d) cosine | `φ_j(x) = cos(f(x) / j)`，`j = 1…49` | `x / 0.181` |

`f` 是為了數值穩定而加的縮放，notebook 已經提供。接著：

- 畫出四條擬合曲線疊在訓練資料上，寫進報告的只有這四張圖。
- 算四組基底的 test MSE，討論哪些過擬合、哪些欠擬合。
- 說明 `φ` 的作用，並分析線性迴歸的時間與空間複雜度隨 `N` 與特徵數 `D` 的變化。
- 比較 kNN、核迴歸、線性迴歸（加基底）三種方法，思考手上同時有多個迴歸函數時可以怎麼用。

### Problem 4：Probabilistic View of Regression and Regularization（30 分）

把線性迴歸改寫成機率模型 `y_n = wᵀx_n + ε_n`，`ε_n ~ N(0, σ²)`，再加上權重的先驗，用最大後驗（MAP）推出正則化。

1. 設 `w ~ N(0, (σ²/λ) I)`，證明最大化後驗等價於最小化 ridge 損失 `½‖y − Xw‖² + (λ/2)‖w‖²`。
2. 解出 ridge 損失的最小值解。
3. 設每個 `w_d` 服從 Laplace 分布 `L(0, 2σ²/λ)`，證明最大化後驗等價於最小化 LASSO 損失 `½‖y − Xw‖² + (λ/2)‖w‖₁`。
4. 解釋為什麼 LASSO 一般沒有閉式解。
5. 依題目給的 coordinate descent 演算法實作 `find_lasso_weights`：`w₀` 設為全 1、最多 5,000 次迭代；對每個座標算 `ρ_d`，第一個座標（bias）直接更新，其他座標用 soft-thresholding。然後用 Problem 3 的基底 (d) 分別以 `λ = 1, 10` 擬合、畫出訓練集上的預測，並計算 test MSE。

## 90 分鐘自測步驟

1. **跑 notebook 前半**：打開 `hw1_release.ipynb`，確認資料載入後年代已換算成千年，先跑出 `k = 1, 3, N−1` 的 kNN 圖。
2. **核迴歸**：寫完 `kernel_regressor` 後，先只畫 `τ = 50`。曲線應該介於 kNN `k = 1` 的鋸齒與 `k = N−1` 的水平線之間。
3. **幾何證明**：先證第 2 小題（`ŷ` 最近）。它用到的正交性就是第 1 小題的結論，兩題可以一起寫。
4. **基底迴歸**：`make_basis` 先做 (a)，確認輸出形狀是 `N × 10`（9 個基底加 bias），再照抄結構做 (b)–(d)。
5. **LASSO**：`find_lasso_weights` 寫完後，拿 `λ = 0` 跑一次，結果應該接近 Problem 3 基底 (d) 的 OLS 解，可以用來檢查實作。

## 與後續週的銜接

下一篇：[HW2：分類與偏差—變異](/posts/tech/2026-09-29-harvard-cs181-hw2-classification-bias-variance)（`due 2026-02-27`）。依 s26 各份 `.tex` 的題目標題，HW1 的東西會在這些地方再出現：

- **HW2**：Bias-Variance & Uncertainty、MLE in classification、GD & Regularization，延續本篇的最小平方與正則化。
- **[HW3](/posts/tech/2026-09-29-harvard-cs181-hw3-kernels-neural-networks-scaling)**：Kernels & Feature Maps、Neural Networks、Neural Scaling Laws，把本篇的核與基底想法推到 feature map 與神經網路。
- **[HW4（上）](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer)**：Understanding the Transformer。

上一篇是 [HW0：線性代數複習](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)，完整清單見[系列總覽](/posts/tech/2026-08-27-harvard-cs181-overview)。

## 更新紀錄


- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- **2026-09-30**：依官方 `hw1_release.tex` 重寫題目段落。原文誤寫為 OLS／RBF kernel／MLP 三題，實際是 kNN & Kernels、Geometric Least Squares、Basis Regression、Probabilistic View & Regularization 四題；同步更正資料筆數與年代描述、Jouzel et al. 2007 的出處，移除沒有來源的 MLP 與 PyTorch 內容。
- **2026-09-29**：截止日依 s26 `hw1_release.tex` 更正為 2026-02-13；「與後續週的銜接」改為連到系列實際文章，題目依各份 `.tex` 標題。

## 參考資料

- [CS181 2026 HW1 (GitHub)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw1)
- [CS181 2026 HW1 `hw1_release.tex`](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw1/hw1_release.tex)
- [CS181 2026 Syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)
- [Jouzel et al. 2007, Orbital and Millennial Antarctic Climate Variability over the Past 800,000 Years, *Science* 317(5839)](https://doi.org/10.1126/science.1141038)
- [NOAA NCEI：EPICA Dome C 溫度資料](https://www.ncei.noaa.gov/pub/data/paleo/icecore/antarctica/epica_domec/edc3deuttemp2007.txt)
- [MML Book（Mathematics for Machine Learning）](https://mml-book.github.io/)
