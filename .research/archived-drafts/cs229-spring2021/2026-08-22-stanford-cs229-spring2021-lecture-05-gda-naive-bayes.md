---
title: "Stanford CS229 Lecture 5：GDA 與 Naive Bayes 的生成式分類"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, gda, naive-bayes]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 6
tldr: "Lecture 5 從直接學 p(y|x) 轉向學 p(x|y)p(y)：GDA 用類別 Gaussian 描述連續特徵，Naive Bayes 用條件獨立壓縮離散特徵的參數量。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 5：生成式與判別式學習、Gaussian discriminant analysis、共享 covariance，以及 Naive Bayes。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-05-gda-naive-bayes-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 6 篇，對應 **Stanford CS229, Spring 2021, Lecture 5**。課程在 2021 年 4 月 12 日的官方題目是 **Gaussian discriminant analysis. Naive Bayes.**；本文實際使用當學期 live lecture notes，以及 syllabus 指定的共用 Generative Algorithms notes Section 1。錄影沒有作為來源。

這講的主脊是換一種分類問題的問法。Logistic regression 直接學 `p(y|x)`；生成式方法先學每一類如何產生特徵的 `p(x|y)`，再學類別先驗 `p(y)`，最後用 Bayes rule 回到分類所需的 posterior。

## 判別式畫邊界，生成式描述兩邊

Bayes rule 給出：

```text
p(y|x) = p(x|y)p(y) / p(x)
```

若只要選機率較大的類別，分母 `p(x)` 對每個候選 `y` 都相同，因此：

```text
argmax_y p(y|x) = argmax_y p(x|y)p(y)
```

判別式方法可以直接找出分界；生成式方法則分別描述每一類特徵的分布，再比較新樣本在哪一類模型下更可能出現。後者學到較多結構，也因此需要較多假設。

## GDA：每一類一個中心，共用一個形狀

Gaussian discriminant analysis（GDA）用於連續特徵。二元版本假設：

```text
y ~ Bernoulli(φ)
x | y=0 ~ N(μ₀, Σ)
x | y=1 ~ N(μ₁, Σ)
```

兩類有不同平均向量 `μ₀`、`μ₁`，卻共用 covariance matrix `Σ`。幾何上，兩個 Gaussian 的等高線有相同形狀與方向，只是中心不同。訓練時，`φ` 是正類比例；`μ₀`、`μ₁` 是各類樣本平均；`Σ` 則合併兩類相對各自中心的偏差。

預測時比較 `p(x|y)p(y)`。共享 covariance 會讓 log posterior odds 對 `x` 呈線性，因此決策邊界是直線或超平面。筆記進一步指出，GDA 導出的 `p(y=1|x)` 具有 logistic 形式；反方向卻不成立。Logistic conditional 並不保證各類特徵真的服從共享 covariance 的 Gaussian。

## 更強假設換來什麼

若 `p(x|y)` 的 Gaussian 假設接近正確，GDA 能利用分布結構，以較少資料學得不錯。若特徵分布明顯不是 Gaussian，直接學 `p(y|x)` 的 logistic regression 假設較弱，通常更穩健。

這不是「生成式一定比判別式好」或反過來。判斷軸是額外假設是否可信。生成式方法用假設換資料效率；假設錯置時，也會把更多錯誤結構寫進模型。

## Naive Bayes：用條件獨立躲過組合爆炸

Lecture 5 接著把視角移到離散高維特徵。垃圾郵件可以用字典大小的 binary vector 表示：第 `j` 個字出現就令 `x_j=1`。若字典有 `d` 個字，完整建模 `p(x|y)` 需要處理 `2^d` 種向量，參數量不可行。

Naive Bayes 的核心是假設：給定類別 `y` 後，各特徵彼此條件獨立：

```text
p(x|y) = Π_j p(x_j|y)
```

這不是說字詞在整體上互相獨立，也不是說現實郵件真的逐字獨立生成。它只在已知 spam／non-spam 類別後，把聯合分布拆成單一特徵的乘積。參數因此從指數規模降到每個類別、每個字各估一個出現機率。

估計值有直接的次數解釋：`p(x_j=1|y=1)` 是 spam 郵件中出現字 `j` 的比例。預測時把各字在某類別下的機率相乘，再乘上該類 prior。Lecture 6 會處理這個乘積最明顯的破口：有限資料中沒看過的字會得到零機率，讓整個乘積歸零。

## 模型先決定資料表示

GDA 接收連續向量並描述 covariance；Naive Bayes 範例先把郵件轉成 word-presence vector。模型不是在「原始資料」上憑空運作，它依賴特徵表示。若把連續值離散成區間，也能套 Naive Bayes，但分箱邊界會丟掉區間內資訊；若直接用 GDA，則要承擔 Gaussian 形狀假設。

因此選模型也在選資料被看成什麼。沒有一個表示能同時保留所有結構、又完全不引入假設。

## 在十八講中的位置

Lecture 5 是課程第一次完整切換 `p(y|x)` 與 `p(x|y)p(y)`。它把前一講的分布建模具體化，也為後面的 latent-variable 方法預演「先描述資料如何生成」的思路。Lecture 6 會完成 Naive Bayes 的 smoothing 與文字 event models，再銜接到 kernel methods。

## 延伸

拿一份二元分類資料，先檢查每類特徵的散布圖與 covariance 是否大致相似，再決定 GDA 假設是否合理。對文字資料，則列出兩個明顯相關的字，問清楚條件獨立只是計算近似，還是你的任務真的容許忽略它們的共現結構。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Generative Algorithms notes, Section 1](https://cs229.stanford.edu/notes2020spring/cs229-notes2.pdf)
- [Spring 2021 Lecture 5 live notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture5_live.pdf)
