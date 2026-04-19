部落格改進優化建議
根據對 quidproquo 專案 227 篇文章與網站架構的完整分析，以下是分優先級的改進建議：

🔴 高優先級

1. 修復 49 個內部斷連結（影響約 40 篇文章）
36% 的內部連結指向不存在的文章（未撰寫或仍為草稿）
重災區：ai/2026-04-01-agent-cli-guidelines.md 有 10 個斷連結
建議：移除或標註「即將推出」，避免讀者點擊後 404
2. 缺少 404 錯誤頁面
目前沒有自訂 404 頁面，使用者遇到斷連結會看到預設錯誤畫面
建議：建立 /src/pages/404.astro，提供搜尋框與熱門文章推薦
3. type 欄位缺失率 94%（213 篇）
僅約 14 篇有明確標示 type（debug / deep-dive / guide / project）
分類頁有按 type 篩選功能，但幾乎沒有資料可篩
建議：批次補上 type 欄位，提升內容分類導航體驗
4. Tag 命名不一致
ai-agent（21 篇）vs ai-agents（14 篇）— 應統一為一個
建議：統一為 ai-agent（單數形式）
🟡 中優先級
5. 英文版搜尋頁缺失
/src/pages/search.astro 硬編碼 lang="zh-TW"，無英文版本
建議：建立 /src/pages/en/search.astro 或動態偵測語系
6. 英文首頁缺少「關於」區塊
中文首頁有完整的網站理念介紹，英文版沒有
英文讀者無法理解「Quid Pro Quo」的意涵
建議：在 /src/pages/en/index.astro 補上對應的 about section
7. 字型載入優化（影響 LCP）
未使用 <link rel="preload"> 預載字型
@fontsource/noto-sans-tc 已安裝但未正確載入
建議：加入字型預載與 font-display: swap
8. 圖片缺少尺寸屬性（影響 CLS）
Markdown 圖片無 width/height，載入時會造成版面跳動
未啟用 Astro 內建的圖片優化功能
建議：在 astro.config.mjs 啟用 astro:assets，並加入 loading="lazy"
9. 無障礙性（Accessibility）不足
缺少「跳至主要內容」連結（Skip Navigation）
無 :focus-visible 鍵盤導航樣式
--text-muted: #999 可能不符合 WCAG AA 對比度標準
建議：依序補上 skip link、focus 樣式、驗證色彩對比
10. 相關文章演算法過於簡單
/src/utils/relatedPosts.ts 僅用 tag 重疊度計算
不考慮分類、時間、系列關聯
單一 tag 的文章會得到空的推薦結果
建議：加權計算（40% tag + 30% 分類 + 20% 時近性 + 10% 同系列），並加入 fallback
🟢 低優先級
11. Series 系列化組織不足
88% 文章沒有 series 欄位
許多主題相關的文章其實可以組成系列（如 RAG 系列、Claude Code 系列）
建議：將高度相關的文章群組化為正式 series
12. 7 篇文章缺少 TL;DR
長文缺少快速摘要，降低掃讀效率
建議：為所有 deep-dive 類文章補上 tldr 欄位
13. RSS Feed 缺少作者資訊
/src/pages/rss.xml.ts 未包含 <author> 標籤
建議：加入作者元資料
14. 17 篇草稿文章的處理
全部為 Claude Code deep-dive 系列的框架文章
被其他已發布文章引用，造成斷連結
建議：優先完成或暫時移除引用
15. 日期分布集中
87% 文章集中在 2026 年 3 月，4 月僅 30 篇
建議：考慮排程發布，維持穩定的內容節奏
快速統計
指標 數值
總文章數 227 篇
斷連結數 49 個
草稿數 17 篇
缺 type 欄位 213 篇（94%）
缺 series 欄位 199 篇（88%）
缺 tldr 7 篇
Tag 不一致 ai-agent vs ai-agents（35 篇）
需要我針對任何一項建議進行實作嗎？

1 step
1 step
我也想知道ai agent 相關文章可以如何應用在部落格

Let me first dive into the AI agent-related articles to understand the existing content and find applicable ideas.

Ran 2 agents
Ran 2 agents

AI Agent 概念應用於部落格的具體建議
你的部落格已經寫了 30+ 篇 AI Agent 文章，而且基礎設施（D1、Vectorize、Workers AI、Crawl Pipeline）都已配置好。以下是如何把「自己寫的東西」實際用在「自己的平台」上：

一、已有基礎設施 vs 缺口
已就緒 尚未實作
Crawl Pipeline（Browser Rendering → D1） LangGraph Agent 節點（9 個已設計）
D1 posts + post_chunks + doc_chunks 表 Vectorize 嵌入寫入/查詢
Vectorize Index 已建立（1024 維） /api/chat 對話端點
Workers AI 綁定（BGE-large） Chat UI 元件
完整 RAG 設計文件（8 頁） Embedding Pipeline
197 篇文章已 sync 到 D1 語意快取 / Reranker
二、六個可落地的 Agent 應用場景

1. 智慧語意搜尋（直接對應你的 RAG 文章）
你在 2026-03-16-multi-agent-rag-patterns.md 寫的 Hybrid Search 架構可以直接套用：

使用者查詢 → Query Rewriting → 並行搜尋
                                 ├─ Vectorize (語意)
                                 └─ D1 FTS5 (關鍵字)
                              → RRF 融合排序
                              → BGE-Reranker 重排
                              → 回傳結果

現有資源：Vectorize index 已建、D1 已有 post_chunks 表、BGE 模型已綁定
缺的只是：embedding pipeline 跟查詢端點
參考文章：你自己的 context-engineering-guide.md 中的 Select 策略
2. AI 驅動的相關文章推薦（取代純 Tag 匹配）
目前 /src/utils/relatedPosts.ts 只用 tag overlap，你在 ai-agents-context-cognition-action.md 提到的 Semantic Memory 概念可以直接升級：

當前文章 embedding → Vectorize 最近鄰查詢
                   → 過濾同篇 + 同 series
                   → 結合 tag 權重 + 時間衰減
                   → 回傳 top 5

這是 最低成本、最高可見度 的改善——讀者馬上能感受到推薦品質的提升。

1. 自動內容品質檢查（Generator-Evaluator 模式）
你在 anthropic-harness-design.md 詳細分析了 Anthropic 的 GAN 式 Generator-Evaluator，可以應用在發文流程：

新文章 markdown → Evaluator Agent 檢查：
  ├─ Frontmatter 完整性（type、tldr、description）
  ├─ 內部連結有效性（49 個斷連結問題）
  ├─ Tag 一致性（ai-agent vs ai-agents）
  ├─ 標題結構（H2/H3 層級）
  └─ 閱讀時間估算
→ 產出品質報告 + 自動修復建議

這可以做成 Claude Code Hook，在 git commit 前自動執行，類似 Stripe Minions 的 Blueprint 模式（internal-ai-coding-agents.md）。

1. 多語言翻譯工作流（Multi-Agent Pipeline）
你在 google-multi-agent-patterns.md 分析的 Sequential Pipeline + Generator & Critic 完美適用：

中文原文 → Translator Agent（Claude Sonnet）
        → Cultural Reviewer Agent（慣用語、語境調整）
        → Native Checker Agent（語法、自然度）
        → 輸出英文版 + 翻譯品質評分

目前英文內容偏少，這個 pipeline 能快速擴充英文版文章。

1. 智慧 TL;DR 與摘要生成
你在 context-engineering-guide.md 提到的 Compress 策略 可以直接用來解決 7 篇缺 tldr 的問題，更可以擴展為：

全文 → Section Summarizer（各段摘要）
     → Progressive Compressor（漸進壓縮）
     → 輸出三層摘要：
       ├─ tldr（一句話）
       ├─ description（2-3 句）
       └─ executive summary（一段）

1. 對話式部落格助手（Phase 1 RAG Chat）
你的 RAG 設計文件已經規劃了完整的 9 節點 LangGraph pipeline：

Planner → Research → Normalize → Writer → Critic → Related Posts

這就是把你 30+ 篇 Agent 文章的知識打包成讀者可以直接互動的產品。讀者可以問「RAG 跟傳統搜尋有什麼不同？」，系統從你的文章中找答案。

三、建議實作順序
階段 項目 難度 影響力 對應文章概念
Week 1 Embedding Pipeline + 語意搜尋 中 高 Multi-Agent RAG, Hybrid Search
Week 2 AI 相關文章推薦 低 高 Context Engineering (Select)
Week 3 品質檢查 Hook 低 中 Anthropic Harness, Blueprint
Week 4 自動 TL;DR 生成 低 中 Context Compress 策略
Month 2 Chat UI + RAG 對話 高 高 LangGraph Agent Pipeline
Month 3 多語言翻譯 Pipeline 中 中 Google Multi-Agent Patterns
四、核心原則（來自你自己的文章）
「The walls matter more than the model」 — Stripe Minions
基礎設施的約束設計比模型選擇更重要

「大部分 Agent 失敗是 Context 失敗，不是模型失敗」 — Context Engineering Guide
先把 embedding + retrieval 做好，比換更貴的模型有效

「Start simple, only add complexity for specific failure modes」 — Google Multi-Agent Patterns
先做單 Agent 語意搜尋，驗證後再加 Multi-Agent

你的部落格本身就是最好的 AI Agent 實踐場——用自己寫的理論，改善自己的產品。需要我開始實作哪個部分？

1 step
1 step
對話式部落格助手（Phase 1 RAG Chat）
再解釋一下

Let me pull up the existing RAG design specs to give you a detailed walkthrough.

Read 6 files
Read 6 files

好的，以下是對話式部落格助手的完整解說：

對話式部落格助手（Phase 1 RAG Chat）— 詳解
這是什麼？
在你的部落格加上一個 聊天介面，讓讀者可以用自然語言問問題，系統從你的 227 篇文章 + 爬取的外部文件中找到答案，組合成有來源引用的回覆。

例如讀者問：「RAG 跟傳統搜尋有什麼不同？」
系統不是回傳一堆搜尋結果，而是 讀懂你的文章後，用你的觀點回答，並附上來源連結。

架構全貌（你已設計完成）
讀者提問
  │
  ▼
┌─────────┐
│ Planner  │ ← 意圖偵測：事實查詢？摘要？程式碼？比較？
│          │   語言偵測：中文問 → 中文答
│          │   複雜度判斷：簡單直送 vs 拆子任務
└────┬─────┘
     │
     ▼
┌──────────┐    並行執行
│ Research  │───┬── search_blog_posts（Vectorize 語意搜尋）
│          │   ├── search_docs（外部文件搜尋）
│          │   ├── D1 FTS5（BM25 關鍵字搜尋）
│          │   └── get_post_detail（取完整文章）
└────┬─────┘
     │
     ▼
┌────────────────┐
│ Normalize      │ ← 解析 metadata、計算相關度分數
│ Results        │   lost-in-the-middle 重排
│                │   相關度 < 0.4 → 觸發 Web 搜尋補救
└────┬───────────┘
     │
     ▼
┌─────────┐
│ Writer   │ ← 組合最終回答
│          │   每個論點附來源連結：[論點](文章URL)
│          │   嵌入圖片、Mermaid 圖表
└────┬─────┘
     │
     ▼
┌─────────┐
│ Critic   │ ← 答案品質守門員
│          │   檢查：回答有沒有無根據的宣稱？
│          │   信心分數 < 門檻 → 回到 Research 重試（最多 2 次）
└────┬─────┘
     │
     ▼
┌──────────────┐
│ Related Posts │ ← 推薦相關文章
└──────┬───────┘
       │
       ▼
     回覆讀者（SSE 串流）

關鍵技術細節

1. Hybrid Search（混合搜尋）
不是只用向量搜尋，而是 語意 + 關鍵字雙路並行：

路徑 技術 優勢
語意搜尋 Vectorize + BGE-large（1024 維） 理解「意思相近」的查詢
關鍵字搜尋 D1 FTS5 / BM25 精確匹配專有名詞如 LangGraph
融合 RRF（Reciprocal Rank Fusion） 結合兩者優勢
重排 BGE-Reranker（Workers AI） 用 cross-encoder 精排 top results
2. Contextual Retrieval（上下文嵌入）
嵌入前，每個 chunk 前面加上文件脈絡：

"This chunk is from a blog post titled 'Multi-Agent RAG 協作架構'
 in category 'ai', published 2026-03-16."

+ 原始 chunk 內容

這讓脫離原文的 chunk 也能被正確檢索到。

1. Critic 自我修正（CRAG 模式）
Writer 產出答案
  → Critic 驗證每個論點是否有 chunk 支撐
    → 信心分數 ≥ 門檻 → 放行
    → 信心分數 < 門檻 → 回到 Research 用更精確的 query 重試
    → 重試 2 次仍不足 → 標註「此主題超出部落格涵蓋範圍」

這就是你在 anthropic-harness-design.md 中分析的 Generator-Evaluator 模式的實際應用。

1. SSE 串流回覆
回覆不是等全部完成才顯示，而是即時串流：

event: agent_step    → "正在搜尋相關文章..."
event: agent_step    → "找到 8 個相關段落，組織回答中..."
event: token         → 逐字輸出回答
event: sources       → [{title, url, relevance}]
event: related       → [{title, url}]
event: done          → 結束

使用者體驗流程
┌─────────────────────────────────────┐
│  quidproquo.cc/chat                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🤖 你好！可以問我關於 RAG、  │   │
│  │    AI Agent、技術開發的問題   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 Context Engineering 跟    │   │
│  │    Prompt Engineering 差在哪？│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🤖 根據部落格文章分析...      │   │
│  │                              │   │
│  │ Prompt Engineering 專注在     │   │
│  │ 「措辭優化」，而 Context      │   │
│  │ Engineering 專注在「資訊管理」│   │
│  │ [來源¹]                      │   │
│  │                              │   │
│  │ 📎 來源：                     │   │
│  │ 1. Context Engineering 指南   │   │
│  │ 2. 從 Prompt 到 Harness 演化  │   │
│  │                              │   │
│  │ 📚 相關文章：                 │   │
│  │ • AI Agent 的三個核心支柱     │   │
│  │ • Phil Schmid: Agent Harness  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────────────────┐ [Send]   │
│  │ 輸入你的問題...        │         │
│  └──────────────────────┘          │
│                                     │
│  📊 訪客額度：3/5 次               │
└─────────────────────────────────────┘

安全與限流設計
角色 驗證方式 額度
站長（你） Session Cookie（KV 存，7 天 TTL） 無限
訪客 IP 識別 每日 5 次（可調）
濫用偵測 每小時 > 20 次 → IP 封鎖（D1 ip_blocks） 自動封鎖
已就緒 vs 待實作
已就緒 待實作
D1 post_chunks / doc_chunks 表 Embedding Pipeline（chunk → embed → Vectorize）
Vectorize Index（1024 維，已建） LangGraph 6 個 Agent 節點
Workers AI BGE 模型已綁定 /api/chat SSE 端點
Crawl Pipeline 每週自動跑 React Chat UI 元件（5 個）
完整設計文件 + 實作計畫 登入頁 + Session 驗證
227 篇文章已 sync 到 D1 FTS5 虛擬表（Migration 0002）
實作路徑（Phase 1 計畫已寫好）
你的 docs/superpowers/plans/2026-03-21-rag-phase1.md 已經拆成具體 Task：

Task 1：安裝依賴（LangGraph、React、Langfuse）
Task 2：D1 Migration（FTS5、chat_logs、feedback、settings 表）
Task 3：Auth + Rate Limit
Task 4：Embedding Pipeline（contextual chunk → Vectorize upsert）
Task 5：LangGraph Agent 節點（Planner → Research → Normalize → Writer → Critic → Related）
Task 6：/api/chat SSE 端點
Task 7：Chat UI React 元件
Task 8：測試 + 上線
本質上就是：你已經寫了 30+ 篇教人怎麼建 RAG Agent 的文章，現在要把這些知識變成你自己部落格的功能。 讀者不只能「讀」你的 AI 知識，還能「用」它。

需要我開始實作嗎？可以從 Embedding Pipeline（Task 4）開始，因為前置的基礎設施都已經到位了。

1 step
1 step
Phase2是？

讓我查看設計文件中關於 Phase 2 的規劃。

Read 4 files, searched 2 patterns
Read 4 files, searched 2 patterns

現在有完整的資訊了。以下是 Phase 2 的整理：

Phase 2 — Agentic Enhancements（智慧代理增強）
Phase 1 建立的是「能用」的基礎 RAG（Planner → Research → Writer → Critic），Phase 2 則是讓它「好用」——加入更多專業 Agent、進階檢索技術、多輪對話、和管理後台。

1. 新增 5 個專業 Agent 節點
Agent 觸發條件 功能
Clarifier Planner 判斷問題模糊時 反問使用者以澄清需求，使用 LangGraph interrupt() 暫停等待回覆
Summarizer 查詢含「摘要」「什麼是」「介紹」 取完整文章，做漸進式摘要（長文先分段壓縮再合併）
Code Explainer 查詢或檢索結果含程式碼區塊 偵測語言、逐步解釋、連結回原文來源
Diagram Agent Planner 判斷需要視覺化 兩種模式：Mermaid（即時渲染）或 AI 圖片（Flux-1 非同步生成，存 R2）
Related Posts 每次回覆結束時 用對話摘要向 Vectorize 查詢相關文章推薦
Phase 1 的 pipeline：

Planner → Research → Normalize → Writer → Critic → END

Phase 2 升級為：

Planner ─┬─→ Clarifier → [等使用者回答] → 重新 Plan
         └─→ Research ──┬─→ Normalize → Summarizer (條件)
              │         ├─→ Code Explainer (條件)
              │         └─→ Diagram Agent (條件)
              └── Abstract Search (並行)
                          → Writer → Critic ─┬─→ 重試 Research (max 2x)
                                             └─→ Related Posts → END

1. 進階 RAG 技術
技術 原理 效果
HyDE Planner 先生成一段「假設性答案」→ 用它做 embedding 搜尋 大幅提升模糊查詢的檢索品質
Multi-query Research 將一個問題改寫成 3 個變體 → 並行搜尋 → RRF 融合 覆蓋更多語意角度
Hybrid Search Vectorize（語意）+ D1 FTS5（BM25 關鍵字）→ 合併排序 專有名詞不漏、語意相近也抓得到
Reranker Workers AI cross-encoder 重排 top-20 → top-5 精準度顯著提升
Semantic Cache 查詢 embedding 與快取比對，cosine > 0.92 → 直接回傳 重複問題秒回，省 token 成本
Semantic Cache 機制
新查詢 → embedding → 搜尋 VECTORIZE_CACHE
  → cosine > 0.92 → 命中！直接回傳快取的答案（UI 標示 ⚡ cached）
  → cosine < 0.92 → 未命中，走完整 Agent Pipeline
                   → 完成後存入 VECTORIZE_CACHE（TTL 24 小時）

2. D1 Checkpointer — 多輪對話
Phase 1 用 MemorySaver（記憶體，頁面重整就消失）。Phase 2 切換到 D1 Checkpointer：

-- migration 0003
CREATE TABLE checkpoints (
  thread_id TEXT NOT NULL,
  checkpoint_id TEXT NOT NULL,
  data TEXT NOT NULL,          -- 序列化的 LangGraph state
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (thread_id, checkpoint_id)
);

實際效果：

讀者可以多輪追問（「那 LangGraph 呢？」→ 系統記得前面在聊 Agent 框架）
thread_id 存在 localStorage，重整頁面不會丟失對話
Progressive Summarization：對話超過 8000 tokens 時，自動摘要舊訊息，避免 context 爆掉
支援 Clarifier 的暫停/恢復流程
4. PostToolUse Hook（Normalize Results 節點）
Phase 1 的 Research 回傳原始 chunk，Phase 2 加入專門的後處理節點：

Research 回傳 chunks
  → 解析 JSON metadata（images、links）
  → 計算每個 chunk 的相關度分數（cosine similarity）
  → Lost-in-the-middle 重排（top-3 移到前後端）
  → 最高分 < 0.4 → 設定 needs_web_search = true（CRAG 觸發）
  → 寫入 state.search_results

1. Admin 管理後台
Phase 2 新增 4 個管理頁面：

頁面 功能
/admin/embed 查看 Vectorize 狀態、調整 chunking 參數、預覽分 chunk 結果、手動觸發 re-embed
/admin/crawl 管理爬取目標（新增/編輯/刪除）、觸發爬取、查看統計
/admin/settings 調整訪客額度、快取門檻、Agent 迭代上限、Critic 重試次數
/admin/agent 開關個別 Agent（Clarifier、Diagram 等）、啟停進階技術（HyDE、Reranker 等）
Phase 1 → 2 → 3 對照
面向 Phase 1 Phase 2 Phase 3
Agent 節點 4 個（基礎） 9 個（完整） 9 個 + GraphRAG
對話 單輪 多輪（D1 Checkpointer） + 長期記憶
搜尋 純語意 Hybrid + HyDE + Reranker + CRAG + Adaptive RAG
快取 無 Semantic Cache + Abstract-first Index
後台 無 4 個管理頁 + Eval Dashboard + Shadow A/B
安全 Auth + Rate Limit 同上 + Injection 防護 + PII 過濾 + Circuit Breaker
文件來源 部落格 + 爬取文件 同上 + 自訂上傳（PDF/URL/文字）
簡單說：Phase 1 是「能回答」，Phase 2 是「回答得好」，Phase 3 是「穩定可靠地回答得好」。

需要我開始實作哪個階段？

1 step
1 step
用RAG Agent文章檢視這些規劃

Let me systematically cross-reference your RAG/Agent articles against the design specs.

Ran 4 agents
Ran 4 agents

Now I have comprehensive technical details from all the articles. Let me also check the background agent's results and then cross-reference everything against the design specs.

Read a file
Read a file

Good, I now have all the data needed. Let me synthesize the cross-reference analysis.

用 RAG/Agent 文章檢視設計規劃：完整交叉審查
我把你的 30+ 篇 RAG/Agent 文章的具體建議，逐一對照 rag-design.md 和 rag-phase1.md 的設計，找出 一致、矛盾、和 遺漏 的地方。

🔴 矛盾與潛在問題

1. Semantic Cache 門檻：設計文件 0.92 vs 文章建議 0.95
來源 門檻值
rag-design.md settings semantic_cache_threshold: 0.92
semantic-caching.md 文章 cosine ≥ 0.95
文章的相似度解釋 0.90-0.94 = 「相關但不同」
問題：你的文章明確指出 0.90-0.94 是「語意相關但有明顯差異」，用 0.92 會回傳不精確的快取結果。

建議：將 semantic_cache_threshold 改為 0.95，與文章一致。

1. Chunk Size：設計用 2000 chars vs 文章建議 512 tokens
來源 大小
rag-design.md chunk_size: 2000 chars
chunking-strategies.md 最佳平衡 512 tokens（約 1000-1500 chars）
文章的 trade-off 表 1024 tokens = 低精確度、高上下文
問題：2000 chars ≈ 500-600 tokens，接近文章建議的 512 tokens 上限。但設計用的是 chars 而非 tokens，在中文環境下 2000 chars ≈ 800-1000 tokens，已超出建議範圍。

建議：改用 token 計算（而非 chars），並設為 512 tokens。或者將 chars 降至 1500。

1. Reranker Min-Keep 未定義
你的文章 cross-encoder-reranking.md 明確建議：

reranker_min_keep = 3（即使所有候選都低於門檻，至少保留 3 個）

設計文件中完全沒有提到 min-keep 安全網。如果所有 chunk 的 reranker 分數都 < 門檻，系統會回傳空結果。

建議：在 normalize_results 節點加入 min_keep: 3 參數。

1. 缺少 Adaptive RAG 的 queryType 路由
你的文章 query-classification-adaptive-routing.md 定義了 6 種查詢類型，每種有不同的執行路徑：

simple            → 輕量搜尋 → 輕量 LLM
complex           → HyDE + Multi-Query → Rerank → 完整 Pipeline
general-knowledge → 跳過檢索 → 直接 LLM
clarification     → 生成選項 → 回傳使用者

設計文件的 Planner 只做了 intent detection（factual / summary / code / comparison / exploratory），但沒有對應到文章的 skip retrieval（general-knowledge）和 step skipping（simple 跳過 HyDE/Multi-Query）。

建議：Phase 2 的 Adaptive RAG 應加入 queryType 分類，且 Planner 輸出中增加 complexity: 'simple' | 'medium' | 'complex'，驅動條件性跳過。

1. CRAG 觸發邏輯不一致
來源 觸發條件
rag-design.md max relevance < 0.4 → web search
corrective-rag-crag.md 文章 zero results → 漸進放寬 filters
差異：設計文件的 CRAG 是基於「分數低」觸發 web search，但你的文章中的 CRAG 是基於「零結果」觸發 filter 放寬（先移除次要 filter，保留核心 filter）。兩者是不同策略。

建議：兩者都實作——

零結果 → 漸進放寬 metadata filter（文章的 CRAG）
低分數 < 0.4 → Web search fallback（設計文件的 CRAG）
順序：先放寬 filter 重試 → 仍然低分 → web search
6. Tool 數量超過文章建議的上限
context-engineering-guide.md 明確指出：

超過 20 個工具，選擇錯誤率顯著上升

設計文件中 Research Agent 的工具數量：

search_blog_posts
search_docs
search_abstract_index
get_post_detail
find_images
extract_links
web_search
= 7 個，在安全範圍內。✅ 這點沒問題。

但文章還建議：「工具之間功能不要重疊」。search_blog_posts 和 search_abstract_index 有語意重疊——兩者都搜尋部落格內容，只是粒度不同。

建議：將 search_abstract_index 改為 Research 節點的內部策略（先搜摘要 → 找到後取完整 chunk），而非暴露為獨立工具讓 LLM 選擇。

🟡 設計文件遺漏的文章建議
7. 缺少 MMR 多樣性重排
你的 mmr-diversity-reranking.md 詳細描述了 MMR 演算法：

λ = 0.7（預設，兼顧相關性與多樣性）

設計文件的 normalize_results 做了 lost-in-the-middle 重排，但 沒有 MMR。這會導致推薦結果中多篇文章講同一件事（重複資訊）。

建議：在 reranker 之後、Writer 之前加入 MMR 選擇，λ = 0.7。

1. 缺少 Judge Sampling（成本優化）
rag-cost-optimization.md 建議：

Judge sampling：只對 30% 的查詢執行 Critic 評估，其餘直接放行

設計文件的 Critic 對 每個查詢 都執行 LLM-as-Judge，但 Critic 佔了額外一次完整 LLM 呼叫。

建議：Phase 2+ 加入 sampling 策略——簡單查詢跳過 Critic，只對 complex 查詢執行。

1. 缺少 BM25 短路邏輯
rag-cost-optimization.md 建議：

精確關鍵字查詢（地名、專有名詞），如果 BM25 回傳 ≥ 5 個結果，跳過向量搜尋

設計文件中 Hybrid Search 永遠兩路並行。對於像「LangGraph 是什麼？」這種精確名詞查詢，BM25 已經足夠。

建議：加入 BM25 短路條件，減少不必要的 embedding + Vectorize 呼叫。

1. Progressive Summarization 門檻未定義
phil-schmid-agent-harness.md 警告：

隨著 agent 運行時間越長，context 的品質會逐漸退化（Context Durability）

設計文件提到「messages 超過 8000 tokens 時觸發摘要壓縮」，但 context-engineering-guide.md 的建議是：

在 95% context 使用量時觸發壓縮

問題：8000 tokens 是固定值，沒有考慮不同模型的 context window 大小。

建議：改為動態計算：threshold = model_context_window * 0.7（保留 30% 給生成）。文章明確建議「reserve 30%+ for generation」。

1. 缺少 Model Drift 偵測
phil-schmid-agent-harness.md 的核心觀點：

「模型在第 100 步之後開始偏離初始指令，harness 需要偵測 drift」

設計文件的 Research Agent 有 max_iterations: 5，但沒有 drift 偵測機制。如果 Agent 在第 3-4 次工具呼叫後開始偏離意圖，目前無法發現。

建議：在 Critic 節點增加「與原始查詢意圖對齊度」檢查，不只驗證 grounding。

1. 缺少 Episodic Memory
ai-agents-context-cognition-action.md 將記憶分為四類，其中 Episodic Memory 最被強調：

「能不能記住『上次使用者偏好 JSON 格式』這種經驗，決定了 agent 品質上限」

設計文件沒有任何 episodic memory 機制。Phase 1 用 MemorySaver（頁面重整即消失），Phase 2 用 D1 Checkpointer（保留對話但非跨 session 偏好）。

建議：Phase 2+ 加入使用者偏好記憶（至少站長端），參考 Hermes Agent 的 user profile dialectic 模式。

✅ 設計與文章一致的部分
文章建議 設計文件對應 狀態
Contextual Retrieval（chunk 前加文件脈絡） Section 4.1 完整實作 ✅ 完全一致
Sentence Window Retrieval metadata 中的 sentence_window ✅
Hybrid Search（Vector + BM25 + RRF） Section 6 Advanced Techniques ✅
Cross-encoder Reranker BGE-Reranker via Workers AI ✅
Generator-Evaluator（Writer + Critic） Section 5.2 Writer + Critic 節點 ✅
Parallel Fan-out Research 並行工具呼叫 ✅
Human-in-the-loop（Clarifier） Section 5.2 interrupt() 機制 ✅
隔離 Context（Sub-agent isolation） 分離節點各自有獨立 prompt ✅
LangGraph 狀態管理 TypedDict StateAnnotation ✅
Langfuse 可觀測性 Section 12 完整 trace 結構 ✅
結構化 System Prompt XML tags + sections ✅
Agent Max Iterations: 5 agent_max_iterations: 5 ✅
漸進式摘要（長對話壓縮） Section 5.5 Progressive Summarization ✅
HyDE + Multi-query Section 6 Advanced Techniques ✅
Input sanitization Section 8 Guardrails ✅
Circuit breaker Section 8 降級模式 ✅
🔵 文章提到但設計刻意留到 Phase 3 的項目
項目 文章來源 Phase 3 對應
GraphRAG（實體關係圖） 多篇提及 Phase 3: entities + relationships
長期/情節記憶 ai-agents-context-cognition-action.md Phase 3: long-term memory
A/B Shadow 測試 rag-evaluation-frameworks.md Phase 3: shadow mode
自訂文件上傳 multi-agent-rag-patterns.md Phase 3: custom docs
RAGAS 評估 pipeline rag-evaluation-frameworks.md Phase 3: golden dataset
這些排程合理，符合文章的「從簡單開始」原則。

📋 總結：優先修正清單

# 問題 嚴重度 修正成本

1 Semantic Cache 門檻 0.92 → 0.95 🔴 會回傳錯誤快取 改一個數字
2 Chunk size 2000 chars → 1500 chars 或改用 token 計算 🔴 影響檢索品質 改參數 + 重新 embedding
3 加入 Reranker min_keep: 3 🔴 避免空結果 加幾行邏輯
4 CRAG 加入 filter 放寬策略（不只 web search） 🟡 更符合文章建議 中等工程量
5 search_abstract_index 改為內部策略，非獨立工具 🟡 減少工具選擇混淆 重構一個節點
6 normalize_results 加入 MMR（λ=0.7） 🟡 避免重複推薦 新增一個步驟
7 Adaptive RAG queryType 分類 + step skipping 🟡 省成本 Phase 2 實作
8 Progressive summarization 改用動態門檻（70% context） 🟢 更靈活 改計算邏輯
9 Critic 加入 drift 偵測（意圖對齊度） 🟢 長期品質 改 Critic prompt
10 Judge sampling 30%（簡單查詢跳過 Critic） 🟢 省成本 Phase 2+
11 BM25 短路（≥5 結果跳過向量搜尋） 🟢 省成本 條件判斷
12 站長端 episodic memory 🟢 提升體驗 Phase 3
結論：設計文件的整體架構與文章高度一致（LangGraph 圖結構、Generator-Evaluator、Hybrid Search、Contextual Retrieval 等核心模式都正確實作），但在 具體參數（cache 門檻、chunk 大小）和 防禦性機制（min-keep、MMR、filter 放寬、drift 偵測）上有遺漏。前 3 項是改個數字就能修的，建議在 Phase 1 實作前先更新設計文件。

需要我直接更新 rag-design.md 嗎？

1 step
1 step

好的，背景 agent 也完成了。讓我把生產環境文章的額外洞察補充到審查中。

補充審查：生產環境文章 vs 設計規劃
根據 internal-ai-coding-agents.md、oh-my-claudecode.md、agent-frameworks-2026.md、hermes-agent-intro.md 的額外發現，以下是之前審查未涵蓋的重要差距：

🔴 新增高優先級問題
13. 缺少 Deterministic Checkpoint 節點（Blueprint 模式）
Stripe Minions 的核心架構創新是 Blueprint——交替執行確定性節點和 AI 節點：

「不依賴 AI 每次都做對，而是用確定性檢查點攔截錯誤」

你的設計文件中 LangGraph pipeline 全部是 agentic 節點（Planner → Research → Writer → Critic），沒有任何確定性驗證步驟。

具體問題：

Writer 產出的 Markdown 格式可能有錯（壞掉的連結語法、未關閉的 code block）
Source URL 可能指向不存在的文章（你有 49 個斷連結）
Mermaid 語法可能無效
建議：在 Writer → Critic 之間插入 deterministic validation node：

Writer → validate_output（確定性）→ Critic
         ├─ 檢查 Markdown 語法
         ├─ 驗證所有 source URL 存在（D1 查詢）
         ├─ 驗證 Mermaid 語法（正則）
         └─ 檢查回覆長度是否合理

1. CI Repair 上限原則未套用到 Critic 重試
Stripe 的明確設計決策：

「如果 LLM 兩次修不好，第三次也修不好——只是在燒 token。標記為需人工處理。」

你的設計文件 critic_max_retry: 2 有設上限 ✅，但缺少 失敗降級策略。Critic 重試 2 次仍不通過時，目前設計只是繼續回傳低信心結果。

建議：加入明確降級行為：

重試 2 次後仍低於門檻 → 標註「⚠️ 此回答可能不完整，建議直接閱讀相關文章」
記錄到 Langfuse 供後續分析
不要再呼叫 LLM
🟡 新增中優先級問題
15. 工具描述策略缺失（Toolshed 模式）
Stripe 有 500+ 工具但每次只給 agent ~15 個相關工具。你的文章 context-engineering-guide.md 也說：

「超過 20 個工具，選擇錯誤率顯著上升」

設計文件中 Research Agent 有 7 個工具（安全範圍），但 工具描述的品質 沒有規範。你的文章明確建議：

「工具描述要自足——光看描述就能知道『什麼時候用』和『怎麼用』」
「避免功能重疊的工具（增加選擇錯誤）」

問題：search_blog_posts vs search_abstract_index vs search_docs 的使用時機區分不明確。LLM 可能在該搜摘要時搜全文、在該搜文件時搜部落格。

建議：為每個工具寫明確的 description，包含：

何時使用（trigger condition）
何時不使用（negative examples）
預期回傳格式
16. 缺少「描述終態」風格的 Prompt
Spotify 的重要發現：

「用描述終態（description-of-terminal-state）風格的 prompt，取代逐步指令（step-by-step instructions）」
「過度嚴格的逐步指令會導致 agent 在複雜多步驟任務上卡住」

設計文件中 Writer、Critic 等 agent 的 prompt 設計沒有明確風格指引。

建議：Agent prompt 應描述「成功的回答長什麼樣」而非「按步驟做」：

❌ "First search for relevant posts. Then extract key claims. Then write response with citations."
✅ "A successful response directly answers the user's question with 2-5 key points,
    each backed by a specific source from the blog. It reads naturally, not like a
    list of search results."

1. 缺少 Verification Loop（Spotify 模式）
Spotify 的三層品質保證：

Agent 沒產出結果（影響低，重試）
結果通過格式檢查但功能錯誤（影響高，侵蝕信任）
不可預測的輸出
你的 Critic 只做 grounding check（論點有沒有來源支撐），但不做 functional verification：

回答是否真的回答了問題？（不只是相關，而是切中要害）
推薦的文章是否真的存在且可訪問？
Source URL 是否正確指向引用的內容？
建議：Critic 增加 answer-relevance check（RAGAS 的 Answer Relevancy 指標），不只檢查 grounding。

1. 模型升級導致 Harness 過時的風險
phil-schmid-agent-harness.md 核心警告：

「你今天寫的 harness 邏輯，明天可能因為模型升級而過時」
「2024 年需要複雜 hand-coded pipeline 才能做到的事，2026 年一個 context window prompt 就搞定了」

anthropic-harness-design.md 也驗證了這點：

從 Sonnet 4.5 升級到 Opus 4.5 後，context anxiety 消失，context reset 機制被移除

問題：設計文件中的很多「聰明」邏輯（HyDE、Multi-query、Adaptive RAG 三層路由）可能在模型升級後變得多餘。

建議：

每個進階技術都應該可以透過 /admin/agent 單獨開關（設計已有 ✅）
但需要加入 A/B 比較機制：開啟 HyDE vs 關閉 HyDE，比較 RAGAS 分數
Phase 3 的 Shadow Mode 應該提前到 Phase 2
19. 框架選擇風險：LangGraph 的 Dependency 成本
agent-frameworks-2026.md 提到：

「框架選擇不是學習曲線問題——所有框架都能一天 demo。真正的成本是遷移成本。」

langgraph-agent-orchestration.md 也警告：

「如果只需要『品質差就重試一次』，LangGraph 是殺雞用牛刀」
「API 版本不穩定」
「完整 LangChain 生態系的依賴成本」

你的 Phase 1 pipeline（Planner → Research → Normalize → Writer → Critic）其實是一條 接近線性的 pipeline，只有 Critic → Research 有一個重試循環。

問題：Phase 1 可能不需要 LangGraph 的完整圖結構。引入 @langchain/langgraph + @langchain/anthropic 會大幅增加 bundle size 和 Workers 冷啟動時間。

建議：

Phase 1 考慮用純函數 pipeline（手寫 async 鏈），降低依賴
Phase 2 再引入 LangGraph（真正需要條件分支、並行、Clarifier interrupt 時）
或者接受 LangGraph 的成本，但要測量 Workers 冷啟動影響
✅ 生產文章驗證的正確設計
生產經驗 設計文件對應 狀態
Slack-first 觸發（所有公司） 部落格場景不適用，用 /chat 頁面 ✅ 合理替代
隔離沙盒（Stripe Devbox） Cloudflare Workers 本身就是隔離環境 ✅
精選工具子集（~15 個） 7 個工具，安全範圍 ✅
Sub-agent 隔離 context 各節點獨立 prompt，不共享完整 context ✅
最大迭代限制 agent_max_iterations: 5 + critic_max_retry: 2 ✅
可觀測性（Langfuse） Section 12 完整 trace 結構 ✅
使用者回饋（👍👎） D1 feedback 表 + Langfuse 連動 ✅
Rate limiting IP + KV + abuse detection ✅
📋 更新後的完整修正清單（含新增項目）

# 問題 來源文章 嚴重度 階段

1 Cache 門檻 0.92 → 0.95 semantic-caching.md 🔴 P1
2 Chunk size 改用 token 計算（512 tokens） chunking-strategies.md 🔴 P1
3 加 Reranker min_keep: 3 cross-encoder-reranking.md 🔴 P1
4 CRAG 加 filter 放寬策略 corrective-rag-crag.md 🟡 P2
5 search_abstract_index 改為內部策略 context-engineering-guide.md 🟡 P2
6 加 MMR（λ=0.7） mmr-diversity-reranking.md 🟡 P2
7 Adaptive RAG queryType 路由 query-classification-adaptive-routing.md 🟡 P2
8 動態壓縮門檻（70% context） context-engineering-guide.md 🟢 P2
9 Critic 加 drift 偵測 phil-schmid-agent-harness.md 🟢 P2
10 Judge sampling 30% rag-cost-optimization.md 🟢 P2
11 BM25 短路（≥5 結果跳過向量） rag-cost-optimization.md 🟢 P2
12 站長端 episodic memory ai-agents-context-cognition-action.md 🟢 P3
13 Deterministic validation node（Writer→Critic 間） internal-ai-coding-agents.md（Stripe Blueprint） 🔴 P1
14 Critic 失敗 降級策略 internal-ai-coding-agents.md（Stripe 2-attempt cap） 🟡 P1
15 工具描述品質規範 context-engineering-guide.md + Stripe Toolshed 🟡 P1
16 Prompt 改用 描述終態風格 internal-ai-coding-agents.md（Spotify） 🟡 P1
17 Critic 加 answer-relevance 檢查 rag-evaluation-frameworks.md + Spotify verification 🟡 P2
18 Shadow A/B 從 P3 提前到 P2 phil-schmid-agent-harness.md + anthropic-harness-design.md 🟢 P2
19 評估 Phase 1 是否真需要 LangGraph langgraph-agent-orchestration.md + agent-frameworks-2026.md 🟡 P1
核心結論
你的設計文件在 大架構層面 與文章高度一致（Generator-Evaluator、Hybrid Search、Contextual Retrieval、LangGraph 圖結構、Langfuse 觀測性）。

但在 三個維度 有系統性遺漏：

防禦性機制（min-keep、filter 放寬、降級策略、deterministic validation）—— 文章反覆強調「牆比模型重要」，但設計偏向 happy path
成本控制（Judge sampling、BM25 短路、Adaptive 跳步）—— 文章有完整的 ROI 排序，設計還沒納入
可演化性（模型升級 → harness 簡化、A/B 比較、技術開關）—— 文章最強調的 Bitter Lesson，設計只在 Phase 3 才處理
需要我把這些修正直接寫入 rag-design.md 嗎？

1 step
1 step
Harness呢

讓我深入看 Harness Engineering 文章，並對照專案本身的 harness 實作。

Ran 2 agents
Ran 2 agents

用 Harness Engineering 文章檢視專案本身的 Harness 實作
你寫了三篇深度 Harness 文章，定義了完整的 harness 設計原則。現在反過來問：你自己的專案有沒有照做？

文章定義的 Harness 四大原則 vs 專案實際狀態
原則 1：Repository as Single Source of Truth
「Repository 是 agent 唯一的真相來源。不假設外部知識。agent 需要的一切都應該存在 repo 裡。」

項目 狀態 問題
專案架構文件 ❌ 沒有根目錄 CLAUDE.md Agent 進來不知道這是什麼專案、用什麼技術、怎麼開發
技術棧說明 ❌ 散落在各 skill Astro 6 + Cloudflare Workers + D1 等資訊沒有集中處
開發流程文件 ⚠️ 部分在 OpenSpec skills 但 OpenSpec 本身需要先學習才能用
RAG 設計文件 ✅ docs/superpowers/specs/ 完整且詳細
內容 Schema ✅ src/content.config.ts 型別定義清楚
Agent 進度追蹤 ❌ 沒有 progress.txt 你的文章最推崇的機制，自己卻沒用
你的文章說：

「claude-progress.txt 是整個架構中最優雅的部分... 最低成本的 episodic memory 實作——不需要 vector database，一個文字檔就夠了。」

但你的專案沒有任何等效機制。 每次新 session 的 agent 都要重新理解整個專案。

原則 2：Agent-Readable Code
「程式碼要 agent-readable，不只是 human-readable。agent 沒有你腦中的隱性知識，它只看得到寫出來的東西。」

項目 狀態 問題
程式碼註解 ⚠️ 偏少 大部分 .astro 和 .ts 檔沒有檔案層級說明
目錄結構說明 ❌ 沒有 src/README.md 或目錄導覽
命名一致性 ✅ 檔案命名規則清楚（YYYY-MM-DD-slug.md）
型別定義 ✅ content.config.ts 提供完整 schema
隱性知識 ❌ 例如：為什麼 chunk size 是 2000？為什麼用 BGE-large？這些決策理由沒寫在 repo 裡
核心問題：設計文件（rag-design.md）記錄了「做什麼」，但很少記錄「為什麼這樣做」。一個新 agent（或新開發者）看不出決策背景。

原則 3：Architecture Constraints via Linter, Not Prompt
「Prompt 是建議，linter 是法律。你不是『請』agent 遵守規則，你『讓它不可能』違反規則。」

約束類型 狀態 問題
Linter（oxlint） ✅ CI 有跑 但排除了 .astro 檔
TypeScript strict ✅ 型別錯誤會在 build 時攔截
Pre-commit hook ❌ 完全沒有 Agent 可以提交未通過 lint 的程式碼
Commit message 規範 ❌ 沒有 commitlint 或格式驗證
Frontmatter 驗證 ⚠️ Astro Content Collections 有 schema 但 type 欄位是 optional，不會阻止缺漏
內部連結驗證 ⚠️ 有 check-post-references.mjs 但不在 CI 中執行，49 個斷連結照樣通過
權限控制 ✅ .claude/settings.json 禁止 rm -rf 和 git reset --hard
最嚴重的缺口：你的文章說「linter 是法律」，但你有兩個應該是「法律」的檢查完全不在 CI 中：

Post reference 驗證——script 存在但沒跑，導致 49 個斷連結上線
Pre-commit hook——agent 可以 commit 任何東西，直到 CI 才發現問題
原則 4：Progressive Capability Grants
「自主權漸進授予。設定階段和閘門，在每個階段驗證後才開放下一步。」

機制 狀態 問題
OpenSpec 工作流 ✅ 有階段和閘門 Proposal → Specs → Design → Tasks → Apply → Verify → Archive
但... ⚠️ 流程是「fluid, non-phase-locked」 可以跳過階段——這與漸進授予矛盾
RAG 開發 ❌ 沒有階段閘門 Phase 1/2/3 只是規劃，沒有程式化的閘門控制
文章發布 ❌ 沒有品質閘門 Draft → 發布之間沒有自動化檢查
文章提到的 Harness 組件 vs 專案實作
Lifecycle Hooks（生命週期鉤子）
你的文章詳細描述了 Anthropic 的 啟動儀式：

跑 pwd 確認目錄
讀 git log 和 claude-progress.txt
選最高優先級任務
跑 init.sh 啟動 dev server
做 smoke test
才開始寫新功能
你的專案：❌ 沒有任何 session-start hook

沒有自動環境驗證
沒有自動讀取進度
沒有 smoke test
Agent 可能在壞掉的環境中開始工作
Generator-Evaluator Pattern
你的文章核心觀點：

「讓一個 agent 同時當運動員和裁判，它會傾向對自己寬容。」
「調教一個獨立的 evaluator 讓它嚴格挑剔，遠比讓 generator 自我批判來得容易。」

RAG 設計：✅ Writer + Critic 是兩個獨立節點

但內容生產流程：❌ Post skill 沒有 Evaluator

Agent 寫完文章 → 直接 commit
沒有獨立的品質評估步驟
沒有檢查：frontmatter 完整性、內部連結有效性、tag 一致性
Context Durability（Context 耐久性）
你的文章警告：

「隨著 agent 運行時間越長，context 的品質會逐漸退化——不是 context window 不夠大，而是累積的資訊開始干擾決策。」

專案狀態：❌ 沒有 context 健康管理

沒有自動壓縮觸發
沒有 checkpoint 機制
長 session 中的 context rot 無法偵測
Model Drift Detection
你的文章：

「Harness 會成為偵測 drift 的主要工具——在每個階段檢查模型是否還在遵循原始意圖。」

專案狀態：❌ 完全沒有

沒有階段性意圖對齊檢查
沒有 drift 指標
RAG 設計文件的 Critic 只檢查 grounding，不檢查 drift
The Bitter Lesson 自我檢查
你的文章說：

「Harness 的每個組件都編碼了一個『模型做不到』的假設。這些假設值得不斷壓力測試。」

你的 RAG 設計中有哪些「假設」需要壓力測試？

假設 編碼在 值得測試
「LLM 不會自己判斷查詢類型」 Planner 節點 現代模型可能直接處理
「需要 HyDE 才能搜好」 Phase 2 HyDE 直接 embedding 可能已夠好
「需要 Multi-query 才能涵蓋語意」 Phase 2 Multi-query 同上
「需要 Reranker 才能排好」 BGE-Reranker Vectorize 本身的 cosine 排序可能夠
「Critic 需要獨立 LLM 呼叫」 Critic 節點 對簡單查詢可能多餘
「需要 LangGraph 才能管理流程」 整個 pipeline Phase 1 可能純函數就夠
建議：每個組件都加上 feature flag，能 A/B 測試「有 vs 沒有」的品質差異。

📋 Harness 改進優先級清單
立即（本週）

# 項目 理由

H1 建立根目錄 CLAUDE.md 你的「Repository as Truth」原則。專案概覽、技術棧、開發流程、命名規範
H2 建立 progress.txt 你最推崇的機制。記錄目前狀態、已完成項目、下一步
H3 加 pre-commit hook（lint + reference check） 你的「Linter 是法律」原則。不讓斷連結和 lint 錯誤進入 repo
H4 把 check-post-references.mjs 加入 CI 49 個斷連結是「prompt 是建議」的直接後果
短期（1-2 週）

# 項目 理由

H5 Session-start hook：自動跑 pnpm lint + 讀 progress.txt Anthropic 啟動儀式
H6 Post skill 加 Evaluator 步驟 Generator-Evaluator 原則。發文前自動檢查品質
H7 記錄設計決策理由（ADR 格式） Agent-readable 原則。為什麼用 BGE-large？為什麼 chunk 2000？
H8 Frontmatter type 欄位改為 required 用 schema 強制，不用 prompt 請求
中期（月度）

# 項目 理由

H9 RAG pipeline 每個技術加 feature flag Bitter Lesson。允許拆掉「聰明」的部分
H10 A/B 比較機制（Shadow Mode 提前到 P2） 壓力測試每個「模型做不到」的假設
H11 Context checkpoint 系統 Context Durability。長 session 自動摘要存檔
H12 工具描述品質標準化 Tool Registry 原則。每個工具有 when/when-not/format 說明
一句話總結
你寫了「Intelligence without infrastructure is just a demo」，但你的專案目前缺少的正是 infrastructure 層——沒有 CLAUDE.md、沒有 progress.txt、沒有 pre-commit hook、沒有 post evaluator。RAG 設計在架構上對了，但 harness 的基礎建設還沒跟上你文章的標準。

需要我從 H1（建立 CLAUDE.md）開始實作嗎？
