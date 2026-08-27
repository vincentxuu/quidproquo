---
title: "Stanford CS229 Lecture 4：Exponential Family 如何統一 GLM"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, exponential-family, generalized-linear-models]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 5
tldr: "Lecture 4 用 p(y;η)=b(y)exp(ηᵀT(y)-a(η)) 統一 Gaussian、Bernoulli 與 multinomial，再以 η=θᵀx 導出 linear、logistic 與 softmax regression。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 4：exponential family、natural parameter、sufficient statistic、GLM recipe 與 softmax regression。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-04-exponential-family-glm-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 5 篇，對應 **Stanford CS229, Spring 2021, Lecture 4**。課程在 2021 年 4 月 7 日的官方題目是 **Dataset split; Exponential family. Generalized Linear Models.**；本文實際使用當學期 live lecture notes，以及 syllabus 指定的共用 Supervised Learning notes Sections 6、8、9。錄影沒有作為來源。公開筆記對 dataset split 沒有展開，因此本文不補寫一套來源未支持的切分流程。

這講的主脊是解釋為什麼 linear regression 與 logistic regression 會長得相似。答案不是巧合，而是它們都可由 generalized linear model（GLM）的同一份 recipe 產生：先選適合標籤的機率分布，再把分布的 natural parameter 和輸入做線性連結。

## Exponential family 是一種共同表示

一族分布若可寫成以下形式，就屬於 exponential family：

```text
p(y; η) = b(y) exp(ηᵀT(y) - a(η))
```

`η` 是 natural parameter，`T(y)` 是 sufficient statistic，`b(y)` 是只依賴觀測值的 base measure，`a(η)` 是 log partition function。最後一項會讓整個密度或機率質量正規化為一。

這個表示的價值不在符號比較短，而在同一套微分性質能服務許多輸出類型。筆記列出 Bernoulli、Gaussian、multinomial、Poisson、gamma、exponential、beta 與 Dirichlet。它們不是同一個分布；共同點是能被寫成這個結構。

## Sigmoid 不是任意挑的 S 型函數

Bernoulli 的機率質量為：

```text
p(y; φ) = φ^y (1-φ)^(1-y)
```

把它整理成 exponential-family 形式，可得 natural parameter：

```text
η = log(φ / (1-φ))
```

反解後正是：

```text
φ = 1 / (1 + e^(-η))
```

這就是 sigmoid。Lecture 3 暫時把它當成合理選擇，Lecture 4 則補上結構性理由：若輸出是 Bernoulli，並採 canonical link，sigmoid 會從 natural parameter 與平均值的關係自然出現。

固定變異數的 Gaussian 也能寫進 exponential family，其中 `η=μ`、`T(y)=y`。這時 natural parameter 就是平均值本身，因此 response function 是 identity。線性迴歸不需要 sigmoid，正是因為連續 Gaussian response 和 Bernoulli response 的平均值關係不同。

## GLM recipe 的三個選擇

共用講義把 GLM 建構濃縮成三點：

1. 給定 `x` 後，`y` 服從某個 exponential-family 分布。
2. 模型預測 `E[T(y)|x]`；常見情況下 `T(y)=y`。
3. natural parameter 與輸入線性相關：`η=θᵀx`。

選 Gaussian response，因 `E[y|x]=μ=η`，得到 `hθ(x)=θᵀx`。選 Bernoulli response，因 `E[y|x]=φ=sigmoid(η)`，得到 logistic regression。模型的「線性」放在 natural parameter，不表示輸出平均值必然是輸入的直線。

這套 recipe 也有邊界。分布家族是建模決策，不是資料自己宣布的答案；`η=θᵀx` 同樣是設計選擇。若計數資料明顯過度離散、零值過多，僅因 Poisson 屬於 exponential family 就直接套用，仍可能錯置假設。

## Softmax 把二元分類推向多類別

當 `y` 有 `k` 個離散類別，可用 multinomial response。對每個類別建立線性分數 `θ_iᵀx`，softmax 將它們轉成總和為一的機率：

```text
P(y=i|x;θ) = exp(θ_iᵀx) / Σ_j exp(θ_jᵀx)
```

每個機率同時依賴所有類別分數；提高某一類的分數會重新分配整個機率質量。live notes 以 cross-entropy 表示訓練目標，對真實類別 `i`，單筆損失就是 `-log p̂_i`。模型對正確類別越有信心，損失越小。

參數化需要處理冗餘：所有類別分數一起加上相同常數，不會改變 softmax 機率。共用講義以一個 reference class 的參數設為零來固定表示。這是 identifiability 的處理，不是說那個類別沒有特徵。

## 在十八講中的位置

Lecture 4 把前三講的模型收進共同語法。之後遇到新的 response type，不必從零發明 loss；可以先問合適的分布、natural parameter、期望值與 link。Lecture 5 會改變另一個選擇：不直接建模 `p(y|x)`，而是分別建模 `p(x|y)` 與 `p(y)`。

## 延伸

挑三種標籤：連續值、二元值、非負計數。為每一種寫下候選 response distribution、`E[y|x]` 的形式與合法值域。若模型輸出可能落在值域外，就表示 link 或分布選擇還沒接好。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Supervised Learning notes, Sections 6, 8, and 9](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes1.pdf)
- [Spring 2021 Lecture 4 live notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture4_draft.pdf)
