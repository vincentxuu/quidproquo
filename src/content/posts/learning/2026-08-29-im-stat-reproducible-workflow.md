---
title: "統計與 ML 評估怎麼做才重跑得出同一個結論？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 51
tldr: "統計與 ML 評估怎麼做才重跑得出同一個結論？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 51 篇：統計與 ML 評估怎麼做才重跑得出同一個結論？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-reproducible-workflow-en)

前面學的公式、檢定、模型和模擬，都有一個共同前提：別人要能追到你的結果怎麼來。若報告只貼一張圖或一個 accuracy，沒有資料版本、清理規則、seed、程式和環境，下一次重跑得到不同結果時，沒人知道差異來自哪裡。

這篇談 reproducible workflow。考試不一定直接考工程細節，但統計報告、實驗設計和 ML/AI 評估都需要這個能力：讓資料、方法、計算和結論可以被重跑、被檢查、被質疑。

## 這篇先解決什麼問題

可重現性處理的是證據鏈。

一個統計結論通常經過這條路：

```text
raw data -> cleaning -> feature engineering -> analysis/model -> metrics -> tables/figures -> conclusion
```

任何一段沒有留下，就會變成口頭印象。你可能知道自己做過什麼，但讀者、老師、同事或未來的你無法檢查。

ML/AI 評估更容易出問題，因為流程裡有更多會變的東西：

```text
dataset version
train/test split
prompt or config
model version
random seed
metric definition
scoring script
external API time
```

reproducible workflow 的目標是讓每個結果都能回追到它的輸入和程式。

## 核心直覺

可重現不是保存最後截圖。截圖只能證明你曾經看過一個結果，不能說明結果怎麼產生。

比較好的做法是把報告當成輸出 artifact，而不是手工整理品。資料清理、分析、圖表、指標都由程式產生。報告中的每個數字，都能回到一段程式和一份資料。

最小清單可以這樣想：

```text
data: 原始資料、清理後資料、資料版本
code: 清理程式、分析程式、評估程式
config: 參數、模型、prompt、threshold
randomness: seed、抽樣方式、切分方式
environment: 套件版本、執行環境
outputs: 表格、圖、metric、log
README: 如何重跑
```

這些不是形式主義。它們是你發現錯誤時能不能定位問題的工具。

## 公式 / 機制

一個簡單的可重現評估可以用 manifest 來描述：

```yaml
dataset:
  name: customer-support-eval
  version: 2026-08-29
  split: test-v3
model:
  name: model-b
  version: 2026-08-20
evaluation:
  metric: task_success_rate
  scorer: rubric-v2
  seed: 42
outputs:
  report: reports/eval-2026-08-29.md
  raw_results: results/eval-2026-08-29.jsonl
```

統計上最重要的是：metric definition 要固定。accuracy、precision、recall、F1、pass rate、win rate、human preference，各自回答不同問題。metric 一變，數字就不能直接比較。

資料切分也要固定。若第一次用 random split，第二次又重新切，結果差異可能只是測試集換了。最基本做法是記下：

```text
split rule
random seed
train/validation/test identifiers
excluded cases and reasons
```

若使用外部模型 API，還要記模型名稱、供應商回應版本、日期、temperature、top_p、tool 設定。這些資訊可能影響輸出。

## 一步一步算例

假設你看到一份模型比較：

| 模型 | accuracy |
|---|---:|
| A | 0.86 |
| B | 0.88 |

表面上 B 高 2 個百分點。但報告沒有資料版本、切分方式、prompt、評分程式與 seed。

下一週重跑，變成：

| 模型 | accuracy |
|---|---:|
| A | 0.85 |
| B | 0.84 |

現在你無法判斷：

- 資料是否換了？
- 測試集是否重新抽樣？
- metric 是否改了？
- 模型版本是否更新？
- 評分 prompt 是否不同？
- 隨機輸出是否造成波動？

如果一開始有 manifest 和 raw results，你可以逐段排查。先確認測試題 ID 是否相同，再確認 scoring script hash，接著看模型版本和參數。這就是可重現工作流的價值：它不保證結果一定相同，但能讓你知道差異從哪裡來。

考試或報告題可以寫成這樣：

```text
此結果應附資料版本、切分規則、前處理流程、metric 定義、模型版本、random seed 與原始逐題結果。否則無法判斷分數差異來自模型改善、資料變動或評估流程改變。
```

## 這在 ML / AI 哪裡會用到

ML/AI 團隊裡，reproducibility 會變成幾種工程實作：

- eval pipeline：固定資料、模型、metric、scorer 和輸出格式。
- experiment tracking：記錄每次實驗的參數、結果、artifact。
- model registry：保存模型版本、訓練資料和部署狀態。
- dataset registry：保存資料版本、標註規則、切分方式。
- CI evaluation：每次模型或 prompt 改動後，自動跑固定測試集。

對 LLM 和 agent 更重要的是 raw trace。只看最後 pass/fail 不夠，因為失敗可能來自 retrieval、tool call、planner、parser、外部 API 或評分器。保存逐步 trace，才能把統計結果和系統行為接起來。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目問 reproducibility，答案要從資料、程式、環境、seed、輸出 artifact 列清單。
- 題目給 benchmark 分數，先問資料版本和 metric definition。
- 題目提到外部模型或 API，要記模型版本、參數和執行時間。
- 題目問為什麼重跑不同，要從資料、程式、隨機性、環境、外部服務逐一排查。

## 常見錯誤

- 只保存最後報告，沒有保存產生報告的程式和資料。
- 沒有固定 train/test split，卻把兩次分數直接比較。
- metric 名稱相同，但定義或 threshold 已經改掉。
- 只記平均分數，沒有保存逐題結果。
- LLM 評估沒有記模型版本、temperature、prompt 和工具設定。

## 練習題

1. 列出一份可重現統計分析最少需要保存的項目。
2. 為什麼只保存最後圖表，不保存產生圖表的程式，會讓分析不可審查？
3. 寫出一個 ML evaluation pipeline 的步驟：資料切分、模型版本、指標計算、報告輸出。
4. 如果同一模型重跑 accuracy 從 0.86 變 0.83，你會檢查哪些來源？
5. 在 LLM agent eval 中，為什麼 raw trace 比單一 pass rate 更有診斷價值？

## 下一篇怎麼接

可重現工作流負責保存證據鏈。下一篇會把這些證據寫成 ML/AI 評估報告：不只列分數，而是把統計結果轉成可決策的結論。

## 章節級參考對照

- OpenIntro、OpenStax 與 Stanford CS109 支撐統計分析流程、抽樣與估計的可檢查性。
- scikit-learn 支撐資料切分、模型訓練與評估流程；本文把這些流程轉成報告與版本紀錄要求。
- 本文把 reproducibility 接到 eval pipeline、experiment tracking、dataset versioning、model registry 和 raw trace。

## 參考資料

- [Reproducible statistical workflow、dataset versioning、random seed、metric definition 與 evaluation pipeline：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
