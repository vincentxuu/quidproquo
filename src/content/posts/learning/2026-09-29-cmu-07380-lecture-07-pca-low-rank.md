---
title: "CMU 07-380 Lecture 7 導讀：Low Rank Optimization，PCA 的重建誤差、投影變異數與 LoRA"
date: 2026-09-29
category: learning
tags: [cmu, 07-380, ai-course, course-guide, pca, dimensionality-reduction]
lang: zh-TW
type: guide
difficulty: 進階
series:
  name: "CMU 07-380 完整課程導讀"
  order: 9
tldr: "07-380 Lec7 把 PCA 放進「低秩最佳化」的框架：找一個 rank 不超過 r 的矩陣去逼近原資料。對單位向量 v，每個點的重建誤差等於 ‖x‖² 減去投影長度的平方，所以最小化重建誤差和最大化投影變異數是同一個問題；用 Lagrange 乘數解出來，答案是共變異數矩陣的特徵向量，也可以直接從 SVD 的 V 讀出。課站把 LoRA 論文列為延伸閱讀，它的 ΔW = BA 就是同一個低秩想法用在權重更新上。"
description: "CMU 07-380 Fall 2026 Lecture 7 Low Rank Optimization: PCA 導讀：降維與低秩近似的定義、置中、投影與重建、兩種 objective 的等價證明、Lagrange 乘數與特徵向量、SVD、選 K、Recitation 4 的 PCA walkthrough、pca_2d_exercise notebook，以及和 LoRA 的直覺連結，依 2026-09-29 課站材料整理。"
draft: false
---

> 🌏 [English version](/en/posts/learning/2026-09-29-cmu-07380-lecture-07-pca-low-rank-en)

這是 [CMU 07-380 AI & ML II](https://www.cs.cmu.edu/~07380/) Fall 2026 的 Lecture 7：**Low Rank Optimization: PCA**（9/16）。課站在這一講的主題欄寫的是「PCA (LoRA)」，這是 Optimization 模組的最後一講。

前兩講（[Lec5 LP](/posts/learning/2026-09-29-cmu-07380-lecture-05-linear-programming)、[Lec6 IP](/posts/learning/2026-09-29-cmu-07380-lecture-06-integer-programming)）的限制都是線性不等式。這一講的限制換成「rank 不能超過 r」，objective 換成平方誤差。問題長得不一樣，但還是同一套思路：先寫成最佳化問題，再找出解的結構。

先講結論：**PCA 的兩個常見定義，最小化重建誤差和最大化投影變異數，是同一個 argmin**。解出來是共變異數矩陣的特徵向量，也就是資料矩陣 SVD 裡的右奇異向量。

依 [2026-09-29 課站](https://www.cs.cmu.edu/~07380/#schedule)狀態整理；課站註明 schedule 可能變動。

## 官方材料與讀取範圍

- [Lec7 投影片（inked PDF）](https://www.cs.cmu.edu/~07380/lectures/07380_F26_Lec7_Low_Rank_Optimization_PCA_inked.pdf)，共 41 頁：定義、MRI 生長板例子、置中、座標轉換、PCA 演算法、兩種 objective、等價證明、Lagrange 乘數、選 K、SVD。另有 [pptx 版](https://www.cs.cmu.edu/~07380/lectures/07380_F26_Lec7_Low_Rank_Optimization_PCA.pptx)
- [PR4 PCA 預讀筆記](https://www.cs.cmu.edu/~07380/notes/07380_F26_Notes_PCA.pdf)（checkpoint 截止 9/15）：scalar／vector projection、旋轉與 projection matrix、共變異數矩陣
- 兩個 Desmos：[Projection](https://www.desmos.com/calculator/7x11plypr0)、[Projection of points](https://www.desmos.com/calculator/dsfa42s9ln)
- [`pca_2d_exercise.ipynb`（Colab）](https://colab.research.google.com/drive/1DQJ4cjImkuWOxGibw4oONuuPaVhnxBfC?usp=drive_link)：公開可下載
- [Recitation 3-4 講義](https://www.cs.cmu.edu/~07380/recitations/Recitation3-4_07380_f26.pdf)與[解答](https://www.cs.cmu.edu/~07380/recitations/Recitation3-4_07380_f26_sol.pdf)第 6 題 PCA Walkthrough（Recitation 4，9/18）
- 課站指定閱讀：[Bishop《Pattern Recognition and Machine Learning》](https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf) §12.1（12.1.1 maximum variance、12.1.2 minimum-error 兩種推導都有）；Murphy §12.2；[LoRA 論文（Hu et al., 2021）](https://arxiv.org/abs/2106.09685)

**公開程度**：投影片、筆記、Desmos、notebook、Recitation 與解答都能在校外取得，這一講的材料已到 A3 等級（定義見[全球 AI／CS 課程地圖](/posts/learning/2026-08-21-global-ai-cs-course-map)）。兩個例外：Murphy 的連結走 CMU 圖書館的 EBSCO，需要校內帳號，本篇沒有讀；課站沒有錄影連結。

## 承上問題：低秩最佳化是什麼

投影片開頭給了兩個定義：

- **Dimensionality reduction**：把資料從高維表示轉成低維表示，保留重要資訊，順便丟掉干擾的部分
- **Low-rank optimization**：找一個 rank 不超過 r 的矩陣 `A'`，讓它最接近給定的矩陣 `A`

```text
min_{A'}  ‖A − A'‖²   s.t.  rank(A') ≤ r
```

PR4 筆記把降維寫成把資料矩陣從 N×M 變成 N×K（K < M），理由有三個：少一點特徵就算得快、丟掉雜訊可能讓模型更好、降到二三維才畫得出來。

投影片接著定義 principal components：一組有順序的正交基底向量，對每個 K，前 K 個向量張成的子空間都是資料的「最佳」子空間。「最佳」的意思，後半講才揭曉。

課堂的真實例子是 MRI 膝蓋生長板影像：用 PCA 找出生長板的主軸，把它攤平成二維再量面積。投影片在這裡先劇透一句：PCA 的軸就是特徵向量。

## 預讀的積木：投影、旋轉、共變異數

PR4 把後面會用到的線性代數拆成三塊：

1. **投影**：`v` 是單位向量時，scalar projection 是 `d = vᵀx`（影子的長度），vector projection 是 `z = (vᵀx)v`（影子本身）
2. **旋轉**：把一組正交單位向量排成矩陣 `V`，`z = Vx` 就是 `x` 在新座標軸下的座標。`V` 是方陣時 `VᵀV = I`，可以完美還原；只保留 K < M 個軸時，一般無法完美還原
3. **共變異數矩陣**：資料置中後，共變異數矩陣就是 `(1/N) XᵀX`，對角線是各特徵的變異數，非對角線是兩兩特徵的共變異數

記號提醒：筆記的 `V` 是把基底向量排成**列**（`z = Vx`），投影片的演算法是把特徵向量排成**行**（`Z = X V_K`）。兩者差一個轉置，讀的時候不要混。

## PCA 演算法（投影片版）

輸入：訓練資料 `X`、測試資料 `X_test`、要保留的維度 `K`。

1. 用**訓練資料**的平均值置中（必要時也縮放每一軸），套到 `X` 和 `X_test`
2. `V = eigenvectors(XᵀX)`
3. 只留前 K 個特徵向量 `V_K`
4. `Z_test = X_test V_K`

需要時再用 `V_Kᵀ` 把 `Z_test` 轉回原空間、加回平均值。置中為什麼必要？投影片問「資料沒置中怎麼辦」，答案是減掉樣本平均。後面的推導都假設資料已置中。

## 兩個 objective 其實是同一個

找第一主成分時，投影片並排列出兩個目標（都要求 `‖v‖₂ = 1`）：

```text
最小化重建誤差：  v* = argmin_v (1/N) Σᵢ ‖x⁽ⁱ⁾ − (vᵀx⁽ⁱ⁾)v‖²
最大化投影變異數：v* = argmax_v (1/N) Σᵢ (vᵀx⁽ⁱ⁾)²
```

等價證明只有一行。因為 `vᵀv = 1`，展開後交叉項會消掉：

```text
‖x − (vᵀx)v‖² = ‖x‖² − (vᵀx)²
```

`‖x‖²` 跟 `v` 無關，所以最小化左邊等於最大化 `(vᵀx)²` 的平均。直覺是畢氏定理：每個點到原點的距離平方固定，拆成「投影長度²」加「到投影線距離²」，一邊變大另一邊就變小。

投影片 Poll 2 請你在 Desmos demo 裡拖投影向量 `v`，找最小的重建 MSE 和最大的投影變異數。課站列的 [Desmos: Projection of points](https://www.desmos.com/calculator/dsfa42s9ln) 可以做這個實驗：兩個極值會出現在同一個方向。

## 為什麼答案是特徵向量

投影片用 Lagrange 乘數處理 `‖v‖₂ = 1` 這條限制。令 `Σ` 為共變異數矩陣：

```text
max_v  vᵀΣv   s.t. vᵀv = 1
L(v, λ) = vᵀΣv − λ(vᵀv − 1)
∂L/∂v = 0  ⇒  Σv = λv
```

最後一行正是特徵向量的定義。代回去，`vᵀΣv = λ`，也就是投影變異數等於特徵值。所以第一主成分是特徵值最大的那個特徵向量，第二主成分是次大的，依此類推。

**選 K**：看特徵值。投影片引用的 slide 寫法是「Variance (%)」，也就是某個主成分的變異數占全部的比例。特徵值小的軸丟掉，損失的資訊就少。

**SVD**：`X = USVᵀ` 裡，`V` 的行是 `XᵀX` 的特徵向量，`σₖ²` 同時是 `XXᵀ` 和 `XᵀX` 的特徵值。所以 PCA 可以不先算共變異數矩陣，直接對資料做 SVD。

投影片最後兩頁是「PCA versus other Linear Transforms」和「Where else have we seen linear transforms?」，PDF 上只有標題，沒有文字內容。

## 可重做的小例子：Recitation 的四個點

Recitation 第 6 題的資料是 (1,2)、(2,3)、(3,2)、(4,3)。

1. 兩個特徵的平均都是 2.5，置中後得到 (−1.5,−0.5)、(−0.5,0.5)、(0.5,−0.5)、(1.5,0.5)
2. 投影到 `v = [1,1]ᵀ/√2`，投影長度是 −√2、0、0、√2
3. 解答算出重建誤差 = 1/2，投影變異數 = 1
4. 用特徵分解：`XᵀX = [[5,1],[1,1]]`，特徵值 3 ± √5，第一主成分約 (0.973, 0.230)

我自己多驗算了一步（不在解答裡）：總變異數是 `(5 + 1)/4 = 1.5`。對 `v = [1,1]ᵀ/√2`，1 + 0.5 = 1.5；換成第一主成分，投影變異數是 `(3+√5)/4 ≈ 1.309`，重建誤差是 1.5 − 1.309 ≈ 0.191。兩個量加起來永遠是 1.5，上一節的等價證明就是在說這件事。

## Notebook 對應：`pca_2d_exercise.ipynb`

這份 Colab 用二維高斯（平均 [20,20]、共變異數 [[25,22],[22,25]]）抽 30 個點，留了幾個 `# FIX ME!` 讓你自己補：

1. 置中
2. 依特徵值排序，取共變異數矩陣的特徵向量 `V`
3. 旋轉到 `Z`，再轉回 `X'`
4. 只保留 `V` 的第一行：`Z` 變成一維，`X'` 仍是二維，但所有點落在一條線上
5. 把平均值加回去，和原始資料疊在一起比較

補完之後，第 4 步的圖就是投影片「Reduced along 1st principal component」那張圖。

## HW 對應

**HW3 書面** Q3 PCA 共 9 分：Warm-Up 2 分（在給定的二維資料圖上畫出第一、第二主成分），Computation 7 分（6 筆 5 維資料：判斷有沒有置中、寫出 SVD 三個矩陣及維度、第一主成分、投影到一維後的變異數與重建誤差）。概念和 Recitation 第 6 題對應，只是維度更高、改用 SVD，詳見 [HW3 導讀](/posts/learning/2026-09-29-cmu-07380-hw3-optimization-pca-map)。HW3 截止日是 10/1，本系列不附解答。

## 延伸對照：LoRA 的低秩是同一個想法

課站在這一講掛了 [LoRA 論文](https://arxiv.org/abs/2106.09685)，但投影片的文字內容沒有提到 LoRA，課堂上講了多少，本篇無法確認。以下只做直覺連結：

- LoRA 的出發點是：微調時權重的**變化量**可能本來就是低秩的。它把預訓練權重 `W₀ ∈ ℝ^{d×k}` 凍結，只學 `ΔW = BA`，其中 `B ∈ ℝ^{d×r}`、`A ∈ ℝ^{r×k}`、`r ≪ min(d,k)`
- 對照投影片開頭的定義，`BA` 就是一個 rank ≤ r 的矩陣，跟 PCA 找的 rank-K 近似是同一類物件
- 差別在於：PCA 用特徵分解一次解出最佳的低秩近似；LoRA 不去近似某個已知矩陣，而是把 `B`、`A` 當參數，用梯度下降在下游任務上訓練

站內另有兩篇從實作角度談 LoRA：[CS224N Tinker and LoRA](/posts/ai/2026-08-22-cs224n-tinker-lora)、[MIT 6.S191 Lab 3 LoRA 微調](/posts/ai/2026-08-22-mit-6s191-lab3-lora-evaluation)。

## 今晚可以做的動作

1. 打開 [Desmos: Projection](https://www.desmos.com/calculator/7x11plypr0)，拖動點看投影向量怎麼變，再手算一組：`‖x‖²` 是否等於投影長度² 加上點到投影線距離²。
2. 不看解答把 Recitation 第 6 題算一遍，最後補上第一主成分的重建誤差，檢查它跟投影變異數加起來是不是 1.5。
3. 下載 `pca_2d_exercise.ipynb`，只用 `np.linalg.eigh` 補完所有 `# FIX ME!`，再用 `np.linalg.svd` 做一次，比較兩個 `V` 是否只差正負號。

## 系列導覽

- 上一篇：[Lecture 6 導讀：Integer Programming，先鬆弛成 LP 再用 branch and bound 分支](/posts/learning/2026-09-29-cmu-07380-lecture-06-integer-programming)
- 下一篇：[Lecture 8 導讀：MAP，先驗怎麼進入估計，為什麼等價於正則化](/posts/learning/2026-09-29-cmu-07380-lecture-08-map)
- 系列總覽：[CMU 07-380 Fall 2026 總覽](/posts/learning/2026-08-22-cmu-07380-fall-2026-overview)

## 參考資料

- [CMU 07-380 AI & ML II Fall 2026 課站](https://www.cs.cmu.edu/~07380/)
- [07-380 Fall 2026 Lecture 7 — Low-rank Optimization & PCA（inked PDF）](https://www.cs.cmu.edu/~07380/lectures/07380_F26_Lec7_Low_Rank_Optimization_PCA_inked.pdf)
- [07-380 Pre-reading: Principal Component Analysis（PR4）](https://www.cs.cmu.edu/~07380/notes/07380_F26_Notes_PCA.pdf)
- [07-380 Recitation 3 & 4](https://www.cs.cmu.edu/~07380/recitations/Recitation3-4_07380_f26.pdf)
- [07-380 Recitation 3 & 4 Solutions](https://www.cs.cmu.edu/~07380/recitations/Recitation3-4_07380_f26_sol.pdf)
- [pca_2d_exercise.ipynb（Colab）](https://colab.research.google.com/drive/1DQJ4cjImkuWOxGibw4oONuuPaVhnxBfC?usp=drive_link)
- [Desmos: Projection](https://www.desmos.com/calculator/7x11plypr0)
- [Desmos: Projection of points](https://www.desmos.com/calculator/dsfa42s9ln)
- [07-380 HW3 Written](https://www.cs.cmu.edu/~07380/assignments/hw3_blank.pdf)
- [Bishop, Pattern Recognition and Machine Learning（PDF）](https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf)
- [Hu et al. (2021), LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
