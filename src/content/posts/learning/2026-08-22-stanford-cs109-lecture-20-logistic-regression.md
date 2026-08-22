---
title: "Stanford CS109 Lecture 20｜Logistic Regression：從 Bernoulli likelihood 推出 gradient"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, machine-learning]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 21
tldr: "Logistic regression 用 sigmoid 把線性分數變成 Bernoulli 機率，而 gradient xⱼ(y-ŷ) 直接來自 log-likelihood 的 chain rule。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 20：sigmoid、decision boundary、log-likelihood、gradient ascent 與 MAP prior。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-20-logistic-regression-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)第 21 篇，對應 **Summer 2026 Lecture 20: Logistic Regression**（Jul 28），講者為 Chris Gregg。本文依官方 [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture20-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture20-AnswerKey.pdf)、[LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture20-LLMPrompts.pdf)與讀本整理。

本講維持 **L2**。Worksheet 是三頁 P1–P6 加 optional MAP challenge；answer key 是四頁，只有 P5 的 pset7 code solution 省略，challenge 有完整解答。Guide 是三頁六 concepts。當期投影片不可用、錄影限 Canvas，本文不重建未公開內容。

## P1：Poisson MLE warm-up

五秒 counts `[3,1,4,2,5]` 的總和是 15。忽略與 `λ` 無關的常數後：

```text
LL(λ) = -nλ + (Σxᵢ)ln λ + constant
dLL/dλ = -n + Σxᵢ/λ = 0
λ̂ = Σxᵢ/n = 3
```

`-Σln(xᵢ!)` 只垂直平移 objective，其導數為零，不會移動 argmax。

## P2：sigmoid、prediction 與 decision boundary

模型參數 `θ=[-1,2,0.5]`，features 前補 `x₀=1`。對 `(x₁,x₂)=(1,2)`：

```text
z = θᵀx = -1 + 2(1) + 0.5(2) = 2
ŷ = σ(2) = 0.8808
```

所以 0.5 threshold 預測 class 1。`σ` 嚴格遞增且 `σ(0)=0.5`，thresholding probability at 0.5 等同 thresholding `z` at 0。模型恰好 undecided 時：

```text
-1 + 2x₁ + 0.5x₂ = 0
x₂ = 2 - 4x₁
```

這條直線是 decision boundary；高維時是 hyperplane。`θ₃=0` 表示 feature 3 不影響 weighted sum，大負權重則是對 `Y=1` 的強烈反證。

## P3：手算一步 gradient ascent

兩筆資料為 `([1,1,0],1)` 與 `([1,0,1],0)`，初始 `θ=[0,0,0]`。兩個 prediction 都是 0.5，故：

```text
LL = 2ln(0.5) ≈ -1.386
∇LL = [0.5,0.5,0] + [-0.5,0,-0.5]
     = [0,0.5,-0.5]
```

`η=1` 更新後 `θ=[0,0.5,-0.5]`。新 predictions 分別是 `σ(0.5)=0.6225` 與 `σ(-0.5)=0.3775`，觀察 labels 的 likelihood 都是 0.6225：

```text
LL_new = 2ln(0.6225) ≈ -0.948
```

增加約 0.438。兩筆資料對 intercept 的 residual 大小相等、方向相反，且 `x₀=1`，所以 `θ₀` 的 gradient 抵消。

## P4：gradient 從哪裡來

Logistic assumption 是 `Y|X=x ~ Bern(ŷ)`，其中 `ŷ=σ(θᵀx)`。單筆 label 的可微 PMF 與 log-likelihood：

```text
P(Y=y|x) = ŷʸ(1-ŷ)^(1-y)
LL = yln ŷ + (1-y)ln(1-ŷ)
```

Chain rule 的兩段為：

```text
∂LL/∂ŷ = (y-ŷ)/(ŷ(1-ŷ))
∂ŷ/∂θⱼ = ŷ(1-ŷ)xⱼ
∂LL/∂θⱼ = xⱼ(y-ŷ)
```

`ŷ(1-ŷ)` 正好消掉。對整份資料加總即 `Σᵢxⱼ⁽ⁱ⁾(y⁽ⁱ⁾-σ(θᵀx⁽ⁱ⁾))`。Residual `y-ŷ` 決定修正方向與幅度，`xⱼ` 決定 feature j 在這筆資料分到多少 credit 或 blame。

## P5：Logistic Regression code

Pset7 要以 `η=0.0001`、1,000 steps 訓練 `simple-train.csv`，並在 test set 達到 100% accuracy；此資料的 label 完全由 `x₁` 決定。Worksheet 不要求當場寫 code，而要畫 triple-nested loop：

```text
repeat training steps:
    reset gradient accumulator
    for each example:
        compute ŷ
        for each parameter:
            gradient[j] += x[j](y-ŷ)
    update every θ[j] after all examples
```

Accumulator 每個 outer iteration 歸零；batch update 必須在 examples loop 結束後。公開 key 依 pset policy 不提供權重數值，本文也不虛構執行結果。

## P6：conceptual rapid fire

- 取 log 避免小機率乘積 underflow，也讓乘積變成容易微分的加總；strict monotonicity 保留 argmax。
- Linear regression 可能輸出 `[0,1]` 外的值，且其 Gaussian-noise story 不適合 binary label；logistic model 直接設定 conditional Bernoulli probability。
- 若 `Y` 與 `Xᵢ` independent，預期 `θᵢ≈0`；有限樣本不保證恰為零。
- 額外加入永遠為 0 的「intercept feature」不影響 prediction，其 gradient 也永遠為 0。
- Interaction `x₁x₂` 只需先新增一欄 feature；同一個 gradient formula 可學 `θ₃`。

## Optional challenge：Gaussian prior 與 MAP

單參數模型 `P(Y=1|x)=σ(θx)`，prior 為 `N(0,1)`。標準常態 density 在 0 相對於 2 的比值是 `e²≈7.389`。Bayes denominator 不依賴 `θ`，且 log 保留 argmax：

```text
θ_MAP = argmaxθ [log f(θ) + Σᵢlog f(yᵢ|θ)]
gradient = -θ + Σᵢxᵢ[yᵢ-σ(θxᵢ)]
```

額外的 `-θ` 每步把參數拉向 0；它就是 Gaussian prior 導出的 L2 regularization／weight decay。資料少時 prior 影響大，資料項隨 `n` 增長後相對變弱。

## Guide unit：classification assumption 與 training objective

一筆 supervised binary datapoint 包含 feature vector `x` 與 label `y∈{0,1}`。模型輸出的是 `P(Y=1|X=x)`，threshold 後才是 class label。Logistic regression 假設：

```text
P(Y=1|X=x) = σ(θᵀx)
LL(θ) = Σᵢ[yᵢlog ŷᵢ + (1-yᵢ)log(1-ŷᵢ)]
```

Machine learning 常把負的這個 objective 稱為 binary cross-entropy loss。Log-likelihood 對 `θ` 是 concave，因此適當設定的 gradient ascent 可到 global optimum。

## 如何使用 LLM Learning Guide

按六個 concepts 練 classification setup、sigmoid、logistic assumption、log-likelihood、gradient derivation 與 training loop。每次先完成 Test me；要求模型檢查 prediction `ŷ` 與 threshold 後 class 是否混淆，並讓它放入 accumulator reset 或 update 位置錯誤的 pseudocode 供你除錯。

## 材料邊界

- Worksheet 三頁 P1–P6 加 challenge；四頁 key 只有 P5 code 題省略，challenge 完整。
- Guide 三頁六 concepts，無額外題號。
- 當期投影片不可用、錄影限 Canvas；本文只使用公開 artifacts。

## 參考資料

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 20 page](https://web.stanford.edu/class/cs109/lectures/20-LogisticRegression)
- [Lecture 20 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture20-Worksheet.pdf)
- [Lecture 20 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture20-AnswerKey.pdf)
- [Lecture 20 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture20-LLMPrompts.pdf)
- [Probability for Computer Science reader](https://probabilitycoders.stanford.edu/spr26)
