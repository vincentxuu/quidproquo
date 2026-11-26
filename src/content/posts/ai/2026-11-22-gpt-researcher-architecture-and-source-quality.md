---
title: "GPT Researcher 深度解析：Critic Loop、Source Allowlisting 與維護狀態"
date: 2026-11-22
category: ai
type: deep-dive
tags: [gpt-researcher, deep-research, multi-agent, critic-loop, source-quality]
lang: zh-TW
tldr: "GPT Researcher 以多代理批評迴路與來源白名單檢查強化資料來源品質，並透過 draft_revision_count 與 max_draft_revisions 機制避免無限迴圈。"
description: "GPT Researcher 的 LangGraph 多代理架構、Reviewer/Reviser 批評迴路、source URL allowlisting 與維護狀態的深入分析，並與 STORM、Open Deep Research、Local Deep Research 做架構比較。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 16
---

前面幾篇看的是開源工具全景（order 11）與商用產品格局（order 12）。這篇深入單一專案：**GPT Researcher** 的多代理架構、批評迴路（critic loop）設計、來源驗證機制，以及它與其他開源專案的維護狀態與成本差異。

---

## 1. 多代理架構分工

GPT Researcher 的架構基於 LangGraph，採用多代理協作模式，包含七個專業角色：

- **Planner Agent**：將任務拆解為多個子問題，生成研究大綱
- **Research Agents**：並行執行多個搜尋與資料收集任務
- **Editor**：規劃報告大綱與結構
- **Reviewer**：審核研究草稿的正確性與完整性
- **Reviser**：根據批評結果進行修訂
- **Writer**：整合所有研究結果，撰寫最終報告
- **Publisher**：格式化並導出為 PDF、Markdown 或 Word

這些代理以 sub-graph 形式運作，每個平行研究任務擁有獨立狀態，避免主圖競爭條件。

## 2. 批評迴路（Critic Loop）設計

GPT Researcher 實作了確定性的批評迴路機制：

1. **Review 步驟**：Reviewer 根據預設 `guidelines` 檢查草稿的正確性、完整性與引用準確性
2. **批評回傳**：Reviewer 回傳具體修訂建議或確認草稿足夠
3. **Reviser 步驟**：根據批評結果修訂，並更新 `draft_revision_count`
4. **重試機制**：若達到 `max_draft_revisions`（預設 3 次），則強制接受並附加警告標記
5. **交叉驗證**：在驗證表中將關鍵事實與來源交叉比對

PR #1885（已合併至 #1909）加入了 `draft_revision_count` 與 `max_draft_revisions`，避免無限迴圈。超過上限後強制接受，確保研究流程不會卡住。

## 3. 來源驗證與白名單機制

GPT Researcher 在 `writer.py` 和 `reviewer.py` 中實作了三個關鍵機制：

1. **source URL allowlisting**：所有引用的 URL 必須出現在當次研究的 `search_results` 中，否則視為幻覺來源
2. **來源登錄與讀取狀態**：所有來源登錄於 `sources.jsonl`，並標註 `read_status`（read、partial、blocked 等）
3. **來源品質分級**：分為一手、高品質二手、摘要轉引與內容農場四種等級

這些機制確保研究報告的資料來源能夠被驗證、追溯，並提升整體研究品質。

## 4. 與其他開源專案的架構比較

| 維度 | GPT Researcher | STORM | Open Deep Research | Local Deep Research |
|---|---|---|---|---|
| **協調模式** | 管線型（固定順序） | 對話模擬型 | Supervisor-Worker 動態 | 線性本地迴圈 |
| **計畫與搜尋** | 分離（先計畫再搜尋） | 融合（對話中同時進行） | 分離但可動態追加 | 分離 |
| **記憶管理** | VectorStore / RAG | 對話歷史 + 資訊清單 | 狀態物件（TypingDict） | 加密 SQLCipher 儲存 |
| **引用設計** | inline citation + source URL allowlisting | outline-first，來源綁定較弱 | 摘要階段引用 | 策略相關 |
| **維護狀態** | 活躍（v3.7.0, 2026-09-26） | 凍結（2025-09-30） | 活躍 | 活躍 |

GPT Researcher 的設計強調「先大量收集，後精密抽出」，適合企業級深度研究與內部資料分析。STORM 適合讀、不適合做 production 依賴（凍結 repository）。Local Deep Research 唯一強調「不離開本機」，適用於機密資料。

## 5. 維護狀態與成本結構

| 專案 | 最新版本 | 維護狀態 | 單篇報告成本 |
|---|---|---|---|
| GPT Researcher | v3.7.0（2026-09-26） | 活躍（Apache-2.0） | $0.20–$2.00（含模型 token 與搜尋 API） |
| Open Deep Research | — | 已歸檔（2026-08-21） | 不適用 |
| STORM | — | 凍結（2025-09-30 後無提交） | 不適用 |
| Local Deep Research | 活躍 | 活躍 | $0.20–$2.00（本地模型為主） |

Tavily 深度搜尋每次 $0.032–$2.00，與 vendor 定價（例如 OpenAI Deep Research 每月限額）形成對比。

## 6. 小結

GPT Researcher 的多代理批評迴路與來源白名單檢查機制，透過多源數據來源與嚴格的來源驗證，提升資料來源品質與研究可驗證性。與 STORM 的凍結、Open Deep Research 的歸檔相比，GPT Researcher 是目前開源生態中維護最活躍的專案之一。

---

## 參考資料

- [GPT Researcher GitHub Repository](https://github.com/assafelovic/gpt-researcher)
- [GPT Researcher 官方文件](https://docs.gptr.dev)
- [GPT Researcher PR #1885](https://github.com/assafelovic/gpt-researcher/pull/1885)
- [STORM](https://arxiv.org/abs/2410.01208) — Stanford，專家對話式大綱。
- [Open Deep Research](https://github.com/langchain-ai/open_deep_research) — LangChain 檔案歸檔（2026-08-21）。
- [Local Deep Research](https://github.com/LearningCircuit/local-deep-research) — 完全本地部署。
- [digitalapplied.com: Four Open-Source Deep Research Agents, Tested Honestly](https://www.digitalapplied.com/blog/open-source-deep-research-agents-2026-guide)
- [menuagentic.com: GPT Researcher vs Local Deep Research vs STORM vs DeerFlow](https://menuagentic.com/blogs/gpt-researcher-vs-local-deep-research-vs-storm-vs-deerflow/)
- [llms.blog: Autonomous Deep Research Agent Architectures in Production](https://www.llms.blog/posts/autonomous-deep-research-agent-architectures-in-production-comparing-stanford-storm-gpt-researcher-langchain-open-deep-research-and-hugging-face-smolagents)
- [zenn.dev: AI Research Agent 的設計模式比較](https://zenn.dev/acompany/articles/c7c9df1244ad05)
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
- [open-source-tools-overview](/posts/ai/2026-09-19-open-source-tools-overview) — 本系列 order 11：開源工具全景。