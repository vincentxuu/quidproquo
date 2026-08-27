---
title: "Stanford CS229 Lecture 6：Laplace Smoothing 修補零機率，再走向 Kernel"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, naive-bayes, kernel-methods]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 7
tldr: "Lecture 6 用 Laplace smoothing 避免未見事件把 Naive Bayes 整體機率乘成零，區分 Bernoulli 與 multinomial text models，並以 feature map 開啟 kernel methods。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 6：Naive Bayes、Laplace smoothing、文字 event models，以及從高維 feature map 到 kernel methods 的入口。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-06-laplace-smoothing-kernels-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 7 篇，對應 **Stanford CS229, Spring 2021, Lecture 6**。課程在 2021 年 4 月 14 日的官方題目是 **Naive Bayes, Laplace Smoothing.**；本文實際使用當學期 live lecture notes，以及 syllabus 指定的共用 Generative Algorithms notes Section 2。live notes 在完成文字 event models 後也開始介紹 kernel methods，本文保留這段作為下一講入口。錄影沒有作為來源。

這講的主脊是「有限資料不能把沒看過誤寫成不可能」。Naive Bayes 會把許多條件機率相乘，只要其中一項被估成零，整個類別分數就歸零。Laplace smoothing 不是裝飾性的微調，而是讓有限樣本估計仍能對新事件保留非零機率。

## 零為什麼會污染整個預測

假設某個字在 spam 與 non-spam 訓練信件都沒出現。未平滑的 maximum-likelihood estimate 會給：

```text
p(word appears | spam) = 0
p(word appears | non-spam) = 0
```

Naive Bayes 的 `p(x|y)` 是特徵機率乘積。新信件一旦含有該字，兩個類別的乘積都含零，posterior 可能變成 `0/0`。這不是資料證明事件不可能，而是有限訓練集尚未觀察到它。

更一般地，對有 `k` 種結果的 multinomial 變數，未平滑估計是 `count_j/n`。某類別計數為零，就得到精確零機率；乘法模型會把這個局部估計放大成整體否決。

## Add-one 的分母為什麼要加 k

Laplace smoothing 把估計改成：

```text
φ_j = (count_j + 1) / (n + k)
```

每個類別先加一個 pseudo-count，分母便要增加 `k`，才能讓所有 `φ_j` 總和維持為一。它解決兩件事：每個已知類別都有非零機率，整組估計仍是合法分布。

在 binary word-presence 模型裡，每個字只有出現與未出現兩種結果，所以相應分母加二。這不是為 spam 與 non-spam 各加一；是對單一 Bernoulli 變數的兩種可能結果各給 pseudo-count。

平滑也有界線。它只把零往內拉，沒有修正錯誤的字典、標籤偏差或條件獨立假設。大量未登入詞彙仍應映射到 `UNK` 等明確表示，不能期待 smoothing 自動理解新詞語意。

## Bernoulli 與 multinomial event model 在數什麼

Bernoulli event model 問每個字「有沒有在信件出現」，同一個字重複五次仍只是 `x_j=1`。Multinomial event model 則把信件表示成字詞位置序列，每個位置產生一個 vocabulary item，因此重複次數會進入 likelihood。

兩者的乘積外觀很像，隨機變數的意義卻不同：

- Bernoulli：每個詞彙項目是一個二元出現事件。
- Multinomial：每個 token 位置從 vocabulary 分布抽出一個字。

因此不能只看公式都有 `Π` 就把參數共用。選擇取決於任務是否需要詞頻訊號。multinomial 模型仍假設各位置在給定類別後由同一分布獨立產生，沒有建模語序或句法。

## 從 feature map 看見 kernel 的動機

live notes 後段把線性模型改寫成對新特徵表示 `φ(x)` 做線性預測。原始 attributes 可以被映射成平方項、交互項或更高維 features；模型對 `φ(x)` 是線性的，對原始 `x` 卻能形成非線性邊界。

問題是 feature 維度 `p` 可能非常大。若顯式建立所有高次項，梯度更新成本會依 `p` 成長。筆記給出一個關鍵觀察：參數從零初始化，並以訓練樣本特徵的線性組合更新後，任何時刻的參數仍可寫成訓練樣本 feature vectors 的線性組合：

```text
θ = Σ_i β_i φ(x^(i))
```

這使預測與更新能改寫成訓練樣本間的 inner products `φ(x)ᵀφ(z)`。Kernel methods 的下一步，就是在不顯式建立高維 `φ(x)` 的情況下直接計算這個相似度。這堂 live notes 只打開入口，完整 kernel 定義與有效性條件留給 Lecture 7。

## 在十八講中的位置

Lecture 6 完成第一輪生成式分類：假設、估計、零機率修正與文字表示。接著它把課程從「挑哪個機率模型」推向「挑哪個特徵空間」。Lecture 7 會正式處理 kernel 與 SVM；因此這一講的兩半其實共享同一問題：如何在不爆掉參數或計算量的前提下表示複雜資料。

## 延伸

用三封短訊息手算 Bernoulli 與 multinomial Naive Bayes。故意放入一個訓練時沒見過的字，先算未平滑結果，再加入 add-one smoothing。接著重複某個已知字三次，觀察 Bernoulli 與 multinomial 分數在哪一步開始分歧。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Generative Algorithms notes, Section 2](https://cs229.stanford.edu/notes2020spring/cs229-notes2.pdf)
- [Spring 2021 Lecture 6 live notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture6_live.pdf)
