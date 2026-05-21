---
title: "Antigravity CLI：Google 用一套 agent harness 收編 Gemini CLI 的終端機介面"
date: 2026-05-21
type: deep-dive
category: tech
tags: [antigravity-cli, google, cli, coding-agent, ai-tools, gemini-cli]
lang: zh-TW
tldr: "Antigravity CLI 是 Google 在 2026/5/19 I/O 發表的終端機 agent，用 Go 重寫（Gemini CLI 是 Node），二進位檔叫 agy，與桌面版 Antigravity 2.0 共用同一套 agent harness。它同時是 Gemini CLI 的接班人——個人方案的 Gemini CLI 將於 2026/6/18 停止服務。"
description: "Antigravity CLI 的定位、安裝與 SSH 認證、非同步 subagents、slash 指令、與 Gemini CLI 的遷移關係（6/18 sunset）與企業 carveout，以及與 Antigravity 2.0 / 競品的差異。"
draft: false
---

Antigravity CLI 是 Google 在 2026 年 5 月 19 日 I/O 上發表的終端機 AI agent。重點不是「又一個 coding CLI」，而是它背後的策略：Google 把原本獨立的 Gemini CLI 收進 Antigravity 這個「四介面平台」，讓終端機、桌面 app、SDK、IDE 全部跑在**同一套 agent harness** 上。這篇講清楚它是什麼、怎麼裝、和 Gemini CLI 的遷移關係，以及該不該現在就換過去。

## Antigravity CLI 是什麼

依官方文件的定位，Antigravity CLI 是「the lightweight Terminal User Interface (TUI) surface of Antigravity」，把和桌面版 Antigravity 2.0 相同的核心能力——多步推理、多檔編輯、工具呼叫、對話歷史——直接帶進終端機。它刻意「不當 GUI」：視覺化編排留給 2.0，CLI 只專注在快、鍵盤操作、低資源開銷，特別是 SSH / remote 工作流。

理解它的關鍵是「四介面」這張圖。2026/5/19 之前，「Antigravity」指的是一個 IDE；之後它變成一個平台，底下四個 surface 共用同一個 agent 引擎：

```
                  ┌─────────────────────────────┐
                  │   共用 Agent Harness（核心）   │
                  │  推理迴圈 / 工具路由 / 權限模型  │
                  └──────────────┬──────────────┘
        ┌──────────────┬─────────┴────────┬──────────────┐
        │              │                  │              │
   Antigravity 2.0  Antigravity CLI   Antigravity SDK  Antigravity IDE
   桌面 GUI         終端機 TUI（agy）   程式化嵌入        原始 IDE
   視覺化編排        速度 / SSH 優先     自建 agent        （逐步淡出）
```

這個設計是整個產品的核心取捨。官方 CLI 發表文寫得很直接：「A primary goal for the Antigravity CLI was the consolidation of a single agent harness across Google-built developer surfaces for more rapid future improvements.」白話說就是：harness 改一次，四個 surface 同一天都拿到，不用各自 backport。設定與權限在 CLI 和 2.0 之間**雙向同步**——你在 2.0 設過的 agent 權限，在 CLI 也生效，反之亦然；CLI 開的對話可以從 2.0 的 `@conversation` 下拉拉出來接著用。

## 為什麼是「收編」而不是「升級」

Gemini CLI 不是小專案。官方在轉換公告裡點名它的規模：「over 100,000 GitHub stars, 6,000 merged pull requests, and hundreds of contributors」。但 Google 的判斷是，使用者的需求已經從「單一 agent 在終端機跑」變成「多個 agent 彼此溝通、分工解題」，而那需要終端工具和其他 surface 共用同一個後端。

所以 Antigravity CLI 是一個**平行的新產品**，不是 Gemini CLI 的版本更新。兩個最具體的差異：

- **語言換了**：Antigravity CLI 用 Go 寫，Gemini CLI 是 Node。官方說法是「Built in Go, Antigravity CLI is snappier and more responsive.」——啟動更快、記憶體更省。
- **二進位檔名換了**：裝完之後指令是 `agy`，不是 `antigravity`，寫腳本時要特別注意。

對個人方案使用者，這是有時限的遷移。官方公告寫明：**2026 年 6 月 18 日起**，Gemini CLI 與 Gemini Code Assist IDE 擴充將停止為 Google AI Pro、Ultra，以及免費的 Gemini Code Assist for individuals 服務請求。換句話說，如果你是用個人 Google 帳號跑 Gemini CLI，從發表日算起大約只有 30 天的緩衝。

但有一個明確的 **企業 carveout**：如果你的組織用的是 Gemini Code Assist Standard / Enterprise 授權，或透過付費 Gemini API key，存取「remains unchanged」——Gemini CLI 會繼續維護、繼續更新模型。所以這次 sunset 打到的是消費級個人，不是企業。

## 安裝與認證（含 SSH）

官方 Getting Started 給三條一行安裝指令，都是從 `antigravity.google/cli/install.*` 拉腳本：

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex

# Windows CMD
curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd
```

裝完用 `agy` 啟動。`curl | bash` 雖然來自 Google 官方網域，在共用機器上仍建議當成信任步驟，先下載再看過再跑。

認證設計把 remote 當一等公民。CLI 會先試著用作業系統的安全 keyring 靜默登入；找不到 session 就退回瀏覽器 Google Sign-In：

- **本機**：自動開預設瀏覽器完成 Google 登入，憑證存進系統 keyring。
- **SSH session**：CLI 會偵測到你在 SSH 裡，改成印出一段授權 URL；你在本地瀏覽器開、完成 OAuth，再把授權碼貼回 CLI。這在早期 Gemini CLI 是個痛點，現在被當成內建情境處理。
- **登出**：`/logout` 清掉快取憑證。

設定檔是純 JSON，放在 `~/.gemini/antigravity-cli/settings.json`；在 CLI 裡打 `/config` 或 `/settings` 會開一個全螢幕設定面板。

## 核心功能：非同步 subagents、sandbox、slash 指令

**非同步 subagents** 是這支 CLI 主打的賣點。主 agent 可以把背景研究、跑 build、驗證修正等工作丟給獨立的 subagent 平行跑，不卡住你正在打字的主對話。打 `/agents` 開面板看哪些 subagent 在跑、卡在哪一步；當 subagent 需要權限時，會在 prompt 上方跳 Fast Path Alert，按 `ctrl+k` 就能即時批准，不用切換畫面。

**Terminal Sandbox** 是輕量的安全隔離。它不開虛擬機或容器，而是用作業系統原生機制——Linux 的 `nsjail`、macOS 的 `sandbox-exec`、Windows 的 `AppContainer`——以接近零的啟動開銷限制 agent 在本地執行 shell 指令時的破壞範圍。預設關閉，在 `settings.json` 設 `"enableTerminalSandbox": true` 開啟。

**slash 指令** 是主要操作面，列幾個常用的：

| 指令 | 用途 |
|---|---|
| `/model` | 選預設推理模型（跨 session 保留） |
| `/permissions` | 切 agent 自主程度（`request-review` / `always-proceed` / `strict`） |
| `/tasks` | 監看、查 log、終止背景任務 |
| `/agents` | 開 subagent 面板 |
| `/mcp` | 設定 MCP server |
| `/skills` | 瀏覽 local / global 的 agent skill |
| `/resume`、`/rewind`、`/fork` | 接續、回溯、分岔對話 |

權限也能在 `settings.json` 做細粒度設定，例如 `allow` 放 `command(git)`、`deny` 放 `command(rm -rf)`。

## 從 Gemini CLI 遷移過來

第一次啟動會跳遷移提示，把 Gemini CLI 的擴充自動轉成 Antigravity 的 plugin。沒跳或裝在別台機器，可手動跑：

```bash
agy plugin import gemini
```

幾個會踩到的點：

- **extensions 改叫 plugins**：官方說法是「the industry has standardized on the term」。
- **commands 併進 skills**：舊的 commands 概念折進更廣的 skills primitive。
- **MCP 設定檔位置變了**：Antigravity 把 MCP server 設定獨立成 `mcp_config.json`，不再內嵌在 `settings.json`；且 remote MCP server 的欄位從 `url` 改成 `serverUrl`，直接複製舊設定會在 remote server 上**靜默失效**。
- **custom theme 不遷移**、**沒有 `skills` 終端管理指令**（只能手寫 skill 檔或 `npx skills install`）。

官方也老實講不會一步到位：「there won't be 1:1 feature parity right out of the gate」，但保證保留最關鍵的 Agent Skills、Hooks、Subagents、Extensions（plugins）。

## 跟 Antigravity 2.0 與競品的定位差異

跟自家 **Antigravity 2.0** 是「同引擎、不同人體工學」：CLI 為速度、鍵盤效率、低開銷而生，適合 SSH / remote / tmux；2.0 為完整度、視覺化編排、artifact 預覽、視覺 diff review、語音輸入而生。要平行用，CLI 開的對話可匯出進 2.0。

跟 **Claude Code、Codex CLI、Gemini CLI** 這些終端 agent 比，Antigravity CLI 的差異化不在「能不能讀寫檔案、跑指令」（這些大家都有），而在於它是一個大平台的其中一個 surface：和桌面 app 共用 harness、設定雙向同步、原生非同步 subagents、把 SSH 當設計目標。如果你想橫向比這幾支的安裝與定價細節，本站另有 [Gemini CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)、[Codex CLI](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)、[Claude Code](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent) 的完整介紹可對照。

模型方面，CLI 跑的是和 Gemini 模型「co-optimized」的共用 harness，預設推理模型可用 `/model` 切換，底層是 Gemini 3 系列的特化配置；官方 CLI 文件並未把可選模型逐一列出。

## 限制與已知問題

- **非 1:1 功能對等**：依賴某個 Gemini CLI 週邊指令的人，遷移前先確認它有沒有移植。
- **安全責任在你**：官方 repo 的 README 附了一段警告：「AI coding agents are known to have certain security risks, including autonomous code execution, data exfiltration, prompt injection, and supply chain risks. Ensure that you monitor and verify all actions taken by the agent.」消費級預設會收集互動資料，可在設定關閉。
- **早期穩定性**：發表初期社群對 Antigravity 整體（含 IDE）回報過配額鎖、崩潰等問題，新發表的 CLI 也還在早期，正式採用前值得先小範圍試。

## 整體來說

Antigravity CLI 的核心取捨很清楚：用「四介面共用一套 harness」換取速度與一致性，代價是你被綁進 Antigravity 這個平台，而不是一個獨立、Apache 授權的開源 CLI（這點和 Gemini CLI 不同）。

該不該換？判斷很乾脆：

- **現在就換**：你用個人 Google 帳號（AI Pro / Ultra / 免費 Code Assist）跑 Gemini CLI——6/18 的死線是真的；你活在 tmux / remote server；你想要背景 subagent 不卡 shell。
- **先別急**：你是 Code Assist Standard / Enterprise 授權或付費 API key（Gemini CLI 繼續活）；你的工作流靠 artifact 預覽、視覺 diff、語音（那是 2.0）；你依賴某個還沒移植的 Gemini CLI 功能。

最划算的驗證方式：在你最常用 Gemini CLI 的那台機器上裝 `agy`、跑一次 `agy plugin import gemini`、挑一個平常會做的 20 分鐘任務試一遍。一個 session 內你就知道遷移順不順。

## 參考資料

- [Introducing Google Antigravity CLI（官方發表文）](https://antigravity.google/blog/introducing-google-antigravity-cli)
- [Antigravity CLI Overview（官方文件）](https://antigravity.google/docs/cli-overview)
- [Getting Started with Antigravity CLI（安裝 / 認證）](https://antigravity.google/docs/cli-getting-started)
- [Antigravity CLI Features（plugins / sandbox / subagents / slash 指令）](https://antigravity.google/docs/cli-features)
- [Using AGY CLI（設定 / 快捷鍵）](https://antigravity.google/docs/cli-using)
- [An important update: Transitioning Gemini CLI to Antigravity CLI（Google Developers Blog）](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Google Antigravity Documentation（四介面總覽）](https://antigravity.google/docs/home)
- [google-antigravity/antigravity-cli（公開 repo / 社群論壇）](https://github.com/google-antigravity/antigravity-cli)
- [Gemini CLI：Google 開源終端機 AI Agent 完整介紹（站內）](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent)
- [Codex CLI：OpenAI 開源終端機 Coding Agent 完整介紹（站內）](/posts/tech/2026-03-31-codex-cli-openai-coding-agent)
- [Claude Code：Anthropic 終端機 AI Coding Agent 完整介紹（站內）](/posts/tech/2026-03-31-claude-code-overview-anthropic-coding-agent)
