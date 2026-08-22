---
title: "正規化與模型選擇：顯式、隱式與交叉驗證"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, regularization, cross-validation, bayesian-statistics]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 10
tldr: "第 9 章把泛化控制拆成三條路：在損失中顯式懲罰複雜度、利用最佳化器偏好的隱式正規化，以及用未參與訓練的資料選模型；MAP 則說明高斯先驗如何對應 L2 懲罰。"
description: "CS229 2026 主講義第 9 章導讀：L1/L2 正規化、weight decay、implicit bias、hold-out 與 k-fold cross-validation，以及 Bayesian MAP。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-09-regularization-model-selection-en)

這是 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf) 2026 版第 9 章（印刷頁 137–145）的逐章導讀，依官方主講義整理，**不是某一季 CS229 錄影的內容重建**。本篇沿著「怎麼控制有效複雜度」這條主脊，說明顯式正規化、隱式偏好、交叉驗證與 Bayesian MAP 的關係。

第 8 章說明高變異會破壞泛化，但「少用參數」不是唯一解。第 9 章進一步指出，複雜度可以是參數範數、稀疏程度、函數平滑度，甚至是最佳化器偏向哪一個全域最小值。

## 顯式正規化是兩個目標的交易

正規化後的目標寫成

$$
J_\lambda(\theta)=J(\theta)+\lambda R(\theta).
$$

$J$ 要求模型擬合資料，$R$ 對某種複雜度或不想要的結構收費，$\lambda$ 控制兩者權衡。$\lambda=0$ 時沒有額外限制；太大則可能把模型壓到高偏差區。正規化不是保證更好，而是把「偏好哪種解」寫進目標。

最常見的 $L_2$ 正規化令 $R(\theta)=\frac12\|\theta\|_2^2$。梯度下降更新會多出縮小權重的 $(1-\eta\lambda)\theta$，因此深度學習常稱它 weight decay。$L_1$ 懲罰 $\|\theta\|_1$ 則是不連續、無法直接用梯度法最佳化的非零參數數量 $\|\theta\|_0$ 的連續替代，常用來鼓勵稀疏。講義也提醒：若真實解並不稀疏，強推稀疏會增加偏差；而 kernel trick 通常更適合 $L_2$，因為 $L_1$ 解未必只靠特徵內積表示。

## 隱式正規化來自「怎麼找到解」

在有唯一全域最小值的古典問題裡，合理最佳化器最後都到同一點，演算法幾乎沒有額外選擇空間。過度參數化模型常有許多訓練損失近似相同的解，它們的測試表現卻可能差很多。初始化、學習率、批次大小與 momentum 會改變最後落在哪一個解，這就是 implicit bias 或 algorithmic regularization。

重要的是：訓練誤差已經接近零，仍不能推論最佳化器調整完了。最佳化器不只決定「能不能把 $J$ 降下來」，也在相同訓練損失的解之間做選擇。講義列出的較大初始學習率、較小初始化、較小批次與 momentum 只是若干情境下的經驗線索；「隨機性偏向較平坦極小值，而平坦解較能泛化」仍不是普遍定理。

## 交叉驗證讓模型在未見資料上競爭

若直接以訓練誤差選多項式次數，最高次數幾乎總會勝出，因為同一批資料既用來擬合又用來評分。hold-out cross-validation 把資料分成訓練集與驗證集：每個候選模型只在訓練集擬合，再以驗證誤差選擇。資料足夠時，這是便宜又清楚的做法。

資料少時，k-fold cross-validation 把資料分成 $k$ 份，每次留一份驗證、其餘訓練，最後平均各折誤差，再以全資料重訓選中的模型。它減少單次保留資料的比例，代價是每個候選模型要訓練 $k$ 次。leave-one-out 是 $k=n$ 的極端版本，資料利用率高但計算昂貴，也不代表估計一定更穩。

驗證集是模型選擇程序的一部分；若反覆看測試集再改超參數，測試集也會被間接過度擬合。這個界線是實作時比「到底用五折還是十折」更重要的紀律。

## MAP 把先驗變成正規化

頻率學派把 $\theta$ 視為未知常數；Bayesian 觀點對它指定先驗 $p(\theta)$，再由資料得到後驗 $p(\theta\mid S)$。完整 Bayesian 預測要積分所有參數值，通常因高維積分而困難。MAP 以單一後驗眾數近似：

$$
\theta_{MAP}=\arg\max_\theta p(S\mid\theta)p(\theta).
$$

取負對數後，likelihood 變成資料損失，prior 變成正規化項。例如零均值等向高斯先驗會產生 $L_2$ 型懲罰。這提供了正規化的機率詮釋，但 MAP 仍只是點估計，沒有保留完整後驗的不確定性。

## 限制與章節銜接

正規化項只有在它表達的歸納偏好與問題相符時才有用；交叉驗證依賴資料切分能代表未來分布，時間序列或群組資料不能任意 iid 切分；隱式正規化的效果也會隨架構與訓練動態改變。

本章把第 8 章的泛化診斷轉為可操作的控制。下一章進入非監督式學習，以 k-means 展示第一個交替最佳化演算法；它「每步都改善目標，但可能停在局部最佳」的模式也會在第 11 章 EM 再出現。

## 自學練習

在同一份多項式迴歸資料上建立一組 $L_2$ 強度。只用訓練集擬合，用驗證集選 $\lambda$，最後只評估一次測試集。再刻意用訓練誤差選 $\lambda$，比較兩種選擇的測試結果，觀察「選模型的資料」為何必須與「擬合參數的資料」分開。

## 參考資料

- [CS229 Lecture Notes（2026）第 9.1 節：L1、L2 與 weight decay](https://cs229.stanford.edu/main_notes.pdf#page=138)
- [CS229 Lecture Notes（2026）第 9.2 節：隱式正規化](https://cs229.stanford.edu/main_notes.pdf#page=140)
- [CS229 Lecture Notes（2026）第 9.3–9.4 節：交叉驗證與 Bayesian MAP](https://cs229.stanford.edu/main_notes.pdf#page=142)
