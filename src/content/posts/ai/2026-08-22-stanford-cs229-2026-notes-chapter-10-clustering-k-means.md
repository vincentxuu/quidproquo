---
title: "分群與 k-means：交替最佳化的第一個範例"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, unsupervised-learning, clustering, k-means]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 11
tldr: "第 10 章用 k-means 建立非監督式學習的第一個完整演算法：交替更新會讓 distortion 單調不增並在數值上收斂，但不保證得到全域最佳解。"
description: "CS229 2026 主講義第 10 章導讀：k-means 的指派與中心更新、distortion objective、coordinate descent、初始化與局部最佳限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-10-clustering-k-means-en)

這是 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf) 2026 版第 10 章（印刷頁 147–149）的逐章導讀，依官方主講義整理，**不是任何一季課堂錄影的重建**。這章只有三頁，核心任務很集中：看懂 k-means 為何是交替最佳化，以及「收斂」到底保證了什麼。

前兩章處理有標記資料上的泛化與模型選擇。本章進入非監督式學習：只給 $x^{(1)},\ldots,x^{(n)}$，沒有 $y$，希望把資料整理成 $k$ 個內部相近的群。

## 演算法交替做硬指派與取平均

k-means 先初始化 $k$ 個中心 $\mu_1,\ldots,\mu_k$，然後反覆執行兩步：

$$
c^{(i)}\leftarrow \arg\min_j\|x^{(i)}-\mu_j\|_2,
$$

$$
\mu_j\leftarrow
\frac{\sum_i \mathbf 1\{c^{(i)}=j\}x^{(i)}}
{\sum_i \mathbf 1\{c^{(i)}=j\}}.
$$

第一步把每個點交給最近中心，是硬指派；第二步把中心移到被分配點的算術平均。平均不是任意選擇：在平方歐氏距離下，它正是固定指派後讓群內平方距離最小的點。

## distortion 把兩步放進同一個目標

定義 distortion

$$
J(c,\mu)=\sum_{i=1}^n\|x^{(i)}-\mu_{c^{(i)}}\|_2^2.
$$

固定中心時，最近中心指派會最小化 $J$；固定指派時，各群平均會最小化 $J$。因此 k-means 是對 $c$ 與 $\mu$ 做 coordinate descent，每一步都不增加 distortion，$J$ 的數值會收斂。

這份保證很窄。$J$ 收斂不等於群集一定有語意，也不等於找到全域最小值。理論上，不同指派甚至可能在同一個 $J$ 值間來回；實務上較常遇到的是停在受初始化影響的局部最佳。

## 幾何假設藏在距離函數裡

k-means 偏好以均值為中心、近似球狀且尺度相近的群。特徵單位會直接改變歐氏距離：一個數值範圍大的欄位可能支配所有指派，所以需要依問題決定標準化方式。離群值也會拉動平均中心。

$k$ 必須事先指定，而 distortion 會隨 $k$ 增加自然下降，不能只用訓練 distortion 無限制地挑最大 $k$。此外，若某次更新後一個群沒有任何點，分母為零，實作必須重新初始化或採取明確處理策略；講義的簡潔公式沒有展開這個工程細節。

## 初始化與多次重跑

可從資料點中隨機選 $k$ 個當初始中心。因為目標非凸，不同起點會走向不同局部解。講義建議用多組隨機初始化重跑，再選 distortion 最低的結果。這能降低踩到差局部解的機率，但仍不是全域最佳證明。

## 與前後章的關係

第 9 章以交叉驗證在候選模型間選擇；本章則假定 $k$ 已給定，專注在參數與指派的交替更新。第 11 章會把硬指派換成每個群的後驗機率，得到高斯混合模型的「軟」分群，並用 ELBO 說明一般 EM 為何單調改善 likelihood。

## 自學練習

建立兩組二維資料：一組是三個尺度相近的圓形群，另一組是兩個拉長且交疊的月牙形群。對每組資料用十個隨機起點跑 k-means，記錄最後 distortion 與分群圖。比較「最低 distortion」和「符合你想像的群」是否總是同一件事。

## 參考資料

- [CS229 Lecture Notes（2026）第 10 章：k-means 指派與中心更新](https://cs229.stanford.edu/main_notes.pdf#page=148)
- [CS229 Lecture Notes（2026）第 10 章：distortion 與 coordinate descent](https://cs229.stanford.edu/main_notes.pdf#page=149)
- [CS229 Lecture Notes（2026）第 10 章：局部最佳與多次初始化](https://cs229.stanford.edu/main_notes.pdf#page=150)
