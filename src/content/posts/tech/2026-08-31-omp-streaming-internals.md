---
title: "OMP streaming internals：事件流不是 token stream，而是 agent 的可觀測控制面"
date: 2026-08-31
category: tech
type: deep-dive
tags: [omp, agent-loop, coding-agent, architecture, typescript, streaming]
lang: zh-TW
series:
  name: "OMP 內部設計導讀"
  order: 16
tldr: "OMP 的 Agent stream 不只是把 token 往終端機吐：它把 agent、turn、message、tool execution 分成不同層級的事件。理解這個事件契約，才能在 UI 顯示增量文字、工具進度與錯誤，同時不把暫存中的 partial message 誤當成已提交的對話。"
description: "從 @oh-my-pi/pi-agent 的公開事件契約拆解 OMP streaming：AgentMessage 與 LLM Message 的轉換、prompt 搭配工具呼叫時的事件順序、partial state、tool progress，以及為什麼 UI 應該訂閱事件而不是猜對話狀態。"
draft: false
---

> 🌏 [English version](/en/posts/tech/2026-08-31-omp-streaming-internals-en)

[OMP 內部設計導讀](/posts/tech/2026-08-31-omp-agent-loop-double-while)系列第 16 篇。前面幾篇拆的是 loop、context、TUI 與工具邊界；這篇往下看一個常被簡化成「模型吐字」的介面：stream。

---

## TL;DR

- `agent_start`／`agent_end` 描述一次完整 agent run；`turn_start`／`turn_end` 描述其中一次 model call 加工具執行。
- `message_update` 只代表 assistant 訊息的增量更新；工具進度是另一條 `tool_execution_update` 事件。
- `AgentMessage` 可以包含 UI 或應用程式自訂訊息，呼叫模型前才由 `convertToLlm` 篩選、轉成 LLM 看得懂的訊息。
- `streamMessage` 是串流中的 partial state，不等於已經寫進 `messages` 的完成訊息。
- UI 只要對事件型別做明確分派，就能同時支援純文字回覆、工具呼叫、工具進度、錯誤與 retry。

## 先把四個層級分開

在 [@oh-my-pi/pi-agent](https://github.com/can1357/oh-my-pi/tree/main/packages/agent) 裡，stream 不是單一資料型別，而是一組有層級的事件。最外層是 agent run：從 `agent_start` 開始，直到所有回覆與工具迴圈完成後發出 `agent_end`。

run 裡面有一個或多個 turn。一次 turn 包含一次模型呼叫，以及模型在這次回覆裡要求的工具執行。模型先回純文字，可能只有一個 turn；模型回 tool call 時，工具結果注入 context 後，agent 會再開下一個 turn，讓模型讀結果並繼續。

turn 裡面又有 message。user、assistant、tool result 都會經過 `message_start` 和 `message_end`。assistant 在中間還會收到 `message_update`，這就是 UI 顯示增量文字與增量 tool call 的位置。

最後才是 tool execution。工具有自己的 start、update、end，不應該被當成 assistant message 的文字片段。

```text
agent run
├─ turn 1
│  ├─ user message
│  ├─ assistant message_update...
│  └─ tool execution
│     ├─ start
│     ├─ update...
│     └─ end → tool result message
└─ turn 2
   ├─ assistant message_update...
   └─ assistant message_end
```

## prompt 的事件順序

最小的 `agent.prompt("Hello")` 大致會走：

```text
agent_start
turn_start
message_start      user
message_end        user
message_start      assistant
message_update     assistant partial
message_update     assistant partial
message_end        assistant complete
turn_end
agent_end
```

有工具時，assistant 的完成訊息不是 run 的終點：

```text
message_end             assistant with toolCall
tool_execution_start
tool_execution_update   optional progress
tool_execution_end
message_start/end        toolResult
turn_end
turn_start               next model call
message_update...
```

這個差別很重要。若 UI 收到 assistant 的 `message_end` 就把整個 run 標記為完成，工具呼叫會被畫成「模型已經說完」，下一輪真正的回覆反而沒有地方顯示。正確做法是把 message 完成與 agent run 完成視為兩件事。

## `AgentMessage` 不是直接送給模型的格式

OMP 允許 `AgentMessage` 放入應用程式自己的訊息型別，例如 UI 通知或 session 事件；LLM 則只理解 user、assistant、tool result 等標準訊息。兩者之間有一條明確的轉換邊界：

```text
AgentMessage[]
    → transformContext()   // 可選：裁剪、補外部 context
    → convertToLlm()
    → LLM Message[]
    → model stream
```

`transformContext` 解決「這次要讓模型看到哪些訊息」；`convertToLlm` 解決「自訂訊息要如何被過濾或改寫」。把這兩件事混在 UI 的 stream handler 裡，會讓顯示狀態和模型 context 互相污染。UI 可以顯示一個 notification，但不代表 notification 必須進 prompt。

## partial state 與已提交訊息

`AgentState` 同時有 `messages`、`isStreaming` 和 `streamMessage`。串流期間，`streamMessage` 保存目前的 partial assistant message；完整訊息結束後，才由事件與狀態更新交給應用程式保存或渲染。

因此 UI 最好採用兩條路徑：

1. 收到 `message_update` 時，用 delta 或 partial state 更新正在畫的 assistant bubble。
2. 收到 `message_end` 時，將它視為可持久化的完整訊息；不要把每一個 delta 都 append 成獨立 message。

這也是為什麼 [Agent 的 subscribe API](https://github.com/can1357/oh-my-pi/tree/main/packages/agent#events) 比定時讀取 state 更合適：事件告訴你「發生了什麼」，state 告訴你「現在長什麼樣」。前者適合增量渲染，後者適合重繪與恢復。

## 工具進度是另一種輸出

工具可以在 `execute` 裡透過 `onUpdate` 回報進度；README 的例子用它傳出「Reading...」和工具自訂的 details。這些資料適合顯示成可折疊的執行卡片，不要拼到 assistant 的自然語言回覆裡。

```ts
const readFileTool = {
  name: "read_file",
  label: "Read File",
  parameters: type({ path: type("string") }),
  execute: async (toolCallId, params, signal, onUpdate) => {
    onUpdate?.({
      content: [{ type: "text", text: "Reading..." }],
      details: { path: params.path },
    });
    return { content: [{ type: "text", text: "..." }] };
  },
};
```

一個實用的 UI reducer 可以只關心三件事：assistant 的文字增量累積到目前 bubble、tool update 更新工具卡片、end 事件把卡片鎖定。其他 lifecycle event 則負責 spinner、turn 分隔線與 retry 按鈕。這比從文字內容猜「模型是不是在叫工具」穩定得多。

## 低階 async iterator 與高階 Agent

高階 `Agent` 適合一般應用：設定 initial state、訂閱事件、呼叫 `prompt()`。需要自己驅動 context 或測試事件序列時，可以使用 [低階 `agentLoop`](https://github.com/can1357/oh-my-pi/tree/main/packages/agent#low-level-api) 的 async iterator：

```ts
for await (const event of agentLoop([userMessage], context, config)) {
  render(event);
}
```

這裡的取捨很清楚：高階 API 隱藏 queue、state 與 lifecycle 的管理；低階 API 把每個事件交給呼叫端，方便做 recorder、snapshot test 或自訂 transport。若只是想顯示文字，不需要自己重寫 agent loop；若要驗證「工具 timeout 後是否仍會產生下一個 turn」，低階 iterator 才提供足夠觀察力。

## 整體來說

OMP 的 stream 契約把「模型的增量輸出」放回更大的 agent lifecycle 裡。它不是單純的 token pipe，而是 UI、工具執行、context 轉換與錯誤處理共用的控制面。

真正要實作時，先畫出 agent／turn／message／tool 四層，再決定每個事件要更新哪個 state。這樣即使未來加入 steering、follow-up、工具 streaming 或 retry，UI 也不必靠字串猜測內部狀態。

## 參考資料

- [OMP `@oh-my-pi/pi-agent` package README](https://github.com/can1357/oh-my-pi/tree/main/packages/agent)
- [OMP Agent low-level API](https://github.com/can1357/oh-my-pi/tree/main/packages/agent#low-level-api)
- [OMP Agent event subscription](https://github.com/can1357/oh-my-pi/tree/main/packages/agent#events)
