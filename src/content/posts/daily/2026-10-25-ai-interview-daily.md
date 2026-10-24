---
title: "AI Engineer 面試日練 — 2026-10-25：Behavioral & Weekly Review"
date: 2026-10-25
category: daily
type: digest
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "星期日輪到 Behavioral & Weekly Review：用一個『主動喊停一個做了兩週、方向不對的 fine-tuning 方案』的 STAR 故事，練習 2026 年底行為面試正在轉向的評分重點——自主判斷比組織複雜度更值錢。再回顧這週從 class imbalance 到 MAS-Guard 論文走過的七個主題。"
tldr: "2026 年底的行為面試正在往『自主判斷』傾斜：AI 輔助寫 code 讓『你具體用過什麼技術』的訊號貶值，面試官改看『在沒人交代的情況下你自己做了什麼決定』；連 Project Deep Dive 這種原本只問 Staff+ 的深挖輪，現在也開始下放到更低職等。今天練的故事是『主動喊停一個做了兩週、方向有問題的 fine-tuning 方案，改用風險更低的做法』,呼應這個轉向——故事的重點不是『我協調了多少人』，是『我自己量化出數字、自己決定方向』。本週回顧從 class imbalance 一路走到 MAS-Guard 多代理人防護論文，共七個主題。"
series:
  name: "AI Engineer 面試日練"
  order: 67
---

> 🌏 [English version](/posts/daily/2026-10-25-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：主動喊停一個做了兩週、方向不對的 fine-tuning 方案

前 Meta 資深工程經理、主持過上千場面試的 Austen McDonald 在這週（10/22）的分析裡指出一個 2026 年底才明顯起來的轉向：AI 輔助開發讓「你對某個技術的具體實作經驗」這個訊號貶值了，面試官轉而更看重 Anthropic 內部用的說法——「autonomy and judgment, relative to technical domain expertise and implementation」。他也提到原本只在 Staff+ 職等出現的 Project Deep Dive（深挖你已經做過的專案，形式像系統設計但系統是你自己蓋的）現在也開始下放到更低的職等。這對 AI Engineer 的行為面試是直接影響：故事裡「我協調了多少跨團隊會議」不再是加分項，「我自己判斷、自己量化、自己決定方向」才是。今天練的故事就照這個方向設計。

**情境**：團隊要幫客服 agent 換一個意圖分類模型，原計畫是 fine-tune 一個開源小模型，PM 已經跟業務方承諾兩週內上線。我做到第十天時發現兩件事：訓練資料的標籤品質不乾淨，而且就算修到當下最好的 checkpoint，在邊界案例上還是輸給「規則 + 既有大模型做 few-shot 分類」這條更簡單的路線。

**任務**：我是負責這個分類模型的工程師，要決定是硬撐把 fine-tune 做完交差，還是主動改方向——後者意味著要在還沒被問之前，自己承認「原計畫走不下去」。

**行動**：我沒有等 PM 來問進度，而是先自己做了一組對照實驗：拿現有 fine-tune checkpoint 跟「規則 + few-shot」兩條路線跑同一份 200 筆驗證集，量化出具體數字——fine-tune 版 F1 0.81，few-shot 版 F1 0.89，而且 few-shot 版不需要之後每次資料分布變動就重訓一次。我主動排了一場 30 分鐘的會議，先攤出這組數字，再提出折衷方案：「兩週內先用 few-shot 上線，fine-tune 另外排一個獨立的資料清理 spike，不卡這次上線時程」。

**結果**：PM 跟業務方接受了改方向的提案，上線時間沒有 delay，反而提前兩天。後續的資料清理 spike 把標籤品質問題一次解決，之後團隊做類似專案都直接沿用這套「先跑對照實驗、再帶著數字進會議」的流程。

### 怎麼講這個故事

- **Dos**：把「主動」講清楚——是你自己發現問題、自己做對照實驗、自己排會議，不是等人來問。用具體數字（F1 0.81 vs 0.89、提前兩天）取代「效果更好」這種模糊說法；2026 年底的面試官（跟 AI 輔助評分系統）對「這個決定是不是你自己做的」特別敏感，這正是本週的轉向重點。
- **Don'ts**：不要把故事包裝成「我說服了團隊」——重點不是說服力，是你有沒有先做功課、量化風險再決定；也別省略「承認原計畫走不下去」這段心理掙扎，略過這段會讓故事顯得你一開始就知道答案，反而削弱「在模糊情境下怎麼判斷」的訊號。

## 本週回顧

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | class imbalance 時資料／模型／評估三層手段要分開講、L1/L2 regularization 的優化直覺、重複用 validation 分數調參本身就是資料洩漏 | {待自填} |
| Tue | Deep Learning & NLP | self-attention 的 Q/K/V 機制與 √dₖ scaling、multi-head attention 為什麼要多頭、self-attention O(n²) 成本的兩種不同層次解法（FlashAttention vs sliding window） | {待自填} |
| Wed | ML System Design | 固定八步框架（problem → metrics → data → features → model → training → serving → monitoring）、offline/online 指標配 guardrail、feature store 解決 training-serving skew | {待自填} |
| Thu | LLM & Agent Engineering | agent 評估要拆成多層不能只看最終答案、RAG 的「開卷考試」心智模型、context engineering 裡 compaction 只有壓縮倍率夠高才划算 | {待自填} |
| Fri | Coding | reservoir sampling 的核心不變量（每個元素留下機率都是 k/n）、串流限制會改變能用的工具箱、不是每個 ML coding 題都該急著向量化 | {待自填} |
| Sat | Paper Reading | MAS-Guard 論文:agentic AI 把攻擊面從文字輸出擴大到可執行動作、本地 A-Guard + 系統層 Control Plane 兩層防護、四級介入取代二元擋放 | {待自填} |
| Sun | Behavioral & Weekly Review | 用 STAR 練「主動喊停一個方向不對的 fine-tuning 方案」，呼應本週行為面試評分重點轉向「自主判斷」 | {待自填} |

## 下週預告

下週主題輪替不變（週一 ML Fundamentals 到週六 Paper Reading，週日再做一次行為與週回顧），但每天搜尋到的面試題與論文都會是當週最新的內容。目前 `interview-focus.json` 的七個主題權重都還是預設值 1——如果這週練下來覺得某個主題特別卡（例如 system design 的指標分層，或是多代理人系統的防護分工），可以把對應主題的權重調到 2 或 3，下週就會在固定排程之外額外加練。考慮到這週讀到的轉向，下週練行為故事時可以多留意「故事裡有沒有不必要地依賴組織複雜度（一堆跨團隊會議）來撐場面」，試著換成個人技術判斷當主軸。

## 參考資料

- [What's changing in behavioral interviews — Austen McDonald, The Behavioral](https://thebehavioral.substack.com/p/whats-changing-in-behavioral-interviews) — 本篇「今日主題」與「怎麼講這個故事」裡「自主判斷比組織複雜度更值錢」「Project Deep Dive 下放到更低職等」的依據來源。
- [Best AI Tools for Behavioral Interview Prep (2026) — CoPilot Interview](https://copilotinterview.com/blog/best-ai-tools-for-behavioral-interview-prep) — 對應 STAR 故事長度與評分維度（relevance、structure、specificity、impact、ownership、articulation）的參考依據。
- [MAS-Guard: 本週六 Paper Reading 的核心論文 — arXiv 2610.28397](https://arxiv.org/abs/2610.28397) — 本週回顧表格 Sat 欄位對應的論文來源。
