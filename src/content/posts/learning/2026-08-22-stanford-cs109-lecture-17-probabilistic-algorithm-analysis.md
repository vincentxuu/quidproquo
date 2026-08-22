---
title: "Stanford CS109 Lecture 17｜Algorithmic Analysis：conditional expectation、indicators 與 recursion"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 18
tldr: "隨機程式的 expected cost 可依第一個 random choice 分情境；計數問題則拆成 indicators，兩者都靠 linearity，而不必硬求完整 distribution。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 17：conditional expectation、total expectation、recursive code、indicator variables、hash collisions 與 coupon collector。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-17-probabilistic-algorithm-analysis-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 18 篇，對應 **Summer 2026 Lecture 17: Algorithmic Analysis**，日期為 7 月 21 日，講者是 Chris Gregg。本文依當期 [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture17-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture17-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture17-LLMPrompts.pdf)與官方讀本的 [algorithmic analysis](https://probabilitycoders.stanford.edu/spr26/algorithmic_analysis) 章節整理。當期投影片 unavailable、Canvas 錄影 gated，因此維持 L2 邊界。

三份 artifacts 都是三頁；正式 agenda 為 P1–P7 加 challenge，題號完整。這講不追求每個 random runtime 的完整 distribution，而是用 conditional expectation、linearity 與 indicators 直接取得 expected value。

## P1：讀懂 bootstrap p-value

Null 下重抽 10,000 次 differences，其中 140 次至少與 observed `2.1` minutes 一樣極端：

```text
p=140/10000=0.014
```

若 UI change 真無效果，類似 experiments 只有約 1.4% 會出現這麼極端的 gap，對 null 是 reasonably strong evidence。這不是 null 為真的 probability。

## P2：從 joint table 算 conditional expectation

Joint table 的 `Y=1` row mass 是 `0.30`，`Y=2` 是 `0.70`。Conditioning 先把 row 正規化，再加權 `X`：

```text
E[X|Y=1]=(0×.15+1×.10+2×.05)/.30=2/3
E[X|Y=2]=(0×.10+1×.30+2×.30)/.70=9/7
```

Law of total expectation 給出

```text
E[X]=(2/3)(.30)+(9/7)(.70)=1.1
```

直接由 marginal `P(X=0,1,2)=(.25,.40,.35)` 也得到 `.40+2(.35)=1.1`。`E[X|Y=y]` 是固定 `y` 下的 number；`E[X|Y]` 則是隨 `Y` 取值的 random variable，而 `E[E[X|Y]]=E[X]`。

## P3：Cache Hierarchy 的 average 與 tail

Browser cache、CDN、origin 的 probabilities／costs 分別是 `(.5,1)`、`(.35,40)`、`(.15,300)`。因此

```text
E[T]=.5(1)+.35(40)+.15(300)=59.5 ms
```

已知 browser-cache miss 後，剩餘 mass 是 `.5`：

```text
E[T|miss]=[.35(40)+.15(300)]/.5=118 ms
```

Mean 59.5 ms 掩蓋了 15% users 等 300 ms 的 tail。Systems latency 若高度 bimodal，percentiles 或完整 distribution 往往比單一 expectation 更接近 user experience。

## P4：Roll Until Big 的 self-referential equation

Die roll 為一或二時累加並繼續，三到六時停止。令 `μ=E[X]`，依第一個 roll conditioning：

```text
μ=(1/6)(1+μ)+(1/6)(2+μ)
  +(1/6)(3+4+5+6)
=3.5+(1/3)μ

μ=5.25
```

這種 equation 的關鍵是 recursive call 的 expected return 仍是同一個 `μ`。P4 是 pset5 題，公開 key 省略；推導只依 worksheet code。

## P5：Analyzing Recursive Code

`mystery()` 四個 equally likely branches 中，一個回傳 2，一個回傳 `1+mystery()`，兩個回傳 `3+mystery()`：

```text
E[Y]=(1/4)2+(1/4)(1+E[Y])+(2/4)(3+E[Y])
    =2.25+.75E[Y]

E[Y]=9
```

Expected recursive calls per invocation 是 `.75<1`，所以 finite solution 合理。若 recursive offspring 的 expectation 至少一，單純解線性式可能沒有 finite expectation；程式也可能不 terminate with probability one 或有 infinite mean work。

## P6：Hash Table 的 indicators

20 keys 獨立均勻進 10 buckets。令 `Bi` 表示 bucket `i` empty。每個 key 避開它的 probability 是 `9/10`：

```text
E[number empty]=Σ(i=1..10)E[Bi]
               =10(9/10)^20≈1.22
```

對每對 keys `(j,k)` 定義 collision indicator `Ijk`。第二個 key match 第一個 bucket 的 probability 是 `1/10`，pairs 有 `C(20,2)=190`：

```text
E[colliding pairs]=190/10=19
```

Indicators 彼此 dependent 不妨礙 expectation，因 linearity `E[ΣIi]=ΣE[Ii]` 不要求 independence。Independence 會在 variance 或 joint probability calculation 才變重要。

## P7：Coupon Collector 的最後幾張最貴

已有 `i` 種 heroes 時，下包抽到新 hero 的 probability 是 `(8-i)/8`。令等待時間

```text
Xi~Geo((8-i)/8),  E[Xi]=8/(8-i)
```

收齊八種的 expected packs：

```text
E[X]=Σ(i=0..7)8/(8-i)
    =8(1+1/2+...+1/8)
    =761/35≈21.7
```

只收集四種則是 `1+8/7+8/6+8/5≈5.08` packs。早期幾乎每包都是新品，最後缺一種時 success probability 只有 `1/8`，單是最後一張就平均需要八包，因此 total cost 由 tail 主導。

## Challenge：Llama-Flu branching recursion

`num_infected()` 以 `.99` probability immune 並回傳零。Nonimmune probability `.01`，此人算一名感染者，再接觸 `K~Bin(100,.25)` 人並對每人 recursive call。令 `μ` 為 expected total infected：

```text
E[K]=25
μ=.99(0)+.01(1+E[K]μ)
 =.01+.25μ

μ=.01/.75=1/75≈0.0133
```

這是 subcritical branching process：每次 invocation 平均產生 `.01×25=.25` 個有效 recursive descendants，小於一，因此 expectation finite。Challenge 是 pset5 題，公開 key 不刊解答；上述 equation 只使用 prompt code。

## 如何使用 LLM Learning Guide

六個 concepts 是 conditional expectation、total expectation、expected runtime、recursive code、indicators 與 coupon collector。程式題先 condition on first random choice，把 recursive call 替換成未知 mean，再解 equation。Counting 題則替每個 object 或 pair 定義 0/1 indicator；只求 expectation 時，不要額外假設 independence。

## 材料邊界

- 本文覆蓋 P1–P7、optional challenge 與 guide 六個 concepts，三頁題號完整。
- P4、challenge 是 pset5 題，公開 answer key 省略；本文只依 worksheet code 推導。
- 當期投影片 unavailable、錄影 gated；L2 不重建缺失 lecture content。
- 材料規模有限，採短材料例外；維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 17: Algorithmic Analysis](https://web.stanford.edu/class/cs109/lectures/17-AlgorithmAnalysis)
- [Lecture 17 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture17-Worksheet.pdf)
- [Lecture 17 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture17-AnswerKey.pdf)
- [Lecture 17 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture17-LLMPrompts.pdf)
- [Probability for Computer Science: Algorithmic analysis](https://probabilitycoders.stanford.edu/spr26/algorithmic_analysis)
