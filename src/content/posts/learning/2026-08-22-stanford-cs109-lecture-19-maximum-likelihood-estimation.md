---
title: "Stanford CS109 Lecture 19｜Maximum Likelihood Estimation：固定資料，找最能解釋資料的參數"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 20
tldr: "MLE 固定觀察資料、最佳化參數；log-likelihood 讓乘積變加總，但最大值也可能落在邊界。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 19：likelihood、MLE、邊界解、gradient ascent 與 Bayesian estimation。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)的第 20 篇，對應 **Summer 2026 Lecture 19**（Jul 23）。Schedule 題目是 **MLE**，講次頁使用 **Maximum Likelihood Estimation**，講者為 Chris Gregg。本文依當期 [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture19-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture19-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture19-LLMPrompts.pdf)與官方讀本整理。

本講維持 **L2**：worksheet 共三頁，正式 P1–P6，另有 optional challenge；answer key 兩頁，P5 與 challenge 是 pset6 題，公開版刻意不附解答。Guide 是三頁六 concepts，最後一頁只延續 Concept 6 與 wrap-up。當期投影片不可用、錄影限 Canvas，以下不重建未公開內容。

## P1：用 entropy 接回上一講

均勻分布在四個值上：

```text
H(X) = -4(1/4)log₂(1/4) = 2 bits
```

一個 yes/no question 若平均切成兩組，每個答案都留下兩個等可能值，expected remaining entropy 是 1 bit，information gain 也是 1 bit。這題把資訊量接到 estimation：資料的價值在於縮小合理模型的集合。

## P2：Geometric 的 MLE

每次 deploy 成功率是未知的 `p`，`X ~ Geo(p)` 記錄直到成功所需的 attempts。五筆資料 `[2,1,4,1,2]` 總和為 10。i.i.d. 假設讓 joint likelihood 成為：

```text
L(p) = ∏ᵢ(1-p)^(xᵢ-1)p = p⁵(1-p)⁵
LL(p) = 5ln p + 5ln(1-p)

dLL/dp = n/p - (Σxᵢ-n)/(1-p) = 0
p̂ = n/Σxᵢ = 1/x̄
```

本題 `p̂=5/10=0.5`。每個 deploy 最後恰有一次成功，因此它就是成功總數除以 attempts 總數。

## P3：Exponential 的 MLE

API request gaps 假設為 `X ~ Exp(λ)`，四筆資料 `[0.8,1.4,0.2,0.6]` 小時總和為 3：

```text
L(λ) = λⁿe^(-λΣxᵢ)
LL(λ) = nln λ - λΣxᵢ
λ̂ = n/Σxᵢ = 1/x̄ = 4/3 ≈ 1.33 requests/hour
```

`λ` 是 rate，sample mean 是平均 gap，兩者互為倒數。平均間隔越短，估計到的到達率應越高。

## P4：calculus 找不到 boundary maximum

樣本 `[1.2,3.7,2.1]` 來自 `Uni(0,β)`。Likelihood 必須包含 support：

```text
L(β) = β⁻³  if β ≥ maxᵢxᵢ = 3.7
     = 0    otherwise
```

可行區內 `LL(β)=-3ln β` 的導數永遠為負，沒有 interior critical point。Likelihood 從左端開始下降，所以 `β̂=maxᵢxᵢ=3.7`。它不會高估真實上界，continuous sample 幾乎必然小於 `β`，因此 estimator 有向下偏差。這說明「微分後設為零」只找內部 stationary point；support 隨參數改變時還要檢查 boundary。

## P5：Wind Farm 的 Rayleigh scale

Worksheet 使用的參數化是：

```text
f(w|θ) = (w/θ)exp(-w²/(2θ)), w ≥ 0
LL(θ) = constant - Nln θ - Σᵢwᵢ²/(2θ)
θ̂ = Σᵢwᵢ²/(2N)
```

代入十筆 wind speeds 得 `θ̂=18.915`。P5 標成 `pset6: mle_wind`，公開 key 只寫「Problem set problem」；此推導來自公開 prompt，不冒充 key 解答。

## P6：point estimate 與 belief distribution

九位 users 成功 6 次，Bernoulli MLE 是 `p̂=6/9=2/3≈0.667`。從 Laplace prior `Beta(2,2)` 更新則有：

```text
p | data ~ Beta(8,5)
posterior mean = 8/13 ≈ 0.615
```

MLE 是使 observed-data likelihood 最大的單點；posterior 是參數的整個 belief distribution。資料少時 prior 把 mean 拉向 `1/2`。若擴大為 600/900，MLE 約 `0.667`，posterior mean 為 `602/904≈0.666`，四個 pseudo-observations 的影響已很小。

## Optional challenge：Negative Binomial

每筆 `X` 記錄取得 `r=5` 次成功前的 experiments 數。100 筆 samples 的 likelihood 可化為：

```text
L(p) ∝ p^(nr)(1-p)^(Σxᵢ-nr)
p̂ = nr/Σxᵢ
```

題目資料 `Σxᵢ=1450`，所以 `p̂=500/1450=10/29≈0.345`。每筆 observation 固定含五次成功，這仍是成功總數除以 trials 總數。Challenge 也是公開 key 省略的 pset6 題。

## Guide unit：parametric model 與 likelihood

Bernoulli 的 `θ=p`、Poisson／Exponential 的 `θ=λ`、Normal 的 `θ=(μ,σ²)`；固定 `θ` 才從 model family 選出一個 distribution。對 i.i.d. data：

```text
L(θ) = ∏ᵢf(xᵢ|θ)
```

Independence 支持乘積，identically distributed 讓每項共享同一模型與參數。`L(θ)` 固定資料、改變 `θ`，並不是自動 normalized 的 parameter distribution。

## Guide unit：log、argmax 與 gradient ascent

`log` 嚴格遞增，所以 `argmaxθ L(θ)=argmaxθ log L(θ)`。它把 products 變 sums，方便微分，也避免大量小值相乘造成 numerical underflow。`argmax` 回傳讓函數最大的參數，而非最大函數值。

沒有 closed-form root 時可做：

```text
initialize θ
repeat:
    θ ← θ + η∇LL(θ)
```

Step size 太大可能 overshoot 或發散，太小則收斂緩慢；non-concave objective 也可能停在 local maximum。P4 的問題不同：其 maximum 在 support boundary。

## 如何使用 LLM Learning Guide

依序完成六個 concepts：parametric models、likelihood、log-likelihood／argmax、classic MLE、boundaries／gradient ascent、MLE vs Bayesian estimation。每輪先自己做 Test me，再要求模型指出第一個錯誤，並解釋 i.i.d. 乘積的依據。

Wrap-up 可要求一題串起：辨認 model 與 `θ`、寫 likelihood／log-likelihood、完成 MLE derivation、辨認 boundary 或 numerical optimization。先讓模型揭露答案只會練到閱讀，不會練到建模。

## 材料邊界

- Worksheet 是三頁 P1–P6 加 optional challenge；兩頁 key 省略兩題 pset6 解答。
- Guide 是三頁六 concepts，第三頁沒有第七個 concept。
- 當期投影片不可用、錄影限 Canvas；本文未重建未公開內容。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 19 page](https://web.stanford.edu/class/cs109/lectures/19-MaximumLikelihoodEstimation)
- [Lecture 19 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture19-Worksheet.pdf)
- [Lecture 19 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture19-AnswerKey.pdf)
- [Lecture 19 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture19-LLMPrompts.pdf)
- [Probability for Computer Science reader](https://probabilitycoders.stanford.edu/spr26)
