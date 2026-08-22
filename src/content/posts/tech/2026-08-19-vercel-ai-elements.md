---
title: "AI Elements：Vercel 把 ChatGPT 式介面拆成可複製的 shadcn 積木"
date: 2026-08-19
category: tech
type: deep-dive
tags: [ai-elements, ai-sdk, shadcn-ui, react, ui, vercel]
lang: zh-TW
tldr: "AI Elements 是 Vercel 為 AI SDK 生態出的 React 元件庫，registry 現有 48 個元件，涵蓋 Conversation、Reasoning、Sources、Tool 等 AI 介面積木。走 shadcn 模式：npx ai-elements@latest 把原始碼直接複製進專案，完全可改，跟 useChat 的 message parts 一一對應。"
description: "介紹 Vercel AI Elements：AI SDK 官方 UI 元件庫的定位、shadcn 複製原始碼模式、元件清單、與 useChat message parts 的對應方式，以及 Vue / Svelte 社群移植版。"
series:
  name: "AI 時代的技術選擇"
  order: 2
draft: false
---

🌏 [English version](/posts/tech/2026-08-19-vercel-ai-elements-en)

做過 AI 聊天介面的人都知道，難的不是那個輸入框，而是周邊的一切：串流中的 Markdown 要即時渲染、推理過程要能折疊、引用來源要展開、工具呼叫要顯示參數與結果、重新生成後要能在多個版本間切換。AI Elements 是 Vercel 為 AI SDK 生態推出的 React 元件庫，把這些「ChatGPT 式介面的標準配備」全部做成現成元件——而且走 shadcn 模式，原始碼直接複製進你的專案，不是裝一個黑盒子依賴。

## 定位：AI SDK 的官方 UI 層

AI Elements 於 2025 年 8 月推出（repo `vercel/ai-elements` 建立於 2025-08-15，截至 2026 年 8 月約 2,300 stars），官方描述是「a component library and custom registry built on top of shadcn/ui to help you build AI-native applications faster」。它不是又一個泛用 UI 庫，而是專門對接 AI SDK 的 `useChat` hook：AI SDK v5 把一則訊息拆成 `text`、`reasoning`、`source-url`、`tool-*` 等 message parts，AI Elements 的元件就是照這個結構設計的。render 時 switch `part.type`，每種 part 丟給對應元件，介面就完成了：

```tsx
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { useChat } from "@ai-sdk/react";

const Example = () => {
  const { messages } = useChat();

  return messages.map(({ role, parts }, index) => (
    <Message from={role} key={index}>
      <MessageContent>
        {parts.map((part, i) =>
          part.type === "text" ? (
            <MessageResponse key={i}>{part.text}</MessageResponse>
          ) : null
        )}
      </MessageContent>
    </Message>
  ));
};
```

這是它跟自己手刻或拿泛用元件庫拼裝最大的差別：資料結構的對應關係是設計進去的，不用自己寫轉接層。

## shadcn 模式：你擁有這些程式碼

跟 [shadcn/ui](/posts/tech/2026-03-27-shadcn-ui-component-library) 一樣，AI Elements 不發佈 npm 套件讓你 import，而是用 CLI 把元件的 `.tsx` 原始碼複製進專案的 `@/components/ai-elements/` 目錄：

```bash
# 裝全部元件
npx ai-elements@latest

# 只裝特定元件
npx ai-elements@latest add message

# 或走 shadcn CLI 的 registry
npx shadcn@latest add https://elements.ai-sdk.dev/api/registry/all.json
```

複製進來之後，這些程式碼就是你的：要改樣式、改行為、砍掉一半都隨意，也不會有套件升級把客製改動蓋掉的問題。代價同樣是 shadcn 模式的老問題——上游更新要自己重新拉、手動合併。官方 README 列的前置需求是 Next.js + AI SDK + shadcn/ui + Tailwind（CSS Variables mode）；社群實務上非 Next.js 的 React 專案也能用，但如果你的技術堆疊不在 React + Tailwind 這條線上，這套就直接出局。

## 元件清單：AI 介面的完整詞彙

官方 registry 現有 48 個元件，官方文件分為 Chatbot / Code / Voice / Workflow / Utilities 五類（語音、workflow 視覺化、terminal 等都有對應元件）。以下按用途歸納最常用的幾塊：

- **對話骨架**：`Conversation`（含自動捲動與 scroll-to-bottom 按鈕）、`Message` 及其子元件 `MessageResponse`（串流友善的 Markdown 渲染；早期獨立的 `Response` 元件已併入 message）
- **輸入區**：`PromptInput`（附件上傳、模型選擇器有現成子元件；截圖鈕、web search 開關則用泛用的 `PromptInputButton` 拼出，官方範例即如此）、`Suggestion`（建議提示詞）
- **AI 行為視覺化**：`Reasoning`（推理過程折疊、顯示思考秒數）、`Tool`（工具呼叫的參數與結果）、`Task`（任務進度）、`Sources` 與 `InlineCitation`（引用來源）
- **內容呈現**：`CodeBlock`（語法上色）、`Image`（AI 生圖）、`WebPreview`（內嵌網頁預覽）、`MessageBranch` 系列（同一則訊息多版本切換——就是 ChatGPT 重新生成後那個 ‹ 2/3 › 切換器；早期的獨立 `Branch` 元件已改制為 message 子元件）

官網 [elements.ai-sdk.dev](https://elements.ai-sdk.dev/) 首頁的 demo 本身就是用這些元件拼的，原始碼直接展示在頁面上。另一個值得注意的細節：repo 裡附了給 AI coding agent 用的 `SKILL.md`，讓 agent 能正確地幫你安裝與使用這些元件——Vercel 顯然預期很多人是讓 agent 來拼這個介面的。

## 不用 React 怎麼辦

官方只支援 React，但社群有兩個非官方移植：**AI Elements Vue**（`vuepont/ai-elements-vue`，基於 shadcn-vue）和 **Svelte AI Elements**（`sikandarjodd/ai-elements`，基於 shadcn-svelte）。兩者都是同樣的複製原始碼模式，元件命名也大致對齊官方版。要注意的是移植版由社群維護，跟上游的同步速度與涵蓋度都要自己驗證，不能假設官方版有的它們都有。

## 整體來說

AI Elements 的核心取捨很清楚：它把「做一個像樣的 AI 聊天介面」從自己刻串流渲染、推理折疊、來源引用這些瑣碎工作，變成組裝現成且完全可客製的積木——前提是接受 React + Tailwind + shadcn 這條技術堆疊，以及 shadcn 模式「擁有程式碼、自負更新」的維護方式。如果你正在用 AI SDK 做產品，這套幾乎是預設選項；如果你只是要一個嵌入式客服 widget，殺雞用牛刀；如果你的前端是 Vue，先去看社群移植版能不能滿足需求，再決定要不要為它單獨開一條 React 線。

## 參考資料

- [AI Elements 官網](https://elements.ai-sdk.dev/)
- [AI Elements 文件（AI SDK）](https://ai-sdk.dev/elements/overview)
- [vercel/ai-elements（GitHub）](https://github.com/vercel/ai-elements)
- [AI SDK：useChat 與 message parts](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot)
- [shadcn/ui](https://ui.shadcn.com/)
- [AI Elements Vue（社群移植）](https://github.com/vuepont/ai-elements-vue)
- [Svelte AI Elements（社群移植）](https://github.com/sikandarjodd/ai-elements)
- 站內相關：[shadcn/ui：不是套件，是複製貼上的元件原始碼](/posts/tech/2026-03-27-shadcn-ui-component-library)
