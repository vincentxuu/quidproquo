---
title: "Neyman-Pearson 觀點在說哪一種最佳檢定？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 28
tldr: "Neyman-Pearson 把檢定看成決策規則：在固定第一型錯誤 alpha 下，選出 power 最高的拒絕區域。"
description: "Neyman-Pearson 觀點入門：alpha、beta、power、likelihood ratio、most powerful test，以及分類器 threshold 的 ML 類比。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-neyman-pearson-en)

前面學假設檢定時，我們多半從 p-value 進場。Neyman-Pearson 觀點會把焦點拉到另一個地方：檢定其實是一套決策規則。你要先決定哪些資料結果會讓你拒絕 `H0`，再問這套規則在錯誤風險和檢定力之間表現如何。

這個觀點很適合接到 ML/AI，因為分類器也在做類似的事。你設定 threshold，決定哪些案例判成正類；同時你要控制 false positive，也想提高 true positive。統計檢定和分類決策的語言不完全一樣，但問題意識很接近。

## alpha、beta、power

先把三個量分清楚。

`alpha` 是第一型錯誤機率：

```text
alpha = P(reject H0 | H0 true)
```

也就是 H0 其實成立，你卻拒絕它。這常被稱為 false positive。

`beta` 是第二型錯誤機率：

```text
beta = P(fail to reject H0 | H1 true)
```

也就是 H1 其實成立，你卻沒有拒絕 H0。檢定力 power 是：

```text
power = 1 - beta = P(reject H0 | H1 true)
```

Neyman-Pearson 的精神是：在固定 alpha 的限制下，讓 power 盡量高。換句話說，你先控制錯殺 H0 的風險，再追求更容易抓到真實差異。

## most powerful test 在哪個設定下成立

Neyman-Pearson lemma 的經典設定是 simple H0 對 simple H1。simple 的意思是兩邊都完全指定分布，沒有一堆未知參數。

在這個設定下，最有力的檢定會用 likelihood ratio 排序資料結果。直覺上，如果某個觀察結果在 H1 下比在 H0 下合理很多，它就更應該落在拒絕區域。

可以寫成：

```text
likelihood ratio = f1(x) / f0(x)
```

其中 `f1(x)` 是資料在 H1 下的機率或密度，`f0(x)` 是資料在 H0 下的機率或密度。檢定規則會把 likelihood ratio 足夠大的結果放進 rejection region，並讓整個拒絕區域的 H0 機率不超過 alpha。

## 手算例題：同樣 alpha 下比較 power

假設你有兩個檢定規則 A 和 B，都把第一型錯誤控制在：

```text
alpha = 0.05
```

在某個 H1 下，它們的 power 分別是：

```text
power(A) = 0.80
power(B) = 0.65
```

在相同 alpha 限制下，A 比 B 更有力。語境結論可以寫：「若兩個檢定都把第一型錯誤控制在 5%，A 在 H1 成立時更常成功拒絕 H0，因此對該 H1 有較高檢定力。」

這題看起來簡單，但它檢查的是順序。先確認 alpha 是否相同，再比較 power。若 A 的 power 比較高只是因為它把 alpha 放得更寬，這就不是公平比較。

## 跟 p-value 的關係

p-value 是看觀察到的資料在 H0 下有多極端。Neyman-Pearson 觀點更強調事前的拒絕規則：在 alpha 限制下，哪些結果會被放進 rejection region。

入門考試裡，你可以把兩者接起來看。選定 alpha 後，p-value 小於 alpha 時拒絕 H0；這等於資料落進你事先定義的拒絕區域。Neyman-Pearson 則追問：如果 H1 是某個明確替代分布，怎麼選這個拒絕區域才最有力？

## 這在 ML / AI 哪裡會用到

分類器 threshold 是最直覺的類比。假設你做詐欺偵測，正類是詐欺。threshold 降低，抓到更多詐欺，true positive rate 可能上升；同時 false positive 也可能上升，更多正常交易被擋下。

若產品要求 false positive rate 不超過 5%，你就在固定錯殺風險下尋找較高 true positive rate 的決策規則。這和「固定 alpha、提高 power」非常接近。

ROC curve 也可以這樣看。每個 threshold 對應一組 false positive rate 和 true positive rate。重點放在不同決策規則如何交換錯誤成本，而不只是一個模型分數。

LLM 安全分類、垃圾訊息偵測、醫療篩檢、金融風控都會遇到這種選擇。統計檢定的語言能提醒你：threshold 不是技術細節，它是在配置錯誤風險。

## 常見錯誤

- 把 power 和 p-value 混在一起。
- 比較兩個檢定 power 時，忘記確認 alpha 是否相同。
- 以為 Neyman-Pearson lemma 適用所有複雜假設檢定。
- 只背 likelihood ratio，沒有說明 rejection region 是決策規則。
- 在 ML 分類器裡調 threshold，卻沒有說清楚 false positive 和 false negative 成本。

## 練習題

1. 寫出 alpha、beta、power 的定義，並各配一個檢定決策情境。
2. 比較兩個 alpha 相同但 power 不同的檢定，說明哪個較好。
3. 用 likelihood ratio 說明 rejection region 如何排序資料結果。
4. 把 classifier threshold 類比成控制 false positive rate 的決策規則。

## 下一篇怎麼接

Neyman-Pearson 讓你用決策規則看檢定。下一篇會回到信賴區間，但不再只看 t 表：一般信賴區間可以從估計量、標準誤、近似分布、bootstrap 或 likelihood 觀點建起來。

## 章節級參考對照

- OpenIntro / OpenStax：第一型錯誤、第二型錯誤、power 與 hypothesis testing 基礎。
- Stanford CS109：likelihood ratio、decision rule 和檢定直覺。
- scikit-learn：ROC、threshold、false positive rate 與 classifier decision boundary。

## 參考資料

- [Neyman-Pearson, Power, and Hypothesis Testing in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Hypothesis Testing, Type I Error, Type II Error, and Power](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn ROC Metrics and Classification Thresholds](https://scikit-learn.org/stable/modules/model_evaluation.html#roc-metrics)
- [scikit-learn Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
