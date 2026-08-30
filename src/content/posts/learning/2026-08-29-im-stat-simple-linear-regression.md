---
title: "一條迴歸線怎麼變成預測、解釋與誤差？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 15
tldr: "簡單線性迴歸用一個 X 描述 Y 的平均變化；斜率、截距、殘差和平方誤差共同構成最小的 supervised learning 模型。"
description: "簡單線性迴歸入門：OLS、斜率、截距、殘差、預測解釋，以及它如何接到 supervised learning baseline。"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-simple-linear-regression-en)

簡單線性迴歸看起來像國中數學的一條直線，但統計考題要你處理的不是畫線而已。它問的是：當 `X` 改變時，`Y` 的平均值如何改變？這條線能不能拿來預測？預測錯誤要怎麼量？

最基本的模型寫成：

```text
Y = beta0 + beta1 X + error
```

`beta0` 是截距，`beta1` 是斜率，`error` 是直線沒有解釋掉的部分。樣本資料裡，我們估出 `b0` 和 `b1`，得到預測線：

```text
yhat = b0 + b1 x
```

## 斜率和截距怎麼解釋

斜率回答的是：「`X` 增加一單位時，`Y` 的平均值預期改變多少。」如果 `b1 = 2`，意思是 `X` 每增加 1，模型估計 `Y` 的平均增加 2。

截距回答 `X = 0` 時的預測平均 `Y`。但截距不一定有實務意義。假設 `X` 是讀書時數，而資料範圍是 3 到 10 小時，`X = 0` 可能不在你觀察到的範圍內。這時截距主要是讓直線位置正確，不一定要硬解釋成真實場景。

殘差是觀察值和預測值的差：

```text
residual = y - yhat
```

OLS，也就是 ordinary least squares，選擇 `b0` 和 `b1` 的方式，是讓所有殘差平方和最小：

```text
RSS = sum (y_i - yhat_i)^2
```

平方會懲罰大的錯誤，也讓正負殘差不會互相抵消。

## 手算例題：從摘要量算迴歸線

題目給：

```text
xbar = 3
ybar = 10
Sxx = 20
Sxy = 40
```

簡單線性迴歸的斜率估計是：

```text
b1 = Sxy / Sxx = 40 / 20 = 2
```

截距是：

```text
b0 = ybar - b1 xbar = 10 - 2 × 3 = 4
```

所以迴歸線是：

```text
yhat = 4 + 2x
```

當 `x = 5` 時：

```text
yhat = 4 + 2 × 5 = 14
```

語境解釋可以寫：「在此線性模型下，`X` 每增加一單位，`Y` 的平均值估計增加 2；當 `X = 5` 時，模型預測 `Y` 的平均約為 14。」

這裡有兩個陷阱。第一，斜率描述的是平均關係，不表示每一個個體都會剛好增加 2。第二，迴歸關係本身不保證因果。如果 `X` 是廣告支出、`Y` 是銷售額，斜率為正可能代表廣告有效，也可能是旺季時公司本來就同時增加廣告和銷售。

## 相關和迴歸差在哪裡

相關係數衡量兩個變數一起變動的方向和強度，沒有指定誰解釋誰。迴歸會指定 response 和 predictor：用 `X` 解釋或預測 `Y`。

同一批資料，若把 `X` 和 `Y` 對調，迴歸線會變；相關係數則不會。考試問斜率、預測、殘差時，要進入迴歸語言。問線性關聯強弱時，可能是在考相關。

## 這在 ML / AI 哪裡會用到

線性迴歸是 supervised learning 的最小模型。`X` 是 feature，`Y` 是 label，`yhat` 是 prediction，平方誤差是 loss。你可以把它視為很多複雜模型的基準線。

在 ML 專案裡，線性迴歸不一定最準，但它有三個用處。第一，它讓你快速建立 baseline，知道更複雜模型至少要贏過什麼。第二，係數容易解釋，可以拿來檢查 feature 方向是否合理。第三，殘差能揭露資料問題，例如某些區間系統性預測偏高，或 outlier 對模型造成很大影響。

LLM 或推薦系統的模型當然比一條線複雜很多，但 evaluation 仍然常回到同一件事：prediction 和 observed outcome 差多少？loss 如何定義？模型是在解釋資料，還是在背訓練資料？

## 常見錯誤

- 把斜率解釋成每個個體一定改變多少，而不是平均變化。
- 截距不在資料範圍內，仍然硬給實務解釋。
- 把迴歸係數直接寫成因果效果。
- 做預測時 extrapolate 到資料範圍很遠之外。
- 只看迴歸線，沒有檢查殘差。

## 練習題

1. 給定 `b0 = 5`、`b1 = 2`、`x = 7`，算出 `yhat`，並寫一句預測解釋。
2. 某模型 `yhat = 4 + 2x`，觀察到 `x = 5`、`y = 11`，請算 residual。
3. 寫一句斜率的正確解釋，句中要包含「平均」。
4. 用一個 ML 專案說明：為什麼 linear regression 適合作為 baseline？

## 下一篇怎麼接

簡單線性迴歸只看一個 predictor。下一篇會看一整張迴歸輸出表：多個係數、標準誤、t 值、F 檢定與 R2 要怎麼一起讀，才不會只盯著 p-value。

## 章節級參考對照

- OpenIntro / OpenStax：simple linear regression、OLS、斜率、截距、殘差與 R2。
- Stanford CS109：supervised prediction、loss 與資料建模語境。
- scikit-learn：linear regression baseline 與模型評估。

## 參考資料

- [Simple Linear Regression in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Linear Regression and Correlation](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Linear Models](https://scikit-learn.org/stable/modules/linear_model.html)
- [scikit-learn Model Evaluation: Regression Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
