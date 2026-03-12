---
title: "RAG Streaming：SSE 讓 LLM 回答邊生成邊顯示"
date: 2026-03-12
category: ai
tags: [rag, streaming, sse, server-sent-events, cloudflare-workers, ux]
lang: zh-TW
tldr: "LLM 生成需要 3-5 秒，等全部生成完再顯示體驗很差。SSE 讓 token 一邊生成一邊推送，首個字元出現時間從 5 秒縮到 1 秒以內。"
description: "RAG 系統的 SSE Streaming 實作：事件格式設計、配額退還機制、Cloudflare Workers 上的 TransformStream，以及前端的串流渲染。"
draft: false
---

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

  const sendEvent = (data: object) => {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

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

Cloudflare Workers AI 支援串流模式：

```typescript
async function streamGeneration(
  messages: Message[],
  model: string,
  onToken: (token: string) => void,
  env: Env
): Promise<string> {
  const stream = await env.AI.run(model, {
    messages,
    stream: true,
  });

  let fullText = "";

  for await (const chunk of stream) {
    const token = chunk.response ?? "";
    fullText += token;
    onToken(token);  // 立刻推送給前端
  }

  return fullText;
}
```

`for await` 逐個處理 chunk，每個 chunk 包含一或多個 token，立刻呼叫 `onToken` 推送。

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

斷線檢測：當 writer.write() 拋出錯誤（客戶端已關閉連接），捕捉錯誤並退還配額。

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
      if (!event.startsWith("data: ")) continue;
      const data = JSON.parse(event.slice(6));

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
