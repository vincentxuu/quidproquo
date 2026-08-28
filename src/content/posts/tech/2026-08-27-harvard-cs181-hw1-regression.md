---
title: "Harvard CS181 HW1：冰芯溫度迴歸— 先掌握線性、核、神經網路三條路徑"
date: 2026-08-27
category: tech
tags: [harvard, cs181, regression, linear-regression, kernel-regression, neural-networks, ice-core, python, machine-learning]
lang: zh-TW
series:
  name: "Harvard CS181 逐週導讀"
  order: 2
type: guide
tldr: "HW1 以 800k 年冰芯溫度資料做線性迴歸、核迴歸與簡易神經網路，先掌握三種模型的訓練與驗證方法，為接下來的分類與深度學習鋪路。"
description: "逐週導讀 Harvard CS181 HW1（due 2026‑02‑23），包括冰芯溫度資料、三種迴歸模型（OLS、RBF kernel、MLP），以及自測步驟，示範如何用 Python 完成作業並在新學期前做好基礎。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-27-harvard-cs181-hw1-regression-en)

> ⚠️ **版本**：以 [CS181 2026 HW1](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw1) 為主，2025/2024/2023 為備援（同樣資料、相同作業題目，只是截止日與配分略有差異）。

## TL;DR

HW1 以 **800,000 年冰芯溫度** (`earth_temperature_sampled_train.csv` / `*_test.csv`) 實作 **三條迴歸路徑**：
1. **線性最小平方法 (OLS)** – 直接矩陣求解 `w = (XᵀX)⁻¹Xᵀy`
2. **徑向基函數 (RBF) Kernel Regression** – 以 `γ` 控制平滑度，使用 `K = exp(-γ‖xᵢ-xⱼ‖²)`
3. **簡易前饋神經網路 (MLP)** – 兩層 ReLU + MSE，使用 Adam 優化

完成三題後，你會得到 **三條不同曲線**（線性、平滑核、非線性 NN）在同一張圖上比較，能直接看出模型複雜度對預測的影響，為 **HW2 Classification** 與 **HW3 NN** 打下基礎。

## 為什麼 HW1 值得單獨寫篇導讀

- **資料規模**：傳統 HW0 僅兩點，HW1 把 **資料量擴到 800k**，讓矩陣運算與 kernel 計算的時間/記憶體成本成為真正的學習目標。
- **模型序列**：CS181 設計上把 **線性 → 核 → NN** 作為**三層遞進**，每層都保留了 **同樣的 MSE 目標**，所以了解它們的差異的最佳方式就是「同一資料同一指標」直接比較。
- **評分標準**：`HW1` 佔 **11%**（與 HW2‑HW6 同），分成 **程式、報告、圖表** 三塊；若在任何一條路徑上卡住，都會直接影響後續**模型選擇和超參數調校**。

## 資料簡介與取得方式

> CS181 2026 HW1 把 **冰芯溫度** 放在 `data/earth_temperature_sampled_{train,test}.csv`（每行 `year, temperature`）
>
> - `train` 包含 **1950‑2000** 年的 5500 筆樣本（已抽樣），`test` 為 5500 筆未見樣本，用於**最後測試**。
>
> - 檔案大小 **≈ 1.2 MB**，可直接 `wget https://raw.githubusercontent.com/harvard-ml-courses/cs181-s26-homeworks/main/hw1/data/earth_temperature_sampled_train.csv` 下載。
>
> - 數據來源：**Jouzel et al. 2007** 冰芯測年溫度重建（公眾資料集）。

## 作業題目概覽（三題）

### 1️⃣ 線性最小平方法（OLS）
- 建立 `X` 為 `[[1, year], …]`（截距 + 年份）
- 用 **閉式解** `w = (XᵀX)⁻¹ Xᵀ y` 計算係數
- 計算 **MSE**、**RMSE** 並畫出 **預測 vs. 真值**（`matplotlib`）
- 實作 `ols_fit(X, y)`、`ols_predict(w, X)`，提交 `.py` 與 `pdf` 報告

### 2️⃣ 徑向基函數 Kernel Regression
- 使用 **RBF kernel** `K(i,j) = exp(-γ * (year_i - year_j)^2)`，`γ` 由作業給定或自行搜尋（`logspace(-4, 2, 7)`）
- 求解 **核迴歸** `α = (K + λI)⁻¹ y`（`λ` 為正則化）
- 同樣畫出 **核迴歸曲線**，比較 **O​LS** 的線性與 **kernel** 的平滑程度

### 3️⃣ 前饋神經網路（MLP）
- 建立兩層 MLP：`input → Linear(1, hidden) → ReLU → Linear(hidden, 1)`（建議 `hidden=64`）
- 使用 **Adam**（`lr=1e-3`）訓練 **30 epoch**，記錄 **訓練 loss** 與 **驗證 loss**（使用 `test` 作驗證）
- 輸出 **訓練曲線**、**測試 MSE**，並在同圖上疊放 **OLS** 與 **Kernel** 曲線，形成三條模型的視覺對比

## 90 分鐘自測步驟（做完 HW1 前的「預熱」）

1. **資料載入**：用 `pandas.read_csv` 讀 `train`、`test`，檢查 `df.head()` 與 `df.describe()` 是否與文件說明相符。
2. **OLS**：手寫 `X,y`，跑 `np.linalg.inv(X.T @ X) @ X.T @ y`，確認 **係數** 與 **MSE**，畫圖檢查 **殘差分布**（殘差應該隨機、無明顯趨勢）。
3. **Kernel**：先跑 `γ=0.01`、`λ=1e-3`，畫出 **核迴歸曲線**，觀察是否比 OLS 更平滑（若過度平滑，減小 `γ`）。
4. **NN**：跑 `torch.nn.Linear`（或 `tensorflow.keras`）的 **最小模型**，只跑 **5 epoch** 看是否能下降；如果 **loss 不下降**，檢查 **learning rate**、**標準化 year**（`year_norm = (year-mean)/std`）。
5. **比較**：將三條曲線同圖（`matplotlib`）疊加，寫下 **哪條曲線在 test set 上 MSE 最低**，以及 **哪條模型最符合你的直覺**。

> **小技巧**：在 `Python` REPL 中 `import seaborn as sns; sns.set_style('whitegrid')` 能讓圖表更好看，提交報告時直接 `plt.savefig('hw1-plot.png')`。

## 與後續週的銜接

- **HW2 Classification** 會把 **二元分類** 的邏輯回歸與 **Gaussian NB** 交叉驗證，基礎的 **特徵縮放** 與 **模型評估** 概念都從 **HW1** 的 **MSE / RMSE** 延伸到 **accuracy / ROC**。
- **HW3 Neural Networks** 深入 **CNN**、**RNN**，在此之前已經完成 **MLP** 的基本訓練流程，方便直接升級到更深層結構。
- **HW4 Transformers** 會把 **attention** 視為 **核函數** 的高階形式，這裡的 **RBF kernel** 為 **attention** 的概念預熱。

## 參考資料

- [CS181 2026 HW1 (GitHub)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw1)
- [CS181 2025 HW1 (GitHub)](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/hw1)（同題目）
- [Jouzel et al. 2007 Ice Core Temperature Reconstructions (PDF)](https://doi.org/10.1038/nature05969)
- [CS181 textbook – Chapter 5: Linear Regression & Kernel Methods](https://github.com/harvard-ml-courses/cs181-textbook#chapter-5)
- [MML Book – Chapter 4: Kernel Methods](https://mml-book.github.io/)
- [PyTorch Documentation – torch.nn.Linear, torch.optim.Adam](https://pytorch.org/docs/stable/nn.html)
- [NumPy Linear Algebra – `np.linalg.inv`](https://numpy.org/doc/stable/reference/generated/numpy.linalg.inv.html)
