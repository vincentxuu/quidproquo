---
title: "Stanford CS229 Spring 2021 Lecture 12：EM 如何把低維 latent factors 接回高維資料"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, factor-analysis, expectation-maximization]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 13
tldr: "Factor analysis 假設 x=μ+Λz+ε，以低維 Gaussian latent variable z 與對角雜訊 Ψ 產生高維資料，得到 Cov(x)=ΛΛᵀ+Ψ；EM 必須保留後驗的 E[z] 與 E[zzᵀ]，不能只塞回一個 latent point estimate。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 12：GMM 的 EM 更新、Lagrange multipliers、factor analysis、Gaussian conditioning 與 continuous latent variables 的 E/M steps。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-12-em-factor-analysis-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 13 篇，對應 **Stanford CS229, Spring 2021, Lecture 12**。課程表日期是 2021 年 5 月 5 日，官方題目是 **GMM (EM). Factor Analysis.**；本文實際使用當學期的 Live Lecture Notes、5/5 addendum，以及課綱指定的 Lagrange Multipliers 與 Factor Analysis 講義。為了銜接 EM 性質，也使用前一講指定的 EM 共用講義。錄影沒有作為來源。

Lecture 11 用離散 latent variable 表示「這個點來自哪個 Gaussian」。Lecture 12 把 latent variable 換成連續低維向量：高維觀測可能由少數共同因素加上各座標雜訊生成。主線仍是 EM，但 E-step 不再只算幾個群集 probabilities，而要處理完整的 Gaussian posterior moments。

## 先補完 GMM 的 M-step

GMM 的 E-step 給出 responsibilities

```text
wᵢⱼ = p(zᵢ=j|xᵢ;θ)
```

M-step 對 ELBO 最大化。更新 mixture weights `φⱼ` 時還要滿足 `Σⱼφⱼ=1`，因此使用 Lagrangian：

```text
L(φ,β) = ΣᵢΣⱼ wᵢⱼ log φⱼ + β(Σⱼφⱼ-1)
```

令偏導為零並套回限制，可得

```text
φⱼ = (1/n) Σᵢ wᵢⱼ
```

也就是某個 component 的比例等於它取得的總 responsibility 除以樣本數。相同的 weighted maximum likelihood 會得到 `μⱼ` 與 `Σⱼ` 更新。這說明 EM 不是憑直覺交替猜測，而是每個 M-step 都在目前 ELBO 上解一個明確的最佳化問題。

## 高維、小樣本為何讓 full Gaussian 失效

對 `x ∈ R^d`，經驗 covariance 是

```text
Σ_hat = (1/n) Σᵢ (xᵢ-μ)(xᵢ-μ)ᵀ
```

當資料點只張成低維子空間，`Σ_hat` 會 singular，無法在 Gaussian density 中計算反矩陣與 determinant。把 covariance 限制成 diagonal 可以避開問題，卻同時假設不同座標不相關；限制成 `σ²I` 更只留下同一尺度的 spherical noise。

Factor analysis 想保留兩邊的好處：用少量參數表示跨座標 correlation，同時不必估計完整 `d×d` covariance。

## Factor analysis 的生成模型

模型定義

```text
z ~ N(0,I_k)
ε ~ N(0,Ψ)
x = μ + Λz + ε
```

其中 `k<d`，`Λ ∈ R^{d×k}`，`Ψ` 是 diagonal covariance。`z` 是低維共同因素，`Λ` 把它映到觀測空間，`ε` 則加入每個座標自己的雜訊。

因 `z` 與 `ε` 獨立且均值為零：

```text
E[x] = μ
Cov(x) = ΛΛᵀ + Ψ
```

`ΛΛᵀ` 可以產生跨座標 covariance，但它的 rank 最多是 `k`；`Ψ` 補上每一維的獨立變異。這是 factor analysis 的結構性假設：相關性主要由少數共同因素解釋，剩餘雜訊在觀測座標上互不相關。

## E-step 需要 Gaussian conditioning

`z` 與 `x` 的 joint Gaussian 為

```text
[z] ~ N([0], [I       Λᵀ      ])
[x]     [μ]  [Λ  ΛΛᵀ + Ψ]
```

套用 multivariate Gaussian 的 conditional formula，可得

```text
z|x ~ N(m,V)

m = Λᵀ(ΛΛᵀ+Ψ)⁻¹(x-μ)
V = I - Λᵀ(ΛΛᵀ+Ψ)⁻¹Λ
```

這就是 E-step 的 `Qᵢ(zᵢ)`。它不是一個最可能的 `zᵢ`，而是一整個 posterior distribution。對每筆資料，M-step 至少需要

```text
E[zᵢ|xᵢ] = mᵢ
E[zᵢzᵢᵀ|xᵢ] = mᵢmᵢᵀ + V
```

第二式裡的 `V` 不能丟掉。若只把 posterior mean 當成「猜到的 latent value」塞回去，就把不確定性誤當成零，得到的不是講義推導的 EM update。

## M-step 為何像一個帶不確定性的 regression

固定 `Qᵢ` 後，對 loading matrix `Λ` 最大化 expected complete-data log likelihood，更新式具有 normal equation 的形狀：

```text
Λ ← [Σᵢ (xᵢ-μ)E[zᵢ]ᵀ]
     [Σᵢ E[zᵢzᵢᵀ]]⁻¹
```

若 `zᵢ` 已觀察，這就像用 latent factors 線性預測 `xᵢ`。EM 的差異是 `zᵢ` 未觀察，因此分母使用 posterior second moment，而不是單純用 `E[zᵢ]E[zᵢ]ᵀ`。`μ` 更新為資料平均，`Ψ` 則保留 expected residual covariance 的 diagonal。

這個推導也說明 continuous latent variable 不需要把求和硬改成單一最佳猜測；一般 EM 只要把離散和換成對 posterior density 的積分或期望。

## 這一講的限制

Factor analysis 不會唯一辨認 latent axes。若對 `z` 做 orthogonal rotation，同時相反旋轉 `Λ`，觀測分布 `ΛΛᵀ+Ψ` 不變。因此某一 latent coordinate 不應未經額外限制就被宣稱成唯一真實因素。

模型也假設 linear-Gaussian mapping 與 diagonal residual covariance。資料若有非線性流形、厚尾分布或剩餘雜訊仍高度相關，factor analysis 可能不合適。EM 的 likelihood 單調性仍不等於 global optimum，初始化與 latent dimension `k` 都是實際選擇。

## 這一講在十八講裡的位置

Lecture 11 從 K-means 走到離散 latent-variable EM；Lecture 12 證明同一框架能處理 continuous Gaussian latent variables。下一講會把低維表示轉到 PCA：不再從完整機率生成模型開始，而是直接找能保留資料變異的線性子空間。

理解檢查可以只做 covariance。從 `x=μ+Λz+ε` 出發，把 `Cov(x)` 展開，逐項指出為什麼 cross terms 消失。若能得到 `ΛΛᵀ+Ψ`，就抓到 factor analysis 用少量 latent structure 表示高維 correlation 的核心。

## 延伸

用合成資料先選一個二維 latent `z`、一個高維 `Λ` 與 diagonal `Ψ`，生成資料後比較 full empirical covariance、diagonal Gaussian 與 factor-analysis covariance。除了 likelihood，也比較它們重建的 off-diagonal correlations；這正是三種模型假設差異最大的地方。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 12 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture12_draft.pdf)
- [Lecture 12 addendum](https://cs229.stanford.edu/notes2021spring/notes2021spring/5_5_addendum.pdf)
- [Lagrange Multipliers review](https://cs229.stanford.edu/notes2020spring/lagrange_multiplier.pdf)
- [The EM Algorithm notes](https://cs229.stanford.edu/notes2020spring/cs229-notes8.pdf)
- [Factor Analysis notes](https://cs229.stanford.edu/notes2020spring/cs229-notes9.pdf)
