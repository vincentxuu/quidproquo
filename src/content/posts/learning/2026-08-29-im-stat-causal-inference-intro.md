---
title: "因果推論入門：為什麼預測準不代表真的有效？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 45
tldr: "因果推論入門：為什麼預測準不代表真的有效？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 45 篇：因果推論入門：為什麼預測準不代表真的有效？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-causal-inference-intro-en)

前面談 A/B testing 時，最理想的答案是 randomization：把人隨機分到 control 和 treatment，兩組差異就比較能解讀成改動效果。因果推論處理的是更麻煩的場景：你沒有完美實驗，手上只有觀察資料，卻仍然想回答「這件事有沒有造成結果改變」。

這篇先建立因果推論的入門骨架。考試常問 association、causation、confounder、treatment effect；ML/AI 實務則會在推薦系統、廣告投放、教育科技、醫療風險模型裡問：模型預測誰會買、誰會流失、誰會通過，是否等於知道該把資源給誰？

## 這篇先解決什麼問題

先分清楚兩種問題。

第一種是預測問題：看到使用者資料後，預測他下週是否購買。這問的是：

```text
P(Y = 1 | X)
```

第二種是因果問題：如果對這位使用者推送推薦卡片，購買機率會不會變高。這問的是：

```text
Y(1) - Y(0)
```

`Y(1)` 是接受 treatment 後的結果，`Y(0)` 是沒有接受 treatment 時的結果。真正想知道的是同一個單位在兩種處置下的差異。

麻煩在這裡：同一個人在同一個時間點只能走其中一條路。你看得到 `Y(1)`，就看不到他的 `Y(0)`；你看得到 `Y(0)`，就看不到他的 `Y(1)`。這個看不到的結果叫 counterfactual。

## 核心直覺

因果推論的核心在可比性。模型再複雜，兩組原本差很多，效果估計仍然會歪掉。

假設你想知道推薦系統是否增加購買率。你拿「有看到推薦的人」和「沒有看到推薦的人」直接比，前者購買率比較高。這個結果還不能解讀成推薦有效，因為兩組人原本就可能不同。

會看到推薦的人，可能本來就比較常登入、看過更多商品、接近結帳、或已經被系統判定為高意圖。這些變數同時影響「是否看到推薦」和「是否購買」，它們就是 confounders。

因果推論的第一個動作是把問題拆成四個角色：

```text
unit: 被觀察的單位，例如使用者、公司、班級、病人
treatment: 是否接受處置，例如看到推薦、收到折價券、使用新介面
outcome: 要衡量的結果，例如購買、留存、分數、成本
confounder: 同時影響 treatment 和 outcome 的變數
```

如果這四個角色講不清楚，後面的公式通常只是包裝。

## 公式 / 機制

常見目標是 average treatment effect，簡寫 ATE：

```text
ATE = E[Y(1) - Y(0)]
```

如果 treatment 是推薦卡片，outcome 是購買，ATE 就是在問：平均而言，推薦卡片讓購買結果改變多少？

隨機實驗之所以重要，是因為 random assignment 讓 treatment group 和 control group 在期望上可比。兩組的年齡、活躍程度、消費能力、既有偏好，平均來說不會系統性偏向某一組。這時候：

```text
E[Y(1) | T = 1] - E[Y(0) | T = 0]
```

才比較接近我們想要的：

```text
E[Y(1) - Y(0)]
```

觀察資料沒有這個保障。你必須用研究設計、控制變數、matching、weighting、difference-in-differences、instrumental variables 等方法補上可比性，而且每一種方法都有假設。

## 一步一步算例

假設你在分析一個課程平台的新推薦區塊。資料如下：

| 群組 | 人數 | 購買人數 | 購買率 |
|---|---:|---:|---:|
| 有看到推薦 | 1,000 | 180 | 18% |
| 沒看到推薦 | 1,000 | 100 | 10% |

直覺會算：

```text
18% - 10% = 8%
```

但這 8 個百分點不能直接叫推薦效果。現在補一個變數：上週登入次數。你發現有看到推薦的人大多是高活躍使用者。

把使用者分成高活躍和低活躍：

| 活躍度 | 群組 | 人數 | 購買人數 | 購買率 |
|---|---|---:|---:|---:|
| 高活躍 | 有推薦 | 800 | 160 | 20% |
| 高活躍 | 無推薦 | 200 | 36 | 18% |
| 低活躍 | 有推薦 | 200 | 20 | 10% |
| 低活躍 | 無推薦 | 800 | 64 | 8% |

在高活躍使用者中，差距是：

```text
20% - 18% = 2%
```

在低活躍使用者中，差距是：

```text
10% - 8% = 2%
```

若用各組人數加權，效果大約也是 2 個百分點。原本的 8 個百分點，大部分其實來自活躍度分布不同。這就是 confounding 的威力：表面差距很大，調整後可能只剩一小段。

考試看到這類題目，不要急著做檢定。先問三件事：

1. treatment 是否隨機分配？
2. 兩組在重要背景變數上是否可比？
3. 若不可比，題目有沒有給分層、配對、控制變數或權重？

## 這在 ML / AI 哪裡會用到

推薦系統最容易混淆預測和因果。

預測模型會找出「誰比較可能購買」。因果問題要找的是「對誰出手會增加購買」。這兩件事不同。高意圖使用者本來就會買，對他推更多訊息可能只是浪費曝光；中等意圖使用者可能才是 treatment effect 最大的人。

廣告投放也一樣。模型可以預測誰會點擊，但平台真正想知道的是 incremental lift：這次曝光多帶來多少額外行動。沒有因果設計，廣告看起來常常很有效，實際上只是找到原本就會買的人。

在 AI 產品評估裡，因果推論會出現在：

- recommender：推薦是否增加購買、學習時長或留存。
- LLM feature rollout：新摘要功能是否降低客服工時。
- education AI：提示或個人化練習是否提高測驗表現。
- policy evaluation：新策略如果上線，結果會不會比舊策略好。
- fairness analysis：某個介入是否真的縮小群體差距。

所以你學因果推論，不是為了把所有觀察資料都硬解成因果；是為了知道什麼時候不能這樣解讀，以及要補哪一層設計。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 看到 cause、effect、impact、intervention，先圈 treatment、outcome、unit。
- 題目只給相關係數或迴歸係數時，先檢查是否有 random assignment 或控制混雜。
- 問「效果」時，不要只回答模型準確率；要說明比較對象怎麼建立。
- 題目提到 observational study，答案要主動交代 confounders 和限制。

## 常見錯誤

- 把「使用者有使用功能且結果較好」解讀成功能造成結果。
- 忘記同一個 unit 不能同時觀察 `Y(1)` 和 `Y(0)`。
- 只控制容易取得的變數，卻沒有討論重要但未觀察的 confounder。
- 把 predictive accuracy 當成 causal effect 的證據。
- 看到兩年考古題沒有出現因果推論，就以為不用學。這個主題是 A/B testing、觀察研究與 ML 評估的橋。

## 練習題

1. 某平台發現「收到折價券的人購買率較高」。列出 treatment、outcome、unit、至少兩個可能 confounders。
2. 解釋為什麼 `P(Y=1|T=1) - P(Y=1|T=0)` 通常不能直接當 ATE。
3. 用上面的推薦區塊例子，說明為什麼分層後效果從 8 個百分點降到 2 個百分點。
4. 在 LLM 客服產品中，若使用新摘要功能的客服處理時間較短，列出一個可能的反向因果或選擇偏誤。
5. 寫一段考試答案：什麼情況下 randomized experiment 可以支持因果解釋？什麼情況下 observational study 需要保留限制？

## 下一篇怎麼接

因果推論先告訴你問題卡在可比性。下一篇會進到 matching 和 weighting：當你沒有完美 randomization，統計上能怎麼讓兩組在已觀察變數上更像。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐觀察研究、實驗設計、混淆因子與因果解讀的入門語言。
- Stanford CS109 支撐條件機率、資料生成過程與反事實比較的直覺。
- scikit-learn evaluation 文件支撐「預測評估」的邊界，本文用來對照 predictive modeling 和 causal question 的差異。
- 本文的 ML/AI 接點放在 recommender、policy evaluation、feature rollout 和 incremental lift。

## 參考資料

- [Causal inference、observational study、confounding、treatment effect 與 randomized experiment：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
