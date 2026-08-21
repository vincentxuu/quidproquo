---
title: "AI SDK 的 message parts：對話介面的資料骨架"
date: 2026-08-21
category: tech
type: deep-dive
tags: [ai-sdk, react, llm, streaming, ui]
lang: zh-TW
tldr: "AI SDK v5 把一則 AI 訊息拆成 parts 陣列——text、reasoning、source-url、tool-* 各自是獨立片段。這個資料結構決定了現代 AI 對話介面怎麼寫：render 時 switch part.type，每種片段交給對應元件。這篇拆解 parts 模型的設計邏輯、useChat 的串流機制，以及它如何成為 AI Elements 這類元件庫的地基。"
description: "深入介紹 Vercel AI SDK 的 message parts 資料模型：為什麼訊息要拆成型別化片段、useChat 如何串流更新 parts、與 AI Elements 元件庫的對應關係，以及自己手刻對話介面時的取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 4
draft: false
---

🌏 [English version](/posts/tech/2026-08-21-ai-sdk-message-parts-en)

[AI Elements](/posts/tech/2026-08-19-vercel-ai-elements) 那篇提過：它的元件是照 AI SDK 的 message parts 結構設計的。這篇把地基本身講清楚——**為什麼一則 AI 訊息不再是一個字串，而是一個型別化片段的陣列**，以及這個決定如何連鎖地決定了整個對話介面的寫法。

## 從 content 字串到 parts 陣列

早期聊天介面的訊息模型很直觀：`{ role, content }`，content 是字串，render 就是丟給 Markdown 渲染器。這個模型在 LLM 只會回文字的年代夠用，但現代模型的一次回應裡混著多種東西：推理過程、工具呼叫（含參數、執行中狀態、結果）、引用來源、然後才是正文——而且這些是**交錯出現**的：模型可能先推理、呼叫一個工具、看結果再推理、再呼叫另一個工具、最後總結。

單一字串裝不下這個結構。AI SDK 的答案（v5 引入這個模型，現行版本沿用至今）是把訊息改成 parts 陣列，每個 part 有自己的 type（官方文件列出的類型包括 `text`、`reasoning`、`source-url`、`source-document`、`tool-*`、`dynamic-tool`、file 與自訂 data parts 等），並明確建議用 `parts` 而非 `content` 來 render。介面寫法隨之定型：

```tsx
import { useChat } from "@ai-sdk/react";

const { messages } = useChat();

// render：對每個 part 依 type 分派
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

這個 switch 就是現代 AI 介面的主迴圈。它的美在於**開放而不失控**：模型能力擴張（新增一種 part 類型）時，介面加一個 case 就好，不用重構訊息模型；不認識的 part 落到 default 安靜跳過，向前相容。

## 串流：parts 是漸進生長的

parts 模型真正的考驗在串流。`useChat` 透過 SSE 接收後端（`streamText` 等）的增量更新，訊息不是一次到位，而是 parts 陣列在你眼前生長：先冒出一個 `reasoning` part 且文字逐 token 增長，接著出現 `tool-*` part 並經歷「輸入串流中 → 輸入完成（執行中）→ 有結果或錯誤」的狀態遷移（文件的 state 命名是 `input-streaming` / `input-available` / `output-available` / `output-error`），最後 `text` part 開始長正文。

對介面工程的含義是：**每個 part 元件都要能 render「未完成」的自己**。推理區要能顯示「思考中」並即時吐字、工具卡片要能顯示參數還在生成、Markdown 渲染器要能處理砍在一半的語法（沒閉合的 code fence、寫到一半的表格）。這正是手刻對話介面最容易低估的工作量——靜態 render 一小時就能拼出來，串流狀態下不閃爍、不跳版、不炸 Markdown 才是真正的工程，AI Elements 的 `MessageResponse`（基於串流友善的 Markdown 渲染）和 `Reasoning`（isStreaming 狀態內建）賣的就是這些細節。

## 這層抽象的邊界

**它是 UI 協定，不是模型協定。** parts 是 AI SDK 定義的前後端訊息格式，模型各家的原生輸出（Anthropic 的 content blocks、OpenAI 的表示法）由 SDK 的 provider 層歸一化成 parts。好處是換模型不動介面；代價是模型特有的欄位若 SDK 還沒映射，就得走自訂 data parts 或等版本更新。

**跟自刻 SSE 的取捨。** 站內[RAG 串流那篇](/posts/ai/2026-03-12-rag-streaming-sse)走的是自己管 SSE 的路線——完全控制協定，但訊息結構、斷線重連、狀態機全部自己扛。用 useChat + parts 等於採納 Vercel 定義的協定換取整套現成機制；後端不是 Node/Edge 生態、或訊息模型跟 parts 差距太大的系統（例如多 agent 各自有獨立輸出流），這層抽象可能反而礙事。

## 整體來說

message parts 是那種「定了之後大家才發現本來就該這樣」的資料結構：它把「AI 回應是異質片段的有序串流」這個事實直接編碼進型別，介面層從此有了穩定的租界——switch part.type 一次，上面能疊 AI Elements 也能疊自家元件。要做 AI 對話產品，先看懂 parts 再決定用不用現成元件庫；直接跳過這層自己發明訊息格式，多半是把同一個結構重新發明一遍，還沒有型別。

## 參考資料

- [AI SDK：Chatbot（useChat 與 message parts）](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)
- [AI SDK 官網](https://ai-sdk.dev/)
- [AI SDK 5 發布公告（Vercel Blog）](https://vercel.com/blog/ai-sdk-5)
- [AI Elements](https://elements.ai-sdk.dev/)
- 站內相關：[AI Elements：Vercel 把 ChatGPT 式介面拆成可複製的 shadcn 積木](/posts/tech/2026-08-19-vercel-ai-elements)、[RAG 串流：SSE 實作](/posts/ai/2026-03-12-rag-streaming-sse)
