---
title: "工具推薦｜cc-readback — 讓 Claude Desktop 讀懂你的 Claude Code 工作記錄"
date: 2026-09-06
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "本地唯讀 MCP server，讓 Claude Desktop 直接讀取、搜尋、摘要你的 Claude Code session 歷史，內建常見憑證遮蔽與稽核紀錄"
tldr: "cc-readback 是一個跑在本機的唯讀 MCP server，讓 Claude Desktop 能直接讀取、搜尋、摘要你存在 ~/.claude 底下的 Claude Code session 歷史，並自動遮蔽 AWS/GitHub/OpenAI 等常見憑證。安裝：`npm install -g cc-readback && cc-readback install all`。解決了『想請 Claude Desktop 幫忙回顧昨天 Claude Code 做了什麼、卡在哪，卻只能自己翻 terminal scrollback』的問題。"
series:
  name: "AI Tool of the Day"
  order: 22
---

> 🌏 [English version](/en/posts/daily/2026-09-06-tool-cc-readback-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | cc-readback |
| 類型 | 本地 MCP server |
| GitHub | [affirmitv/cc-readback](https://github.com/affirmitv/cc-readback) |
| Stars | 17 |
| 語言 | TypeScript |
| 授權 | MIT |
| 安裝 | `npm install -g cc-readback && cc-readback install all` |

## 解決什麼問題

你是否曾經在 Claude Desktop 裡想問「我昨天用 Claude Code 到底做了什麼、卡在哪個決定上」，結果只能自己翻 terminal scrollback，或一個資料夾一個資料夾找 session 記錄？Claude Code 每次對話都存在本機 `~/.claude` 底下，但那些紀錄只活在終端機裡——換到 Claude Desktop 問問題，前一天的脈絡等於要重新打字說明一遍。

cc-readback 是一個跑在本機的唯讀 MCP server，直接讀 `~/.claude` 底下的 session 檔案，讓 Claude Desktop 能回答「這個專案有哪些 session」「某個 session 做了什麼、動了哪些檔案」「上禮拜哪次對話討論過 X」這類問題，並把答案摘要成 briefing、timeline、搜尋結果。它刻意限縮能讀的紀錄類型——工具執行結果本文、thinking block、貼上內容、附件一律不解析，只處理 prompt、決策、檔案異動這類「摘要級」資訊，並在回傳前用內建 pattern 對 AWS、GitHub、OpenAI、Anthropic、Slack、Stripe、Supabase、GCP、JWT、私鑰等憑證做遮蔽。

適合場景：每天開多個 Claude Code session 跑不同專案，想在 Claude Desktop 快速拿到「今天做了什麼、哪些還卡著」的總覽；需要回頭找「上次改這個檔案是哪次對話」；或想要一個唯讀、有稽核紀錄、可隨時關掉的方式，讓另一個 client 看到 Claude Code 的工作記憶，而不是把整段 session 內容貼進新對話。

## 快速上手

### 安裝

```bash
# 方法一：npm 全域安裝（推薦）
npm install -g cc-readback
cc-readback install all

# 方法二：從原始碼建置
git clone https://github.com/affirmitv/cc-readback
cd cc-readback
npm install && npm run build
node dist/cli.js install all

# 方法三：Claude Desktop 一鍵安裝
# 到 GitHub Releases 下載 .mcpb，用 Claude Desktop → Settings → Extensions 開啟

# 安裝完成後記得完全關閉並重開 Claude Desktop（Cmd-Q 再打開）
```

### 基本用法

Agent 端會拿到的工具（節選）：

```text
briefing             → 我的 session 這段時間做了什麼？哪些還卡著沒處理？
list_projects        → 哪些專案有 Claude Code 紀錄？
list_sessions        → 列出某專案下的 session（標題、分支）
get_session_digest    → 摘要一個 session：prompt、回答、動過的檔案、決策
get_session_timeline  → 逐輪重播一個 session
search_sessions       → 什麼時候改過 X？在哪次對話討論過 Y？
get_recent_prompts    → 我最近都在問 Claude Code 什麼？
get_file_changes      → 哪些 session 動過這個檔案？
get_memory            → 這個專案的自動記憶寫了什麼？
get_status            → 索引健康度、已遮蔽的憑證數量、目前分享出去的範圍
```

在 Claude Desktop 直接問：

```text
我今天的 Claude Code session 做了什麼？有沒有還卡著沒處理的？
```

### 進階用法

```bash
# 暫停/恢復讀取（不解除安裝）
cc-readback off
cc-readback on

# 完全移除
cc-readback uninstall all
```

## 與現有工具的比較

| | cc-readback | 手動翻 terminal scrollback | 把 session 內容整段貼進新對話 | Claude Code 內建 --resume |
|---|---|---|---|---|
| 不用離開 Claude Desktop 就能查歷史 | ✅ | ❌ | 部分（要先手動複製） | ❌ |
| 自動遮蔽常見憑證 | ✅ | — | ❌ | — |
| 唯讀，無法寫入/刪除/執行 shell | ✅ | — | — | ❌（resume 會繼續執行） |
| 可隨時關閉且有稽核紀錄 | ✅ | — | — | — |
| 支援跨 session 關鍵字搜尋 | ✅ | ❌ | ❌ | ❌ |

## 注意事項

- **讀不到原始輸出**：拿不到 raw 指令輸出、build log，也讀不到 subagent 的 transcript——這些內容一律不解析，只給摘要級資訊。
- **有時間窗限制**：只能查到 Claude Code `cleanupPeriodDays` 設定內的 session（預設 30 天），更久之前的紀錄本來就被 Claude Code 自己清掉了。
- **信任的是本機檔案系統**：完全唯讀、不連網，但這代表它信任 `~/.claude` 目錄既有的存取權限——如果這個目錄本身已經被其他惡意程式讀寫過，遮蔽機制也救不回來。
- **專案剛發佈不久**：17 stars，介面與 MCP 工具介面之後可能還會調整。

## 今日收穫

一般解法是「要用其他 client 讀 Claude Code 記錄」就整段複製貼上，結果連 tool result、附件、貼上內容一起搬過去，什麼都攤在新對話的 context 裡。cc-readback 反過來先做一層轉譯——從「這台機器上到底發生了什麼」摘要成「可以安全分享的決策與檔案異動」，讀取範圍、可解析的紀錄類型、憑證遮蔽全部收在同一層做完。比起單純「共享整個 session」，這更接近「只共享我想讓你知道的部分」。

## 參考資料

- [cc-readback GitHub repo](https://github.com/affirmitv/cc-readback)：README、安裝方式、MCP 工具清單、安全模型、授權（MIT）、stars 均出自官方 repo 與 GitHub API。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
