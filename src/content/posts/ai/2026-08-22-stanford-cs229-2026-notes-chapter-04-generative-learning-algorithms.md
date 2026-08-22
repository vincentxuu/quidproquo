---
title: "生成式學習演算法：GDA、Naive Bayes 與平滑"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, generative-models, naive-bayes]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 5
tldr: "第四章改從 p(x|y) 與 p(y) 建模，用 GDA、Naive Bayes 和 Laplace 平滑展示生成式分類的力量與代價。"
description: "Stanford CS229 2026 主講義第四章導讀：GDA、Naive Bayes、Bernoulli 與 multinomial event model、Laplace 平滑。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-04-generative-learning-algorithms-en)

這篇讀的是 [2026 CS229 主講義](https://cs229.stanford.edu/main_notes.pdf)第 4 章〈Generative learning algorithms〉，講義頁碼 35–48。它是 **2026 notes 的逐章導讀**，不是某一學期錄影的重建；本章把 Naive Bayes 標成 optional reading，也應照講義的權重理解。

## 判別式與生成式的分岔

邏輯斯迴歸直接學 \(p(y\mid x)\)。生成式分類器改學類別先驗 \(p(y)\) 和類別條件分布 \(p(x\mid y)\)，再用 Bayes 法則比較

\[
p(y\mid x)=\frac{p(x\mid y)p(y)}{p(x)}.
\]

分類時分母對所有類別相同，所以只需找出使 \(p(x\mid y)p(y)\) 最大的類別。這條路的優點是模型描述得更多，也因此承擔更強的分布假設。

## GDA：共享協方差帶來線性邊界

Gaussian discriminant analysis（GDA）假設 \(y\) 服從 Bernoulli 分布，且

\[
x\mid y=0\sim\mathcal N(\mu_0,\Sigma),\qquad
x\mid y=1\sim\mathcal N(\mu_1,\Sigma).
\]

兩類共用協方差矩陣，但有不同平均數。最大概似估計具有直觀封閉解：\(\phi\) 是正類比例，\(\mu_0,\mu_1\) 是各類樣本平均，\(\Sigma\) 是相對於各類中心的 pooled covariance。

將 Bayes 後驗整理後，\(p(y=1\mid x)\) 會呈現 sigmoid 形式，所以 GDA 也產生線性邊界。但反方向不成立：邏輯斯後驗不代表 \(x\mid y\) 必然是共享協方差的高斯。GDA 的假設更強；假設接近真實時可能更有效率，失配時也可能更脆弱。

## Naive Bayes：用條件獨立換可估計性

文字資料的詞彙維度很高，直接估計每一種 \(x\) 的聯合機率幾乎不可能。Naive Bayes 假設給定類別後，各特徵條件獨立：

\[
p(x\mid y)=\prod_j p(x_j\mid y).

\]

「naive」正是這個強假設；它通常不是真的，卻把指數級聯合分布拆成可由計數估計的多個一維機率。Bernoulli event model 記錄詞是否出現，multinomial event model 則把文件視為一串詞事件，保留重複次數；兩者的樣本空間不同，不能混用公式。

## Laplace 平滑不是裝飾

若某個詞在某類訓練資料中從未出現，最大概似估計會給它機率 0，整份文件的乘積也跟著歸零。add-one smoothing 在每個計數加 1，分母相應加入可能結果數，避免「沒看過」被誤判成「不可能」。平滑引入偏差，但換來有限資料下更穩健的預測。

## 限制與章節銜接

GDA 對高斯形狀與共享協方差敏感；Naive Bayes 對特徵相依關係視而不見，而且輸出的機率常不適合直接當校準信心。高維資料下，機率乘積也應在 log 空間計算以免數值下溢。

本章和第三章形成鮮明對照：一邊直接建模條件分布，一邊建立聯合分布。下一章的核方法會走另一條路，不指定輸入分布，而是用相似度把線性學習器擴展到非線性特徵空間。

## 自學練習

用同一個二元資料集訓練邏輯斯迴歸與 GDA，先在近似高斯資料比較，再刻意加入偏斜或離群值。另用十封短文字手算 Bernoulli Naive Bayes，觀察不加平滑時一個未見詞如何讓整個類別機率歸零。

## 參考資料

- [CS229 Lecture Notes（2026-08-18），Chapter 4：生成式學習、GDA 與 Naive Bayes](https://cs229.stanford.edu/main_notes.pdf)
- [Stanford CS229 課程網站](https://cs229.stanford.edu/)
