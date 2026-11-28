# 查證紀錄：Agentic OS 加 System 1/2/3

研究 ID：2026-11-26-agentic-os-system-123（查證日 2026-11-26，工具 Groundlane web_search / web_fetch）

| 主張 | 來源 | 讀取範圍 | 結果 |
|---|---|---|---|
| AIOS kernel 提供排程、context、記憶、儲存、存取控制；最高 2.1x；COLM 2025 | arxiv.org/abs/2403.16971 | 摘要與 metadata | 確認 |
| MemGPT 借用 OS 記憶體階層做虛擬 context 管理 | arxiv.org/abs/2310.08560 | 摘要 | 確認 |
| SOFAI 三角色；仲裁是「只 S1」或「S1 後再 S2」；離線 learning 與 reflection | nature.com/articles/s44387-025-00027-5 | 引言全段（頁面截斷於引言後） | 確認 |
| Sophia：System 3 定義、四機制、自承以概念為主、重複任務推理步數減 80% | arxiv.org/abs/2512.18202 | 摘要 | 確認 |
| Wharton Tri-System：AI 答對升、答錯降到 baseline 以下、信心上升；cognitive surrender | Wharton Exec Ed 文章 | 正文前半 | 確認；OSF 預印本頁為 JS 頁面抓不到內文，改引 Wharton 文章與 SSRN 連結 |
| n8n 官方模板依用途分 AI/Sales/IT Ops/Marketing/Document Ops 等少數類 | n8n.io/workflows/categories/ai | 分類列 | 確認；搜尋摘要另見 Other、Support |
| n8n blog 列 validation、error recovery、context、governance、cost control（model cascading） | blog.n8n.io/agentic-ai-design-patterns | 正文主體 | 確認 |
| n8n 架構模式文對應 orchestrator、pipeline、fan-out | blog.n8n.io/ai-agent-architecture-patterns | 搜尋摘要 | 僅摘要 |
| NCM 與 System 1/2/3 並列的定義 | 多組查詢（中英） | — | 無對應來源；同名 Next-Concept Modeling (arXiv 2610.14162) 不相關 |
| 「20 類」n8n 模板 | 官方分類頁 + 第三方清單 | — | 官方非 20 類，屬第三方分法 |
