---
title: "Monte Carlo 怎麼用重複模擬回答算不動的統計問題？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 50
tldr: "Monte Carlo 怎麼用重複模擬回答算不動的統計問題？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 50 篇：Monte Carlo 怎麼用重複模擬回答算不動的統計問題？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-simulation-monte-carlo-en)

前面大多在學公式和推導。Monte Carlo simulation 換一個角度：當問題算不動、公式近似很麻煩，或流程裡有太多隨機性，就直接重複模擬很多次，看結果分布。

這不是逃避數學。模擬是把抽樣變異、錯誤率、power、風險和評估波動變成看得見的東西。考試常問 simulation steps、law of large numbers、Monte Carlo error；ML/AI 實務會用在 eval 重跑、agent 任務成功率、robustness test 和 uncertainty propagation。

## 這篇先解決什麼問題

Monte Carlo 的基本問題是：

```text
如果我知道或能假設資料生成過程，重複抽樣很多次後，某個統計量或決策會如何分布？
```

例如你想知道：

- 樣本數只有 20 時，t-test 的 power 大概多少。
- 某個信賴區間方法在偏態資料下 coverage 是否接近 95%。
- agent 同一組任務跑 5 次，成功率波動有多大。
- A/B test 中途偷看會讓 false positive 膨脹多少。

這些問題不一定都有簡單手算答案，但都可以用「生成資料 -> 跑流程 -> 收集結果」逼近。

## 核心直覺

Monte Carlo 有四個固定動作：

```text
1. 定義資料生成機制
2. 重複抽樣
3. 每次計算同一個統計量或做同一個決策
4. 彙總結果分布
```

重點是「同一個流程跑很多次」。單次結果太薄，你要看結果在不同隨機樣本下怎麼變。

模擬也有邊界。它回答的是你設定的世界。如果資料生成假設錯，模擬跑一百萬次也只是很精確地回答錯世界。

## 公式 / 機制

假設你重複模擬 `R` 次，每次得到一個統計量 `theta_hat_r`。Monte Carlo 平均是：

```text
mean(theta_hat) = (theta_hat_1 + ... + theta_hat_R) / R
```

若你估的是事件機率，例如「是否拒絕 H0」，每次結果是 0 或 1：

```text
estimated probability = number of successes / R
```

Monte Carlo error 會隨重複次數下降。對比例估計，標準誤大約是：

```text
sqrt(p(1 - p) / R)
```

如果 `p=0.05`、`R=10000`：

```text
sqrt(0.05 * 0.95 / 10000) = 0.00218
```

也就是約 0.22 個百分點。重複次數越多，模擬本身的誤差越小，但運算成本也越高。

## 一步一步算例

用硬幣例子先建立直覺：公平硬幣丟 10 次，至少 8 次正面的機率是多少？

手算可以用 binomial distribution：

```text
P(X >= 8) = P(X=8) + P(X=9) + P(X=10)
```

Monte Carlo 則這樣做：

```text
repeat 10000 times:
  toss a fair coin 10 times
  count heads
  record 1 if heads >= 8, else 0

answer = average(recorded indicators)
```

若其中 550 次達到至少 8 次正面：

```text
550 / 10000 = 0.055
```

模擬估計約 5.5%。

再看檢定 power。假設真實效果存在，但很小。你可以模擬：

```text
repeat 10000 times:
  generate treatment group data
  generate control group data
  run the planned test
  record whether p-value < 0.05

power estimate = rejection count / 10000
```

如果拒絕 3,200 次：

```text
power = 3200 / 10000 = 0.32
```

這代表在你設定的效果大小、樣本數和資料分布下，檢定只有約 32% 機率抓到效果。這比只背「p < 0.05」更接近實驗設計問題。

## 這在 ML / AI 哪裡會用到

AI 評估常有隨機性。LLM 生成有 sampling，agent 工具有外部狀態，retrieval 結果會受 index 和 query 改寫影響，人工評分也有變異。

Monte Carlo 思維會出現在幾個地方：

- agent eval：同一任務重跑多次，看成功率與失敗模式是否穩定。
- robustness test：改 prompt、資料順序、噪音或輸入長度，看結果分布。
- uncertainty propagation：上游分類錯誤會如何影響下游決策。
- offline policy simulation：在假設環境中測不同策略的表現。
- cost risk：估 token cost、latency 或工具呼叫次數的尾端風險。

例如你評估一個客服 agent，共 100 題，每題跑 5 次。若同一題有時成功、有時失敗，單次 accuracy 會掩蓋穩定性問題。報告應該寫成功率分布、任務級變異和高風險題型，而不是只挑一次最好分數。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目說 simulation / Monte Carlo，先寫資料生成規則。
- 回答要包含重複次數、每次計算什麼、最後彙總什麼。
- 估比例時可用 `successes / R`。
- 寫限制時要說：模擬結論依賴資料生成假設。

## 常見錯誤

- 只說「跑很多次」，沒有定義每次怎麼產生資料。
- 忘記固定或記錄 random seed，導致結果難以重現。
- 模擬次數太少，卻把小差距講成穩定結論。
- 把模擬世界當真實世界，沒有檢查假設。
- 在 agent eval 裡只報一次跑分，忽略重跑波動。

## 練習題

1. 寫出 Monte Carlo simulation 的四步驟：資料生成、重複抽樣、計算統計量、彙總結果。
2. 用模擬估計丟公平硬幣 10 次至少 8 次正面的機率，描述流程與估計公式。
3. 若 `R=10000`、成功 470 次，估計機率是多少？
4. 說明 simulation 能檢查公式近似，卻仍然依賴資料與假設本身。
5. 在 agent evaluation 中，為什麼同一任務要重跑多次？報告要多寫哪些資訊？

## 下一篇怎麼接

Monte Carlo 讓你看見隨機波動；reproducible workflow 讓別人能重跑同一套流程。下一篇會把資料、程式、seed、環境和報告串成可審查的統計工作流。

## 章節級參考對照

- OpenIntro、OpenStax 與 Stanford CS109 支撐以模擬理解機率、抽樣分布與不確定性的做法。
- scikit-learn Model Evaluation 支撐模型評估指標；本文延伸到 agent eval 的重複試驗與波動報告。
- 本文把 Monte Carlo 接到 power、coverage、robustness、uncertainty propagation 和 cost risk。

## 參考資料

- [Simulation、Monte Carlo、sampling variability、power、coverage 與 uncertainty：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
