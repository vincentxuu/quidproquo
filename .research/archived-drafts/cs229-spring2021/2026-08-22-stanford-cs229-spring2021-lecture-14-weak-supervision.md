---
title: "Stanford CS229 Lecture 14：Weak Supervision 如何從衝突規則產生訓練標籤"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, weak-supervision, snorkel]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 15
tldr: "Weak supervision 把規則、既有分類器與知識庫寫成 labeling functions，再用它們的大量同意與衝突估計來源品質，產生帶不確定性的機率標籤。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 14：programmatic labeling、label model、來源相關性，以及沒有逐筆人工標籤時可學與不可學的部分。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-14-weak-supervision-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 15 篇，對應 **Stanford CS229, Spring 2021, Lecture 14**。課程表日期是 2021 年 5 月 12 日，官方題目是 **Weak supervised / unsupervised learning**。本文實際使用該學期的 *Introduction to weak supervision* 投影片與 *ICA and weak supervision* draft。錄影在 Canvas，沒有作為來源。

這堂課的核心不是「接受比較差的標籤」，而是把產生標籤的過程變成可以建模的對象。人工逐筆標註很慢，而且規則、知識庫、既有分類器與群眾標註早已在系統裡混用；weak supervision 要做的是保留這些便宜來源，再估計它們有多可靠、彼此是否重複。

## Labeling function 把領域知識變成程式

以醫療文字的實體辨識為例，一個來源可能判斷全大寫名字是人名，另一個來源查醫院名單，第三個來源呼叫現成分類器。每個來源都可以寫成 labeling function：輸入資料 `x`，輸出某個類別或 abstain。

對 `m` 個來源與 `n` 筆未標註資料，可以得到標籤矩陣：

```text
Lᵢⱼ = labeling function j 對資料 i 的輸出
```

問題隨即變得可見：來源會衝突，也會相關。兩條規則若都建立在同一份詞典上，它們的同意不能當成兩份獨立證據；一個來源常常 abstain，也不能只用表面命中率評價。

## 沒有 ground truth，準確度從哪裡來

講義的關鍵直覺是從重疊學習。假設真實標籤 `Y` 是潛在變數，而 labeling functions 是有噪音的觀測。對許多資料點觀察來源兩兩同意或不同意，就可以用生成式 label model 估計來源的準確度與相關性。

在最簡化、來源條件獨立的二元情況下，兩個來源的同意程度會由它們各自對 `Y` 的可靠度共同決定。可把核心矩寫成：

```text
E[λⱼ λₖ] ≈ E[λⱼY] · E[λₖY]
```

左邊是資料中可觀測的 pairwise agreement；右邊包含各來源相對於未知 `Y` 的準確度訊號。這是 method of moments 的直覺：不用看見每個 `Y`，也能用可觀測矩約束潛在模型參數。

等 label model 估出來源品質後，它不必強迫每筆資料只有硬標籤，而可輸出 `P(Y | L)`。下游 discriminative model 以這些機率標籤訓練，保留來源衝突造成的不確定性。

## 為什麼不能直接多數決

多數決把每個來源當成同樣準確且互相獨立。這在最需要 weak supervision 的環境裡通常不成立：一個高品質知識庫可能比十條粗糙 regex 更可靠，而十條由同一模式改寫的規則也不該有十票。

label model 的價值就在於把來源行為放進模型。不過它不是憑空創造資訊。若所有來源都以同一方式錯誤、完全沒有相對獨立的訊號，重疊本身無法指出共同偏差。模型結構指定錯誤時，估計的準確度也可能失真。

## 三階段管線各自負責什麼

講義以 Snorkel 呈現三個階段：

1. 使用者撰寫 labeling functions，將規則、遠端監督、既有模型或群眾訊號轉成程式化標籤。
2. label model 合併衝突來源，輸出機率標籤。
3. end model 只看原始特徵與機率標籤，學習可部署的預測函式。

第三步很重要。部署時不一定要執行每一條昂貴或不可服務化的 labeling function；它們是產生訓練訊號的工具，不必成為線上模型的輸入。

## 限制：便宜不是免費

- Labeling functions 仍需要領域知識、除錯與版本管理。
- 估計依賴模型假設；忽略來源相關性可能把重複證據算太多次。
- 機率標籤改善的是 supervision 管線，不保證原始資料涵蓋部署分布。
- 沒有少量人工驗證集時，很難知道最終品質是否達到產品要求。

課堂列出的醫療與產業案例說明這套做法可以進入真實系統，但案例不是「任何任務都免人工標註」的證明。比較準確的判決是：當專家能寫出多個有訊號但不完美的來源時，programmatic labeling 可把知識擴展到大量未標註資料。

## 這一講在十八講裡的位置

Lecture 13 的 Factor Analysis 把未觀測的 `z` 當成潛在變數；Lecture 14 把未觀測的真實標籤 `Y` 也放進生成模型。兩堂課共享的技術習慣是：不要假裝缺失量已知，而要利用可觀測資料推論它。

下一講的 self-supervision 則走另一條路：不再依賴人寫 labeling functions，而從資料本身建構 pretext task。兩者都減少逐筆人工標註，訓練訊號的來源卻不同。

## 延伸

實作 weak supervision 前，先建立一張來源表：每條 labeling function 的資料依賴、涵蓋率、預期錯誤與可能共用的規則。這個動作能在訓練 label model 前，先找出「看似很多來源，其實只有一種證據」的問題。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Introduction to weak supervision slides](https://cs229.stanford.edu/notes2021spring/notes2021spring/WeakSupervise_229.pdf)
- [ICA and weak supervision draft](https://cs229.stanford.edu/notes2021spring/notes2021spring/ica_and_weak_supervision.pdf)
