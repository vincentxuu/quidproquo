---
title: "shadcn registry 與 MCP：元件分發的第三條路"
date: 2026-08-21
category: tech
type: deep-dive
tags: [shadcn-ui, mcp, react, ai-agent, developer-tools]
lang: zh-TW
tldr: "元件分發向來只有兩條路：npm 套件（黑盒依賴）或手動複製貼上。shadcn registry 把第三條路標準化——元件以 JSON 描述原始碼與依賴，CLI 一鍵裝進你的 repo 變成你的程式碼。任何人都能架自己的 registry（AI Elements 就是一個），官方 MCP server 更讓 AI agent 直接瀏覽與安裝元件。"
description: "深入介紹 shadcn registry 機制：copy-in 分發模型如何運作、自建 registry 的生態（以 AI Elements 為例）、官方 MCP server 讓 agent 安裝元件的意義，以及這條路線相對 npm 套件的取捨。"
series:
  name: "AI 時代的技術選擇"
  order: 6
draft: false
---

🌏 [English version](/posts/tech/2026-08-21-shadcn-registry-mcp-en)

[shadcn/ui 那篇](/posts/tech/2026-03-27-shadcn-ui-component-library)講過它的核心主張：元件不該是黑盒依賴，該是複製進你 repo 的原始碼。但很多人停在「shadcn = 一套好看的元件」的理解，錯過了更重要的東西——**它把這個分發模型做成了開放基礎設施**。registry 是一個任何人都能實作的協定，而 2025 年加入的 MCP server 讓這條分發管道直接對 AI agent 開放。這篇講清楚這層。

## 兩條老路的困境

npm 套件的問題[選型總覽](/posts/tech/2026-08-19-react-stack-ai-era)講過:客製只能在 props 開的洞裡做,深度修改要 fork 或 patch,升級可能翻臉。純複製貼上則相反:自由是完全的,但沒有依賴解析(貼一個元件要自己追它 import 的三個工具函式)、沒有版本語意、沒有安裝工具。

registry 是第三條路：**保留複製貼上的所有權模型，補上套件管理的工程性**。

## Registry 怎麼運作

一個 registry 本質上是一組 JSON endpoint。每個元件項目描述：原始碼檔案（內容直接內嵌）、要裝到哪個路徑、npm 依賴、以及對 registry 內其他項目的依賴。CLI 消費這些 JSON：

```bash
# 官方 registry
npx shadcn@latest add button

# 任何第三方 registry——用 URL 指過去就行
npx shadcn@latest add https://elements.ai-sdk.dev/api/registry/all.json
```

CLI 解析依賴圖、裝 npm 依賴、把原始碼寫進你設定的目錄（路徑、alias、Tailwind 設定都在專案的 `components.json` 裡宣告）。裝完之後 registry 的任務就結束了——程式碼是你的，沒有執行期的臍帶。

關鍵在第二行:**registry 是開放協定,不是 shadcn 官方的專屬倉庫**。官方文件（ui.shadcn.com/docs/registry）直接教你架自己的 registry。[AI Elements](/posts/tech/2026-08-19-vercel-ai-elements) 就是一個完整案例——Vercel 沒有為它發明新的分發機制,而是實作 registry 協定,讓既有的 shadcn CLI 直接吃。這個「寄生於既有管道」的選擇本身就說明了 registry 已經是事實標準:設計系統團隊把公司內部元件庫做成私有 registry,新專案 `add` 一下就長出符合規範的起手式,同樣不需要發 npm 套件。

## MCP：把分發管道接給 agent

2025 年 shadcn 推出官方 MCP server，官方文件的定義一句話：「The shadcn MCP Server allows AI assistants to interact with items from registries.」接上之後，agent 能瀏覽 registry 有什麼元件、讀它們的原始碼與用法、直接執行安裝。

想清楚這件事的含義：**元件分發的消費端從人變成了 agent**。傳統流程是人逛文件站、挑元件、複製安裝指令；MCP 流程是你跟 agent 說「做一個帶附件上傳的聊天輸入框」，agent 自己查 registry、發現 PromptInput、裝進專案、接上你的後端。文件站從「給人看的展示間」變成「給機器查的 API」——這跟[llms.txt](/posts/tech/2026-08-21-llms-txt) 是同一個趨勢的兩個切面：一個管文件可讀，一個管元件可裝。

而 copy-in 模型在這裡顯出對 agent 的第二層友善（第一層是裝完的程式碼 agent 可以 grep 和改）：**安裝行為本身是可審查的**。agent 裝一個 npm 套件，你看到的是 package.json 多一行；agent 從 registry 裝元件,你在 diff 裡看到完整的新增原始碼。對「agent 寫的每一行都應該過 review」的工作流,後者的透明度是質變。

## 取捨

這條路不是免費的。**更新責任在你**：上游元件修了 bug，你要自己拉新版 diff 合併，沒有 `npm update` 一鍵到位；裝進來的元件多了,repo 裡「你寫的」和「裝來的」界線會模糊,約定目錄紀律很重要。**生態實務上以 React + Tailwind 為大宗**——不過要說清楚:協定本身自 2025 年中的 universal registry items 起已標榜 framework-agnostic,官方文件明寫「works with any project type and any framework, and is not limited to React」;Vue/Svelte 世界另有各自營運 registry 的移植（shadcn-vue、shadcn-svelte）。**信任問題**:第三方 registry 的元件程式碼會直接進你的 repo 並被執行,裝之前 review 來源的必要性不低於裝 npm 套件——好在如上所述,review 的可行性反而更高。

## 整體來說

registry 把「元件是你的程式碼」從 shadcn 一家的產品哲學,升級成有 CLI、有 schema、有 MCP 入口的開放分發層。它適合設計系統、AI 介面積木這類「裝了就要深度客製」的東西;不適合純邏輯庫（date-fns 沒有理由 copy-in）。往後看,元件的消費端越來越常是 agent——誰的分發管道對機器友善,誰的生態就長得快,這正是它在這個系列裡佔一篇的原因。

## 參考資料

- [shadcn/ui Registry 文件](https://ui.shadcn.com/docs/registry)
- [shadcn/ui MCP Server](https://ui.shadcn.com/docs/mcp)
- [shadcn/ui](https://ui.shadcn.com/)
- [AI Elements](https://elements.ai-sdk.dev/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- 站內相關：[shadcn/ui：不是套件，是複製貼上的元件原始碼](/posts/tech/2026-03-27-shadcn-ui-component-library)、[AI Elements：Vercel 把 ChatGPT 式介面拆成可複製的 shadcn 積木](/posts/tech/2026-08-19-vercel-ai-elements)、[AI 時代的 React 套件選型](/posts/tech/2026-08-19-react-stack-ai-era)
