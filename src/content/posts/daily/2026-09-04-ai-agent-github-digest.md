---
title: "AI Agent GitHub Digest — 2026-09-04"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, github, open-source, daily, agent-security, multi-agent, mcp-server, spec-driven-development]
lang: zh-TW
description: "多開 agent 艦隊、規格先行、AI 自動滲透測試同一天衝上熱門——工具鏈開始用協定和流程接住『讓 agent 自主做更多事』的風險"
tldr: "github/spec-kit 滿一年衝上 1.0.0，維護者特別強調穩定性讓位給適應力；stablyai/orca 讓你在各自 git worktree 同時跑一整支 coding agent 艦隊，單日狂漲 812 星；KeygraphHQ/shannon 3.0 上線，AI agent 自動滲透測試直接出 SARIF 報告接 CI/CD。瀏覽器端 ChromeDevTools/chrome-devtools-mcp 把官方 MCP server 開給任何 agent 操作 Chrome。框架端 Pydantic AI v2.38.0 改了一次性 capability 的合併規則（breaking），Claude Code v2.1.259 修掉多 session 互蓋設定的老問題。"
series:
  name: "AI Agent GitHub Digest"
  order: 20
---

> 🌏 [English version](/en/posts/daily/2026-09-04-ai-agent-github-digest-en)

## 今日亮點

今天上榜的專案剛好都在幫「讓 agent 自己做更多事」補上結構——Spec Kit 用規格文件約束 agent 動手前先想清楚，Orca 讓一整支 agent 艦隊在各自 worktree 裡平行工作，Shannon 把滲透測試整套自動化到能出報告，chrome-devtools-mcp 則用官方協定把瀏覽器操作開放給任何 agent。共同點是：與其自己兜一套整合，不如用協定、規格、隔離環境把權限和邊界寫清楚。

## Trending Repos

### github/spec-kit ⭐ 133,294 (+224)

[GitHub](https://github.com/github/spec-kit)　·　Python　·　MIT

- **是什麼**：GitHub 官方出的「先寫規格再讓 agent 動手」工具包，強制團隊在動代碼前把要做什麼講清楚。
- **為什麼值得看**：滿一年重新編號到 1.0.0，維護者在公告裡特別澄清這不代表功能凍結或形狀已定——因為 agent 讓「改規格」的成本大幅下降，適應力比穩定性更值錢。適合已經在用多個 AI coding agent、卻苦於規格散落在各種 prompt 裡的團隊。
- **Tech Stack**：Python CLI + 可替換的 spec 流程樣板，相容任何 AI coding agent
- **上手難度**：低——CLI 裝好就能在既有專案套用預設流程，或帶入自訂樣板。

---

### stablyai/orca ⭐ 60,787 (+812)

[GitHub](https://github.com/stablyai/orca)　·　TypeScript　·　MIT

- **是什麼**：一個「艦隊指揮室」，讓你在各自獨立的 git worktree 裡同時跑 Claude Code、Codex、OpenCode、Pi 等多個 coding agent，統一在一個介面追蹤進度。
- **為什麼值得看**：用自己既有的訂閱跑每個 agent，不額外收 token 費，desktop / mobile / VPS 都能操作同一支艦隊；今天單日漲了 812 星，是這批候選裡漲最快的，反映「同時盯著好幾個 agent 平行做事」正在取代「盯一個 agent 慢慢做」。
- **Tech Stack**：TypeScript + git worktree 隔離 + 跨平台（macOS / Windows / Linux）用戶端
- **上手難度**：中——桌面 app 好裝，但要接好幾個 agent CLI 各自的認證與訂閱。

---

### KeygraphHQ/shannon ⭐ 47,684 (+117)

[GitHub](https://github.com/KeygraphHQ/shannon)　·　TypeScript　·　AGPL-3.0

- **是什麼**：一個自主 AI 滲透測試 agent，讀你的原始碼、規劃攻擊路徑，然後實際執行 exploit 來證明漏洞存在——「沒打穿就不出報告」。
- **為什麼值得看**：今天剛推出 3.0，加深了程式碼安全分析、重寫 CLI、原生接 CI/CD，能輸出專業 PDF 報告和 SARIF 格式方便餵進既有資安工具鏈；作者明確定位它不是取代人類滲透測試員，而是把「先自動跑一輪」做到能落地生產環境的品質。
- **Tech Stack**：TypeScript + LLM agent 迴圈 + SARIF / PDF 報告輸出
- **上手難度**：中——`npx @keygraph/shannon@latest` 就能起步，但要串 CI/CD 或用完整功能得看付費版差異。

---

### ChromeDevTools/chrome-devtools-mcp ⭐ 50,823 (+148)

[GitHub](https://github.com/ChromeDevTools/chrome-devtools-mcp)　·　TypeScript　·　Apache-2.0

- **是什麼**：Chrome 官方團隊做的 MCP server，把 DevTools 的能力（截圖、DOM 檢查、network 追蹤、效能分析）直接開放給任何支援 MCP 的 coding agent。
- **為什麼值得看**：跟一堆第三方瀏覽器自動化工具不同，這是瀏覽器廠商自己出的協定實作，穩定性和跟 Chrome 版本同步的保證更高；今天單日漲了 148 星，跟 Orca、Shannon 一起佐證「用標準協定把能力開放給 agent」比「自己寫一套整合」更受歡迎。
- **Tech Stack**：MCP SDK + Chrome DevTools Protocol（CDP）+ Puppeteer
- **上手難度**：低——裝一個 MCP server 設定檔，Claude Code / Cursor 等 agent 就能直接操作瀏覽器。

## Notable Releases

### Pydantic AI v2.38.0

[Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.38.0)

- **重要變更**：`ModelProfile` 新增 `context_window`、`RunContext` 新增 `context_window_used`；應用程式碼和 capability 現在能送出型別化的 `CustomEvent` / `CapabilityEvent` 並用 `@on_event` 訂閱；新增 Claude Fable 5.1、Claude Mythos 5.1 支援；新增 `VLLMProvider` 直接接自架 vLLM server。
- **Breaking Changes**：沒指定 `id` 的「一次性」capability（工具／能力）現在會自動拿到一個預設 `id`，重複註冊時套用預設 `combine` 規則——如果你的程式依賴舊版「同名 capability 各自獨立、不合併」的行為，升級後合併邏輯會改變。
- **對你的影響**：大量註冊一次性 capability 的話，升級前先檢查有沒有依賴不合併的舊行為；想追蹤 context window 使用量、接 Claude Fable / Mythos，或串自架 vLLM，這版可以直接用。

### Claude Code v2.1.259

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.259)

- **重要變更**：新增 `managedMcpServers` 讓組織統一發 HTTP/SSE MCP server 給所有使用者；新增 `--permission-prompts none` 給無人值守的 headless 環境，會自動擋掉所有原本要跳出的權限提示；修掉多個 session 同時開時互相蓋掉彼此 `~/.claude.json` 設定的問題；managed settings 檔案壞掉時現在會直接拒絕啟動並指出是哪個來源壞的，而不是悄悄不生效。
- **Breaking Changes**：無。
- **對你的影響**：多開 session 或在 CI／無人值守環境跑 Claude Code 的話，這版修了不少踩雷點，尤其是並行 session 設定互蓋、managed settings 靜默失效這兩項，值得優先升級。

## 今日收穫

之前以為「多開幾個 agent worktree 平行跑」只是個人效率優化，但 Orca 單日漲 812 星、加上 Spec Kit 特別強調 1.0.0 不等於功能凍結，讓我意識到現在的預設假設已經變成「規格和上下文本來就會一直變」——工具鏈要做的不是凍結一個穩定版本，而是讓變動的成本變低，讓多支 agent 平行改動也能保持可控。

## 參考資料

- [github/spec-kit](https://github.com/github/spec-kit)
- [Spec Kit Turns One — and Ships 1.0.0](https://www.manorrock.com/blog/2026/08/21/spec_kit_turns_one.html)
- [stablyai/orca](https://github.com/stablyai/orca)
- [KeygraphHQ/shannon](https://github.com/KeygraphHQ/shannon)
- [Shannon 3.0 discussion](https://github.com/KeygraphHQ/shannon/discussions/439)
- [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Pydantic AI v2.38.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.38.0)
- [Claude Code v2.1.259 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.259)
- [GitHub Trending（daily）](https://github.com/trending?since=daily)
