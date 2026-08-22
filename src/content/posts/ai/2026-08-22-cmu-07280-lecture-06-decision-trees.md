---
title: "CMU 07-280 Lecture 6 導讀：Decision Trees 如何用 Mutual Information 分裂資料"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, decision-trees, information-theory, machine-learning]
lang: zh-TW
series:
  name: "CMU 07-280 完整課程導讀"
  order: 6
tldr: "Lecture 6 從 decision stump 遞迴建樹，用 entropy 衡量 label uncertainty，再以 `I(Y;W)=H(Y)-H(Y|W)`選擇分裂；這是計算可行的 greedy ERM，不是全域最佳樹保證。"
description: "完整導讀 CMU 07-280 Spring 2026 Decision Trees：遞迴建樹、停止條件、連續特徵、entropy、conditional entropy 與 mutual information。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-cmu-07280-lecture-06-decision-trees-en)

這是 **CMU 07-280 Spring 2026 Lecture 6：Decision Trees**。Lecture 5 只說要從 hypothesis class 找 empirical risk 小的函數。這一講第一次把 `H` 具體化，並展示一個核心取捨：不窮舉所有樹，而是每個 node 貪心選一次最有資訊的 split。

## 官方材料與讀取範圍

本文完整讀取 [Decision Trees lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes%20-%20decision%20trees.pdf)、[pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Decision_Trees.pdf)、[Recitation 3](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3.pdf)與[solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3_sol.pdf)，並核對 [HW4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)。沒有公開逐講錄影。

## 承上問題：hypothesis class 選定後，怎麼有效找模型

Decision tree 的 internal node 問一個 attribute，edge 對應答案，leaf 輸出 label。公寓例子會問租金、押金、距離與公車站，再決定是否實地查看。它的優點是路徑可直接讀成人類規則；困難是訓練資料沒有附上該問哪個問題。

二元版本令 `X={0,1}^d`、`Y={0,1}`。Decision stump 只分裂一次；完整 tree 則遞迴分裂。若 attributes 用完或 node 裡 labels 已一致，就用 majority vote 建 leaf。

## 完整概念脈絡：greedy construction 與資訊量

課堂演算法在每個 node 呼叫 `BestAttribute(S,A)`，用選定 attribute 把 samples 分成 0／1 兩群，再遞迴處理剩餘 attributes。這是 greedy approach：每步選當下最好的 split，換取計算效率，但不保證得到全域最小或最準的整棵樹。

「最好」可以定義成 split 後 training error 最低，也可以用 impurity。這一講主攻 information theory：

```text
H(Y) = Σ_y P(Y=y) log2(1/P(Y=y))
H(Y|W) = Σ_w P(W=w) H(Y|W=w)
I(Y;W) = H(Y) - H(Y|W)
```

Entropy 衡量 label uncertainty。Conditional entropy 是知道 attribute `W` 後，各 child entropy 的加權平均。Mutual information 是分裂前後 uncertainty 減少量；`BestAttribute`選 `I(Y;W)` 最大者。

連續 feature 可用 threshold，例如問 `x2 ≥ 4.5`。Attribute 也不一定在使用後移除；數值特徵可能在更深節點用另一個 threshold 再切。Stopping criteria 則控制 tree size，例如 split 若幾乎不降低 error 就停止。

## 可重做的小例子：一個 bit 帶來多少資訊

假設八筆資料有四個正例、四個負例，因此：

```text
H(Y) = -0.5 log2 0.5 - 0.5 log2 0.5 = 1 bit
```

Attribute `W1` 完美把四個正例放左、四個負例放右。兩個 child entropy 都是 0，所以 `H(Y|W1)=0`，`I(Y;W1)=1`。

Attribute `W2` 的兩個 child 都各有兩正兩負，conditional entropy 仍是 1，所以 `I(Y;W2)=0`。用 `W2` 分裂沒有降低 label uncertainty；即使圖畫出兩個 branches，模型其實沒學到可區分類別的資訊。

## Recitation／HW 對應

Recitation 3 先要求定義 decision tree、entropy、conditional entropy、mutual information，再從 fair coin、偏置 coin 與 dice 手算 entropy。後半用天氣與跑步資料逐步算 `H(Y)`、`H(Y|X)` 與最佳 split，最後討論何時 high information gain 仍可能造成不理想的 tree。

HW4 第一題給定 training set，要求比較 candidate splits；題面明確說該小題不必真的算 entropy，重點是能判斷分裂後的 label composition。這讓 Recitation 的完整計算與作業的結構判讀互補。

## 延伸對照：可解釋不代表穩定或全域最佳

一棵 tree 的單一路徑容易解釋，但訓練過程是 greedy：資料稍微改變，root split 可能改變，後續整棵子樹也會重建。Mutual information 只評估當前 split 的 label uncertainty reduction，不是整棵未來 tree 的全域目標證明。

因此「human interpretable」應該精確理解為 prediction path 可讀，而不是訓練過程無取捨、模型必然簡單或結果必然穩定。

## 今晚可以做的動作

1. 手算 fair coin、固定為反面、fair six-sided die 的 entropy。
2. 為八筆二元資料計算兩個 attributes 的 conditional entropy 與 mutual information。
3. 把最佳 attribute 當 root，遞迴做第二層，直到 leaf labels 一致或 attributes 用完。

## 參考資料

- [CMU 07-280 Spring 2026 Decision Trees lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes%20-%20decision%20trees.pdf)
- [07-280 Decision Trees pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Decision_Trees.pdf)
- [07-280 Spring 2026 Recitation 3](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3.pdf)
- [Recitation 3 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3_sol.pdf)
- [07-280 Spring 2026 Homework 4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)
