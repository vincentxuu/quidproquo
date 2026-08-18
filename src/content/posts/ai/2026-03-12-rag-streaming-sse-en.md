---
title: "RAG Streaming: Using SSE to Display LLM Responses as They Generate"
date: 2026-03-12
type: guide
category: ai
tags: [rag, streaming, sse, server-sent-events, cloudflare-workers, ux]
lang: en
tldr: "LLM generation takes 3-5 seconds, and waiting for the full response before displaying it makes for a terrible experience. SSE pushes tokens as they're generated, reducing time-to-first-character from 5 seconds to under 1 second."
description: "SSE Streaming implementation for RAG systems: event format design, quota refund mechanisms, TransformStream on Cloudflare Workers, and frontend stream rendering."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 31
---

> 🌏 [中文版](/posts/ai/2026-03-12-rag-streaming-sse)

The standard RAG request flow is: query → pipeline execution → LLM finishes generating → return complete response. The user stares at a blank screen for 5-8 seconds before seeing the first character.

This is a poor experience. Users don't know if the system is online or how long they'll have to wait, and they often assume it's frozen.

SSE (Server-Sent Events) Streaming solves this problem: **each token the LLM generates is immediately pushed to the frontend**, so users see the first character appear within 0.5-1 seconds, with the answer gradually "printing" out, creating a near-real-time experience.

## Why SSE

There are several options for implementing streaming push: WebSocket, Long Polling, and SSE.

RAG responses are unidirectional (server pushes, client receives), making SSE the best fit:
- Simpler than WebSocket (no bidirectional communication needed)
- More efficient than Long Polling (persistent connection, no repeated setup)
- Native support for automatic reconnection
- Multiplexing under HTTP/2

Endpoint design: `POST /api/v1/ai/ask?stream=true`

POST instead of GET, because the query content and configuration need to go in the request body. The `stream=true` parameter lets the same endpoint support both streaming and non-streaming modes without maintaining two separate routes.

## Event Format

```
data: {"type":"token","token":"The"}\n\n
data: {"type":"token","token":" north"}\n\n
data: {"type":"token","token":" face"}\n\n
data: {"type":"token","token":" of"}\n\n
...
data: {"type":"done","queryId":"abc123","sources":[...],"quotaRemaining":3}\n\n
```

Each SSE event starts with `data:` and ends with `\n\n` (double newline is the SSE protocol's event delimiter).

**Token events**: One event per token; the frontend appends it to the display area upon receipt.

**Done event**: Sent after generation completes, containing:
- `queryId`: The ID of this query (used for feedback)
- `sources`: Referenced source documents (displayed below the answer)
- `quotaRemaining`: Remaining quota (updates the frontend quota display)

**Error event**: If an error occurs mid-stream:
```
data: {"type":"error","message":"Quota exhausted","code":"QUOTA_EXCEEDED"}\n\n
```

## Cloudflare Workers Implementation

Workers don't support traditional Node.js Streams; they use the Web Streams API:

```typescript
app.post("/api/v1/ai/ask", async (c) => {
  const isStream = c.req.query("stream") === "true";

  if (!isStream) {
    // Non-streaming: run the pipeline to completion and return
    const response = await runPipeline(request, env, ctx);
    return c.json(response);
  }

  // Streaming: create a TransformStream
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = (data: object) =>
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

  // Execute pipeline in the background, return stream immediately
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

## LLM Streaming Generation

Cloudflare Workers AI supports streaming mode, but there is one thing that is very easy to get wrong: **`stream: true` returns an SSE byte stream (`text/event-stream`), not a sequence of token objects you can `for await` over**. To get tokens, you have to parse it yourself:

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
    buffer = lines.pop() ?? "";   // the last line may be cut off; keep it for the next round

    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (payload === "" || payload === "[DONE]") continue;

      const token = JSON.parse(payload).response ?? "";
      fullText += token;
      await onToken(token);   // push to the frontend immediately
    }
  }

  return fullText;
}
```

Two practical notes:

- **The payload field name depends on the model family.** Workers AI's native text-generation models emit `{"response":"..."}`, while models served through the OpenAI-compatible endpoint emit `choices[0].delta.content`. Make one manual call and print the real format before wiring anything up; do not copy someone else's field name.
- **If you only need to relay the LLM output verbatim**, do not parse at all: the stream returned by `env.AI.run()` can be handed straight to `new Response(stream, { headers: { "content-type": "text/event-stream" } })`. You only need the parsing loop above when you have to inject your own `done` / `error` events, or accumulate `fullText` to write to a database.

## Quota Refund Mechanism

This is the most critical edge case in streaming design: **the user closes the browser before the `done` event arrives**.

Without proper handling, the quota has already been deducted but the user never received a complete answer — a terrible experience.

Solution:

```typescript
async function runPipelineStreaming(
  request: AIAskRequest,
  env: Env,
  ctx: ExecutionContext,
  sendEvent: (data: object) => void
) {
  // Deduct quota upfront
  await deductQuota(request.userId, env);
  let quotaDeducted = true;

  try {
    // Execute pipeline...
    // LLM streaming generation...

    // Completed successfully, send done event
    sendEvent({ type: "done", queryId, sources, quotaRemaining });
    quotaDeducted = false; // Mark: quota usage is legitimate

  } catch (error) {
    if (isClientDisconnected(error)) {
      // Client disconnected, refund quota
      if (quotaDeducted) {
        await refundQuota(request.userId, env);
      }
    }
    sendEvent({ type: "error", message: error.message });
  }
}
```

Disconnect detection rides on the promise returned by `writer.write()`: once the client closes the connection, the write rejects. **So `sendEvent` must be awaited** — that is exactly why it is written above as an arrow function that returns the promise. If you fire-and-forget it, as most examples do, a disconnect becomes an unhandled rejected promise, your `catch` never runs, and the quota is never refunded.

## Frontend Handling

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
    buffer = events.pop() ?? ""; // Last one may be incomplete, save for next iteration

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

## Overall Takeaway

SSE Streaming has the most direct impact on RAG system user experience: transforming "wait 5 seconds for the complete answer" into "see characters start appearing after 0.8 seconds." For LLM generation — a scenario naturally suited for streaming — not implementing streaming means making users wait for nothing.

The key to implementation isn't just pushing tokens, but also: event format design (`done` includes complete metadata), quota refund mechanisms (disconnections shouldn't penalize users), and frontend buffer handling (SSE events may be split across chunks). Getting these details right is what makes the streaming experience truly complete.

---

## References

- [MDN - Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [WHATWG - Server-Sent Events Specification](https://html.spec.whatwg.org/multipage/server-sent-events.html)
- [MDN - Web Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
- [Cloudflare Workers - TransformStream](https://developers.cloudflare.com/workers/runtime-apis/streams/transformstream/)
- [OpenAI - Streaming API responses](https://platform.openai.com/docs/guides/streaming-responses)
- [Cloudflare Workers AI - Workers Bindings (`env.AI.run()` and the `stream` option)](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Cloudflare Workers AI - Model catalog (streaming output format per model)](https://developers.cloudflare.com/workers-ai/models/)
