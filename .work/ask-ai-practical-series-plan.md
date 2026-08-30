# Ask AI RAG 實戰子系列工作計畫

Last updated: 2026-08-30

Status: orders 0–9 bilingual drafts and optional RAG Techniques companion-reading guides complete; `pnpm verify` passes. Awaiting user review. No commit, push, or deploy.

## 定位

`RAG 技法大全` 解釋 chunking、BM25、Vectorize、RRF、HyDE、Multi-query、Critic 等單項技法；本子系列用 quidproquo Ask AI 的真實資料流，回答這些技法如何接成一套可操作、可失敗、可驗證的系統。

## 建議弧線

使用者按下送出
  → 文章如何進入可檢索語料
    → 問題如何被規劃與召回
      → 證據如何變成答案
        → 答案如何通過驗證與來源門檻
          → 系統如何串流、記錄、快取與評估
            → 用兩次中文召回事故回頭驗證整條鏈

## 篇章

| order | 主題 | 聚焦問題 | 狀態 |
|---|---|---|---|
| 0 | Ask AI 全貌：一個問題經過哪些關卡 | UI 到 sources／related cards 的責任地圖 | 雙語草稿完成 |
| 1 | 文章怎麼進知識庫：Chunk、D1 FTS5、Vectorize | Markdown 更新後如何形成可重跑、可刪除的雙索引 | 雙語草稿完成 |
| 2 | 問題怎麼找到文章：Planner、Hybrid Retrieval、Retry | query plan、keyword rewrite、BM25／vector、弱召回與第二輪搜尋怎麼接 | 雙語草稿完成 |
| 3 | 證據怎麼變成答案：Writer Context 與 Citation Contract | context 如何截取，模型可引用哪些 URL，沒證據時為何拒答 | 雙語草稿完成 |
| 4 | 回答何時可以顯示來源：Validation、Critic、Degrade、Source Gate | 格式正確、來源合法、內容 grounded 是三個不同門檻 | 雙語草稿完成 |
| 5 | 上線後怎麼知道哪裡壞了：SSE、Trace、Cache、Checkpoint、Shadow | 使用者體驗與可觀測性如何對應 pipeline state；哪些只是本機／shadow 能力 | 雙語草稿完成 |
| 6 | 中文召回事故一：D1 FTS5 為什麼只回 10 筆 | CJK tokenizer、limit、pagination | 既有雙語文章，已納入子系列 |
| 7 | 中文召回事故二：為什麼 0 筆拒答卻推薦正確文章 | 分詞、metadata lane、Vectorize fallback、來源顯示語意 | 既有雙語文章，已納入子系列 |
| 8 | 列舉事故：索引有 136 篇課程導讀，為什麼只答出少數幾篇 | broad listing intent、generic-token pollution、top-k、unique slug、Writer coverage、completeness critic | 雙語草稿完成；保留單次 production observation 邊界 |
| 9 | 從三個事故做 Retrieval Eval | 把單一重現案例變成 golden contract、offline fixture、live observation 與 promotion gate | 雙語草稿完成；未捏造 raw ranked-result benchmark |

## 斷崖處理

- order 0→1：先給 UI→API→pipeline→presentation 責任圖，再進索引內部；避免第一篇就掉進 FTS5 schema。
- order 2→3：先把 retrieval result 當作可見物，再解釋 Writer context 與 citation membership；不在同一篇同時教召回與生成。
- order 5→6：用公開 SSE 能看到的事件與看不到的 hidden chunks 當界線，再進事故文；避免把 trace 當完整內部狀態。
- order 8→9：q21 單次 production observation 只當案例，order 9 回到可重跑 contract；fixture 通過不代表 production 品質。

## RAG 技法大全搭配閱讀

每篇開頭放「搭配閱讀（選讀）」：零基礎可以直接讀本文，不把概念文設成硬性先修；想補概念時再點對應文章。

| Ask AI order | 搭配的 RAG 技法大全文章 |
|---:|---|
| 0 | RAG 的三個世代、Modular RAG Pipeline |
| 1 | Chunking 策略、Vector Database 選型 |
| 2 | Hybrid Search、RRF、CRAG |
| 3 | RAG Prompt Engineering |
| 4 | Self-Reflection＋LLM-as-Judge、RAG Guardrails |
| 5 | RAG Streaming、RAG Observability、Semantic Caching |
| 6–7 | Hybrid Search、RAG 常見失敗模式 |
| 8 | Query Classification、Agentic RAG |
| 9 | RAG 評估框架、RAG A/B 測試 |

## 範圍原則

- 每篇只追一條責任，不重寫 RAG 技法大全的原理文。
- 程式碼只節錄足以追資料流的部分，完整實作連回 GitHub。
- 既有兩篇事故文不重寫，只補 series metadata、導讀互鏈與必要現況回填。
- Order 9 沒有 raw run 就不寫結果，不把 adapter、dry-run 或 shadow 存在寫成 production 成效。

## 確認後驗證

- [x] 逐篇核對 UI → API → pipeline → retrieval agents → presentation 的程式碼與測試。
- [x] Groundlane 核對線上 RAG 技法大全 48 篇與 repo inventory 一致；新文的實作主張以 repo 程式碼與 runbook 為準。
- [x] 每個 order 同步產出 zh-TW + en 草稿與互鏈。
- [x] Orders 0–9 的中英文文章皆加入對應的「RAG 技法大全」選讀導引；零基礎讀者可直接讀實戰文。
- [x] 兩篇既有事故文補 series metadata 與更新紀錄；新系列沒有更早的過期承諾。
- [x] `pnpm check:references`、`pnpm lint`、`pnpm astro check`、`pnpm check:tw`。
- [x] 長文 register scan／ledger scan。
- [x] `pnpm verify` 全數通過。
