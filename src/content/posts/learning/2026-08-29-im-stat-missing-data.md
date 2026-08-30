---
title: "缺資料不只是空格：它會怎麼扭曲統計和模型？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 49
tldr: "缺資料不只是空格：它會怎麼扭曲統計和模型？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 49 篇：缺資料不只是空格：它會怎麼扭曲統計和模型？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-missing-data-en)

前面談多變量分析時，我們假設資料表裡每個欄位都有值。真實資料很少這麼乾淨。問卷有人不填收入，App log 會漏事件，醫療資料會少檢驗值，LLM 評估資料也可能缺標註或缺人工複核。

缺資料不是單純空格。它會改變樣本代表性、扭曲平均數、影響檢定，也會讓 ML 模型學到錯誤訊號。考試常問 MCAR、MAR、MNAR、complete-case analysis、imputation；ML/AI 實務則會碰到 dataset bias、logging failure、label missing 和 subgroup evaluation。

## 這篇先解決什麼問題

看到缺資料，第一個問題不是「要不要補平均」。第一個問題是：

```text
資料為什麼缺？
```

如果缺失原因和資料值沒有關係，直接刪掉也許只是降低樣本數。如果缺失原因和某些已觀察變數有關，你可以用那些變數幫忙修正。如果缺失原因和缺掉的值本身有關，問題就更棘手。

缺資料會影響三件事：

```text
estimate: 平均、比例、迴歸係數可能偏掉
uncertainty: 樣本變少，不確定性通常變大
generalization: 模型學到的族群可能不是你要服務的族群
```

## 核心直覺

常見分類有三種。

MCAR，missing completely at random。缺失和任何資料值都無關。例如系統隨機壞掉，導致一小部分問卷答案沒有存到。這種情況下，complete-case analysis 主要損失 precision。

MAR，missing at random。缺失和已觀察變數有關，但在控制這些變數後，缺失和缺掉的值本身沒有額外關係。例如年輕使用者比較不填收入，但在同一年齡層裡，是否填收入和實際收入沒有系統性關係。這時候可以用年齡、職業、地區等已觀察變數做 imputation 或 weighting。

MNAR，missing not at random。缺失和缺掉的值本身有關。例如高收入者更不願意填收入。你看不到的收入值，正是造成缺失的原因之一。這時候單靠資料表裡已有欄位通常不夠，需要敏感度分析、外部資料或更強的研究設計。

考試答案不必把分類講得很華麗。真正要寫清楚的是：你的處理方法隱含哪種缺失機制假設。

## 公式 / 機制

常見處理方式有幾類。

complete-case analysis：只保留完整資料列。

```text
只分析沒有 NA 的樣本
```

它簡單，但如果缺失不是 MCAR，估計可能偏。

mean imputation：用平均值補缺失。

```text
missing income -> mean(observed income)
```

它容易壓低變異，因為補進去的值都太集中。後續如果把補值當成真實觀察，標準誤也可能太小。

indicator method：加一個「是否缺失」欄位。

```text
income_missing = 1 if income is missing else 0
```

在 ML 中常見，因為 missingness 本身可能是訊號。但在統計推論裡要小心，它不會自動解決偏誤。

multiple imputation：產生多份補值資料，分別分析，再合併結果。它承認補值有不確定性，比單一平均補值誠實。

model-based imputation：用其他變數預測缺失值。例如用年齡、職業、地區預測收入。這仍然依賴模型與缺失機制假設。

## 一步一步算例

假設你想估某平台使用者平均月收入，觀察到資料如下：

| 使用者 | 收入 |
|---|---:|
| A | 40 |
| B | 45 |
| C | 50 |
| D | 缺 |
| E | 缺 |

只看完整資料，平均是：

```text
(40 + 45 + 50) / 3 = 45
```

如果 D、E 是因為系統隨機漏存，45 可能只是樣本少造成不穩。

但如果 D、E 都是高收入者，真實收入分別是 90、100，完整平均應該是：

```text
(40 + 45 + 50 + 90 + 100) / 5 = 65
```

complete-case analysis 會把平均低估成 45。

若用 observed mean 補值，D、E 都補 45：

```text
(40 + 45 + 50 + 45 + 45) / 5 = 45
```

平均仍然低估，而且變異被壓小。這個例子說明：補值不是把格子填滿就好。缺失機制如果和收入本身有關，平均補值只是把問題藏起來。

考試作答可以照這個順序：

1. 判斷缺失可能是 MCAR、MAR 或 MNAR。
2. 說明 complete-case 是否可能偏。
3. 若補值，說明用哪些變數補，以及補值不確定性如何處理。
4. 最後報告限制。

## 這在 ML / AI 哪裡會用到

ML/AI 的缺資料常不長得像空白格。

標註缺失：某些族群、語言、題型比較少被人工標註。模型評估看起來不錯，但其實只代表標註完整的族群。

log missing：工具呼叫失敗、事件追蹤漏記、使用者離線行為沒有進資料庫。你以為模型沒有造成副作用，只是副作用沒有被記錄。

selection missing：只有願意留下回饋的人會被收進 dataset。滿意或不滿意的人更容易回覆時，評估會偏向極端。

subgroup missing：長尾任務、少數語言、低頻錯誤沒有足夠樣本。整體 accuracy 穩定，不代表每個群體都穩。

在 AI 評估報告裡，缺資料至少要留下三件事：

```text
missing rate: 哪些欄位或族群缺多少
missing mechanism: 可能為什麼缺
sensitivity check: 不同處理方式下結論是否改變
```

缺資料屬於評估可信度的一部分，不能被塞到資料清理的尾巴。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目只說「有 missing values」，先問缺失機制。
- 問 complete-case analysis，要寫出什麼條件下比較合理。
- 問 imputation，要說明補值方法、使用變數，以及補值後仍有不確定性。
- 題目接到 ML/AI 時，把 missingness 當成可能的 bias source，不要只當前處理細節。

## 常見錯誤

- 一律刪掉缺資料列，沒有檢查刪掉的是哪些人。
- 用平均補值後，假裝資料從來沒有缺過。
- 忘記補值會影響變異、相關和標準誤。
- 在 ML 裡只看模型是否接受 NA，忽略缺失本身代表資料收集偏誤。
- 報告只寫「已處理 missing values」，沒有說處理規則。

## 練習題

1. 比較 MCAR、MAR、MNAR：每一種缺資料機制各寫一個例子。
2. 用收入例子說明 complete-case analysis 如何低估平均。
3. 為什麼 mean imputation 可能壓低變異？
4. 在 AI dataset 中，如果某些語言的人工標註缺失較多，會如何影響模型評估？
5. 寫一段報告文字，交代 missing rate、處理方法和限制。

## 下一篇怎麼接

missing data 逼你面對資料生成機制。下一篇進到 Monte Carlo simulation：當公式不好算或流程太複雜時，怎麼用重複模擬看統計量和決策會怎麼波動。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐抽樣偏誤、資料品質、估計與結果解釋的基本概念。
- Stanford CS109 支撐資料生成、樣本代表性與條件資訊的直覺。
- scikit-learn evaluation 文件支撐資料切分與評估流程；本文延伸到 missingness、subgroup evaluation 和 dataset bias。
- 本文把 missing data 接到 logging failure、label missing、selection bias 和 AI 評估報告限制。

## 參考資料

- [Missing data、MCAR、MAR、MNAR、imputation、complete-case analysis 與 dataset bias：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
