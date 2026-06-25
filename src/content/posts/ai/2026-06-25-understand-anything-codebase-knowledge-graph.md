---
title: "Understand-Anything：把 20 萬行 codebase 變成會教你的知識圖"
date: 2026-06-25
category: ai
type: deep-dive
tags: [agent-skills, claude-code, multi-agent, knowledge-graph, developer-tools, codebase-understanding]
lang: zh-TW
tldr: "67.9k stars 的開源 Claude Code plugin，用 Tree-sitter + 5 個 LLM agent 把任何 codebase 轉成可探索的知識圖，目標不是畫出複雜的依賴圖，而是讓你真正讀懂業務邏輯。"
description: "Understand-Anything 深度導讀：多 agent pipeline 架構、Tree-sitter 與 LLM 的分工、與 code-review-graph / Axon 的比較、適合與不適合的場景。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-06-25-understand-anything-codebase-knowledge-graph-en)

你加入新團隊，clone 了 repo，打開 codebase——20 萬行代碼，沒有任何人告訴你從哪裡開始。現有的 dependency graph 工具只告訴你「這個 file import 了那個 file」，但不告訴你為什麼、這個 flow 從哪裡開始、改這裡會壞什麼業務流程。[Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) 要補的正是這層語意。

口號是 **Graphs that teach > graphs that impress**。2026 年 5 月底登上 GitHub Trending all-language #1，目前 67.9k stars。

## 核心概念：結構 vs. 意義

大多數 codebase 視覺化工具給你的是「結構」——節點是 file、邊是 import。你看到 23 個節點、34 條邊，然後呢？

Understand-Anything 要給你的是「意義」：

- 這個模組負責的是 **Authentication flow** 還是 **Payment pipeline**？
- 這個 function 的存在理由是什麼？
- 如果我改這裡，哪些業務能力會受影響？

這個差異決定了它的整個技術架構選擇。

## 技術架構：Tree-sitter + LLM 混合

[Tree-sitter](https://tree-sitter.github.io/) 做靜態分析，LLM 做語意解讀，各做各擅長的事：

| 層 | 工具 | 負責 | 特性 |
|---|---|---|---|
| 靜態 | Tree-sitter | import map、call graph、dependency edges | 確定性，同樣的 code 永遠產生同樣的邊 |
| 語意 | LLM（可換 Ollama） | 自然語言摘要、intent、跨模組隱性關係 | 靈活，可替換為本地模型 |

這個分工設計讓「結構」可復現、可 diff，「語意」靈活但可調換（企業可接 Ollama 避免資料外洩）。

### Multi-Agent Pipeline

`/understand` 命令背後跑 5~6 個專門化 agent：

```
Project-Scanner → File-Analyzer → Summarizer → Relationship-Mapper → Graph-Reviewer
                                                                              ↓
                                                              [選用] Domain-Analyzer
```

1. **Project-Scanner**：AST + regex 掃描所有 file，收集 metadata（語言、大小、最後修改時間）。100k lines 約 30 秒。
2. **File-Analyzer**：Tree-sitter 解析每個 file 的結構
3. **Summarizer**：LLM 為每個 file / function 產生自然語言摘要
4. **Relationship-Mapper**：LLM 發現跨模組的隱性關係（靜態分析看不到的語意連結）
5. **Graph-Reviewer**：驗證輸出 JSON 的一致性、referential integrity（確保「被引用但不存在」的節點不會進圖）
6. **Domain-Analyzer**（選用）：把程式碼映射到業務 domain，產生橫切視圖（Authentication / Payment / User Lifecycle 等），需額外 3–5 分鐘 LLM 呼叫

整體執行時間：
- 小型（10k lines）：2–3 分鐘
- 中型（100k lines）：8–12 分鐘
- 大型（500k lines）：30–45 分鐘
- 超大型（1M+ lines）：1–2 小時

增量更新（`--auto-update`）掛 post-commit hook，只重新分析改過的 file，通常 10–30 秒。

### 輸出格式

分析完產生兩個東西：

- `.understand-anything/knowledge-graph.json`：結構化圖資料
- `.understand-anything/dashboard/index.html`：互動式 dashboard

**關鍵設計**：輸出可以 commit 到 repo。新成員第一天就能打開 dashboard，不需要自己重跑 LLM pipeline。

## 主要功能

v2.0 之後支援 26+ 種檔案類型，不只是程式碼，Dockerfile、Terraform、SQL、Markdown 都進圖。

| 指令 | 功能 |
|---|---|
| `/understand` | 主 pipeline，建立知識圖 |
| `/understand-dashboard` | 啟動互動式視覺 dashboard |
| `/understand-chat` | 用自然語言問 codebase 問題 |
| `/understand-diff` | 分析 diff / PR 的業務影響範圍 |
| `/understand-explain` | 解釋特定 file 或 function |
| `/understand-onboard` | 產生 guided tour，引導新成員照依賴順序學習架構 |
| `/understand-domain` | 映射到業務 domain（需額外 LLM 費用） |
| `/understand-knowledge` | 分析 Karpathy-pattern wiki，把 wikilinks 轉成知識圖 |

平台支援：Claude Code（原生）、Codex、Cursor、Copilot、Gemini CLI、OpenCode 等，macOS / Linux / Windows 都有安裝腳本。

## 與競品的比較

這個空間在 2026 年 5 月同時湧現幾個工具，核心取捨是**語意豐富度 vs. LLM 成本**：

| 工具 | 方法 | 語意摘要 | 增量更新 | 本地模型 |
|---|---|---|---|---|
| [**Understand-Anything**](https://github.com/Egonex-AI/Understand-Anything) | Tree-sitter + LLM | ✅ 豐富 | ✅ | ✅ Ollama |
| [code-review-graph](https://github.com/nicholasgasior/code-review-graph) | Pure tree-sitter + SQLite | ❌ | ✅ git diff | N/A |
| [CodeGraph](https://github.com/Hacker-GPT/CodeGraph) | Tree-sitter，16+ 語言 | ❌ | ❌ | N/A |
| Axon | KuzuDB + 12-phase LLM | ✅ | ✅ --watch | ❌ |
| [Sourcegraph](https://sourcegraph.com/) | 企業 search + index | 部分 | ✅ | ❌ |

**Pure static 的反例**：`code-review-graph` 宣稱在下游 agent 使用時可達到 6.8–49x 的 token 節省，因為把結構預先索引進 SQLite，agent 不需要重複掃 file。代價是完全沒有「為什麼」的語意層。

Understand-Anything 的選擇是犧牲 MCP 整合（目前直接走 plugin 不走 MCP server），換來人類可讀的自然語言解釋和互動式 dashboard。

## 適合 / 不適合的場景

**適合**：

- **新人 onboarding**：committed graph + `/understand-onboard` guided tour，Day 1 就能看懂架構，而不是盲目 grep
- **理解 legacy codebase**：前任工程師離職、程式沒文件，LLM 摘要幫你補回語意層
- **大型 PR review 前置**：`/understand-diff` 分析改動的 blast radius，找出意外的跨模組影響
- **知識庫整理**：`/understand-knowledge` 把 Karpathy-pattern LLM wiki 轉成知識圖

**不適合**：

- **預算敏感的 CI pipeline**：每次 build 重跑完整 LLM pipeline 成本高，建議手動或用 `--auto-update` 增量
- **需要 deterministic audit trail**：LLM 摘要不保證一致性，同樣的 code 可能在不同 run 產生略微不同的描述
- **超大 monorepo（1M+ lines）首次分析**：需要 1–2 小時，不適合臨時使用

## 已知問題

從 [issues](https://github.com/Egonex-AI/Understand-Anything/issues) 挖到幾個值得注意的：

- **Dashboard 阻塞主執行緒**：d3-force layout 在 3k nodes 時同步執行約 4.3 秒；`layout.worker.ts` 檔案存在但未被啟用
- **SKILL.md agent-dispatch 路徑不匹配**：`agents/<name>.md` 與實際安裝路徑不符，導致某些平台上 deterministic extract-structure pass 被跳過
- **merge-batch-graphs.py 偶爾掉 batch**：無法穩定復現，尚在追蹤

## 整體來說

Understand-Anything 的核心賭注是：**大多數人面對陌生 codebase 需要的不是更好的 dependency graph，而是一個會解釋業務邏輯的嚮導**。這個判斷是對的，所以它能在幾週內衝到 67.9k stars。

代價是透明的：LLM API 費用你得自己付，初次分析需要時間，語意摘要不是 deterministic 的。如果你只需要「這個 file 依賴哪些 file」，pure static 工具更快更便宜。如果你需要「這個模組在系統裡扮演什麼角色」，Understand-Anything 是目前最完整的開源選項。

MIT 授權、可接本地模型、輸出可 commit 進 repo，風險足夠低，值得試試。

## 參考資料

- [Egonex-AI/Understand-Anything — GitHub](https://github.com/Egonex-AI/Understand-Anything)
- [Understand-Anything 官方網站](https://understand-anything.com)
- [v2.0.0 Release Notes](https://github.com/Egonex-AI/Understand-Anything/releases)
- [Trendshift — trending stats](https://trendshift.io/repositories/23482)
- [Tree-sitter 官方文件](https://tree-sitter.github.io/)
- [Understand Anything: Turn Any Codebase Into an Interactive Knowledge Graph — DEV Community](https://dev.to/arshtechpro/understand-anything-turn-any-codebase-into-an-interactive-knowledge-graph-37ed)
- [ddewhurst.com — Understand-Anything competitive landscape](https://ddewhurst.com/blog/understand-anything-knowledge-graph-for-your-codebase)
