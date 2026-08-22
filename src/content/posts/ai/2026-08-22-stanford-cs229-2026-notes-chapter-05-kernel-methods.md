---
title: "核方法：不顯式展開特徵的非線性學習"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, kernel-methods, feature-maps]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 6
tldr: "第五章把高維特徵的內積改寫成 kernel，讓依賴內積的線性演算法在不顯式建立特徵的情況下學非線性。"
description: "Stanford CS229 2026 主講義第五章導讀：特徵映射、kernel trick、Mercer 條件與核化演算法。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-05-kernel-methods-en)

這篇讀的是 [2026 CS229 主講義](https://cs229.stanford.edu/main_notes.pdf)第 5 章〈Kernel methods〉，講義頁碼 49–59。它是 **2026 notes 的逐章導讀**，不是某季錄影的重建。

## 非線性，仍然可以對參數線性

線性模型能力不足時，可以先把輸入送進特徵映射 \(\phi(x)\)，再學 \(\theta^T\phi(x)\)。例如一維輸入可展開成多項式特徵。模型對原始 \(x\) 是非線性的，但對參數 \(\theta\) 仍然線性，因此前面熟悉的 LMS 等方法仍可使用。

問題是特徵空間可能極大，甚至無限維。顯式建立 \(\phi(x)\) 會讓運算與儲存成本失控。

## Kernel trick 的代數核心

本章先把參數寫成訓練特徵的線性組合：

\[
\theta=\sum_i\beta_i\phi(x^{(i)}).
\]

此時預測只需要內積 \(\phi(x^{(i)})^T\phi(x)\)。若有函數

\[
K(x,z)=\phi(x)^T\phi(z),
\]

能直接從原始輸入計算這個值，就不必顯式建立特徵向量。多項式 kernel 對應多項式特徵；Gaussian kernel 則以距離控制相似度，可對應到無限維特徵空間。

把 kernel 粗略想成相似度很有幫助：相似樣本給較大值。但這只是直覺，不是充分定義。任意「看起來像相似度」的函數不一定是合法 kernel。

## 合法 kernel 與 Gram 矩陣

對任意資料點集合，kernel matrix \(K_{ij}=K(x^{(i)},x^{(j)})\) 必須對稱且半正定。講義在其有限維 \(\mathbb R^d\) 設定中以 Mercer 條件表達可由某個特徵映射產生的必要且充分條件。

半正定不是形式要求而已。它保證這組兩兩數值能一致地被視為某個內積空間中的 Gram 矩陣，也維持後續最佳化需要的幾何結構。

## 哪些演算法可以核化

只要演算法能完全改寫成樣本間內積，就有機會把內積替換成 \(K\)。本章以特徵化 LMS 展示這件事，下一章則會把同一技巧用在 SVM 對偶問題。核化不是把任意演算法包一層函數；關鍵是整個訓練與預測過程是否只透過內積接觸特徵。

## 隱藏成本與章節銜接

kernel trick 省掉顯式高維特徵，卻沒有讓資料規模消失。通常要建立 \(n\times n\) Gram 矩陣，預測也可能依賴許多訓練樣本。kernel 與其超參數的選擇同樣會控制偏差與變異；Gaussian bandwidth 太小可能近似記憶資料，太大則可能抹平結構。

這一章承接第一章「線性模型加特徵」的想法，並替第六章鋪路：SVM 的對偶形式只依賴內積，因此能自然套用 kernel，得到非線性最大間隔分類器。

## 自學練習

對三個二維點手算二次多項式特徵 \(\phi(x)\) 的所有內積，再用對應 polynomial kernel 直接計算，確認兩者一致。接著比較不同 Gaussian bandwidth 產生的 Gram 矩陣，觀察它如何從接近單位矩陣變成幾乎常數矩陣。

## 參考資料

- [CS229 Lecture Notes（2026-08-18），Chapter 5: Kernel methods](https://cs229.stanford.edu/main_notes.pdf)
- [Stanford CS229 課程網站](https://cs229.stanford.edu/)
