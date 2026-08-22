---
title: "Server-Sent Events：用 HTTP Event Stream 做可恢復的單向推送"
date: 2026-08-22
category: tech
type: deep-dive
tags: [sse, realtime, http, streaming, web-standards]
lang: zh-TW
tldr: "SSE 以普通 HTTP 傳送 text/event-stream，瀏覽器原生重連並帶 Last-Event-ID；簡單不代表自動 durable，server 仍要保存 cursor 後的事件。"
description: "介紹 EventSource、text/event-stream、event IDs、retry、replay、authentication、proxy buffering、heartbeats 與 SSE/WebSocket 選型。"
series:
  name: "AI 時代的技術選擇"
  order: 105
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-server-sent-events-en)

[Server-Sent Events](https://html.spec.whatwg.org/multipage/server-sent-events.html)（SSE）讓 server 透過長時間 HTTP response 單向推送 UTF-8 events。Browser `EventSource` 會處理 parsing 與 reconnect，適合通知、job progress、LLM token stream、dashboard update；client-to-server command 繼續走一般 HTTP。

```text
event: job.progress
id: 1842
retry: 3000
data: {"jobId":"j_9","percent":42}

```

Response 必須是 `text/event-stream`，每個 event 以空行結束；多個 `data:` 行會以 newline 合併。`event` 是名稱、`id` 更新 client cursor、`retry` 調整重連時間。Server 回 `204 No Content` 可要求 client 停止 reconnect。

## Last-Event-ID 是 cursor，不是 history

重連時 browser 會送 `Last-Event-ID`，但 server 若沒有 durable event log 就無從補發。Event ID 必須在 stream 的 scope 內單調且可查詢；server 要驗證該 user 仍能讀取 cursor 後每筆資料，不能相信 client 提供的任意 ID。超出 retention 時應送 snapshot/resync 訊號，而不是默默跳到最新。

Native `EventSource` 只直接支援 URL 與 `withCredentials`，不能自由加 bearer header。可用 secure cookie、same-origin endpoint，或以 `fetch()` 讀 streaming response 並自行 parser。不要把 access token 放在會進 log/history 的長效 query string。

## Proxy buffering 會把 realtime 變 batch

Reverse proxy、CDN、compression middleware 與 serverless timeout 可能 buffer chunk 或切斷長連線。需關閉不當 buffering/compression、定期送 comment heartbeat、偵測 disconnect、限制每 user connection 數，並在 deploy 時 drain。HTTP/1.x 對同 origin 的連線數限制也比 HTTP/2 multiplexing 明顯。

SSE 適合 server→browser 為主、文字事件、希望沿用 HTTP auth/proxy 的場景。需要頻繁雙向 binary message 可用 WebSocket；需要 rooms/fallback 可看 Socket.IO；需要 managed global channels 可看 Ably。選擇 SSE 的理由應是方向與操作模型吻合，不只是 implementation 看起來短。

## 參考資料

- [WHATWG Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [MDN Using server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [MDN EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
