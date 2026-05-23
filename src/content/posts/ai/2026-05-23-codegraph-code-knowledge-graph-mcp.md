---
title: "CodeGraph：本地端程式碼知識圖譜，與「直接走圖才省錢」的真相"
date: 2026-05-23
category: ai
type: deep-dive
tags: [codegraph, mcp, knowledge-graph, tree-sitter, context-engineering, claude-code]
lang: zh-TW
tldr: "CodeGraph 用 tree-sitter 把 codebase 抽成本地 SQLite/FTS5 知識圖譜，讓 AI coding agent 查圖而不是掃檔。官方端到端 benchmark（7 repos、median of 4）平均省 35% 成本、70% tool calls；但前提是 agent 直接走圖——把探索 delegate 給只會讀檔的 subagent，CodeGraph 反而變成 overhead。"
description: "解讀 CodeGraph（colbymchenry/codegraph）：知識圖譜架構、9 個 MCP 工具的重/輕分工、benchmark 方法論的誠實演進，以及與 LSP/Serena、embedding RAG-on-code 的取捨。"
draft: false
---

每次叫 Claude Code、Cursor 或 Codex 去「理解」一個 codebase，它都得用 grep、glob、Read 把檔案掃一輪——每個 tool call 燒 token、每個檔案吃 context window，而且關掉 session 之後這份昂貴的「理解」全部蒸發，下次再從零付一次探索稅。[CodeGraph](https://github.com/colbymchenry/codegraph)（`colbymchenry/codegraph`，npm `@colbymchenry/codegraph`，截至 2026-05-23 約 18.3k stars、版本 0.7.9）把這件事前置並持久化：用 tree-sitter 把原始碼抽成本地知識圖譜，agent 用一次圖查詢就拿到「入口點 + 相關符號 + 程式碼片段 + 關係」。這篇拆三件事——它的架構、9 個 MCP 工具的設計、以及它最值得學的一課：**benchmark 的誠實退讓，和「只有 agent 直接走圖時才省錢」這個反直覺前提**。

## 它在解什麼問題

CodeGraph 的核心主張很單純：用「預先建好、可持久查詢的結構圖」取代「每次重新掃檔」。官方 README 把對比講得很白：

> When Claude Code explores a codebase, it spawns Explore agents that scan files with grep, glob, and Read — consuming tokens on every tool call. CodeGraph gives those agents a pre-indexed knowledge graph — symbol relationships, call graphs, and code structure. Agents query the graph instantly instead of scanning files.

要特別澄清一個行銷詞：CodeGraph 標題寫「Semantic Code Intelligence」，但這裡的「semantic」指的是**結構感知（structure-aware）**，不是向量 embedding。專案自己的 `CLAUDE.md` 講得很清楚：「Extraction is deterministic — derived from AST, not LLM-summarized.」沒有 embedding、沒有 vector DB、沒有 LLM 摘要，全部是確定性的 AST 抽取 + SQLite 全文索引。這個取捨決定了它後面所有的優缺點。

## 知識圖譜怎麼建

整條 pipeline 分四步，全部在本機跑，資料落在專案內的 `.codegraph/codegraph.db`：

1. **Extraction**：tree-sitter 把原始碼解析成 AST，語言專屬的 query 抽出 **node**（函式、類別、方法）與 **edge**（calls、imports、extends、implements）。
2. **Storage**：node/edge/files 進 SQLite，配 **FTS5** 全文搜尋。
3. **Resolution**：抽完之後解析參照——function call 連到定義、import 連到來源檔、class 繼承鏈、以及框架專屬 pattern。
4. **Auto-Sync**：MCP server 用原生 OS file event（FSEvents / inotify / ReadDirectoryChangesW）監看專案，**2 秒 debounce** 後增量同步，圖跟著你寫 code 即時更新，零設定。

```
原始碼 ──tree-sitter──▶ AST ──language query──▶ nodes + edges
                                                    │
                                                    ▼
                                    SQLite (.codegraph/codegraph.db) + FTS5
                                                    │
                          ┌─────────────────────────┼──────────────────────────┐
                          ▼                          ▼                          ▼
                    reference                  OS file-event             MCP server
                    resolution                 auto-sync (2s)         （9 個查詢工具）
```

支援 19+ 語言（TypeScript、JavaScript、Python、Go、Rust、Java、C#、PHP、Ruby、C/C++、Swift、Kotlin、Scala、Dart、Svelte、Vue、Liquid、Pascal/Delphi 等），並對 14 個 web 框架做「路由感知」：偵測 Django `path()`、Flask `@app.route`、FastAPI `@router.get`、Express `app.get`、Spring `@GetMapping` 等路由檔，發出 `route` node 用 `references` edge 連到 handler，讓你查一個 controller 的 caller 時能直接看到綁它的 URL pattern。

一個值得注意的設計演進：早期版本有 `.codegraph/config.json`（可調 `languages`、`exclude`、`maxFileSize` 等），但近期（PR #283／#285）**整個 config 介面被移除**，改成「副檔名對得上支援語言就索引、`.gitignore` 是唯一真實來源」，`maxFileSize`（1 MB）也固定成常數。這是刻意減少 footgun——少一個會配錯的地方。代價是：committed 但沒被 gitignore 的 `vendor/`、`dist/` 現在會一起被索引。

## 9 個 MCP 工具：重工具與輕工具的分工

當作 MCP server 跑時，CodeGraph 對外暴露 9 個工具：

| 工具 | 用途 | 性質 |
|---|---|---|
| `codegraph_search` | 用名字找符號 | 輕 |
| `codegraph_callers` | 找誰呼叫了某函式 | 輕 |
| `codegraph_callees` | 找某函式呼叫了誰 | 輕 |
| `codegraph_impact` | 改一個符號會影響哪些程式 | 輕 |
| `codegraph_node` | 取單一符號細節（可帶原始碼） | 輕 |
| `codegraph_files` | 取已索引的檔案結構 | 輕 |
| `codegraph_status` | 查索引健康度與統計 | 輕 |
| `codegraph_context` | 為一個任務建相關程式碼情境 | **重** |
| `codegraph_explore` | 一次回傳多個相關符號的原始碼 + 關係圖 | **重** |

重點在最後兩個。`context` 和 `explore` 會回傳大量原始碼，適合一次性灌進探索情境；其餘七個是輕量指標查詢。安裝器寫進 `~/.claude/CLAUDE.md` 的指令把這個分工講得很硬：

> NEVER call `codegraph_explore` or `codegraph_context` directly in the main session. These tools return large amounts of source code that fills up main session context. Instead, ALWAYS spawn an Explore agent for any exploration question (...). The main session may only use these lightweight tools directly (...): `codegraph_search` / `codegraph_callers` / `codegraph_callees` / `codegraph_impact` / `codegraph_node`.

換句話說：探索類問題（「X 怎麼運作？」）一律丟給 Explore subagent，由 subagent 用 `codegraph_explore` 把原始碼吃進它自己的 context；主對話只用輕量工具做「下手前的定點查詢」。這套設計的目的是保護 main session 的 context window 不被重工具的大量原始碼塞爆——這正是 [context engineering](/posts/ai/2026-05-19-claude-file-handling-three-layers) 的典型手法。

## benchmark：從「94%」到「~35%」的誠實退讓

CodeGraph 最值得寫一筆的，其實不是工具本身，而是它 benchmark 方法論的演進。

**早期版本**（README 與作者 [Medium 文](https://medium.com/@me_82386/i-cut-my-claude-code-api-costs-by-40-with-one-tool-12cf4306a1ab)）跑的是「單一 Explore agent」micro-benchmark：在 VS Code codebase 上開不開 CodeGraph 各跑一次，得到「~94% fewer tool calls、~82% faster」，README 標語一度寫「94% fewer tool calls · 77% faster」。問題是：那個「94%」是某個 subagent 的工具呼叫數，不是你帳單上的省錢幅度。

**現在的 README** 換成更克制的端到端設計，方法論值得完整引用：

> Each arm is `claude -p` (Claude Opus 4.7, Claude Code v2.1.145) run headlessly against the repo with `--strict-mcp-config`: WITH = CodeGraph's MCP server enabled, WITHOUT = an empty MCP config. (...) Same question per repo, 4 runs per arm, median reported. Cost = the run's `total_cost_usd`; (...) Tool calls = every tool invocation, including those inside any sub-agents the model spawns.

幾個關鍵：用 `--strict-mcp-config` 確保 WITHOUT 組是真正的空 MCP（兩邊都保留內建 Read/Grep/Bash）；同題每組跑 4 次取**中位數**；成本直接取 `total_cost_usd`；而且 tool call 數**連 subagent 內部的呼叫都算進去**。7 個 repo 跨 7 種語言，結果平均是 **35% cheaper · 59% fewer tokens · 49% faster · 70% fewer tool calls**。

| Codebase | 語言 · 規模 | Cost | Tokens | Tool calls（WITH→WITHOUT） |
|---|---|---|---|---|
| Tokio | Rust · ~700 | 52% cheaper | 81% fewer | 9 → 75 |
| Excalidraw | TS · ~600 | 47% cheaper | 73% fewer | 12 → 83 |
| VS Code | TS · ~10k | 35% cheaper | 73% fewer | 7 → 23 |
| Django | Python · ~2.7k | 34% cheaper | 64% fewer | 9 → 48 |
| Gin | Go · ~150 | 22% cheaper | 23% fewer | 7 → 8 |
| OkHttp | Java · ~640 | 17% cheaper | 41% fewer | 5 → 14 |

從「94%」退到「~35%」並不是工具變差，而是量測誠實了：micro-benchmark 量的是單一探索 subagent 省下多少 grep，端到端量的是整個任務（含所有 subagent）在 `total_cost_usd` 上的中位數。對讀者的教訓很直接——**看 benchmark 先看它量的是哪一層**。要持平地說，目前這份數據仍只有官方一手來源，沒有第三方獨立複現；增益也明顯隨 repo 變大而放大（Tokio 省 52%，但 ~150 檔的 Gin 只省 22%、tool call 幾乎沒差）。

## 核心張力：只有「直接走圖」時才省錢

README 裡有兩段話表面上打架，理解它們的調和點，才真的懂這工具。

「Why CodeGraph wins」這段點破了前提：

> CodeGraph only helps when queried directly, so its instructions steer agents to answer directly rather than delegate exploration to file-reading sub-agents — otherwise a sub-agent reads files regardless and CodeGraph becomes overhead.

但前面安裝器的指令又說「NEVER 在 main session 直接呼叫 explore/context、ALWAYS spawn Explore agent」。一個說別 delegate、一個說一定要 spawn subagent，怎麼回事？

調和點在「subagent 有沒有真的走圖」：
- 重工具（`explore`/`context`）回傳大量原始碼 → 該丟進一個**會用 CodeGraph 的** Explore subagent，而且 subagent 的 prompt 明確要求「以 `codegraph_explore` 為主工具、不要重讀它已回傳的檔案」。
- 輕量工具（`search`/`callers`/`impact`/`node`）→ 留在 main session 做定點查。
- 真正的反模式是：把探索丟給一個**忽略 CodeGraph、只會 grep/read 的泛用 subagent**——那它照樣掃檔，CodeGraph 純粹變成多裝的一層 overhead。

所以省不省錢，不取決於「有沒有裝 CodeGraph」，而取決於「agent 的工具編排有沒有真的走圖」。這跟 [MCP vs CLI vs API](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface) 那篇的結論同一個方向：工具有沒有用對位置，比工具本身更決定成敗。

## 跟替代方案比

**vs 原生 grep/Read**：這是 CodeGraph 的全部價值。大 repo 上 agent 用幾次圖查詢、常常**零檔案讀取**就答完；原生路線把預算燒在 discovery（find/ls/grep）才開始讀對的檔案。但小 repo 原生搜尋本來就便宜——ManoMano 的 [Project AEGIS](https://medium.com/manomano-tech/project-aegis-benchmarking-ai-agents-and-why-serena-is-our-new-must-have-311673db35dd) 跑 Serena 也得到同方向結論：「快速探索用 vanilla Claude，重工具反而貴 4 倍、慢 60%。」工具收益跟任務規模強相關。

**vs LSP（Serena）**：這是讀者最常問的「跟 LSP 有什麼不同？」[Serena](https://github.com/oraios/serena)（21k+ stars）走 Language Server Protocol，是**即時、型別感知**的查詢，能做精準 rename、跨檔 reference、symbol 編輯；代價是每個語言要裝對應 language server（CI/容器環境負擔重），且每次查詢都重打 LSP、不存關係。CodeGraph 是**預先算好、持久化**的 AST 圖 + FTS5：查詢快、self-contained、跨語言同一張圖，但 reference resolution 的深度（別名、繼承、型別收窄）不如活的 language server。一句話：要做大規模型別精準的重構選 LSP/Serena；要快速探索 + 低成本問答選圖。

**vs embedding RAG-on-code**：像 Codanna 從 doc comment 生 embedding 做概念搜尋、或本站介紹過的 [Graphify](/posts/ai/2026-04-10-graphify-knowledge-graph-codebase)（tree-sitter AST + LLM 語意分析，號稱省 71.5 倍 token）。CodeGraph 不碰向量也不碰 LLM 摘要，換取確定性與零 API 成本，放棄了「概念相似」搜尋（問「找驗證邏輯」不會自動命中沒寫到關鍵字的程式）。賽道上同類 MCP（GitNexus、code-graph-rag-mcp、code-review-graph）都在打「token 省 8–120 倍」的訴求；CodeGraph 的差異化是「有公開、端到端、可被質疑的 benchmark」+ 高頻迭代 + 多 agent 支援，甚至已經有人把它用 Rust 重寫成 `codemap`。

## 限制與已知問題

- **WASM fallback 會卡**：原生後端 `better-sqlite3` 裝不起來時退 WASM，慢 5–10 倍，且其 journal mode 讓 writer 擋 reader——索引進行中 MCP 查詢可能噴 `database is locked`。`codegraph status` 看 `Backend:` 行，是 `wasm` 就裝 build tools 再 `npm rebuild better-sqlite3`。
- **小專案收益低**：~150 檔的 repo 原生 grep 已經夠便宜，多裝一層不划算。
- **`.gitignore` 即真實來源**：committed 的 `vendor/`、`dist/` 會被一起索引，可能膨脹或帶噪音；>1 MB 的檔案直接略過（現為常數，不可調）。
- **reference 深度**：AST + 框架 heuristic，動態派發、別名、跨語言邊界可能漏。
- **「semantic」是行銷詞**：實際是結構圖 + FTS5 字面搜尋，沒有向量語意。
- **benchmark 只有一手**：數字隨 0.7.x 高頻發版會動，還缺第三方複現。

## 整體來說

CodeGraph 賭的是「**確定性、本地、預先索引的結構圖**」勝過「即時掃檔」與「向量 RAG」兩條路：用零成本、可重現、跨語言一張圖，換取「不懂概念相似、reference 深度不如 LSP」。它最有價值的一課其實是可遷移的心法——把好看的 micro-benchmark 數字（94%）主動降級成誠實的端到端中位數（~35%），並點破省錢的真正前提是 agent 真的直接走圖，而不是把活丟給讀檔 subagent。

對本站讀者還有一個對照點：quidproquo 自己的搜尋走的是 Cloudflare Vectorize（向量 embedding）那條語意路線，CodeGraph 走的是 FTS5 + 結構圖那條確定性路線——前者懂「相似」，後者懂「關係」，沒有誰全贏。這也呼應本站一貫的 feature-flag 心法：embedding、graph、全文檢索各有適用場景，與其賭一條路，不如讓每條都能單獨開關、用 benchmark 決定哪條真的省到錢。

## 參考資料

- [CodeGraph — GitHub repo](https://github.com/colbymchenry/codegraph)
- [CodeGraph — npm `@colbymchenry/codegraph`](https://www.npmjs.com/package/@colbymchenry/codegraph)
- [Colby McHenry：I Cut Claude Code Exploration Time and Costs by 90%（作者原文，早期 micro-benchmark）](https://medium.com/@me_82386/i-cut-my-claude-code-api-costs-by-40-with-one-tool-12cf4306a1ab)
- [Graham Brooks：Building a Code Knowledge Graph for AI Agents（codemap，Rust 再實作）](https://www.grahambrooks.com/post/building-a-code-knowledge-graph-for-ai-agents)
- [Serena — GitHub repo（LSP-based 對照組）](https://github.com/oraios/serena)
- [Codanna Discussion #30：Differences with Serena?](https://github.com/bartolli/codanna/discussions/30)
- [Project AEGIS — Benchmarking AI Agents（ManoMano，獨立 benchmark）](https://medium.com/manomano-tech/project-aegis-benchmarking-ai-agents-and-why-serena-is-our-new-must-have-311673db35dd)
- 站內：[Graphify：把程式碼和文件變成可查詢的知識圖譜](/posts/ai/2026-04-10-graphify-knowledge-graph-codebase)
- 站內：[MCP（Model Context Protocol）：AI Agent 工具呼叫的標準化協定](/posts/ai/2026-03-22-mcp-model-context-protocol)
- 站內：[MCP vs CLI vs API：Agent 工具介面的真實分界](/posts/ai/2026-04-18-mcp-vs-cli-vs-api-agent-tool-interface)
- 站內：[GraphRAG：把知識做成圖，讓 LLM 沿著關係推理](/posts/ai/2026-03-12-graph-rag)
