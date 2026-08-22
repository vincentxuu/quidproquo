---
title: "Stanford CS109 Lecture 14｜Beta：把未知 probability 變成可更新的 random variable"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 15
tldr: "Beta distribution 表示對未知成功率的完整 belief；success/failure data 只需更新兩個參數，便能取得 posterior、平滑估計與 Thompson-sampling decision。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 14：Beta posterior、conjugacy、mean/mode/variance、Laplace smoothing、CDF 與 Thompson sampling。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-14-beta-distribution-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 15 篇，對應 **Summer 2026 Lecture 14: Beta**，日期為 7 月 15 日，講者是 Chris Gregg。本文依 Summer [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture14-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture14-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture14-LLMPrompts.pdf)與跨 offering 共用的 Spring-dated 官方讀本 [Beta](https://probabilitycoders.stanford.edu/spr26/beta) 章節整理。Canvas 錄影未公開，因此不重建課堂口述。

Worksheet 與 answer key 是完整兩頁、P1–P7 加 challenge。Guide 有六個 concepts；名義上的第三頁只延續 wrap-up 與結語，不是額外單元。本講的重要轉換是：成功率不再只是一個固定但未知的數，而是 support 在 `[0,1]` 上的 random variable。

## P1：用 Multinomial 複習開場

公平六面骰擲五次，恰好兩次 3、兩次 5、一次 6。其他三個 faces 的 counts 為零，因此

```text
P = 5!/(2!2!1!) × (1/6)^2(1/6)^2(1/6)
  = 30/7776
  ≈ 0.00386
```

零 counts 的 factors 是 `0!=1` 與 `(1/6)^0=1`，不需額外寫出。這題收束 Multinomial，下一題則把未知 category probability 本身視為 belief distribution。

## P2：Robot Gripper 的 Beta posterior

Gripper 每次成功 probability 為 `X`。觀察前採 `Uniform(0,1)=Beta(1,1)`；八次中六次成功、兩次失敗。Beta–Bernoulli conjugacy 直接更新：

```text
X|data ~ Beta(1+6,1+2) = Beta(7,3)
```

對 `Beta(a,b)`，mean 是 `a/(a+b)`，而 `a,b>1` 時 mode 是 `(a-1)/(a+b-2)`：

```text
E[X] = 7/10 = 0.7
mode = 6/8 = 0.75
```

Frequentist estimate 也是 `6/8=0.75`；posterior mean 被 prior mean `0.5` 拉回到 `0.7`。PDF 在 `[0,1]` 上有單峰、peak 在 `0.75`，左側 tail 較長，因此不對稱。相同 observed rate 若來自八次或八千次，point estimate 看不出 certainty 差異；Beta 的 concentration `a+b` 會反映差異。

## P3：一般 Beta prior、conjugacy 與 Laplace smoothing

Delivery drone prior 是 `Beta(4,2)`，本週三次成功、五次失敗：

```text
posterior = Beta(4+3,2+5) = Beta(7,7)
```

這個 posterior 對稱，mean 為 `1/2`。將 `Beta(a,b)` 相對 uniform prior 解讀時，`a-1`、`b-1` 像 imagined successes/failures；所以 `Beta(4,2)` 相當於三次 imagined success 與一次 imagined failure。

Laplace smoothing 使用 `Beta(2,2)`。觀察 `n` 次中的 `s` successes 後，posterior 是 `Beta(2+s,2+n-s)`，mode 為

```text
(s+1)/(n+2)
```

即使 `s=0` 或 `s=n`，estimate 也不會直接落在零或一。這避免小樣本下把尚未見過的 outcome 認定為不可能。

## P4：Puppy Training 的 posterior variance

Uniform prior 加上三次 success、一次 failure，得到 `Beta(4,2)`。Beta variance 為

```text
Var(X) = ab / [(a+b)^2(a+b+1)]
       = 4×2 / (6²×7)
       = 2/63 ≈ 0.0317
```

Variance 衡量的是對 success probability 本身的不確定性，不是下一隻 puppy 成功與否的 Bernoulli variance。更多 observations 會增加 `a+b`，通常使 posterior 更集中。

## P5：Street Parking 的 belief update

十個 IID parking spots 中一個 open、九個 full。Uniform prior `Beta(1,1)` 更新為

```text
X|data ~ Beta(2,10)
E[X] = 2/12 = 1/6
```

Observed rate 是 `1/10`，posterior mean 則是 `1/6`，因 prior 提供一個 imagined success 與 failure。這個差距不是算錯，而是小樣本下 prior shrinkage 的結果。

## P6：Medicine posterior 與 Beta CDF

九位 patients 中七位出現 desired effect；uniform prior 因此得到

```text
p|data ~ Beta(8,3)
```

題目問真正 effect probability 超過 `0.6` 的 posterior probability。它不是把 mean 與 `0.6` 比較，而是積分 posterior density 的右尾：

```text
P(p>0.6|data) = 1-F_Beta(0.6;8,3)
```

實作可用 `1 - stats.beta.cdf(0.6, 8, 3)`。P6 是 pset4 題，公開 answer key 不刊解答；distribution 與 CDF expression 只依 worksheet 推導。

## P7：Thompson Sampling 的 exploration

Drug A 有六次 success、兩次 failure；Drug B 有一次 success、一次 failure，兩者都從 uniform prior 開始：

```text
pA ~ Beta(7,3),  E[pA]=0.7
pB ~ Beta(2,2),  E[pB]=0.5
```

一輪 Thompson sampling 各從兩個 posterior 抽一個 plausible success rate，再選 sample 較大的 drug。觀察結果後，替被選 drug 的 Beta parameters 加 success 或 failure。A 的 mean 較高，但 B 的 data 很少、posterior 較寬，偶爾會抽出高值而被選中。這讓演算法利用目前較佳的 A，同時探索仍有高潛力但不確定的 B。

P7 同樣是公開 key 省略的 pset4 題。官方 worksheet 與 guide 支持上述 algorithm 與 exploration/exploitation 解釋，但沒有固定 random draw，因此不存在唯一的「下一次必選哪個」答案。

## Challenge：Beta 的兩個基本事實

Beta PDF 是

```text
f(x)=x^(a-1)(1-x)^(b-1)/B(a,b),  0≤x≤1
```

令 `a=b=1` 時，numerator 是一，且 `B(1,1)=∫[0,1]1dx=1`，所以密度在 `[0,1]` 恒為一，正是 `Uniform(0,1)`。

若 coin heads probability `X~Beta(a,b)`，下一次 heads 的 predictive probability 依 law of total probability：

```text
P(heads)=∫[0,1]P(heads|X=x)f(x)dx
        =∫[0,1]x f(x)dx
        =E[X]=a/(a+b)
```

Posterior mean 不只是一個 summary；在 squared-error point prediction 或下一次 Bernoulli outcome 的 predictive probability 中，它有直接決策意義。

## 如何使用 LLM Learning Guide

Guide 前三個 concept 是 probability-as-random-variable、continuous-parameter Bayes，以及 uniform-plus-data 得到 Beta。後三個是 Beta shape／moments、conjugacy／Laplace smoothing，以及 CDF decisions／Thompson sampling。練習時把 `a,b` 分別寫成 prior counts 加 observed counts，接著分清 mean、mode、variance 與 tail probability 回答的是不同問題。Decision 題最後再說明 posterior uncertainty 如何影響選擇，而不只比較 means。

## 材料邊界

- 本文覆蓋 P1–P7、optional challenge 與 LLM guide 六個 concept，題號完整。
- P6、P7 是 pset4 題，公開 answer key 刻意省略；本文只依公開 worksheet／guide 推導。
- Guide 第三頁僅為 wrap-up 延續與結語，不是額外 concept。
- Canvas 錄影未公開。Worksheet 與主要 guide 內容各兩頁，採短材料例外；維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 14: Beta](https://web.stanford.edu/class/cs109/lectures/14-Beta)
- [Lecture 14 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture14-Worksheet.pdf)
- [Lecture 14 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture14-AnswerKey.pdf)
- [Lecture 14 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture14-LLMPrompts.pdf)
- [Probability for Computer Science: Beta](https://probabilitycoders.stanford.edu/spr26/beta)
