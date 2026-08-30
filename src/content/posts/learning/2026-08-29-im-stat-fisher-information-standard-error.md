---
title: "Fisher information 怎麼告訴你參數估得穩不穩？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 26
tldr: "Fisher information 用 likelihood 的曲率衡量資料對參數的定位能力；資訊越大，MLE 的標準誤通常越小。"
description: "Fisher information 入門：score、curvature、observed information、standard error，以及 ML uncertainty 與 natural gradient 的連接。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-fisher-information-standard-error-en)

MLE 找出讓資料最合理的參數，但考試和實務很快會追問下一句：這個估計值有多穩？如果 likelihood 在最大值附近很尖，參數稍微偏離就讓資料變得很不合理，估計通常比較精準。若 likelihood 在附近很平，很多參數看起來都差不多合理，估計就比較不穩。

Fisher information 正是在量這件事。它把 likelihood 的形狀變成數字，讓你從「估計值是多少」走到「估計值有多不確定」。

## 把 log likelihood 想成一座山

log likelihood 可以想成一座山。山頂是 MLE。山頂附近越尖，代表你離開山頂一點點，log likelihood 就掉很多；資料對參數位置給了強烈訊號。山頂附近越平，代表附近很多參數都差不多，資料沒有把參數定位得很清楚。

在單參數情況下，常見的 observed information 是負的二階導數：

```text
J(theta_hat) = - d^2 ell(theta) / d theta^2 evaluated at theta_hat
```

前面加負號，是因為最大值附近的二階導數通常是負的；取負後資訊量變成正數。

在規則條件下，MLE 的大樣本變異數可近似為：

```text
Var(theta_hat) ≈ 1 / I(theta)
```

所以標準誤近似為：

```text
SE(theta_hat) ≈ 1 / sqrt(I(theta_hat))
```

多參數時會變成 information matrix。標準誤來自矩陣反矩陣的對角線，而不只是單一數字倒數。

## 手算例題：observed information 到 standard error

假設某一參數的 log likelihood 在估計點附近算出 observed information：

```text
J(theta_hat) = 25
```

標準誤近似為：

```text
SE(theta_hat) ≈ 1 / sqrt(25) = 0.2
```

如果估計值是：

```text
theta_hat = 1.4
```

可以做一個粗略的 Wald 95% 區間：

```text
1.4 ± 1.96 × 0.2
= 1.4 ± 0.392
= [1.008, 1.792]
```

這個區間的語境是：「在大樣本近似與模型假設下，參數估計值 1.4 的標準誤約為 0.2，95% Wald 區間約為 1.008 到 1.792。」

考試常只要求你從 information 算 standard error；但你最好也能說出直覺：資訊量 25 比資訊量 4 代表曲率更大、山更尖，標準誤也更小。

## score、information 和 curvature

如果 log likelihood 是 `ell(theta)`，一階導數叫 score：

```text
score = d ell(theta) / d theta
```

MLE 的內部條件通常是 score 等於 0，也就是山頂附近斜率為 0。二階導數則看曲率。Fisher information 可以用 score 的變異或負二階導數的期望來表示；入門階段先抓住同一個方向：它在量資料對參數的敏感度。

資訊量大，代表參數一動，likelihood 變化很明顯。資訊量小，代表不同參數產生的資料分布很像，資料很難分辨。

## 這在 ML / AI 哪裡會用到

大型神經網路通常不會完整計算 Fisher information matrix，因為參數太多。但這個概念仍然出現在幾個地方。

第一是 uncertainty estimation。你不只想知道權重或係數是多少，也想知道它穩不穩。線性模型、logistic regression、廣義線性模型常能用類似方法估係數標準誤。

第二是 natural gradient。一般 gradient 看參數空間裡往哪裡走會讓 loss 降低；natural gradient 會考慮模型分布對參數變化的敏感度，背後就和 Fisher information 有關。

第三是模型可識別性。若不同參數設定都產生很像的輸出，資料很難告訴你哪個參數對。這會讓估計不穩，也會讓解釋模型係數時更危險。

## 常見錯誤

- 把 information 大解釋成資料筆數一定多；資料量常會增加資訊，但資訊量還取決於模型和資料分布。
- 忘記 information 和 standard error 通常是反向關係。
- observed information、expected Fisher information、information matrix 混在一起。
- 多參數題仍用單參數倒數公式，忽略 covariance。
- 在 ML 裡只談點估計，不問參數或預測的不確定性。

## 練習題

1. 若 observed information 是 16，估計標準誤約是多少？
2. 用一句話解釋 likelihood 曲率越大，standard error 通常越小。
3. 說明單參數 information 和多參數 information matrix 的差別。
4. 寫一個 learned parameter uncertainty 的 ML/AI 場景，例如 logistic regression 係數或 calibrated classifier。

## 下一篇怎麼接

Fisher information 讓我們從 likelihood 估標準誤。下一篇會用 likelihood 直接比較模型：Likelihood Ratio Test 會問，完整模型比受限模型多出的彈性，是否真的讓資料合理很多。

## 章節級參考對照

- OpenIntro / OpenStax：standard error、Wald interval 與 likelihood-based inference 基礎。
- Stanford CS109：likelihood 曲率、score 和參數不確定性直覺。
- scikit-learn：logistic regression 係數、模型校準與不確定性討論的應用語境。

## 參考資料

- [Fisher Information, Standard Error, and Likelihood Inference in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Confidence Intervals and Standard Error](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Linear Models: Logistic Regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [scikit-learn Probability Calibration](https://scikit-learn.org/stable/modules/calibration.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
