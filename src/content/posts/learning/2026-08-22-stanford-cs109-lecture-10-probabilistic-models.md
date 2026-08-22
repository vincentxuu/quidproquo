---
title: "Stanford CS109 Lecture 10｜Probabilistic Models：joint、marginal、independence 與 Bayes"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 11
tldr: "Joint distribution 保存多個變數的完整關係；marginal、conditional、independence 與 Bayes 都是從這份關係表取出不同問題的答案。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 10：joint PMF、marginal、conditioning、independence，以及離散假設配連續 likelihood 的 Bayes。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-10-probabilistic-models-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 11 篇，對應 **Summer 2026 Lecture 10: Probabilistic Models**，日期為 7 月 7 日，講者是 Chris Gregg。本文依 Summer [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture10-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture10-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture10-LLMPrompts.pdf)，以及跨 offering 共用的 Spring-dated 官方讀本 [joint distributions](https://probabilitycoders.stanford.edu/spr26/joint) 與 [inference](https://probabilitycoders.stanford.edu/spr26/inference) 章節整理。Canvas 錄影未公開，因此不重建課堂口述。

本講把「一個 random variable 的分布」擴張到「多個變數如何一起變動」。Joint distribution 是完整起點。把不關心的變數加總掉得到 marginal，以 marginal 正規化一列或一欄得到 conditional。Independence 則問 joint 能否分解成 marginals 的乘積。

## P1：用 Normal 複習開場

IQ-like score `X~N(100,225)` 的第二個參數是 variance，所以 `σ=√225=15`。130 分的 z-score 為二：

```text
P(X>130) = 1-Φ((130-100)/15)
         = 1-Φ(2)
         = 1-0.9772 = 0.0228
```

這題延續上一講對 `σ²`、`σ` 與右尾 complement 的區分，隨後才進入兩個 random variables 的模型。

## P2：讀懂 joint PMF

令 `X` 表示 relationship status，取值為 single (`S`) 或 in a relationship (`R`)；`Y` 表示 class year，取值為 freshman (`Fr`)、sophomore (`So`) 或 junior (`Jr`)。官方表格是：

| `P(X,Y)` | Fr | So | Jr |
|---|---:|---:|---:|
| S | 0.18 | 0.12 | 0.10 |
| R | 0.12 | 0.18 | 0.30 |

六個 cell 都非負，總和是 `1.00`，所以這是有效 joint PMF。Joint probability 可直接讀格子：`P(R,Jr)=0.30`，`P(S,Fr)=0.18`。Junior 的總機率則把該欄相加：`P(Y=Jr)=0.10+0.30=0.40`。

## P3：從 joint 加總出 marginals

對每個固定 `X=x`，把所有可能的 `Y` 加起來：

```text
P(X=S) = 0.18+0.12+0.10 = 0.40
P(X=R) = 0.12+0.18+0.30 = 0.60
```

同理，固定 class year 並跨 relationship status 加總：

```text
P(Y=Fr)=0.30,  P(Y=So)=0.30,  P(Y=Jr)=0.40
```

一般式是 `P(X=x)=Σy P(X=x,Y=y)`。每個 `Y=y` 是互斥且涵蓋所有可能的情況，因此這正是 law of total probability；「marginal」這個名稱也來自把列、欄總和寫在表格邊緣。

## P4：conditioning 與 independence

已知對方是 junior 時，relationship status 為 `R` 的條件機率是

```text
P(X=R | Y=Jr) = P(R,Jr)/P(Y=Jr)
               = 0.30/0.40 = 0.75
```

分母 `0.40` 把 junior 那一欄重新正規化成總和一的 conditional distribution。這不是從表中直接讀 `0.30`；`0.30` 是 joint，`0.75` 才是在已知 junior 後的新樣本空間比例。

若 `X` 與 `Y` 獨立，所有 cell 都必須滿足 `P(x,y)=P(x)P(y)`。只要找到一個反例即可否定：

```text
P(S,Fr)=0.18
P(S)P(Fr)=0.40×0.30=0.12
```

兩者不相等，所以 `X`、`Y` 不獨立。單一 cell 相等只能提供相容證據，不能證明完整 independence；要證明時必須檢查所有取值或用等價的結構理由。

## P5：離散 hidden variable 配連續 likelihood 的 Bayes

令 `Y=1` 表示 baby 能聽見，prior 是 `P(Y=1)=0.75`。播放聲音後的 gaze change `X` 依聽力狀態服從：

```text
X | Y=1 ~ N(15,25)
X | Y=0 ~ N(8,25)
```

觀察到 `X=14`。雖然連續變數的單點機率為零，Bayes 仍能使用該點的 conditional density 作 likelihood：

```text
P(Y=1 | X=14)
= f(14|Y=1)P(Y=1)
  / [f(14|Y=1)P(Y=1)+f(14|Y=0)P(Y=0)]
```

兩個 Normal 有相同 `σ=5`，所以共同的 `1/(σ√(2π))` 在分子、分母消掉。只保留 exponential parts：

```text
f(14|Y=1) ∝ e^[-(14-15)²/50] = e^-0.02 ≈ 0.9802
f(14|Y=0) ∝ e^[-(14-8)²/50]  = e^-0.72 ≈ 0.4868

posterior ≈ 0.75(0.9802)
          / [0.75(0.9802)+0.25(0.4868)]
          ≈ 0.858
```

14 比 8 更靠近 15，因此觀察讓「能聽見」的信念從 prior `0.75` 上升到約 `0.858`。Density 可以超過一，這裡扮演的是相對 likelihood；最後經 denominator 正規化的 posterior 才是機率。

## P6：完整 joint table 為什麼撐不住

20 個 random variables 各有五種取值，每個完整 assignment 都需要一格，總數是

```text
5^20 = 95,367,431,640,625 cells
```

這個指數成長解釋了為何需要 independence assumptions 與 Bayes networks。模型不再逐格儲存完整 joint，而是利用條件獨立性把它 factorize 成較小的 local distributions。P6 是 pset4 題，公開 answer key 刻意不刊解答；數量是依公開題目直接計算。

## Challenge：Tired Baby 的 Exponential likelihood

Prior `P(Tired)=3/4`。若 tired，揉眼等待時間 `t~Exp(3)`；若不 tired，則 `t~Exp(1)`。觀察到兩分鐘才揉眼，以 exponential density `f(t)=λe^-λt` 作 likelihood：

```text
f(2|Tired) = 3e^-6
f(2|not Tired) = e^-2

P(Tired|t=2)
= (3/4)(3e^-6)
  / [(3/4)(3e^-6)+(1/4)e^-2]
≈ 0.142
```

Posterior 從 `0.75` 大幅降到約 `0.142`。`Exp(3)` 的平均等待只有 `1/3` 分鐘，而 `Exp(1)` 是一分鐘；等到兩分鐘才揉眼在 not-tired 模型下相對更合理。Challenge 同樣是 pset4 題，公開 key 不刊解答；另外 PDF 文字抽取會把 prior `3/4` 黏成 `34`，原始排版顯示的是分數。

## 如何使用 LLM Learning Guide

官方 guide 依序涵蓋 joint PMF、marginals、joint 內的 conditioning、independence、random-variable Bayes，以及離散 hypothesis 配連續 density。做題時可反覆用同一張表回答四問：哪一格是 joint、哪個和是 marginal、條件分母是哪個 marginal、joint 是否等於 marginals 乘積。進入 continuous observation 後，只把 PMF likelihood 換成 density，prior、乘法與 normalization 的 Bayes 結構不變。

## 材料邊界

- 本文覆蓋官方 P1–P6、optional tired-baby challenge 與 LLM guide 六個 concept。
- P6 與 challenge 是 pset4 題，公開 answer key 刻意省略解答；本文只依公開題目推導。
- Challenge prior 為 `3/4`；`34` 是 PDF 分數的文字抽取 artifact。
- Canvas 錄影未公開，不推測額外課堂內容。Worksheet 與 guide 各兩頁，採短材料例外；維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 10: Probabilistic Models](https://web.stanford.edu/class/cs109/lectures/10-ProbabilisticModels)
- [Lecture 10 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture10-Worksheet.pdf)
- [Lecture 10 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture10-AnswerKey.pdf)
- [Lecture 10 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture10-LLMPrompts.pdf)
- [Probability for Computer Science: Joint distributions](https://probabilitycoders.stanford.edu/spr26/joint)
- [Probability for Computer Science: Inference](https://probabilitycoders.stanford.edu/spr26/inference)
- [Probability for Computer Science: Bayesian carbon dating](https://probabilitycoders.stanford.edu/spr26/bayesian_carbon_dating)
