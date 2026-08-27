---
title: "Stanford CS229 Spring 2021 Lecture 11：從 K-means 的硬分群走到 GMM 與 EM"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, unsupervised-learning, expectation-maximization]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 12
tldr: "K-means 交替最小化分群指派與中心位置，保證 distortion 不增加卻不保證 global optimum；GMM 把硬指派改成後驗機率，EM 再以 E-step 建立緊的 ELBO、M-step 最大化它。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 11：K-means、Gaussian mixture model、soft assignments、Jensen's inequality、ELBO 與 EM 的單調性及限制。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-11-kmeans-gmm-em-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 12 篇，對應 **Stanford CS229, Spring 2021, Lecture 11**。課程表日期是 2021 年 5 月 3 日，官方題目是 **K-Means. GMM (non EM). Expectation Maximization.**；本文實際使用當學期的 Live Lecture Notes，以及課綱指定的 K-means、Mixture of Gaussians 與 EM 共用講義。錄影沒有作為來源。

這是課程第一次把標籤拿掉。K-means 直接把每個點交給一個群集；Gaussian mixture model（GMM）則假設每個點背後有一個未觀察到的來源，並以機率表示來源的不確定性。EM 的角色，就是在「來源不知道」與「參數不知道」互相卡住時，交替更新兩者。

## K-means 是兩組變數的交替最佳化

給定資料 `x¹,…,xⁿ ∈ R^d` 與群集數 `k`，K-means 維護每點的指派 `cᵢ` 與中心 `μⱼ`：

```text
cᵢ ← argmin_j ||xᵢ-μⱼ||²
μⱼ ← 所有 cᵢ=j 的 xᵢ之平均
```

它最小化 distortion：

```text
J(c,μ) = Σᵢ ||xᵢ-μ_{cᵢ}||²
```

固定中心時，選最近中心會讓 `J` 最小；固定指派時，群內平均是平方距離和的最小點。因此每一步都不會增加 `J`。這能說明目標值單調下降，卻不能保證找到 global minimum，因為 `J(c,μ)` 並非 joint convex。不同隨機初始化可能落到不同解，實務上常重跑多次後挑 distortion 最低者。

選 `k` 也沒有資料自己給出的唯一答案。兩群或四群可能都是合理描述，取決於建模目的。K-means 回答的是「在指定 `k` 與平方歐氏距離下，如何找到一個局部穩定的硬分群」，不是發現自然界唯一正確的類別數。

## GMM 把群集指派變成 latent variable

GMM 假設每個點依下列程序生成：

```text
zᵢ ~ Multinomial(φ)
xᵢ | zᵢ=j ~ N(μⱼ, Σⱼ)
```

`zᵢ` 是 latent variable，表示第 `i` 點來自哪個 Gaussian；`φⱼ` 是混合比例。觀察到 `xᵢ` 後，對來源的後驗機率是

```text
wᵢⱼ = p(zᵢ=j | xᵢ; φ,μ,Σ)
     = φⱼ N(xᵢ;μⱼ,Σⱼ) / Σ_l φ_l N(xᵢ;μ_l,Σ_l)
```

和 K-means 的單一 `cᵢ` 不同，`wᵢⱼ` 是 soft assignment：同一點可以對多個來源保留不同程度的可能性。這也讓不同群集能有不同的 covariance 與 mixture weight，而不是只靠到中心的距離決定一切。

若 `zᵢ` 已知，估計每群平均、covariance 與比例都很直接。真正的困難是 `zᵢ` 未觀察，而後驗又需要目前參數。EM 就從這個互相依賴開始。

## E-step 與 M-step 在交替做什麼

對 GMM，E-step 用目前參數計算所有 responsibilities `wᵢⱼ`。M-step 把它們當成 fractional counts：

```text
φⱼ ← (1/n) Σᵢ wᵢⱼ
μⱼ ← Σᵢ wᵢⱼxᵢ / Σᵢ wᵢⱼ
Σⱼ ← Σᵢ wᵢⱼ(xᵢ-μⱼ)(xᵢ-μⱼ)ᵀ / Σᵢ wᵢⱼ
```

這些式子和已知 labels 時的 maximum likelihood estimates 幾乎相同，只是 `1{zᵢ=j}` 被後驗機率 `wᵢⱼ` 取代。E-step 不是選出一個最可能來源後假裝它確定，而是保留整個離散後驗分布。

## Jensen's inequality 如何生出 ELBO

一般 latent-variable model 的 likelihood 含有「log 裡面求和」：

```text
log p(x;θ) = log Σ_z p(x,z;θ)
```

引入任意分布 `Q(z)`：

```text
log p(x;θ)
= log Σ_z Q(z) p(x,z;θ)/Q(z)
≥ Σ_z Q(z) log[p(x,z;θ)/Q(z)]
```

最後一步因 `log` 是 concave 而使用 Jensen's inequality。右側就是 evidence lower bound（ELBO）。當

```text
Q(z) = p(z|x;θ)
```

比值 `p(x,z;θ)/Q(z)` 對 `z` 成為常數，Jensen 的不等式取等號。於是 E-step 用當前參數選擇一個碰到 log likelihood 的下界；M-step 固定 `Q`，把這個下界對 `θ` 最大化。

## 單調上升不等於找到全域最佳解

設目前參數為 `θ_t`。E-step 讓 ELBO 在 `θ_t` 與 likelihood 相等，M-step 又不降低 ELBO，因此

```text
ℓ(θ_{t+1}) ≥ ELBO(Q_t,θ_{t+1})
             ≥ ELBO(Q_t,θ_t)
             = ℓ(θ_t)
```

這證明 log likelihood 單調不下降。它沒有證明 EM 會到 global optimum；GMM likelihood 非凸，初始參數仍會影響最後結果。K-means 與 EM 都有「每一步改善指定目標」的保證，也都有「可能停在局部解」的限制。

另一個限制是模型假設。GMM 的 Gaussian components、群集數與 covariance 結構都是研究者先選的。EM 能在模型內提高 likelihood，不會判斷這些假設是否適合資料。

## 這一講在十八講裡的位置

Lecture 10 用訓練集變動解釋監督式模型的誤差；Lecture 11 改從沒有 labels 的資料推論結構。這堂課建立 K-means、GMM 與一般 EM 的骨架，Lecture 12 會補完 GMM 的 M-step 性質，再把同一個 EM 框架用到 continuous latent variable 的 factor analysis。

自我檢查可以從兩個極小例子開始。先拿四個一維點手跑一次 K-means，確認 assignment 與 mean update 都讓 distortion 不增加；再替同樣的點指定兩個 Gaussian，算一輪 `wᵢⱼ`。兩種「分群」輸出的差異，就在 hard assignment 與 posterior responsibility。

## 延伸

在同一資料上重跑多次 K-means 與 GMM，記錄每次的 distortion 或 log likelihood。除了挑最好的一次，也畫出不同初始化的結果分布。這能直接看見「目標單調改善」和「最後解對初始化敏感」是可以同時成立的兩件事。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 11 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture11_draft.pdf)
- [K-means clustering notes](https://cs229.stanford.edu/notes2020spring/cs229-notes7a.pdf)
- [Mixtures of Gaussians notes](https://cs229.stanford.edu/notes2020spring/cs229-notes7b.pdf)
- [The EM Algorithm notes](https://cs229.stanford.edu/notes2020spring/cs229-notes8.pdf)
