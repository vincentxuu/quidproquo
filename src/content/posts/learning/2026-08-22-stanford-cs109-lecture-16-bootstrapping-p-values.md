---
title: "Stanford CS109 Lecture 16｜Bootstrapping：sampling statistics、error bars 與 p-values"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 17
tldr: "Bootstrap 把 sample histogram 當作 population proxy，以 replacement 重抽並重算 statistic，近似 estimator 的 sampling distribution、error bar 與 null p-value。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 16：sample variance、standard error、bootstrap algorithm、median uncertainty、null hypothesis 與 p-values。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-16-bootstrapping-p-values-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 17 篇，對應 **Summer 2026 Lecture 16: Bootstrapping**，日期為 7 月 20 日，講者是 Chris Gregg。本文依當期 [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture16-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture16-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture16-LLMPrompts.pdf)與官方讀本的 [bootstrapping](https://probabilitycoders.stanford.edu/spr26/bootstrapping) 及 [samples](https://probabilitycoders.stanford.edu/spr26/samples) 章節整理。當期投影片 unavailable、Canvas 錄影 gated，因此維持 L2 邊界。

Worksheet、answer key、guide 都是三頁；正式 agenda 是 P1–P6 加 challenge，沒有 orphan page 或跨頁缺號。核心分界是：sample distribution 描述 data 的 spread，sampling distribution 描述「重做整個 experiment 時 statistic 會怎麼變」，error bars 要描述後者。

## P1：用 CLT 複習 checkout totals

一百筆 IID checkout item counts 各有 mean 3、variance 4。總和 `S` 依 CLT：

```text
S ≈ N(100×3,100×4)=N(300,400),  SD=20
```

Counts 是 integer-valued，`S≥320` 的 continuous boundary 是 `319.5`：

```text
P(S≥320)≈1-Φ((319.5-300)/20)
        =1-Φ(0.975)≈0.165
```

## P2：Ping Times 的 mean、unbiased variance 與 SE

八筆 latency `[12,15,11,14,13,19,12,16]` 總和 112，因此 `X̄=14 ms`。相對 14 的 squared deviations 總和為 48：

```text
S² = 48/(8-1) = 48/7 ≈ 6.86 ms²
SE(X̄)=√(S²/8)≈0.93 ms
```

使用 sample mean 取代未知 population mean，會讓 squared deviations 系統性偏小；除以 `n-1` 的 Bessel correction 使 variance estimator unbiased。Sample SD 描述 individual pings 的 spread，SE 則估計 sample mean 在 repeated eight-ping experiments 間的 standard deviation。

CLT approximate interval 是

```text
14±2(0.93)=[12.1,15.9] ms
```

Repeated sampling 下，這種建構方式約 95% 會 cover true mean；不是說已算出的固定 interval 有 95% probability 包住固定 parameter。

## P3：可以完整列舉的 tiny bootstrap

Sample 是 `[2,4,9]`，每個 bootstrap resample 以 replacement 抽三次，因此有 `3³=27` 個 ordered resamples。Max 等於九可用 complement：

```text
P(max=9)=1-(2/3)³=19/27≈0.70
```

Resample mean 等於原 mean 五，等價於 sum 15；唯一 multiset 是 `{2,4,9}`，有 `3!=6` 個 orderings：

```text
P(mean=5)=6/27=2/9≈0.22
```

若 `replace=False` 且從 `n` 筆抽 `n` 筆，每次只會拿回整份原 sample 的排列，statistic 完全不變，bootstrap distribution collapse 成單點。Replacement 讓 empirical PMF 的每次 draw 保持相同 probabilities。

## P4：沒有 closed-form SE 的 median

五十個 app ratings 的 median 可用：

```text
medians=[]
repeat 10,000 times:
  resample=choice(ratings,50,replace=True)
  medians.append(median(resample))
return std(medians)
```

Bootstrap 假設 observed sample histogram 是 underlying population distribution 的合理 proxy，因此從 sample 重抽可模擬 fresh experiments。它能套在 median、variance、IQR、difference of means 等 arbitrary statistics。

失敗模式有兩類。Data 非 IID 時，naive resampling 破壞 dependence；long-tailed population 若 rare extremes 沒進原 sample，empirical histogram 根本無法重新生成那些重要 events。

## P5：Compiler Flag 的 null bootstrap test

Flag A 有 40 次 runtimes、mean 210 ms；B 有 45 次、mean 204 ms，observed gap 是 6 ms。Null hypothesis 是兩組其實來自同一 runtime distribution，差距只由 sampling error 造成。

在 null 下先 pool 85 筆，再從同一 pool 分別重抽原 group sizes：

```text
universal=concat(A_times,B_times)
count=0
repeat 10,000 times:
  A*=choice(universal,40,replace=True)
  B*=choice(universal,45,replace=True)
  if abs(mean(A*)-mean(B*))>=6: count+=1
p=count/10,000
```

`p=0.03` 表示：若 null 為真，類似 experiments 產生至少同樣極端 gap 的比例約 3%。它不是 `P(null=true|data)`，也不告訴 effect size。`p=0.4` 則表示此 gap 在 null 下很平常，不能據此主張 flag 真有差異。

## P6：Course Size estimator 的 bootstrap uncertainty

過去十學期的 ratios `ri` 是 IID sample，當期 final enrollment `T=300R`。Plug-in estimates 是

```text
Ê[T] = 300R̄ = 300×(1/10)Σri

Var-hat(T)=300²S_R²
          =300²×(1/9)Σ(ri-R̄)²
```

題目要的不是 `Var-hat(T)` 本身，而是這個 variance estimate 因只有十筆 history 而有多少 sampling variability：

```text
estimates=[]
repeat 10,000 times:
  r*=choice([r1,...,r10],10,replace=True)
  estimates.append(300²×sample_variance(r*))
return std(estimates)
```

每輪必須重算完整 target statistic；只 bootstrap raw ratios 的 SD 回答的是另一個問題。

## Challenge：Bayesian posterior 與 bootstrap distribution

十五次 coin flips 得五 heads、十 tails。Bayesian 路線從 Laplace prior `Beta(2,2)` 更新為

```text
p|data~Beta(7,12),  E[p|data]=7/19≈0.37
```

Frequentist bootstrap 則把五個 ones、十個 zeros 當 empirical sample，反覆以 replacement 抽 15 次並記錄 head fraction。10,000 個 fractions 形成 `p-hat` 的 bootstrap sampling distribution，center 在 observed `5/15=1/3` 附近。

兩個 distributions 不回答同一問題。Bayesian posterior 是給定 prior 與 data 後，對 random parameter `p` 的 belief。Bootstrap distribution 把 `p` 視為 fixed unknown，描述 estimator `p-hat` 在 repeated samples 中的 variability。

## 如何使用 LLM Learning Guide

六個 concepts 是 population/sample/statistic、unbiased variance、SE、bootstrap algorithm、arbitrary statistics 與 failure modes、null/p-values。練習時先說清楚「哪個 quantity 在重複 experiment 中變動」，再寫 resampling code。Hypothesis test 還需額外確認 resamples 是否真的由 null-implied pool 產生，並用條件句正確解讀 p-value。

## 材料邊界

- 本文覆蓋 P1–P6、optional challenge 與 guide 六個 concepts，題號與三頁材料完整。
- 當期投影片 unavailable、錄影 gated；L2 文章不重建缺失 lecture content。
- 文中 bootstrap code 是官方 pseudocode 的等價整理，不宣稱 production implementation details。
- 材料規模有限，採短材料例外；維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 16: Bootstrapping](https://web.stanford.edu/class/cs109/lectures/16-Bootstrapping)
- [Lecture 16 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture16-Worksheet.pdf)
- [Lecture 16 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture16-AnswerKey.pdf)
- [Lecture 16 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture16-LLMPrompts.pdf)
- [Probability for Computer Science: Bootstrapping](https://probabilitycoders.stanford.edu/spr26/bootstrapping)
- [Probability for Computer Science: Samples and populations](https://probabilitycoders.stanford.edu/spr26/samples)
