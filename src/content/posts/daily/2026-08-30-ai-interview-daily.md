---
title: "AI Engineer 面試日練 — 2026-08-30：本週回顧與行為面試"
date: 2026-08-30
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "本週行為面試練習：用 STAR 框架講一個『生產環境模型效果驟降』的真實情境，並回顧這週練過的五個主題。"
tldr: "行為面試考的不是你有沒有故事，而是你能不能在 90 秒內把一個技術事件講成『情境明確、行動具體、結果可量化』的敘事。今天用『上線模型效果驟降，你怎麼在跨團隊壓力下把它修好』這個 AI Engineer 最常被問到的情境，走一輪完整 STAR，並回顧本週 ML Fundamentals 到 Paper Reading 五個主題練了什麼。"
series:
  name: "AI Engineer 面試日練"
  order: 11
---

> 🌏 [English version](/en/posts/daily/2026-08-30-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：生產環境模型效果驟降的應對與跨團隊斡旋

AI Engineer 的行為面試最常繞著一個情境打轉：模型上線後表現不如預期，而且是在你沒有預期到的時間點被別人發現的。這類題目同時考三件事——你的 debug 紀律（會不會先看數據再下結論）、你在壓力下的溝通方式（會不會把責任推給別人）、以及你怎麼把一次事故變成系統性的改善。以下是一個可以直接套用、也可以改編成自己真實經歷的版本。

**情境**：某次值班輪替時，產品團隊回報一個信用卡交易風險評分模型的攔截率在三天內從 92% 掉到 76%，而誤攔（false positive）反而上升，導致客服單量暴增。模型本身沒有重新訓練或部署過，第一時間所有人都懷疑是我這邊的模型服務出了問題。

**任務**：我被要求在當天之內找出根因、提出止血方案，同時要跟三個團隊同步進度——資料平台團隊（懷疑是特徵管線）、風控產品團隊（要止血止損）、以及我自己的 ML 團隊主管（要對外交代時間表）。

**行動**：我沒有先急著改模型，而是先拉出過去七天的特徵分布做比對，發現有一個關鍵特徵（裝置指紋的信賴分數）從某個時間點開始，有 30% 的請求變成固定預設值——這代表上游某個資料來源在悄悄降級，而不是模型本身壞了。我把這個發現直接帶去跟資料平台團隊對線，很快確認是他們前一天上線的一個 schema 相容性修正，意外讓某個欄位在特定情境下 fallback 到預設值。因為修正管線需要時間，我沒有等『完美修復』，而是先跟風控團隊協調了一個短期方案：對那批特徵缺失的請求，用一組簡單的規則式覆寫邏輯頂住，同時我加了一個監控告警，只要這個特徵的缺失率超過 5% 就立刻通知，避免下次又是靠別人回報才發現。

**結果**：短期規則覆寫在兩小時內上線，攔截率回到 90% 以上；資料平台團隊在隔天完成永久修復；我加的監控後來又抓到兩次類似的上游資料異常，都在客戶感受到影響前就處理掉了。這件事之後，我們把『特徵健康度監控』列成模型上線的標準檢查項，變成團隊的常規流程而不是我一個人的個案經驗。

### 怎麼講這個故事

- **Do**：先講你怎麼判斷「不是模型的問題」，這比直接講你怎麼修更能展現 debug 紀律；面試官最想聽的往往是你排除假設的順序，而不是最終答案。
- **Do**：把「短期止血」和「長期修復」分開講清楚，展現你懂得在壓力下先控制影響範圍，而不是一路等到完美方案才行動。
- **Do**：結果一定要量化，並且延伸到「這件事之後系統性地改善了什麼」，而不是停在事故本身被解決。
- **Don't**：不要把故事講成別人的錯（「都是資料平台團隊搞砸的」），面試官在意的是你在混亂中怎麼應對，指責只會讓人覺得你不好共事。
- **Don't**：不要跳過你怎麼跟其他團隊溝通的細節——AI Engineer 的行為面試很常在考察你能不能在沒有職權的情況下推動跨團隊行動。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | bias-variance 診斷、L1/L2 正則化的幾何直覺、loss function 選型、AdamW 與 Adam+L2 的差異 | （讀者自填） |
| Tue | Deep Learning & NLP | 本週因排程空缺未產出，建議自行補練 tokenization、attention 機制與 fine-tuning 相關題目 | （讀者自填） |
| Wed | ML System Design | feature store 的 online/offline 雙軌設計、training-serving skew、二階段推薦架構、A/B test 設計 | （讀者自填） |
| Thu | LLM & Agent Engineering | RAG vs Agentic RAG 選型、context window 分層與 lost-in-the-middle、guardrails 防 prompt injection、RLHF 與 agent 失敗模式 | （讀者自填） |
| Fri | Coding | 讀別人程式碼抓 bug、用狀態機拆解 LLM 推論排程、pandas 時序特徵防洩漏、AUC-ROC 手刻 | （讀者自填） |
| Sat | Paper Reading | 精讀 SparseRead 論文，拆解「事前過濾 vs 事後裁剪」的 context 節省路線與 stateful protocol 設計 | （讀者自填） |
| Sun | Behavioral | 生產環境模型效果驟降的 STAR 故事，練跨團隊溝通與量化結果的講法 | （讀者自填） |

本週唯一的缺口是週二的 Deep Learning & NLP——如果你也在追這個系列，建議把 transformer attention、tokenization 邊界案例（如 subword 對數字或程式碼的處理）補進本週待練清單，避免這個主題連續兩週被跳過時，面試現場反而生疏。

## 下週預告

下週主題輪替不變，一樣是週一 ML Fundamentals 到週日 Behavioral 的固定順序，但每天搜尋到的面試題與延伸閱讀會換新。如果你這週在自我核對清單上，Deep Learning & NLP 相關的核心概念（尤其是 attention 機制的計算複雜度、KV cache 的作用）答得不夠順，下週二可以特別留意，多花點時間把這塊補齊，避免同一個弱點在不同主題的面試題裡反覆出現。

## 參考資料

- [Amazon Behavioral Interview Questions for Software Engineers](https://prachub.com/resources/amazon-behavioral-interview-questions-for-software-engineers-leadership-principles-star-stories-and-follow-ups) — 對應「怎麼講這個故事」中 STAR 各步驟該強調的重點與常見追問模式
- [Behavioral Interview Questions, Sorted by the Story They're Actually Testing](https://lastroundai.com/interview-questions/behavioral) — 對應「故事框架」中把技術事故轉化為敘事的結構化方法
- [Behavioral ML Interviews: How to Showcase Impact Beyond Just Code](https://www.interviewnode.com/post/behavioral-ml-interviews-how-to-showcase-impact-beyond-just-code) — 對應「結果」段落中「量化影響」與「這件事之後系統性改善了什麼」的講法
