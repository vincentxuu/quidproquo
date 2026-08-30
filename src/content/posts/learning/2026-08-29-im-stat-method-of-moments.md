---
title: "Method of Moments 為什麼是用樣本矩對母體矩？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 24
tldr: "Method of Moments 用樣本矩對上理論母體矩，再解出參數；它不一定最有效率，但很適合建立參數估計的第一個直覺。"
description: "Method of Moments 入門：一階矩、二階矩、Uniform 與 Exponential 手算例題，以及 ML 校準與 distribution matching 的連接。"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-method-of-moments-en)

Method of Moments，常簡寫成 MoM，想法很樸素：分布的理論 summary 和參數有關，而樣本 summary 可以從資料算出來。那就把兩邊對起來，解出參數。

這裡的 moment 可以先理解成平均、平方的平均、立方的平均這類量。第一矩常是 `E[X]`，第二原始矩是 `E[X^2]`。如果一個分布有一個未知參數，通常用一個矩條件；有兩個未知參數，就需要兩個矩條件。

## 基本流程

Method of Moments 的作答順序可以固定成四步。

```text
1. 寫出理論矩：E[X]、E[X^2] 或其他和參數有關的量
2. 寫出樣本矩：sample mean、sample second moment
3. 令樣本矩 = 理論矩
4. 解出參數估計值
```

一階樣本矩是：

```text
m1 = (1/n) sum Xi
```

二階樣本矩常寫成：

```text
m2 = (1/n) sum Xi^2
```

注意這裡的二階樣本矩不是樣本變異數。它是平方後取平均。很多兩參數 MoM 題會同時用 `m1` 和 `m2` 解方程。

## 手算例題一：Uniform(0, theta)

假設：

```text
X ~ Uniform(0, theta)
```

理論平均是：

```text
E[X] = theta / 2
```

若樣本平均 `xbar = 5`，MoM 令：

```text
theta / 2 = 5
```

所以：

```text
theta_hat = 10
```

這題的直覺很清楚：Uniform(0, theta) 的中心在 `theta/2`，樣本平均看起來是 5，那上界 `theta` 就估成 10。

這個估計量不一定是這個問題最有效率的估計量。若你知道 Uniform(0, theta) 的最大值很接近上界，也可以想到用樣本最大值設計估計量。MoM 的價值在於容易算，也容易把「分布參數」和「資料 summary」接起來。

## 手算例題二：Exponential(lambda)

假設：

```text
X ~ Exponential(lambda)
```

理論平均是：

```text
E[X] = 1 / lambda
```

若樣本平均 `xbar = 4`，令：

```text
1 / lambda = 4
```

得到：

```text
lambda_hat = 1 / 4 = 0.25
```

這類題目最常見的錯誤是把 `lambda` 和平均數反過來。Exponential 的平均是 `1/lambda`，不是 `lambda`。看到等待時間、壽命、間隔這類題目時，要先確認參數化方式。

## 兩個參數時怎麼辦

假設某分布有兩個參數 `alpha` 和 `beta`，而理論上：

```text
E[X] = f(alpha, beta)
E[X^2] = g(alpha, beta)
```

樣本中可以算：

```text
m1 = (1/n) sum Xi
m2 = (1/n) sum Xi^2
```

MoM 就令：

```text
m1 = f(alpha, beta)
m2 = g(alpha, beta)
```

然後解聯立方程。考試如果不想讓計算太重，通常會選一個能整理出漂亮答案的分布。你要練的是把理論矩和樣本矩對上，不要一開始就找背好的估計式。

## 這在 ML / AI 哪裡會用到

MoM 是參數 fitting 的早期語感：先找資料中穩定的 summary，再讓模型的對應量貼近它。後面看到 GMM、distribution matching、模型校準、embedding 分布對齊時，會遇到類似的思路。

例如一個分類模型預測的平均正類機率是 0.7，但實際正類比例只有 0.55。這表示模型輸出的 summary 和資料 summary 對不上，可能需要 calibration。你不一定會直接用傳統 MoM 解參數，但「讓模型 summary 對上資料 summary」這個直覺會一直出現。

生成模型評估也會碰到相近想法。你可能比較生成資料和真實資料的平均長度、類別比例、embedding 平均和變異。這些 summary 不能代表全部品質，但可以當作發現分布偏移的第一層檢查。

## 常見錯誤

- 把樣本矩和母體矩混在一起，沒有寫清楚哪邊是資料、哪邊是理論。
- 二階矩 `E[X^2]` 和 variance 混用。
- 分布參數化不同時，直接套記憶中的平均公式。
- 兩個參數卻只寫一個矩條件。
- 以為 MoM 一定是最有效率的估計方法。

## 練習題

1. 若 `X ~ Exponential(lambda)`，`E[X] = 1/lambda`，給定 `xbar = 4`，用 MoM 估 `lambda`。
2. 若 `X ~ Uniform(0, theta)`，`xbar = 6`，用 MoM 估 `theta`。
3. 寫出一參數與兩參數 MoM 題目的差別：需要幾個矩條件？
4. 用模型校準例子說明「讓模型 summary 貼近資料 summary」的直覺。

## 下一篇怎麼接

MoM 用 summary 對 summary。下一篇會進到最大概似估計 MLE：它不只對幾個 summary，而是問哪個參數讓整批資料出現的可能性最高。

## 章節級參考對照

- OpenIntro / OpenStax：矩、樣本矩、分布參數與點估計基礎。
- Stanford CS109：分布參數、expectation 與樣本 summary 的對應。
- scikit-learn：模型校準、parameter fitting 與分布檢查語境。

## 參考資料

- [Method of Moments and Point Estimation in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Probability Distributions and Expected Value](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Probability Calibration](https://scikit-learn.org/stable/modules/calibration.html)
- [scikit-learn Density Estimation](https://scikit-learn.org/stable/modules/density.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
