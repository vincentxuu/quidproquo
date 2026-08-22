---
title: "assistant-ui 完整介紹：用 Runtime 與 Primitives 組出可替換後端的 Agent Chat"
date: 2026-08-22
category: tech
type: deep-dive
tags: [assistant-ui, agent-ui, react, generative-ui, ai-agent]
lang: zh-TW
tldr: "assistant-ui 把 Agent Chat 拆成 headless React primitives、conversation runtime 與後端 adapters；UI 不必直接綁死某個模型 SDK 的 message state。"
description: "拆解 assistant-ui 的 Thread、Message、Composer primitives、Runtime、後端 adapters、工具 UI 與 thread persistence，說明適用邊界。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-assistant-ui-runtime-en)

[assistant-ui](https://www.assistant-ui.com/docs) 是給 React Agent Chat 使用的元件與狀態層。它把介面拆成 Thread、Message、Composer、ActionBar 等 primitives，再用 Runtime 把這些元件接到 AI SDK、LangGraph、AG-UI、A2A 或自訂後端。

它解的不是「怎麼呼叫模型」，而是模型開始串流後，前端怎麼處理完整的對話行為。這包含訊息 parts、工具呼叫、重送、編輯、分支、附件、thread 切換和持久化。這些功能若直接長在某個 SDK 的 `useChat()` 周圍，換後端或加 Agent 事件時通常會整片重寫。

本文按 ownership 拆解：primitives 負責呈現，Runtime 負責 conversation state，adapter／protocol 負責接後端，資料庫或 Assistant Cloud 負責 persistence。文件與 API 範圍查核於 **2026-08-22**；官方 runtime 頁明確標示多個 SDK 世代與 unstable API，採用時要固定版本。

## 四層架構先分清楚

[官方架構文件](https://www.assistant-ui.com/docs/architecture)把系統拆成 UI、Runtime、backend／agent、persistence：

```text
Thread / Message / Composer primitives
                 │
                 ▼
       AssistantRuntimeProvider
        message + run + thread state
                 │ adapter / protocol
                 ▼
 AI SDK / LangGraph / AG-UI / custom backend
                 │
                 └── database or Assistant Cloud
```

UI 元件不直接 fetch 模型，也不自己保存完整對話。它們從最近的 Runtime context 讀取狀態與送出命令。Runtime 決定誰擁有 messages、streaming lifecycle、editing、regeneration 與 thread；adapter 再把特定後端的事件轉成這套介面。

這個分層的直接好處是樣式與後端可以各自替換。代價是除錯時要先判斷問題出在 renderer、runtime state、adapter conversion，還是後端 event。團隊若不願維護這個邊界，抽象層反而會讓簡單聊天變難追。

## Primitives：把完整 Chat 拆成可組合行為

[Headless Primitives](https://www.assistant-ui.com/docs/primitives)採類似 Radix UI 的結構。`Root` 提供 context，子元件處理輸入、送出、捲動、鍵盤操作與 streaming 狀態；`asChild` 能把行為套到自己的元素。

```tsx
import { ComposerPrimitive } from "@assistant-ui/react";

export function Composer() {
  return (
    <ComposerPrimitive.Root>
      <ComposerPrimitive.Input placeholder="問點什麼…" />
      <ComposerPrimitive.Send>送出</ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
}
```

現成 Thread component 適合快速開始；primitives 適合產品已經有 design system、需要自訂訊息 layout、floating composer 或 inline edit。這和 copy-in 元件不同：你可以控制 DOM 與樣式，但行為仍依賴 assistant-ui Runtime contract。

## Runtime 才是選型核心

[Picking a runtime](https://www.assistant-ui.com/docs/runtimes/pick-a-runtime)把選擇分得很實際。既有 AI SDK、LangGraph、AG-UI、A2A 等後端就用對應 adapter。簡單自訂 API 可用 LocalRuntime；messages 已在 Redux、Zustand 或其他 store 時用 ExternalStoreRuntime；需要完整 Agent state snapshot 時則走 AssistantTransport。

Runtime 不只是 transport。它決定訊息正規化、run 狀態、composer、thread navigation、branch、edit 和 reload 行為。先選元件再硬接 Runtime，通常會把資料 ownership 弄亂。正確順序是先回答：「訊息的唯一真相在哪裡？」再選 runtime，最後才組 UI。

例如後端已用 AI SDK streaming protocol，就不該在前端另造一份 message reducer。若 Agent session 才是 thread 的 owner，則應用 adapter 回放 event log，而不是讓 LocalRuntime 假裝擁有全部狀態。

## Tool UI：已知工具、互動狀態與生成式介面

[assistant-ui Tools](https://www.assistant-ui.com/docs/tools)讓工具 schema、執行位置與 renderer 組成 toolkit。已知工具可以渲染 loading、result、error 與 approval；frontend tool 在瀏覽器執行，backend tool 留在伺服器，human tool 則等待使用者輸入。

官方文件另外區分幾種生成式 UI。已知 tool call 可以對應自訂元件；使用者和模型也能共同操作 interactable。其他做法還包括讓模型從 allowlist 組出元件樹，或由 LangGraph node 推送 UI。它們的信任模型不同，不能全叫「模型生畫面」就共用一套權限。

無論哪種方式，renderer 都不是授權。刪除資料、付款或寄信必須在後端再次驗證使用者、tool arguments 與目前資源狀態。讓模型決定顯示哪張卡片可以；讓前端工具繞過伺服器權限不可以。

## Thread 與 persistence 不應綁在畫面裡

Thread UX 包含建立、切換、封存、刪除、編輯訊息、branch 與重新生成。assistant-ui Runtime 可以協調這些操作，但 persistence 可由 [Assistant Cloud](https://www.assistant-ui.com/docs/cloud)或自己的 database adapter 負責。

正式產品要先決定 thread ID、使用者與組織的 scope、message ordering、附件保存、刪除語意及權限撤銷。把 localStorage demo 直接推上線，最容易在多裝置、多人組織與法遵刪除時出問題。UI 能列出 thread 不代表資料層已安全隔離。

## 跟 CopilotKit、AI Elements 怎麼分

| 選項 | 主脊 | 適合情境 |
|---|---|---|
| assistant-ui | primitives → runtime → adapter → thread | Chat UX 與後端可替換性是核心 |
| [CopilotKit](/posts/tech/2026-08-22-copilotkit-agent-ui) | 應用程式狀態、Agent 工具與 HITL | Agent 深入操作既有產品介面 |
| [AI Elements](/posts/tech/2026-08-19-vercel-ai-elements) | shadcn copy-in 元件與 AI SDK message parts | 已在 AI SDK 上，只想取得可改原始碼的元件 |
| [A2UI](/posts/ai/2026-05-23-a2ui-agent-to-ui-protocol) | 跨 client 的宣告式 UI protocol | 同一 Agent UI 描述要跨不同 renderer |

assistant-ui 並不保證換 backend 完全零成本。不同後端支援的 tool event、agent state、interrupt 與 attachment 不一樣；adapter 能統一共同面，但特有能力仍會露出來。它提供的是清楚的替換接點，不是把差異消失。

## 整體取捨

assistant-ui 適合把 Agent Chat 當正式產品介面的團隊。這類產品需要完整 thread 行為、工具 UI、附件與可替換後端，又不想自己從 accessibility、auto-scroll 和 streaming state 開始造輪子。

導入順序應是 runtime 先於 styling。先用一個 thread、一種 message stream 和一個工具跑通，確認 edit、cancel、retry、error 與 persistence ownership，再換成設計系統。若產品只有一個簡單問答框，而且後端不會更換，直接使用既有 SDK 的 chat hook 可能更省。

## 參考資料

- [assistant-ui Documentation](https://www.assistant-ui.com/docs)
- [assistant-ui Architecture](https://www.assistant-ui.com/docs/architecture)
- [Headless Chat Primitives](https://www.assistant-ui.com/docs/primitives)
- [Picking a Runtime](https://www.assistant-ui.com/docs/runtimes/pick-a-runtime)
- [Runtime Architecture](https://www.assistant-ui.com/docs/runtimes/concepts/architecture)
- [assistant-ui Tools](https://www.assistant-ui.com/docs/tools)
- [Assistant Cloud](https://www.assistant-ui.com/docs/cloud)
- [assistant-ui GitHub](https://github.com/assistant-ui/assistant-ui)
