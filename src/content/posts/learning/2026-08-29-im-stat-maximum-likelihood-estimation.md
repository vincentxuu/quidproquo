---
title: "MLE 為什麼是在問：哪個參數最可能生成這批資料？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 25
tldr: "MLE 把資料固定、比較不同參數讓這批資料出現的合理程度；log likelihood 讓乘積變加總，也接上 ML 的 negative log loss。"
description: "Maximum Likelihood Estimation 入門：likelihood、log likelihood、Bernoulli MLE 推導，以及 cross entropy 與 next-token loss 的連接。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-maximum-likelihood-estimation-en)

Method of Moments 用 summary 對 summary。MLE 換了一個問法：如果模型分布已經選好，哪個參數讓目前這批資料看起來最合理？

這個問法是統計推論和機器學習訓練的重要橋樑。你在考試裡最大化 likelihood；在 ML 裡最小化 loss。很多時候，這兩件事只是正負號和寫法不同。

## likelihood 不是資料的機率報告

假設資料已經觀察到了。MLE 的視角會把資料固定，拿不同參數來比較。

```text
data: fixed
parameter: candidate to compare
```

如果單筆資料的機率或密度是 `f(x; theta)`，iid 樣本的 likelihood 常寫成：

```text
L(theta) = product over i of f(x_i; theta)
```

實作和手算常改用 log likelihood：

```text
ell(theta) = sum over i of log f(x_i; theta)
```

取 log 有兩個好處。第一，乘積變加總，微分比較容易。第二，很多很小的機率相乘會造成數值問題，log 形式比較穩。

MLE 就是：

```text
theta_hat = argmax_theta ell(theta)
```

白話說：找出讓這批資料 log likelihood 最大的參數。

## 手算例題：Bernoulli 的 MLE

假設 `X1, ..., Xn` 來自 Bernoulli(`p`)。每筆資料只有 0 或 1。觀察到 `n` 筆中有 `k` 次成功。

單筆資料的機率可以寫成：

```text
P(X = x) = p^x (1 - p)^(1 - x)
```

整批資料的 likelihood 是：

```text
L(p) = product over i of p^(x_i) (1 - p)^(1 - x_i)
```

因為成功次數總和是 `k`，失敗次數是 `n - k`，所以可整理成：

```text
L(p) = p^k (1 - p)^(n - k)
```

log likelihood：

```text
ell(p) = k log p + (n - k) log(1 - p)
```

對 `p` 微分：

```text
d ell / dp = k / p - (n - k) / (1 - p)
```

令微分等於 0：

```text
k / p = (n - k) / (1 - p)
k(1 - p) = p(n - k)
k = np
p_hat = k / n
```

所以 Bernoulli 成功機率的 MLE 是樣本比例。若 `n = 20`、成功 `k = 7`：

```text
p_hat = 7 / 20 = 0.35
```

答案不要只寫 0.35。完整語境是：「在 Bernoulli 模型與 iid 假設下，讓這批 20 筆資料 likelihood 最大的成功機率估計為 0.35。」

## MLE 和 MoM 差在哪裡

MoM 抓幾個 summary statistic，例如樣本平均或二階矩，讓它們對上理論值。MLE 看整批資料在模型下的 likelihood。兩者有時會得到同樣答案，例如 Bernoulli 的 `p_hat = k/n`；有時會不同。

考試若問 Method of Moments，就先寫理論矩和樣本矩。若問 MLE，就先寫 likelihood 或 log likelihood。不要直接把答案背成同一個估計式，因為題目真正看的是推導路徑。

## 這在 ML / AI 哪裡會用到

binary classification 的 log loss 可以從 Bernoulli negative log likelihood 來理解。若模型對第 `i` 筆資料預測正類機率 `p_i`，真實標籤是 `y_i`，常見 loss 是：

```text
- [y_i log p_i + (1 - y_i) log(1 - p_i)]
```

這就是 Bernoulli log likelihood 加負號。訓練時最小化平均 log loss，等價於最大化資料在模型下的 likelihood。

語言模型的 next-token training 也能用同樣語言看。模型對正確下一個 token 給出機率；negative log likelihood 會懲罰模型把正確 token 機率給太低。cross entropy 可以看成 likelihood 觀點在分類和序列預測中的常見形式。

## 常見錯誤

- 把 likelihood 解釋成「參數為真的機率」。
- 忘記 MLE 是資料固定、參數拿來比較。
- likelihood 乘積寫對了，但 log likelihood 漏掉次數整理。
- 微分求最大值後沒有確認參數範圍，例如 `0 < p < 1`。
- 在 ML 裡背 cross entropy，卻不知道它和 negative log likelihood 的關係。

## 練習題

1. 對 Bernoulli(`p`) 樣本寫出 likelihood 與 log likelihood。
2. 若 `n = 20`、成功 `k = 7`，用 MLE 估 `p`，並寫語境結論。
3. 說明為什麼實作常用 log likelihood，而不是 likelihood 乘積。
4. 把 binary cross entropy 用 negative log likelihood 的語言解釋一次。

## 下一篇怎麼接

MLE 給你一個參數估計值。下一篇會追問這個估計值有多穩：Fisher information 會用 likelihood 在估計點附近的曲率，連到參數的不確定性與 standard error。

## 章節級參考對照

- OpenIntro / OpenStax：likelihood、log likelihood、Bernoulli model 與 MLE 基礎。
- Stanford CS109：MLE、機率模型和資料生成觀點。
- scikit-learn：log loss、cross entropy 和分類模型訓練語境。

## 參考資料

- [Maximum Likelihood Estimation and Log Likelihood in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Probability Distributions and Estimation](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Log Loss and Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#log-loss)
- [scikit-learn Linear Models: Logistic Regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
