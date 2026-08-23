---
title: "Stanford CS109 Lecture 15｜Adding Random Variables 與 Central Limit Theorem"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 16
tldr: "少數分布的 independent sums 有 closed form；一般 IID sums 則由 CLT 在大樣本下近似 Normal，離散 sums 還需 continuity correction。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 15：IID、convolution、closed-form sums、Normal differences、CLT 與 continuity correction。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-15-central-limit-theorem-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 16 篇，對應 **Summer 2026 Lecture 15: Central Limit Theorem**，日期為 7 月 16 日，講者是 Chris Gregg。本文依當期 [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture15-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture15-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture15-LLMPrompts.pdf)與官方讀本的 [sums of random variables](https://probabilitycoders.stanford.edu/spr26/summation_vars) 及 [CLT](https://probabilitycoders.stanford.edu/spr26/clt) 章節整理。當期投影片連結不可用、Canvas 錄影 gated，因此不重建缺失材料。

Worksheet／answer key 是完整兩頁、P1–P7 加 challenge。Guide 六個 concepts 的主要內容在前兩頁，第三頁只是 wrap-up 延續。這是系列從 L3 進入 **L2** 的第一講：公開題組與讀本足以支持逐題導讀，但不能聲稱重現完整投影片或課堂口述。

## P1：以 Beta belief 複習開場

Subscribe button 給 12 位 visitors 看，九人 click；uniform prior 是 `Beta(1,1)`，所以

```text
X|data ~ Beta(10,4)
E[X] = 10/14 = 5/7 ≈ 0.714
```

這題結束「對 probability 的 belief」，接著轉向多個 random variables 相加後的 distribution。

## P2：三個 closed-form sum families

Independent `Bin(12,0.25)` 與 `Bin(28,0.25)` 可視為共享相同 success probability 的 40 個 Bernoulli trials，因此

```text
X+Y ~ Bin(40,0.25)
```

若兩者 `p` 不同，pooled trials 不再 identically distributed，sum 不是一般 Binomial。Independent Poissons 的 rates 相加：

```text
Poi(2.2)+Poi(3.8)=Poi(6)
P(total=5)=e^-6 6^5/5!≈0.161
```

Independent Normals 的 means 與 variances 都相加：

```text
N(10,9)+N(20,16)=N(30,25)
P(X+Y>40)=1-Φ((40-30)/5)=1-Φ(2)≈0.0228
```

大多數 distributions 不具這種 closure；例如兩個 uniforms 的 sum 是 triangular，不再 uniform。

## P3：Convolution 為什麼是 sum of products

對 independent、nonnegative、discrete `X,Y`：

```text
P(X+Y=n)=Σ(k=0..n)P(X=k)P(Y=n-k)
```

題目 PMFs 中，`X+Y=2` 只有 `(1,1)`、`(2,0)` 有非零 contribution：

```text
P(X+Y=2)=0.3×0.6+0.2×0.4=0.26
```

所有 split ways 互斥，所以 probabilities 相加；independence 讓每個 joint term factor 成 product。Continuous convolution 把 sum 換成 integral，但「列舉所有分割方式」的邏輯相同。

## P4：Normal difference 與 ELO

Team performances 獨立且 `A~N(1650,200²)`、`B~N(1500,200²)`。令 `D=A-B`：

```text
D ~ N(150, 200²+(-1)²200²)
  = N(150,80000)
SD(D)≈282.8
```

差值的 variance 仍相加，因 coefficient `-1` 在 variance 中平方。A 勝率是

```text
P(D>0)=Φ(150/282.8)=Φ(0.53)≈0.70
```

若兩隊 variances 都增加，mean gap 仍是 150，但 z-score 向零縮，A 勝率往 `0.5` 靠近：更多 game-level randomness 增加 upset chance。

## P5：Truncation Error 的 CLT

`Xi~Uniform(0,1)` 被截斷到小數三位，單次 loss `Xi-Yi~Uniform(0,0.001)`。一千次 independent errors 的 sum 依 CLT 近似 Normal：

```text
μ = 1000×0.001/2 = 0.5
σ² = 1000×(0.001)²/12 = 8.33×10^-5
σ ≈ 0.00913
```

因此

```text
P(X-Y>0.51)
≈1-Φ((0.51-0.5)/0.00913)
≈1-Φ(1.10)≈0.137
```

Errors 是 continuous，所以不做 continuity correction。所有 truncation errors 非負，題目若作 two-tailed 解讀，negative tail 也幾乎為零。

## P6：CLT 不只是「很多東西相加」

題目把 Bernoulli、Binomial、Geometric、Uniform、Beta、Exponential 各一個 independent variable 相加。這六項不是 identically distributed，且 `n=6` 很小，因此標準 IID CLT 不適用。Independence 只滿足一半條件；不能看到 sum 就自動宣告 Normal。

Guide 的版本要求 IID、finite variance 與 reasonably large `n`。更一般的 CLTs 有不同條件，但不在本講公開材料範圍，不能拿來替這題改判。

## P7：Rolling Until 300

「至少需要 80 rolls 才超過 300」等價於前 79 rolls 的 sum `S79≤300`。單次 die mean `3.5`、variance `35/12`，所以

```text
S79 ≈ N(79×3.5,79×35/12)
    = N(276.5,230.417)
SD≈15.179
```

因 sum 為 integer-valued，`≤300` 用 boundary `300.5`：

```text
P(S79≤300)
≈Φ((300.5-276.5)/15.179)
=Φ(1.581)≈0.943
```

P7 是 pset5 題，公開 answer key 不刊解答；事件轉寫、CLT parameters 與 continuity correction 都直接來自 worksheet prompt。

## Challenge：30 個 Beta 的 sum

IID `Xi~Beta(4,2)` 有

```text
E[Xi]=2/3
Var(Xi)=4×2/(6²×7)=2/63
```

對 `X=Σ(i=1..30)Xi`，CLT 給出

```text
X≈N(20,20/21),  SD≈0.9759
P(19<X<20)
≈Φ(0)-Φ((19-20)/0.9759)
≈0.347
```

這是 continuous sum，所以不使用 continuity correction。Challenge 也是 pset5 題，公開 key 省略；以上只依 prompt 公式推導。

## 如何使用 LLM Learning Guide

六個 concepts 是 IID、convolution、closed-form sums、Normal differences/ELO、CLT 與 continuity correction。練習順序應先問 sum 是否已有 exact closed form；沒有時才檢查 CLT conditions。若採 Normal approximation，再判斷原 sum 是否 integer-valued，只有離散 bar 需要半格 correction。

## 材料邊界

- 本文覆蓋 P1–P7、optional challenge 與 guide 六個 concepts，題號完整。
- P7、challenge 是 pset5 題，公開 answer key 省略；本文只依公開 prompt 推導。
- 當期投影片 unavailable、錄影 gated；L2 不等於完整 lecture reconstruction。
- Worksheet／answer key 各兩頁，guide 第三頁僅延續收尾。採短材料例外，維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 15: Central Limit Theorem](https://web.stanford.edu/class/cs109/lectures/15-CLT)
- [Lecture 15 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture15-Worksheet.pdf)
- [Lecture 15 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture15-AnswerKey.pdf)
- [Lecture 15 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture15-LLMPrompts.pdf)
- [Probability for Computer Science: Sums of random variables](https://probabilitycoders.stanford.edu/spr26/summation_vars)
- [Probability for Computer Science: Central Limit Theorem](https://probabilitycoders.stanford.edu/spr26/clt)
