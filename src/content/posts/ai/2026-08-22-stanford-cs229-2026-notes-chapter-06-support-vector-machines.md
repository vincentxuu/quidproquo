---
title: "支援向量機：間隔、對偶與 SMO"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, svm, optimization]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 7
tldr: "第六章把分類信心形式化為幾何間隔，再用拉格朗日對偶、kernel 與 SMO 建出可實作的 SVM。"
description: "Stanford CS229 2026 主講義第六章導讀：函數間隔、幾何間隔、SVM 對偶、soft margin 與 SMO。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-06-support-vector-machines-en)

這篇讀的是 [2026 CS229 主講義](https://cs229.stanford.edu/main_notes.pdf)第 6 章〈Support vector machines〉，講義頁碼 60–78。它是 **2026 notes 的逐章導讀**，不是任何一學期錄影內容的重建。

## 從「分對」到「離邊界夠遠」

同樣能把訓練資料分開的兩條超平面，穩健程度可能不同。SVM 用間隔描述這個差異。採 \(y\in\{-1,1\}\) 與分數 \(w^Tx+b\) 時，單筆資料的函數間隔是

\[
\hat\gamma^{(i)}=y^{(i)}(w^Tx^{(i)}+b).
\]

正值表示分類正確，數值越大看似越有信心。但將 \(w,b\) 同時乘 10，不改決策邊界，函數間隔卻也乘 10，所以它不能單獨代表幾何距離。

除以 \(\|w\|\) 後得到幾何間隔，它對共同縮放保持不變，真正對應樣本到超平面的帶符號距離。資料集間隔取所有樣本中的最小值，最大化它就是保護最靠近邊界的那批資料。

## 最大間隔如何變成凸最佳化

在線性可分的前提下，可利用縮放自由令最小函數間隔為 1，將問題改寫成

\[
\min_{w,b}\frac12\|w\|^2
\quad\text{s.t.}\quad
y^{(i)}(w^Tx^{(i)}+b)\ge 1.
\]

這是凸二次目標加線性限制。最小化 \(\|w\|\) 等價於最大化幾何間隔，原本難處理的正規化條件也消失。

## 對偶形式讓 kernel 進場

講義用廣義 Lagrangian 介紹 primal、dual、weak/strong duality 與 KKT 條件。對 SVM 而言，對偶問題的資料只以 \(x^{(i)T}x^{(j)}\) 出現，因此第五章的 kernel 可直接替換內積。

解出的 \(w\) 是 \(\sum_i\alpha_i y^{(i)}x^{(i)}\)。只有 \(\alpha_i>0\) 的點會影響邊界，它們就是 support vectors。這也解釋名稱：分類器主要由貼近或侵入間隔的資料點支撐，而不是平均依賴所有樣本。

## Soft margin 與 C 的取捨

真實資料通常不可完全線性分開。soft-margin SVM 加入 slack \(\xi_i\)，允許樣本違反間隔，並最佳化

\[
\min_{w,b,\xi}\frac12\|w\|^2+C\sum_i\xi_i
\quad\text{s.t.}\quad
y^{(i)}(w^Tx^{(i)}+b)\ge 1-\xi_i,\qquad \xi_i\ge0.
\]

\(C\) 大時嚴厲處罰違規，傾向貼合訓練資料；\(C\) 小時容許更多違規以換取較寬間隔。對偶限制也從 \(\alpha_i\ge0\) 變成 \(0\le\alpha_i\le C\)。

## SMO：一次為什麼更新兩個參數

Sequential minimal optimization（SMO）在對偶問題中一次挑兩個 \(\alpha\) 更新。因為對偶有 \(\sum_i\alpha_i y^{(i)}=0\) 的等式限制，只改一個通常無法保持可行；固定其他參數後，兩個變數受等式綁定，實際只剩一維二次最佳化，再將解裁切到合法區間。

## 假設、限制與下一章

硬間隔假設資料可分；soft margin 雖較實用，仍需選 \(C\)、kernel 與 kernel 超參數。kernel SVM 在大量樣本下可能受 Gram 矩陣和二次最佳化成本限制，機率校準也不是原生輸出。

本章完成第五章 kernel 的主要落點，也與第二章形成對照：邏輯斯迴歸最佳化概似並輸出機率，SVM 直接最佳化間隔。下一章轉入神經網路，改以可學習的多層表徵處理非線性。

## 自學練習

在二維資料上畫出可分情況的最大間隔線、兩側 margin 與 support vectors。加入一個離群點後，分別用三個 \(C\) 訓練 soft-margin SVM，記錄間隔寬度、違規點與 support-vector 數量如何變化。

## 參考資料

- [CS229 Lecture Notes（2026-08-18），Chapter 6：支援向量機（SVM）、kernel、soft margin 與 SMO](https://cs229.stanford.edu/main_notes.pdf)
- [John Platt, Sequential Minimal Optimization: A Fast Algorithm for Training Support Vector Machines](https://www.microsoft.com/en-us/research/publication/sequential-minimal-optimization-a-fast-algorithm-for-training-support-vector-machines/)
