---
title: "（最終回）開放問題與 Demo Day：computer-use、web agent 與上線前檢查｜Stanford CS329Z 第 19 堂"
date: 2026-09-10
updated: 2026-10-29
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent]
lang: zh-TW
series:
  name: "Stanford CS329Z 導讀"
  order: 20
tldr: "第 19 堂依課表收尾：multimodal agent、web 與 computer-use agent、science agent、長時間執行的架構、上線與觀測（tracing、monitoring、成本控管），以及可靠度、擴展性與可解釋性的開放問題。延伸閱讀是 OSWorld 與 WebShop，期末 Demo Day 在 12/7–11 考試週。"
description: "依課表與延伸閱讀預習 Stanford CS329Z 第 19 堂 Frontiers & Open Problems：深讀 OSWorld 與 WebShop，整理 Demo Day 前的檢查清單，並回顧全系列每一堂。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-09-10-stanford-cs329z-lecture-19-frontiers-demo-day-en)

**影片狀態：錄影需登入或課程授權。** [影片來源與說明](#課程影片來源)

最後一堂（12/2，Frontiers & Open Problems）沒有指定主讀物。課表把 multimodal、web 與 computer-use、science agent、長時間執行的架構、production 的 tracing／monitoring／成本控管攤開，最後談可靠度、擴展性與可解釋性的開放問題。期末報告與系統 demo 在 12/7–11 的考試週，確切時間地點仍待公告；專案題目依現行官方要求自選，連到課程核心主題。

延伸閱讀是 Xie 等人的 [OSWorld](https://arxiv.org/abs/2404.07972) 與 Yao 等人的 [WebShop](https://arxiv.org/abs/2207.01206)，本文兩篇都深讀，再接 Demo Day 前的檢查清單與全系列回顧。截至 2026-10-29，這堂還沒有公開投影片，本文是依官方課表與指定閱讀寫的預習，不代表講師在課堂上說過的內容。第 11 堂以後的堂次編號依課表順序推算，官網目前只列日期與主題。

## 讀物 1｜OSWorld

原文：[OSWorld](https://arxiv.org/abs/2404.07972)

### TL;DR

OSWorld 提供可重播的電腦任務與執行式驗收，以環境成果而非單純文字答案計分。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | Computer-use agent如何在真實作業系統裡驗收？ |
| 證據與邊界 | 12.24%是原論文受測最佳模型結果，不能當作今日computer-use上限。 |

### 領域背景

電腦操作包含跨應用狀態，只有最後文字無法證明檔案、設定與工作流程真的完成。

### 中階導讀

**方法。** 在可重設的作業系統環境交付自然語言任務，讓模型操作，再用執行式檢查確認成果。

**證據與結果。** 原始研究顯示GUI定位與操作知識是瓶頸；12.24%的歷史結果應保留受測模型與環境條件。

### 深入要點

- 跨應用任務的中間畫面不一定證明終態正確，最後仍須讀實際成果。
- 環境初始化要可重播，否則前一次操作留下的視窗或檔案會改變難度。

### Reviewer 一句話評

操作驗收要回到環境。

### 給你的 take-away

讓GUI任務的驗收讀實際檔案或應用狀態，並記錄初始環境。

## 讀物 2｜WebShop

原文：[WebShop](https://arxiv.org/abs/2207.01206)

### TL;DR

WebShop 在模擬電商環境用自然語言購物指令測搜尋與選擇，連結語言理解與網頁動作。

### 編輯判斷

| 面向 | 閱讀判斷 |
| --- | --- |
| 核心問題 | 購物指令中的條件能否落到正確商品選擇？ |
| 證據與邊界 | 29%是原研究最佳模型的任務成功率；模擬商店不等於真實交易或今日能力。 |

### 領域背景

商品搜尋要求把自然語言限制映射到網頁選擇，找到相似商品與滿足全部條件並不相同。

### 中階導讀

**方法。** 模型根據購物指令搜尋、瀏覽屬性並選商品，再由環境對照商品與使用者限制給回饋。

**證據與結果。** 原始最佳模型29%成功率低於人類專家59%，顯示理解購物條件與連續操作仍有差距。

### 深入要點

- 搜尋與選擇可以分開學，但最後必須由整體商品條件驗收，不能只看搜尋關鍵字。
- 模擬環境固定部分真實網頁變動，因此不能把成功直接轉成真實交易可靠性。

### Reviewer 一句話評

選對商品需要逐項條件驗收。

### 給你的 take-away

把商品屬性與使用者限制寫進驗收，不用點擊完成或流暢回覆代替買對商品。

## 怎麼做：Demo Day 前檢查清單

**怎麼做**：先把 tracing 全開，每次彩排都留一條可重播的 trace。monitoring 盯三件事：錯誤率、延遲、token 花費。cost 設硬上限，超標自動停。高風險工具預設關閉，現場 demo 才手動放行。最後準備一個失敗案例，midway report 寫過的 failure mode 拿出來講，比只秀成功更有說服力。

## 全系列回顧：一堂一篇

- [CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- [第 1 堂：複合式 AI 系統](/posts/ai/2026-09-09-stanford-cs329z-lecture-01-compound-ai-systems)：複合式 AI 系統：模型、資料與工具如何配合
- [第 2 堂：LLMs for Builders](/posts/ai/2026-09-10-stanford-cs329z-lecture-02-llms-for-builders)：做 agent 前，先懂模型怎麼讀前文、怎麼吐字
- [第 3 堂：RAG](/posts/ai/2026-09-10-stanford-cs329z-lecture-03-rag)：手刻第一個 RAG：從切 chunk 到讓 agent 決定何時查
- [第 4 堂：Tool Use & Function Calling](/posts/ai/2026-09-10-stanford-cs329z-lecture-04-tool-use)：把工具接進來：function calling、MCP 與工具失敗
- [第 5 堂：Frameworks & Orchestration](/posts/ai/2026-09-10-stanford-cs329z-lecture-05-frameworks)：框架拆開看：DSPy、LangGraph 與 harness 的差距
- [第 6 堂：Agent Design Patterns & Scaffolds](/posts/ai/2026-09-10-stanford-cs329z-lecture-06-design-patterns)：先分清 workflow 和 agent，再學會邊想邊做
- [第 7 堂：Agent Memory Architectures](/posts/ai/2026-09-10-stanford-cs329z-lecture-07-memory)：讓 agent 記住該記的事：MemGPT、Letta、Mem0 與 Generative Agents
- [第 8 堂：Multi-Agent Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-08-multi-agent)：該單幹還是開會：多智慧體的分工、溝通與失敗
- [第 9 堂：Optimization](/posts/ai/2026-09-10-stanford-cs329z-lecture-09-optimization)：改 prompt、改權重，還是想久一點：agent 優化三軸
- [第 10 堂：Terminal-Bench 客座](/posts/ai/2026-09-10-stanford-cs329z-lecture-10-terminal-bench)：agent 說完成之後，怎麼驗證它真的完成：Terminal-Bench 客座
- [第 11 堂：Data for Agentic Systems](/posts/ai/2026-09-10-stanford-cs329z-lecture-11-data-for-agents)：agent 需要什麼資料：軌跡、示範、回饋與資料飛輪
- [第 12 堂：Data Selection & Quality](/posts/ai/2026-09-10-stanford-cs329z-lecture-12-data-selection)：資料不是越多越好：挑選、驗證與品質
- [第 13 堂：Evaluation Fundamentals & Benchmark Design](/posts/ai/2026-09-10-stanford-cs329z-lecture-13-eval-benchmarks)：分數別騙自己：用四元組把評估寫完整
- [第 14 堂：LLM-as-Judge & Evaluation Infrastructure](/posts/ai/2026-09-10-stanford-cs329z-lecture-14-llm-as-judge)：請模型當裁判：grader 選擇、裁判偏誤與校準
- [第 15 堂：Agent Safety & Guardrails](/posts/ai/2026-09-10-stanford-cs329z-lecture-15-agent-safety)：幫 agent 上護欄：隱私、提示注入、沙箱與許可
- 第 16 堂（11/16）：客座，主題待公布，公告後補上。
- [第 17 堂：Coding & Software Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-17-coding-agents)：寫程式的智慧體，先替它造一把順手的 IDE
- [第 18 堂：Proactive Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-18-proactive-agents)：從等指令到先出手：proactive agent 與 General User Models
- [第 19 堂：Frontiers & Open Problems](/posts/ai/2026-09-10-stanford-cs329z-lecture-19-frontiers-demo-day)：（最終回）開放問題與 Demo Day：computer-use、web agent 與上線前檢查
- 11/23、11/25：Thanksgiving 停課。

## 它在課程裡的位置

第 19 堂是整門課的收尾：從第 1 堂的複合式系統，走到工具、迴圈、記憶、分工、優化、資料、評估、安全，最後回到 agent 在真實電腦與網頁上能做到哪裡。下方的全系列回顧可當期末複習的地圖。

## 本堂 Course Material 對照

- 官方投影片：尚未公開（截至 2026-10-29）
- 延伸閱讀：Xie 等人〈OSWorld: Benchmarking Multimodal Agents in Real Computer Environments〉（本文深讀）、Yao 等人〈WebShop〉（本文深讀）
- 期末：Final Report Due & Final System Demo，12/7–11，時間待公告
- 課表原文：[CS329Z 官網](https://cs329z.stanford.edu/)

## 課程影片來源

官方 Logistics 頁（2026-10-10 即時讀取）的 Lecture Recordings 一節寫明：講課錄影只能登入課程 Canvas 取得。我實際開啟課程 Canvas 入口（canvas.stanford.edu/courses/233286），被導向 Stanford 登入頁，確認有登入牆。課程官網與搜尋都沒有找到公開的 YouTube 或 OCW 錄影，所以沒有可嵌入的影片。

課程與錄影入口：

- [官方課程／講次來源](https://cs329z.stanford.edu/)
- [官方 Logistics 頁（Lecture Recordings 一節）](https://cs329z.stanford.edu/logistics.html)

查核日期：2026-10-10。

## 更新紀錄

- 2026-10-29：系列由一週一篇改為一堂一篇。本篇收錄 Lecture 19（12/2 週三）的內容，原屬「第 11 週：從等指令到先出手」導讀；以下保留拆分前的紀錄。
- 2026-10-23：依第一堂模板重整材料狀態、機制、情境與理解檢查；將指定閱讀深讀與課堂預習分開。
- 2026-10-23：將既有教學內容補成圖解與必要對照表；本次未重新查證數據、課表或研究結果。
- 2026-10-10：標註影片狀態，核對錄影來源與取得方式。
- 2026-09-12：在系列回顧與課表對照中明示 Week 10 為感恩節停課週，避免 Week 9 直接跳到 Week 11 造成漏文疑慮。
- 2026-10-10：重查影片狀態。官方 Logistics 頁寫明錄影需登入課程 Canvas，實際開啟入口確認有登入牆，也沒有找到公開錄影；狀態改為需登入。

## 參考資料

- 站內：[第 18 堂：Proactive Agents](/posts/ai/2026-09-10-stanford-cs329z-lecture-18-proactive-agents)、[CS329Z 總導讀](/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents)
- 課程：[CS329Z 官網課表](https://cs329z.stanford.edu/)
