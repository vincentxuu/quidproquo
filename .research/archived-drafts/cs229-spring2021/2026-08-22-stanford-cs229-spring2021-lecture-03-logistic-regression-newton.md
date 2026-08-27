---
title: "Stanford CS229 Lecture 3：從 Gaussian likelihood 走到 Logistic Regression"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, logistic-regression, newtons-method]
lang: zh-TW
series:
  name: "Stanford CS229 導讀"
  order: 4
tldr: "Lecture 3 先證明 Gaussian 誤差下最大概似等同最小平方誤差，再以 sigmoid 建立二元分類機率，最後用 Newton's method 引入二階最佳化。"
description: "導讀 Stanford CS229 Spring 2021 Lecture 3：最小平方的機率解釋、logistic regression、log-likelihood、梯度更新與 Newton's method。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-03-logistic-regression-newton-en)

這是 [Stanford CS229 導讀](/series/stanford-cs229)的第 4 篇，對應 **Stanford CS229, Spring 2021, Lecture 3**。課程在 2021 年 4 月 5 日的官方題目是 **Weighted Least Squares. Logistic regression. Newton's Method.**；本文實際使用當學期 live lecture notes，以及 syllabus 指定的共用 Supervised Learning notes Sections 4、5、7。錄影沒有作為來源。

這講的主脊是把「挑一個 loss」改寫成「先說資料如何生成」。一旦指定機率模型，就能用 likelihood 選參數；least squares 與 logistic regression 於是成為同一套建模程序的兩個例子，而不只是兩個要背的公式。

## Least squares 隱含了什麼噪音模型

令標籤由線性訊號加上誤差產生：

```text
y^(i) = θᵀx^(i) + ε^(i)
ε^(i) ~ N(0, σ²)
```

筆記假設誤差平均為零、彼此獨立，並有共同變異數。給定 `x` 與 `θ`，`y` 因而服從平均 `θᵀx` 的 Gaussian。所有樣本的 likelihood 是條件密度乘積；取對數後，與 `θ` 有關的部分正比於負的平方殘差總和。因此最大化 log-likelihood 等價於最小化：

```text
1/2 Σ_i (y^(i) - θᵀx^(i))²
```

這個推導不是宣告真實誤差永遠 Gaussian。它說明 loss 不是中立選項：平方誤差對應一組資料生成假設。若誤差變異數隨樣本不同，課程標題中的 weighted least squares 便提供讓不同觀測承擔不同權重的方向；公開 live notes 沒有完整展開其公式，本文不替它補一套未出現在材料裡的推導。

## 為什麼分類不能直接沿用直線輸出

二元分類令 `y ∈ {0,1}`。若直接用 `θᵀx` 當輸出，它可能小於零或大於一，無法直接當成機率。Logistic regression 先用 sigmoid 把實數壓進 `(0,1)`：

```text
g(z) = 1 / (1 + e^(-z))
hθ(x) = g(θᵀx)
```

模型把 `hθ(x)` 解讀為 `P(y=1|x;θ)`，而 `1-hθ(x)` 是 `P(y=0|x;θ)`。Sigmoid 的直覺不是「把直線彎一下」而已；它把線性分數轉成合法的 Bernoulli 參數，使分類可以用 likelihood 訓練。

## 一條式子同時容納正例與負例

單筆二元標籤的條件機率可寫成：

```text
p(y|x;θ) = hθ(x)^y (1-hθ(x))^(1-y)
```

當 `y=1`，只留下第一項；當 `y=0`，只留下第二項。對所有樣本取 log 後：

```text
ℓ(θ) = Σ_i [y^(i) log hθ(x^(i))
          + (1-y^(i)) log(1-hθ(x^(i)))]
```

訓練要最大化 `ℓ(θ)`。筆記指出其梯度更新有熟悉的誤差乘特徵形式，和 LMS 外觀相近；相同外觀來自兩個模型的微分結構，不代表兩者的機率假設相同。

## Newton's method 為何看二階資訊

一維 Newton's method 原本用切線找方程 `f(x)=0` 的根：

```text
x_(t+1) = x_t - f(x_t) / f'(x_t)
```

若要最大化 `ℓ(θ)`，可以令 `f=ℓ'`，在多維情況使用 Hessian：

```text
θ_(t+1) = θ_t - H^(-1) ∇ℓ(θ_t)
```

梯度只告訴你坡往哪邊；Hessian 還描述局部曲率，因此 Newton 更新會依不同方向的彎曲程度縮放步伐。筆記比較收斂速度與每步成本：Newton 常需較少步，但每步要形成並處理二階矩陣，成本會隨參數維度快速增加，也需要更多儲存空間。

所以「步數少」不等於「總時間一定短」。參數很多時，便宜的一階更新可能更實際。這堂課展示的是取捨，不是替所有問題指定 Newton's method。

## 在十八講中的位置

Lecture 3 把 Lecture 2 的 hypothesis、objective、optimization 補上 probability。Lecture 4 會用 exponential family 把 Gaussian、Bernoulli 與更多分布放進同一框架；Lecture 5 再從直接建模 `p(y|x)` 轉向生成式的 `p(x|y)p(y)`。這裡最重要的習慣是：看到 loss 時，追問它隱含什麼資料假設。

## 延伸

拿一筆二元資料算出 `z=θᵀx`、`g(z)`，再分別代入 `y=1` 與 `y=0` 的 log-likelihood。接著把 `z` 往正、負方向推，觀察自信但錯誤的預測如何被重罰。這比只背 sigmoid 導數更能看懂分類 loss 的方向。

## 參考資料

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Supervised Learning notes, Sections 4, 5, and 7](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes1.pdf)
- [Spring 2021 Lecture 3 live notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture3_draft.pdf)
