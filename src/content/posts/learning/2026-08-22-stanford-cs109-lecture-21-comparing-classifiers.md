---
title: "Stanford CS109 Lecture 21｜Comparing Classifiers：accuracy 之外還要問 calibration、錯誤成本與 fairness"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, machine-learning]
lang: zh-TW
series:
  name: "Stanford CS109 導讀"
  order: 22
tldr: "比較 classifier 不能只看 accuracy；還要用 held-out data、baseline、calibration、precision/recall 與明確的 fairness criterion。"
description: "逐題導讀 Stanford CS109 Summer 2026 Lecture 21：Naive Bayes、overfitting、calibration、precision/recall、decision-tree entropy 與 fairness。"
draft: false
---

> 🌏 [English version](/posts/learning/2026-08-22-stanford-cs109-lecture-21-comparing-classifiers-en)

這是 [Stanford CS109 導讀](/series/stanford-cs109)第 22 篇，對應 **Summer 2026 Lecture 21: Comparing Classifiers**（Jul 29），講者為 Chris Gregg。本文依官方 [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture21-Worksheet.pdf)、[answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture21-AnswerKey.pdf)與 [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture21-LLMPrompts.pdf)整理。

本講是 **L2**：worksheet 四頁 P1–P8 加 Platt challenge，key 五頁，只省略 P8 pset7 解答；guide 三頁六 concepts。當期投影片不可用、錄影限 Canvas。

## P1：Logistic Regression refresher

`θ=[-1,3,-1]`、`x=[1,1,1]` 時，`z=1`、`ŷ=σ(1)=0.7311`。真實 `y=1`，所以 `∂LL/∂θ₁=x₁(y-ŷ)=0.2689`，gradient ascent 增加 `θ₁`。負的 `θ₂` 表示 feature 2 會把預測推離 class 1。

## P2：Brute-force Bayes 與 Naive Bayes

`m` 個 binary features 需要 `O(2^m)` cells；`m=22` 已約 420 萬 assignments，`m=100` 是 `2^100≈1.3×10^30`。真正瓶頸是資料：467 samples 最多填 467 cells，其他 conditional estimates 沒有證據。

Naive Bayes 假設 features 在給定 class 後 conditionally independent：

```text
P(x₁,…,xₘ|y)=∏ⱼP(xⱼ|y)
```

參數量降為 `O(m)`。假設常不完全真實，卻讓估計成為可能。

## P3：Beta prior 避免 zero-probability veto

100 筆中 30 positives，prior `Beta(3,4)` 給 posterior `Beta(33,74)`，mean `33/107≈0.3084`。Prior pseudo-count success rate 高於 0.30，因此向上微調。若某 feature 在 positives 中從未為 1，MLE 給零，prediction product 便會讓單一 unseen value 否決整個 positive class；prior 以非零小機率修正。

## P4：train、test、baseline 與 overfitting

看到 99.8% accuracy，第一問是「train 還是 test？」表中 Random Forest 的 train/test 為 0.8726/0.8500，gap 0.0226 最大。這 2 percentage points 是否可靠，仍需 test-set size 與 bootstrap interval。Always-positive baseline 已有 0.5887，沒有 baseline 就不知道 learned model 是否真正增值。XOR 展示 linear boundary 的限制；interaction features 可在 expanded space 改變 separability。

## P5：calibration 不等於 accuracy

五組 observed positive fractions 是 `0.08,0.30,0.52,0.75,0.70`，前三、四組接近 stated probabilities，0.9 bucket 明顯 overconfident。該組 threshold accuracy 是 0.70；若真的 `Bin(100,0.9)`：

```text
P(X=70)=C(100,70)0.9^70 0.1^30 ≈ 1.8×10^-8
```

這不像 sampling noise。永遠輸出 base rate 的模型可 perfectly calibrated，卻沒有 discrimination。

## P6：precision、recall 與錯誤成本

Confusion matrix 給 `TP=40,FP=10,FN=20,TN=130`：accuracy `0.85`、precision `0.80`、recall `2/3`。Always-negative baseline accuracy 仍有 `0.70`，recall 為零。降低 threshold 通常提高 recall、降低 precision。Fraud 或 medical screening 該優先哪一個，必須由 false-positive／false-negative 成本決定。

## P7：fairness 不是單一數字

`P(G=1|D=1)=0.30`、`P(G=1|D=0)=0.50`，ratio `0.60`，未通過 80% rule。Positive predictions 的 correctness 則是 `48/60=0.80` 與 `70/100=0.70`，gap 0.10，在 `ε=0.2` 下通過 relaxed calibration。模型可通過一個 criterion、失敗另一個，因此必須說明採用哪種 fairness。刪除 protected column 也不夠，correlated proxies 仍可重建 demographic signal。

## P8：Decision-tree entropy

Root 有 40/80 positives，故 entropy 為 1 bit。Left child 的 `p=17/52`，right child 的 `p=23/28`：

```text
H_left ≈ 0.912
H_right ≈ 0.677
E[H_child] = (52/80)H_left+(28/80)H_right ≈ 0.830
information gain ≈ 0.170 bits
```

P8 是 pset7 題，公開 key 刻意省略；數值依公開 prompt 計算。

## Optional challenge：Platt recalibration

`q=σ(a p̂-0.5)`。當 `p̂=0.9,a=2`，`q=σ(1.3)≈0.7858`。對 held-out pairs：

```text
LL(a)=Σᵢ[yᵢlog qᵢ+(1-yᵢ)log(1-qᵢ)]
∂LL/∂a=Σᵢp̂ᵢ[yᵢ-σ(ap̂ᵢ-0.5)]
```

以 gradient ascent 求 `a`。必須用 held-out validation data，否則 original model 在 training data 的樂觀 probabilities 會讓 recalibrator 低估修正需求。

## 如何使用 LLM Learning Guide

依序練 brute-force Bayes、Naive Bayes、train/test、calibration、precision/recall、fairness。每題先自行計算，再要求模型指出第一個錯誤，並追問 metric 背後是哪種 error cost 或 fairness definition。

## 材料邊界

- Worksheet 四頁 P1–P8 加 challenge；五頁 key 只省略 P8。
- Guide 三頁六 concepts，無額外題目。
- 當期投影片不可用、錄影限 Canvas。

## 參考資料

- [Schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 21 page](https://web.stanford.edu/class/cs109/lectures/21-ComparingClassifiers)
- [Worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture21-Worksheet.pdf)
- [Answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture21-AnswerKey.pdf)
- [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture21-LLMPrompts.pdf)
- [Course reader](https://probabilitycoders.stanford.edu/spr26)
