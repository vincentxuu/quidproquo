---
title: "工具推薦｜petit-poucet — 讓 Claude Code 和 Copilot CLI 共用一份可審查的 Git 記憶"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "Rust 寫成的 MCP server，把 Agent 的規則、決策與已驗證事實存成 Git 倉庫裡的 Markdown 筆記，讓 Claude Code、GitHub Copilot CLI 共用同一份記憶，且每筆修改都留下 commit"
tldr: "petit-poucet 是一個 Rust 寫成的 MCP server，把 AI 編程 Agent 的長期記憶存成 Git 倉庫裡的 Markdown 筆記。安裝：`claude plugin marketplace add https://github.com/areguig/petit-poucet` 再 `claude plugin install petit-poucet@petit-poucet`。解決了『每個 Agent 工具各自維護一份記憶、換工具或換 session 就要重講一次』的問題。"
series:
  name: "AI Tool of the Day"
  order: 36
---

> 🌏 [English version](/en/posts/daily/2026-09-25-tool-petit-poucet-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | petit-poucet |
| 類型 | MCP server + Claude Code / Copilot CLI plugin |
| GitHub | [areguig/petit-poucet](https://github.com/areguig/petit-poucet) |
| Stars | 2（2026-09-24 建立，剛發佈） |
| 語言 | Rust |
| 授權 | Apache-2.0 |
| 安裝 | `claude plugin marketplace add https://github.com/areguig/petit-poucet && claude plugin install petit-poucet@petit-poucet` |

## 解決什麼問題

你是不是也遇過這種狀況：在 Claude Code 裡跟 Agent 講好「commit 訊息只留一兩行、不要加 Co-Authored-By」，隔天開新 session 又要講一次；換成用 GitHub Copilot CLI 做同一個專案，這條規則完全不存在，還得再講一次。每個 Agent 工具都有自己的記憶格式——有的塞進一份會員自己爆炸的 `CLAUDE.md`，有的接向量資料庫變成看不到內容的黑盒，沒有一個是「多個工具能共用、又能像程式碼一樣被審查」的。

petit-poucet 的做法是把記憶抽出 Agent 工具之外，變成一份獨立的 Git 倉庫：純 Markdown 筆記，每篇帶 YAML frontmatter（`type`、`scope`、`summary`、`created`、`tags`），存在 `~/agent-memory/` 底下的 `Preferences/`（跨專案通用）、`Projects/<repo>/`（該專案專屬)、`Topics/<topic>/`（跟專案無關的主題）三個資料夾。一個用 Rust 寫的小型 MCP server 把 `memory_index`、`memory_search`、`memory_save` 等六個工具開給任何 MCP 客戶端，session 開始時的 hook 會把「這個專案適用的規則有哪些」整理成一份索引先餵給 Agent,而不是把整個記憶庫倒進 context。倉庫本身是本機的 git repo，每次存檔都有一次 commit，所以可以用 `git diff` / `git log` 檢查 Agent 到底記下了什麼、什麼時候記的——這點跟它在 README 裡列出的參考對象之一、我們先前介紹過的 [okf-agent-memory](/posts/daily/2026-09-07-tool-okf-agent-memory) 是同一個方向：把「Agent 記得了什麼」變成可以進 PR review 的東西,而不是只能信任黑盒。

適合場景：同時用 Claude Code 和 Copilot CLI（或其他 MCP 客戶端）開發同一批專案，想要規則和決策只寫一次、兩邊都認得；已經有一堆手寫的 `MEMORY.md` 或散落在各 repo 的筆記,想收斂成一份有結構、可用 Obsidian 開的記憶庫;或是你明確要求「規則被更動前要先問過我」,而不是讓 Agent 靜默覆寫先前講好的東西。

## 快速上手

### 安裝

```bash
# 需要 git 和 curl（macOS / Linux）；plugin 首次使用時會自動下載對應平台的二進位檔並驗證 SHA-256

# Claude Code
claude plugin marketplace add https://github.com/areguig/petit-poucet
claude plugin install petit-poucet@petit-poucet

# GitHub Copilot CLI
copilot plugin marketplace add areguig/petit-poucet
copilot plugin install petit-poucet@petit-poucet
```

安裝完後開一個新 session，Agent 會發現還沒有記憶庫，主動詢問要不要在 `~/agent-memory`（或自訂路徑）建立一個；兩個工具會共用同一份。

### 基本用法

```markdown
# Agent 拿到的六個 MCP 工具
memory_index    # 列出目前適用的 preferences、專案筆記、可查詢的 topic 名稱
memory_read     # 讀一篇筆記
memory_search   # 對 preferences、當前專案、所有 topic 做全文搜尋
memory_save     # 新增或更新一篇筆記（自動更新 Index、自動 commit）
memory_move     # 改筆記的名稱或 scope，順便重寫所有連到它的連結
memory_delete   # 刪除一篇筆記（附理由），並清掉所有引用
```

Claude Code 每次 session 開始時會顯示一行摘要，例如：

```
🪨 petit-poucet · 20 notes loaded (preferences + chargepath-api)
```

### 進階用法

```bash
# 命令列本身也能直接操作記憶庫，不透過 Agent
petit-poucet check              # 驗證 frontmatter、summary、scope、連結、有沒有夾帶密鑰
petit-poucet init ~/agent-memory  # 建立一個新記憶庫
petit-poucet migrate            # 把手寫的舊版記憶庫升級成新格式
```

已經在用 `CLAUDE.md` 或散落的 `MEMORY.md` 記筆記？可以請 Agent 執行 petit-poucet 內建的 `migrate-memory` skill，它會先列出要搬的內容給你確認,再逐條存進新記憶庫,不動原本的舊檔案。

## 與現有工具的比較

| | petit-poucet | okf-agent-memory | 向量記憶（Mem0 / Letta 類） |
|---|---|---|---|
| 跨 Agent 工具共用同一份記憶 | ✅（Claude Code + Copilot CLI） | 需自行接 MCP，無官方雙工具整合 | 視框架而定 |
| 儲存位置 | 獨立 git 倉庫（`~/agent-memory`） | 專案內的 `knowledge/` 資料夾 | 外部向量資料庫 / 服務 |
| 每次修改都留 commit | ✅ | 依賴專案自身的 git 習慣 | 不行（embedding 是黑盒） |
| 使用者聲明的規則需確認才能改 | ✅（`feedback` 類型強制詢問） | 沒有對應機制 | 通常沒有 |
| 需要外部服務或 API key | 不需要 | 不需要 | 需要 |
| 可用 Obsidian 直接瀏覽 | ✅ | 可以（純 Markdown） | 不行 |

## 注意事項

- **專案剛發佈，僅 2 顆星**：2026-09-24 才建立，CI 綠燈、安裝流程本身可驗證，但介面與 MCP 工具參數都還可能大改，正式導入前先鎖 release 版本。
- **記憶庫脫離專案倉庫**：預設存在 `~/agent-memory`、不在你的專案 git 倉庫裡，多台機器或多人協作時要自己想清楚怎麼同步（目前 README 明講「never pushed」，同步機制不含在工具內)。
- **辨識專案靠 git remote 或資料夾名稱**：換了 remote 網址或把專案資料夾複製到別的路徑，記憶可能對不到原本的專案筆記，需要手動確認。

## 今日收穫

過去看到的「跨 Agent 工具記憶」問題,通常的解法是挑一個工具當主場、其他工具將就著用它的格式。petit-poucet 提醒我們其實可以反過來——把記憶做成一個完全獨立於任何 Agent 工具之外的資產（一個 git 倉庫），再讓每個工具都用 MCP 這層薄薄的協定去讀寫它。這樣「換工具」不再等於「重建記憶」，記憶庫本身也因為是 Git 倉庫，天生就有版本歷史和可審查性,不用額外整合什麼審計功能。

## 參考資料

- [petit-poucet GitHub repo](https://github.com/areguig/petit-poucet)：README、授權（Apache-2.0）、語言（Rust）、Stars 均出自官方 repo 與 GitHub API。
- [petit-poucet README](https://raw.githubusercontent.com/areguig/petit-poucet/main/README.md)：安裝方式、MCP 工具清單、記憶庫結構。
- [.claude-plugin/marketplace.json](https://raw.githubusercontent.com/areguig/petit-poucet/main/.claude-plugin/marketplace.json)：確認 Claude Code plugin 安裝路徑有效。
- [okf-agent-memory 工具介紹](/posts/daily/2026-09-07-tool-okf-agent-memory)：本站先前介紹過的同方向 Git-native 記憶工具，petit-poucet README 將其列為參考對象之一。
- [Model Context Protocol 官方文件](https://modelcontextprotocol.io)：MCP 協定介紹。
