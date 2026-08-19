---
title: "RAG Streaming：SSE 讓 LLM 回答邊生成邊顯示"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, streaming, sse, server-sent-events, cloudflare-workers, ux]
lang: zh-TW
tldr: "LLM 生成需要 3-5 秒，等全部生成完再顯示體驗很差。SSE 讓 token 一邊生成一邊推送，首個字元出現時間從 5 秒縮到 1 秒以內。"
description: "RAG 系統的 SSE Streaming 實作：事件格式設計、配額退還機制、Cloudflare Workers 上的 TransformStream，以及前端的串流渲染。"
draft: false
series:
  name: "RAG 技法大全"
  order: 31
---

> 🌏 [English version](/posts/ai/2026-03-12-rag-streaming-sse-en)

標準的 RAG 請求流程是：查詢 → pipeline 執行 → LLM 生成完畢 → 回傳完整回答。使用者要盯著空白等 5-8 秒，才看到第一個字。

這個體驗不好。使用者不知道系統在不在線、還要等多久，容易以為卡住了。

SSE（Server-Sent Events）Streaming 解決這個問題：**LLM 每生成一個 token 就立刻推送給前端**，使用者在 0.5-1 秒內就看到第一個字開始出現，回答慢慢「打印」出來，體驗接近即時。

## SSE 的選擇

實現串流推送有幾個方案：WebSocket、Long Polling、SSE。

RAG 回應是單向的（伺服器推，客戶端收），SSE 最合適：
- 比 WebSocket 簡單（不需要雙向通信）
- 比 Long Polling 高效（持久連接，不反覆建立）
- 原生支援斷線重連
- HTTP/2 下可多路復用

端點設計：`POST /api/v1/ai/ask?stream=true`

POST 而非 GET，因為查詢內容和設定需要放在 request body。`stream=true` 參數讓同一個端點同時支援串流和非串流，不需要維護兩套路由。

## 事件格式

```
data: {"type":"token","token":"龍"}\n\n
data: {"type":"token","token":"洞"}\n\n
data: {"type":"token","token":"北"}\n\n
data: {"type":"token","token":"壁"}\n\n
...
data: {"type":"done","queryId":"abc123","sources":[...],"quotaRemaining":3}\n\n
```

每個 SSE 事件以 `data:` 開頭，`\n\n` 結尾（雙換行是 SSE 協議的事件分隔符）。

**token 事件**：每個 token 一個事件，前端接到就 append 到顯示區域。

**done 事件**：生成完成後發送，包含：
- `queryId`：這次查詢的 ID（用於 feedback）
- `sources`：引用的來源文件（顯示在回答下方）
- `quotaRemaining`：剩餘配額（更新前端的配額顯示）

**error 事件**：如果中途發生錯誤：
```
data: {"type":"error","message":"配額已用完","code":"QUOTA_EXCEEDED"}\n\n
```

## Cloudflare Workers 的實作

Workers 不支援傳統的 Node.js Stream，使用 Web Streams API：

```typescript
app.post("/api/v1/ai/ask", async (c) => {
  const isStream = c.req.query("stream") === "true";

  if (!isStream) {
    // 非串流：正常走完 pipeline 後回傳
    const response = await runPipeline(request, env, ctx);
    return c.json(response);
  }

  // 串流：建立 TransformStream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = (data: object) =>
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

  // 在背景執行 pipeline，前景立刻回傳 stream
  ctx.waitUntil((async () => {
    try {
      await runPipelineStreaming(request, env, ctx, sendEvent);
    } finally {
      writer.close();
    }
  })());

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
});
```

## LLM 的串流生成

Cloudflare Workers AI 支援串流模式，但這裡有一個很容易寫錯的地方：**`stream: true` 回傳的是一個 SSE 位元流（`text/event-stream`），不是可以 `for await` 逐個取出 token 物件的序列**。要拿到 token，得自己解析：

```typescript
async function streamGeneration(
  messages: Message[],
  model: string,
  onToken: (token: string) => Promise<void>,
  env: Env
): Promise<string> {
  const sseStream = (await env.AI.run(model, {
    messages,
    stream: true,
  })) as ReadableStream;

  const reader = sseStream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";   // 最後一行可能被切斷，留到下一輪

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "" || payload === "[DONE]") continue;

      const token = JSON.parse(payload).response ?? "";
      fullText += token;
      await onToken(token);   // 立刻推送給前端
    }
  }

  return fullText;
}
```

兩個實務上的提醒：

- **payload 的欄位名要看模型家族**。Workers AI 原生的文字生成模型是 `{"response":"..."}`，走 OpenAI 相容端點的模型則是 `choices[0].delta.content`。接之前先手動打一次，把實際格式印出來看，不要照抄別人的欄位名。
- **如果只是要把 LLM 的輸出原樣轉給前端**，根本不用解析：`env.AI.run()` 回傳的 stream 可以直接丟進 `new Response(stream, { headers: { "content-type": "text/event-stream" } })`。只有在需要插入自己的 `done` / `error` 事件、或要同時累積 `fullText` 寫進 DB 時，才需要上面那段解析。

## 配額退還機制

這是串流設計中最需要注意的邊緣情況：**使用者在 `done` 事件到達前就關閉瀏覽器**。

沒有妥善處理的話，配額已扣除但使用者沒有收到完整回答，體驗很差。

解法：

```typescript
async function runPipelineStreaming(
  request: AIAskRequest,
  env: Env,
  ctx: ExecutionContext,
  sendEvent: (data: object) => void
) {
  // 預先扣除配額
  await deductQuota(request.userId, env);
  let quotaDeducted = true;

  try {
    // 執行 pipeline...
    // LLM 串流生成...

    // 正常完成，發送 done 事件
    sendEvent({ type: "done", queryId, sources, quotaRemaining });
    quotaDeducted = false; // 標記：配額使用正當

  } catch (error) {
    if (isClientDisconnected(error)) {
      // 客戶端斷線，退還配額
      if (quotaDeducted) {
        await refundQuota(request.userId, env);
      }
    }
    sendEvent({ type: "error", message: error.message });
  }
}
```

斷線檢測靠的是 `writer.write()` 的回傳 promise：客戶端關掉連線後，寫入會 reject。**所以 `sendEvent` 一定要 `await`**——上面把它寫成回傳 promise 的箭頭函式就是為了這件事。如果像常見寫法那樣 fire-and-forget，斷線會變成一個沒人接的 rejected promise，你的 catch 永遠不會執行，配額也就永遠退不回去。

## 前端處理

```typescript
async function askQuestion(query: string, onToken: (t: string) => void) {
  const response = await fetch("/api/v1/ai/ask?stream=true", {
    method: "POST",
    body: JSON.stringify({ query }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? ""; // 最後一個可能不完整，留到下次

    for (const event of events) {
      const line = event.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      const data = JSON.parse(line.slice(5).trim());

      if (data.type === "token") onToken(data.token);
      if (data.type === "done") handleDone(data);
      if (data.type === "error") handleError(data);
    }
  }
}
```

## 整體來說

SSE Streaming 對 RAG 系統的使用者體驗影響是最直接的：從「等 5 秒看到完整答案」變成「0.8 秒後看到字開始出現」。對 LLM 生成這種天然適合串流的場景，不做 streaming 是讓使用者白白等待。

實作的關鍵不只是推送 token，而是：事件格式設計（`done` 包含完整的 metadata）、配額退還機制（斷線不虧待使用者）、前端的 buffer 處理（SSE 事件可能被 chunk 切斷）。這些細節做好了，串流體驗才是完整的。

---

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「RAG 技法大全」系列

## 參考資料

- [MDN - Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [WHATWG - Server-Sent Events Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [MDN - Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [Cloudflare Workers - TransformStream](https://developers.cloudflare.com/workers/runtime-apis/streams/transformstream/)
- [OpenAI - Streaming API responses](https://platform.openai.com/docs/guides/streaming-responses)
- [Cloudflare Workers AI - Workers Bindings（`env.AI.run()` 與 `stream` 參數）](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Cloudflare Workers AI - 模型列表（各模型的串流輸出格式）](https://developers.cloudflare.com/workers-ai/models/)
