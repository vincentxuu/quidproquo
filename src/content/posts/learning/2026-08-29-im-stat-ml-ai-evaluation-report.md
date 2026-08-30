---
title: "ML/AI 評估報告怎麼寫，才不只是貼排行榜分數？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 52
tldr: "ML/AI 評估報告怎麼寫，才不只是貼排行榜分數？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 52 篇：ML/AI 評估報告怎麼寫，才不只是貼排行榜分數？"
draft: false
---

> [English version](/en/posts/learning/2026-08-29-im-stat-ml-ai-evaluation-report-en)

這一系列從平均、變異、分布、檢定、迴歸一路走到實驗設計、因果、缺資料、Monte Carlo 和可重現流程。最後要落到一件事：你能不能把統計證據寫成一份可決策的 ML/AI 評估報告。

好的評估報告不只是排行榜分數。它要回答：資料是否代表真實任務？metric 是否對齊產品目標？差異是否穩定？失敗集中在哪裡？風險能不能接受？建議是上線、灰度、回滾，還是補實驗？

## 這篇先解決什麼問題

很多模型報告長這樣：

| 模型 | score |
|---|---:|
| baseline | 0.81 |
| new model | 0.84 |

這張表不夠。它沒有告訴你測試集多大、分數怎麼算、差距是否穩、哪些題型變差、成本是否增加、是否有資料洩漏。

評估報告要把分數放回決策問題：

```text
我們要不要把 new model 上線？
```

要回答這句話，報告至少要包含：

```text
decision: 這次評估要支持什麼決策
data: 測試資料怎麼來，代表什麼族群
metric: 指標怎麼定義，和目標有什麼關係
uncertainty: 差異有多穩
error analysis: 失敗集中在哪裡
guardrails: 成本、延遲、安全、體驗是否變差
recommendation: 建議動作與限制
```

## 核心直覺

評估報告的重點不在篇幅，而在每個結論都要能回到證據。

一句好的結論長這樣：

```text
新模型在 1,200 題客服測試集上的 task success rate 從 72.4% 提升到 75.1%，bootstrap 95% CI 約為 +0.6 到 +4.8 個百分點；但長輸入任務下降 3.9 個百分點，建議先灰度到短輸入流量，並補長輸入修正。
```

這句話同時交代了資料、指標、效果大小、不確定性、分群風險和決策。

差的結論通常只寫：

```text
新模型比較好，建議上線。
```

讀者不知道好在哪裡，也不知道風險在哪裡。

## 公式 / 機制

一份標準 ML/AI 評估報告可以用這個骨架：

```text
1. Decision question
2. Dataset and split
3. Models / systems compared
4. Metric definitions
5. Main results
6. Uncertainty / statistical comparison
7. Segment and error analysis
8. Guardrail metrics
9. Limitations
10. Recommendation
```

主結果不要只寫平均。若是分類模型，可以放：

```text
accuracy, precision, recall, F1, confusion matrix
```

若是生成式 AI 或 agent，可以放：

```text
task success rate, human preference win rate, refusal quality, factuality, tool-call success, latency, cost
```

若比較兩個模型在同一批題目上的表現，要優先想到 paired comparison。因為同一題對兩個模型都測過，題目難度可以被配對抵消。最簡單可以看逐題差異：

```text
d_i = score_new_i - score_base_i
mean difference = average(d_i)
```

再用 bootstrap 或 paired test 估不確定性。

## 一步一步算例

假設你評估兩個客服分類模型，測試集 1,000 題。

| 模型 | 正確題數 | accuracy |
|---|---:|---:|
| baseline | 810 | 81.0% |
| new model | 840 | 84.0% |

差距是：

```text
84.0% - 81.0% = 3.0%
```

這是主結果，但還不夠。

再看分群：

| 題型 | baseline | new model | 差距 |
|---|---:|---:|---:|
| 短輸入 | 82% | 87% | +5% |
| 長輸入 | 79% | 75% | -4% |
| 帳務問題 | 80% | 85% | +5% |
| 技術問題 | 83% | 84% | +1% |

現在結論要改寫。整體提升 3 個百分點，但長輸入下降 4 個百分點。若長輸入是高價客戶常見場景，直接全量上線風險很高。

再看 guardrail：

| 指標 | baseline | new model |
|---|---:|---:|
| 平均延遲 | 1.2s | 2.0s |
| 每千題成本 | $4 | $9 |
| escalation rate | 12% | 10% |

新模型雖然較準，但延遲和成本上升。最後報告可以寫：

```text
新模型整體 accuracy 提升 3.0 個百分點，主要來自短輸入與帳務問題；長輸入下降 4.0 個百分點，且平均延遲從 1.2s 升到 2.0s、成本增加。建議先針對短輸入流量灰度上線，長輸入維持 baseline，並補長輸入錯誤分析與延遲優化後再評估。
```

這才是統計結果到產品決策的橋。

## 這在 ML / AI 哪裡會用到

這篇是前面工具的整合。

- 描述統計：看資料分布、平均、變異、分群。
- 信賴區間：回答差異穩不穩。
- 檢定：處理差異是否可能只是抽樣波動。
- paired design：同一批題目比較兩個模型時減少噪音。
- regression diagnostics：找模型失敗是否集中在某些特徵。
- A/B testing：離線評估通過後，用線上實驗驗證真實效果。
- causal inference：避免把相關指標誤解成上線效果。
- missing data：檢查評估資料缺了哪些族群或情境。
- Monte Carlo：估重跑波動、成本風險或流程穩定性。
- reproducible workflow：讓報告能被重跑。

在 LLM/agent 場景中，報告還要保留 raw traces。當 agent 失敗，你要知道它是檢索不到資料、工具參數錯、解析錯、還是最後回答錯。平均分數看不出這些。

## 來源使用方式

- 官方考古題 PDF 只用來確認年份、科目名稱與題面，不把兩年題型當成完整範圍。
- grad-exam-prep 備考頁用來對齊學習路線、題型入口與練習節奏，不視為官方標準答案。
- OpenIntro、OpenStax 與其他開放教材用來核對公式、定義、假設與常見推導。
- Stanford CS109 與 scikit-learn 文件用來補 ML/AI 對接：模型訓練、評估、實驗與不確定性報告。

## 題型辨識提示

- 題目問 evaluation report，先寫 decision question。
- 分數表旁邊要有資料、metric、baseline 和不確定性。
- 比較同一批題目的兩個模型時，優先想到 paired comparison。
- 平均提升和分群退步同時存在時，結論要反映風險。
- 報告最後要有建議動作，不要只停在「模型 A 較佳」。

## 常見錯誤

- 只貼排行榜或平均分數。
- 沒有 baseline，導致分數缺乏比較對象。
- metric 和產品目標不一致，卻直接拿來做上線決策。
- 忽略 confidence interval、bootstrap 或重跑波動。
- 沒有分群錯誤分析，讓少數但重要的失敗被平均值蓋掉。
- 沒有 guardrail metrics，成本、延遲、安全風險沒有進決策。

## 練習題

1. 寫一段 ML/AI 評估報告摘要，必須包含資料、指標、估計值、不確定性、限制與建議決策。
2. 同一模型 accuracy 高、recall 低時，報告結論應該如何避免只報好看的數字？
3. 把「模型 B 分數 0.84、模型 A 分數 0.81」改寫成統計結論，加入資料量、差距與限制。
4. 列出三個不能省略的 guardrail metrics，並說明它們保護什麼風險。
5. 選一個 LLM agent eval 場景，列出你會保存哪些 raw traces。

## 下一篇怎麼接

評估報告是本系列的實戰收束。下一篇會回到整張地圖：讀完 53 篇後，如何繼續往考試、ML、因果、Bayesian、時間序列或數理統計深入。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐估計、信賴區間、檢定與結果解釋的基本語言。
- Stanford CS109 支撐從資料、模型到不確定性溝通的橋接。
- scikit-learn Model Evaluation 支撐 metric 選擇與分類/迴歸評估；本文把指標轉成可決策的報告格式。
- 本文把 evaluation report 接到 paired comparison、segment analysis、guardrail metrics、A/B testing 和 raw traces。

## 參考資料

- [ML/AI evaluation report、metric definition、uncertainty、segment analysis 與 guardrail metrics：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
