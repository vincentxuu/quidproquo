---
title: "A/B testing 怎麼把產品改動變成可推論的效果？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 44
tldr: "A/B testing 怎麼把產品改動變成可推論的效果？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 44 篇：A/B testing 怎麼把產品改動變成可推論的效果？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-ab-testing-en)

A/B testing 是統計推論進到產品決策後最常見的形式。你要回答的是：新版平均分數較高，是否真的來自改動？效果有多大？不確定性多高？副作用能不能接受？

這篇接在實驗設計之後。實驗設計先處理 treatment、control、randomization、primary metric；A/B testing 則把這些設計落到實際產品：分流、估效果、看區間、做檢定、檢查 guardrail，再決定要不要上線。

## 一個 A/B test 要先定什麼

第一，定 treatment 和 control。Treatment 是新版本，control 是現行版本。改動要盡量單一，否則結果很難解釋。

第二，定實驗單位。若以使用者分流，同一位使用者的所有事件都應該留在同一組。若一次 session 可以跨組，使用者體驗和統計獨立性都會出問題。

第三，定 primary metric。這是主要判斷標準，例如 conversion rate、retention、task success rate、人工偏好勝率。

第四，定 guardrail metric。這是避免副作用的指標，例如 latency、crash rate、complaint rate、成本、違規率。

第五，定停止規則。事後一直偷看結果，看到顯著就停，會讓錯誤率膨脹。

## treatment effect 怎麼估

若 outcome 是比例，常見效果是：

```text
p_B - p_A
```

若 outcome 是平均值，常見效果是：

```text
mean_B - mean_A
```

接著要估標準誤、信賴區間或 p-value。完整報告不該只寫「B 比 A 高」，而要寫差距、區間、樣本數、主要指標和 guardrail。

## 手算例題：兩組轉換率

假設 A 組有 1,000 人，其中 100 人轉換：

```text
p_A = 100 / 1000 = 0.10
```

B 組有 1,000 人，其中 108 人轉換：

```text
p_B = 108 / 1000 = 0.108
```

效果估計是：

```text
p_B - p_A = 0.108 - 0.10 = 0.008
```

也就是 0.8 個百分點。

兩比例差的近似標準誤可用：

```text
SE = sqrt(p_A(1 - p_A)/n_A + p_B(1 - p_B)/n_B)
```

代入：

```text
SE = sqrt(0.10 × 0.90 / 1000 + 0.108 × 0.892 / 1000)
   = sqrt(0.00009 + 0.0000963)
   = sqrt(0.0001863)
   ≈ 0.0136
```

95% 近似區間：

```text
0.008 ± 1.96 × 0.0136
= 0.008 ± 0.0267
= (-0.0187, 0.0347)
```

這個區間包含 0。報告時不能把它寫成穩定提升。比較好的說法是：「B 組轉換率點估計高 0.8 個百分點，但在此樣本下 95% 近似區間約為 -1.9 到 3.5 個百分點，資料尚不足以支持穩定提升。」

## sample ratio mismatch 要先查

A/B test 常預期 50/50 分流。如果最後 A 組 10,000 人、B 組 6,000 人，這叫 sample ratio mismatch 的警訊。

它可能來自分流 bug、追蹤漏資料、某些使用者被錯誤排除、實驗設定互相干擾。表面上是樣本數不一樣，真正的警訊是 randomization 可能壞掉。

遇到 sample ratio mismatch，先查實驗管線，不要急著解讀 treatment effect。隨機化如果壞了，後面的檢定再漂亮也沒有可信基礎。

## peeking 和多指標問題

如果你每天看一次 p-value，看到小於 0.05 就停，實際 false positive rate 會高於原本設定。因為你給自己很多次中獎機會。

如果你同時看 30 個 metric，最後只挑顯著的那個講，也會有類似問題。這就是 multiple testing / p-hacking 的風險。

比較好的做法是實驗前定 primary metric、分析窗口和停止規則。探索性分析可以做，但要標成探索，不要包裝成事前假設檢定。

## guardrail 讓上線決策不只看主指標

假設新推薦模型讓 CTR 上升，但 latency 增加、退訂率上升、投訴變多。主指標變好不代表一定上線。

Guardrail metric 的作用，是把「不能犧牲的東西」放進決策。對 ML/AI 產品來說，常見 guardrail 包括延遲、成本、安全違規率、人工審核量、使用者回報、長期留存。

A/B testing 的結論應該像決策備忘錄，而不只是統計檢定答案。

## paired A/B 和一般獨立兩組不同

線上產品分流常是兩個獨立使用者組。這時用兩樣本比例或平均差很常見。

但模型評估常是 paired：同一批題目給 A 模型和 B 模型作答。這時每題難度會同時影響兩個模型分數，分析要保留配對。可以用 paired difference、sign test、paired bootstrap 或適合的 paired test。

把 paired 資料當成獨立兩組，通常會浪費資訊，也可能估錯標準誤。

## 這在 ML / AI 哪裡會用到

產品 ML 常用 A/B testing 決定模型是否上線。離線分數變好只是候選證據，真正部署還要看線上指標、延遲、成本、分群效果與長期副作用。

LLM 產品也一樣。新 prompt、新 retriever、新 reranker、新模型版本，都可能在線下 eval 表現更好，卻在線上造成回覆變慢、拒答變多、工具呼叫成本增加，或特定族群體驗變差。

所以 ML/AI 的 A/B test 報告至少要包含：實驗單位、分流比例、primary metric、guardrail metrics、樣本數、效果估計、區間或檢定、分群檢查、是否有 SRM、是否按預定停止規則結束。

## 題型怎麼辨識

看到兩組比例，先估 `p_B - p_A`，再接標準誤、區間或檢定。

看到 treatment/control，先確認 random assignment 和實驗單位。

看到同一使用者、同一題目、同一評審比較 A/B，先想 paired design。

看到分流比例異常，先查 sample ratio mismatch。

看到很多 metric 或中途偷看，回答 multiple testing、peeking 和停止規則。

## 常見錯誤

- 只看平均提升，沒有估不確定性。
- 沒有先定 primary metric，結果出來後挑最好看的指標。
- 把使用者層級實驗分析成事件層級，低估標準誤。
- 發現 sample ratio mismatch 還繼續解讀效果。
- 離線模型分數變好，就直接跳過線上 guardrail。

## 練習題

1. 設計一個 A/B test：寫出 treatment、control、primary metric、guardrail metric 與隨機分派單位。
2. 兩組轉換率分別是 12% 與 14%，各 1000 人。寫出你會用哪個檢定或區間比較效果。
3. 說明 sample ratio mismatch 為什麼會讓實驗結果不可信。
4. 為什麼中途一直偷看 p-value 會提高 false positive 風險？
5. 在 ML 產品中，離線模型分數變好但線上 A/B test 沒變好，列出兩個可能原因。

## 下一篇怎麼接

A/B testing 把實驗設計變成產品決策。下一篇會進到 causal inference：當你沒有完美隨機實驗時，統計還能怎麼接近「效果」這個問題。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐兩比例比較、信賴區間、假設檢定與實驗設計基礎。
- Stanford CS109 支撐從抽樣誤差走到產品實驗不確定性的直覺。
- scikit-learn Model Evaluation 支撐離線指標情境；本文把它和線上 A/B test 的證據層級區分開。

## 參考資料

- [A/B testing、two-proportion inference、sample ratio mismatch、guardrail metrics 與 online experiment：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
