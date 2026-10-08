---
title: "AI Agent GitHub Digest — 2026-10-09"
date: 2026-10-09
category: daily
tags: [ai-agent, github, open-source, daily, agent-harness, mobile-testing]
lang: zh-TW
description: "三個工具補的都是 coding agent「寫完之後」的那一段——跑 agent 的硬底子、讓 agent 自己開 app 驗證改動、把整個 agent session 裝進手機；Claude Code 補了一個指令式 hook 擋不住該擋命令的洞"
tldr: "**trueforge**（6,083★）是把 model 呼叫、MCP 工具、sandbox、approval、session 狀態這些「跑好一個 agent」要做的雜事包好的開源 harness runtime；**agent-device**（4,937★）讓 coding agent 直接在 iOS / Android 模擬器或實機上開 app、點畫面、讀 accessibility snapshot 來驗證自己改的程式碼，Expensify、Shopify 都在用；**pi-pocket**（274★，上線 4 天）把開源極簡 coding agent 「Pi」的整個 session 搬進手機，可以遠端操控、多人同看、排程任務。Claude Code v2.1.294 修掉一個會讓「用自然語言寫的」hook 擋不住它該擋的指令的洞；browser-use 0.13.11 預告了給 Claude 用的瀏覽器工具集，但要等 Anthropic SDK 補上對應功能才能真正用。"
series:
  name: "AI Agent GitHub Digest"
  order: 55
---

> 🌏 [English version](/en/posts/daily/2026-10-09-ai-agent-github-digest-en)

## 今日亮點

今天三個工具沒有一個在碰模型本身，碰的全是 coding agent「寫完程式碼之後」那一段：trueforge 把跑一個 agent 要處理的雜事（session、sandbox、approval）打包成可重用的 runtime；agent-device 讓 agent 不用只靠讀程式碼猜對不對，而是真的把 app 開起來點一點驗證；pi-pocket 則讓你把整段 agent session 裝進口袋，走到哪都能看它在幹什麼。同一天，Claude Code 補了一個「用自然語言寫的 hook 擋不住它該擋的指令」的安全洞。

## Trending Repos

### trueforge ⭐ 6,083

[GitHub](https://github.com/truefoundry/trueforge)　·　TypeScript　·　MIT

- **是什麼**：一個開源的「agent harness」runtime——把 model 呼叫、MCP 工具、skills、sandbox 執行、人工 approval、context 管理和 session 狀態這些跑好一個 agent 要處理的底層雜事全部包起來，對外開放聊天介面、HTTP API 和可嵌入的 UI SDK 三種用法。
- **為什麼值得看**：多數人寫 agent 卡在「邏輯好寫，跑起來難」——要自己搭 streaming、session 持久化、tool server、sandbox 隔離。trueforge 把這些做成開箱即用的基礎設施，模型、工具、skill 都走設定好的 catalog 選用，sandbox（目前支援 Daytona）只在需要時才生成，密鑰留在 harness 不碰到使用者。官方寫了跟 Claude Managed Agents、deepagents 的 benchmark 比較，主張同樣準確度下成本更低。
- **Tech stack**：TypeScript + MCP + SQLite（本機模式）/ Postgres + Redis（多機模式）+ Daytona sandbox
- **上手難度**：低（試用）／中（上生產）——`npx @truefoundry/trueforge@latest` 就能本機跑起來，要接多人協作或正式部署才需要 Docker Compose / Helm / Railway。

---

### agent-device ⭐ 4,937

[GitHub](https://github.com/callstack/agent-device)　·　TypeScript　·　MIT

- **是什麼**：給 AI coding agent 用的行動裝置自動化工具，讓 agent 透過 CLI、內建 MCP server 或 Node.js API，在 iOS / Android / HarmonyOS 的模擬器、emulator 或實機上開 app、點畫面、填表單、截圖、看 log，驗證自己剛改的程式碼有沒有真的動起來。
- **為什麼值得看**：多數 coding agent 改完程式碼只能讀原始碼判斷對不對，agent-device 讓它讀的是 app 的 accessibility snapshot（比截圖省 token），用 ref/selector 操作畫面，還能把操作過程存成證據或轉成 CI 可重跑的腳本。支援 Claude Code、Codex、Cursor、Windsurf、Cline、Goose 等任何能跑 CLI 或接 MCP 的 agent，Expensify、Shopify 等團隊已經在用。多個並行 agent worktree 搶同一台裝置的協調，以及接 BrowserStack / AWS Device Farm 之類遠端裝置雲，都內建支援。
- **Tech stack**：TypeScript CLI + MCP server + 各平台原生橋接（iOS 用 XCTest、Android 用 ADB、HarmonyOS 用 HDC/ArkUI uitest、Linux 用 AT-SPI）
- **上手難度**：中——`npm install -g agent-device` 後跑 `agent-device doctor` 檢查環境，但要先裝好對應平台的模擬器／SDK（Xcode、Android Studio 等）才能真正操作裝置。

---

### pi-pocket ⭐ 274（上線 4 天）

[GitHub](https://github.com/TannerMidd/pi-pocket)　·　TypeScript　·　MIT

- **是什麼**：把開源極簡 coding agent「Pi」（只有 read / edit / write / bash 四個內建工具、系統提示不到千字、靠 TypeScript extension 擴充的那款）整個 session 搬進手機能用的網頁 App——多人同看一個 session、側邊聊天、可以在 agent 工作時插話改方向、排程任務（例如「每個工作日早上 8 點幫我總結 CI」）。
- **為什麼值得看**：市面上多數「手機操控 coding agent」做法是把桌面畫面串流過去，pi-pocket 反過來把 session 本身做成 durable 的——每次 model 呼叫、工具呼叫都存起來，伺服器重啟工作照樣接著跑，中斷的工具呼叫只在安全的情況下才重跑。手機上能看 diff、審查未提交的改動、分支切換，等於把 Pi 的桌面體驗幾乎原封不動搬到口袋裡，不需要額外的雲端 VM。
- **Tech stack**：Node.js 網頁 App（PWA）+ Pi agent runtime（Pi Durable）
- **上手難度**：中——需要先裝好並登入 Pi 本體，`git clone` 這個 repo 後 `npm install && npm start` 啟動，支援 Linux／macOS／Windows／Android（Termux），作者標示 Linux 測得最完整。

## Notable Releases

### Claude Code v2.1.294

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.294)

- **重要變更**：修掉用自然語言寫的 `prompt`／`agent` hook（像「Block commands that...」這種用指令描述而非寫程式的 hook）有時擋不住它本來該擋的事；改善 `Stop` 和 `SubagentStop` 上用指令寫的 hook（像「Carry on if the build is broken」）的判斷邏輯，讓 Claude 不會太早喊停。
- **Breaking Changes**：無
- **對你的影響**：如果你靠「用白話寫一句話」當 hook 擋危險指令（而不是寫腳本判斷），這個版本修的正是這類 hook 可能形同沒擋的洞，值得升級；用 Stop/SubagentStop hook 控制收尾時機的話，行為可能會比之前更不容易提早結束。

---

### browser-use 0.13.11

[Release Notes](https://github.com/browser-use/browser-use/releases/tag/0.13.11)

- **重要變更**：新增 `browser_use.integrations.toolsets_for_claude`，預告給 Claude 用的瀏覽器工具集整合；官方明寫這項整合需要一個目前還沒公開的 Anthropic SDK 版本（要內建 `anthropic.tools.browser`）才能真正動起來。
- **Breaking Changes**：無
- **對你的影響**：現在裝這個版本還用不了這個功能——等 Anthropic 把對應的原生瀏覽器工具放進公開 SDK，browser-use 這邊已經先把接口準備好了，值得先關注但不用急著接。

## 今日收穫

本來以為 coding agent 卡住的地方是「寫得對不對」，trueforge 和 agent-device 同一天冒出來才想到，更大的坑其實是「跑起來之後怎麼知道它真的做到了」——一個補的是讓 agent 跑得穩（session、sandbox、approval 不用每次重寫），一個補的是讓 agent 自己動手確認（打開 app 看畫面，不是只看程式碼猜）。

## 參考資料

- [truefoundry/trueforge](https://github.com/truefoundry/trueforge)
- [callstack/agent-device](https://github.com/callstack/agent-device)
- [TannerMidd/pi-pocket](https://github.com/TannerMidd/pi-pocket)
- [Claude Code v2.1.294 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.294)
- [browser-use 0.13.11 Release Notes](https://github.com/browser-use/browser-use/releases/tag/0.13.11)
