---
title: "A2UI（Agent-to-User Interface）：Google 讓 agent 把 UI 當資料傳出去的開放協定"
date: 2026-05-23
category: ai
type: deep-dive
tags: [a2ui, google, generative-ui, agent-protocol, mcp, ag-ui]
lang: zh-TW
tldr: "A2UI 是 Google 在 2025-12-15 開源的 agent 生成式 UI 協定：agent 只送宣告式 JSON 描述 UI 意圖，client 用自己的元件 catalog 白名單渲染成原生畫面，疊在 A2A 之上。發布時 format v0.8，3 個月後已迭代到 v0.9。"
description: "拆解 Google A2UI 協定：『UI 即資料』的設計哲學、catalog 白名單安全模型、四種訊息與 booking flow，以及它跟 MCP Apps、AG-UI、OpenAI ChatKit 的分工與已知限制。"
draft: true
---

當 AI agent 碰到「幫我訂位」這種結構化任務時，純文字 chat 會退化成冗長的一問一答。更好的體驗是 agent 直接生出一張帶日期選擇器、時間下拉、送出按鈕的表單。問題是：在多 agent 協作的時代，真正做事的 agent 常常是遠端、跨組織、碰不到你 DOM 的——它要怎麼把「介面」安全地送到你的前端？這就是 Google 在 2025-12-15 開源的 **A2UI（Agent-to-User Interface）** 協定想解的事。這篇拆解它的設計哲學、訊息格式，以及它跟 MCP Apps、AG-UI、ChatKit 的分工。

## A2UI 要解的問題：multi-agent mesh 的「UI 傳不過去」

A2UI 的出發點不是「讓 AI 畫得更漂亮」，而是 **跨信任邊界的 UI 傳輸**。依 Google developers blog 的說法，我們正進入「multi-agent mesh」時代——Google 的 agent 在跟 Cisco、IBM、SAP、Salesforce 的 agent 講話，這也是當初 [A2A（Agent-to-Agent）協定](https://a2a-protocol.org/) 被建立並捐給 Linux Foundation 的原因。

但去中心化帶來一個 UI 問題：如果 agent 活在你的 app 裡，它可以直接操作 view layer（例如 DOM）；可是在多 agent 世界，做事的 agent 往往跑在別的伺服器、屬於別的組織，「它碰不到你的 UI，只能送訊息」。

歷史上要從遠端、不受信任的來源 render UI，做法是送 HTML/JavaScript 再用 **iframe** sandbox 隔離。Google 點出這條路的代價：「又重、視覺上容易跟你的 app 原生樣式不一致、還帶來安全邊界的複雜度」。A2UI 要的是另一種東西——一種「**safe like data, but expressive like code**（像資料一樣安全、像程式一樣有表達力）」的傳輸格式。

## 核心設計：把 UI 當資料，不當程式碼

A2UI 的整套設計可以濃縮成一句話：**agent 送的是「我想要哪些元件、怎麼排、綁什麼資料」的宣告式 JSON，不是可執行碼。** 圍繞這點有三個關鍵決定：

- **Security first（catalog 白名單）**：跑 LLM 生出來的任意程式碼風險很高，所以 A2UI 是宣告式資料格式。client 端維護一份「catalog」——一組受信任、預先核可的元件（`Card`、`Button`、`TextField`…），agent 只能「請求 render 目錄裡有的元件」。Google 的原話是這「help you to reduce the risk of UI injection and other vulnerabilities」。
- **結構與實作分離**：A2UI 只描述 component tree 加 data model，「長什麼樣」由 client 決定。同一份 JSON payload 能在 Lit、Angular、Flutter，甚至（未來）React、SwiftUI 上 render，並自動繼承 host app 的品牌樣式與無障礙特性。
- **LLM 友善、可增量更新**：UI 被表示成「一個帶 ID 參照的扁平元件清單」，方便 LLM 漸進式生成（progressive rendering）；對話往下走時，agent 只要送局部更新，不必整張重畫。

代價也說得很白：A2UI「給 client 更多控制權，at the expense of the agent（犧牲 agent 的自由度）」——換句話說，agent 放棄了像素級的任意樣式控制，換來跨平台一致性與安全性。

## 訊息怎麼流動

A2UI 是 transport-agnostic 的，任何能送 JSON 的機制都行；目前支援 **A2A** 與 **AG-UI** 當傳輸層，REST / WebSocket / SSE 規劃中。協定有四種主要訊息類型（依 a2ui.org Core Concepts 與 Google Developer Advocate Mete Atamel 的整理）：

- `createSurface`：建立一個 surface 並指定它用哪個 catalog
- `updateComponents`：在 surface 裡新增或更新元件
- `updateDataModel`：更新應用狀態
- `deleteSurface`：移除 surface

以餐廳訂位為例，agent 會先建 surface、再定義 UI 結構、最後灌資料：

```json
{
  "version": "v0.9",
  "updateComponents": {
    "surfaceId": "booking",
    "components": [
      { "id": "root", "component": "Column",
        "children": ["header", "guests-field", "submit-btn"] },
      { "id": "header", "component": "Text",
        "text": "Confirm Reservation", "variant": "h1" },
      { "id": "guests-field", "component": "TextField",
        "label": "Guests", "value": { "path": "/reservation/guests" } },
      { "id": "submit-btn", "component": "Button", "variant": "primary",
        "action": { "event": { "name": "confirm",
          "context": { "details": { "path": "/reservation" } } } } }
    ]
  }
}
```

使用者把 guests 改成 3、按下 Confirm，client 會把一個 `action` event 帶著 context 回送給 agent；agent 再決定要更新 UI 還是 `deleteSurface` 收掉。整個迴圈裡，**UI 結構與資料是分開傳的**——這也是它能漸進更新的關鍵。

## A2UI vs MCP Apps vs AG-UI vs ChatKit

2025 下半年，「agent 怎麼吐 UI」這題一次冒出好幾套標準。Google 自己在公告裡花了一整段做地圖，重點如下：

**vs MCP Apps（MCP-UI + OpenAI 合流）**：[MCP（Model Context Protocol）](/posts/ai/2026-03-22-mcp-model-context-protocol) 在 2025-11 推出 MCP Apps，把 MCP-UI 和 OpenAI 的工作整合起來。它的模型是「**UI 當資源**」——tool 回傳一個 `ui://` URI，client 抓一包預建的 HTML 丟進 sandbox iframe 隔離。A2UI 走的是 **native-first**：送的是原生元件的 blueprint，而不是不透明的 HTML payload，所以 UI 能完美繼承 host 的樣式與無障礙；而且多 agent 情境下，orchestrator agent 能「讀懂」子 agent 那段輕量的 A2UI 訊息再修改。一句話：**MCP Apps 是把畫好的 UI 當資源抓來隔離顯示；A2UI 是把 UI 意圖當資料傳，由你來畫。**

**vs AG-UI（名字超像，角色不同且互補）**：這兩個最容易搞混。依 Mete Atamel 的拆解——**AG-UI 連的是「你的前端 app ↔ agentic 後端」**（負責 state 同步、chat history、input 這些「管線」）；**A2UI 是「agent 回應裡那段 UI widget 的宣告格式」**。兩者疊用：AG-UI 當 transport 與 scaffolding，A2UI 當資料格式。CopilotKit / AG-UI 的創辦人 Atai Barkai 表示他們做到了 day-0 相容：「AG-UI fully supports the A2UI spec... We're excited to provide day-0 compatibility between AG-UI and A2UI.」

**vs OpenAI ChatKit**：ChatKit 是 OpenAI 生態內高度整合、最佳化的部署體驗。A2UI 的定位則是面向「跨 Web / Flutter / 原生行動」自建 agentic surface，以及企業 A2A mesh 跨信任邊界的場景。

## 什麼時候該用 A2UI

適合：

1. **多 agent / 跨組織 mesh**——需要遠端、你不完全信任的 agent 在你 app 裡 render。
2. **同一套 agent 要多端一致**——Web、行動、桌面共用一份 UI 宣告。
3. **企業流程型 agent**——填表、審批 dashboard、引導式 workflow。這正是 Gemini Enterprise 整合 A2UI 的主打場景；Flutter 的 [GenUI SDK](https://github.com/flutter/genui) 也已在底層用 A2UI 當 server↔app 的 UI 宣告格式。

暫時不必：

- agent 就活在自家單一前端、同信任域 → 直接用 generative UI（例如 Vercel AI SDK）更省。
- 已深綁 OpenAI 生態 → ChatKit 更順。
- 需要高度自由、像素級客製的視覺 → catalog 白名單模式會綁手綁腳。

## 限制與還沒定下來的部分

A2UI 值得追，但 2026 上半年仍是 **early-stage public preview**（Apache 2.0 授權），上正式系統前要接受幾個現實：

- **格式還在動**：發布時 format 是 `v0.8`，官方明說「expect changes」；到 2026-03 的官方 DevRel 文章，範例已經用到 `v0.9`。三個月跳一個 minor，節奏不慢。
- **文件範例跟實際 wire format 對不太起來**：簡化文件用的訊息名是 `createSurface` / `updateComponents`，但同一篇文章貼出的 ADK 樣本 log 卻是 `beginRendering` / `surfaceUpdate`，而且元件是巢狀成 `{"Column": {...}}` 的形式。換句話說 wire 細節還沒完全定，**別把任何單一欄位名當權威**，以 a2ui.org/specification 為準。
- **「跨平台 UI 語言」的老懷疑**：A2UI 在 Hacker News 上有 164 points、75 則討論。有人（codethief）直接吐槽「agent 突然能做開發者幾十年都沒做好的平台無關 UI？簡單場景行，再複雜就存疑」；也有人（rockwotj）一句點破本質：「其實就是 server-side rendering，只是讓 LLM 來寫 markup language。」
- **catalog ≠ 免疫**：白名單壓低了風險，但安全來自「能力受限的元件目錄」本身，而不是「用 JSON 而非 HTML」這件事——若協定容許任意行為/樣式，injection 問題照樣存在。
- **標準碎片化**：MCP-UI、ChatKit widgets、A2UI 同題三開，HN 上免不了「又一個變體、浪費工時」的抱怨。誰會勝出未定；該串裡有一句蠻中肯：「贏的不會是 demo 最炫的，而是無聊到產品團隊願意用 5–10 年的那個。」

## 整體架構

```
[ 遠端 A2A subagent ] ─┐
                       │   A2UI JSON
                       │   (createSurface / updateComponents /
                       │    updateDataModel / deleteSurface)
[ orchestrator agent ] ┼──► transport: A2A 或 AG-UI ──► [ Client app ]
                       │                                     │
   只送「UI 意圖」, ───┘                                     ├─ catalog 白名單 (Card/Button/TextField…)
   不送可執行碼                                              ├─ 原生框架 render (Lit / Angular / Flutter)
                                                            └─ 使用者操作 → action event 回送 agent
```

放進更大的協定地圖：MCP 管「agent ↔ 工具/資源」、A2A 管「agent ↔ agent」、AG-UI 管「前端 ↔ agentic 後端」，而 A2UI 補的是「**agent → 使用者介面**」這一塊。

## 整體來說

A2UI 賭的是「**UI 即資料**」這條路線：用受限的宣告式格式加上 client 端的 catalog 白名單，換取跨框架可攜性、跨信任邊界的安全、以及 orchestrator 能讀懂的輕量訊息——代價是 agent 失去像素級自由，且綁在「client 已實作對應元件」的前提上。如果你在做企業級、多 agent、多端的 agentic 產品，它很值得現在就開始試（CopilotKit 有 A2UI Composer、Flutter 有 GenUI SDK 可玩）；但如果你的 agent 就活在自家單一前端，現有的 generative UI 方案還是更省事。記得它仍是 preview，spec 會變。

## 參考資料

- [Introducing A2UI: An open project for agent-driven interfaces — Google Developers Blog](https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/)
- [google/A2UI — GitHub](https://github.com/google/a2ui)
- [a2ui.org — 官方文件與 Core Concepts](https://a2ui.org/)
- [Agent to UI Protocol (A2UI) with ADK — Mete Atamel](https://atamel.dev/posts/2026/03-30_a2ui_with_adk/)
- [A2UI: A Protocol for Agent-Driven Interfaces — Hacker News 討論](https://news.ycombinator.com/item?id=46286407)
- [Build with Google's new A2UI Spec — CopilotKit Blog](https://www.copilotkit.ai/blog/build-with-googles-new-a2ui-spec-agent-user-interfaces-with-a2ui-ag-ui)
- [A2A（Agent-to-Agent）Protocol](https://a2a-protocol.org/)
- [Flutter GenUI SDK — GitHub](https://github.com/flutter/genui)
- [MCP（Model Context Protocol）：AI Agent 工具呼叫的標準化協定](/posts/ai/2026-03-22-mcp-model-context-protocol)
```
