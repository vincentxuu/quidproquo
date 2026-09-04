---
title: "跟成熟 coding agent 學設計（38）：Agent as a Service——把 loop 包成別的程式可以呼叫的服務"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 38
tags: [coding-agent, server-api, sse, websocket, looplane, opencode, codex]
lang: zh-TW
tldr: "looplane 已有 Cloudflare Durable Object run resource：非同步建立、狀態／取消／artifact、live NDJSON 與支援 Last-Event-ID 的 SSE；遠端 approval 走獨立短效 capability。Python 另有 attach client 與 stateful conversation WebSocket。production deploy、跨 runtime parity 與完整多租戶 hardening 尚未驗證。"
description: "對照成熟 coding agent 的 server API，並檢視 looplane 已落地的 durable run、SSE／WebSocket attach 與遠端 approval 基線。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-26-coding-agent-agent-as-service-en)

系列最後一篇。[上一篇](/posts/ai/2026-08-25-coding-agent-code-mode)談完 code mode，這篇處理第二部的收尾能力：把 agent 從「你終端機裡的一支程式」變成「別的程式可以呼叫的服務」。

取證範圍照舊：pi（badlogic/pi-mono）、omp（can1357/oh-my-pi）、opencode（sst/opencode）、codex（openai/codex 的 Rust workspace）、claude-code（社群反編譯 v2.1.88，symbol 名稱可能與原版有出入）。所有引用都是我在本地 clone 實際讀過的。

## 能力問題：loop 之後還缺什麼

[系列的 order 21](/posts/ai/2026-08-25-coding-agent-headless-ci-mode) 解決了「沒有人按 approve」的問題；單純 headless CLI 仍是**一次一格**的互動模型。Looplane 後來補上的服務面，正是在處理這三個限制：

1. **中途觀察**：任務跑到一半，外部程式看不到進度，只能等它結束。
2. **常駐複用**：每次呼叫都重新載入系統提示、重建 workspace 狀態，付一遍啟動成本。
3. **多方介入**：人類想中途看一眼、補一句指令，或讓網頁前端直接驅動 agent——CLI 沒有這個入口。

把 loop 包成服務要回答三個設計問題：API 面長什麼樣、事件怎麼送出去、以及——最容易被低估的——**信任邊界畫在哪**。一個能執行 shell 指令的服務開在任何介面上，那個介面就是攻擊面。

## 五家怎麼做

### opencode：REST 加 SSE，五家中唯一的完整 server 產品

opencode 的 API 面是用 Effect 的 HttpApi宣告式定義的：`opencode/packages/protocol/src/groups/session.ts#session.prompt`、`session.events`、`session.interrupt` 對應 `/api/session/:id/prompt`、事件訂閱、中斷；事件推送走 SSE（`groups/event.ts#HttpApiSchema.StreamSse`），路由面是五家中最大的。官方 TypeScript SDK 在 `packages/sdk/js/src/client.ts#createOpencodeClient`，把整個 API 包成 typed client。

認證的答案很務實：`packages/server/src/auth.ts#ServerAuth.Config` 支援 Basic auth（密碼來自環境變數），embedded 模式免密碼，預設只綁 localhost。也就是說 opencode 把「服務化」當成一等部署形狀，但沒有假裝公網暴露是預設場景。

### codex：JSON-RPC 雙 transport，方法面標實驗

codex 的 app-server 不是 REST，是 JSON-RPC：方法定義在 `codex-rs/app-server-protocol/src/protocol/v2/thread.rs`——`thread/start`、`thread/resume`、`turn/*` 一整組，大量標著 `#[experimental]`，等於明講 wire format 還會動。分派中心在 `codex-rs/app-server/src/message_processor.rs#handle_client_request`。transport 有兩條路：stdio（給 IDE 內嵌）和 WebSocket acceptor（`app-server/src/transport.rs#start_websocket_acceptor`）。

值得注意的取捨：codex 選 JSON-RPC 而非 REST，換來的是同一份協議定義可以同時跑在 stdio 和 WebSocket 上——IDE 外掛和遠端 client 吃同一套方法面。

### pi：transport 不可知，認證外包給作業系統

pi 的 server 核心根本不是 HTTP router。`pi-mono/packages/server/src/server.ts#PiServer` 管的是 byte connection：連線進來先走版本握手，之後是 frame 流；`packages/server/src/sessions.ts#LiveSessionManager` 讓一條連線 attach 多個 session，事件以 snapshot 廣播。目前唯一的 transport preset 是 Unix socket（`transports/unix/preset.ts#createUnixServer`）。

這是一個很聰明的簡化：Unix socket 的檔案權限就是認證，不需要 token、不需要 TLS、天生綁本機。代價是遠端場景要自己架橋——pi 把這個問題留給使用者，而不是內建一個半調子 HTTP 層。

### omp：多人協作當第一場景，relay 全盲

omp 在這條路上走得最遠也最激進。`packages/coding-agent/src/collab/host.ts#CollabHost` 是權威節點，透過 relay 對 guest 廣播 entries 和狀態；wire 文法定義在 `collab/protocol.ts#CollabFrame`（welcome、prompt、snapshot-chunk、ui-request 等幀型）。關鍵設計在信封層：每幀是 `[4B peerId][AES-256-GCM sealed]`，envelope key 由 `collab/crypto.ts#generateRoomKey` 生成、寫入權用 `generateWriteToken` 控制——relay 只看得到 peerId 和密文，伺服器被攻破也洩不了 session 內容。瀏覽器端的 guest SDK 是 `collab-web/src/lib/client.ts#GuestClient`，支援唯讀分享連結。

### claude-code：server 在雲端，CLI 是 client

claude-code 的方向跟其他四家相反：它的遠端 session 架構裡，server 是 Anthropic 的基礎設施。`src/remote/SessionsWebSocket.ts#SessionsWebSocket` 連的是 `wss://api.anthropic.com/v1/sessions/ws/{sessionId}/subscribe`，生命週期由 `src/remote/RemoteSessionManager.ts#RemoteSessionManager` 管理——你可以從手機或網頁接回家裡跑著的 session，因為狀態同步經過雲端中繼。本機另有一條 direct-connect 路（`src/server/directConnectManager.ts#DirectConnectSessionManager`），但主力是雲端架構。

## 共同模式與協議生態

撇開傳輸細節，五家收斂在三件事：

- **Session 是核心資源**：所有路由/RPC 方法都圍繞 create、prompt、events、interrupt 打轉，沒有人把「agent」本身當資源。
- **事件靠串流，不靠輪詢**：SSE 或 WebSocket 二選一，因為 agent 的事件流天然是單向廣播。
- **安全預設保守**：localhost、Unix socket、或端到端加密；沒有任何一家預設把能執行指令的 agent 直接曝上公網。

業界也在往同一個方向收斂：[Model Context Protocol](https://modelcontextprotocol.io) 標準化了工具面，[Agent Client Protocol](https://agentclientprotocol.com) 標準化了編輯器與 agent 的通訊——omp 的 ACP 映射就是接在後者上。自訂私有協議的空間正在變小。

## looplane 已落地的服務面

Cloudflare control plane 已把 run 做成 Durable Object 資源。`POST /v1/runs` 回 `202`，背景建立隔離 Sandbox；client 可查狀態、取消、取 artifact，也能在執行中讀 live NDJSON。`?stream=1` 會升級成 SSE，先補播 bounded event buffer，再推新事件；`Last-Event-ID` 只補比 cursor 新的 sequence，terminal state 會關閉連線。

遠端 approval 沒有借用 event stream 偷渡信任。模型請求、事件上傳、approval 各用不同 audience 的短效 capability；client 從 approval route 明確送出 `allow_once`、`allow_session`、`deny` 或 `cancel`，Sandbox 再透過專用內部路由輪詢。Python `CloudflareRunClient` 已封裝 start/status/cancel/artifact/attach，SDK 另有 `/v1/conversation/attach` 的 stateful WebSocket，可送 turn、approval 與 injected context。

這些是 source 與測試涵蓋的 baseline，不是 production 成功宣告。正式 deploy、真實 provider 長任務、跨 runtime attach parity、Durable Object restart 行為與完整多租戶 hardening 仍要另外驗證。

## 參考資料

- [looplane Cloudflare control plane 說明（2ed5efb）](https://github.com/vincentxuu/looplane/blob/2ed5efb/cloudflare/README.md)
- [looplane Python attach client（2ed5efb）](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/cloudflare_client.py)
- [looplane conversation WebSocket（2ed5efb）](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/conversation_websocket.py)

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
- [sst/opencode](https://github.com/sst/opencode)
- [openai/codex](https://github.com/openai/codex)
- [Claude Code Agent SDK 文件](https://docs.anthropic.com/en/docs/claude-code/sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [Agent Client Protocol](https://agentclientprotocol.com)
