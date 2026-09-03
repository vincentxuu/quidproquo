---
title: "Multi-hop Retrieval：當答案散落在多份文件裡"
date: 2026-09-03
type: deep-dive
category: ai
tags: [multi-hop-retrieval, rag, multi-hop-qa, iterative-retrieval, reasoning, agentic-rag]
lang: zh-TW
tldr: "標準 RAG 一次檢索只找一組文件，但真實問題常需跨 2-4 份文件推理。IRCoT 開創交錯式檢索推理，PAR²-RAG 在四個基準上比 IRCoT 準確率高 23.5%，CompactRAG 把 LLM 呼叫壓到只有兩次。"
description: "Multi-hop Retrieval 的設計原理、五種主要框架（IRCoT、ReSP、HANRAG、DualRAG、PAR²-RAG）的比較，以及與 Agentic RAG、GraphRAG 的關係。"
draft: false
series:
  name: "RAG 技法大全"
  order: 51
---

> 🌏 [English version](/en/posts/ai/2026-09-03-multi-hop-retrieval-rag-en)

標準 RAG 做一次檢索、一次生成。這對「某個 API 怎麼用」之類的單跳問題夠了，但真實場景的問題常常不是一跳能解的：「A 公司去年營收多少？跟 B 公司比如何？」需要查兩份財報再比較；「這個藥物的副作用機制牽涉哪些蛋白質？」需要串接多篇論文的發現。依 [MuSiQue](https://arxiv.org/abs/2108.00573) 基準的設計，這類問題需要 2-4 個推理跳躍，而且刻意排除了靠捷徑推理就能答對的題目。

## 為什麼一次檢索不夠

單跳檢索的結構性問題：

1. **資訊散佈**：答案的各個碎片分散在不同文件，單次 top-k 不太可能全部撈到
2. **查詢模糊**：原始問題太複雜，embedding 無法同時捕捉所有子意圖
3. **推理依賴**：第二跳的查詢取決於第一跳的結果（「A 公司的 CEO 是誰？」→「那個人還擔任哪些公司董事？」），不先回答第一跳就無法組出第二跳的 query

依 [arXiv:2601.00536](https://arxiv.org/abs/2601.00536)（Retrieval-Reasoning Processes for Multi-hop QA: A Four-Axis Design Framework）的分類，multi-hop 系統沿四個軸設計：推理方式（隱式 vs 顯式）、檢索時機（預先 vs 交錯）、知識整合方式、終止條件。

## 五種主要框架

### IRCoT：交錯檢索與思維鏈

[IRCoT](https://arxiv.org/abs/2212.10509)（Interleaving Retrieval with Chain-of-Thought Reasoning, 2023）是 multi-hop retrieval 的奠基工作。做法：讓 LLM 生成一步 CoT 推理 → 用推理結果當 query 檢索 → 把新證據加進 context → 繼續下一步推理，交替進行直到推理完成。

問題在於計算成本隨跳數線性增長，每一輪都要完整的 LLM 呼叫，而且 prompt 越來越長。

### ReSP：檢索、摘要、規劃

[ReSP](https://arxiv.org/abs/2407.13101)（Retrieve, Summarize, Plan, WWW 2025 Agent4IR Workshop）針對 IRCoT 的兩個弱點做改進：context 過載和重複規劃。

核心設計是**雙功能摘要器**：對檢索到的文件同時做兩種摘要——一份針對全局問題（存入 global evidence memory），一份針對當前子問題（存入 local pathway memory）。這壓縮了 context 長度，也記錄了檢索軌跡避免重複查。

依論文數據，ReSP 在 HotpotQA 上 F1 提升 4.1、在 2WikiMultihopQA 上提升 5.9，而且對 context 長度的魯棒性顯著優於 IRCoT。

### HANRAG：抗噪音的啟發式框架

[HANRAG](https://arxiv.org/abs/2509.09713)（Heuristic Accurate Noise-resistant RAG, Ant Group, 2025）解決的問題是：迭代檢索會累積噪音——每一輪檢索帶回的不相關文件會汙染後續推理。

做法：用一個 **revelator** 模組做三件事——路由查詢（判斷需不需要多跳）、分解子查詢、過濾噪音文件。結果在單跳和多跳任務上都有提升，特別是噪音文件比例高的場景。

### DualRAG：雙程序整合推理與檢索

[DualRAG](https://arxiv.org/abs/2504.18243)（2025）借用認知科學的「雙程序理論」（System 1 快速直覺 / System 2 慢速推理）：

- **RaQ（Reasoning-augmented Querying）**：沿推理路徑生成針對性查詢
- **pKA（progressive Knowledge Aggregation）**：系統性整合新取得的知識，確保推理連貫

兩個程序緊密耦合——RaQ 產生的推理軌跡引導 pKA 的知識整合，pKA 整合的知識反過來支撐 RaQ 的下一步推理。論文還提供 fine-tuning 方法讓小模型維持效能。

### PAR²-RAG：先廣後深，計劃性主動檢索

[PAR²-RAG](https://arxiv.org/abs/2603.29085)（Oracle AI, 2026）是目前效能最高的框架之一。核心想法：把覆蓋率和決策分開。

兩階段設計：
1. **Breadth-first anchoring**：先廣泛檢索，建立高召回率的證據前沿
2. **Depth-first refinement**：在證據前沿上做深度精煉，帶有 evidence sufficiency control 的迭代迴圈

依論文數據，在四個 MHQA 基準上，PAR²-RAG 比 IRCoT 準確率高出最多 **23.5%**，檢索 NDCG 提升最多 **10.5%**。

### CompactRAG：兩次 LLM 呼叫解決多跳

[CompactRAG](https://arxiv.org/abs/2602.05728)（2026）走完全不同的路線：不做迭代，把 LLM 呼叫壓到只有**兩次**——一次分解子問題，一次合成最終答案。中間的子問題解析用固定成本的 local 模組處理。

這是對「多跳一定需要多輪 LLM」假設的直接挑戰。在保持競爭性準確率的同時，token 消耗大幅降低。

## 框架比較

```
方法         推理方式    LLM 呼叫數   抗噪音   代表性結果
─────────────────────────────────────────────────────
IRCoT        交錯 CoT    O(n)         弱      奠基工作
ReSP         摘要+規劃   O(n)         中      HotpotQA F1 +4.1
HANRAG       啟發式路由   O(n)         強      單跳+多跳皆提升
DualRAG      雙程序耦合   O(n)         中      支援小模型 fine-tune
PAR²-RAG     先廣後深    O(n)         強      IRCoT +23.5% 準確率
CompactRAG   一次分解    O(1)         中      token 消耗大幅降低
```

## 與 Agentic RAG 的關係

Multi-hop retrieval 是 [Agentic RAG](/posts/ai/2026-03-12-agentic-rag-react-loop) 的子集。Agentic RAG 的 agent 迴圈天然支援多輪檢索——agent 可以自主決定「資訊不夠，再查一次」，而 multi-hop 就是這個能力的結構化應用。

差異在於：multi-hop 框架通常有明確的推理結構（子問題分解、推理鏈），而 Agentic RAG 更通用——agent 可能因為各種原因決定再檢索，不只是多跳推理。

依 [arXiv:2501.09136](https://arxiv.org/abs/2501.09136)（Agentic RAG Survey）的分類，multi-hop retrieval 屬於 agentic RAG 中「plan-then-retrieve」和「interleaved retrieval-reasoning」兩個子類別。

## 與 GraphRAG 的關係

[GraphRAG](/posts/ai/2026-03-12-graph-rag) 天然支援 multi-hop：知識圖譜把實體和關係編碼成節點和邊，沿著邊走就是 hop。查「A 公司 CEO 的其他董事職位」只需要兩跳圖查詢。

但建圖成本高——需要 entity extraction、relation extraction、graph construction，而且圖的覆蓋率取決於建圖品質。依 [arXiv:2509.09713](https://arxiv.org/abs/2509.09713) 的比較，在文件數量大但關係結構不明確的場景（例如新聞文章），text-based multi-hop retrieval 反而更實用。

## 評估的特殊挑戰

Multi-hop QA 的評估比單跳困難得多：

1. **推理鏈標註**：不只需要最終答案，還需要標出中間推理步驟和支持證據。HotpotQA 要求標出 supporting sentences，MuSiQue 要求標出每一跳的中間答案。
2. **捷徑推理**：模型可能不經過完整推理就猜到答案。MuSiQue 的設計目標就是消除這種捷徑——依 [Trivedi et al.](https://arxiv.org/abs/2108.00573) 的分析，它把單跳可回答的問題排除在外。
3. **跳數可控性**：[MHTS](https://arxiv.org/abs/2504.08756)（Multi-Hop Tree Structure Framework, 2025）讓研究者生成特定跳數的問題，用來測試系統在不同複雜度下的表現。

依 [arXiv:2604.18234](https://arxiv.org/abs/2604.18234)（ECIR 2026）的比較，LLM-based 的 retrieval 評估策略在多跳場景下需要針對性調整——單跳場景有效的評估方法在多跳場景可能產生誤導。

### 主要基準

| 基準 | 跳數 | 特色 |
|---|---|---|
| [HotpotQA](https://hotpotqa.github.io/) | 2 | 橋接題 + 比較題，附 supporting sentences |
| [2WikiMultihopQA](https://arxiv.org/abs/2011.01060) | 2 | 跨兩篇 Wikipedia 的共享實體推理 |
| [MuSiQue](https://arxiv.org/abs/2108.00573) | 2-4 | 刻意排除捷徑，最嚴格的多跳基準 |
| [MultiHop-RAG](https://arxiv.org/abs/2401.15391) | 2-4 | 新聞文章知識庫，貼近真實 RAG 場景 |

## 一個反直覺的發現

依 [arXiv:2601.19827](https://arxiv.org/abs/2601.19827)（When Iterative RAG Beats Ideal Evidence, 2026）在化學領域的 ChemKGMultiHopQA 實驗：11 個 SOTA LLM 中，**迭代 RAG 的效能有時候超過直接給 gold context**。

這違反了「給更好的證據一定更好」的直覺。論文的解釋：分階段檢索讓模型在每一步只處理一小塊資訊，避免了長 context 中的注意力分散。gold context 一次性塞入所有相關文件，模型反而可能被無關段落干擾。

這跟 [OP-RAG](https://arxiv.org/abs/2409.01666)（In Defense of RAG）的發現互相印證：即使 context window 夠大，RAG 的分段處理仍有 token 效率優勢。

## 整體來說

Multi-hop retrieval 解決的是 RAG 的結構性限制：真實問題的答案往往不在同一份文件裡。從 IRCoT 的交錯式檢索推理，到 PAR²-RAG 的先廣後深，再到 CompactRAG 的固定呼叫次數，這個領域正在從「能做多跳」演進到「高效做多跳」。

選擇框架的核心考量：如果問題跳數固定且可預測（例如總是查兩份文件比較），CompactRAG 式的分解-合成最省成本；如果跳數不確定且需要動態調整，PAR²-RAG 式的計劃性主動檢索更可靠；如果噪音文件比例高，HANRAG 的過濾機制值得考慮。

## 參考資料

- [arXiv:2601.19827 — When Iterative RAG Beats Ideal Evidence: Multi-hop QA Diagnostic Study](https://arxiv.org/abs/2601.19827)（2026）
- [arXiv:2407.13101 — ReSP: Retrieve, Summarize, Plan for Multi-hop QA](https://arxiv.org/abs/2407.13101)（2024, WWW 2025）
- [arXiv:2509.09713 — HANRAG: Heuristic Accurate Noise-resistant RAG for Multi-hop QA](https://arxiv.org/abs/2509.09713)（2025, Ant Group）
- [arXiv:2504.18243 — DualRAG: A Dual-Process Approach for Multi-Hop QA](https://arxiv.org/abs/2504.18243)（2025）
- [arXiv:2603.29085 — PAR²-RAG: Planned Active Retrieval and Reasoning for Multi-Hop QA](https://arxiv.org/abs/2603.29085)（2026, Oracle AI）
- [arXiv:2602.05728 — CompactRAG: Reducing LLM Calls and Token Overhead in Multi-Hop QA](https://arxiv.org/abs/2602.05728)（2026）
- [arXiv:2212.10509 — IRCoT: Interleaving Retrieval with Chain-of-Thought Reasoning](https://arxiv.org/abs/2212.10509)（2023）
- [arXiv:2601.00536 — Retrieval-Reasoning Processes for Multi-hop QA: A Four-Axis Design Framework](https://arxiv.org/abs/2601.00536)（2025）
- [arXiv:2108.00573 — MuSiQue: Multihop Questions via Single-hop Question Composition](https://arxiv.org/abs/2108.00573)（2021）
- [arXiv:2504.08756 — MHTS: Multi-Hop Tree Structure Framework for Difficulty-Controllable QA](https://arxiv.org/abs/2504.08756)（2025）
- [arXiv:2604.18234 — Evaluating Multi-Hop Reasoning in RAG Systems](https://arxiv.org/abs/2604.18234)（ECIR 2026）
- [HotpotQA — A Dataset for Diverse, Explainable Multi-hop QA](https://hotpotqa.github.io/)
- [arXiv:2401.15391 — MultiHop-RAG: Benchmarking RAG for Multi-Hop Queries](https://arxiv.org/abs/2401.15391)（2024）
- [arXiv:2501.09136 — Agentic RAG Survey](https://arxiv.org/abs/2501.09136)（2025）
- [Agentic RAG：讓 LLM 自己決定要不要再搜尋一次](/posts/ai/2026-03-12-agentic-rag-react-loop)
- [GraphRAG：把知識做成圖，讓 LLM 沿著關係推理](/posts/ai/2026-03-12-graph-rag)
- [Self-RAG：用 Reflection Token 讓模型自己決定要不要檢索](/posts/ai/2026-09-03-self-rag-reflection-tokens)
