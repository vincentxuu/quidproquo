---
title: "AI SDK Message Parts: The Data Skeleton of a Conversation UI"
date: 2026-08-21
category: tech
type: deep-dive
tags: [ai-sdk, react, llm, streaming, ui]
lang: en
tldr: "The AI SDK splits an AI message into a parts array — text, reasoning, source-url, tool-* — each an independent typed fragment (introduced in v5, unchanged since). That data structure dictates how modern AI conversation UIs are written: render by switching on part.type, handing each fragment to its component. This post unpacks the design logic of the parts model, useChat's streaming behavior, and how it became the foundation for component libraries like AI Elements."
description: "A deep dive into the Vercel AI SDK's message-parts data model: why messages became arrays of typed fragments, how useChat streams incremental part updates, the mapping onto the AI Elements component library, and the trade-offs versus hand-rolling your own SSE protocol."
series:
  name: "Technology Choices in the AI Era"
  order: 4
draft: false
---

🌏 [中文版](/posts/tech/2026-08-21-ai-sdk-message-parts)

The [AI Elements post](/posts/tech/2026-08-19-vercel-ai-elements-en) mentioned that its components are shaped to the AI SDK's message-parts structure. This post covers the foundation itself — **why an AI message is no longer a string but an array of typed fragments**, and how that one decision cascades into the way every conversation UI gets written.

## From a content string to a parts array

Early chat UIs had an intuitive message model: `{ role, content }`, where content is a string you hand to a Markdown renderer. That was enough when LLMs only produced text. A modern model's single response mixes several kinds of things — a reasoning trace, tool calls (with arguments, in-flight status, results), source citations, and then the prose — and they arrive **interleaved**: reason, call a tool, read the result, reason again, call another tool, then summarize.

A single string can't hold that structure. The AI SDK's answer (introduced in v5, carried unchanged into current versions) is a parts array, each part carrying its own type — the documented types include `text`, `reasoning`, `source-url`, `source-document`, `tool-*`, `dynamic-tool`, file, and custom data parts — with the docs explicitly recommending you render from `parts` rather than `content`. The UI pattern follows directly:

```tsx
import { useChat } from "@ai-sdk/react";

const { messages } = useChat();

// render: dispatch each part by type
{messages.map((message) =>
  message.parts.map((part, i) => {
    switch (part.type) {
      case "text":
        return <MessageResponse key={i}>{part.text}</MessageResponse>;
      case "reasoning":
        return <Reasoning key={i}>{part.text}</Reasoning>;
      case "source-url":
        return <Source key={i} href={part.url} />;
      default:
        return null;
    }
  })
)}
```

That switch is the main loop of the modern AI interface. Its virtue is being **open without being chaotic**: when model capabilities expand (a new part type appears), the UI adds one case rather than restructuring its message model; unrecognized parts fall through to default and are silently skipped — forward compatible.

## Streaming: parts grow incrementally

The parts model's real test is streaming. `useChat` receives incremental updates over SSE from the backend (`streamText` and friends); a message doesn't arrive whole — the parts array grows in front of you. A `reasoning` part appears and its text lengthens token by token; a `tool-*` part shows up and walks its state machine — "input streaming → input complete (executing) → result or error" (the documented state names are `input-streaming` / `input-available` / `output-available` / `output-error`); finally a `text` part starts growing the prose.

The engineering implication: **every part component must be able to render an unfinished version of itself**. The reasoning area needs a live "thinking" state that emits words as they come; the tool card must render arguments that are still being generated; the Markdown renderer has to survive syntax cut mid-stream (an unclosed code fence, half a table). This is the workload hand-rolled chat UIs most reliably underestimate — a static render takes an hour to assemble; not flickering, not jumping, and not breaking Markdown under streaming is the actual engineering. AI Elements' `MessageResponse` (streaming-friendly Markdown rendering) and `Reasoning` (built-in isStreaming state) sell exactly these details.

## Where the abstraction ends

**It's a UI protocol, not a model protocol.** Parts are the AI SDK's frontend-backend message format; each vendor's native output (Anthropic's content blocks, OpenAI's representations) is normalized into parts by the SDK's provider layer. The upside: swap models without touching the UI. The cost: a model-specific field the SDK hasn't mapped yet means custom data parts or waiting for a release.

**Versus rolling your own SSE.** This site's [RAG streaming post](/posts/ai/2026-03-12-rag-streaming-sse-en) takes the self-managed SSE route — full protocol control, but message structure, reconnection, and the state machine are all yours to carry. Adopting useChat + parts means accepting Vercel's protocol in exchange for the whole machine ready-made. If your backend isn't in the Node/Edge ecosystem, or your message model diverges hard from parts (say, a multi-agent system with independent output streams per agent), the abstraction can get in the way instead.

## Overall

Message parts are the kind of data structure that, once defined, makes everyone realize it should always have been this way: it encodes the fact that "an AI response is an ordered stream of heterogeneous fragments" directly into the types, giving the UI layer a stable boundary — switch on part.type once, and stack AI Elements or your own components on top. If you're building an AI conversation product, understand parts first, then decide whether to use a component library; skipping the layer to invent your own message format usually means reinventing the same structure, minus the types.

## References

- [AI SDK: Chatbot (useChat and message parts)](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)
- [AI SDK](https://ai-sdk.dev/)
- [AI SDK 5 announcement (Vercel Blog)](https://vercel.com/blog/ai-sdk-5)
- [AI Elements](https://elements.ai-sdk.dev/)
- On this site: [AI Elements: Vercel's ChatGPT-Style Interface as Copy-In shadcn Blocks](/posts/tech/2026-08-19-vercel-ai-elements-en), [RAG Streaming with SSE](/posts/ai/2026-03-12-rag-streaming-sse-en)
