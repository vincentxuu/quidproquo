---
title: "實驗設計怎麼讓結果可以被解讀，而不是只像相關？"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: zh-TW
series:
  name: "從考試到 ML/AI 的統計學導讀"
  order: 43
tldr: "實驗設計怎麼讓結果可以被解讀，而不是只像相關？ 這篇會從考試題型、核心直覺、手算例子一路接到 ML/AI 的實際工作流。"
description: "從考試到 ML/AI 的統計學導讀第 43 篇：實驗設計怎麼讓結果可以被解讀，而不是只像相關？"
draft: true
---

> [English version](/en/posts/learning/2026-08-29-im-stat-experimental-design-en)

很多統計錯誤在資料被收集以前就已經埋下。分組不公平、實驗單位不清楚、主要指標事後才挑、干擾因素沒有控制，再漂亮的 p-value 都救不了結論。

實驗設計要處理的是「結果能不能被解讀」。考試會問 randomization、control、blocking、replication、blinding；ML/AI 會問 offline benchmark、online experiment、human evaluation 到底能不能支持上線決策。

## treatment、control 和實驗單位

先把三個角色講清楚。

Treatment 是你想測的改動，例如新推薦模型、新排序規則、新文案、新教學方式。

Control 是對照條件，例如舊模型、原本流程、安慰劑、現行版本。

實驗單位是被隨機分派的單位。可能是使用者、課程班級、交易、題目、session、店家。這個單位要先定清楚，因為後面的標準誤和檢定都會依它而變。

如果你以使用者為單位隨機分派，就不能在分析時把同一位使用者的 100 次點擊當成 100 個完全獨立樣本。這會把有效樣本數灌大。

## randomization 先處理可比性

Randomization 的目標，是讓 treatment 和 control 在已知與未知干擾因素上大致可比。它不保證每一次分組都完美平衡，但它讓差異比較不容易被選擇偏誤主導。

如果新模型只在週末流量上線，舊模型只跑平日流量，你看到的差異可能是模型效果，也可能是週末使用者行為不同。這時分析再精細，也很難把兩者分開。

正確做法是在同一段期間內，對同一個合格族群隨機分流。這樣 treatment/control 差異比較有機會被解讀為改動效果。

## blocking、replication、blinding 各自解決什麼

Blocking 用來處理已知差異。若你知道新舊使用者差異很大，可以先按新舊使用者分層，再在每層內隨機分派。這樣比較不會讓某一組剛好多很多新使用者。

Replication 是要有足夠重複觀察，讓你估不確定性。只比較一個班級對一個班級、一天對一天，通常很難分清 treatment effect 和偶然波動。

Blinding 是避免人的反應或評分被知道組別影響。Human evaluation 特別需要注意：評審如果知道哪個答案來自新模型，評分可能受到期待影響。

Pre-specified outcome 則是先定主要指標。結果出來後才挑最好看的 metric，會讓檢定失去原本控制錯誤率的意義。

## 手算例題：錯誤分組會讓效果無法解讀

假設你比較兩個推薦模型。

錯誤設計：

```text
A model: weekday traffic
B model: weekend traffic
```

結果 B 的點擊率比較高。你不能直接說 B 比 A 好，因為 weekend 本來就可能有不同使用者、不同瀏覽時間、不同購買意圖。

比較合理的設計：

```text
eligible users in the same period
randomly assign 50% to A, 50% to B
primary metric: click-through rate
guardrail metric: complaint rate or latency
```

這樣你至少先處理了時間和族群可比性。分析時再估：

```text
treatment effect = CTR_B - CTR_A
```

如果 A 組 CTR 是 10.0%，B 組 CTR 是 10.8%，差距是 0.8 個百分點。接著要算信賴區間或檢定，並檢查 guardrail metric。若點擊上升但延遲變差、客訴上升，產品決策可能仍然不能直接上線。

## 分析方法要對應設計

成對設計要用 paired analysis。若同一個評審看兩個模型回答、同一題同時給 A/B 模型回答，資料天然成對。分析時要保留配對差異。

分層設計要保留 strata。若你按新舊使用者 blocking，分析時也要看各層效果，不要只把資料全部混在一起。

Cluster 設計要照 cluster 估不確定性。若隨機分派的是班級，不是學生，標準誤就不能把每個學生當完全獨立。

設計決定分析。分析不能事後把資料改裝成比較好算的樣子。

## 這在 ML / AI 哪裡會用到

Offline benchmark 是候選證據。它可以快速淘汰差模型，但不一定代表線上產品效果。

Online A/B testing 更接近產品結果。新模型可能離線 accuracy 較高，線上卻沒有提升，原因可能是延遲變長、使用者分布不同、介面互動改變、錯誤集中在高價值族群。

Human evaluation 也是實驗設計。你要定義評分 rubric、盲評方式、題目抽樣、評審一致性，以及主要 outcome。若評審知道模型來源，或題目只挑模型擅長的領域，結果就很難支持廣泛主張。

在 LLM agent 評估裡，實驗單位也要小心。一次任務可能包含多輪對話、多個 tool call、多次重試。你要先決定單位是 task、conversation、tool call 還是 user session，否則樣本數會被算錯。

## 題型怎麼辨識

看到 treatment 和 control，先問兩組是否可比。

看到 randomization，回答它如何降低 selection bias。

看到 blocking，回答它如何控制已知差異。

看到 replication，回答它如何讓變異和不確定性能被估計。

看到 paired、stratified、cluster，提醒分析方法要保留設計結構。

看到「結果出來才挑指標」，要指出 multiple testing 或 p-hacking 風險。

## 常見錯誤

- 只看 p-value，忽略分組是否公平。
- 沒定實驗單位，分析時把事件數當成使用者數。
- 有 blocking，分析時卻把 strata 全部混掉。
- 成對資料當成獨立樣本。
- 結果出來後才挑 primary metric。
- 離線 benchmark 變好，就直接宣稱線上產品一定會變好。

## 練習題

1. 說明 randomization、control、blocking、replication 各自解決什麼問題。
2. 如果 A/B test 沒有隨機分派，結果最容易被哪一類因素污染？
3. 設計一個線上推薦系統實驗：寫出 treatment、control、primary metric 與一個 guardrail metric。
4. 若同一位評審同時評 A/B 兩個模型回答，為什麼分析時應保留 paired design？
5. 為什麼 ML 離線 benchmark 表現變好，不一定代表線上產品實驗會變好？

## 下一篇怎麼接

實驗設計決定資料能不能被解讀。下一篇會把它放進產品場景：A/B testing 如何從隨機分流、主要指標、樣本數、不確定性一路走到上線決策。

## 章節級參考對照

- OpenIntro 與 OpenStax 支撐實驗設計、隨機分派、控制組與因果解讀的基礎。
- Stanford CS109 支撐統計推論與實驗資料解讀的共同語言。
- scikit-learn Model Evaluation 支撐 offline metric 情境；本文再接到 online experiment，提醒兩者不是同一個證據層級。

## 參考資料

- [Experimental design、randomization、control、blocking、replication、blinding 與 pre-specified outcome：OpenIntro Statistics](https://www.openintro.org/book/os/)
- [台大圖書館考古題系統：資訊管理研究所](https://exam.lib.ntu.edu.tw/graduate/term/195)
- [台大資管統計備考頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat)
- [台大資管考古題頁](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
