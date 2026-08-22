---
title: "Stanford CS109 Lecture 13｜Multinomial：多類別計數、bag of words 與 log probability"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 14
tldr: "Multinomial 把 binomial 的兩類計數推廣到多類；同一 PMF 也能把文件視為 word counts，配 Bayes 與 log-score 做 authorship inference。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 13：multinomial coefficient、joint PMF、marginal binomial、bag of words、Bayes 與 log probabilities。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-13-multinomial-distribution-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 14 篇，對應 **Summer 2026 Lecture 13: Multinomial**，日期為 7 月 14 日，講者是 Chris Gregg。本文依 Summer [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture13-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture13-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture13-LLMPrompts.pdf)與跨 offering 共用的 Spring-dated 官方讀本 [multinomial](https://probabilitycoders.stanford.edu/spr26/multinomial) 及 [Federalist Papers](https://probabilitycoders.stanford.edu/spr26/federalist) 章節整理。Canvas 錄影未公開，因此不重建課堂口述。

正式 worksheet 與 answer key 都是兩頁、P1–P6 加 challenge，題號完整。LLM guide 雖顯示第三頁，但該頁只有前頁延續的收尾句與頁碼，沒有第七個 concept 或額外 agenda。

## P1：以兩節點 network 複習 inference

Bayesian network 是 `Overloaded→Slow`，其中 `P(Overloaded=1)=0.1`、`P(Slow=1|Overloaded=1)=0.95`、`P(Slow=1|Overloaded=0)=0.2`。因此

```text
P(Overloaded=1,Slow=0)=0.1×0.05=0.005
```

Slow 的 marginal 是 `0.95(0.1)+0.2(0.9)=0.275`，所以

```text
P(Overloaded=1|Slow=1)
= 0.095/0.275 = 19/55 ≈ 0.345
```

若用 rejection sampling，只保留 `Slow=1` 的 joint samples，再計算其中 `Overloaded=1` 的比例。這題把上一講的 factorization、Bayes 與 sampling 接到同一個小模型。

## P2：有重複類型的排列數

DNA fragment 共 12 個 positions，包含四個 A、三個 C、兩個 G、三個 T。若所有物件不同會有 `12!` 種排列，但相同 nucleotide 彼此交換不產生新 sequence，因此

```text
C(12;4,3,2,3)
= 12!/(4!3!2!3!)
= 277,200
```

每個 position 獨立均勻取四種 bases 時，一個特定 sequence 的機率是 `(1/4)^12`。把所有符合 counts 的 mutually exclusive sequences 加起來：

```text
P(counts 4,3,2,3)
= 277,200(1/4)^12
≈ 0.0165
```

Multinomial PMF 的結構就在這裡出現：一個特定 ordering 的機率，乘上符合相同 counts 的 ordering 數。

## P3：Load Balancing 的 joint PMF

十個 requests 獨立地以 `0.5`、`0.3`、`0.2` 送往三個 data centers。令各中心 counts 為 `(X1,X2,X3)`：

```text
(X1,X2,X3) ~ Multinomial(10;0.5,0.3,0.2)

P(X1=c1,X2=c2,X3=c3)
= 10!/(c1!c2!c3!) × 0.5^c1 0.3^c2 0.2^c3
```

公式只在 nonnegative counts 滿足 `c1+c2+c3=10` 時成立。恰好 `(5,3,2)` 的機率是

```text
10!/(5!3!2!) × 0.5^5 0.3^3 0.2^2
≈ 0.0851
```

使用 Multinomial 的假設是固定 trials 數、trial 彼此獨立、每次恰落在一個類別，且 category probabilities 每次相同。Without-replacement 抽牌會破壞相同機率與獨立假設。

## P4：Loot Boxes 與 marginal Binomial

八個 loot boxes 的 common、rare、legendary 機率是 `0.6`、`0.3`、`0.1`。恰好 `(4,3,1)` 的機率為

```text
8!/(4!3!1!) × 0.6^4 0.3^3 0.1
≈ 0.0980
```

如果只看 legendary count，就把 categories 重新上色為「legendary」與「其他」。於是 marginal count

```text
Xlegendary ~ Bin(8,0.1)
P(Xlegendary=1)=C(8,1)0.1(0.9)^7≈0.383
```

一般而言，每個 `Xi~Bin(n,pi)`。但不同 counts 不是 independent，因為它們必須總和為固定的 `n`；某類多一個，其他類合計就少一個。

## P5：Midterm Rooms 的大型 expression

三百位 students 獨立地以 `0.3`、`0.2`、`0.5` 分配至三間 rooms。恰好 `(90,60,150)` 的機率是

```text
300!/(90!60!150!) × 0.3^90 0.2^60 0.5^150
```

官方允許保留 unevaluated expression；answer key 提供約 `0.00306` 的數值提示。直接計算巨大 factorial 與極小 powers 容易 overflow／underflow，這正替 P6 的 log computation 鋪路。

## P6：bag of words 做 authorship inference

匿名 pamphlet 的三個 word counts 是 `upon:2`、`whilst:1`、`commerce:3`，候選 authors H、M 的 priors 相等。在 bag-of-words model 中：

```text
P(H|doc) ∝ P(H) × ∏i P(word_i|H)^n_i
```

Multinomial coefficient 只由 document counts 決定，對 H、M 相同，所以 posterior comparison 中會消去。題目未列、且兩位 authors 機率相同的 words 也只貢獻共同 factor。

大量微小 probabilities 相乘會 underflow 成 floating-point zero。取 log 後用 `log(ab)=log a+log b`、`log(a^n)=n log a`，product 變成穩定的 sum。因 log 單調遞增，score 排序不變：

```text
H: 2ln(0.005)+ln(0.0001)+3ln(0.002) ≈ -38.45
M: 2ln(0.0005)+ln(0.001)+3ln(0.003) ≈ -39.54
```

H 的 log-score 較大，也就是較不負。差值約 `1.09`，likelihood ratio 是 `e^1.09≈3`，所以 H 約為 M 的三倍可能。

## Challenge：Multinomial 如何包含 Binomial

當 `r=2`，令 `X1=k`、`X2=n-k`、`p2=1-p1`：

```text
P(X1=k,X2=n-k)
= n!/[k!(n-k)!] × p1^k(1-p1)^(n-k)
= C(n,k)p1^k(1-p1)^(n-k)
```

這正是 `Bin(n,p1)` PMF。對一般 `r`，若只關心 `Xi`，將每次 trial 重分成「type i」與「anything else」，success probability 就是 `pi`，因此 `Xi~Bin(n,pi)`。這個 recoloring argument 比展開所有其他 counts 再加總更直接。

## 如何使用 LLM Learning Guide

官方 guide 六個 concept 是 multinomial coefficient、joint PMF、適用假設、marginal Binomial、bag of words authorship，以及 log probabilities。練習時先檢查 counts 與 probabilities 是否各自總和正確，再把「ordering 數 × one-ordering probability」寫成兩行。文本題則先刪除跨 authors 相同的 factors，最後才進 log domain 比較 scores。

## 材料邊界

- 本文覆蓋正式 P1–P6、optional challenge 與 LLM guide 六個 concept，沒有跨頁缺題。
- Guide 的第三頁只有收尾文字與頁碼，不代表額外 concept。
- Canvas 錄影未公開，不推測額外課堂內容。
- Worksheet 與主要 guide 內容各兩頁，採短材料例外；維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 13: Multinomial](https://web.stanford.edu/class/cs109/lectures/13-Multinomial)
- [Lecture 13 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture13-Worksheet.pdf)
- [Lecture 13 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture13-AnswerKey.pdf)
- [Lecture 13 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture13-LLMPrompts.pdf)
- [Probability for Computer Science: Multinomial](https://probabilitycoders.stanford.edu/spr26/multinomial)
- [Probability for Computer Science: Federalist Papers](https://probabilitycoders.stanford.edu/spr26/federalist)
