---
title: "獨立成分分析：從混合訊號恢復獨立來源"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, unsupervised-learning, ica, source-separation]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 14
tldr: "第 13 章把 ICA 建模為 x=As：觀測是未知線性混合，目標是估計 W=A^{-1} 恢復獨立且非高斯的來源。變數變換的 Jacobian determinant 進入 likelihood，導出 Bell–Sejnowski 的梯度更新。"
description: "CS229 2026 主講義第 13 章導讀：cocktail party problem、ICA 的置換與尺度不識別性、非高斯假設、density transformation 與 maximum-likelihood 更新。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-13-independent-components-analysis-en)

這是 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf) 2026 版第 13 章（印刷頁 173–178）的逐章導讀，依官方主講義整理，**不是某一季錄影或課程進度的重建**。本章以 cocktail party problem 為主脊：多支麥克風錄到多個說話者的線性混合，能否只靠觀測把來源拆回來？

## 從混合矩陣到解混矩陣

ICA 假設每筆觀測滿足

$$
x=As,
$$

其中 $s\in\mathbb R^d$ 是彼此獨立的來源，$A$ 是未知且可逆的方形 mixing matrix，$x$ 是觀測。令 $W=A^{-1}$，則恢復來源是 $s=Wx$。第 $j$ 列 $w_j^T$ 會從所有觀測座標抽出第 $j$ 個來源：$s_j=w_j^Tx$。

這與 PCA 都像是在找新基底，但目標完全不同。PCA 讓投影方向正交並依變異量排序；ICA 要的是輸出座標在統計上獨立。PCA 可作為白化前處理，卻不會自動完成來源分離。

## 有兩種資訊永遠無法從觀測恢復

第一是順序。若以 permutation matrix $P$ 交換來源，$PW$ 仍能產生同一組來源，只是排列不同。第二是尺度與正負號：把 $A$ 的某一欄乘上 $\alpha$，同時把對應來源除以 $\alpha$，觀測 $x$ 不變。因此 ICA 最多恢復到 permutation 與非零 scaling。

對聲音分離而言，順序通常沒有語意，尺度多半只改音量，正負號也不改聽感。這些不是演算法瑕疵，而是模型本身的不可識別性；評估時不應要求不可能的唯一答案。

## 為什麼來源必須非高斯

若 $s\sim\mathcal N(0,I)$，它的分布對旋轉不變。對任意正交矩陣 $R$，$A$ 與 $AR$ 都產生共變異矩陣 $AA^T$ 相同的高斯觀測，資料無法分辨是哪個旋轉。也就是說，高斯獨立來源還多了一整個旋轉模糊性。

ICA 能超越二階共變異資訊，靠的正是來源的非高斯性。講義的識別結論是在來源獨立、非高斯且資料足夠等條件下成立；實務上若多個來源接近高斯、混合不是線性瞬時、來源數與感測器數不同，這個基本模型都需要延伸。

## density transformation 不能漏掉 determinant

若 $s$ 的密度為 $p_s$，且 $x=As$、$W=A^{-1}$，不能只寫 $p_x(x)=p_s(Wx)$。線性變換會改變體積，因此

$$
p_x(x)=p_s(Wx)|\det W|.
$$

$|\det W|$ 是 Jacobian 體積修正。講義用一維 $s\sim\operatorname{Uniform}[0,1]$、$x=2s$ 說明：區間長度加倍後，密度高度必須減半，總機率才能維持一。

## 獨立假設導出 maximum likelihood

若各來源有共同邊際密度 $p_s$ 且互相獨立，則

$$
p(x)=\prod_{j=1}^d p_s(w_j^Tx)|\det W|.
$$

講義在沒有其他先驗時，以 sigmoid $g(s)$ 作 CDF，令 $p_s(s)=g'(s)$，得到資料 log-likelihood，並對 $W$ 做 stochastic gradient ascent。單筆資料的更新包含兩部分：$1-2g(w_j^Tx)$ 來自來源密度，$(W^T)^{-1}$ 來自 log determinant。前者推動輸出符合非高斯來源模型，後者防止解混矩陣把空間體積任意壓扁。

選定 sigmoid derivative 也是模型假設，不是所有非高斯來源的萬用密度。若知道來源分布形狀，應改用相符的 likelihood。講義還假設資料已中心化；對時間序列，樣本間獨立並不嚴格成立，但有足夠資料時仍可運作，隨機打亂 SGD 訪問順序可能加快收斂。

## 與前後章的關係

第 12 章以共變異矩陣找最大變異的正交方向；本章加入非高斯與獨立假設，追求可解釋的來源分離。下一章進入生成模型：不再假設一個固定線性混合，而是學習把高斯雜訊經多步反向過程轉回複雜資料分布。

## 自學練習

產生一段正弦波與一段方波，標準化後用可逆 $2\times2$ 矩陣混合。先只用 PCA 旋轉，再用 ICA 解混。比較輸出與原來源時，允許交換順序、縮放與正負號；若直接逐座標算誤差，會把 ICA 本來就不可識別的部分誤判成失敗。

## 參考資料

- [CS229 Lecture Notes（2026）第 13 章：ICA 與 cocktail party problem](https://cs229.stanford.edu/main_notes.pdf#page=174)
- [CS229 Lecture Notes（2026）第 13.1–13.2 節：不識別性與 density transformation](https://cs229.stanford.edu/main_notes.pdf#page=175)
- [CS229 Lecture Notes（2026）第 13.3 節：maximum-likelihood ICA 演算法](https://cs229.stanford.edu/main_notes.pdf#page=177)
