---
title: "CMU 07-280 Lecture 5 導讀：用 Loss、Risk 與 ERM 定義機器學習"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, machine-learning, empirical-risk-minimization]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 5
tldr: "Lecture 5 把機器學習寫成 `X → Y`、loss、risk 與 empirical risk minimization：訓練集只能提供平均已知損失，真正目標仍是未知分布上的 generalization。"
description: "完整導讀 CMU 07-280 Spring 2026 ML Problem Formulation：分類、迴歸、loss、risk、i.i.d.、ERM、非監督式學習與 self-supervised learning。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-05-ml-formulation-en)

這是 **CMU 07-280 Spring 2026 Lecture 5：ML Problem Formulation**。前四講由人定義 transitions、constraints、utility 與 heuristic；這一講轉向「主要依賴 examples」的系統，但仍不急著選模型。它先要求把輸入、輸出與錯誤代價寫清楚。

## 官方材料與讀取範圍

本文完整讀取 [ML Problem Formulation notes](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec5_MLFormulation.pdf)，並讀取下一講指定的 [Decision Trees pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Decision_Trees.pdf)以確認概念如何落到第一個模型。官方沒有公開逐講錄影。

課程表將 HW3 列為 online-only；匿名讀者拿不到題面、答案或 Gradescope feedback。本文不會聲稱已用 HW3 驗證本講細節，練習對應只能接到公開的 Recitation 3 與 HW4。

## 承上問題：不能手寫規則時，何謂「學得好」

CSP 有明確 constraints，minimax 有 utility，A* 有 path cost。機器學習也必須有好壞標準，否則「從資料學習」只是口號。Lecture 5 把 supervised learning 寫成：

```text
input space X
output space Y
training data D={(x(i),y(i))} for i=1...N
hypothesis h: X → Y
```

Classification 的 `Y` 是有限、無順序類別；regression 的 `Y` 是連續且有順序。`h` 的工作是在新輸入 `x(new)` 上預測未知的 `y(new)`。

## 完整概念脈絡：從單筆 loss 到分布上的 risk

**Loss function** `ℓ(ŷ,y)`定義一次預測的代價。分類可用 0-1 loss：猜錯為 1，猜對為 0；迴歸常用 squared error `(ŷ-y)^2`，讓偏差大小進入代價。

真正關心的是未見資料上的 expected loss：

```text
R(h) = E_(x,y)[ℓ(h(x),y)]
```

這是 **risk**。課程採用常見的 i.i.d. 假設：training 與 test samples 都從同一未知分布獨立抽出。問題是分布未知，無法直接算 `R(h)`。手上只有訓練集，因此改算 **empirical risk**：

```text
R_hat(h) = (1/N) Σ ℓ(h(x(i)),y(i))
```

再從 hypothesis class `H` 選擇 empirical risk 最小者，稱為 **empirical risk minimization（ERM）**。這裡留下兩個後續問題：`H` 要包含哪些函數，以及如何有效求出 minimizer。Decision trees、linear models 與 neural networks 都是在回答這兩題。

本講最後也區分 unsupervised learning：只有 `x`，沒有人工給的 `y`，可做 clustering、dimensionality reduction、representation learning 與 generation。Self-supervised learning 則從資料本身構造 target。例如遮住文字的一部分，讓模型預測被遮住或下一個 token，就能把無人工標籤的資料轉成 supervised pairs。

## 可重做的小例子：訓練錯誤最低不等於代價最低

假設四筆醫療訓練資料的真值是 `[ill, ill, healthy, healthy]`。模型 A 預測 `[healthy, ill, ill, healthy]`，模型 B 預測 `[ill, ill, ill, ill]`。兩者都錯兩筆，所以 0-1 empirical risk 都是 `2/4=0.5`。

現在定義 asymmetric loss：把病人誤判健康的 false negative 代價設 5，把健康者誤判生病的 false positive 代價設 1。A 有一個 false negative 和一個 false positive，平均 loss `6/4=1.5`；B 有兩個 false positive，平均 loss `2/4=0.5`。資料沒變，模型也沒變，決策卻因 loss 改變。

這說明 performance measure 不是模型外的報表欄位；它直接決定 ERM 要找哪個 `h`。

## Recitation／HW 對應

HW3 的公開缺口使校外自學者無法直接重做當週正式題目。下一份可讀的 [Recitation 3](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3.pdf)從 decision tree、entropy 與 mutual information 開始，而 [HW4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)把 decision-tree split 與 linear-regression objective 放在同一份作業。

這條接法很清楚。Lecture 5 先定義 `H`、loss 與 ERM。Lecture 6 選 `H=decision trees` 並用 mutual information 做 greedy construction；Lecture 7 選 linear functions 與 squared loss，直接求 ERM。

## 延伸對照：ERM 是代理目標，不是 generalization 保證

Empirical risk 使用已看過的有限 samples，risk 卻定義在未知分布。兩者接近需要更多條件：資料是否真的同分布、hypothesis class 是否過度靈活、樣本量是否足夠。Lecture 5 暫時只建立形式，沒有在此證明 generalization bound。

因此不能把 training loss 很低直接寫成「模型學會了」。更精確的說法是：它在選定 loss 與 `H` 下，很好地符合這份 training set。未見資料表現仍需 validation／test evidence。

## 今晚可以做的動作

1. 選一個熟悉問題，寫出 `X`、`Y`、一個 `h` 與 loss；每項都要能計算。
2. 用五筆玩具資料手算兩個 hypotheses 的 empirical risk。
3. 改變一次 loss 的不對稱代價，觀察 ERM 選擇是否改變。

## 參考資料

- [CMU 07-280 Spring 2026 Lecture 5 — ML Problem Formulation](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec5_MLFormulation.pdf)
- [07-280 Decision Trees pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Decision_Trees.pdf)
- [07-280 Spring 2026 Recitation 3](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3.pdf)
- [07-280 Spring 2026 Homework 4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)
