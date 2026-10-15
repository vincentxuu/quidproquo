---
title: "AI Engineer 面試日練 — 2026-10-15：LLM & Agent Engineering"
date: 2026-10-15
category: daily
type: digest
tags: [ai-engineer-interview, daily, llm-engineering]
lang: zh-TW
description: "星期四輪到 LLM & Agent Engineering——什麼時候該把一個 agent 拆成多個、工具邊界怎麼切、MCP 跟 A2A 各管哪一段，加一題「要不要把 coding assistant 拆成 planner／coder／reviewer」的設計題。"
tldr: "今天練 agent 架構的拆分判斷：每多一次交接就多一個會出錯的步驟，0.95 的單步成功率連乘 10 步只剩約 0.60，所以多 agent 只有在每個 worker 範圍夠窄時才划算；工具要少而精，每個工具定義都會佔每次請求的 context，也多一個選錯的機會；MCP 管 agent 往下接工具與資料，A2A 管 agent 之間委派長時間任務，同一個 codebase 裡的多 agent 用框架內建編排就好；MCP 的 tools、resources、prompts 由不同角色控制，readOnlyHint 這類標註只是提示，授權要在 server 端做。練習題改編自 systemdesign.academy 的多 agent 系統設計題。"
series:
  name: "AI Engineer 面試日練"
  order: 57
---

> 🌏 [English version](/posts/daily/2026-10-15-ai-interview-daily-en)

## 今日主題

星期四輪到 LLM & Agent Engineering。前幾週練過 agent 的失敗模式、終止條件和評估指標，今天往前一步，練架構階段的判斷：一個 agent 不夠穩的時候，該拆成多個 agent，還是把工具做好？面試官出「設計一個多 agent 系統」時，常常在等你主動說出「大部分情況應該是一個 agent 配更好的工具」，以及拆了之後誰負責接住出錯的那一步。

## 核心概念速記

### 可靠度會連乘：多一次交接就多一個出錯點

agent 每一步都有失敗機率。假設單步成功率 0.95，連續 10 步剩約 0.60，20 步剩約 0.36。把一個 agent 拆成多個，等於在流程裡加交接步驟，每一次交接都要再乘一次成功率。多 agent 只有在每個 worker 範圍夠窄、單步成功率因此明顯變高時才划算：只拿 3 個工具做一件事的 worker，成功率會比拿 30 個工具的通才高。

### 工具邊界：少而精，比多而重疊好

每個工具定義在每次帶著工具清單的請求裡都會佔 context，也多一個讓模型選錯的選項。實務上 12 個邊界清楚的工具，通常比 40 個功能重疊的工具好。驗證方式是比較工具選錯率和任務完成率。工具參數要用嚴格 schema，執行前先驗參數；會寫入、扣款、寄信的動作預設要人工核准。

### MCP 跟 A2A 管的是不同方向

MCP 是垂直的：agent 往下接工具和資料，型態是一問一答的工具呼叫，另一端是被動的。A2A 是水平的：一個 agent 把任務委派給另一個有自己模型和狀態的 agent，任務有生命週期，可能跑很久、會串流進度。判斷原則：多個 agent 都在同一個 codebase、同一個框架裡，用框架內建編排就好，不用多加一層網路協定；agent 來自不同團隊或廠商時才需要 A2A。

### MCP 的三種介面由不同角色控制，標註不等於授權

MCP server 提供三種東西：tools 由模型選擇要不要呼叫、resources 由 host 應用決定要不要放進 context、prompt templates 由使用者自己挑。`readOnlyHint` 這類標註只是提示，host 不能把它當成保證。真正的授權要在 server 端，對每個請求檢查身分、操作與目標資源。

## 今日練習題

### 題目

你的團隊有一個 coding assistant agent，可以讀 repo、改檔、跑測試、開 PR。最近錯誤率上升，有人提議拆成 planner、coder、reviewer 三個 agent。你會怎麼評估這個提案？

**來源**：改編自 systemdesign.academy 的多 agent 系統設計面試題　**難度**：中等　**環節**：onsite（LLM system design）

### 拆解思路

1. **先釐清問題**：錯誤率上升是哪一種錯？選錯工具、參數錯、改錯檔案、還是測試沒過就開 PR？現在一次任務平均幾步、接了幾個工具？有沒有 trace 可以看？
2. **建立框架**：先算可靠度帳。拆成三個 agent 至少多兩次交接，每次交接都可能遺失 context 或傳錯格式。只有在每個 agent 的單步成功率明顯提高時，總成功率才會比原本高。
3. **深入核心**：大多數錯誤可以先從工具層修：合併重疊工具、收緊 schema、把「開 PR」改成要測試通過才能呼叫的工具。reviewer 真正有價值的地方在「獨立驗證」，可以先做成一個固定的驗證步驟（跑測試、跑 linter、比對 diff 範圍），不一定要是另一個 LLM agent。
4. **收尾**：提出可以量測的實驗：先做工具層修正，比對 trace 上的工具選錯率與任務完成率；還不夠時才拆 agent，而且只拆最有獨立性的那一塊。

### 範例回答（面試時可以這樣講）

> **先診斷，不先拆。** 我會先拉最近 200 筆失敗的 trace，把錯誤分成選錯工具、參數錯、改錯範圍、驗證缺失四類。如果大宗是選錯工具，問題在工具邊界，不在 agent 數量。
>
> **先修工具層。** 把功能重疊的工具合併，參數改成嚴格 schema 並在執行前驗證；開 PR 的工具加前置條件，測試沒過就直接拒絕。這些改動不增加交接步驟，可靠度帳最划算。
>
> **拆的話只拆 reviewer，而且先用確定性驗證。** 假設單步成功率 0.95，一次任務 12 步，總成功率約 0.54；多兩次交接變 14 步，若單步沒變好，就掉到約 0.49。所以我會先把 reviewer 做成跑測試加 diff 範圍檢查的固定步驟，量測完成率；如果還需要語意層的審查，才加一個只讀 diff、只能回傳通過或退回原因的 reviewer agent，並用 OpenTelemetry trace 追每次交接的輸入輸出。

### 自我核對清單

用這張表檢查你的回答有沒有漏掉關鍵點：

| 核對項目 | 有提到？ |
|---------|---------|
| 先用 trace 分類錯誤，再決定要不要拆 | |
| 可靠度連乘：交接步驟本身也會失敗 | |
| 工具層修正（合併工具、嚴格 schema、前置條件） | |
| 每次交接的輸入輸出要可追蹤 | |
| 驗證步驟先用確定性檢查，不一定要另一個 LLM | |
| 加分：區分同框架編排與跨團隊 A2A 的使用時機 | |

## 延伸閱讀

- [Multi-Agent System Design Interview: The Reliability Math](https://systemdesign.academy/interview/design-multi-agent-system) — 用連乘可靠度說明為什麼多數設計應該是一個 agent 配更好的工具
- [Model Context Protocol System Design: The Tool Boundary](https://formation.dev/blog/mcp-system-design-tool-boundaries) — MCP 的 host／client／server 邊界、三種介面的控制者與授權位置
- [A2A vs MCP: Picking the Right Protocol for Your Multi-Agent System](https://joinloop.co.in/blog/a2a-vs-mcp-protocol-guide) — 兩個協定在互動型態、狀態與信任假設上的差異對照

## 參考資料

- [Multi-Agent System Design Interview: The Reliability Math — systemdesign.academy](https://systemdesign.academy/interview/design-multi-agent-system) — 可靠度連乘數字、窄範圍 worker、練習題來源
- [Model Context Protocol System Design: The Tool Boundary — Formation](https://formation.dev/blog/mcp-system-design-tool-boundaries) — 工具數量取捨、MCP 三種介面與標註不等於授權
- [MCP Specification: Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) — tools 由模型控制的官方定義
- [A2A vs MCP — Loop](https://joinloop.co.in/blog/a2a-vs-mcp-protocol-guide) — MCP 與 A2A 的分工
- [AI Engineer Interview Preparation Guide — AI Interviewer](https://ai-interviewer.tech/blog/ai-engineer-interview-preparation-guide) — 工具選錯、參數錯的防護與不可逆動作需人工核准
