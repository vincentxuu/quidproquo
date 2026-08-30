---
title: "Logistic regression 怎麼從機率走到 threshold 和錯誤成本？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 37
tldr: "Logistic regression 怎麼從機率走到 threshold 和錯誤成本？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 37 篇：Logistic regression 怎麼從機率走到 threshold 和錯誤成本？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-logistic-regression-deep-dive-en)

第一層已經看過 logistic regression：目標變數是 0/1 時，不適合直接用線性迴歸預測機率。第三層要往下問：logistic regression 估出機率後，為什麼還要另外決定 threshold？係數、likelihood、confusion matrix、錯誤成本之間怎麼連在一起？

這是很多分類模型報告會混在一起的地方。模型訓練在估機率，產品決策在切類別；accuracy、precision、recall 則是在評估切完之後的結果。把這幾層分開，你才不會看到係數顯著就以為分類決策也合理。

## 為什麼要用 log odds

logistic regression 不直接讓 `p` 等於一條直線，因為機率必須落在 0 到 1 之間。線性組合 `X beta` 可以是任意實數，直接當機率會跑出負數或大於 1。

所以模型改成讓 log odds 等於線性組合：

```text
log(p / (1 - p)) = beta0 + beta1 x1 + ... + betak xk
```

左邊的 `p / (1 - p)` 是 odds。若 `p = 0.8`，odds 是：

```text
0.8 / 0.2 = 4
```

表示成功機會和失敗機會的比例是 4 比 1。取 log 後，odds 被轉成可以和線性模型相接的尺度。

## 係數要用 odds ratio 解釋

若模型只有一個變數：

```text
log(p / (1 - p)) = beta0 + beta1 x
```

`beta1` 表示 `x` 增加一單位時，log odds 增加 `beta1`。如果轉回 odds ratio，就是：

```text
odds ratio = exp(beta1)
```

例如 `beta1 = 0.7`：

```text
exp(0.7) approximately 2.01
```

可以解釋成：「在其他變數固定下，`x` 增加一單位，事件發生的 odds 約變成原來的 2.01 倍。」

這不是機率直接增加 0.7，也不是機率變成 2 倍。odds ratio 對不同基準機率會轉成不同的機率差。

## likelihood 和 binary cross entropy

對每筆資料，`y_i` 只有 0 或 1。模型預測事件發生機率是 `p_i`。Bernoulli likelihood 可以寫成：

```text
p_i^(y_i) (1 - p_i)^(1 - y_i)
```

整批資料的 log likelihood 是每筆加總：

```text
sum_i [y_i log(p_i) + (1 - y_i) log(1 - p_i)]
```

MLE 會最大化這個 log likelihood。機器學習常說的 binary cross entropy，通常就是 negative log likelihood：

```text
- sum_i [y_i log(p_i) + (1 - y_i) log(1 - p_i)]
```

所以 logistic regression 不是和 ML 分類 loss 分開的東西。它就是一個機率模型版本的二元分類器。

## 手算例題：從係數到機率再到類別

假設模型是：

```text
log(p / (1 - p)) = -1 + 0.8x
```

當 `x = 2`：

```text
log odds = -1 + 0.8 × 2 = 0.6
odds = exp(0.6) approximately 1.82
```

從 odds 轉回機率：

```text
p = odds / (1 + odds)
  = 1.82 / 2.82
  approximately 0.65
```

若 threshold 是 0.5，這筆會被判成正類。

若正類是「高風險交易」，而誤擋正常交易成本很高，產品可能把 threshold 拉到 0.8。此時同一筆 `p = 0.65` 的資料就不會被判成正類。

模型沒有變，決策規則變了。這是 logistic regression 和分類器評估最重要的分界。

## threshold 是錯誤成本問題

threshold 降低，通常會抓到更多正類，recall 上升；同時 false positive 也可能變多，precision 下降。

threshold 提高，通常會讓正類判定更保守，precision 可能上升；但可能漏掉更多真正正類，recall 下降。

所以 threshold 不應該固定背 0.5。0.5 只是在錯誤成本對稱、機率校準合理、類別比例沒有特殊考量時常見的預設。

在詐欺偵測、醫療篩檢、LLM 安全分類、垃圾訊息偵測裡，false positive 和 false negative 的成本通常完全不同。決策規則要跟成本、容量和風險容忍度一起設計。

## calibration 也要看

Logistic regression 輸出的是機率估計，但「模型有輸出 0.8」不保證真的有 80% 的案例會發生。這牽涉 calibration。

如果模型常把 0.8 的案例實際命中率只做到 0.6，它的排序可能仍有用，但機率解釋就不可靠。這在 AI 系統很常見：模型分數可用來排序，卻不能直接當真實風險。

考試通常先考 log odds、odds ratio、likelihood；實務報告還要補 threshold、confusion matrix、ROC / PR curve 和 calibration。

## 題型怎麼辨識

看到二元 `Y`，先想 logistic regression 或 Bernoulli GLM。

看到係數解釋，請用 log odds 或 odds ratio，不要直接講機率差。

看到 threshold、confusion matrix、precision、recall，題目已經從機率估計走到分類決策。

看到模型機率是否可信，重點轉到 calibration，不只看 accuracy。

## 這在 ML / AI 哪裡會用到

Logistic regression 是二元分類最重要的 baseline 之一。它夠簡單，能讓你快速檢查 feature 方向、資料洩漏、類別不平衡和 threshold 成本。

在 LLM 安全分類器裡，模型可能輸出某段內容違規的機率。是否要攔截，取決於 threshold。平台若想降低漏放風險，會選比較低的 threshold；若誤擋使用者成本很高，就需要提高 threshold 或加人工審核區間。

在推薦系統和廣告點擊預測裡，logistic regression 也常作為可解釋 baseline。即使最後使用樹模型或深度模型，log odds、calibration、threshold、PR curve 仍然是報告分類模型時必懂的語言。

## 常見錯誤

- 把 logistic 係數當成機率增加量。
- 忘記 `exp(beta)` 解釋的是 odds ratio。
- 訓練時看 binary cross entropy，分類時卻沒有交代 threshold。
- 只報 accuracy，沒有看 precision、recall、類別比例和錯誤成本。
- 把模型輸出的分數直接當機率，沒有檢查 calibration。

## 練習題

1. 寫出 `log(p/(1-p)) = b0 + b1x`，並用一句話解釋 `b1` 對 odds 的影響。
2. 若 `b1 = 0.7`，算出 odds ratio `exp(b1)` 的近似值，並寫出語境解釋。
3. 若 `log odds = 0.6`，先算 odds，再把它轉成機率。
4. 說明 logistic regression 輸出機率後，為什麼分類 threshold 仍然是另一個決策問題。
5. 在 AI 分類器中，accuracy 很高但 calibration 很差時，機率解釋會出現什麼風險？

## 下一篇怎麼接

Logistic regression 是 GLM 的一個特例。下一篇會把視野打開：不同 response type 該配哪種分布、哪種 link function，為什麼 ordinary linear regression、logistic regression、Poisson regression 可以放在同一個框架裡。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐 logistic regression、log odds、odds ratio 與二元反應變數模型。
- Stanford CS109 支撐機率模型與分類判斷的基礎語言。
- scikit-learn 支撐分類器、threshold、probability estimates 與 model evaluation 情境。

## 參考資料

- [Logistic regression、log odds、odds ratio、binary cross entropy 與分類 threshold：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
