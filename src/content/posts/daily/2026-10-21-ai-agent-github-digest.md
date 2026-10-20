---
title: "AI Agent GitHub Digest — 2026-10-21"
date: 2026-10-21
category: daily
tags: [ai-agent, github, open-source, daily, agent-governance, coding-agent, mcp-server]
lang: zh-TW
description: "Moonshot 自己做 coding CLI 下場開戰，multi-agent 框架開始把治理當第一等公民，MCP server 也學會闖 Cloudflare 的驗證關卡"
tldr: "**MoonshotAI/kimi-code**（7.9k★）是 Moonshot AI 自己做的終端機 coding agent，單一執行檔安裝、原生支援影片輸入和 Agent Client Protocol；**open-multi-agent/open-multi-agent**（7.0k★）是把『治理』放在第一位的 self-hosted multi-agent runtime，沒有遙測、沒有雲端控制平面，`runTeam()` 的執行紀錄可以離線驗證；**vibheksoni/stealth-browser-mcp**（3.2k★）讓 agent 透過真實 Chrome + CDP（不是 Playwright）闖過 Cloudflare 的 JS 挑戰頁，走的是跟一般瀏覽器 MCP 完全不同的路線。Release：pydantic-ai v2.58.0 修了兩個安全漏洞——provider-native MCP 設定可能把 server URL 和授權 token 洩漏進 OpenTelemetry trace，Vercel AI／AG-UI adapter 在特定設定下可能讓 client 端未經模型 request 就直接執行工具。"
series:
  name: "AI Agent GitHub Digest"
  order: 67
---

> 🌏 [English version](/posts/daily/2026-10-21-ai-agent-github-digest-en)

## 今日亮點

今天三個上榜的 repo 看得出 agent 生態在往兩個方向同時拉：一邊是大廠親自下場搶 coding CLI 這塊地（Moonshot 的 Kimi Code）、multi-agent 框架開始把「治理」當第一等公民而不是事後補的功能（open-multi-agent）；另一邊則是把「繞過防護」包裝成標準化的 MCP server（stealth-browser-mcp）——agent 能做的事持續往兩端擴張：更會寫程式，也更會闖關。

## Trending Repos

### MoonshotAI/kimi-code ⭐ 7,900

[GitHub](https://github.com/MoonshotAI/kimi-code)　·　TypeScript　·　MIT

- **是什麼**：Moonshot AI（Kimi）自己做的終端機 coding agent，能讀寫程式碼、跑 shell 指令、搜尋檔案、抓網頁，單一執行檔安裝不需要 Node.js。
- **為什麼值得看**：跟 Claude Code／Codex／Cursor 正面競爭的中國大廠親自下場產品，差異化賣點是影片輸入——丟一段螢幕錄影或示範片段讓 agent 直接看懂你要什麼，官方舉例可以把一段參考片轉成 LUT、把長片剪成短片、把螢幕錄影變成可執行的程式碼；另外原生支援 Agent Client Protocol（ACP），`kimi acp` 可以直接插進 Zed、JetBrains 當底層 agent，也有對話式的 MCP 設定（`/mcp-config`）不用手改 JSON。
- **Tech stack**：TypeScript 核心 + pi-tui（終端機 UI 框架）+ Agent Client Protocol + MCP
- **上手難度**：低——官方一行安裝腳本（`curl ... | bash`），不需要先裝 Node.js，登入後可用 Kimi Code OAuth 或自己的 API key。

---

### open-multi-agent/open-multi-agent ⭐ 7,000

[GitHub](https://github.com/open-multi-agent/open-multi-agent)　·　TypeScript　·　MIT

- **是什麼**：自架的 multi-agent runtime，可以在規劃、派工、呼叫工具前插入人類審核關卡，並把每次執行留下可事後離線檢查的紀錄。
- **為什麼值得看**：跟其他 multi-agent orchestrator（像前幾天介紹過的桌面版 orca、企業版 Paperclip）不同的地方，是它把「治理」放在產品第一位——沒有遙測、沒有雲端控制平面，官方README直接寫「不做任何分析、授權、更新或回報請求」；`verifyRun()` 能離線檢查整段執行紀錄的內容一致性（但官方也坦承這不等於證明紀錄沒被改過）；還有一個「治理底線」機制可以宣告哪些角色、哪種順序是必要的，跑完後單獨檢查有沒有達標。也能把 Claude Code、Gemini CLI、Codex 等外部 agent 掛進同一張任務圖一起跑。
- **Tech stack**：TypeScript + Node.js 20+ + 內建多家模型 adapter（Anthropic／OpenAI／Azure／Bedrock／Gemini／Grok／DeepSeek 等）+ 可選 OpenTelemetry
- **上手難度**：低——`npm create oma-app@latest` 一行命令跑本地 demo，不需要 API key；真正接上審核流程和治理規則則要花時間讀文件。

---

### vibheksoni/stealth-browser-mcp ⭐ 3,200

[GitHub](https://github.com/vibheksoni/stealth-browser-mcp)　·　Python　·　MIT

- **是什麼**：一個 MCP server，讓 Claude Code／Cursor／Claude Desktop 操控真正的 Chrome／Chromium／Edge（透過 nodriver + Chrome DevTools Protocol），用來闖過 Cloudflare 的 JS 挑戰頁和一般的登入牆。
- **為什麼值得看**：跟常見的 Playwright MCP 走的是完全不同路線——它完全不碰 WebDriver，瀏覽器的 TLS／HTTP2 handshake、`navigator.webdriver`、GPU 渲染等指紋都來自真正的 Chrome binary，闖 Cloudflare 非互動式 JS 挑戰的通過率因此比一般自動化高；98 個工具涵蓋網路攔截改寫、DOM 元素像素級複製、動態 hook 改寫請求。但專案自己也列清楚極限：IP 信譽、互動式驗證碼（Turnstile／圖形題）都解不了，GPU-less 的 Linux 環境還是會漏出 SwiftShader 軟體渲染的指紋。
- **Tech stack**：Python 3.10+ + nodriver（CDP）+ FastMCP
- **上手難度**：中——要自己 `git clone` + 建 venv + `pip install`，不是一行 `npx`；要接代理驗證、裁剪 98 個工具到用得到的子集都得照文件一步步設定。

## Notable Releases

### pydantic-ai v2.58.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.58.0)

- **重要變更**：修了兩個安全漏洞——[GHSA-xv4x-g8mx-ch56](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-xv4x-g8mx-ch56) 是 provider-native MCP 設定即使開了 `include_content=False`，仍可能把 server URL、授權 token、自訂 header 值洩漏進 OpenTelemetry request trace；[GHSA-5pfm-2g3g-gh85](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5pfm-2g3g-gh85) 是在非空 `message_history` 搭配預設的 `manage_system_prompt='server'` 時，Vercel AI／AG-UI adapter 可能讓 client 端自訂參數直接執行工具，完全不經過模型 request（需要人工核准的工具不受影響）。功能面新增 `timeout=` 可以框住整輪 agent 執行時間、`DelegationTasks.steer` 可以中途引導已委派出去的任務、新增 ElevenLabs Agents 即時語音模型支援。
- **Breaking Changes**：官方標成「Compatibility Notes」而非 breaking changes，但確實會改變既有行為——包含 `RunUsage`／`UsageLimits` 現在只計算「產生那個結果的那一輪」的用量、`RealtimeConnection` 的生命週期事件改走新的 `pydantic_ai.realtime.lifecycle` 模組、`read_file` 現在會回傳圖片和 PDF 而不只是檔案描述。
- **對你的影響**：如果你用了 provider-native MCP 或 Vercel AI／AG-UI adapter，建議立刻升級到 v2.58.0（或 v1.107.8），並檢查、輪替可能已經洩漏進 trace 系統的憑證；其他使用者也該對照 release notes 裡列的相容性變更，確認既有程式碼的行為沒有被悄悄改掉。

## 今日收穫

原本以為 multi-agent 框架的賣點都在比「做得更多」，但 open-multi-agent 的 `verifyRun()` 提醒我：「做得到」跟「做得到還留得下證據」是兩件事——沒有審計紀錄的自動化，出事了也查不出是哪個 agent、在哪一步做的，這可能才是多 agent 系統真正要先解決的問題，而不是再疊一層聰明的規劃邏輯。

## 參考資料

- [MoonshotAI/kimi-code — GitHub](https://github.com/MoonshotAI/kimi-code)
- [open-multi-agent/open-multi-agent — GitHub](https://github.com/open-multi-agent/open-multi-agent)
- [vibheksoni/stealth-browser-mcp — GitHub](https://github.com/vibheksoni/stealth-browser-mcp)
- [Stealth Browser MCP：get your AI agent past Cloudflare — Roundproxies](https://roundproxies.com/blog/stealth-browser-mcp/)
- [pydantic-ai v2.58.0 Release Notes — GitHub](https://github.com/pydantic/pydantic-ai/releases/tag/v2.58.0)
- [GHSA-xv4x-g8mx-ch56 — MCP request telemetry security advisory](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-xv4x-g8mx-ch56)
- [GHSA-5pfm-2g3g-gh85 — UI adapter history security advisory](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-5pfm-2g3g-gh85)
