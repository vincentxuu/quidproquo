---
title: "Stanford CS109 Lecture 11｜Inference：prior × likelihood → normalize"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 12
tldr: "Inference 把 hidden variable 的 prior 逐項乘上 observation likelihood，再正規化成 posterior；同一迴圈可處理多次觀察與離散化的連續 belief。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 11：belief tables、Bayes update loop、normalization、多次觀察、discretization 與 indicator likelihood。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-11-inference-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 12 篇，對應 **Summer 2026 Lecture 11: Inference**，日期為 7 月 8 日，講者是 Chris Gregg。本文依 Summer [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture11-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture11-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture11-LLMPrompts.pdf)與跨 offering 共用的 Spring-dated 官方讀本 [inference](https://probabilitycoders.stanford.edu/spr26/inference) 章節整理。Canvas 錄影未公開，因此不重建課堂口述。

原始 worksheet 共兩頁且題號完整：P1–P2 在第一頁，P3–P6 與 challenge 在第二頁。本講的核心不是一條新 Bayes 公式，而是把它變成可重複執行的資料結構與 update loop：

```text
posterior[h] = prior[h] × likelihood(observation | h)
normalize(posterior)
```

## P1：一次 Bayes update

袋子等機率裝著 Fair coin 或 Trick coin；兩者出現 heads 的機率分別為 `0.5` 與 `0.9`。觀察一次 heads 後：

```text
P(Trick | heads)
= P(heads|Trick)P(Trick)
  / [P(heads|Trick)P(Trick)+P(heads|Fair)P(Fair)]
= 0.9(0.5) / [0.9(0.5)+0.5(0.5)]
= 0.45/0.70 ≈ 0.643
```

Heads 在 Trick 模型下較可能，因此 posterior 高於 prior `0.5`。Inference 就是用 observation 對 hidden state 的相對相容度重新分配 belief。

## P2：belief dictionary 與 update loop

Stanford Acuity Test 把 vision ability `A` 離散為三個候選：

| `a` | 0.2 | 0.5 | 0.9 |
|---|---:|---:|---:|
| `P(A=a)` | 0.2 | 0.3 | 0.5 |

讀對字母的機率等於 `a`，所以觀察到讀錯 `Y=0` 時，likelihood 是 `1-a`。逐格相乘得到 unnormalized posterior：

```text
a=0.2: 0.2×0.8 = 0.16
a=0.5: 0.3×0.5 = 0.15
a=0.9: 0.5×0.1 = 0.05
```

總和 `0.36` 是 evidence probability `P(Y=0)`，也是 Bayes denominator。每格除以 `0.36`：

```text
P(A=0.2|Y=0) ≈ 0.444
P(A=0.5|Y=0) ≈ 0.417
P(A=0.9|Y=0) ≈ 0.139
```

錯誤是較低 ability 更常生成的 observation，所以 belief 往低值移動。Dictionary 是 non-parametric representation：它不假定 posterior 必須屬於某個命名分布，只保存各候選值的 mass。

## P3：多次 observations 的兩種算法

下一個較大的字母讀對了，likelihood 是 `a`。以上一題 posterior 作新 prior，相乘再正規化：

```text
0.444×0.2 = 0.0889
0.417×0.5 = 0.2083
0.139×0.9 = 0.1250
sum ≈ 0.4222

posterior ≈ {0.211, 0.493, 0.296}
```

也可從原始 prior 一次乘上「先錯、後對」兩個 likelihood：

```text
0.2(0.8)(0.2)=0.032
0.3(0.5)(0.5)=0.075
0.5(0.1)(0.9)=0.045
```

總和 `0.152`，正規化後仍為 `{0.211,0.493,0.296}`。在 observations 對 hidden ability 條件獨立的假設下，sequential update 與一次乘完完全等價；中間 normalization 只是所有候選共享的常數。

## P4：為什麼要 normalize

Normalization constant 是 observation 的 total probability：

```text
P(obs) = Σa P(A=a)P(obs|a)
```

它把 hidden value `a` 加總掉，因此對每個候選都是同一個正數。除以它後 posterior 才總和為一，才能解讀為 probability distribution。

如果只需要 mode 或 `argmax_a P(A=a|obs)`，可以不 normalize。共同的正數不會改變候選排序，因此直接比較 `prior[a]×likelihood(a)` 即可。但若要報告機率、抽樣、計算 expectation，仍需要完整正規化。

## P5：把 continuous belief 離散化

Bayesian carbon dating 的 sample age `A` 是連續量，但程式把 100 到 10,000 年的整數 ages 當 dictionary keys。每個 entry 近似 `P(A=i|observation)`；格距夠細時，這張表可近似 continuous belief，且仍能沿用逐項乘 likelihood 再 normalize 的相同迴圈。

`calc_likelihood(m, age)` 表示 `P(M=m|A=age)`：若 sample 真有該 age，依 radioactive decay model 觀察到 `m` 個剩餘 C14 molecules 的機率。Likelihood 是把生成模型反過來當作對 candidate age 的評分，不是 `P(age|m)` 本身。

## P6：Mutation Clock 的完整 posterior

Mitochondrial DNA 有 10,000 個 base pairs，每個位置以每年 `r=6.67×10^-6` 的 rate mutation。若 age 是 `t` 年，單一位置到那時至少 mutation 一次的機率，由 Poisson zero-event complement 得到：

```text
p(t) = 1-P(Poi(rt)=0) = 1-e^(-rt)
```

10,000 個 positions 獨立，觀察恰好十個已 mutation，因此

```text
P(X=10|T=t)
= C(10000,10) p(t)^10 [1-p(t)]^9990
```

Prior 在整數 `t∈{0,...,200}` 上 uniform。於是組合常數與 uniform prior 可在 normalization 中消去：

```text
P(T=150|X=10)
= L(150) / Σ(t=0..200)L(t)

L(t)=p(t)^10[1-p(t)]^9990
```

官方題目提供 quick check 約 `0.011`，且 mode 在 `t=150`。P6 是 pset4 題，公開 answer key 刻意不刊完整解答；上述式子只依公開 prompt 建立。

## Challenge：The Baby That Won't Arrive

Delivery day `D` 的 prior PMF 橫跨 due date 前後。今天是 day `-17`，baby 尚未出生。若真實 delivery day `d≤-17`，此 observation 不可能；若 `d>-17`，則完全相容：

```text
P(no baby yet at -17 | D=d) = 1[d>-17]
```

Posterior 就是 prior 乘上 indicator 再正規化。所有 `d≤-17` 的 mass 變為零；其餘日子的相對比例不變，但除以剩餘 mass 後每格都上升。Negative information 並非「沒有資訊」：它排除已不可能的 hidden states，並把其 probability mass 重新分配給仍可能的日期。

## 如何使用 LLM Learning Guide

官方 guide 的六個 concept 是 belief updating、belief-table loop、normalization、multiple observations、continuous-variable discretization，以及從模型讀 likelihood。每次練習都先標出 hidden variable 與 observed variable，再依情境選 indicator、PMF 或 PDF likelihood。完成乘法後分兩路檢查：若只找 mode，可停在 unnormalized values；若要 posterior distribution，必須確認總和回到一。

## 材料邊界

- 本文覆蓋官方 P1–P6、optional due-date challenge 與 LLM guide 六個 concept，跨頁題號完整。
- P6 是 pset4 題，公開 answer key 刻意省略解答；本文只依公開題目建立 likelihood 與 posterior。
- Canvas 錄影未公開，不推測額外課堂內容。
- Worksheet 與 guide 各兩頁，採短材料例外；以逐題完整為準，維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 11: Inference](https://web.stanford.edu/class/cs109/lectures/11-Inference)
- [Lecture 11 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture11-Worksheet.pdf)
- [Lecture 11 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture11-AnswerKey.pdf)
- [Lecture 11 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture11-LLMPrompts.pdf)
- [Probability for Computer Science: Inference](https://probabilitycoders.stanford.edu/spr26/inference)
- [Probability for Computer Science: Bayesian carbon dating](https://probabilitycoders.stanford.edu/spr26/bayesian_carbon_dating)
- [Probability for Computer Science: Baby delivery](https://probabilitycoders.stanford.edu/spr26/prob_baby_delivery)
