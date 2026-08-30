---
title: "Delta method 怎麼估 F1、ratio 這類非線性指標的不確定性？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 31
tldr: "Delta method 怎麼估 F1、ratio 這類非線性指標的不確定性？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 31 篇：Delta method 怎麼估 F1、ratio 這類非線性指標的不確定性？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-delta-method-en)

很多統計量本身不難估，難的是你真正想報告的量常常是它的函數。你可能先估出一個比例，再想報告 log odds；先估出兩個平均，再想報告 ratio；先算 precision 和 recall，再想報告 F1。這些量都不是單純平均數。

Delta method 解決的就是這種問題：如果 `theta_hat` 的不確定性已經知道，`g(theta_hat)` 的不確定性要怎麼近似？

考試常把它寫成公式推導題，ML/AI 報告則常在複合指標裡遇到。你要抓住的核心是：函數在估計值附近的斜率，會放大或縮小原本的估計誤差。

## 從切線近似開始

假設你有一個估計量 `theta_hat`，它在真值 `theta` 附近小幅波動。若函數 `g` 在這一段夠平滑，就可以用切線近似：

```text
g(theta_hat) ≈ g(theta) + g'(theta)(theta_hat - theta)
```

這行式子的意思是：`theta_hat` 晃多少，乘上斜率 `g'(theta)`，大概就是 `g(theta_hat)` 會晃多少。

如果 `theta_hat` 近似常態：

```text
theta_hat approximately follows N(theta, Var(theta_hat))
```

那麼：

```text
g(theta_hat) approximately follows N(g(theta), [g'(theta)]^2 Var(theta_hat))
```

標準誤版本更好記：

```text
SE(g(theta_hat)) ≈ |g'(theta_hat)| × SE(theta_hat)
```

實作時通常用 `theta_hat` 代替未知的 `theta`。這也是為什麼你常看到導數代估計值。

## 手算例題：log 轉換後的標準誤

假設你估到：

```text
theta_hat = 0.25
SE(theta_hat) = 0.04
```

你想報告：

```text
g(theta) = log(theta)
```

先算導數：

```text
g'(theta) = 1 / theta
```

用 `theta_hat = 0.25` 代入：

```text
g'(theta_hat) = 1 / 0.25 = 4
```

所以：

```text
SE(log(theta_hat)) ≈ |4| × 0.04 = 0.16
```

若要做 95% 近似區間，可以先在 log scale 上寫：

```text
log(0.25) ± 1.96 × 0.16
```

算完後若需要回到原尺度，再取 exponential。很多 ratio、odds ratio 的區間都會在 log scale 上處理，因為這樣更接近常態，也能避免下界跑到負數。

## 多參數版本：gradient 和 covariance matrix

一維時只有一個導數。多維時，`theta` 變成向量，函數可能吃進多個估計量。這時導數會變成 gradient。

假設：

```text
theta_hat = (theta_hat1, theta_hat2)
```

你想估：

```text
g(theta1, theta2)
```

Delta method 會用：

```text
Var(g(theta_hat)) ≈ gradient(g)' × Cov(theta_hat) × gradient(g)
```

這行看起來比較硬，但直覺一樣：每個方向的誤差都會被函數斜率加權，估計量之間若有 covariance，也會一起影響結果。

在 ML 指標裡，F1 就很接近這種情境。F1 是 precision 和 recall 的函數；precision 和 recall 又常來自同一份 confusion matrix，所以兩者會一起變動。若要認真估 F1 的標準誤，不能把兩個 SE 分開看。

## 什麼時候 delta method 會危險

第一，函數在附近太彎。Delta method 用的是切線近似，若估計量波動範圍內函數曲率很大，切線就會失準。

第二，估計值靠近邊界。比例接近 0 時，`log(theta)` 的導數 `1 / theta` 會變很大；一點點估計誤差就會被放大。

第三，導數接近 0。這時一階近似可能抓不到主要波動，需要二階 delta method 或其他方法。

第四，樣本數不夠。Delta method 常接在大樣本近似後面；若前一步近似已經很差，後面再漂亮也沒有用。

遇到這些情況，考試要能指出風險；實務上可以改用 bootstrap、simulation，或在更適合的尺度上建區間。

## 題型怎麼辨識

看到 `g(theta_hat)`、`log(theta_hat)`、`exp(beta_hat)`、ratio、odds ratio，先想這題是不是要用 delta method。

一維題先做三步：找 `g`、算 `g'`、把 `theta_hat` 和 `SE(theta_hat)` 代入。

多維題先寫 gradient，再看題目有沒有給 covariance matrix。若只給兩個獨立估計量，covariance 可能是 0；若來自同一份資料，就不能自己假裝獨立。

## 這在 ML / AI 哪裡會用到

ML/AI 評估裡很多常用指標都是 derived metrics。F1 由 precision 和 recall 組成；relative improvement 是兩個分數的 ratio；calibration error 是分箱後誤差的函數；odds ratio 常用在 logistic regression 的解釋。

如果只報原始估計量的 SE，就會漏掉非線性轉換帶來的不確定性放大。例如一個小基準模型從 0.02 錯誤率降到 0.01，看起來是 50% 改善；但 relative improvement 的不確定性可能很大，因為分母很小。

Delta method 的價值是讓你在報告複合指標時補上一句：「這個指標不是直接觀察值，區間是用近似方法從基礎估計量傳遞過來的。」這句話能避免把漂亮的百分比寫得太確定。

## 常見錯誤

- 忘記取導數，只把原本的標準誤原封不動搬到轉換後尺度。
- 把 `g'(theta)` 的平方用錯位置；變異數要平方，標準誤用絕對值。
- 在 log scale 算完區間後，忘記轉回原尺度時上下界要取 exponential。
- 多參數題忽略 covariance matrix。
- 估計值靠近 0、1 或其他邊界時，仍然把一階近似當成穩定答案。

## 練習題

1. 若 `g(theta) = log(theta)`、`theta_hat = 0.5`、`SE(theta_hat) = 0.1`，用 delta method 估 `SE(g(theta_hat))`。
2. 若 `g(theta) = exp(theta)`、`theta_hat = 0.7`、`SE(theta_hat) = 0.2`，估 `SE(exp(theta_hat))`。
3. 說明為什麼 odds ratio 的信賴區間常先在 log odds ratio 上計算，再轉回原尺度。
4. F1 是 precision 和 recall 的函數。若 precision 和 recall 來自同一份 confusion matrix，為什麼多維 delta method 需要 covariance？

## 下一篇怎麼接

Delta method 靠平滑函數和大樣本近似來傳遞不確定性。下一篇會換一條路：當公式推導太麻煩，bootstrap 直接從樣本重抽，讓資料自己近似抽樣分布。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐標準誤與信賴區間的前置知識；delta method 是把這套語言推到轉換後估計量。
- Stanford CS109 支撐隨機變數轉換與近似思考，協助理解為何導數會放大或縮小不確定性。
- scikit-learn Model Evaluation 支撐 F1、precision、recall 等複合指標情境；本文把它們作為 ML/AI 指標不確定性的例子。

## 參考資料

- [本篇主題 Delta Method：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
