---
title: "Bayesian inference 怎麼把 prior、資料與 posterior 串起來？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 33
tldr: "Bayesian inference 怎麼把 prior、資料與 posterior 串起來？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 33 篇：Bayesian inference 怎麼把 prior、資料與 posterior 串起來？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-bayesian-inference-en)

前面幾篇都站在頻率派推論的角度：參數固定、樣本會變，所以我們用抽樣分布、信賴區間和檢定來處理不確定性。Bayesian inference 換了一個問法：看到資料之後，我對未知參數的信念應該怎麼更新？

這個問法對初學者很有吸引力，也很容易被講歪。貝氏推論不是「比較主觀」的代名詞，也不是只要先寫一個 prior 就結束。它是一套嚴格的更新規則：prior 表示資料前的信念，likelihood 表示資料對不同參數的支持，posterior 表示更新後的不確定性。

## prior、likelihood、posterior 各自負責什麼

Bayesian inference 的核心公式是 Bayes rule：

```text
p(theta | data) = p(data | theta) p(theta) / p(data)
```

考試和實作裡常把它寫成：

```text
posterior proportional to likelihood × prior
```

`p(theta)` 是 prior。它描述觀察資料之前，哪些參數值比較合理。prior 可以很弱，也可以很強；重點是要說得出理由。

`p(data | theta)` 是 likelihood。它問的是：如果參數是某個值，現在這批資料出現的合理程度有多高？

`p(theta | data)` 是 posterior。它是你看完資料後對參數的更新信念。posterior 通常是一整個分布，單點摘要只是後續選擇。

分母 `p(data)` 負責標準化，讓 posterior 的總機率等於 1。做 MAP 或比較相對大小時常可暫時忽略它；要算完整 posterior、posterior mean 或 credible interval 時就不能忽略。

## conjugate prior 為什麼好用

入門考試常用 conjugate prior，因為它讓 posterior 維持同一個分布族。

最常見例子是 Beta-Binomial。假設成功機率是 `p`，prior 是：

```text
p ~ Beta(alpha, beta)
```

接著觀察到 `x` 次成功、`n - x` 次失敗。posterior 會變成：

```text
p | data ~ Beta(alpha + x, beta + n - x)
```

這裡的 `alpha` 和 `beta` 可以想成 prior 帶來的成功與失敗傾向。這些分布參數表達的是更新前的信念強度，更新後再和觀察到的成功、失敗次數合併。

## 手算例題：Beta prior 更新成 posterior

假設你在評估一個新模型對題目的答對率。上線前沒有強烈信念，所以先用 uniform prior：

```text
p ~ Beta(1, 1)
```

現在抽 10 題測試，模型答對 8 題、答錯 2 題。也就是：

```text
x = 8
n - x = 2
```

posterior 是：

```text
p | data ~ Beta(1 + 8, 1 + 2)
         = Beta(9, 3)
```

posterior mean 是：

```text
9 / (9 + 3) = 0.75
```

樣本答對率是：

```text
8 / 10 = 0.8
```

兩者不同，因為 posterior mean 同時受到 prior 和資料影響。這裡 prior 很弱，所以 posterior mean 只從 0.8 稍微往 0.5 拉回一些。

如果 prior 改成 `Beta(20, 20)`，同樣資料會得到：

```text
Beta(28, 22)
posterior mean = 28 / 50 = 0.56
```

這代表 prior 很強，10 題資料不夠把信念大幅推走。結果看起來離樣本答對率很遠，原因在 prior 強度。考試問解釋時，要能說出 prior 對 posterior 的影響。

## credible interval 和 confidence interval 差在哪裡

Bayesian credible interval 可以直接用 posterior 解釋。例如 95% credible interval 表示在模型與 prior 設定下，參數有 95% posterior probability 落在該區間。

頻率派 confidence interval 的語言不同。它講的是同一程序在重複抽樣下的長期 coverage。

這兩種句子不能混用。考試遇到 Bayesian inference，先看題目是否明確要求 posterior probability、credible interval、prior 更新。若題目仍站在重複抽樣的信賴區間語言，就不要把它改寫成 posterior 機率。

## 題型怎麼辨識

看到 prior、posterior、conjugate、Beta-Binomial、Normal-Normal，通常是在考 Bayesian updating。

看到「find posterior distribution」，先寫 likelihood，再乘 prior，最後整理成已知分布族。

看到「posterior mean」或「posterior mode」，要分清楚它們不是同一個量。posterior mean 是平均；posterior mode 是 posterior 最大的位置，也就是下一篇會談的 MAP。

看到「credible interval」，解釋要回到 posterior probability，不要套信賴區間的長期 coverage 語言。

## 這在 ML / AI 哪裡會用到

Bayesian inference 在 ML/AI 裡最有用的地方，是把「模型不確定」講成可計算的分布，而不是只給一個分數。

小樣本評估是一個典型場景。新產品功能剛上線，只收了少量使用者回饋；如果只看樣本平均，很容易被前幾筆資料帶著跑。Bayesian 更新能把既有知識和新資料放在同一個公式裡，讓報告比較誠實。

Bayesian optimization 也是同一個精神。你不只估哪組超參數可能最好，也估每個區域的不確定性，再決定下一次要探索哪裡。

在 LLM 系統裡，Bayesian 思維也會出現在不確定性估計、active learning、資料標註優先順序和風險決策。你不需要把所有模型都改成 Bayesian；真正要養成的是判斷單一點估計何時不足以支撐決策。

## 常見錯誤

- 把 prior 當成隨便填的偏見，沒有說明它如何影響 posterior。
- 寫了 likelihood × prior，卻忘記 posterior 需要標準化。
- 把 posterior mean、posterior mode、MAP 混在一起。
- 用 confidence interval 的 coverage 語言解釋 credible interval。
- 小樣本時只報樣本比例，沒有說明 prior 強度和 posterior 不確定性。

## 練習題

1. Beta(2,2) prior 下觀察到 8 次成功、2 次失敗，寫出 posterior 的 Beta 參數。
2. 用一行式子標出 prior、likelihood、posterior：哪一個來自資料前信念，哪一個來自觀察資料？
3. 計算上一題 posterior mean，並和樣本成功率 0.8 比較。
4. 某模型只測 12 題答對 10 題。你會如何用 Bayesian 語言提醒讀者：目前資料支持高答對率，但不確定性仍然大？

## 下一篇怎麼接

Bayesian inference 給出整個 posterior。下一篇會看其中一個常用摘要：MAP。當你只取 posterior 最大的位置時，prior 會在最佳化問題裡變成 regularization penalty。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐條件機率、Bayes rule 與基本推論語言。
- Stanford CS109 支撐從 prior 到 posterior 的機率更新觀念。
- 本文的 ML/AI 應用放在小樣本評估、active learning 與 uncertainty-aware decision，不把 Bayesian inference 簡化成只求一個參數。

## 參考資料

- [本篇主題 Bayesian Inference Basics：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
