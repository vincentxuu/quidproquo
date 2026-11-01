---
title: "Cloudflare Agents SDK 怎麼選起點：Pi harness、Agent、AIChatAgent 與 Think"
date: 2026-10-28
type: deep-dive
category: ai
tags: [cloudflare, cloudflare-agents, agent-harness, durable-objects, ai-agent]
lang: zh-TW
tldr: "已有 harness 就用 PiHarness；做 chat、要自己組模型呼叫用 AIChatAgent，交給框架用 Think；不是 chat 但要狀態、排程、MCP，用 Agent。"
description: "比較 Cloudflare Agents SDK 的四個起點：PiHarness、Agent、AIChatAgent、Think，拆解 Lifecycle 分層、各自的 loop 歸屬，以及 dynamic agents、agent tools、Code Mode 的使用邊界。"
draft: false
glossary:
  - term: "Agent harness"
    aliases: ["harness"]
    definition: "跑 agent loop 的那一層：決定何時呼叫模型、怎麼選工具、工具結果怎麼回到 context、失敗怎麼重試、crash 後從哪裡接續。"
    context: "本文用它區分 Pi Durable、Think、AIChatAgent 與你自己寫的 loop。"
  - term: "Facet"
    aliases: ["facets"]
    definition: "Workerd 的執行單元，讓 child Durable Object 跟 parent 跑在同一台機器上，但有獨立的 isolate 與 SQLite。"
    context: "Cloudflare 的 dynamic agents 就是用 facet 實作。"
---

> 🌏 [English version](/posts/ai/2026-10-28-cloudflare-agents-sdk-entry-points-en)

打開 [cloudflare/agents](https://github.com/cloudflare/agents) 的 README，第一個範例是 `Agent` class 加 `@callable()`。打開[官方文件首頁](https://developers.cloudflare.com/agents/)，第一句卻是 "Start with the Pi harness"，Get started 段也寫「Build your agent with the Pi harness」。兩個都對，但它們講的不是同一層。

這個 repo 在 2026-10-28 有 5.9k stars、1,800 多個 commits。它最早是一個 `Agent` class，現在是一個 Durable Object runtime，加上四個可以選的起點：PiHarness、Agent、AIChatAgent、Think。選錯不會讓你跑不起來，會讓你多寫一層之後才發現 SDK 已經做了，或反過來，被一個 experimental 的 API 綁住。

這篇只回答一個問題：**你的 agent loop 要放在哪裡？**

## 這是什麼

Cloudflare Agents 是跑在 Workers 上的 agent runtime。每個 agent 是一個 [Durable Object](https://developers.cloudflare.com/durable-objects/)：有固定位址、自己的 SQLite、一個 alarm、可以接 WebSocket。閒置時休眠，有工作時被叫醒。它不是模型、不是 prompt 框架、也不是 chat UI；它處理 agent 在產品裡活著的那一層。

repo 現在有 50 多個範例、五組文件（agents、think、codemode、voice、shell），還有一份 `design/` 目錄記錄架構決策。對第一次打開的人，問題不是「能不能跑」，是「這麼多 class，哪一個是我要繼承的」。

以下版本以 2026-10-28 的 npm latest 為準：`agents` 0.31.0、`@cloudflare/ai-chat` 0.12.2、`@cloudflare/think` 0.22.0、`@cloudflare/codemode` 0.5.5。0.x 的 API 會動，升級前先看 changelog。

## 先分清楚：runtime 和 harness

同一個 repo 裡有兩個不同的東西，文件把它們混在一起講。

**Runtime** 負責讓 agent 活著：穩定位址、SQLite、WebSocket、alarm、job queue、被回收後叫回來。這一層的接縫是 `agents/lifecycle`。

**Harness** 負責跑 loop：什麼時候呼叫模型、怎麼選工具、工具結果怎麼塞回 context、失敗要不要重試、context 滿了怎麼壓縮、crash 之後從哪裡接。

分開之後，「agent 掛掉怎麼辦」有兩個答案。Runtime 保證物件會被 alarm 叫回來、SQLite 還在；harness 決定回來之後從哪裡繼續、哪個工具可以重跑。兩個都要回答，但由不同層回答。

```diagram
title: Agents SDK 的五層：harness 和 runtime 分開看
desc: 由上而下是應用通道、harness、Agent 預設組合、Lifecycle 與 Durable Object；harness 決定 loop，Lifecycle 與 DO 決定 agent 怎麼活著。
caption: PiHarness 可以直接掛在 Lifecycle 上，不必經過 Agent；AIChatAgent 與 Think 則是 Agent 的子類別。
---
<svg viewBox="0 0 440 392">
  <path class="dg-axis" d="M24 360V40" marker-end="url(#arrow)"/>
  <text class="dg-sub" x="24" y="12" text-anchor="middle" font-weight="700" dominant-baseline="central">抽象</text>
  <text class="dg-sub" x="24" y="380" text-anchor="middle" font-weight="700" dominant-baseline="central">具體</text>

  <rect class="dg-box" x="52" y="24" width="372" height="56" rx="6"/>
  <text class="dg-sub" x="68" y="52" font-weight="700" dominant-baseline="central">L5</text>
  <text class="dg-label" x="96" y="52" dominant-baseline="central">應用與通道</text>
  <text class="dg-sub" x="408" y="52" text-anchor="end" dominant-baseline="central">WebSocket、HTTP、email、Slack</text>

  <rect class="dg-box" x="52" y="88" width="372" height="72" rx="6"/>
  <text class="dg-sub" x="68" y="112" font-weight="700" dominant-baseline="central">L4</text>
  <text class="dg-label" x="96" y="112" dominant-baseline="central">Harness</text>
  <text class="dg-sub" x="96" y="136" dominant-baseline="central">誰跑 agent loop</text>
  <text class="dg-sub" x="408" y="112" text-anchor="end" dominant-baseline="central">Pi Durable、Think</text>
  <text class="dg-sub" x="408" y="136" text-anchor="end" dominant-baseline="central">AIChatAgent、自寫 loop</text>

  <rect class="dg-box" x="52" y="168" width="372" height="56" rx="6"/>
  <text class="dg-sub" x="68" y="196" font-weight="700" dominant-baseline="central">L3</text>
  <text class="dg-label" x="96" y="196" dominant-baseline="central">Agent（可選）</text>
  <text class="dg-sub" x="408" y="196" text-anchor="end" dominant-baseline="central">state、schedules、MCP</text>

  <rect class="dg-box dg-box--accent" x="52" y="232" width="372" height="56" rx="6"/>
  <text class="dg-sub" x="68" y="260" font-weight="700" dominant-baseline="central">L2</text>
  <text class="dg-label" x="96" y="260" dominant-baseline="central">Lifecycle</text>
  <text class="dg-sub" x="408" y="260" text-anchor="end" dominant-baseline="central">fetch、alarm、WebSocket</text>

  <rect class="dg-box" x="52" y="296" width="372" height="56" rx="6"/>
  <text class="dg-sub" x="68" y="324" font-weight="700" dominant-baseline="central">L1</text>
  <text class="dg-label" x="96" y="324" dominant-baseline="central">Durable Object</text>
  <text class="dg-sub" x="408" y="324" text-anchor="end" dominant-baseline="central">isolate、SQLite、休眠</text>
</svg>
```

## 四個起點，加一個自己組

四個起點不是四種功能，是四種「loop 歸誰」的安排。

| 起點 | loop 誰跑 | 你得到什麼 | 你要自己做什麼 | 狀態 |
|---|---|---|---|---|
| PiHarness | Pi Durable | DO 儲存、喚醒、sessions、tools、retry | client 連線、UI、權限 | Beta |
| Agent | 你 | state 同步、`@callable`、schedules、MCP、email、queue | loop、prompt、tool 選擇 | 未標 experimental |
| AIChatAgent | 你（`onChatMessage`） | chat protocol、訊息持久化、續傳、recovery | 每次 model call、tools、prompt | first-class |
| Think | 框架 | 上述再加 sessions 樹、壓縮、workspace、client tools、messengers | `getModel`、`getTools`、context | Experimental |
| DO + Lifecycle | 你 | 只有 runtime 原語，capability 自己選 | 幾乎全部 | Lifecycle stable，capabilities 多為 experimental |

最後一列不是官方主打的入口，但它存在：`agents/lifecycle` 可以裝在 plain Durable Object 上，Sessions、Streams、Tasks 各自是 capability。如果你已經有自己的 loop，這是最小依賴的路徑。

## Pi harness：把 loop 外包

官方文件首頁現在把 Pi harness 放在最前面。原文是：「Start with the Pi harness, which runs a durable model loop with tools in a Durable Object, and add state, real-time connections, and scheduled tasks with the Agents SDK.」這句話值得讀兩次，因為它說的不是「用 Agent class 比較方便」，而是「loop 可以外包」。

[Pi Durable](/posts/ai/2026-10-05-pi-durable-long-running-agents) 把 agent 跑的每一件事都當成 task：模型請求、工具呼叫、compaction 各是一個 task，每個 task 先寫 checkpoint 再往下走。Process 死掉後，新 process 打開同一份 storage，找出沒做完的 task，從最後一個 checkpoint 接續。

Cloudflare 的 `PiHarness` 只補兩件事：把 Pi 的 transcript、inbox、task 放進 Durable Object 的 SQLite（表名以 `pi_` 開頭），以及用一個 Lifecycle job 的 alarm 把被回收的物件叫回來。它不管 client 怎麼連、WebSocket 長什麼樣；它給你 session 的 event stream，你自己決定用 WebSocket、HTTP 或 RPC 送出去。

這就是「harness 可以外掛」的意思：`PiHarness` 是 Lifecycle capability，不是 `Agent` 的子類別。你可以繼承 plain `DurableObject`，`Lifecycle.install(this).use(this.harness)`，不需要接受 `Agent` 的整套預設。

代價是它很新。`PiHarness` 在 capability 表裡標 Beta，Pi Durable 本身是 experimental，`agents` 一次只支援一個 Pi minor。官方列出的限制也不少：沒有工具核准機制、event stream 只能從 snapshot 開始（沒有 cursor）、單一模型請求串流超過 15 分鐘可能被 alarm 切斷、session 還不能刪除。如果你需要 human-in-the-loop 的審批，這一條現在要自己補。

## Agent：自己寫 loop，SDK 給你 runtime

`Agent` 是 repo 的預設組合。它 extends `DurableObject`，幫你裝好 Lifecycle，再加上 Scheduler、Queue、MCPClientManager、State、WebSockets、Tasks 和 dynamic agents。你繼承它，得到 `this.state`、`this.sql`、`this.schedule()`、`this.addMcpServer()`、`@callable()` 這些東西。

它適合的產品不是 chat，而是「每個使用者、每個房間、每個工作流都有一個會記住狀態的小 server」。例如：

- 每個客戶一個 agent，記住目前處理到哪張工單。
- 每個遊戲房間一個 agent，同步分數與玩家狀態。
- 每個 webhook 來源一個 agent，排隊處理事件、失敗重試。
- 每個 dashboard 一個 agent，用 `@callable()` 讓前端拉資料、送指令。

`@callable()` 是 WebSocket RPC，不是 HTTP API。方法標了 decorator，client 就能用 `agent.stub.increment()` 直接呼叫，state 變更會同步給所有連線。這對即時 UI 很方便，但如果你只是要一個 REST endpoint，普通 Worker 就夠了。

這裡有一個很容易踩的設定坑：`@callable()` 用的是 TC39 standard decorators，不是 TypeScript 的 legacy decorators。你必須讓 `tsconfig.json` extends `agents/tsconfig`，並在 Vite 加 `agents/vite` plugin。**不要**設 `"experimentalDecorators": true`，它會套用不相容的轉換，讓 `@callable()` 在 runtime 靜默壞掉。少了這兩個設定，dev server 會直接出現 `SyntaxError: Invalid or unexpected token`。

另外，所有起點都需要 Durable Object binding 和 SQLite migration：

```jsonc
{
  "durable_objects": {
    "bindings": [{ "name": "Chat", "class_name": "Chat" }]
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["Chat"] }]
}
```

## AIChatAgent：你擁有模型呼叫，SDK 擁有 chat 管線

`AIChatAgent` 是 protocol adapter。它 extends `Agent`，幫你處理訊息持久化、串流、中斷、續傳、recovery、client 同步；你只要覆寫 `onChatMessage()`，回傳一個 `Response`。

```ts
import { AIChatAgent } from "@cloudflare/ai-chat";
import { convertToModelMessages, streamText } from "ai";

export class Chat extends AIChatAgent<Env> {
  async onChatMessage() {
    const result = streamText({
      model: this.env.MODEL,
      messages: await convertToModelMessages(this.messages)
    });
    return result.toUIMessageStreamResponse();
  }
}
```

這個位置的價值是「你控制每一次 model call」。你可以在 `streamText` 前面先做 retrieval，可以在一個 turn 裡呼叫兩次模型，可以接非 AI SDK 的 provider，也可以把舊格式的訊息轉進來。SDK 不碰你的 prompt 和工具選擇，只確保訊息有存、串流斷了能續、物件被回收後能恢復。

它適合已經有明確 retrieval 或 prompt 策略的團隊。你不會得到 sessions 樹、context 壓縮、workspace 工具這些東西，因為那些是 `Think` 的範圍。

## Think：框架擁有 loop

`Think` 是 Cloudflare 對「一個 chat agent 最少要寫多少」的回答。你宣告模型、prompt、工具，框架跑 loop：

```ts
import { Think } from "@cloudflare/think";

export class Chat extends Think<Env> {
  getModel() {
    return "@cf/moonshotai/kimi-k2.7-code";
  }

  getSystemPrompt() {
    return "You are a helpful coding assistant.";
  }
}
```

這樣就有 WebSocket chat protocol、訊息持久化、agentic loop、串流續傳、client tools、workspace 檔案工具。它另外提供 sessions 樹（分支、壓縮、FTS5 搜尋）、非破壞性的 regeneration、messengers（Telegram 等）、workflows 和 human-in-the-loop。

`Think` 和 `AIChatAgent` 不是替代關係，是兩種所有權。`AIChatAgent` 讓你擁有 loop，`Think` 讓框架擁有 loop，你只改 hook（`beforeTurn`、`beforeStep`、`beforeToolCall`）。設計文件寫得很清楚：`AIChatAgent` 是 first-class，不是 legacy；兩個都支援，選你願意除錯的那一層。

`Think` 目前標 experimental。如果你現在就要上正式服務、不能接受 API 變動，`AIChatAgent` 是比較保守的選擇；如果是新專案、想要預設值、可以跟著升級，`Think` 會少寫很多管線。

## 拆工作：dynamic agents、agent tools、Code Mode

選完 base 之後，下一個問題是「工作要不要拆出去」。三個機制解決三個不同問題，不要混用。

**Dynamic agents（舊稱 sub-agents）** 是 facet-backed child Durable Object。每個 child 有獨立 isolate、自己的 SQLite，跟 parent 跑在同一台機器上；parent 可以 abort、delete、restart，child 沒有獨立的 alarm。它適合「parent 擁有 child 的 class 與生命週期」的情境：動態載入的程式碼、每次 run 一個工具 agent、需要隔離儲存的沙箱元件。

它不適合「大量獨立的 peer」。官方明講，如果你要為每個 chat、每份文件、每個 session 開一個 agent，應該用 top-level Durable Object 加一個 per-user index，不是用 dynamic agents 當 scale-out。facet 的設計是隔離與監督，不是分散部署。

**Agent tools** 是「parent 的模型自己決定要不要叫 child」。`agentTool(Researcher, {...})` 會把一個 chat-capable agent 包成 AI SDK tool。parent 呼叫時，child 有自己的 Durable Object、訊息、工具、可續傳的串流；parent 另外維護一份 run registry，client 可以看 child 的進度、重新整理後重播、點進去看完整 transcript。

```ts
export class Assistant extends Think<Env> {
  getTools() {
    return {
      research: agentTool(Researcher, {
        description: "Research one topic in depth.",
        inputSchema: z.object({ query: z.string().min(3) })
      })
    };
  }
}
```

它和 dynamic agents 的差別在「誰決定」：dynamic agents 是你的程式決定什麼時候開 child，agent tools 是模型在對話中決定。agent tools 多了一層 registry、event replay、cancel 和 drill-in；代價是 child 的執行變成 parent 對話的一部分，AIChatAgent child 是 headless，client 端工具不會在 child turn 裡出現。

**Code Mode** 解決的是工具數量與順序。工具一多，每個工具的 description 都塞進 context，模型還沒開始做事就先付一大筆 token；順序一長，每一步都要回到模型。Code Mode 讓模型寫一段 TypeScript，在 sandboxed Worker 裡一次呼叫多個工具：

```ts
// 模型寫的程式碼；github 是 connector 掛進 sandbox 的 global
const prs = await github.list_pull_requests({ owner: "cloudflare", repo: "agents" });
```

Sandbox 沒有網路，所有副作用要走 connector，所以核准、rollback、audit log 可以集中在 runtime。代價是它是 experimental，而且你要先把工具包成 connector。如果你只有三、五個工具，一般的 tool calling 比較簡單。

| 你的問題 | 用什麼 | 代價 |
|---|---|---|
| child 的 class 與生命週期由 parent 擁有 | dynamic agents | 沒有獨立 alarm；不是 scale-out 單位 |
| 模型要在對話中決定叫哪個 child，且要看得到進度 | agent tools | 多一層 run registry；child 的 client tools 受限 |
| 工具太多、每次呼叫都要來回模型 | Code Mode | sandbox 沒網路，副作用要包 connector；experimental |

## 我會怎麼選

把問題照順序問一遍，通常三題就有答案：

1. **你已經有想用的 harness 嗎？** 有，而且你能接受它 experimental 的 API，就用 `PiHarness`。它給你最成熟的 loop 與 recovery 語意，代價是 client 層要自己接。
2. **沒有 harness，而且你要做 chat 介面嗎？** 不要，往第 4 題。
3. **chat 介面裡，每一次 model call 你要自己組嗎？** 要，用 `AIChatAgent`；不要，用 `Think`。兩者的分界不是功能多少，是你願不願意讓框架擁有 loop。
4. **不是 chat，但需要 state、RPC、排程、MCP、email？** 用 `Agent`。
5. **只是要 runtime 原語，loop 已經有了？** 用 plain `DurableObject` + `Lifecycle`，只裝你需要的 capability。

如果還是不確定，今晚就能做的一件事：把 `examples/playground` 跑起來，打開 `src/server.ts`，從它 re-export 的 demo 挑一個跟你產品最像的。`demos/ai/chat-agent.ts` 是 `AIChatAgent`，`demos/multi-agent/supervisor-agent.ts` 是 `Agent` 加 dynamic agents；只改其中一個的 prompt 和一個 tool，不要先把五份文件讀完。

## 限制

- **都是 0.x。** `Think`、Code Mode、facets、`PiHarness` 都掛 experimental 或 beta；`Agent` 沒有標 experimental，但整個 SDK 還在快速變動。升級前先 pin 版本、看 changelog。
- **綁定很深。** 你用到的不是只有模型呼叫，還有 Durable Object、facets、Worker Loader、AI binding、SQLite。要搬離 Cloudflare，重寫的是 runtime 層，不是換一個 API key。
- **文件不同步。** README 主推 `Agent`，文件首頁主推 Pi harness；兩邊都對，但你要知道自己在哪一層。以你安裝的版本為準，不要只看首頁。
- **Pi 的限制很具體。** 沒有工具核准、event stream 沒有 cursor、alarm 最長 15 分鐘、session 不能刪。要合規或要審批流程的產品，現在別把它當完成品。
- **不是所有 agent 都適合。** 需要 Python 生態、GPU、長時間常駐 VM、或不能把資料放進 Cloudflare 的工作負載，這一套不是最短的路。
- **不接受外部 PR。** repo 明講目前不收 external pull request；要貢獻只能開 issue 或 discussion。

## 整體來說

Cloudflare Agents 真正賣的不是某一個 class，是「每個 agent 都有自己的 Durable Object」這個單位。選哪個起點，取決於你願意自己除錯哪一層：loop、chat 管線，還是 runtime。

如果你已經在 Workers 上，想要每個使用者一個會記住狀態的 agent，這套 SDK 是目前摩擦最小的路徑。如果你只是要一次模型呼叫，或你的團隊主要寫 Python，先不要為了「agent」這個詞把整個 runtime 搬過來。

## 參考資料

- [cloudflare/agents](https://github.com/cloudflare/agents)
- [Cloudflare Agents 官方文件](https://developers.cloudflare.com/agents/)
- [Pi harness 官方文件](https://developers.cloudflare.com/agents/harnesses/pi/)
- [Agent class 官方文件](https://developers.cloudflare.com/agents/agent-class/)
- [Durable Object lifecycle（`agents/lifecycle`）](https://github.com/cloudflare/agents/blob/main/docs/agents/lifecycle.md)
- [Callable methods 與 decorator 設定](https://github.com/cloudflare/agents/blob/main/docs/agents/callable-methods.md)
- [AIChatAgent 文件](https://github.com/cloudflare/agents/blob/main/docs/agents/chat-agents.md)
- [Think 文件](https://github.com/cloudflare/agents/blob/main/docs/think/index.md)
- [Think vs AIChatAgent 設計比較](https://github.com/cloudflare/agents/blob/main/design/think-vs-aichat.md)
- [Dynamic agents（facets）](https://github.com/cloudflare/agents/blob/main/docs/agents/sub-agents.md)
- [Agent tools](https://github.com/cloudflare/agents/blob/main/docs/agents/agent-tools.md)
- [Code Mode 文件](https://github.com/cloudflare/agents/blob/main/docs/codemode/index.md)
- [Pi Durable：長時間 Agent 掛掉之後，要從哪裡接著做](/posts/ai/2026-10-05-pi-durable-long-running-agents)
- [Cloudflare Agents 怎麼用：durable agent runtime、工具與即時連線](/posts/ai/2026-08-30-cloudflare-agents-runtime)
