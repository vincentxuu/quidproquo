---
title: "AI Agent GitHub Digest — 2026-08-23"
date: 2026-08-23
category: daily
tags: [ai-agent, github, open-source, daily, mcp-server, coding-agent, computer-use-agent]
lang: zh-TW
description: "今天的主線是「社群跑得比官方快」——Bruno 的社群版 MCP server 比官方版早兩個月上線，搬家改名後的 opencode 星數已經超車 Anthropic 自家的 Claude Code"
tldr: "CopilotKit/OpenBot 用 AG-UI 協定包出「每個都有自己電腦」的 AI coworker 框架，一週衝上 2,289 星；Bruno 官方 MCP server（usebruno/bruno-mcp）比社群版（Ostico/bruno-mcp-studio）晚兩個月才補上；browser-use 團隊另開 macOS Harness 專案，用六個 accessibility 原語讓 LLM 直接操控 Mac；搬到 Anomaly 底下的 opencode 星數（約 19.9 萬）已經超過 Anthropic 自家 Claude Code（約 14.2 萬）。框架端，MCP TypeScript SDK v2 把單一套件拆成 8 個子套件，並跟進協定的 stateless 改版，拿掉了 session handshake。"
series:
  name: "AI Agent GitHub Digest"
  order: 8
---

> 🌏 [English version](/en/posts/daily/2026-08-23-ai-agent-github-digest-en)

## 今日亮點

今天的主線是「誰跑得比官方快」——Bruno 的社群版 MCP server 比官方版早兩個月上線，原本掛在 SST 底下的 opencode 搬到 Anomaly 之後，星數已經超車 Anthropic 自家的 Claude Code；同時 MCP 的 TypeScript SDK 也在月中悄悄把單一套件拆成八個子套件，跟進協定本身從「session-based」轉向「完全無狀態」的改版。

## Trending Repos

### CopilotKit/OpenBot ⭐ 2,289

[GitHub](https://github.com/CopilotKit/OpenBot)　·　TypeScript　·　MIT

- **是什麼**：CopilotKit 團隊做的開源 AI coworker 框架——每個 agent 分配到自己的瀏覽器、檔案系統和工具集，透過 AG-UI 協定接上任何前端。
- **為什麼值得看**：多數 agent 框架把「使用者互動」當成聊天視窗外掛，OpenBot 反過來把它做成協定層——每個動作在執行前先決策、執行後留記錄，讓 agent 的每一步都可回放稽核；只要前端說 AG-UI（CopilotKit 自家的 Agent-User Interaction Protocol），就能接上任何符合協定的 agent backend，不綁死特定框架。上線一週衝上 2,289 星，成長速度顯示「AI coworker」這個定位有市場在等。
- **技術棧**：TypeScript + AG-UI 協定（雙向事件流，涵蓋訊息、工具呼叫、狀態 patch、生命週期訊號）
- **上手難度**：中——alpha 階段，協定文件齊全但範例還在補齊。

---

### Bruno MCP：官方版 vs 社群版

[官方版 GitHub](https://github.com/usebruno/bruno-mcp)　·　[社群版 GitHub](https://github.com/Ostico/bruno-mcp-studio)

- **是什麼**：讓 AI agent 直接讀寫、執行 Bruno（開源 API client）的 `.bru` collection 的 MCP server——但今天同時看到兩個版本：Bruno 官方團隊本月中剛發布的 `usebruno/bruno-mcp`，以及兩個月前就上線、由社群開發者 Ostico 寫的 `bruno-mcp-studio`。
- **為什麼值得看**：這是一個具體案例，說明「MCP server」這種周邊工具的開發速度，社群常常比官方本尊還快——`bruno-mcp-studio` 早在 2026-06-07 就做出「不需要 bru CLI、與 Bruno 本體行為對等」的版本，官方版本兩個月後才補上，且目前 star 數（2 顆）還低於社群版（5 顆）。對讀者的實務意義是：選 MCP server 別只看是不是「官方出品」，先比對誰先解決了你的問題。
- **技術棧**：兩者皆為 TypeScript；官方版強調「資料不離開本機」，社群版走 `.bru`/`.yml` 檔案直接解析、不依賴 CLI。
- **上手難度**：低——兩者都是標準 MCP server，任何 MCP client 皆可接上。

---

### browser-use/macos-harness ⭐ 8（剛發布，成長中）

[GitHub](https://github.com/browser-use/macos-harness)　·　Python　·　MIT

- **是什麼**：browser-use 共同創辦人 Gregor Žunič 另開的新專案——一個「盡量薄」的 harness，只給 LLM 六個原語（`mac.see/key/type/click/ax/script`）就能直接控制 Mac 桌面，遇到瀏覽器工作再退回原本的 Browser Harness。
- **為什麼值得看**：跟坊間「電腦操控 agent」多半用截圖 + 座標點擊的做法不同，這個 harness 優先走 accessibility tree 和 AppleScript，只有必要時才退回螢幕截圖，理論上更穩定也更省 token。8/17 剛發布，目前才 8 顆星、1 個 fork，規模遠不到「trending」的門檻，但設計思路值得先記一筆——如果驗證有效，可能會被搬回主專案。
- **技術棧**：Python，accessibility API + AppleScript，退回時複用 browser-use 的 Browser Harness
- **上手難度**：中——僅支援 macOS，且需要開放輔助使用權限。

---

### anomalyco/opencode（原 sst/opencode）⭐ ~199,000

[GitHub](https://github.com/anomalyco/opencode)　·　TypeScript

- **是什麼**：原本掛在 SST 底下的開源終端機 coding agent opencode，近期搬到新組織 Anomaly 名下（`sst/opencode` 現在會導向 `anomalyco/opencode`）。
- **為什麼值得看**：搬家之後直接查星數，opencode（約 19.9 萬）已經超過 Anthropic 自家的 Claude Code（約 14.2 萬）——一個非官方、社群驅動的終端機 coding agent，在開源熱度上贏過原廠工具本身，是這波「終端機 agent」大戰裡值得記住的一個里程碑。（注意：星數持續變動快，此為查證當下的即時數字。）
- **技術棧**：TypeScript，終端機原生 UI
- **上手難度**：低——單一 CLI 安裝即可用。

## Notable Releases

### MCP TypeScript SDK v2（`@modelcontextprotocol/server@2.0.0`）

[Release Notes](https://github.com/modelcontextprotocol/typescript-sdk/releases)

- **重要變更**：把原本單一的 `@modelcontextprotocol/sdk` monolith 拆成八個子套件（`client`、`server`、`core`、`node`、`express`、`hono`、`fastify`、`codemod`），同時提供 ESM 和 CJS 雙構建；並跟進 2026-07-28 發布的新版 MCP 協定，把原本 session-based（`initialize`/`initialized` handshake、`Mcp-Session-Id` header）的設計整個改成無狀態——沒有握手流程，改用每次請求帶的 header，並新增 `server/discover` RPC 做能力探索。
- **Breaking Changes**：有。舊版依賴 session handshake 或 `Mcp-Session-Id` 的 server/client 程式碼要照新協定重寫；套件 import 路徑也全部要換成新的子套件名稱。授權也變成混合制——舊有程式碼維持 MIT，新貢獻走 Apache-2.0。
- **對你的影響**：如果你的 MCP server 或 client 是用舊版 TS SDK 寫的，升級前要先確認有沒有依賴 session 狀態（例如把使用者資料存在 session 裡跨請求讀取），這在新的 stateless 模型下要改用其他方式維護狀態；同時 import 路徑要跟著套件拆分調整。

## 今日收穫

原本以為「官方出品」通常會是某個工具生態的先行者，社群頂多是做外掛和整合；但今天三個故事剛好反過來——Bruno 的社群版 MCP server 比官方版早兩個月做出來，opencode 這個非官方分支的星數已經超車 Anthropic 自家的 Claude Code。反而是「協定」這一層，各家才真的在同步收斂——MCP 從 session 走向 stateless，是所有 MCP server/client 共同要面對的改版，不分官方或社群。工具生態的競爭看起來正在從「誰先做出功能」，轉往「誰先跟上協定」。

## 參考資料

- [CopilotKit/OpenBot](https://github.com/CopilotKit/OpenBot)
- [AG-UI Protocol 介紹](https://www.copilotkit.ai/ag-ui)
- [usebruno/bruno-mcp（官方）](https://github.com/usebruno/bruno-mcp)
- [Ostico/bruno-mcp-studio（社群）](https://github.com/Ostico/bruno-mcp-studio)
- [browser-use/macos-harness](https://github.com/browser-use/macos-harness)
- [anomalyco/opencode](https://github.com/anomalyco/opencode)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [MCP TypeScript SDK Releases](https://github.com/modelcontextprotocol/typescript-sdk/releases)
- [MCP 協定 2026-07-28 版公告](https://blog.modelcontextprotocol.io/posts/2026-07-28)
