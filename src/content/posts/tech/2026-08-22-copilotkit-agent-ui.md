---
title: "CopilotKit 完整介紹：把 Agent 狀態、工具與 Human-in-the-Loop 接進 React"
date: 2026-08-22
category: tech
type: deep-dive
tags: [copilotkit, agent-ui, react, generative-ui, ai-agent]
lang: zh-TW
tldr: "CopilotKit 不只提供聊天框；它用 React 元件、AG-UI 事件、共享狀態與中斷流程，把 Agent 的執行過程接進既有產品介面。"
description: "從 CopilotKit 的 React 前端、Runtime、AG-UI、共享狀態、生成式 UI 與 Human-in-the-Loop，說明它適合的 Agent 產品形狀與採用代價。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-copilotkit-agent-ui-en)

[CopilotKit](https://docs.copilotkit.ai/) 是一套把 AI Agent 接進 React 應用程式的前端堆疊。它有 `CopilotChat`、`CopilotSidebar` 等現成介面，但真正的重點是讓前端能看見 Agent 狀態、提供可呼叫工具、渲染工具結果，並在高風險動作前向使用者取得決定。

如果需求只是串流文字聊天，CopilotKit 可能太重。它更適合「Agent 必須和產品狀態一起工作」的場景。旅遊規劃器可以一邊更新行程卡片、一邊請使用者批准訂房；資料分析 Agent 也能逐步產生圖表，並依使用者修改的篩選條件繼續執行。

本文按一條互動資料流拆解：React UI → CopilotKit Runtime → AG-UI Agent → 狀態、工具與中斷事件 → React UI。產品與 API 範圍依官方文件查核於 **2026-08-22**；CopilotKit v1、v2 文件並存，實作前要先固定採用的 API 世代。

## 核心不是聊天框，是雙向事件迴圈

最小架構可以畫成：

```text
React components
      │ message / tool / state input
      ▼
CopilotKit provider + runtime
      │ AG-UI event stream
      ▼
Agent backend
      │ text / state snapshot / tool call / interrupt
      └──────────────────────────────► UI
```

[AG-UI 核心架構](https://docs.copilotkit.ai/ag-ui/concepts/architecture)把前端和 Agent 之間的互動表示成事件流。文字 token 只是其中一種事件；工具呼叫、狀態快照、執行開始與結束、錯誤及自訂活動都能走同一條連線。這讓 UI 不必從一段自然語言猜「Agent 現在進到哪一步」。

CopilotKit 的 Runtime 位在前端與 Agent 之間，負責連線、thread 與事件轉換。官方 quickstart 也提供 Built-in Agent，但採用 CopilotKit 不代表一定要把 Agent 邏輯搬進它的服務。LangGraph、CrewAI、Mastra、Pydantic AI 等後端可以透過對應整合或 AG-UI 接入。

## 從現成元件開始，但不要停在元件

官方提供 [CopilotChat](https://docs.copilotkit.ai/prebuilt-components/chat)與 [CopilotSidebar](https://docs.copilotkit.ai/prebuilt-components/sidebar)。前者是可放進頁面的聊天區，後者是包住主要內容的收合側欄。它們適合先確認 Agent 連線、串流與 thread 行為，再逐步替換樣式和訊息渲染。

```tsx
import { CopilotKit, CopilotSidebar } from "@copilotkit/react-core/v2";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <CopilotSidebar>{children}</CopilotSidebar>
    </CopilotKit>
  );
}
```

真正的設計問題不是側欄顏色，而是 Agent 能碰哪些產品能力。能改資料、寄信或下單的動作應由後端重新驗證身分與權限；前端註冊工具只代表「介面願意呈現這個能力」，不是安全邊界。

## Shared state：Agent 和畫面操作同一份工作狀態

[Shared State](https://docs.copilotkit.ai/coagents/shared-state)讓 Agent 執行狀態映射到 React。UI 可以顯示進度與中間結果，使用者在畫面上的修改也能回到 Agent。這和把整段 JSON 塞進下一則 prompt 不同：狀態有明確欄位與更新生命週期。

適合共享的，是任務草稿、步驟狀態、選取項目或 Agent 正在整理的結構化結果。不要把所有前端 state 都同步出去；游標位置、暫存動畫與純視覺狀態只會增加事件量和競態。實作前先列出 Agent 真正需要讀寫的最小 schema，再決定誰是每個欄位的 owner。

雙向更新也會產生衝突。使用者修改目的地時，Agent 可能同時回寫舊的行程。正式產品需要 revision、樂觀更新回滾或欄位層級的 ownership，而不是假設「最後寫入者獲勝」永遠合理。

## Tools、生成式 UI 與 Human-in-the-Loop

Agent 呼叫已知工具時，前端可以把參數和結果渲染成 React 元件，而不是印出 JSON。這是較可控的生成式 UI：模型選擇已註冊的工具，開發者決定每個工具能執行什麼、畫面長什麼樣。

```tsx
import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

useFrontendTool({
  name: "showWeather",
  description: "顯示指定城市的天氣",
  parameters: z.object({ city: z.string() }),
  handler: async ({ city }) => getWeather(city),
  render: WeatherCard,
});
```

較高風險的工作不該在工具一出現就自動執行。[Human-in-the-Loop](https://docs.copilotkit.ai/human-in-the-loop)可以暫停流程，把 Agent 的提案交給自訂元件，等使用者確認、修改或拒絕後再恢復。批准 UI 應顯示實際影響：寄給誰、金額多少、將修改哪筆資料，而不是只有模糊的「允許／拒絕」。

還要區分工具型 UI 和開放式生成 UI。前者由工具名稱映射到審過的元件，適合交易與營運流程。後者讓模型從元件 vocabulary 組介面，彈性較大，也需要更嚴格的 allowlist、資料驗證與互動限制。

## 跟 AI Elements、assistant-ui、A2UI 怎麼分

| 選項 | 主要邊界 | 優先考慮的情境 |
|---|---|---|
| CopilotKit | Agent、產品狀態、工具與中斷的完整前端互動層 | Agent 會操作既有應用程式，不只是聊天 |
| [assistant-ui](/posts/tech/2026-08-22-assistant-ui-runtime) | Chat primitives、runtime adapters 與 thread UX | 要精細控制聊天介面與後端 adapter |
| [AI Elements](/posts/tech/2026-08-19-vercel-ai-elements) | copy-in 的 AI 聊天元件 | 已使用 AI SDK，希望元件原始碼直接進 repo |
| [A2UI](/posts/ai/2026-05-23-a2ui-agent-to-ui-protocol) | Agent 傳送宣告式 UI 的協定 | 要讓不同 client 渲染同一份 UI 描述 |

CopilotKit 和 assistant-ui 都能呈現工具與 Agent 事件，分界不在功能勾選表。CopilotKit 的主線是「讓 Agent 進入應用程式」；assistant-ui 的主線是「用 runtime 接住不同後端，再組出完整 thread 介面」。先畫出你的狀態 owner 與 approval flow，答案通常就會浮出來。

## 整體取捨

CopilotKit 適合 Agent 必須讀寫畫面狀態、執行產品工具並等待人類決定的 React 應用。它省下事件協定、現成 chat、state bridge 與 HITL UI 的整合成本，代價是多一層 Runtime、協定與版本邊界要維護。

導入時先做一條窄流程：一個 Agent、一份小型 shared state、一個唯讀工具和一個需要批准的寫入工具。把權限、重試、取消、thread persistence 與衝突處理跑通，再擴成整個產品。若一開始只需要問答聊天，較小的元件層通常更合理。

## 參考資料

- [CopilotKit Documentation](https://docs.copilotkit.ai/)
- [CopilotKit Quickstart](https://docs.copilotkit.ai/quickstart)
- [AG-UI Core Architecture](https://docs.copilotkit.ai/ag-ui/concepts/architecture)
- [AG-UI State Management](https://docs.copilotkit.ai/ag-ui/concepts/state)
- [CopilotKit Shared State](https://docs.copilotkit.ai/coagents/shared-state)
- [CopilotKit Human-in-the-Loop](https://docs.copilotkit.ai/human-in-the-loop)
- [useFrontendTool v2](https://docs.copilotkit.ai/reference/v2/hooks/useFrontendTool)
- [CopilotChat](https://docs.copilotkit.ai/prebuilt-components/chat)
- [CopilotSidebar](https://docs.copilotkit.ai/prebuilt-components/sidebar)
- [CopilotKit GitHub](https://github.com/CopilotKit/CopilotKit)
