---
title: "quidproquo 部落格改進完整規劃：從內容、技術、RAG 設計到 Harness 基礎建設"
date: 2026-04-18
type: project
category: product
tags:
  - quidproquo
  - rag
  - ai-agent
  - harness-engineering
  - context-engineering
  - blog
  - product-design
lang: zh-TW
tldr: "用自己寫的 30+ 篇 RAG/Agent 文章交叉檢視部落格現狀，整理出橫跨內容品質、網站技術、RAG 設計修正、Harness 基礎建設、AI Agent 應用的完整改進清單，按優先級排列、不分階段。"
description: "227 篇文章、49 個斷連結、19 個 RAG 設計問題、4 個 harness 缺口——一份用文章自我檢視的部落格改進規劃。"
draft: false
---

> 🌏 [English version](/posts/product/2026-04-18-quidproquo-improvement-roadmap-en)

把自己寫的 RAG、Agent、Context Engineering、Harness Engineering 文章拿來檢視部落格本身，發現自己寫了「Intelligence without infrastructure is just a demo」，但平台本身缺的正是 infrastructure。這篇整理一份不分階段、按優先級排列的完整行動清單，涵蓋內容品質、網站技術、RAG 設計修正、Harness 基礎建設、AI Agent 應用五個面向。

## 現況快照

- **內容**：227 篇文章（AI 121、Tech 98、Product 7、Education 1）
- **斷連結**：49 個內部斷連結（佔內部連結的 36%）
- **缺欄位**：213 篇缺 `type`（94%）、199 篇缺 `series`（88%）、7 篇缺 `tldr`
- **Tag 不一致**：`ai-agent` vs `ai-agents` 共 35 篇
- **草稿**：17 篇（多為 Claude Code deep-dive 系列骨架）
- **基礎設施**：Vectorize、D1、Workers AI 都已綁定，但 Embedding Pipeline、Chat API、Agent 節點全部未實作
- **Harness**：沒有根目錄 CLAUDE.md、沒有 progress.txt、沒有 pre-commit hook、沒有 Post Evaluator

## 優先級總覽

整份規劃按「修正成本 vs 影響範圍」分為四級：

- **P0（立即）**：低成本、高影響、會讓使用者看到 broken 狀態的問題
- **P1（短期）**：中成本、解決系統性風險或長期負債
- **P2（中期）**：較高成本但影響使用者體驗或開發效率
- **P3（長期）**：實驗性或需要更多前置依賴的項目

## P0 立即執行（成本低、影響大）

### 內容修正

**修復 49 個內部斷連結**
- 重災區：`ai/2026-04-01-agent-cli-guidelines.md` 有 10 個斷連結
- 處理方式：暫時改為 plain text 標註「即將推出」，避免讀者點 404

**統一 tag 命名**
- `ai-agent`（21 篇）+ `ai-agents`（14 篇）→ 統一為 `ai-agent`
- 一個 sed 批次處理可完成

**RAG 設計參數修正（改數字就好）**
- `semantic_cache_threshold`：`0.92` → `0.95`（你的 `semantic-caching.md` 文章明確指出 0.90-0.94 是「相關但不同」）
- `chunk_size`：改用 token 計算或降為 1500 chars（中文環境下 2000 chars ≈ 800-1000 tokens，超出建議範圍）
- 加入 `reranker_min_keep: 3`（你的 `cross-encoder-reranking.md` 明確建議的安全網）

**建立根目錄 CLAUDE.md**
- 你的 Harness 文章核心原則：「Repository as Single Source of Truth」
- 內容：技術棧、目錄結構、開發流程、命名規範、決策理由
- 沒有這份文件，每個新 session 的 agent 都得重新摸索整個專案

### 網站技術

**建立 404 錯誤頁面**
- 目前沒有自訂 404，使用者遇到斷連結看到的是預設錯誤畫面
- 應提供搜尋框 + 熱門文章推薦

**`check-post-references.mjs` 加入 CI**
- Script 已存在但沒跑，導致 49 個斷連結直接上線
- 你寫的「Linter 是法律，prompt 是建議」原則的直接違反

**Pre-commit hook（lint + reference check）**
- 用 husky 或 simple-git-hooks
- 阻擋斷連結和 lint 錯誤進入 repo

## P1 短期（1-2 週）

### 內容補強

**補上 213 篇缺失的 `type` 欄位**
- 用簡單腳本批次補：根據檔名 path 中的 `deep-dive/` 推導
- 或用 LLM 一次跑完所有 markdown 自動分類
- type 補齊後，分類頁的 type 篩選功能才有意義

**補上 7 篇缺失的 `tldr`**
- 對 deep-dive 類文章特別重要
- 可以用 Claude 一次性批量生成，人工 review

**Frontmatter `type` 改為 required**
- 更新 `src/content.config.ts` schema
- 用 schema 強制，不靠 prompt 約束（再次呼應 Harness 文章原則）

### 網站技術

**英文版搜尋頁**
- `/src/pages/search.astro` 硬編碼 `lang="zh-TW"`
- 建立 `/src/pages/en/search.astro` 或動態偵測語系

**英文首頁加上 about 區塊**
- 中文首頁有完整網站理念介紹，英文版沒有
- 英文讀者看不懂「Quid Pro Quo」是什麼

**字型載入優化（影響 LCP）**
- 加入 `<link rel="preload" as="font">`
- 設定 `font-display: swap`
- `@fontsource/noto-sans-tc` 已安裝但沒正確載入

**圖片尺寸與 lazy loading（影響 CLS）**
- 啟用 `astro:assets` 圖片優化
- 所有 markdown 圖片補上 `loading="lazy"` 與 width/height

**無障礙基本款**
- 加入「跳至主要內容」連結（Skip Navigation）
- 加 `:focus-visible` 鍵盤導航樣式
- 驗證 `--text-muted: #999` 是否符合 WCAG AA 對比度

### Harness 基礎建設

**建立 `progress.txt` 機制**
- 你的 `anthropic-harness-design.md` 最推崇的設計：「最低成本的 episodic memory 實作，不需要 vector database，一個文字檔就夠了」
- 自己卻沒用——這是最諷刺的缺口

**Session-start hook**
- 自動跑 `pnpm lint` + 讀 `progress.txt`
- 對應 Anthropic 的「啟動儀式」設計

**Post skill 加入 Evaluator 節點**
- 你的文章核心：「讓一個 agent 同時當運動員和裁判，它會傾向對自己寬容」
- Post skill 目前只有 Generator，沒有獨立 Evaluator
- Evaluator 應檢查：frontmatter 完整性、內部連結有效性、tag 一致性、標題結構

### RAG 設計修正

**Deterministic Validation Node（Stripe Blueprint 模式）**
- 你的 `internal-ai-coding-agents.md` 講 Stripe Minions 的核心架構
- 在 Writer → Critic 之間插入確定性驗證：Markdown 語法、source URL 存在、Mermaid 語法
- 不依賴 AI 每次都做對，而是用確定性檢查點攔截錯誤

**工具描述品質規範**
- `search_blog_posts` vs `search_abstract_index` vs `search_docs` 使用時機區分不明確
- 每個工具加上：何時使用、何時不使用、預期回傳格式
- `search_abstract_index` 改為 Research 節點的內部策略，不暴露為獨立工具

**Critic 失敗降級策略**
- Stripe 設計：「LLM 兩次修不好就標記人工處理，第三次也修不好——只是在燒 token」
- 重試 2 次仍低於門檻 → 標註「⚠️ 此回答可能不完整，建議直接閱讀相關文章」
- 不要再呼叫 LLM

**Prompt 改用「描述終態」風格**
- Spotify 發現：過度嚴格的逐步指令會讓 agent 在複雜任務上卡住
- Agent prompt 應描述「成功的回答長什麼樣」而非「按步驟做」

## P2 中期（1-2 個月）

### AI Agent 應用實作

**Embedding Pipeline + 語意搜尋**
- 把 197 篇文章 embed 進 Vectorize（已綁定但未使用）
- 實作 Hybrid Search：Vectorize 語意 + D1 FTS5 BM25 + RRF 融合
- 加入 BGE-Reranker 重排
- 這是後續所有 AI 功能的基礎

**AI 驅動的相關文章推薦**
- 取代目前 `relatedPosts.ts` 純 tag 匹配
- 加權計算：40% tag overlap + 30% 分類 + 20% 時近性 + 10% 同系列
- 單一 tag 文章加 fallback：用分類補

**自動 TL;DR 與 description 生成**
- 對應 Context Engineering 的「Compress」策略
- 解決 7 篇缺 tldr 的問題，順便為長文加三層摘要

**對話式部落格助手（RAG Chat Phase 1）**
- LangGraph Pipeline：Planner → Research → Normalize → Writer → Critic → Related Posts
- SSE 串流回覆
- 訪客 IP 限額 5 次/日，站長無限
- 但要重新評估是否真需要 LangGraph——你的 `langgraph-agent-orchestration.md` 也警告：「如果只需要簡單重試，LangGraph 是殺雞用牛刀」

### RAG 設計補強

**MMR 多樣性重排**
- 你的 `mmr-diversity-reranking.md` 詳細描述，λ = 0.7
- 在 reranker 後、Writer 前插入
- 避免推薦結果中多篇文章講同一件事

**Adaptive RAG queryType 路由**
- 你的 `query-classification-adaptive-routing.md` 的 6 種類型分類
- Planner 輸出 `complexity: 'simple' | 'medium' | 'complex'`
- Simple 跳過 HyDE/Multi-query，General-knowledge 跳過檢索

**CRAG 加入 filter 放寬策略**
- 你的 `corrective-rag-crag.md` 的核心策略：零結果時漸進放寬次要 filter，保留核心 filter
- 順序：先放寬 filter 重試 → 仍然低分 → 再 web search fallback

**Critic 加 answer-relevance 檢查**
- 不只檢查 grounding（論點有來源），也檢查 answer relevance（真的回答了問題）
- 對應 RAGAS 的 Answer Relevancy 指標

**Critic 加 drift 偵測**
- 你的 `phil-schmid-agent-harness.md` 核心觀點
- 檢查 Research 過程中是否偏離原始查詢意圖
- 不只驗證 grounding

### Harness 基礎建設

**設計決策 ADR（Architectural Decision Records）**
- 為什麼用 BGE-large？為什麼 chunk 2000？為什麼 cache 0.95？
- 對應 Agent-Readable Code 原則：把隱性知識寫出來

**RAG pipeline 每個技術加 feature flag**
- 對應 Bitter Lesson：允許隨時拆掉「聰明」的部分
- HyDE、Multi-query、Reranker、Critic 都應該可以單獨開關

**Shadow Mode A/B 比較機制**
- 原本規劃在 Phase 3，建議提前
- 開啟某技術 vs 關閉，比較 RAGAS 分數
- 才能知道哪些「優化」其實沒用

**Context Checkpoint 系統**
- 對應 Context Durability 概念
- 動態壓縮門檻：`threshold = model_context_window * 0.7`（保留 30% 給生成）
- 而非硬編碼 8000 tokens

### 網站技術

**RSS Feed 加上作者資訊**
- 補 `<author>` 標籤
- 影響其他 feed reader 的呈現

**Series 系列化組織**
- 88% 文章沒有 `series` 欄位
- 把 RAG 系列、Claude Code 系列、AI Agent 系列正式組織起來

**多語言翻譯 Pipeline（Multi-Agent）**
- Translator → Cultural Reviewer → Native Checker
- 用來快速擴充英文版內容

## P3 長期（3 個月以上）

### AI 進階功能

**站長端 episodic memory**
- 你的 `ai-agents-context-cognition-action.md` 強調的記憶類型
- 參考 Hermes Agent 的 `user profile dialectic` 模式
- 記住寫作偏好、常用範本

**Judge sampling 30%**
- 你的 `rag-cost-optimization.md` 建議
- 簡單查詢跳過 Critic，只對 complex 查詢執行
- 預期省 20-30% 成本

**BM25 短路邏輯**
- BM25 回傳 ≥ 5 結果時跳過向量搜尋
- 對於精確名詞查詢（如「LangGraph 是什麼？」）特別有效

**RAGAS 評估 pipeline + Golden Dataset**
- 50-100 個測試案例的 ground truth
- Faithfulness、Answer Relevance、Context Precision、Context Recall
- 持續追蹤每次調整對品質的影響

**GraphRAG（實體關係圖）**
- 從文章中抽取實體與關係
- 適合跨文章查詢（如「跟 Claude Code 相關的所有工具」）

**自訂文件上傳功能**
- PDF / Markdown / URL 三種來源
- 對訪客的價值有限，主要是站長自用

## 完整修正清單對照表

| # | 項目 | 優先級 | 來源文章 / 設計文件 |
|---|------|--------|------|
| 1 | 修復 49 個斷連結 | P0 | 內容檢查 |
| 2 | Tag 統一 ai-agent | P0 | 內容檢查 |
| 3 | Cache threshold 0.92 → 0.95 | P0 | semantic-caching.md |
| 4 | Chunk size 改 token 計算 | P0 | chunking-strategies.md |
| 5 | 加 reranker_min_keep: 3 | P0 | cross-encoder-reranking.md |
| 6 | 建立根目錄 CLAUDE.md | P0 | harness-engineering-evolution.md |
| 7 | 建立 404 頁 | P0 | 網站檢查 |
| 8 | check-post-references 加入 CI | P0 | harness 原則 |
| 9 | Pre-commit hook | P0 | harness 原則 |
| 10 | 補 213 篇 type 欄位 | P1 | 內容檢查 |
| 11 | 補 7 篇 tldr | P1 | 內容檢查 |
| 12 | type 改為 required | P1 | harness 原則 |
| 13 | 英文版搜尋頁 | P1 | 網站檢查 |
| 14 | 英文首頁 about 區塊 | P1 | 網站檢查 |
| 15 | 字型載入優化 | P1 | Core Web Vitals |
| 16 | 圖片尺寸 + lazy loading | P1 | Core Web Vitals |
| 17 | 無障礙基本款 | P1 | WCAG |
| 18 | 建立 progress.txt | P1 | anthropic-harness-design.md |
| 19 | Session-start hook | P1 | anthropic-harness-design.md |
| 20 | Post skill Evaluator | P1 | google-multi-agent-patterns.md |
| 21 | Deterministic Validation Node | P1 | internal-ai-coding-agents.md |
| 22 | 工具描述品質規範 | P1 | context-engineering-guide.md |
| 23 | Critic 降級策略 | P1 | internal-ai-coding-agents.md |
| 24 | Prompt 改描述終態風格 | P1 | internal-ai-coding-agents.md |
| 25 | Embedding Pipeline | P2 | RAG 設計 |
| 26 | AI 相關文章推薦 | P2 | context-engineering-guide.md |
| 27 | 自動 TL;DR 生成 | P2 | context-engineering-guide.md |
| 28 | RAG Chat Phase 1 | P2 | RAG 設計 |
| 29 | MMR 多樣性重排 | P2 | mmr-diversity-reranking.md |
| 30 | Adaptive RAG 路由 | P2 | query-classification-adaptive-routing.md |
| 31 | CRAG filter 放寬 | P2 | corrective-rag-crag.md |
| 32 | Critic answer-relevance | P2 | rag-evaluation-frameworks.md |
| 33 | Critic drift 偵測 | P2 | phil-schmid-agent-harness.md |
| 34 | 設計決策 ADR | P2 | harness-engineering-evolution.md |
| 35 | RAG feature flag | P2 | phil-schmid-agent-harness.md |
| 36 | Shadow A/B 比較 | P2 | phil-schmid-agent-harness.md |
| 37 | Context Checkpoint 系統 | P2 | phil-schmid-agent-harness.md |
| 38 | RSS 作者資訊 | P2 | 網站檢查 |
| 39 | Series 系列化 | P2 | 內容檢查 |
| 40 | 翻譯 Pipeline | P2 | google-multi-agent-patterns.md |
| 41 | 站長 episodic memory | P3 | ai-agents-context-cognition-action.md |
| 42 | Judge sampling 30% | P3 | rag-cost-optimization.md |
| 43 | BM25 短路 | P3 | rag-cost-optimization.md |
| 44 | RAGAS 評估 pipeline | P3 | rag-evaluation-frameworks.md |
| 45 | GraphRAG | P3 | RAG 設計 |
| 46 | 自訂文件上傳 | P3 | RAG 設計 |

## 整體來說

這份規劃的核心邏輯不是「Phase 1 / 2 / 3」這種瀑布式排程，而是「**先修把柄，再蓋大樓**」：

- **P0 是把柄問題**：使用者已經能看到 broken 狀態（404、斷連結、錯誤的 cache 結果），不修就是讓品牌持續受損
- **P1 是地基問題**：harness 基礎建設、內容 schema 強制、無障礙基本款——這些不做，後面的功能都會踩到
- **P2 是大樓**：AI 功能、RAG 對話、進階檢索——必須在地基穩固後再蓋
- **P3 是裝飾**：實驗性、長期負債——可以跟著模型升級節奏調整

最諷刺的發現：**自己寫了 30+ 篇教人怎麼建 RAG Agent 的文章，但部落格本身缺的不是 AI 功能，而是文章中反覆強調的基礎建設**——CLAUDE.md、progress.txt、pre-commit hook、Evaluator、Linter as Law。

「Intelligence without infrastructure is just a demo」—— Phil Schmid 這句話送給自己。

## 參考資料

- [Multi-Agent RAG Patterns](/posts/ai/2026-03-16-multi-agent-rag-patterns)
- [Context Engineering Guide](/posts/ai/2026-03-24-context-engineering-guide)
- [LangGraph Agent Orchestration](/posts/ai/2026-03-27-langgraph-agent-orchestration)
- [AI Agents: Context, Cognition, Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action)
- [Anthropic Harness Design](/posts/ai/2026-03-28-anthropic-harness-design)
- [Phil Schmid: Agent Harness](/posts/ai/2026-03-28-phil-schmid-agent-harness)
- [Harness Engineering Evolution](/posts/ai/2026-03-28-harness-engineering-evolution)
- [Google Multi-Agent Patterns](/posts/ai/2026-03-28-google-multi-agent-patterns)
- [Internal AI Coding Agents（Stripe / Spotify / Coinbase）](/posts/ai/2026-04-04-internal-ai-coding-agents)
- [Chunking Strategies](/posts/ai/2026-03-12-chunking-strategies)
- [BGE-M3 Embedding Model Selection](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)
- [Hybrid Search BM25 Vector RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)
- [Cross-Encoder Reranking](/posts/ai/2026-03-12-cross-encoder-reranking)
- [MMR Diversity Reranking](/posts/ai/2026-03-12-mmr-diversity-reranking)
- [Semantic Caching](/posts/ai/2026-03-12-semantic-caching)
- [Corrective RAG (CRAG)](/posts/ai/2026-03-12-corrective-rag-crag)
- [Query Classification & Adaptive Routing](/posts/ai/2026-03-12-query-classification-adaptive-routing)
- [RAG Cost Optimization](/posts/ai/2026-03-12-rag-cost-optimization)
- [RAG Evaluation Frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks)
