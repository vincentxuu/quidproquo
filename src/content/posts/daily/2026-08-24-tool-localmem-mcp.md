---
title: "工具推薦｜localmem-mcp — 不叫 LLM、不連雲端的 Agent 記憶體"
date: 2026-08-24
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: zh-TW
description: "localmem-mcp 是一個本機優先的 MCP 記憶體伺服器：用 SQLite + 本機 embedding 做語意搜尋，recall 完全不叫 LLM，也不需要任何 API key，20+ 種 coding agent 都能共用同一份記憶"
tldr: "localmem-mcp 是一個 local-first 的 MCP 記憶體伺服器，用 SQLite + 本機 embedding（fastembed）儲存和搜尋 agent 記憶，recall 路徑完全不呼叫 LLM。安裝：`uvx localmem-mcp`（免安裝）或 `pip install localmem-mcp`。解決了現有記憶體工具（Mem0、Zep）需要雲端 LLM 呼叫、API key、額外服務（vector DB / graph DB）才能運作的問題。"
series:
  name: "AI Tool of the Day"
  order: 9
---

> 🌏 [English version](/en/posts/daily/2026-08-24-tool-localmem-mcp-en)

## 工具資訊

| 項目 | 值 |
|---|---|
| 名稱 | localmem-mcp |
| 類型 | MCP server（agent 記憶體） |
| GitHub | [OpenAgentHQ/localmem-mcp](https://github.com/OpenAgentHQ/localmem-mcp) |
| Stars | 6 |
| 語言 | Python |
| 授權 | MIT |
| 安裝 | `uvx localmem-mcp`（免安裝直接跑）或 `pip install localmem-mcp` |

## 解決什麼問題

你是否遇過這個狀況：昨天在 Claude Code 裡跟 agent 討論完架構決策，今天開新 session，agent 完全不記得「我們為什麼選 SQLite 而不是 Postgres」，只能重新解釋一次。市面上的記憶體 MCP（Mem0 的 OpenMemory、Zep/Graphiti）確實解決了跨 session 記憶的問題，但代價是每次存取都要多繞一圈：存記憶要叫一次 LLM 抽取事實，查記憶又要叫一次 LLM 做語意理解，而且通常還得掛一個 vector DB 或 graph DB（Qdrant、Neo4j）常駐服務，外加一組 API key。

localmem-mcp 把「記憶」拆成兩塊：寫入時用本機 embedding 模型（fastembed，ONNX，384 維）算一次向量存進 SQLite；查詢時做 cosine similarity + FTS5 關鍵字比對的 hybrid search，兩者都在本機算，全程不呼叫任何 LLM。整個服務就是一個 SQLite 檔案加一個嵌入式 embedding 模型，沒有額外的資料庫、沒有雲端 API、沒有按次計費。

適合場景：個人開發機上跨 session 保留專案決策脈絡、不想為了一個記憶功能而多開一個 Docker Compose stack、或是需要多個 coding agent（Claude Code、Cursor、Codex 都裝）共用同一份記憶而不想同步多套雲端帳號。

## 快速上手

### 安裝

```bash
# 免安裝，uvx 直接抓來跑
claude mcp add localmem -- uvx localmem-mcp

# 或先裝再用
pip install localmem-mcp
```

`.mcp.json` / `claude_desktop_config.json` 設定：

```jsonc
{
  "mcpServers": {
    "localmem": {
      "command": "uvx",
      "args": ["localmem-mcp"]
    }
  }
}
```

### 基本用法

Agent 拿到四個工具：`store_memory`、`search_memory`、`recall_memory`、`memory_stats`。實際使用是自然語言驅動，不用手動呼叫：

```
你：「記住我們這個專案選 SQLite 不選 Postgres，因為它是單一檔案，部署簡單。」
→ agent 呼叫 store_memory，存進 ~/.localmem/memories.db

（隔天，新 session）
你：「我們資料庫選了什麼？」
→ agent 呼叫 search_memory，用語意比對找到「SQLite」那筆記憶並回答
```

也有獨立 CLI 和 Python library 可以直接操作，不透過 agent：

```bash
localmem-mcp add "Deploys go out on Thursdays" --tag ops
localmem-mcp search "when do we ship?"
localmem-mcp export > memories.jsonl   # 記憶可以整批匯出帶走
```

### 進階用法

用環境變數把不同專案的記憶分開存，避免跨專案污染：

```bash
export LOCALMEM_DB_PATH=~/.localmem/project-a.db
export LOCALMEM_MODEL=BAAI/bge-small-en-v1.5   # fastembed 支援的模型都能換
```

## 與現有工具的比較

| | localmem-mcp | OpenMemory MCP (Mem0) | mem0-mcp-server | Zep / Graphiti |
|---|---|---|---|---|
| 雲端呼叫 | 零（模型只在首次使用下載一次） | 有，寫入要叫 LLM 抽取事實 | 有，走 Mem0 託管平台 | 有，LLM 建構/更新知識圖譜 |
| 需要 API key | 不需要 | 需要 `OPENAI_API_KEY` | 需要 `MEM0_API_KEY` | 需要 LLM provider key |
| recall 路徑會叫 LLM | 不會，純本機 cosine similarity + FTS5 | 會 | 會 | 會，圖譜遍歷/摘要都靠 LLM |
| 安裝footprint | `pip install` 或 `uvx`，無其他服務 | Docker Compose（API + vector DB） | 套件 + Mem0 託管帳號 | 自架 graph DB + LLM，或 Zep Cloud |
| 資料儲存 | 一個 SQLite 檔案 | Qdrant + history DB | Mem0 託管儲存 | Neo4j / FalkorDB |

（比較基準取自各專案 2026 年 8 月的官方文件，實際依需求以最新 README 為準。）

## 注意事項

- **不是知識圖譜**：localmem-mcp 刻意停留在「SQLite + embedding」這一層，不做實體關聯推理，這是 Zep/Graphiti 這類 graph DB 方案的強項，若需要跨記憶的關聯推理，這工具不是對的選擇。
- **首次使用會下載模型**：唯一一次網路請求是從 Hugging Face 抓約 90MB 的 embedding 模型，之後才是真正離線。若在完全隔離的環境跑，記得先手動下載好模型。
- **早期專案**：建立於 2026-08-14，只有 6 stars、12 個 open issues，API 介面仍可能變動，正式導入前建議先鎖 PyPI 版本號。

## 今日收穫

大部分「Agent 記憶體」工具把「記得住」和「用 LLM 理解語意」綁在一起賣，讓人以為想要語意搜尋就一定要接雲端 LLM。localmem-mcp 證明這兩件事可以拆開：語意搜尋只需要一個本機 embedding 模型算向量算相似度，完全不需要在查詢路徑上再燒一次 LLM 的 token。

## 參考資料

- [localmem-mcp GitHub repo](https://github.com/OpenAgentHQ/localmem-mcp)
- [localmem-mcp 官方文件](https://openagenthq.github.io/localmem-mcp/)
- [localmem-mcp PyPI 頁面](https://pypi.org/project/localmem-mcp/)
- [localmem-mcp Integrations 頁面（20+ agent 設定）](https://openagenthq.github.io/localmem-mcp/integrations/)
