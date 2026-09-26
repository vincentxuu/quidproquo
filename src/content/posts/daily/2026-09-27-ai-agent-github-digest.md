---
title: "AI Agent GitHub Digest — 2026-09-27"
date: 2026-09-27
category: daily
tags: [ai-agent, github, open-source, daily, agent-platform, agent-orchestration, mcp-server]
lang: zh-TW
description: "Paperclip 把 agent 當員工排進組織圖，Buzz 讓人與 agent 共用同一份簽章事件日誌——兩條路徑同時在解「agent 數量變多之後該怎麼組織」這題"
tldr: "Paperclip（86.7k★）用組織圖、預算、心跳排程把一群 agent 當員工管理；Block 開源的 Buzz（34.8k★）反過來讓人與 agent 用同一套 Nostr 簽章協定共用工作空間；智譜 Z.ai 開源 ZCode，加入自建 coding agent 殼的陣營；mobile-mcp 把 MCP 工具延伸到真實 iOS/Android 裝置。Notable Releases：Pydantic AI v2.51.0 加入 OpenAI GPT-Live 並收緊 realtime tool_choice／型號比對；Claude Code v2.1.283 新增 `deniedModels` 鎖模型設定與 `/doctor prompt-audit`。"
series:
  name: "AI Agent GitHub Digest"
  order: 43
---

> 🌏 [English version](/en/posts/daily/2026-09-27-ai-agent-github-digest-en)

## 今日亮點

今天兩個熱門 repo 剛好從相反方向解同一題——「agent 數量變多之後，要怎麼組織」。Paperclip 把每個 agent 當員工排進組織圖、給預算、設審核關卡；Block 開源的 Buzz 則反過來讓人跟 agent 共用同一個房間、同一套簽章協定，不特別區分誰是「管理者」誰是「員工」。同一個問題，一邊選了科層，一邊選了共治。

## Trending Repos

### paperclipai/paperclip ⭐ 86,759

[GitHub](https://github.com/paperclipai/paperclip)　·　TypeScript　·　MIT

- **是什麼**：一個 Node.js 伺服器加 React UI 的開源平台，把一群 AI agent 當員工排進組織圖，指派目標、審核工作、追蹤花費。
- **為什麼值得看**：市面上多數框架在意「怎麼讓單一 agent 把一件事做好」，Paperclip 假設你手上已經有一堆 agent（OpenClaw、Codex、Claude、Cursor 都能接），需要的是公司等級的治理層——組織圖、每月預算上限、心跳排程喚醒、審核關卡。「同時開 20 個 Claude Code 終端機、追不到誰在做什麼」是它明講要解的痛點。
- **tech stack**：Node.js 後端 + React 前端 + 跨供應商 agent runtime（bring-your-own-agent）
- **上手難度**：中——概念偏新（把 agent 當員工管理），得先搞懂組織圖、心跳、預算幾個核心機制才敢放手用

---

### block/buzz ⭐ 34,783

[GitHub](https://github.com/block/buzz)　·　Rust　·　Apache-2.0

- **是什麼**：Block（Square 母公司，也是開源 agent Goose 背後的團隊）開源的人機共用工作空間，底層是一個 Nostr relay——每則訊息、程式碼審查、workflow 步驟，都是同一份簽章事件日誌裡的紀錄。
- **為什麼值得看**：多數 agent 協作工具是「聊天機器人掛在既有 Slack/Discord 上」，Buzz 反過來讓 agent 用跟人類一樣的協定加入工作場所——有自己的金鑰、自己的頻道權限、自己的稽核紀錄，可以開 repo、送 patch、審查程式碼、跑 workflow，甚至加入語音 huddle。用同一套身分模型處理人跟 agent，而不是另外做一層權限系統。
- **tech stack**：Rust + Nostr relay 協定 + NIP-34 git 事件
- **上手難度**：中——預設走自託管（自架 relay），得先理解 Nostr 的簽章事件模型才能掌握權限設計

---

### zai-org/ZCode ⭐ 6,827

[GitHub](https://github.com/zai-org/ZCode)　·　TypeScript　·　Apache-2.0

- **是什麼**：智譜（Z.ai，GLM 模型背後的公司）開源的程式設計 agent 工作台，同時提供桌面應用、瀏覽器介面和終端機 Agent CLI。
- **為什麼值得看**：Claude Code、Codex、Cursor 之外，又一家主要 LLM 廠商決定自己做「coding agent 殼」而不只是賣 API——coding agent 的競爭正從「模型能力」延伸到「開發者用哪個介面跟 agent 互動」，終端機、桌面、瀏覽器三種介面同時做，也顯示廠商想把所有工作流情境都覆蓋到。
- **tech stack**：TypeScript + Electron 桌面殼 + pnpm monorepo（CLI／Web／桌面共用同一份 Agent 執行期）
- **上手難度**：中——目前文件以簡體中文為主，啟動涉及多個 workspace 套件與環境變數設定

---

### mobile-next/mobile-mcp ⭐ 7,236

[GitHub](https://github.com/mobile-next/mobile-mcp)　·　TypeScript　·　Apache-2.0

- **是什麼**：一個讓 agent 直接操控真實 iOS/Android 裝置、模擬器與模擬器的 MCP server，支援原生 App 自動化與資料擷取。
- **為什麼值得看**：多數電腦操作 agent 目前停在網頁瀏覽器層級，mobile-mcp 把同一套「MCP 工具」延伸到手機——優先讀 accessibility tree 定位元素（不用 vision model、不燒 image token），必要時才退回螢幕截圖加座標點擊；同時支援 Claude Code、Codex、Gemini、GitHub Copilot 等多種 client，還能接雲端裝置池跑真機測試。
- **tech stack**：TypeScript + MCP SDK + iOS Accessibility API／Android adb
- **上手難度**：中——本機模式要先裝好 Xcode／Android SDK 並開好模擬器，雲端裝置池模式免本機環境但需另外串接 Mobile Next Cloud

## Notable Releases

### Pydantic AI v2.51.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.51.0)

- **重要變更**：新增 OpenAI GPT-Live 支援（`OpenAILiveModel`），即時語音多一個廠商選項；realtime session 新增 `context_window_used`，可讀 GPT-Live 回報的用量比例或 response usage；修掉 streamed tool call 遺失 `provider_details`、Gemini Live 圖片重送、被中斷回覆遺失 response id 等多個 bug。
- **Breaking Changes**：對 dated 的 `gemini-3.8-live` 型號 id 做嚴格比對，並在連線時直接拒絕 Gemini 3.1/3.8 Live 上的 `google_affective_dialog`；OpenAI／Azure OpenAI／xAI 上如果 realtime `tool_choice` 強制呼叫工具，會直接丟出 `UserError`。
- **對你的影響**：如果你原本用寬鬆比對接 Gemini Live 型號字串，或在這幾家 realtime API 上用 `tool_choice` 強制呼叫工具，升級後這兩種用法都會直接報錯，得照新規則調整。

---

### Claude Code v2.1.283

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.283)

- **重要變更**：新增 `availableModelsMatch: "exact"` 與 `deniedModels` 兩個 managed setting，讓組織精準鎖定或封鎖特定模型版本；新增 `/doctor prompt-audit`，稽核 CLAUDE.md、skills、commands 裡寫給舊模型的過時 prompt 手法；修掉 MCP 長時任務轉背景執行後進度通知被吃掉、SDK session 提早結束漏掉 tool result 等問題。
- **Breaking Changes**：無，這個版本以新設定、除錯工具與大量 bug fix 為主。
- **對你的影響**：如果組織有用 managed settings 鎖模型版本，`availableModelsMatch`／`deniedModels` 這兩個新欄位值得排進下一輪設定檢查；`prompt-audit` 適合拿來抓自己 repo 裡過時的 prompting 手法。

## 今日收穫

之前以為 agent 數量變多之後，下一步自然是做更好的多 agent 框架（更聰明的路由、更省 token 的協調演算法）。但 Paperclip 跟 Buzz 今天同時衝上 trending 提醒我，另一群人在解一個更基本的問題：agent 一旦多到像一間公司的員工，缺的不是更聰明的協調演算法，而是組織圖、預算、稽核這些原本管理「人」的機制——只是這次也要適用在 agent 身上。

## 參考資料

- [paperclipai/paperclip](https://github.com/paperclipai/paperclip)
- [block/buzz](https://github.com/block/buzz)
- [zai-org/ZCode](https://github.com/zai-org/ZCode)
- [mobile-next/mobile-mcp](https://github.com/mobile-next/mobile-mcp)
- [Pydantic AI v2.51.0 — Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.51.0)
- [Claude Code v2.1.283 — Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.283)
