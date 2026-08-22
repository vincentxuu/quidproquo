---
title: "Stanford CS109 Lecture 8｜Continuous Random Variables：PDF、CDF、Uniform 與 Exponential"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 9
tldr: "連續變數的單點機率為零，區間機率是 PDF 面積；CDF、Uniform 與 Exponential 則把面積、等待時間與 memorylessness 串起來。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 8：PDF、CDF、Uniform、Exponential、minimum 與 memorylessness。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-08-continuous-random-variables-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 9 篇，對應 **Summer 2026 Lecture 8: Continuous Random Variables**，日期為 7 月 2 日，講者是 Chris Gregg。本文依 Summer [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture08-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture08-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture08-LLMPrompts.pdf)及跨 offering 共用的 Spring-dated 官方讀本 [continuous](https://probabilitycoders.stanford.edu/spr26/continuous)、[uniform](https://probabilitycoders.stanford.edu/spr26/uniform)與 [exponential](https://probabilitycoders.stanford.edu/spr26/exponential) 章節整理。Canvas 錄影未公開，因此不重建課堂口述。

從離散轉到連續，關鍵不是把加總符號換成積分符號而已。PMF 把機率直接放在一個個值上；PDF 是每單位長度的密度，真正的機率來自區間下的面積：

```text
P(a≤X≤b) = ∫[a,b] f(x) dx
F(a) = P(X≤a) = ∫[-∞,a] f(x) dx
```

## P1：先從 Poisson counts 接回來

靈長類研究者每天平均收集 15 份可用樣本，令 `X~Poi(15)`。正好十份的機率是

```text
P(X=10) = e^-15 15^10 / 10! ≈ 0.0486
E[X] = Var(X) = 15
```

這題替後面的 Exponential 鋪路：Poisson 問固定時間內發生幾次；Exponential 問下一次事件還要等多久。兩者的 rate 必須使用一致的時間單位。

## P2：Uniform、單點機率與高維邊界

若 `X~Uniform(0,1)`，密度在整段上都是一，因此 `P(a≤X≤b)=b-a`。但 `P(X=0.5)=0`：單點的寬度為零，密度下沒有面積。這不表示 `0.5` 不可能成為輸出，而是任何一個精確實數都不能獨占正機率。

對 `X~Uniform(5,7)`，PDF 是

```text
f(x) = 1/2,  5≤x≤7
       0,    otherwise
P(5.5≤X≤6) = (6-5.5)/(7-5) = 0.25
```

P2(c) 把簡單 uniform 推到 100 維。單一座標落在 `<0.01` 或 `>0.99` 的機率為 `0.02`。100 個座標獨立時，至少一個靠近邊界的機率用 complement：

```text
1 - (1-0.02)^100 = 1 - 0.98^100 ≈ 0.867
```

一維中邊緣只佔很窄的部分，高維中卻有約 86.7% 的點至少碰到一個邊緣區。Worksheet 把這稱為 curse of dimensionality：維度增加後，低維的空間直覺會快速失效。

## P3：從零建立 PDF 與 CDF

題目給出

```text
f(x) = c(2-2x²),  -1<x<1
       0,          otherwise
```

有效 PDF 必須非負且總面積為一。由 `∫[-1,1](2-2x²)dx=8/3`，得到 `c=3/8`。對 `-1<a<1`，從 support 左端積到 `a`：

```text
F(a) = ∫[-1,a] (3/8)(2-2x²) dx
     = 1/2 + 3a/4 - a³/4
F(0.5) = 27/32 = 0.84375
```

完整 CDF 在 `a≤-1` 時是零，在 `a≥1` 時是一。對中段微分也會回到 `F'(a)=f(a)`。P3 是 pset3 題，因此官方 answer key 只標示「problem set problem」而不刊解；上面的數值是依公開題目直接推導，不是假稱 answer key 的內容。

## P4：PDF 不是 PMF

PDF 的值可以大於一，因為密度本身不是機率。例如 `Uniform(0,0.5)` 的密度是二，但總面積仍是 `2×0.5=1`。真正必須介於零與一的是積分得到的機率。

連續變數任一單點都有

```text
P(X=c) = ∫[c,c] f(x) dx = 0
```

所以區間端點包不包含不影響答案：`P(a≤X≤b)=P(a<X<b)`。將 PDF 對整個 support 積分必須得到一，對應總體事件的機率。這三項正是 LLM guide 前兩個 concept 的是非檢查與正規化練習。

## P5：Exponential 等待時間

規模 8.0 以上地震的 rate 是每年 `λ=0.002`，令 `Y~Exp(0.002)` 表示等到下一次的年數：

```text
f(y) = 0.002e^(-0.002y),  y≥0
F(y) = 1-e^(-0.002y)
```

未來 30 年內發生的機率是

```text
P(Y≤30) = 1-e^(-0.002×30) = 1-e^-0.06 ≈ 0.0582
```

Exponential 的平均值與 standard deviation 都是 `1/λ=500` 年。這不保證下一次要等五百年，而是整個等待時間分布的中心與 spread 尺度。

## P6：用 CDF 避免重複積分

對 `X~Exp(1)`，`F(x)=1-e^-x`。三種常見事件可直接翻成 CDF：

```text
P(X<2) = F(2) = 1-e^-2 ≈ 0.865
P(X>1) = 1-F(1) = e^-1 ≈ 0.368
P(1<X<2) = F(2)-F(1) = e^-1-e^-2 ≈ 0.233
```

規則很簡單：左尾用 `F`，右尾用 `1-F`，中間區間用右端 CDF 減左端 CDF。連續變數的端點機率為零，所以 `<` 與 `≤` 不造成差異。

## P7：兩個 Exponential 的 minimum

令獨立的 `X,Y~Exp(1)`，並令 `L=min(X,Y)`。要讓較早的等待時間仍大於二，兩個都必須大於二：

```text
P(L>2) = P(X>2,Y>2)
       = e^-2 × e^-2 = e^-4
P(L≤2) = 1-e^-4 ≈ 0.9817
```

結果也顯示 `L~Exp(2)`：兩個 rate-one 過程競賽時，最先抵達的總 rate 是二。這個結論依賴獨立性；若兩個等待時間共用原因，不能直接把 survival probabilities 相乘。

## Challenge：Exponential 的 memorylessness

對 `X~Exp(λ)`，已經等了 `s` 仍未發生後，再等超過 `t` 的條件機率為

```text
P(X>s+t | X>s)
= P(X>s+t) / P(X>s)
= e^[-λ(s+t)] / e^(-λs)
= e^(-λt)
= P(X>t)
```

已等待多久不改變剩餘等待時間的分布，這就是 memorylessness。以地震模型而言，即使已經很久沒出現重大地震，模型下仍預期再等 `1/λ=500` 年。這是模型性質，不是對真實地質機制的無條件斷言；採用 Exponential 模型本身就等於接受 constant hazard 的假設。

## 如何使用 LLM Learning Guide

官方 guide 依序涵蓋 PMF 到 PDF、面積與正規化、CDF、Uniform、Exponential、memorylessness。先自行完成「PDF 能否大於一」「如何求正規化常數」「rate 單位是否一致」等 test，再把推理交給模型逐步批改。最後的 wrap-up 同時要求正規化 PDF、推導 CDF、計算 Uniform/Exponential 機率並使用 memorylessness，適合作為是否真正串起六個概念的檢查。

## 材料邊界

- 本文覆蓋 worksheet／answer key 的 P1–P7、optional challenge，以及 LLM guide 六個概念。
- P3 是 pset3 題，官方 answer key 刻意省略解答；本文只依公開題目自行推導。
- Canvas 錄影未公開，不推測其中額外例子或講者說法。
- Worksheet 與 guide 各僅兩頁，採短材料例外，以逐題完整為準，不用通用段落灌長度；維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 8: Continuous Random Variables](https://web.stanford.edu/class/cs109/lectures/8-Continuous)
- [Lecture 8 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture08-Worksheet.pdf)
- [Lecture 8 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture08-AnswerKey.pdf)
- [Lecture 8 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture08-LLMPrompts.pdf)
- [Probability for Computer Science: Continuous random variables](https://probabilitycoders.stanford.edu/spr26/continuous)
- [Probability for Computer Science: Uniform](https://probabilitycoders.stanford.edu/spr26/uniform)
- [Probability for Computer Science: Exponential](https://probabilitycoders.stanford.edu/spr26/exponential)
