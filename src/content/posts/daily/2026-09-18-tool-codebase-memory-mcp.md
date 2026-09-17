---
title: "工具推薦｜codebase-memory-mcp — 把整個 repo 建成知識圖譜，一次查詢取代整輪 grep"
date: 2026-09-18
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "開源 MCP server，用 tree-sitter 把程式碼庫解析成持久化知識圖譜（call graph、HTTP 路由、跨服務呼叫鏈），讓 Agent 用結構化查詢取代逐檔 grep，官方基準測試顯示可省下 99% token"
tldr: "codebase-memory-mcp 是把程式碼庫索引成知識圖譜的 MCP server，15 個工具涵蓋索引、結構化查詢、變更影響分析。安裝：一行 curl 安裝腳本，restart Agent 後說『index this project』即可。解決了 Agent 逐檔 grep 探索大型程式碼庫時 token 消耗過高、又抓不到跨檔案呼叫關係的問題。"
series:
  name: "AI Tool of the Day"
  order: 33
---

> 🌏 [English version](/en/posts/daily/2026-09-18-tool-codebase-memory-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | codebase-memory-mcp |
| 類型 | MCP server |
| GitHub | [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) |
| Stars | 43,600+（撰文時，一週前約 23,000） |
| 語言 | Go（cgo 綁定 tree-sitter C 函式庫） |
| 授權 | MIT |
| 安裝 | `curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh \| bash` |

## 解決什麼問題

你讓 Agent 在一個上萬檔案的 monorepo 裡回答「這個函式被誰呼叫」「改這段程式碼會影響哪些服務」這種問題，它能用的工具通常只有 grep 和逐檔 read。沒有結構化索引的情況下，Agent 得靠關鍵字猜檔名、開一堆檔案交叉比對呼叫關係，一輪下來可能燒掉數十萬 token，而且找到的呼叫關係還不保證完整——尤其是 HTTP、gRPC 這種跨服務的呼叫，光靠文字搜尋幾乎抓不到。

codebase-memory-mcp 把「先建索引再查詢」這件事做成一個零依賴的原生執行檔。它用 tree-sitter 解析 158 種語言的 AST，另外對 Python、TypeScript/JavaScript、Go、Java、Rust 等 12 種語言疊加一層自製的輕量語意型別解析（README 稱為 Hybrid LSP，行為上對齊 tsserver、pyright、gopls 等既有語言伺服器），組出一份持久化知識圖譜——函式、類別、呼叫鏈、HTTP 路由、跨服務連結全部是圖上的節點與邊。之後 Agent 不用再靠 grep 亂槍打鳥，而是呼叫 `trace_path`、`search_graph`、`detect_changes` 這類結構化查詢工具直接拿答案；背景 watcher 會根據 git 變更自動增量重建索引，索引結果也能壓縮成單一檔案 commit 進 repo，讓團隊其他成員 clone 下來後不用重新跑一次全量索引。

適合場景：大型 monorepo 或微服務架構，Agent 需要追蹤跨檔案、跨服務的呼叫關係；團隊想在多個 Agent session 之間共享同一份索引結果，省下重複索引的時間；或是想在 commit 前先讓 Agent 用 `detect_changes` 做變更影響分析（哪些函式、哪些下游服務會被這次改動波及）。

## 快速上手

### 安裝

```bash
# macOS / Linux 一行安裝
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash

# 也可透過套件管理工具安裝，之後用對應工具升級
npm install -g codebase-memory-mcp
# 或
pip install codebase-memory-mcp
```

安裝完成後重啟你的 Coding Agent（Claude Code / Codex / OpenCode 等），對它說一句「index this project」就會開始建索引。

### 基本用法

不需要自己寫查詢語法，Agent 會自己選工具：

```
你："what calls ProcessOrder?"

Agent 呼叫：trace_path(function_name="ProcessOrder", direction="inbound")

codebase-memory-mcp：執行圖查詢，回傳結構化的呼叫鏈結果

Agent：用白話文把呼叫鏈解釋給你聽
```

15 個 MCP 工具中，最常用的幾個：

- `index_repository` / `index_status` — 建索引、查索引進度
- `search_graph` — 結構化搜尋（regex 名稱比對、BM25 全文、語意向量搜尋三選一或合併）
- `trace_path` — BFS 追呼叫鏈，深度 1–5
- `get_architecture` — 一次回傳語言分布、套件、進入點、路由、熱點模組
- `detect_changes` — 把 git diff 對應到受影響的函式，附風險分級

### 進階用法

團隊共享索引，避免每個人都重跑一次全量索引：

```bash
# 索引時自動寫出 .codebase-memory/graph.db.zst（zstd 壓縮的知識圖譜快照）
# commit 這個檔案，隊友 clone 後首次執行只需增量索引補差異

# 開啟 session 啟動時自動索引
codebase-memory-mcp config set auto_index true
```

## 與現有工具的比較

| | codebase-memory-mcp | 手動 grep/read 逐檔探索 | 單一語言 LSP 整合（如 Agent 內建的 tsserver/pyright 呼叫） |
|---|---|---|---|
| 跨語言統一查詢介面 | ✅（158 語言共用一套 MCP 工具） | ✅（但要自己想搜尋策略） | ❌（每種語言要接不同 LSP） |
| 跨服務呼叫鏈（HTTP/gRPC/pub-sub） | ✅ | ❌ | ❌ |
| Token 消耗 | 低（官方基準：99.2% 減少） | 高，且隨 repo 大小線性增加 | 中，仍需多輪工具呼叫拼結果 |
| 索引可 commit 給團隊共用 | ✅ | 不適用 | ❌ |
| 免 API key、完全本地 | ✅ | ✅ | 依 LSP 實作而定 |
| 建構/維運複雜度 | 需理解共享 daemon 機制 | 無（零建置） | 需各語言個別設定 LSP server |

## 注意事項

- **Windows Defender 可能誤判**：release 執行檔有機率被標成 `Trojan:Script/Wacatac.B!ml`，作者在 SECURITY.md 說明這是已知的誤判（同一偵測特徵也會誤判 `gh`、llama.cpp 等知名工具），並提供多引擎掃描結果可自行核對，正式導入前建議照文件驗證雜湊值。
- **背景有一個跨工具共享的協調 daemon**：Claude Code、Codex、OpenCode 等只要是同一台機器、同一個帳號，會共用同一個 daemon 管理索引與 watcher；這代表關掉一個 Agent session 不會直接關掉 daemon（除非它是最後一個活躍 session），初次使用建議先讀 README 的 Session Coordination Daemon 段落，避免誤以為索引程序沒有正常結束。
- **語意搜尋與跨服務連結仍是信心分數而非保證正確**：語意搜尋靠內建的 embedding 模型打分，跨服務 HTTP/gRPC 連結也是「信心分數配對」而非型別層級保證完整；README 附了 `docs/MEASURING_SAVINGS.md`，建議在自己的專案上實測準確率與 token 節省幅度，而不是直接套用官方基準數字。

## 今日收穫

這類工具反映一個趨勢：MCP server 的價值正在從「包一層 API」轉向「把整個資料型態（這裡是程式碼結構）預先索引成本地持久化狀態」，讓 Agent 用一次結構化查詢取代原本要靠多輪工具呼叫、逐步拼湊出來的答案。零依賴的單一執行檔加上可以 commit 進 repo 的索引產物，某種程度上把「Agent 對這個 repo 的理解」變成了一份可以跟程式碼一起版本控制、跟團隊共享的資產，而不是每個 session 重新累積一次的暫時記憶。

## 參考資料

- [DeusData/codebase-memory-mcp GitHub repo](https://github.com/DeusData/codebase-memory-mcp)：README 全文，含安裝方式、15 個 MCP 工具說明、效能基準、Session Coordination Daemon 機制、Windows Defender 誤判說明，本文技術細節主要出處。
- [SkillsLLM 收錄頁](https://skillsllm.com/skill/codebase-memory-mcp)：GitHub star 數（43,600+）與描述，用於核對 README 外的第三方數據。
- [LobeHub MCP Marketplace 收錄頁](https://lobehub.com/mcp/deusdata-codebase-memory-mcp)：列出 `CGO_ENABLED=1 go build` 手動編譯指令，用於核對本專案主要語言為 Go（cgo 綁定 tree-sitter）。
- [arXiv:2603.27277 — Codebase-Memory: Tree-Sitter-Based Knowledge Graphs for LLM Code Exploration via MCP](https://arxiv.org/abs/2603.27277)：本專案設計與基準測試方法出處的預印本論文，涵蓋 31 個真實 repo 的評測（83% 答案品質、10 倍 token 節省、2.1 倍工具呼叫次數減少）。
