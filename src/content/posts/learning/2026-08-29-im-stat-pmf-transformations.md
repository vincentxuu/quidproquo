---
title: "聯合分布和 PMF 轉換題，怎麼不漏格？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 18
tldr: "聯合 PMF 題要把所有格子列完；邊際化、條件機率和變數轉換，本質上都是對原始格子的加總與重新分組。"
description: "Joint PMF 與變數轉換入門：從 2x2 機率表、marginal、conditional 到 Z=X+Y 的完整手算。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-pmf-transformations-en)

聯合分布題最常錯在漏格。你看到題目問 `P(X + Y = 1)`，很容易只想到 `(1,0)`，忘記 `(0,1)` 也會讓 `X + Y` 等於 1。PMF 轉換題真正卡住的地方，通常是原本所有可能的格子沒有列乾淨。

joint PMF 可以想成一張機率表。每一格是一組 `(x, y)` 的機率。邊際分布是沿著列或欄加總；條件分布是先固定某個條件，再在剩下的格子裡重新標準化；變數轉換則是把舊表格依照新變數的值重新分組。

## 三個動作：加總、限縮、重分組

若有 joint PMF `p(x, y)`，`X` 的邊際分布是：

```text
pX(x) = sum_y p(x, y)
```

意思是固定 `x`，把所有可能的 `y` 加起來。`Y` 的邊際分布則是：

```text
pY(y) = sum_x p(x, y)
```

條件分布是：

```text
p(x | y) = p(x, y) / pY(y)
```

分母是在提醒你：既然已經知道 `Y = y`，就只在這個條件留下的世界裡重新分配機率。

如果新變數 `Z = g(X, Y)`，那 `Z` 的 PMF 是：

```text
pZ(z) = sum over all (x, y) where g(x, y) = z of p(x, y)
```

白話說，就是找出哪些原始格子會被映到同一個 `z`，再把那些格子的機率加起來。

## 手算例題：2x2 joint PMF

假設 `X` 和 `Y` 都只會取 0 或 1，joint PMF 如下：

| X | Y | P(X, Y) |
| ---: | ---: | ---: |
| 0 | 0 | 0.10 |
| 0 | 1 | 0.20 |
| 1 | 0 | 0.30 |
| 1 | 1 | 0.40 |

第一件事先檢查總和：

```text
0.10 + 0.20 + 0.30 + 0.40 = 1
```

這是合法 PMF。

接著算 `X` 的邊際分布。固定 `X = 0`，把 `Y = 0` 和 `Y = 1` 加起來：

```text
P(X = 0) = 0.10 + 0.20 = 0.30
```

固定 `X = 1`：

```text
P(X = 1) = 0.30 + 0.40 = 0.70
```

再算一個條件機率。若題目問 `P(X = 1 | Y = 1)`，先找分子：

```text
P(X = 1, Y = 1) = 0.40
```

再找分母：

```text
P(Y = 1) = 0.20 + 0.40 = 0.60
```

所以：

```text
P(X = 1 | Y = 1) = 0.40 / 0.60 = 2/3
```

## 變數轉換：Z = X + Y

現在定義新變數：

```text
Z = X + Y
```

`Z` 可能取 0、1、2。逐一列出來源格子：

```text
Z = 0: (X, Y) = (0, 0)
Z = 1: (X, Y) = (1, 0), (0, 1)
Z = 2: (X, Y) = (1, 1)
```

因此：

```text
P(Z = 0) = P(0, 0) = 0.10
P(Z = 1) = P(1, 0) + P(0, 1) = 0.30 + 0.20 = 0.50
P(Z = 2) = P(1, 1) = 0.40
```

最後再檢查：

```text
0.10 + 0.50 + 0.40 = 1
```

這個檢查很重要。PMF 轉換題如果漏格，總和常常不會是 1。考場上就算時間很趕，也要留 10 秒做這一步。

## 這在 ML / AI 哪裡會用到

很多 probabilistic model 都在操作 joint probability。Naive Bayes 會把 label 和 features 的 joint probability 拆開近似；HMM 會處理看得見的 observation 和看不見的 hidden state；topic model 也會在文件、主題、詞之間建立機率關係。

ML 評估裡也常有類似結構。你可能同時記錄「資料來源」與「模型是否答對」，這就是一張 joint table。你可以邊際化掉資料來源，只看整體 accuracy；也可以固定某個來源，檢查該來源下的錯誤率。若你只看總分，可能會漏掉某一群資料表現特別差。

LLM 應用也一樣。假設你關心「檢索是否命中」和「回答是否正確」，兩者形成四格表：命中且正確、命中但錯、未命中卻正確、未命中且錯。這張表比單一 accuracy 更能告訴你系統哪裡壞。

## 常見錯誤

- 沒列完整 `(x, y)` 組合就開始加總。
- 算 `P(X = 1 | Y = 1)` 時，分母用錯成 `P(X = 1)`。
- 變數轉換時漏掉映到同一個新值的其他格子。
- 算完 PMF 沒檢查非負與總和為 1。
- 把 joint probability、marginal probability、conditional probability 混在同一句解釋裡。

## 練習題

1. 自己畫一張 2x2 joint PMF 表，確認四格機率總和為 1。
2. 由 joint PMF 算出 `P(X = 0)`、`P(X = 1)`、`P(Y = 0)`、`P(Y = 1)`。
3. 令 `Z = X + Y`，列出每個 `z` 對應哪些 `(x, y)` 格子。
4. 設計一個 retrieval 系統的四格表：檢索命中與否、回答正確與否，說明每格代表什麼。

## 下一篇怎麼接

第一層的統計工具到這裡已經足夠讀大部分入門考題。下一篇會回到台大資管 114–115 的考古題入口，示範如何拆題，而不是把兩年題目誤當成完整命題範圍。

## 章節級參考對照

- OpenIntro / OpenStax：joint PMF、marginal distribution、conditional probability 與離散變數轉換。
- Stanford CS109：離散機率表、random variables 與 probabilistic model 語感。
- scikit-learn：Naive Bayes、分類模型與錯誤分析表格。

## 參考資料

- [Joint Distributions and PMF Transformations in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Discrete Random Variables and Probability](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Naive Bayes](https://scikit-learn.org/stable/modules/naive_bayes.html)
- [scikit-learn Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
