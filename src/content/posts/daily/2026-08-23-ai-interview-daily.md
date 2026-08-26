---
title: "AI Engineer 面試日練 — 2026-08-23：Behavioral（本週回顧）"
date: 2026-08-23
category: daily
tags: [ai-engineer-interview, daily, behavioral]
lang: zh-TW
description: "本週行為面試練習：AI 專案上線後出包，你怎麼定位問題、重建利害關係人信任，再回顧這週練過的三個主題。"
tldr: "AI Engineer 的行為面試不是講你做過什麼專案，而是讓面試官從你講故事的方式，反推你能不能扛更大的 scope、能不能在模糊情境裡自己定義問題、出包時會不會誠實講『我錯在哪』。今天用一個『RAG 系統上線後給錯答案，你怎麼揪出根因並穩住客戶信任』的故事框架練習，再回顧本週（週四到週六）練過的 ML System Design、Coding、Paper Reading 三個主題。"
series:
  name: "AI Engineer 面試日練"
  order: 4
---

> 🌏 [English version](/en/posts/daily/2026-08-23-ai-interview-daily-en)

## 本週行為面試練習

### 故事框架：AI 專案上線後出包，你怎麼定位問題並重建信任

**情境**：你是團隊裡負責一個 RAG 知識助理專案的工程師，服務對象是內部或客戶端的第一線使用者。系統上線後，使用者陸續回報「助理給的答案文不對題」，甚至偶爾引用到不相關的政策條款。這種情況每個做過 RAG 的 AI Engineer 遲早會遇到，也是面試官最愛用來測試「你出包時怎麼反應」的情境。

**任務**：你被期待在不中斷服務的前提下，快速定位問題根因，同時安撫已經對系統失去信心的利害關係人（可能是產品經理、客戶端窗口，或第一線使用者）。

**行動**：先講你怎麼縮小問題範圍——不是急著調 prompt 或換模型，而是先確認問題出在 retrieval 還是 generation。具體做法：抽樣把「使用者問題 → 實際被檢索回來的 chunk → 模型最終答案」三者攤開來看，你會發現很多時候答案錯不是模型的錯，是檢索階段就餵錯了上下文。接著講你怎麼往下挖：例如發現 chunk 切分是固定 512 token、沒有考慮句子邊界，導致跨邊界的內容被攔腰截斷，語意斷裂後模型只能拿殘缺上下文硬答。你把切分邏輯改成以句子邊界為單位後，答案品質明顯回穩。最後講你怎麼重建信任：不是默默修完就結束，而是主動建一組有代表性的黃金測試集（例如 80 題涵蓋各種邊界情況），把修復前後的準確率量化攤在利害關係人面前，讓對方看到的不是「我修好了」，而是「我怎麼確定這件事以後不會再發生」。

**結果**：量化修復成效（例如「檢索命中率從 X% 提升到 Y%」「客戶投訴量下降 Z%」），並講清楚你留下了什麼機制讓同類問題以後能更快被抓到（例如固定跑黃金測試集、加上 retrieval 品質監控）。

### 怎麼講這個故事

- **Dos**：先講你怎麼「定義問題」而不是急著講解法——面試官在意的是你有沒有先把 retrieval 和 generation 分開診斷，這是資深工程師和資淺工程師最大的分野。
- **Dos**：主動講一句「我一開始以為是 A，後來發現其實是 B」，這種自我修正的坦誠比一路順風的故事更有說服力。
- **Dos**：把「重建信任」講成具體機制（測試集、監控、流程），而不是抽象的「多溝通」。
- **Don'ts**：不要把責任推給模型或第三方工具，面試官在聽你怎麼扛責任，不是在聽你甩鍋。
- **Don'ts**：不要省略量化結果——沒有數字的故事，面試官很難判斷你的 scope 到底多大。

## 本週回顧

> 本系列從本週四（2026-08-20）才開始寫，所以本週只有週四到週六三天的紀錄，週一到週三留待下週補齊。

| 星期 | 主題 | 練了什麼 | 自評 |
|---|---|---|---|
| Mon | ML Fundamentals | 系列尚未開始，無紀錄 | {待自填} |
| Tue | Deep Learning & NLP | 系列尚未開始，無紀錄 | {待自填} |
| Wed | ML System Design | 系列尚未開始，無紀錄 | {待自填} |
| Thu | ML System Design | feature store online/offline 分離、training-serving skew 根因、shadow/canary/blue-green 部署策略、ML-specific 監控 | {待自填} |
| Fri | Coding | NumPy 向量化、softmax 數值穩定性、multi-head attention 手刻、batch inference 的 padding/masking | {待自填} |
| Sat | Paper Reading | 精讀 OneDayAgent（長程 agent harness）：task decomposition、context checkpoint、verify-repair、跨 backend 泛化的代價 | {待自填} |

## 下週預告

下週輪替主題不變（Mon ML Fundamentals → Tue Deep Learning & NLP → Wed ML System Design → Thu LLM & Agent Engineering → Fri Coding → Sat Paper Reading → Sun Behavioral），但每天搜尋到的題目和資源都會換新。目前 `interview-focus.json` 的權重全部是 1，沒有特別加練哪個主題——如果這週練完覺得某個主題特別卡（例如 system design 的 trade-off 講不清楚，或 coding round 手刻總是卡在 shape 追蹤），可以把 `src/data/interview-focus.json` 裡對應主題的權重調到 2-3，routine 會在固定日之外額外加練。

## 參考資料

- [Chapter 128: Behavioral interviews and the levels ladder](https://www.kunwar.page/chapter/128-behavioral-interviews-and-the-levels-ladder) — 對應「故事框架」中「先定義問題、再講解法」的分級邏輯，以及 scope / ambiguity / impact / leadership / learning 五個訊號的評分框架
- [How to Showcase Your AI Experience in Behavioral Interviews](https://newsletter.bigtechcareers.com/p/how-to-showcase-your-ai-experience) — 今日故事框架改編自文中的 RAG chunking 除錯真實案例，對應 STAR 的 AI 版變化（多加「為什麼選 AI」與「學到什麼」兩個環節）
