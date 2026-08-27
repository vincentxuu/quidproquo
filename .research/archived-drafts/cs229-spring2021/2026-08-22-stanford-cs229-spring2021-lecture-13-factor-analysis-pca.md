---
title: "Stanford CS229 Lecture 13：Factor Analysis 與 PCA 如何找出低維結構"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, factor-analysis, pca]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 14
tldr: "Factor Analysis 把觀測資料寫成低維潛在因子加高斯雜訊；PCA 則直接找出投影變異最大的正交方向。兩者都降維，但前者是機率生成模型，後者是幾何最佳化。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 13：Factor Analysis 的潛在變數模型、EM 估計、PCA 的投影觀點，以及兩種降維方法的限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-13-factor-analysis-pca-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 14 篇，對應 **Stanford CS229, Spring 2021, Lecture 13**。課程表日期是 2021 年 5 月 10 日，官方題目是 **Factor Analysis and PCA**。本文實際使用該學期的 Lecture 13 live lecture notes，並以課程表指定的 PCA 講義補齊推導；課程表另列 ICA 講義，但本文不把 ICA 當成這一講的主題。課程錄影在 Canvas，沒有作為來源。

這一講的主脊是同一個問題的兩種回答：高維資料看似有很多座標，真正變化是否只由少數方向控制？Factor Analysis 用生成模型回答，PCA 用投影幾何回答。它們最後都產生低維表示，卻不是同一個目標函數。

## Factor Analysis：先假設資料怎麼生成

令觀測向量 `x ∈ R^d`，潛在向量 `z ∈ R^k`，而且 `k` 遠小於 `d`。Factor Analysis 的模型是：

```text
z ~ N(0, I)
x = μ + Λz + ε
ε ~ N(0, Ψ)
```

`Λ` 把低維因子映射到觀測空間，`Ψ` 是對角雜訊共變異數矩陣。直覺上，資料大部分的共同變化由 `Λz` 解釋，每個座標剩下的獨立擾動交給 `ε`。

把潛在變數積分掉後，觀測分布仍是高斯：

```text
x ~ N(μ, ΛΛᵀ + Ψ)
```

這個式子說明模型真正施加的結構：共變異數不是任意矩陣，而是「低秩共同結構加對角雜訊」。若直接估完整共變異數，高維時參數很多；Factor Analysis 用較小的 `Λ` 與 `Ψ` 換取結構假設。

## 為什麼需要 EM

若每筆資料的 `z` 都可見，估計 `Λ` 與雜訊會容易許多；問題正是 `z` 沒被觀測。這與先前 GMM 的情況相同，因此講義把 EM 帶回來：

- E-step：在目前參數下計算 `p(z | x)`，取得 `E[z | x]` 與 `E[zzᵀ | x]`。
- M-step：把這些條件期望當成充分統計量，更新 `μ`、`Λ` 與 `Ψ`。

高斯分布的邊際化與條件化仍是高斯，讓 E-step 有封閉形式。這是公式背後的真正便利，不只是「EM 可以套用」。

限制也跟著出現。EM 只保證每輪不降低 likelihood，不保證找到全域最佳解；旋轉潛在空間也可能得到等價解釋。因此因子本身未必具有唯一、可直接命名的語意。

## PCA：改問哪個投影保留最多變化

PCA 不先指定機率生成過程。先把資料中心化，再找單位向量 `u`，使投影後的平方長度最大：

```text
maximize   Σᵢ (uᵀx⁽ⁱ⁾)²
subject to ||u||₂ = 1
```

等價地，它也最小化資料到投影直線的平方殘差。若 `Σ̂` 是樣本共變異數，目標可寫成 `uᵀΣ̂u`；最佳 `u` 就是最大特徵值對應的特徵向量。要保留 `k` 維時，取前 `k` 個互相正交的特徵向量。

這裡的公式直覺很直接：`uᵀx` 是資料沿某方向的座標，平方後加總衡量那個方向承載多少變化。PCA 並不是找「最有因果意義」的方向，而是找變異最大、重建誤差最小的線性子空間。

## 同樣降維，回答的問題不同

Factor Analysis 問的是：哪個低維潛在變數與座標雜訊的組合，最可能生成資料？PCA 問的是：投影到哪個線性子空間，能保留最多平方變異？前者明確區分共同因子與各座標雜訊；後者把所有變異都放進幾何目標。

因此兩者的限制也不同：

- 都只描述線性低維結構，彎曲流形不會自動被展開。
- PCA 對量尺敏感；身高用公尺或公分會改變共變異數，因此中心化之外有時也要標準化。
- 「解釋變異很多」不等於「對下游預測最有用」；少量但與標籤高度相關的方向可能被捨棄。
- Factor Analysis 的對角雜訊假設若不合理，低秩因子可能被迫吸收原本相關的誤差。

## 這一講在十八講裡的位置

Lecture 11–12 從 GMM、EM 走到 Factor Analysis；Lecture 13 完成這條線，並以 PCA 把潛在變數觀點接到線性代數。接下來 Lecture 14–15 轉向標籤不足時的 weak supervision 與 self-supervision，不再只是「怎麼壓縮 `x`」，而是「訓練訊號從哪裡來」。

若要檢查自己是否抓到差別，可以拿同一份中心化資料做兩件事：畫出 PCA 第一主成分，再寫出一個含對角 `Ψ` 的 Factor Analysis 模型。接著問：前者最大化什麼，後者又把哪一部分明確叫作雜訊？能回答這兩句，就不會把兩種方法只記成兩個降維 API。

## 延伸

選擇 PCA 維度時，講義建議看保留的 explained variance。這是壓縮品質的指標，不是通用的模型選擇答案。實務上還應把不同 `k` 的低維表示送進真正的下游任務，以驗證被保留的方向是否有用。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 13 live lecture notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture13_draft.pdf)
- [Principal Components Analysis notes](https://cs229.stanford.edu/notes2020spring/cs229-notes10.pdf)
