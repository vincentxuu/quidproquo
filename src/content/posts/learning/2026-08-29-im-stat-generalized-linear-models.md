---
title: "GLM 怎麼依資料型態選分布和 link function？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 38
tldr: "GLM 怎麼依資料型態選分布和 link function？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 38 篇：GLM 怎麼依資料型態選分布和 link function？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-generalized-linear-models-en)

前面看過線性迴歸和 logistic regression。它們表面上很不一樣：一個處理連續數值，一個處理 0/1 分類；一個用平方誤差，一個用 likelihood / cross entropy。但放進 GLM，兩者其實是同一個家族裡的不同成員。

GLM，generalized linear model，處理的是一個很實際的問題：`Y` 的資料型態不同，模型就不該硬用同一套常態線性迴歸。二元、計數、比例、等待時間，各自需要合適的分布和 link function。

## GLM 的三個部件

GLM 有三塊：random component、linear predictor、link function。

random component 決定 `Y` 的分布。連續且近似常態的資料可以用 Normal；0/1 結果可以用 Bernoulli；計數資料常用 Poisson。

linear predictor 是：

```text
eta = X beta
```

這部分保留線性模型的好處：feature 的組合仍然是線性的。

link function 把條件平均數和線性預測器接起來：

```text
g(E[Y | X]) = X beta
```

這條式子是 GLM 的核心。模型仍然用 `X beta`，但不要求 `E[Y | X]` 本身直接等於 `X beta`。

## response type 決定模型選擇

如果 `Y` 是連續數值，且誤差大致可用常態處理，ordinary linear regression 是自然起點：

```text
Y | X ~ Normal(mu, sigma^2)
mu = X beta
```

如果 `Y` 是 0/1，常用 Bernoulli 和 logit link：

```text
Y | X ~ Bernoulli(p)
log(p / (1 - p)) = X beta
```

這就是 logistic regression。

如果 `Y` 是計數，常用 Poisson 和 log link：

```text
Y | X ~ Poisson(lambda)
log(lambda) = X beta
```

這樣可以確保 `lambda` 是正的，因為：

```text
lambda = exp(X beta)
```

GLM 的第一步是看 response type。`Y` 是什麼形狀，決定你需要哪種分布和哪種 link。

## 手算例題：Poisson GLM 的 rate ratio

假設你在分析客服系統每天收到的工單數。`Y` 是 count，所以用 Poisson GLM：

```text
log(lambda) = beta0 + beta1 x
```

其中 `x` 表示是否開啟新入口，`x = 1` 是開啟，`x = 0` 是未開啟。假設估到：

```text
beta1_hat = 0.4
```

這不是每天工單數直接增加 0.4 件。`beta1` 在 log rate 尺度上。

轉回原尺度：

```text
exp(0.4) approximately 1.49
```

可以寫成：「在模型設定下，開啟新入口後的預期工單率約為未開啟時的 1.49 倍。」

這個解釋比「增加 0.4」正確，因為 log link 的係數要轉成 rate ratio。

## link scale 和原尺度都要會講

GLM 的係數通常先活在 link scale。

Logistic regression 的係數在 log odds scale；轉成 `exp(beta)` 後是 odds ratio。

Poisson regression 的係數在 log rate scale；轉成 `exp(beta)` 後是 rate ratio。

Linear regression 使用 identity link，係數可以直接在原尺度上解釋。

考試常在這裡扣分。看到 GLM 係數時，先問：這個係數在哪個尺度？如果要給一般讀者或產品團隊看，是否需要轉回 odds ratio、rate ratio 或預測平均數？

## 分布和 loss function 的關係

GLM 也幫你理解 ML 裡的 loss function。

Normal likelihood 對應平方誤差。Bernoulli likelihood 對應 binary cross entropy。Poisson likelihood 對應 count data 的 negative log likelihood。

這代表 loss 不是隨便選的。你選的 loss 其實暗含了對資料生成方式的假設。若 `Y` 是計數，卻用普通 squared error，可能會預測出負數，也可能把高 count 的誤差處理得不合理。

## 題型怎麼辨識

看到 response 是 0/1，先想 Bernoulli、logit link、logistic regression。

看到 response 是 count，先想 Poisson、log link、rate ratio。

看到 response 是連續且可用常態誤差近似，先想 Normal、identity link、linear regression。

看到題目問係數解釋，先回答 link scale，再視情況轉回原尺度。

看到題目問模型選擇，先從 `Y` 的資料型態說起，再談假設和診斷。

## 這在 ML / AI 哪裡會用到

GLM 是 ML 專案裡很強的 structured baseline。它不一定贏過深度模型，但它常能先回答三件事：資料型態是否被正確建模、feature 方向是否合理、複雜模型是否真的有必要。

在產品資料裡，很多目標不是連續常態。點擊是 0/1，購買次數是 count，等待時間偏態很強，使用者留存是比例或生存問題。GLM 逼你先尊重 `Y` 的型態，再談模型能力。

在 AI 評估裡也一樣。若指標是 pass/fail，可以用 Bernoulli 語言；若是每位使用者的錯誤次數，可以用 count model；若是 rating score，可能先用線性模型或 ordinal model 當 baseline。這些選擇會影響不確定性估計和解釋句。

## 常見錯誤

- 看到 regression 就全部套 ordinary linear regression。
- 忘記 GLM 係數通常在 link scale 上。
- 把 Poisson 係數解釋成原尺度的直接加減。
- 把 logistic 係數解釋成機率差。
- 選模型時只看分數，沒有檢查 response type、分布假設和診斷。

## 練習題

1. 把 Bernoulli、Poisson、Normal 分別配到常見的 response type，並寫出可能使用的 link function。
2. 說明 GLM 的三個部件：random component、linear predictor、link function。
3. 若 Poisson GLM 中 `beta1 = 0.4`，計算 `exp(beta1)`，並寫出 rate ratio 解釋。
4. 如果資料是 count，為什麼直接用普通線性迴歸可能不合適？
5. 在 ML 裡，GLM 為什麼常是深度模型前的強 baseline？請從資料型態與可解釋性回答。

## 下一篇怎麼接

GLM 教你依 response type 選分布和 link。下一篇會回到模型診斷：即使你選了看似合適的模型，也要用殘差、outlier、leverage 和 error analysis 檢查它在哪裡壞掉。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐反應變數型態、logistic / Poisson 類模型與迴歸延伸。
- Stanford CS109 支撐分布選擇與條件機率建模的直覺。
- scikit-learn 支撐把不同資料型態轉成可評估模型的工作流；本文把 GLM 當成 structured baseline。

## 參考資料

- [Generalized Linear Models、Bernoulli、Poisson、logit link、log link 與 response type：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
