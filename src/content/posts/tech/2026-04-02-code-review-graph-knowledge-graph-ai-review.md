---
title: "code-review-graph：用知識圖譜讓 AI Code Review 省下 8 倍 Token"
date: 2026-04-02
type: guide
category: tech
tags: [code-review, knowledge-graph, tree-sitter, mcp, ai-tools]
lang: zh-TW
tldr: "code-review-graph 用 Tree-sitter 解析 codebase 建立持久化知識圖譜，追蹤變更的爆炸半徑，只把真正相關的 context 餵給 AI，號稱平均省下 8.2 倍 token。"
description: "code-review-graph 的核心概念、架構設計、技術棧、效能數據，以及它適合和不適合的場景。"
draft: false
---

AI code review 最大的浪費是什麼？每次都把整個 repo 餵給 LLM。改了一個函式，AI 卻要讀完幾百個檔案才能給回饋。code-review-graph 要解決的就是這件事——建一張程式碼的結構圖譜，變更發生時只提取真正受影響的部分。

## 核心概念：程式碼即圖譜

傳統 AI code review 的流程是「改了哪些檔案 → 全部丟給 LLM」。code-review-graph 多了一層：先用 Tree-sitter 把整個 codebase 解析成 AST，提取出函式、類別、import 作為節點，呼叫關係、繼承、測試覆蓋作為邊，形成一張 NetworkX 圖譜，存進 SQLite。

這張圖譜是持久化的。第一次建圖需要完整掃描，之後透過 Watchdog 監聽檔案變動，只重新解析修改的檔案，增量更新號稱在 2 秒內完成。

跟純文字搜尋（grep）或簡單 AST 分析的差別在於：圖譜能追蹤跨檔案的依賴鏈。A 呼叫 B，B 繼承 C，C 的測試在 D——改了 C 就知道 A、B、D 都可能受影響。

## 架構

```
程式碼變更
    │
    ▼
Tree-sitter AST 解析（支援 19 種語言）
    │
    ▼
節點提取（函式、類別、import）
邊提取（呼叫、繼承、測試覆蓋）
    │
    ▼
NetworkX 圖譜 ──→ SQLite 持久化
    │
    ▼
Watchdog 監聽 ──→ 增量更新（< 2s）
    │
    ▼
變更影響分析（Blast Radius）
    │
    ▼
MCP 工具 ──→ Claude Code / Cursor / Windsurf / Zed
```

幾個關鍵模組：

| 模組 | 做什麼 |
|---|---|
| `parser.py` | Tree-sitter 多語言解析，提取 AST 節點和邊 |
| `graph.py` | NetworkX 圖譜資料結構 |
| `incremental.py` | 增量更新引擎 |
| `changes.py` | 爆炸半徑計算，風險評分 |
| `communities.py` | 圖譜社群聚類（找出相關程式碼群組） |
| `flows.py` | 執行流追蹤，按危險程度排序 |
| `search.py` | 語意搜尋（可選 embedding） |
| `visualization.py` | D3.js 互動式視覺化 |

## 技術棧

- **Python 3.10+**（82.5%）+ **TypeScript**（17.3%，VSCode 擴充套件）
- **Tree-sitter** + tree-sitter-language-pack：多語言 AST 解析的事實標準
- **NetworkX**：Python 圖譜運算，可選 igraph 做社群偵測
- **SQLite**：持久化圖譜，零部署成本
- **FastMCP**：MCP 協議實作，讓 AI 工具直接呼叫
- **Watchdog**：檔案系統監聽
- 可選：sentence-transformers / Google Generative AI / Ollama 做 embedding 搜尋

選擇 SQLite + NetworkX 而不是 Neo4j 之類的圖資料庫，明顯是為了降低部署門檻。對大多數 codebase 來說這個取捨合理——程式碼圖譜的規模通常不需要專門的圖資料庫。

## 效能數據

官方在 6 個真實 repo 上測試的數據：

- **平均 8.2 倍 token 減少**：AI 收到的 context 量大幅下降
- **100% recall**：所有真正受影響的檔案都會被偵測到
- **F1 = 0.54**：精確度不高，傾向於過度預測

100% recall + 低 F1 的組合代表：它不會漏掉該看的檔案，但會多抓一些不相關的。對 code review 來說這個取捨可以接受——漏掉重要檔案比多看幾個檔案的代價高得多。

## MCP 整合

這是它的殺手級功能。透過 MCP 協議，Claude Code、Cursor、Windsurf、Zed、Continue、OpenCode 都能直接呼叫圖譜工具。AI 不再需要自己決定該讀哪些檔案，圖譜直接告訴它「這次變更影響了這些函式和檔案」。

專案也提供了 VSCode 擴充套件，可以在 IDE 裡直接看到圖譜視覺化和影響分析。

## 適合與不適合的場景

**適合：**
- 中大型 codebase，跨檔案依賴複雜
- 頻繁做 AI-assisted code review 的團隊
- 想控制 LLM token 成本的場景

**不適合：**
- 小型專案或單檔變更——圖譜維護的開銷可能比直接讀檔還高
- 需要高精確度影響分析的場景（F1 只有 0.54）
- 不使用 AI code review 工具的團隊（沒有 AI 消費端，圖譜沒有用武之地）

## 整體來說

code-review-graph 解決了一個真實的痛點：AI code review 的 context 浪費。用 Tree-sitter + 知識圖譜的方式，把「給 AI 看什麼」從「整個 repo」縮小到「真正相關的部分」。8.2 倍的 token 節省在大型 repo 上很有感。

但它的精確度（F1 0.54）說明這個方向還有進步空間。過度預測代表 AI 還是會收到一些不相關的 context，只是比暴力餵全部好很多。另外，小型變更的 overhead 問題也值得注意——不是所有場景都適合加這一層。

核心取捨很清楚：用持久化圖譜的維護成本，換取每次 review 的 token 節省。Repo 越大、review 越頻繁，這個交易越划算。

## 參考資料

- [code-review-graph GitHub](https://github.com/tirth8205/code-review-graph)
- [Tree-sitter](https://tree-sitter.github.io/tree-sitter/)
- [NetworkX](https://networkx.org/)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
- [FastMCP](https://github.com/jlowin/fastmcp)
