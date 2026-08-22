---
title: "Stanford CS109 Lecture 18｜Information Theory：surprise、entropy、information gain 與 KL"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 19
tldr: "Surprise 把低機率事件轉成 bits；entropy 是 expected surprise，information gain 選擇最能降低 uncertainty 的問題，KL 則量化錯用 model distribution 的額外代價。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 18：self-information、entropy、expected information gain、KL divergence 與 distribution comparison。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-18-information-theory-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 19 篇，對應 **Summer 2026 Lecture 18: Information Theory**，日期為 7 月 22 日，講者是 Chris Gregg。本文依當期 [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture18-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture18-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture18-LLMPrompts.pdf)與官方讀本的 [information theory](https://probabilitycoders.stanford.edu/spr26/information_theory) 章節整理。當期投影片 unavailable、Canvas 錄影 gated，因此維持 L2 邊界。

這講的 artifacts 有刻意的 agenda 差異。worksheet／key 是兩頁、正式 P1–P5，沒有 P6 或 challenge。guide 則是三頁六 concepts，另含 entropy code、KL divergence 與 distribution comparisons。本文依各自材料涵蓋，不把 guide topics 虛構成 worksheet 題號。

## P1：Recursive Expectation 複習

`retry()` 以 `.5` probability 成功並回傳四秒，否則先花兩秒再 recursive retry。令 `μ=E[T]`：

```text
μ=.5(4)+.5(2+μ)=3+.5μ
μ=6 seconds
```

這題延續 total expectation，接著課程用 expectation 定義 entropy。

## P2：Surprise 為什麼用 log

Event information content 是

```text
I(E)=log2(1/P(E))=-log2 P(E)
```

抽到 ace of spades 的 surprise 是 `log2 52≈5.70 bits`。Probability-one event 則是 `log2 1=0` bits：已確定發生的事不帶新資訊。

Independent events 滿足 `P(E∩F)=P(E)P(F)`，所以

```text
I(E∩F)=log2[1/(P(E)P(F))]
      =I(E)+I(F)
```

Log 把 independent probability products 轉成 additive surprise；兩次獨立的同樣 shock 會貢獻兩倍 bits。

## P3：Entropy 是 expected surprise

```text
H(X)=Σx P(x)log2(1/P(x))=-Σx P(x)log2 P(x)
```

Fair coin entropy 是一 bit；`Bern(0.9)` 則為

```text
-.9log2(.9)-.1log2(.1)≈0.469 bits
```

Biased coin 較可預測，因此 entropy 較低。對 PMF `(1/2,1/4,1/8,1/8)`：

```text
H=(1/2)(1)+(1/4)(2)+(1/8)(3)+(1/8)(3)=1.75 bits
```

八個 values 中，uniform distribution entropy 最大，為 `log2 8=3 bits`。Code 計算時跳過 zero-probability entries，採 convention `0 log 0=0`，避免對零取 log。

## P4：Diagnostic test 要比 expected remaining entropy

Root-cause prior 是 frontend `1/2`、backend `1/4`、database `1/8`、network `1/8`，原 entropy `1.75 bits`。

Test A 問是否 frontend。Yes probability `1/2`，remaining entropy 零；No probability `1/2`，conditional PMF 是 `(1/2,1/4,1/4)`，entropy `1.5`：

```text
E[remaining H|A]=.5(0)+.5(1.5)=.75
gainA=1.75-.75=1.0 bit
```

Test B 把 `{frontend,backend}` 與 `{database,network}` 分開。Yes probability `3/4`，conditional `(2/3,1/3)` entropy約 `.918`；No probability `1/4`，conditional fair split entropy一：

```text
E[remaining H|B]=.75(.918)+.25(1)≈.939
gainB≈.811 bits
```

因此 A 較好。Test answer 尚未知道，是 random variable；不能只挑 best-case branch 或機械追求 outcomes 數量各半，必須以 answer probabilities 加權 remaining entropy。

## P5：Two Dice, Two Hints

若已知第一顆 die 是一，sum `X` 在 2 到 7 均勻，因此

```text
H1(X)=log2 6≈2.58496
```

若只知 `X≤7`，conditional sum probabilities 依 ways 數為 `(1,2,3,4,5,6)/21`：

```text
H2(X)=-Σ(i=1..6)(i/21)log2(i/21)
     ≈2.39830

H1-H2≈0.18666 bits
```

第一個 hint 留下 uniform 六種 sums，反而比 `X≤7` 的 skewed conditional distribution 更 uncertain。P5 是 pset5 題，公開 key 省略；計算只依 worksheet prompt。

## Guide unit：用 code 選 information-gain question

對 dictionary PMF，entropy loop 是 `H -= p*log2(p)`，略過 `p=0`。對 yes/no question，先按答案 partition possible values，求每個 answer probability 與 normalized conditional PMF，再加總

```text
expected_remaining = Σa P(answer=a)H(X|answer=a)
gain = H(X)-expected_remaining
```

Decision tree 或 Wordle solver 的 core loop 就是對 candidate questions 重複這個 score，選 gain 最大者。這是 guide 支持的實作概念，不是 worksheet P6。

## Guide unit：KL divergence 與 cross-entropy

Reality 為 `P`、model 為 `Q` 時，使用 `Q` code 所付出的 expected excess surprise 是

```text
D_KL(P||Q)=Σx P(x)log[P(x)/Q(x)]
```

它非負，且只在 `P=Q` 時為零；但不 symmetric，所以不是 distance。若某個 `P(x)>0` 而 `Q(x)=0`，model 宣告真實可能事件不可能，divergence 為 infinity。

例如 `P=(.5,.5)`、`Q=(.75,.25)`，base-2 KL 兩個方向約為

```text
D(P||Q)≈0.208 bits
D(Q||P)≈0.189 bits
```

Cross-entropy `H(P,Q)=H(P)+D_KL(P||Q)`，因此最小化 cross-entropy 等價於讓 predicted distribution 靠近 data distribution（當 `H(P)` 固定）。這連到後面的 classifier losses。

## Guide unit：三種 distribution comparisons

Total variation 看所有 event probabilities 最大可差多少，discrete form 是 `0.5Σ|P-Q|`。Earth mover's distance 在有 meaningful geometry／ordering 的 support 上問搬動 probability mass 的最小成本。KL 則以 reality-weighted excess surprise 評分 probabilistic model，direction 必須寫清楚。

Weather forecast、Poisson fit 或 language-model next-token prediction 常自然使用 cross-entropy／KL。位置 distribution 若「錯五公里」與「錯五百公里」應有不同成本，earth mover's geometry 更合適。官方 guide 只要求概念比較，本文不延伸未公開的演算法細節。

## 如何使用 LLM Learning Guide

六個 concepts 是 surprise、entropy、information gain、entropy code、KL divergence 與 distribution comparison。每題先標示 log base 與 units，再判斷 expectation 是對哪個 distribution 取。Question selection 要加權所有 answers；KL 要先說明哪個是 reality `P`、哪個是 model `Q`，不能因公式相似而交換方向。

## 材料邊界

- 正式 worksheet agenda 是 P1–P5，沒有 P6／challenge；guide 六個 concepts 另含 code、KL 與 comparisons。
- P5 是 pset5 題，公開 answer key 省略；本文只依 prompt 計算。
- 當期投影片 unavailable、錄影 gated；L2 不重建缺失 lecture content。
- 材料規模有限，採短材料例外；維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 18: Information Theory](https://web.stanford.edu/class/cs109/lectures/18-InformationTheory)
- [Lecture 18 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture18-Worksheet.pdf)
- [Lecture 18 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture18-AnswerKey.pdf)
- [Lecture 18 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture18-LLMPrompts.pdf)
- [Probability for Computer Science: Information theory](https://probabilitycoders.stanford.edu/spr26/information_theory)
