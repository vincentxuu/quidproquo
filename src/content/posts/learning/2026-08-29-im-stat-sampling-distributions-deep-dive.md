---
title: "抽樣分配怎麼從公式變成考試可用的判斷？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 22
tldr: "抽樣分配描述統計量在重複抽樣下的波動；平均、比例、變異數各有常用分布，信賴區間和檢定都從這裡長出來。"
description: "抽樣分配深入導讀：樣本平均、樣本比例、樣本變異數、chi-square、CLT，以及模型評估指標的不確定性。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-sampling-distributions-deep-dive-en)

很多推論公式看起來像突然出現：平均數信賴區間、比例檢定、卡方檢定、t 檢定。其實它們都在回答同一個問題：如果我們重複抽樣，每次都算同一個統計量，這個統計量會怎麼分布？

抽樣分配不是你手上那批原始資料的分布。原始資料分布描述 `Xi` 長什麼樣；抽樣分配描述 `xbar`、`phat`、`s^2` 這些統計量在重複抽樣下怎麼動。這個差別一旦混掉，標準誤、p 值和信賴區間都會跟著錯。

## 樣本平均的抽樣分配

如果 `X1, ..., Xn` 是 iid，且：

```text
E[Xi] = mu
Var(Xi) = sigma^2
```

樣本平均：

```text
xbar = (X1 + ... + Xn) / n
```

會有：

```text
E[xbar] = mu
Var(xbar) = sigma^2 / n
SE(xbar) = sigma / sqrt(n)
```

如果母體本來就是常態，`xbar` 也會是常態。若母體不一定常態，樣本數夠大時，中央極限定理會讓 `xbar` 近似常態。這就是很多平均數題能用 z 或 t 近似的原因。

## 樣本比例的抽樣分配

比例題可以從 Bernoulli 開始看。每一筆結果是成功或失敗，成功機率是 `p`。樣本比例：

```text
phat = 成功次數 / n
```

它的期望值和變異數是：

```text
E[phat] = p
Var(phat) = p(1 - p) / n
SE(phat) = sqrt(p(1 - p) / n)
```

實務上 `p` 不知道，常用 `phat` 代入估標準誤。樣本數夠大時，`phat` 可以用常態近似。考試題若要比例信賴區間或比例檢定，通常就是在用這個抽樣分配。

## 樣本變異數為什麼接到卡方

平均和比例常用常態近似，樣本變異數則常接到 chi-square。若母體是常態分布，樣本變異數 `s^2` 有：

```text
((n - 1)s^2) / sigma^2 ~ chi-square(df = n - 1)
```

這條式子很常出現在變異數推論。它的條件也要記住：母體常態是重要假設。若題目問變異數的信賴區間或檢定，通常會給常態母體或暗示這個設定。

## 手算例題：比例估計會抖多大

假設某分類器在未來資料上的真正正確率是 `p = 0.6`，現在每次測試抽 `n = 100` 題。樣本正確率 `phat` 的標準誤是：

```text
SE = sqrt(0.6 × 0.4 / 100)
   = sqrt(0.0024)
   ≈ 0.049
```

這表示即使真正正確率是 0.6，你一次測到 0.57 或 0.62 都不奇怪。這些數字不一定代表模型突然變好或變差，也可能只是抽樣波動。

若樣本數改成 400：

```text
SE = sqrt(0.6 × 0.4 / 400)
   = sqrt(0.0006)
   ≈ 0.0245
```

樣本數變成 4 倍，標準誤大約變一半。這就是為什麼測試集大小會直接影響 benchmark 排名的可靠度。

## 這在 ML / AI 哪裡會用到

模型評估分數有抽樣分配。accuracy、F1、win rate、平均 latency、平均人工評分，都可以視為測試資料上的統計量。你換一批測試資料，統計量就可能改變。

小型 benchmark 特別需要這個觀念。若兩個模型分數只差 1%，但測試集很小，這個差距可能落在抽樣波動裡。若任務是同一批 prompt 比較兩模型，還要進一步用成對設計或 bootstrap，而不是只拿兩個總平均相減。

抽樣分配也會影響 monitoring。線上模型每天的錯誤率上下波動，可能是資料量少造成的自然變動，也可能是真正 drift。沒有抽樣分配的概念，你會分不清警訊和噪音。

## 常見錯誤

- 把原始資料的分布當成統計量的抽樣分配。
- 樣本數增加時，只說資料變多，沒有說標準誤如何縮小。
- 比例題忘記 `p(1 - p) / n`，直接套平均數公式。
- 樣本變異數推論忘記母體常態假設。
- 看模型分數波動時，沒有先估測試集大小帶來的自然變動。

## 練習題

1. 若 `p = 0.4`、`n = 100`，計算 `phat` 的 standard error。
2. 說明 `xbar` 的抽樣分配和原始 `Xi` 的資料分布有什麼不同。
3. 寫出樣本變異數接到 chi-square 分布時需要的母體假設。
4. 設計一個小測試集 accuracy 波動的例子，說明抽樣分配如何影響模型排名。

## 下一篇怎麼接

抽樣分配讓我們能描述統計量的波動。下一篇會用這個基礎正式比較估計量品質：bias、variance、MSE 和 consistency 各自檢查什麼。

## 章節級參考對照

- OpenIntro / OpenStax：樣本平均、樣本比例與樣本變異數的抽樣分配。
- Stanford CS109：CLT、重複抽樣與 standard error。
- scikit-learn：evaluation metric distribution、測試集大小與模型比較語境。

## 參考資料

- [Sampling Distributions and Standard Error in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: The Central Limit Theorem and Sampling Distributions](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Metrics and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn Cross-Validation and Model Selection](https://scikit-learn.org/stable/modules/cross_validation.html)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
