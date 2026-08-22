---
title: "Stanford CS109 Lecture 7｜Variance 與 Poisson：從分散程度到稀有事件計數"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 8
tldr: "先用 variance 描述隨機變數的分散程度，再用 Poisson 處理固定區間內的事件數，以及大 n、小 p 的二項近似。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 7：variance、standard deviation、Poisson 分布、區間換算與 binomial approximation。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-07-poisson-distribution-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 8 篇，對應 **Summer 2026 Lecture 7: Poisson**，日期為 7 月 1 日，講者是 Chris Gregg。本文依 Summer [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture07-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture07-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture07-LLMPrompts.pdf)與跨 offering 共用的 Spring-dated [課程讀本](https://probabilitycoders.stanford.edu/spr26/poisson)逐題整理；Canvas 錄影未公開，因此不重建課堂口述。

官方題名雖是 Poisson，worksheet 前半先補齊上一講的另一半工作：期望值指出分布中心，variance 與 standard deviation 說明它散得多開。接著才用 Poisson 處理「固定區間內發生幾次」。

## P1：先把 expectation 接回來

每次約會遇到人生伴侶的機率是 `0.2`，彼此獨立，直到第一次成功才停止，則約會人數

```text
X ~ Geo(0.2),   E[X] = 1 / 0.2 = 5
```

幾何分布包含成功的那次，所以是平均約會五人，不是四次失敗。另一情境令 `Y ~ Bin(500, 0.53)` 表示 500 次罰球的命中數；由二項分布平均值或 indicator 的 linearity，`E[Y] = 500 × 0.53 = 265`。後面的 variance 以 `μ = E[X]` 為中心，Poisson approximation 又使用 `λ = np`，這題正好接起兩者。

## P2：variance 為什麼要平方

```text
Var(X) = E[(X - μ)²],   μ = E[X]
```

若只平均偏差，`E[X-μ]` 永遠為零，因為平均值兩側的正負偏差互相抵消。平方讓兩側都成正值，也讓較遠的結果權重更大。展開後可得較方便的計算式：

```text
Var(X) = E[X²] - (E[X])²
```

`E[X²]` 是先平方每個可能值，再以 PMF 加權，即由 LOTUS 算 `Σx x²P(X=x)`；`(E[X])²` 則是先求平均再平方。兩者不能互換。Variance 的單位會平方，因此常再取 `SD(X)=√Var(X)`，回到原始單位，才容易和平均值或觀察值比較。這正是 LLM guide 的前兩個概念：辨認同平均、不同 spread，並從定義推回計算公式。

## P3：公平骰子的 variance

令 `X` 為公平六面骰點數，沿用 `E[X]=3.5`、`E[X²]=91/6`：

```text
Var(X) = 91/6 - 3.5² = 35/12 ≈ 2.917
SD(X) = √(35/12) ≈ 1.708
```

`1.708` 是點數相對平均值的典型偏離尺度，不表示每次必定差這麼多，也不是事件機率。

## P4：Bernoulli 與 Binomial 的 variance

```text
Var(Bern(p)) = p(1-p)
Var(Bin(n,p)) = np(1-p)
```

命中率 `0.53` 的單次罰球 variance 是 `0.53×0.47=0.2491`。500 次獨立罰球的命中數則有

```text
Var(Y) = 500 × 0.53 × 0.47 = 124.55
SD(Y) = √124.55 ≈ 11.16
```

二項分布是獨立 Bernoulli 的和，所以 variance 相加。固定 `n` 時，`p(1-p)` 在 `p=1/2` 最大；`p` 接近零或一時結果幾乎固定，spread 反而縮小。

P4 在官方 worksheet 與 answer key 中都有完整內容。先前看似缺題，是 PDF 轉文字跨頁造成的抽取假象，不是 Summer 2026 官方材料缺漏。

## P5：正式認識 Poisson

Poisson random variable 描述固定區間內的事件數。若該區間平均發生 `λ` 次：

```text
X ~ Poi(λ)
P(X=k) = e^(-λ) λ^k / k!,   k=0,1,2,...
E[X] = Var(X) = λ
```

一年平均 `2.79` 次重大地震時，令 `X~Poi(2.79)`：

```text
P(X=3) = e^(-2.79) 2.79³ / 3! ≈ 0.222
P(X=0) = e^(-2.79) ≈ 0.0615
```

Poisson 的平均值與 variance 都是 `λ`，但 standard deviation 是 `√λ`，不要把三者混為同一量。

## P6：Poisson approximation to Binomial

2,000 個 buckets 收到 10,000 個獨立且均勻配置的字串。令 `X` 為第一格的字串數，精確模型是 `Bin(10000,1/2000)`。因 `n` 大、`p` 小且 `np=5`，可近似為 `Poi(5)`：

```text
P(X≤8) ≈ Σ(k=0..8) e^-5 5^k / k! ≈ 0.9319
```

Poisson 把兩個參數壓成 `λ=np`，避開巨大組合數。但必須先說明大 `n`、小 `p` 的條件，不能只看到「計數」就自動套用。

## P7：rate 必須跟 interval 對齊

Web server 平均每秒兩次 hits，一秒內的 `X~Poi(2)`，所以

```text
P(X<5) = Σ(k=0..4) e^-2 2^k / k! ≈ 0.947
```

若改問五秒，參數必須改成 `λ=2×5=10`。Lambda 是「所問區間內的期望事件數」，不是脫離時間單位的常數。先換 interval 再代 PMF，是 LLM guide 特別獨立列出的概念。

## Optional challenge：DNA data storage

DNA strand 有 `10⁴` 個 base pairs，各自獨立以 `10⁻⁶` 的機率損壞：

```text
X ~ Bin(10⁴, 10⁻⁶)
X ≈ Poi(0.01)
P(X≥1) ≈ 1 - e^-0.01 ≈ 0.00995
```

精確 binomial 值約 `0.00995017`，幾乎一致。這題濃縮整講順序：先寫精確模型，再檢查稀有事件近似、算 `λ=np`，最後用零事件的 complement。

## 如何使用 LLM Learning Guide

官方 guide 依序安排六個概念：variance 與 SD、`E[X²]-(E[X])²`、經典分布 variance、Poisson PMF、rate/interval 對齊，以及 binomial 的 Poisson approximation。它要求學生先回答並交出推理，再請模型指出錯誤所在，不是把 worksheet 丟給模型代算。

每題最好留下模型選擇紀錄：隨機變數與單位、獨立假設、`λ` 對應的區間、近似條件。最後再做 guide 的綜合題，同時處理 variance/SD、Poisson rate 換算與大 `n` 小 `p` 的近似。下一講進入 continuous random variables；Poisson 數區間內事件數，之後的 Exponential 則問等到下一事件的時間。

## 材料邊界

- 本文完整覆蓋 worksheet／answer key 的 P1–P7、optional DNA challenge，以及 LLM guide 六個概念。
- P4 沒有缺漏；先前判讀是 PDF 跨頁抽取 artifact。
- Canvas 錄影未公開，不推測其中的額外例子或講者說法。
- Worksheet 與 guide 各僅兩頁，因此採短材料例外：以逐題完整為準，不用通用段落灌長度；仍維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 7: Poisson](https://web.stanford.edu/class/cs109/lectures/7-Poisson)
- [Lecture 7 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture07-Worksheet.pdf)
- [Lecture 7 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture07-AnswerKey.pdf)
- [Lecture 7 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture07-LLMPrompts.pdf)
- [Probability for Computer Science: Poisson](https://probabilitycoders.stanford.edu/spr26/poisson)
