---
title: "分類與邏輯斯迴歸：從決策邊界到 Newton 法"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, logistic-regression, classification]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 3
tldr: "第二章從 sigmoid 機率模型推導邏輯斯損失，再比較感知器、多類別 softmax 與 Newton 法。"
description: "Stanford CS229 2026 主講義第二章導讀：邏輯斯迴歸、感知器、softmax 迴歸與 Newton 最佳化。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-02-classification-logistic-regression-en)

這篇讀的是 [2026 CS229 主講義](https://cs229.stanford.edu/main_notes.pdf)第 2 章〈Classification and logistic regression〉，講義頁碼 21–29。這是 **2026 notes 的逐章導讀**，不是某一學期錄影內容的重建。

## 從線性預測改成機率分類

若直接用 \(\theta^Tx\) 預測 0 或 1，輸出既不受範圍限制，也沒有機率意義。邏輯斯迴歸先計算線性 logit，再用 sigmoid 壓到 \([0,1]\)：

\[
h_\theta(x)=\frac{1}{1+e^{-\theta^Tx}}=P(y=1\mid x;\theta).
\]

因此 \(\theta^Tx=0\) 對應機率 0.5，也是線性決策邊界。參數仍然線性地決定 log-odds，而不是直接線性地決定機率。

## 從 Bernoulli 概似到交叉熵

對 \(y\in\{0,1\}\)，單筆資料的機率可合寫成 \(h^y(1-h)^{1-y}\)。將全體概似取對數，最大化對數概似等價於最小化

\[
\ell(t,y)=-y\log\sigma(t)-(1-y)\log(1-\sigma(t)),
\]

其中 \(t=\theta^Tx\)。梯度具有「預測減真值」的形式，因此能用梯度上升最大化 log-likelihood，或用梯度下降最小化負對數概似。

感知器則把 sigmoid 換成硬閾值，錯分時才更新。它保留線性邊界和簡單更新，卻不產生校準過的類別機率；不能因公式相似就把它解讀成機率模型。

## 多類別：softmax 的相對分數

有 \(k\) 類時，模型為每一類產生 logit，再正規化：

\[
P(y=j\mid x)=\frac{e^{\theta_j^Tx}}{\sum_{s=1}^k e^{\theta_s^Tx}}.
\]

負對數概似就是多類別交叉熵。對第 \(j\) 類 logit 的梯度為「預測機率減去該類 one-hot 真值」。重要直覺是：softmax 機率來自各類分數的相對差距；所有 logits 同加常數不改變結果。

## Newton 法為什麼快，也為什麼貴

梯度法只看局部斜率；Newton 法再利用 Hessian 的曲率資訊，以

\[
\theta\leftarrow\theta-H^{-1}\nabla J(\theta)
\]

調整方向和尺度。它往往用較少迭代逼近最佳點，但建立與求解 Hessian 系統的成本會隨參數維度快速增加。因此「迭代較少」不等於「總時間一定較短」。

## 限制與章節銜接

未做特徵轉換時，邏輯斯迴歸仍只有線性決策邊界；資料完全可分時，未正規化的最大概似參數還可能往無限大移動。機率輸出也只在模型、資料與校準條件合理時才值得照字面解讀。

第一章提供最佳化與概似語言；第三章會從指數族重新推導 sigmoid 與 softmax，說明它們不是任意挑選的包裝函數。第四章則改學 \(p(x\mid y)\)，走向生成式分類。

## 自學練習

建立一個二維二元分類資料集，同時訓練邏輯斯迴歸與感知器。畫出決策邊界，檢查邏輯斯機率在邊界附近如何變化，再比較梯度下降與 Newton 法每次迭代的損失及實際計算時間。

## 參考資料

- [CS229 Lecture Notes（2026-08-18），Chapter 2：分類、邏輯斯迴歸與 Newton 法](https://cs229.stanford.edu/main_notes.pdf)
- [Stanford CS229 課程網站](https://cs229.stanford.edu/)
