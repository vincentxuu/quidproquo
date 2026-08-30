---
title: "估計、檢定、likelihood、Bayes 要怎麼放在同一張推論地圖？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 35
tldr: "估計、檢定、likelihood、Bayes 要怎麼放在同一張推論地圖？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 35 篇：估計、檢定、likelihood、Bayes 要怎麼放在同一張推論地圖？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-inference-map-review-en)

第二層學到這裡，很多人會有一種混亂感：點估計、standard error、信賴區間、假設檢定、likelihood、LRT、Bayes、bootstrap 都看過了，可是一拿到題目，還是不知道要先從哪裡下手。

這篇把第二層整理成一張推論地圖，不再增加新公式。考試時你要先判斷題目在問哪一種問題；做 ML/AI 評估時，你也要先判斷報告需要的是單點估計、區間、檢定、模型比較，還是不確定性更新。

## 第一個問題：我要估什麼

點估計回答的是「最合理的一個數字是多少」。樣本平均、樣本比例、迴歸係數、MLE、MAP 都可以是點估計。

看到題目問 `estimate`、`find MLE`、`compute sample mean`、`fit regression coefficient`，你先進估計問題。

但點估計通常不是答案的終點。你還要問：這個數字穩不穩？如果換一批樣本，它會晃多大？這就是 standard error、抽樣分布和信賴區間要處理的事。

## 第二個問題：我要量不確定性嗎

如果題目問 confidence interval、standard error、sampling distribution，重點就是估計量的不確定性。

常見流程是：

```text
estimate -> sampling variability -> interval
```

如果估計量有明確標準誤，就走公式區間。若樣本夠大，可用漸近常態。若估計量是轉換後的函數，可能用 delta method。若公式很難推，或你想保留資料結構，就考慮 bootstrap。

這些工具不是互相排斥。它們常是在回答同一個問題的不同路線：這個估計值有多不穩？

## 第三個問題：我要做決策嗎

假設檢定回答的是「在某個虛無假設下，這批資料是否夠極端到需要拒絕」。它給的是決策規則，不只是一個估計數字。

看到 `H0`、`H1`、`p-value`、`alpha`、`reject`、`power`，你就進檢定問題。

檢定和信賴區間常有關係。對很多雙尾檢定來說，95% 信賴區間若不包含虛無假設值，常對應 5% 顯著水準下拒絕。但兩者語言不同：區間給範圍，檢定給決策。

Neyman-Pearson 觀點再往前一步：先控制第一型錯誤，再追求 power。這對分類 threshold、詐欺偵測、LLM 安全分類都很有幫助。

## 第四個問題：我要比較模型嗎

Likelihood 提供的是模型和資料之間的相容性語言。MLE 在一個模型內找最合理參數；LRT 比較 nested models，看完整模型比受限模型多出的彈性是否帶來足夠 likelihood 提升。

看到 `likelihood`、`log likelihood`、`full model`、`restricted model`、`nested`，你要先檢查模型關係。LRT 的常見卡方近似需要 nested condition；非 nested 模型比較通常要換 AIC、BIC、cross-validation 或 held-out performance。

在 ML/AI 裡，模型比較不只看訓練分數。更自由的模型本來就容易在訓練資料上更好，真正要報告的是這個改善是否能跨到 validation/test set，且不確定性有多大。

## 第五個問題：我要更新信念嗎

Bayesian inference 把未知參數當成不確定量，用 prior、likelihood、posterior 表達更新。

看到 prior、posterior、credible interval、MAP、conjugate prior，就進 Bayesian 語言。這時你要小心不要混用頻率派信賴區間的 coverage 解釋。

MAP 是 posterior mode。它和 regularization 的連接來自：

```text
log posterior = log likelihood + log prior + constant
```

Gaussian prior 會帶出 L2 penalty，Laplace prior 會帶出 L1 penalty。這讓 regularization 從工程技巧變成一種參數偏好。

## 手算例題：同一個模型比較問題的五種問法

假設模型 A 在 500 題測試集答對 405 題，模型 B 答對 420 題。

點估計先算 accuracy：

```text
A = 405 / 500 = 0.81
B = 420 / 500 = 0.84
difference = 0.03
```

若只寫「B 比 A 高 3 個百分點」，這只是點估計。

信賴區間問的是差距穩不穩。若兩模型回答的是同一批題目，應該看 paired difference，而不是把兩個 accuracy 當完全獨立。可以用 paired bootstrap 重抽題目，得到差距的區間。

假設檢定可以設定：

```text
H0: A and B have equal performance
H1: B is better than A
```

接著用合適的 paired test 或重抽樣方法判斷資料是否足以拒絕 `H0`。

Likelihood 問法會把答對/答錯建成 Bernoulli 或 logistic model，再比較模型是否需要加入「model identity」這個因素。

Bayesian 問法則會給 A、B 的答對率 prior，觀察資料後得到 posterior，最後問 `P(p_B > p_A | data)` 或 posterior difference interval。

同一份資料可以有多種答案。考試要你選對題目語言；實務報告要你說清楚自己選了哪種語言。

## 錯題要怎麼整理

不要只把錯題分類成「信賴區間錯」「檢定錯」。那太粗。

比較有用的整理方式是把錯因貼到推論地圖上：

- 我把估計目標看錯了嗎？
- 我把標準差和標準誤混在一起嗎？
- 我忘記檢查近似條件嗎？
- 我把區間語言和檢定語言混用嗎？
- 我把 likelihood model 的關係看錯了嗎？
- 我把 prior、posterior、MAP 混在一起嗎？
- 我忽略 paired / cluster 這類資料結構嗎？

這樣整理才會跨題型進步。因為研究所考試不會只考你看過的兩年題目，它會換包裝測同一批推論觀念。

## 這在 ML / AI 哪裡會用到

ML/AI 的實驗報告也可以用這張圖檢查。

報告單一模型時，你至少要有點估計和不確定性：accuracy、F1、win rate、latency，以及它們的區間或重抽樣結果。

比較兩個模型時，你要保留 paired design，因為同一題對兩模型的難度通常相關。只看兩個平均分數會浪費實驗設計，也可能高估差距。

調 regularization 或選模型時，你要分清楚 training loss、validation performance、test report。訓練分數回答的是擬合；validation 才是選擇；test 才適合做最後報告。

讀論文時，這張圖也很好用。看到 ablation table，問它有沒有 uncertainty；看到 likelihood objective，問它有沒有 regularization；看到 Bayesian baseline，問它是否真的使用 posterior，還是只用了 MAP。

## 常見錯誤

- 把所有題目都當成公式代入題，沒有先判斷問題類型。
- 把信賴區間、credible interval、prediction interval 混在一起。
- 檢定只寫 p-value，沒有寫 `H0`、`H1`、顯著水準和語境結論。
- LRT 沒檢查 nested model。
- Bootstrap 沒檢查抽樣單位。
- ML 模型比較只看單點分數，沒有看 paired difference 和不確定性。

## 練習題

1. 把一個模型比較問題拆成五種問法：點估計、信賴區間、假設檢定、likelihood、Bayesian inference。每一種寫一句它回答什麼。
2. 給定兩模型 accuracy 差 1.5 個百分點、測試集 500 題，且兩模型回答同一批題目。你會先選哪個推論工具？為什麼？
3. 寫出一個錯誤報告句：「新模型平均分數較高，所以一定比較好。」請改成包含不確定性與資料限制的版本。
4. 整理自己的錯題表：每題標一個錯因，例如標準誤、檢定語言、nested condition、prior/posterior、抽樣單位。

## 下一篇怎麼接

第二層到這裡收束。下一篇進入第三層，開始把統計推論放回模型本身：OLS 的假設壞掉時，迴歸線還能怎麼解釋、預測和診斷？

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐本層所有推論工具的入門定義：估計、區間、檢定與重抽樣。
- Stanford CS109 支撐抽樣分布、likelihood 與 Bayesian 更新的連接點。
- scikit-learn Model Evaluation 支撐模型評估情境；本篇把統計工具整理成面對 ML/AI 評估問題時的選擇流程。

## 參考資料

- [統計推論地圖：估計、信賴區間、檢定、likelihood、Bayesian inference 與 bootstrap：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
