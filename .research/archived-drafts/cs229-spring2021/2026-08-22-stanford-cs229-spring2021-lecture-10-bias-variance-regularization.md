---
title: "Stanford CS229 Spring 2021 Lecture 10：Bias–Variance 拆解與 Regularization 的真正取捨"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, bias-variance, regularization]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 11
tldr: "測試誤差可拆成不可避免雜訊、bias² 與 variance；regularization 以增加部分偏差換取較低變異，而 ridge regression 的 λ 會抬高小特徵值方向的曲率，使解更穩定但不保證所有任務都更準。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 10：bias–variance decomposition、L2 regularization、ridge regression、欠定線性模型與 gradient descent 的 implicit regularization。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-10-bias-variance-regularization-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 11 篇，對應 **Stanford CS229, Spring 2021, Lecture 10**。課程表日期是 2021 年 4 月 28 日，官方題目是 **Bias - Variance. Regularization. Feature / Model selection.**；本文實際使用當學期的 Live Lecture Notes、Regularization and Model Selection 講義與兩份 bias–variance 補充講義。錄影沒有作為來源。

前九講多半固定一個模型，問它怎麼學。Lecture 10 把隨機性拉回來：換一批訓練資料，同一個程序會不會得到很不一樣的預測？Bias–variance decomposition 的價值，不是把模型貼成「高 bias」或「高 variance」而已，而是指出測試誤差來自哪些彼此不同的來源。

## 從欠擬合與過擬合走向正式拆解

低次多項式可能無法表達真實關係，稱為欠擬合；高次多項式可能緊貼訓練點，換一批資料就劇烈變動，稱為過擬合。訓練誤差通常隨模型複雜度下降，測試誤差則可能先降後升。

講義用平方損失把直覺形式化。假設

```text
y = h₀(x) + ε,    E[ε]=0, Var(ε)=σ²
```

訓練集 `S` 是隨機抽樣的，學習程序產生 `h_S`。定義跨訓練集平均的預測

```text
h_avg(x) = E_S[h_S(x)]
```

則固定測試點上的期望平方誤差可拆成

```text
E[(h_S(x)-y)²]
= σ²
+ (h_avg(x)-h₀(x))²
+ E[(h_S(x)-h_avg(x))²]
```

三項依序是不可避免的雜訊、bias 的平方與 variance。交叉項消失，依賴的是雜訊均值為零，以及 `h_avg` 本身就是跨訓練集平均。這個拆解針對平方損失與指定資料生成假設，不能不加說明地搬到所有評估指標。

## Regularization 為何通常降低 variance

對線性迴歸加入 L2 penalty：

```text
min_θ ||Xθ-y||² + λ||θ||²
```

封閉解是

```text
θ_λ = (XᵀX + λI)⁻¹Xᵀy
```

若 `XᵀX` 在某些方向的特徵值很小，普通最小平方解會在那些方向放大資料擾動。加上 `λI` 等於把每個特徵值都抬高 `λ`，讓反矩陣不再對小特徵值方向過度敏感。解因此通常較穩定，variance 降低；同時參數被往零縮，也可能增加 bias。

`λ` 不是由訓練損失直接選出的模型參數，而是控制取捨的 hyperparameter。講義提到以獨立驗證資料或 cross-validation 選擇；不能用測試集反覆調 `λ`，再把同一個測試分數當成無偏估計。

## 欠定模型裡為什麼會有很多解

現代模型常出現參數數量大於樣本限制的情況。若 `XᵀX` 不滿秩，普通 normal equation 沒有唯一解；任何落在 `X` null space 的向量都能加到一個解上，而不改變訓練預測。

Ridge regression 透過 `λ||θ||²` 選擇一個受控解。講義也給出 implicit regularization 的例子：從 `θ₀=0` 開始做 gradient descent，每次更新都在 `Xᵀ` 的 column space 中，因此迭代不會憑空長出 null-space component。在能插值的線性設定下，這條路徑會偏向 minimum-norm solution。

這個結論有明確前提：線性最小平方、從零初始化，以及相應的 gradient descent 動態。不能直接把它擴張成「所有深度模型的 gradient descent 都一定找到最佳正則化解」。

## Explicit 與 implicit regularization 的界線

Explicit regularization 直接改變目標函數，例如加入 `λ||θ||²`。Implicit regularization 則來自演算法與初始化，即使所有插值解有相同訓練損失，最佳化路徑也可能偏好其中一類。

兩者都在問同一件事：訓練資料不足以唯一決定預測器時，還有什麼機制在選解？差別是前者把偏好寫進 objective，後者要從 update dynamics 看出來。只看最後訓練誤差，無法辨認這個選擇。

## 這一講的限制

公開講義的正式拆解使用平方損失；分類問題的 bias 與 variance 沒有同樣簡潔的代數形式。講義也把 double descent 標成 bonus，沒有建立一套足以涵蓋所有現代過度參數化模型的理論。本文因此不把經典 U 型曲線寫成永遠成立的自然律。

Regularization 也不是越強越好。`λ` 太大會讓模型接近零函數，提高 bias。它解決的是訓練集擾動導致的不穩定，不會自動修正錯誤標籤定義、分布偏移或缺失特徵。

## 這一講在十八講裡的位置

Lecture 8–9 解釋神經網路如何計算與訓練；Lecture 10 提供判斷模型複雜度與穩定性的語言。它也是監督式學習到非監督式學習的轉折點：Lecture 11 拿掉標籤，改問如何從資料本身找群集與潛在變數。

可以做一個小實驗：固定真實二次函數，重抽多份小訓練集，分別擬合一次、二次與高次多項式。畫出每個 `x` 上的平均預測與預測散布，就能把 bias 和 variance 從一張抽象 U 型圖拆成兩個可觀察量。

## 延伸

在線性模型上，把 `XᵀX` 的特徵值排序，再比較加入不同 `λ` 後的 `1/(s_i+λ)`。這會直接顯示 ridge 如何壓低原本最不穩定的方向。接著才看測試誤差，會比只調一串 `λ` 更清楚正則化實際改變了什麼。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 10 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture10_live.pdf)
- [Regularization and Model Selection notes](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes5.pdf)
- [Bias-Variance calculations addendum](https://cs229.stanford.edu/notes2020fall/notes2020fall/addendum_bias_variance.pdf)
- [Bias-Variance and Error Analysis addendum](https://cs229.stanford.edu/notes2020fall/notes2020fall/error-analysis.pdf)
