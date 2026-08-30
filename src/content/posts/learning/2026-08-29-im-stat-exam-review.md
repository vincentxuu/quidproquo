---
title: "混合題來了，要怎麼在 30 秒內判斷工具？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 20
tldr: "考前最後階段要練的是題型辨識：先判斷資料型態、未知量與決策目標，再選公式，最後用語境結論收束。"
description: "第一層統計考前複習：30 秒判斷工具、14 天安排、錯題歸因，以及 ML/AI 評估題的拆解流程。"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-exam-review-en)

考前最怕的通常是混合題。題目可能先講資料收集，再問估計範圍，最後要你做檢定或解釋迴歸表。你如果只靠關鍵字找公式，很容易在第一步就選錯工具。

第一層學到這裡，目標是建立一套上考場能用的判斷順序。看到題目後，先花 30 秒回答三件事：資料是什麼型態？題目要估計、檢定、比較還是建模？答案需要數字、解釋，還是兩者都要？

## 30 秒工具判斷表

可以把第一層整理成這張表：

| 題目線索 | 優先想到的工具 | 先檢查 |
| --- | --- | --- |
| 一批數值資料的中心與波動 | 描述統計、平均、變異數 | 是否有 outlier、單位是否一致 |
| 事件、條件、獨立 | 機率、條件機率、Bayes | 條件放在分母還是分子 |
| PMF、CDF、joint table | 隨機變數、邊際化、條件分布 | 所有格子是否列完、總和是否為 1 |
| 樣本平均推母體平均 | 標準誤、CLT、信賴區間 | `sigma` 是否已知、樣本數是否合理 |
| 是否有差異或效果 | 假設檢定 | H0/H1、單尾雙尾、alpha |
| 兩組平均或比例 | two-sample、paired、two-proportion | 兩組是否獨立、outcome 是數值還是二元 |
| 類別次數表 | 卡方適合度或獨立性 | 一個類別變數還是兩個類別變數 |
| 三組以上平均 | ANOVA | outcome 是否為數值、是否需要後續比較 |
| 一個 X 預測一個 Y | simple linear regression | 斜率、截距、殘差、因果限制 |
| 迴歸輸出表 | coef、SE、t、F、R2 | 單一係數、整體模型、解釋力分開讀 |
| 二元 outcome | logistic regression | log odds、odds ratio、threshold |

這張表不是拿來背的，是拿來練反射動作。你做題時先遮住公式，強迫自己寫出「這題到底是哪一類資料問題」。

## 14 天怎麼排

如果只剩兩週，建議分三段。

前 5 天補基礎。每天挑一塊：描述統計、機率、隨機變數、抽樣分布、信賴區間與檢定。這階段不要只看解答，要自己整理每個工具回答什麼問題。

中間 6 天做混合題。每天至少做一組題目，並要求自己寫完整解答：資料型態、未知量、工具、公式、代入、結論。錯題不要只改答案，要標錯因。

最後 3 天只修錯題和作答格式。這時不要大量開新題型，因為新題型會讓你誤以為自己還有很多沒讀。真正會失分的，通常是已經見過但還沒修好的洞：H0/H1 寫反、p 值解釋錯、CI 語句錯、paired 和 independent 混用、迴歸係數亂寫因果。

## 手算例題：模型正確率是否有差

看到題目：「模型 A 和模型 B 的正確率分別是 84% 和 86%，請判斷兩者表現是否有差。」

不要立刻回答 B 比較好。先拆：

```text
資料型態：每題答對/答錯，二元 outcome
未知量：兩模型正確率差，或同一題上的成對差異
工具：兩比例比較、paired comparison，或 bootstrap
第一個追問：兩模型是否回答同一批題目？
```

如果兩模型回答不同題目，而且兩批題目可視為獨立，才比較像兩比例差異。若兩模型回答同一批題目，資料是成對的。題目難度會同時影響 A 和 B，你應該看每題誰答對、誰答錯，而不是只看兩個總分。

接著還要問樣本數。如果只有 100 題，2 個百分點差距很可能不穩；如果有 50,000 題，統計上可能很容易顯著，但產品上仍要問這 2 個百分點值不值得換模型。

這題的完整答案要包含三層：

```text
差距：B 的觀察正確率高 2 個百分點。
不確定性：需要根據測試設計估標準誤、信賴區間或檢定。
決策：若差距穩定且實務成本可接受，才有理由採用 B。
```

## 錯題要這樣記

錯題本不要只抄正解。每題至少標一個錯因：

| 錯因 | 典型症狀 | 修法 |
| --- | --- | --- |
| 概念錯 | 把 p 值說成 H0 為真的機率 | 重寫定義和一個白話例子 |
| 工具錯 | 成對資料用獨立兩樣本 | 補「是否同一批對象」判斷 |
| 代入錯 | SE 分母忘記 `sqrt(n)` | 重算兩題同型題 |
| 計算錯 | 自由度、臨界值或平方和算錯 | 寫出中間步驟 |
| 結論錯 | 只有 reject H0，沒有語境 | 每題補一句完整中文結論 |

最後一類很常被低估。統計考試不是純算術，很多題目要你把數字翻回問題。你算出 `t = -2` 或 CI `[77.872, 86.128]`，還要說它對流程時間、母體平均或模型表現代表什麼。

## 這在 ML / AI 哪裡會用到

ML/AI 工作常常也是混合題。你會同時碰到資料品質、模型選擇、metric、A/B testing、錯誤分析和不確定性。第一層統計訓練的是拆問題的順序，這個能力會一路用到模型評估和產品實驗。

例如一份模型評估報告，你可以照這個順序問：

```text
data: 測試資料是否代表上線情境？
metric: 分數衡量的是 accuracy、F1、AUC、loss，還是 win rate？
comparison: 是一個模型和基準比，還是多模型比較？
uncertainty: 有沒有信賴區間、檢定或 bootstrap？
decision: 差距是否足以支持模型替換、產品上線或流程調整？
```

這套順序能讓你不被排行榜帶著走。統計讓報告多一層檢查：分數背後有哪些風險還沒回答？

## 常見錯誤

- 看到關鍵字就套公式，沒有先判斷資料型態。
- 只練計算，不練 H0/H1、CI 和迴歸係數的語境解釋。
- 錯題只改答案，沒有標錯因。
- 最後三天大量開新題，反而沒修掉既有弱點。
- 把 ML/AI 接點誤解成考試會直接考 AI 名詞；真正要學的是同一套統計判斷。

## 練習題

1. 把最近做錯的 10 題分成概念錯、工具錯、代入錯、計算錯、結論錯。
2. 做一張 14 天複習表：前 5 天補基礎，中 6 天混合題，後 3 天錯題與格式。
3. 任選一題混合題，先寫資料型態與目標，再選公式。
4. 寫一個 ML/AI 評估題的拆題流程：data、metric、comparison、uncertainty、decision。

## 下一篇怎麼接

第一層到這裡先收束。接下來的第二層會把統計推論講得更正式：樣本、統計量、抽樣分布、點估計、method of moments、MLE、Fisher information、LRT、Neyman-Pearson、bootstrap 和 Bayesian inference。第一層讓你能解題；第二層會讓你知道這些工具為什麼成立。

## 章節級參考對照

- OpenIntro / OpenStax：第一層各題型、公式與作答語言。
- grad-exam-prep：台大資管統計備考入口與考古題動線。
- 台大圖書館考古題系統：官方題面來源；正式逐題詳解前仍需核對 PDF。
- Stanford CS109 / scikit-learn：ML/AI 評估題的 data、metric、uncertainty、decision 語言。

## 參考資料

- [OpenIntro Statistics: Inference, Regression, and Review Topics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
