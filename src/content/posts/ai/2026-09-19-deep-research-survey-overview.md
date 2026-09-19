---
title: "Deep Research 全景圖：80+ 實作的分類、路線與取捨"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, survey, ai-agent, taxonomy, llm, roadmap]
lang: zh-TW
tldr: "整個 Deep Research 領域有 80+ 實作，但核心結構只有三階段路線 × 四個組件 × 三種優化方法。這篇用一篇看懂全景：從 Agentic Search 到 Full-stack AI Scientist，從 query planning 到 answer generation，從 workflow prompting 到 end-to-end RL。"
description: "系統性地梳理 80+ 個 Deep Research 實作的分類框架：三階段能力路線（Agentic Search → Integrated Research → Full-stack AI Scientist）、四個核心組件（規劃、獲取、記憶、生成）、三種優化範式（prompting、SFT、RL），並說明與傳統 RAG 的根本差異。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 0
---

2025 年，「Deep Research」從實驗室概念變成產類別型。OpenAI、Google、Perplexity、Anthropic 先後推出正式功能；開源端從 GPT-Researcher 到 Search-R1，半年內湧現 80+ 個實作。但這些系統看起來各自為政——差別到底在哪？

最新的一系統性調查論文（arXiv:2506.12594，2025 年 11 月）把整個領域整理成一個清晰的骨架：**三階段能力路線 × 四個核心組件 × 三種優化方法**。掌握這個框架，就能一眼看穿每個實作坐在哪裡、取捨什麼。

這篇先從最高層級的分類切入，把全景圖攤開；細節與代表性系統留到後續文章。

## 三階段路線：從搜尋到科學家

這個調查最核心的貢獻，是把 Deep Research 視為一個**能力軌跡**（capability trajectory），而不是價值階梯。系統不需要一步到位，而是沿著三個階段逐步擴張能做的事：

| 階段 | 能力 | 代表任務 | 關鍵指標 |
|---|---|---|---|
| **Phase I：Agentic Search** | 找到正確來源、提取答案 | 開放域問答、多跳問答 | 準確率、召回率 |
| **Phase II：Integrated Research** | 綜合異質證據、產出結構化報告 | 長篇研究報告、調查報告 | 一致性、歸屬完整性 |
| **Phase III：Full-stack AI Scientist** | 提出假說、設計實驗、批判現有主張 | 論文審閱、科學發現、實驗自動化 | 新穎性、可重現性 |

Phase I 的系統本質是「聰明的搜尋器」：把使用者的問題拆成子查詢、檢索文件、過濾雜訊、給出帶引用的答案。Phase II 則需要把碎片化的證據串成有邏輯的敘事——這時候「停止條件」和「衝突調和」變得關鍵。Phase III 是最終形態：不只是彙編已知事實，而是能提出原創假說並設計驗證實驗。

> 這個分類的實用價值在於：**讀者可以一眼看出某個實作處於哪個階段**，進而判斷它適不適合自己的需求。要快速找事實？Phase I 就夠了。要寫一篇完整的研究報告？至少需要 Phase II。要自動化科學發現流程？那是 Phase III 的領地。

## 四個核心組件：DR 系統的閉環

不管處於哪個階段，每個 Deep Research 系統都循環運轉四個組件（Shao et al., 2025）：

### 1. Query Planning（規劃）

把模糊、複雜的問題拆成一系列可獨立執行的子查詢。三種策略：

- **並行規劃**：一次性分解出所有子問題，每個獨立解決。適合結構清晰的問題。
- **序列規劃**：每步依賴上一步的結果動態調整。適合探索性強、需要「先試再說」的問題。
- **樹狀規劃**：探索多條推理路徑（如 Monte Carlo Tree Search），平衡探索與利用。適合開放度最高的問題。

代表性工作：Least-to-Most Prompting、CoVE（Chain-of-Verification）、Search-R1 的端到端學習規劃。

### 2. Information Acquisition（獲取）

決定「什麼時候」以及「怎麼樣」去外部獲取資訊。三個子問題：

- **檢索工具**：傳統搜尋引擎 API、瀏覽器自動化、向量資料庫、多模態檢索。
- **檢索時機**：每步都搜？只在不確定時搜？用 confidence-based 方法（如 Self-RAG）決定。
- **資訊過濾**：文件選擇、上下文壓縮、規則清理。從點對點相關性評分到列表級排名。

這個組件是 DR 與傳統 RAG 最明顯的分界點：RAG 通常是靜態檢索一次性增強，而 DR 的檢索是**反覆、動態、策略性的**。

### 3. Memory Management（記憶管理）

在長時程研究中維護任務上下文。四個過程：

- **記憶整合**：將臨時資訊轉為結構化表示（敘事摘要或知識圖譜）。
- **記憶索引**：訊號增強索引、圖譜索引（支援多跳推理）、時間線索引。
- **記憶更新**：新資訊與舊知識衝突時的處理機制。
- **記憶遺忘**：主動刪除不相關資訊，防止上下文窗口飽和。

記憶管理常被稱為 DR 的「基石」——沒有它，長時間的研究會變成斷裂的片段。

### 4. Answer Generation（輸出生成）

把累積的證據綜合為有歸屬的輸出。四個過程：

- **整合上游資訊**：合併規劃、檢索結果與記憶狀態。
- **綜合證據與維持一致性**：用可信度感知注意力、多代理協商、或 RL 獎勵解決衝突。
- **結構化推理與敘事**：Chain-of-Thought、結構化規劃、工具輔助推理。
- **多模態呈現**：從純文字扩展到視覺化、簡報、表格、程式碼。

## 三種優化範式：從手動到端到端

怎麼讓這四個組件協調得好？調查歸納了三種方法（按「手工程度」從高到低）：

| 範式 | 做法 | 適合時機 | 代表 |
|---|---|---|---|
| **Workflow Prompting** | 手動設計多代理 pipeline，orchestrator 分配任務給 worker | 快速原型、需要可解釋性、沒有訓練資源 | Anthropic 多代理系統（+90.2% 內部評測） |
| **Supervised Fine-Tuning (SFT)** | 用強模型的成功軌跡訓練小模型（強→弱 distillation） | 需要部署效率、特定環節優化 | Open-RAG、AUTO-RAG、DeepRAG |
| **End-to-End RL** | 整個 pipeline 用 PPO/GRPO 訓練，獎勵最終答案正確性 | 追求全局最優、願意承受訓練不穩定 | Search-R1、R1-Searcher、Rewrite-Retrieve-Read |

取捨很清楚：**workflow prompting 最靈活但最貴（token 消耗約 15×）；SFT 最實用但依賴強教師模型；端到端 RL 潛力最大但訓練最不穩定****。

## 與 RAG 的根本差異

調查用九個維度對比了 RAG 與 DR（三個階段）：搜尋引擎存取、工具多樣性、程式碼執行、反身修正、任務記憶、創新能力、長篇輸出、行動空間、推理視野、工作流組織。

核心結論：**RAG 是「檢索作為靜態增強」，DR 是「檢索作為動態行動」**。RAG 的行動空間窄、推理視野單步、工作流固定；DR 則在所有維度上逐步擴張。

## 下一步

這篇是全景分類。後續文章會深入每個環節：具體的訓練方法論（order 2–4）、評估基準與困境（order 7–9）、開源工具與商用產品（order 11–12），以及我們自己的實作選擇（order 13）。

## 參考資料

- [Deep Research: A Systematic Survey](https://arxiv.org/abs/2506.12594) — Shao et al., Nov 2025。三階段路線、四個組件、三種優化方法的核心論文。
- [Deep Research: A Survey of Autonomous Research Agents](https://arxiv.org/abs/2508.12752) — 2025 年 8 月。能力導向、模組化視角，側重每個核心能力如何獨立優化。
- [Deep Research Agents: A Systematic Examination And Roadmap](https://arxiv.org/abs/2506.18096) — Huang et al., Jun 2025。靜態 vs. 動態工作流、單代理 vs. 多代理分類。
- [Deep Research Survey GitHub Repository](https://github.com/scienceaix/deepresearch) — 調查論文的持續更新倉庫。
- [awesome-deep-research-agent](https://github.com/ai-agents-2030/awesome-deep-research-agent) — Huang et al. 維護的 DR agent 研究列表。
- [autonomous-deep-research-agent](/posts/ai/2026-06-04-autonomous-deep-research-agent) — 本系列前一篇文章：四個環節的架構拆解。
