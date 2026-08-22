---
title: "Stanford CS109 Lecture 12｜General Inference：Bayesian networks、sampling 與 rare evidence"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 13
tldr: "Bayesian network 用 conditional independence 分解巨大 joint；ancestral sampling 生成 joint samples，rejection sampling 再以 evidence 篩出 conditional。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 12：Bayesian networks、factorization、conditional independence、ancestral sampling、rejection sampling 與 MCMC。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-12-general-inference-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 13 篇，對應 **Summer 2026 Lecture 12: General Inference**，日期為 7 月 9 日，講者是 Chris Gregg。本文依 Summer [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture12-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture12-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture12-LLMPrompts.pdf)與跨 offering 共用的 Spring-dated 官方讀本 [computational inference](https://probabilitycoders.stanford.edu/spr26/computational_inference) 章節整理。Canvas 錄影未公開，因此不重建課堂口述。

正式 Summer worksheet 是 P1–P6 加 challenge 的兩頁，題號完整。官方 PDF 另夾一頁沒有講次標頭、題號，且 answer key 與 LLM guide 都未收錄的 **1-D Tracking**。本文把它標為 orphan supplemental artifact 並在文末涵蓋，不把它誤編為 P7。

## P1：再做一次 Bayes update

Spam prior 為 `0.3`。Spam message 含 `free` 的機率是 `0.6`，not-spam 則是 `0.1`：

```text
P(Spam|free)
= 0.6(0.3) / [0.6(0.3)+0.1(0.7)]
= 0.18/0.25 = 0.72
```

這題延續上一講的 prior × likelihood → normalize。後面改變的是 joint 太大，無法再用一張 dictionary 精確列完，因此需要有結構的 factorization 與 sampling。

## P2：Bayesian network 把 joint 寫成 product

三個 binary variables 的 network 是 `Flu→Fever`、`Flu→Tired`。因此

```text
P(Flu,Fever,Tired)
= P(Flu)P(Fever|Flu)P(Tired|Flu)
```

指定 assignment `Flu=1, Fever=1, Tired=0` 的機率為

```text
0.2 × 0.9 × (1-0.8) = 0.036
```

三個 binary variables 的完整 joint 有 `2³=8` rows；`n` 個則有 `2^n`。Bayesian network 不必列出每個 assignment，而只替每個 node 保存「給定 parents」的 conditional table。若每個 node 的 parents 很少，儲存量會遠小於完整 joint。

## P3：conditional independence 不等於 marginal independence

Network 宣告

```text
Fever ⟂ Tired | Flu
```

已知 Flu status 後，知道 tired 與否不再增加 fever 資訊。由 table，`P(Fever=0|Flu=1)=1-0.9=0.1`。

但沒有 conditioning on Flu 時，Fever 與 Tired 並不獨立。Tired 是 Flu 的線索，而 Flu 又提高 Fever 機率，因此 `P(Fever=1|Tired=1)≠P(Fever=1)`。共同原因可以讓兩個 effects marginally dependent，即使給定共同原因後 conditionally independent。

## P4：ancestral sampling 是 generative story

從 joint 產生一筆 sample 時，必須 parents before children：

1. 抽 `Flu~Bern(0.2)`。
2. 依抽到的 Flu 值，用對應 conditional probability 抽 Fever。
3. 依同一 Flu 值抽 Tired。
4. 輸出 `(Flu,Fever,Tired)`。

這叫 ancestral sampling。程式每條路徑的機率正是 factorized joint 中相應 factors 的乘積；長期產生某個 assignment 的頻率會逼近其 joint probability。因此能寫出正確 sampler，就等同以程序形式定義 joint。

## P5：用 rejection sampling 做 conditional inference

目標是 `P(Flu=1|Fever=1)`。反覆 ancestral sample 整個 joint，丟棄所有 `Fever≠1` 的 samples；在保留組中計算 `Flu=1` 的比例。這就是把母體限制到 evidence 成立的 subpopulation，因此 retained frequency 會逼近 conditional probability。

Bayes exact check 是：

```text
P(Fever=1)
= 0.9(0.2)+0.05(0.8)
= 0.22

P(Flu=1|Fever=1) = 0.18/0.22 ≈ 0.818
```

Sampling estimate 應隨 retained sample 數增加而靠近 `0.818`。要檢查的是「保留規則是否只對 evidence」，而不是 query variable 是否符合期待；否則會把答案預先塞入 samples。

## P6：較大 WebMD network 的 rejection sampling

十個 Bernoulli variables 包含 risk factors、diseases 與 symptoms。產生一筆 joint sample 時，先抽沒有 parents 的 root variables，再沿 topological order 抽 children。每個 node 的 Bernoulli probability 由已抽到的 parent values 查 conditional table。

Evidence 是 `{fever=1,tick=1,cough=0}`。只有三項完全符合的 joint samples 才保留。在 retained samples 中，分別計算 `Lyme=1` 與 `Flu=1` 的比例。兩個 posterior 不必加總為一，因為 Lyme 和 Flu 不是互斥 alternatives；同一 sample 可以兩者皆有或皆無。

P6 是 pset4 題，公開 answer key 刻意不刊解答。本文只依公開 prompt 描述 sampling order、keep rule 與 estimators，沒有補造 network 未公開的 conditional tables。

## Challenge：rare evidence 讓 rejection sampling 崩潰

Evidence 若每 10,000 筆 joint samples 只出現一次，平均會丟掉 9,999 筆。要取得足夠 retained samples 才能穩定估計 posterior，就得生成極大量資料；evidence 越稀有或 observed variables 越多，效率越差。

MCMC 的概念性回應是把 observed variables 固定在 evidence values，只反覆重新抽 unobserved variables。它產生的 sample stream 已與 evidence 相容，不需像 naive forward sampling 一樣大量丟棄。這裡官方材料只要求概念比較，沒有展開 transition kernel 或 convergence proof。

## Orphan supplemental artifact：1-D Tracking

官方 worksheet PDF 額外夾入一頁 self-driving car LiDAR 題，但它沒有 Summer Lecture 12 標頭、沒有 problem number，也未出現在 answer key 或 LLM guide。題目令 true distance `T~N(1,3)`，sensor noise `M~N(0,1.5)`，measurement `X=t+M`。

給定固定 `T=t`，只有 noise 隨機，因此

```text
X|T=t ~ N(t,1.5)
f(X=4|T=t)
= 1/√(3π) × exp[-(4-t)²/3]
```

Bayes posterior 是 likelihood 乘 prior：

```text
f(T=t|X=4)
= K × exp[-(4-t)²/3] × exp[-(t-1)²/6]
```

`K` 吸收所有不依賴 `t` 的 constants 與 normalization。這頁可用來連接 continuous Bayes，但其檔案地位不明，因此不把它列入正式 P1–P6 agenda，也不宣稱課堂一定講過。

## 如何使用 LLM Learning Guide

官方 guide 前三個 concept 是 joint table 的規模、Bayesian-network factorization 與 conditional independence。後三個是 generative／ancestral sampling、rejection sampling，以及 rare evidence 與 MCMC。練習時先從 DAG 寫 product，再寫 sampling order。做 conditional query 時，分開標示 evidence 的 keep rule 與 query 的 counted fraction。最後用 exact small-network Bayes 值核對 sampling 是否朝正確方向收斂。

## 材料邊界

- 正式 agenda 為 P1–P6 與 challenge，題號完整；另有一頁 orphan 1-D Tracking artifact，已獨立標示並涵蓋。
- P6 是 pset4 題，公開 answer key 刻意省略解答；本文不推測缺少的 network parameters。
- Canvas 錄影未公開，不推測額外課堂內容。
- 正式 worksheet／guide 各兩頁，採短材料例外；維持 `draft: true` 等待獨立審稿。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 12: General Inference](https://web.stanford.edu/class/cs109/lectures/12-GeneralInference)
- [Lecture 12 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture12-Worksheet.pdf)
- [Lecture 12 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture12-AnswerKey.pdf)
- [Lecture 12 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture12-LLMPrompts.pdf)
- [Probability for Computer Science: Computational inference](https://probabilitycoders.stanford.edu/spr26/computational_inference)
