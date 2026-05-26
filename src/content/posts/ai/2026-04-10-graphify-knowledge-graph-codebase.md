---
title: "Graphify：把程式碼和文件變成可查詢的知識圖譜"
date: 2026-04-10
type: guide
category: ai
tags: [graphify, knowledge-graph, multimodal, tree-sitter, code-understanding, claude-code, mcp]
lang: zh-TW
tldr: "Graphify 是一個 Claude Code skill：把程式碼、PDF、Markdown、截圖、白板照全部用 tree-sitter AST + Claude vision 轉成一張可查詢的知識圖譜。在 52 檔案的混合語料上，每次查詢比讀原始檔案省 71.5 倍 token，而且附上可自己重跑驗證的 worked examples。"
description: "Graphify 的設計哲學、雙階段處理架構、完全多模態提取、關係分類系統、query/add/path/explain 指令、可驗證的 token benchmark，以及它如何整合進 Claude Code、Codex、Cursor 等 AI 編程助手。"
draft: false
---

AI 編程助手越來越強，但有個根本問題沒變：專案一大，context window 就不夠用。把整個 codebase 餵進去不現實，只挑幾個檔案又怕漏掉關鍵關係。

Graphify 的做法是在中間加一層——把程式碼、文件、論文、圖片全部轉成一張知識圖譜，讓 AI 助手查圖而不是讀原始檔案。它本身就是一個 Claude Code skill，在任何資料夾裡輸入 `/graphify .` 就會跑起來。

作者用 Andrej Karpathy 的習慣當定位：Karpathy 有一個 `/raw` 資料夾，隨手丟論文、推文、截圖、筆記，久了就變成一坨彼此關係不明的東西。Graphify 就是針對這個場景——把一堆混雜的輸入接成一張圖，**持久化跨 session**（存成 `graph.json`，幾週後還能直接查、不必重讀），而且**誠實標註哪些是找到的、哪些是猜的**。

## 雙階段處理：AST 先行，LLM 補語意

Graphify 的核心設計是把提取分成兩個階段，各自處理最擅長的部分。

**第一階段：確定性 AST 提取**

用 tree-sitter 解析程式碼，提取 class、function、import、call graph、docstring，支援 20+ 種語言。這個階段完全在本地執行，不需要任何 API 呼叫。

```
source code → tree-sitter AST → 結構化節點與邊
```

**第二階段：LLM 語意分析**

Claude subagent 平行處理文件、論文、圖片，識別概念關係和設計意圖，結果合併到 NetworkX 圖中。

這種分層的好處：程式碼結構的提取是確定性的、可重複的、不花 token；只有非結構化內容才需要 LLM 介入。跟純 LLM 提取相比，既省錢又穩定。

跟傳統的「全丟給 LLM 解析」方式比較：

| | Graphify 雙階段 | 純 LLM 提取 |
|---|---|---|
| 程式碼結構 | tree-sitter，確定性 | LLM 推斷，可能遺漏 |
| 成本 | 只有文件/圖片用 API | 全部都要 API |
| 可重複性 | AST 結果穩定 | 每次可能不同 |
| 語意理解 | 有，第二階段補充 | 有 |

## 完全多模態：任何輸入都能進同一張圖

Graphify 現在主打「fully multimodal」——程式碼、PDF、Markdown、截圖、流程圖、白板照片，甚至**其他語言的圖片**都能丟進去，用 Claude vision 抽取概念與關係，最後接成同一張圖。不同類型走不同的提取管線：

| 類型 | 副檔名 | 提取方式 |
|------|--------|----------|
| 程式碼 | `.py .ts .js .go .rs .java .c .cpp .rb .cs .kt .scala .php` | tree-sitter AST + call-graph pass |
| 文件 | `.md .txt .rst` | Claude 抽概念與關係 |
| 論文 | `.pdf` | 引用探勘（citation mining）+ 概念抽取 |
| 圖片 | `.png .jpg .webp .gif` | Claude vision——截圖、圖表、任何語言 |

這就是它跟 IDE symbol index 或純 code graph 工具最大的差異：後者只懂程式碼，Graphify 能把一張架構圖、一篇論文、一段 commit 訊息和實際的程式碼節點連在一起。

## 關係分類系統

圖裡的每條邊不只是「A 連到 B」，還帶有信賴度標籤：

- **EXTRACTED**（confidence: 1.0）：直接從原始碼提取的確定關係，例如 import、function call
- **INFERRED**（confidence: 0.0–1.0）：LLM 推斷的合理關係，帶數值信賴度
- **AMBIGUOUS**：不確定的關係，標記給人類 review

系統還會追蹤特定的註解模式——`# NOTE:`、`# IMPORTANT:`、`# HACK:`、`# WHY:`——建立 `rationale_for` 節點，把設計決策的「為什麼」也圖譜化。

這個設計很實用。查詢結果的時候你知道哪些關係是鐵的、哪些是推斷的、哪些需要人工確認，不會把 LLM 的猜測當成事實。

## 輸出產物

執行一次 `/graphify .`，在 `graphify-out/` 目錄會產生四種東西：

```
graphify-out/
├── graph.json         # 持久化知識圖譜，跨 session 可用
├── graph.html         # 互動式視覺化，含社群偵測與節點點擊
├── GRAPH_REPORT.md    # 一頁摘要：god node、意外連結、建議查詢
└── cache/             # SHA256 索引，支撐增量更新
```

**graph.html** 用 vis.js 渲染，支援社群偵測（Leiden 演算法），可以按社群過濾、點擊節點展開關係。不需要額外安裝任何東西，瀏覽器打開就能用。

**GRAPH_REPORT.md** 是給人快速掃描的摘要，列出圖中的 god node（連結最多的核心節點）和建議的查詢語句。新加入專案的人看這份報告就能快速掌握架構的關鍵樞紐。

## 增量更新與快取

用 SHA256 hash 追蹤每個檔案，`--update` 模式只重新處理有變更的檔案，結果合併到現有圖譜。

```bash
# 首次建構
/graphify ./raw

# 之後只處理變更的檔案
/graphify ./raw --update
```

對大型專案來說這是必要的——不會因為改了一個檔案就重跑整張圖。

## 查詢、擴充與導覽圖譜

建好圖之後，Graphify 提供幾個直接對圖操作的指令，不必再回去讀原始檔案：

```
/graphify query "what connects attention to the optimizer?"   # 自然語言問圖
/graphify path "DigestAuth" "Response"                        # 找兩個節點間的最短關係路徑
/graphify explain "SwinTransformer"                           # 展開某個節點的鄰居與角色
```

`add` 指令則讓圖能持續長大——直接餵一個 URL，Graphify 會抓下內容、存檔，再併進現有圖：

```
/graphify add https://arxiv.org/abs/1706.03762    # 抓一篇論文
/graphify add https://x.com/karpathy/status/...   # 抓一則推文
```

這條路線正好呼應 Karpathy 的 `/raw` 場景：看到一篇論文或一則推文，一行指令丟進圖，它就自動跟既有的程式碼、筆記接上關係。

## 整合 AI 編程助手

Graphify 支援 10+ 種 AI 助手的整合，包括 Claude Code、Codex、OpenCode、Cursor、Gemini CLI、GitHub Copilot CLI、Aider 等。整合方式因平台而異：

```bash
# Claude Code
graphify claude install

# Cursor
graphify cursor install

# 通用 Git hook（commit / 切換分支時自動重建）
graphify hook install
```

安裝後，AI 助手在處理問題時會自動查詢知識圖譜，而不是直接讀原始檔案。

**Watch 模式**可以在開發時持續同步：

```bash
/graphify ./raw --watch
```

**Wiki 模式**產出 Wikipedia 風格的 markdown 文章，每個社群和 god node 各一篇，附帶 `index.md` 入口：

```bash
/graphify ./raw --wiki
```

**MCP Server** 把圖譜暴露為 MCP 工具，支援 `query_graph`、`get_node`、`get_neighbors`、`shortest_path` 等操作：

```bash
python -m graphify.serve graphify-out/graph.json
```

## 整體架構

```
原始專案
  │
  ├─ 程式碼檔案 ──→ [tree-sitter AST] ──→ 結構化節點 ─┐
  │                   （本地，無 API）                    │
  ├─ 文件/論文 ───→ [Claude subagent] ──→ 語意關係 ────┤
  │                   （平行處理）                        │
  └─ 圖片/圖表 ──→ [Claude subagent] ──→ 概念節點 ────┤
                                                          ↓
                                                    [NetworkX 圖]
                                                    [Leiden 社群偵測]
                                                          ↓
                                          ┌───────────────┼───────────────┐
                                          ↓               ↓               ↓
                                    graph.json      graph.html    GRAPH_REPORT.md
                                          ↓
                              ┌───────────┼───────────┐
                              ↓           ↓           ↓
                          MCP Server   Wiki 模式   AI 助手查詢
```

## Token benchmark：能自己重跑驗證的數字

Graphify 每次跑完會自動印出 token benchmark，而且 repo 裡附了 `worked/` 範例——每個資料夾都有原始輸入檔和實際輸出（`GRAPH_REPORT.md`、`graph.json`），讓你自己重跑驗證，不是只給一個漂亮的行銷數字：

| 語料 | 檔案數 | 節省倍數 | 輸出 |
|------|--------|----------|------|
| Karpathy repos + 5 篇論文 + 4 張圖片 | 52 | **71.5x** | `worked/karpathy-repos/` |
| graphify 原始碼 + Transformer 論文 | 4 | **5.4x** | `worked/mixed-corpus/` |
| httpx（合成 Python library） | 6 | **~1x** | `worked/httpx/` |

關鍵在最後一列：**節省倍數會隨語料規模放大**。6 個檔案本來就塞得進 context window，圖譜在這裡的價值是結構清晰度而非壓縮（所以是 ~1x）；到了 52 個檔案（程式碼 + 論文 + 圖片混合）才會出現 71x 以上的差距。這個誠實的下限說明，比單看 71.5x 更值得參考——它告訴你什麼時候**不該**用 Graphify。

## 隱私模型

程式碼檔案透過 tree-sitter 完全在本地處理，原始碼不會離開你的機器。只有文件、論文、圖片會透過你自己的 API key 傳送到模型 API（Claude 用 Anthropic API、Codex 用 OpenAI API）。無遙測、無使用追蹤。

這個取捨合理——程式碼是最敏感的部分，用確定性工具處理；文件和圖片本來就需要語意理解，送到 API 是必要的。

## 適合與不適合的場景

**適合**：
- 中大型專案，檔案多、跨模組關係複雜
- 混合內容（程式碼 + 論文 + 設計文件 + 架構圖）
- 團隊 onboarding，新人需要快速理解架構
- 已經在用 Claude Code / Cursor / Codex 等 AI 助手

**不適合**：
- 小型專案（幾十個檔案），直接讀原始碼更快
- 純程式碼且沒有文件的專案，圖譜的語意層價值有限
- 對隱私要求極嚴格、連文件都不能送到 API 的場景

## 整體來說

Graphify 解決的是 AI 編程助手的 context 瓶頸：與其把原始檔案塞進 context window，不如先壓縮成結構化的知識圖譜，讓 AI 查圖找關係。

雙階段處理是它最聰明的設計——能用確定性工具做的就不用 LLM，省成本也穩定；關係分類系統讓你知道哪些連結是確定的、哪些是推斷的。跟 IDE 的 symbol index 比，它多了語意層和跨模態支援；跟純 LLM 分析比，它有 AST 的確定性打底。

安裝一行 `pip install graphifyy && graphify install`（PyPI 套件暫時叫 `graphifyy`，`graphify` 名稱正在回收中，但 CLI 與 skill 指令仍是 `graphify`），對已經在用 AI 助手寫程式的人來說，值得花十分鐘試一下。

## 更新紀錄

- 2026-05-26：依目前 GitHub README 翻新——補上「完全多模態」定位（Claude vision 處理截圖、白板照、跨語言圖片）、新增「查詢、擴充與導覽圖譜」段（`query` / `path` / `explain` / `add`）、加入可自行重跑驗證的 worked examples 與 token benchmark 表（71.5x / 5.4x / ~1x）、安裝套件改名 `graphifyy`，並在開頭補上 Karpathy `/raw` 的定位故事。

## 參考資料

- [Graphify - GitHub](https://github.com/safishamsi/graphify)
- [tree-sitter - GitHub](https://github.com/tree-sitter/tree-sitter)
- [NetworkX - 官方文件](https://networkx.org/)
- [graspologic (Leiden 社群偵測) - GitHub](https://github.com/microsoft/graspologic)
- [vis.js - 官方網站](https://visjs.org/)
- [Model Context Protocol (MCP) - 官方文件](https://modelcontextprotocol.io/)
