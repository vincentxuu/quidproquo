---
title: "工具推薦｜claude-scope — 搜尋你的 Claude Code 對話歷史，結果保證不過期"
date: 2026-08-21
category: daily
tags: [ai-agent, tool, daily, cli-tool]
lang: zh-TW
description: "一個 Claude Code 原生外掛，把 session 記錄索引成 SQLite FTS5，每次搜尋前先做增量同步，保證連正在進行的對話都搜得到"
tldr: "claude-scope 是一個 Claude Code 外掛，用 SQLite FTS5 全文搜尋你的 session 歷史。安裝：claude plugin marketplace add waazy-w/claude-scope。解決了『索引式工具結果過期、grep 式工具每次重掃幾百 MB』的兩難——它用 byte offset 增量同步，每次搜尋只讀新增的位元組，連一分鐘前打的字都搜得到。"
series:
  name: "AI Tool of the Day"
  order: 6
---

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | claude-scope |
| 類型 | Claude Code 外掛 / CLI（本機全文搜尋） |
| GitHub | [waazy-w/claude-scope](https://github.com/waazy-w/claude-scope) |
| Stars | 3（2026-08-20 新建） |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `claude plugin marketplace add waazy-w/claude-scope` |

## 解決什麼問題

你有沒有過這種經驗：兩週前跟 Claude Code 討論過某個 bug 的解法，現在同樣的問題又出現，卻怎麼也想不起來當時是在哪個專案、哪個 session 講的。Claude Code 的對話記錄躺在 `~/.claude/projects/` 底下一堆 `.jsonl` 檔裡，翻起來很痛苦。

現有的搜尋方案有兩種，各有毛病。**索引式工具**先掃一次建索引、之後查得很快，但索引跟不上——你剛剛打的字要等下次重建索引才搜得到。**grep 式工具**永遠是最新的，但每次查詢都要重掃整個歷史（累積起來輕鬆上百 MB），慢。claude-scope 兩個都不做：它替每個 log 檔記一個 byte offset，**每次搜尋前先跑一次增量同步**，只讀上次之後新增的那幾個位元組——通常是毫秒級的工作。結果是你一分鐘前在**當前還在跑的 session** 裡打的字，馬上就搜得到。

它把「新鮮度」做成一份明確的契約：每組搜尋結果開頭都會標 `[index fresh]` 或 `[index refreshed: +N messages]`，同步一旦失敗就印出大寫 WARNING 告訴你結果差多舊——不會有靜默的過期。適合場景：想找回舊解法、翻某個決策當時的討論、或用 `claude --resume` 直接跳回那個 session 繼續。

## 快速上手

### 安裝

```bash
# 從 GitHub 安裝（這個 repo 同時當作 plugin marketplace）
claude plugin marketplace add waazy-w/claude-scope
claude plugin install claude-scope@claude-scope
```

需求：Python 3.9+（macOS/Linux 內建的 `python3` 就行），且 stdlib 的 `sqlite3` 有編進 FTS5——幾乎所有環境都符合。沒有其他依賴，不裝 Node、不跑 daemon、不連網。

### 基本用法

在 Claude Code 裡直接用 slash command：

```bash
/claude-scope:scope database migration                 # 裸字 = 搜尋
/claude-scope:scope search "fts5 tokenizer" --current  # 只搜當前專案（cwd）
/claude-scope:scope search "error" --role user         # 只搜你自己說的話
/claude-scope:scope search "auth" --since 2026-07-01 --until 2026-08-01
/claude-scope:scope sessions --project myapp           # 列出近期 session 標題
/claude-scope:scope stats                              # 索引統計
```

查詢語法：裸字之間是 AND。如果你的查詢長得像 FTS5 語法（引號、`OR`、`NEAR`、`NOT`、括號、`*`），會先當成原生 FTS5 試跑，跑不過再退回逐字比對。

### 進階用法

不需要 Claude 也能直接從 shell 用，方便寫進腳本：

```bash
python3 /path/to/claude-scope/scripts/scope.py search "query"
python3 /path/to/claude-scope/scripts/scope.py index    # 手動增量索引
```

想在每次 session 啟動就先暖好索引（等於一個沒有 daemon 的 watcher），把附的範例 hook 打開即可：

```bash
mkdir -p hooks && cp hooks.examples/hooks.json hooks/hooks.json
```

## 與現有工具的比較

claude-scope 的定位就是針對「索引式」和「grep 式」兩種既有做法的痛點：

| | claude-scope | 索引式工具 | grep / ripgrep 直掃 |
|---|---|---|---|
| 結果永遠最新 | ✅（每次搜尋前增量同步） | ❌（等下次重建） | ✅ |
| 查詢速度 | ✅（只讀新增位元組） | ✅ | ❌（每次重掃全部） |
| 過期會明講 | ✅（`[index refreshed]` / WARNING） | ❌（靜默） | — |
| 免額外進程 / 免網路 | ✅（原生外掛，Python stdlib） | 視工具而定 | ✅ |
| CLI 與 IDE 輸出一致 | ✅ | 視工具而定 | ✅ |

它也刻意處理了兩個大多數索引器會漏掉的細節：寫到一半的行（Claude Code 正在寫）會先擋著、等寫完才算，不會漏也不會重複計；被 Claude Code 記成 `attachment` 而非 `user` 的排隊 prompt 也會被索引，但共用同一種 record type 的背景任務通知會被過濾掉，避免你搜「自己說過的話」時混進 agent 的雜訊。

## 注意事項

- **子代理（subagent）的 sidechain 記錄 v1 不會被索引**——如果你重度使用 subagent，那部分對話搜不到。
- **格式穩定性風險**：官方文件註明 session `.jsonl` 是內部格式、可能隨 Claude Code 版本改變。claude-scope 讀取時採防禦式解析（未知行型別跳過、容忍半截/畸形行），但未來某次 Claude Code 更新仍可能需要它跟著更新。
- **索引位置**：預設在 `~/.claude/plugin-data/claude-scope/scope.db`（或 `$CLAUDE_PLUGIN_DATA` 底下），可用 `CLAUDE_SCOPE_DATA` 覆蓋。壞了直接刪 `.db`，下次會自動重建；升級若改了索引規則也會自動重建一次。

## 今日收穫

「保證新鮮」聽起來只是產品文案，但 claude-scope 把它拆成一個具體的工程契約：per-file byte offset + 每次查詢前增量同步 + 明確標示同步狀態。這其實是「增量索引」這個老技巧用在一個新場景——它不像傳統索引器那樣把「建索引」和「查詢」當成兩個分離的動作，而是把同步塞進查詢的前置步驟，用 append-only log 只會往後長的特性，把同步成本壓到毫秒級。之前我以為對話歷史搜尋要嘛快要嘛新、只能二選一，看完才發現當底層資料是 append-only 時，這根本不是二選一的問題。

## 參考資料

- [waazy-w/claude-scope — GitHub](https://github.com/waazy-w/claude-scope)：功能、安裝方式、授權（MIT）、需求（Python 3.9+ / SQLite FTS5）、新鮮度契約與限制皆出自官方 README。
- [SQLite FTS5 Extension — 官方文件](https://www.sqlite.org/fts5.html)：claude-scope 用來做全文搜尋的底層引擎。
