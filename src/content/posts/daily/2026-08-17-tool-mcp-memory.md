---
title: "工具推薦｜mcp-memory — 用 Google 的 OKF 標準給 Agent 做長期記憶"
date: 2026-08-17
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "MCP server 讓 Agent 把記憶存成 Google 發佈的 Open Knowledge Format（OKF）Markdown 檔，本機 SQLite FTS5 索引，跨 session 秒級檢索，不需要任何雲端帳號或 API key"
tldr: "mcp-memory 是一個 MCP server，把 Agent 的長期記憶存成符合 Google OKF v0.2 標準的 Markdown 檔，並用 SQLite FTS5 建索引做全文搜尋。安裝：git clone 後跑 `python3 setup.py`。解決了 Agent 每次開新對話就失憶、且記憶格式各家 Agent 互不相通的問題。"
series:
  name: "AI Tool of the Day"
  order: 2
---

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | mcp-memory |
| 類型 | MCP server |
| GitHub | [fellowgeek/mcp-memory](https://github.com/fellowgeek/mcp-memory) |
| Stars | 175（2026-08-13 發佈，4 天內衝上 Hacker News 首頁） |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `git clone https://github.com/fellowgeek/mcp-memory && cd mcp-memory && python3 setup.py` |

## 解決什麼問題

你是否遇過這種狀況：昨天讓 Agent 弄懂了整個專案的架構、你的程式碼風格偏好、還有正在追的那個 bug 進度，結果今天開新對話,它又是一張白紙,得重新解釋一遍？或者你同時用 Claude Code、Cursor、Codex 開發，每套工具的「記憶」各自為政（Claude 的 `CLAUDE.md` 是純文字、Cursor 用自己的規則檔），根本沒辦法共用同一份長期記憶。

mcp-memory 的做法是把「記憶」定義成一種標準格式，而不是某個工具的專屬功能。它採用 Google Cloud Platform 發佈的 [Open Knowledge Format（OKF v0.2）](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)——每一則記憶都是一個帶 YAML frontmatter（`type`、`key`、`namespace`、`tags`、`status`、`generated`、`verified` 等欄位）的 Markdown 檔,存在專案的 `memory/` 資料夾裡,人可以直接開檔案看、Git 可以直接 diff。同時另外維護一份 SQLite FTS5 索引（`.mcp_memory/memories.db`）,讓 Agent 用關鍵字或 tag 查詢時是毫秒級的全文搜尋,而不是每次都要掃描所有 Markdown 檔。

適合場景：長期維護同一個專案、想讓 Agent 記住架構決策和個人偏好的開發者；同時用多套 MCP 相容 Agent（Claude Desktop、Cursor、Antigravity、Windsurf、Codex）、希望它們共用同一份記憶而不是各自維護一套的人；以及在乎「記憶」要能被 Git 版控、人眼可讀、不綁定單一廠商格式的團隊。

## 快速上手

### 安裝

```bash
# 需要 Python 3
git clone https://github.com/fellowgeek/mcp-memory
cd mcp-memory
python3 setup.py
```

`setup.py` 是互動式精靈，會自動偵測並幫你註冊到已安裝的 Claude Desktop、Cursor、Antigravity、Windsurf、Codex 設定檔裡；也可以手動把 `run.sh` 的路徑加進你的 MCP client 設定。整個過程不需要註冊任何帳號、不需要 API key，全部資料留在本機。

### 基本用法

Agent 會拿到 5 個 MCP 工具：

- `memory_store` — 以 OKF v0.2 格式新增或更新一則記憶
- `memory_retrieve` — 依 key + namespace 取回特定記憶
- `memory_search` — 依關鍵字、tag、namespace 搜尋記憶
- `memory_get_last` — 讀取上次工作進度的 checkpoint
- `memory_update_last` — 更新目前的進度 checkpoint

存下來的記憶長這樣（`memory/user/preferences/coding_style.md`）：

```markdown
---
type: Agent Memory
title: Coding Style
key: user/preferences/coding_style
namespace: default
tags:
  - preferences
  - style
status: stable
generated:
  by: mcp-memory/0.2.0
  at: '2026-08-12T19:23:35Z'
created_at: '2026-08-12T19:23:35Z'
updated_at: '2026-08-12T19:23:35Z'
---

User prefers functional programming style with explicit type annotations.
```

### 進階用法

用 `namespace` 做上下文隔離，區分「使用者偏好」「專案架構」這類不同性質的記憶，也可以用環境變數改存放位置（例如多專案共用同一個記憶庫，或把 SQLite 索引搬到別的磁碟）：

```bash
export MCP_MEMORY_PROJECT_ROOT=/path/to/project
export MCP_MEMORY_DIR=memory                  # OKF Markdown 存放資料夾
export MCP_MEMORY_DB_PATH=.mcp_memory/memories.db  # SQLite 索引位置
```

## 與現有工具的比較

| | mcp-memory | Mem0 | 手動維護 CLAUDE.md |
|---|---|---|---|
| 本機執行、免 API key | ✅ | ❌（需雲端帳號） | ✅ |
| 標準化格式（可跨 Agent 通用） | ✅（OKF v0.2） | ❌（自有 schema） | ❌（純文字，無 schema） |
| 全文搜尋 | ✅ SQLite FTS5 | ✅ 向量搜尋 | ❌ 靠 Agent 自己讀全檔 |
| 人眼可讀、可 Git diff | ✅（Markdown） | ❌（存在向量資料庫） | ✅ |
| Session checkpoint（記錄「做到哪了」） | ✅ | 需自行設計 | 需自行維護 |
| 費用 | 免費 | $19–249/mo | 免費 |

## 注意事項

- **這是一個 4 天前才發佈的新專案**：175 顆星大多來自 Hacker News 曝光帶來的一波關注，長期維護狀況還有待觀察，正式導入前建議先讀過 `db.py`、`memory_server.py` 原始碼。
- **OKF 本身也還在早期（v0.2）**：這是 Google Cloud Platform 才發佈不久的標準，schema 未來可能調整，mcp-memory 目前緊跟 `SPEC.md`／`OKF_RULES.md`，但若上游規格改版，這個 server 需要同步跟進才不會產生不相容的記憶檔。
- **沒有 `memory_delete` 工具**：目前只能新增、更新、查詢、讀取 checkpoint，要移除一則記憶得手動刪 `memory/` 底下的 Markdown 檔並重建 SQLite 索引，短期內若要清理錯誤記憶會比較麻煩。

## 今日收穫

原本以為「Agent 記憶」這個問題大家各憑本事——Mem0 用向量資料庫、Claude 用一個 200 行上限的 Markdown 檔、LangMem 綁在 LangChain 生態裡——但 mcp-memory 提醒我其實已經有人在推「記憶格式」本身的開放標準（OKF），試圖讓不同 Agent 工具鏈可以共用同一份記憶，而不是每套工具各自發明一種格式,像極了當年瀏覽器大戰前每家自己搞一套 markup。標準化雖然還在很早期，但這個方向本身值得留意。

## 參考資料

- [fellowgeek/mcp-memory — GitHub](https://github.com/fellowgeek/mcp-memory)
- [Open Knowledge Format v0.2 SPEC — GoogleCloudPlatform/knowledge-catalog](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- [Show HN: MCP Memory – Fast Agent Memory Using Google's OKF and SQLite FTS5 — Hacker News](https://news.ycombinator.com/item?id=49286073)
