---
title: "Agent 怎麼決定「要不要查、查什麼、怎麼合」：Agentic RAG 的三個決策層"
date: 2026-06-04
category: ai
type: deep-dive
tags: [rag, agentic-rag, retrieval, ai-agent, llm]
lang: zh-TW
tldr: "傳統 RAG 是固定管線「先查再答」；Agentic RAG 把檢索拆成三層決策：何時檢索（FLARE 用 token 機率、Adaptive-RAG 用複雜度分類器）、檢索什麼（HyDE / RAG-Fusion / 分解 / Step-back）、如何整合（RRF k=60 → cross-encoder rerank → 壓縮，Anthropic 實測失敗率 −67%）。關鍵反直覺：不必要的檢索會傷品質，「決定不查」是一級能力。"
description: "整理 Agentic RAG 的三個決策層與 agent loop：Self-RAG、Adaptive-RAG、FLARE、CRAG 的觸發機制，query 變形五招，RRF 融合與 reranking 的工程數字，以及 ReAct / Plan-and-Solve / IRCoT 怎麼把這些決策串成迴圈。"
draft: false
---

傳統 RAG 是「先檢索再讀」的**固定管線**：不管問題難易、不管模型自己會不會，都先去拉一次知識庫。Agentic RAG 把檢索變成 **agent 的一連串決策**——每一步都問三個問題：**(1) 現在需要檢索嗎？(2) 該查什麼、查哪裡？(3) 拿回來的多路結果怎麼合成一份可用 context？**——並把這些決策包進 plan → retrieve → reflect 的迴圈，直到「夠了」才生成答案。

先講最重要的反直覺結論：**不必要的檢索會傷害品質**。對熱門實體、模型已高信心能答的問題，硬塞檢索結果反而注入雜訊、拉低正確率，還增加延遲與成本（Mallen et al. 對長尾 vs 熱門問題的分析是這條線的源頭）。所以「決定不檢索」和「決定檢索」一樣重要——會判斷何時不查，才是 agentic 的精髓。

## 為什麼固定管線不夠

Naive RAG 有三個結構性痛點：對熱門 / 已知問題反而被檢索雜訊拖累；單次檢索吃不下 multi-hop 問題（「A 的作者的母校在哪」需要兩跳）；檢索品質差的時候，錯誤 context 會放大幻覺而不是抑制。這三個痛點分別對應接下來的三層決策。

## 第一層：何時檢索（when）

四種觸發訊號，本質都是「估自己會不會、拿到的夠不夠」的信心判斷：

- **生成中的不確定性**：FLARE（arXiv:2305.06983）在生成時監看下一句的 token 機率，**低於門檻就觸發前瞻式檢索**、重生該句——不確定性本身就是檢索的觸發器。
- **事前的問題複雜度**：Adaptive-RAG（arXiv:2403.14403）訓練一個 T5 分類器預測 query 複雜度，輸出三選一：**不檢索 / 檢索一次 / 多次檢索**（複雜題走 IRCoT 式迭代）。
- **模型自發訊號**：Self-RAG（arXiv:2310.11511）讓模型在生成中輸出 **reflection tokens**，自行決定何時檢索、並評估檢索段落是否相關、答案是否被支持。
- **事後品質回饋**：CRAG（arXiv:2401.15884）用輕量 retrieval evaluator 給檢索結果評分，分三檔動作：**Correct** 走 decompose-then-recompose 萃取「知識條（knowledge strips）」；**Incorrect / Ambiguous** 則 fallback 到 web search 重查。

## 第二層：檢索什麼（what）

Query 不是拿來就用。五招變形，各解不同的不對齊問題：

- **多 query 並行**：RAG-Fusion（arXiv:2402.03367）讓 LLM 生 3–5 個 query 變體平行檢索，再用 RRF 聚合——擴大命中面。站內有一篇[多查詢擴展](/posts/ai/2026-03-12-multi-query-expansion)展開這招。
- **分解**：multi-hop 問題拆成多個簡單子問題分別檢索（query decomposition），IRCoT（arXiv:2212.10509）更進一步把檢索**插進 CoT 的每一步**，用上一句推理當下一次檢索的 query。
- **生假答案**：HyDE（arXiv:2212.10496）先讓 LLM 生一份「假設性文件」，用它的 embedding 去檢索——假答案和真文件的語意距離，比問句和文件更近。細節見站內 [HyDE 介紹](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings)。
- **抽象化**：Step-back prompting（arXiv:2310.06117）先問一個更抽象的上位問題求「第一原理」，再帶著它回答原題。
- **路由與過濾**：決定查 vectorstore、web search 還是 SQL，加上 metadata filter——這是 router 的工作，不是 retriever 的。

## 第三層：如何整合（fusion）

多路檢索回來一堆重疊、雜訊、甚至互相矛盾的段落，整合分三步：

**1. Rank fusion 合併去重**。標準做法是 Reciprocal Rank Fusion：`RRF(d) = Σ 1/(k + rank_r(d))`，常數 k 慣用 **60**（Azure AI Search 官方文件同款）。文件在越多路 ranker 越前面、總分越高；缺席的 ranker 貢獻 0。Weighted RRF 可再對不同 retriever 加權（例如 BM25 權重高於向量）。公式推導見站內 [RRF 多來源融合](/posts/ai/2026-03-12-rrf-multi-source-fusion)。

**2. Cross-encoder rerank 精排**。Anthropic 的 [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) 給了最完整的工程數字：嵌入前先為每個 chunk 加專屬上下文，同時做 Contextual Embeddings + Contextual BM25，rank fusion 去重後再 rerank（top-150 → top-20）。實測檢索失敗率：**僅 contextual embeddings −35%；加 BM25 −49%；再加 reranker −67%（5.7% → 1.9%）**。要注意的是：效益視資料領域而定，某些領域 contextual 幾乎沒幫助——務必拿自己的資料 benchmark。站內有 [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval) 與 [cross-encoder reranking](/posts/ai/2026-03-12-cross-encoder-reranking) 兩篇展開。

**3. 壓縮去冗餘**。CRAG 的知識條是一種；LLMLingua（arXiv:2310.05736）/ LongLLMLingua（arXiv:2310.06839）用小模型算 token 重要性做 prompt 壓縮，後者專治長 context 的「lost in the middle」。

## 把三層串起來：agent loop

三層決策不是孤立的，它們被包進一個迴圈：

```
        ┌─────────────────────────────────┐
        ▼                                 │
  plan ──► 要查嗎? ──no──► generate       │
        │ yes                             │
        ▼                                 │
  query 變形 ──► retrieve ──► grade ──────┤
        ▲                      │          │
        │   rewrite/web_search │ 不夠好    │
        └──────────────────────┘  夠好 ──► generate ──► 答案有依據? ──► 輸出
```

代表性的迴圈設計：ReAct（arXiv:2210.03629）讓推理與行動交錯，行動結果回饋下一步推理（站內：[Agentic RAG 與 ReAct loop](/posts/ai/2026-03-12-agentic-rag-react-loop)）；Plan-and-Solve（arXiv:2305.04091）先擬計畫再逐一執行（站內：[Plan-and-Execute RAG](/posts/ai/2026-03-12-plan-and-execute-rag)）；Self-RAG / CRAG 提供反思迴圈（站內：[Corrective RAG](/posts/ai/2026-03-12-corrective-rag-crag)）。停止條件三選一：文件夠相關、答案有依據（hallucination grader 通過）、達迭代上限。

宏觀分類可看 Agentic RAG Survey（arXiv:2501.09136）：用 agent 數量、控制結構、自主程度、知識表示四個軸分類，並對應 reflection / planning / tool use / multi-agent collaboration 四個 design pattern。DeepRAG（arXiv:2502.01142）則把「何時檢索」形式化成 MDP——理論上承認了這是一個序列決策問題。

## 工程取捨

LangGraph 的 adaptive / corrective RAG 範例是把這套落地成 state machine 的標準參考：router → retrieve → grade → rewrite / web_search → generate → hallucination & answer grader。

適用邊界：

- **適合 Agentic RAG**：multi-hop 問題、需要多來源、知識庫品質參差、答錯成本高。
- **用 standard RAG 就好**：單一乾淨知識源、問題簡單、對延遲 / 成本敏感——每多一層決策就多一次 LLM call，agentic 的代價是真實的。

三層決策加一個迴圈，這就是 Agentic RAG 的全部骨架。如果只記一件事：**讓系統有能力說「這題我不用查」，跟有能力查得更好，一樣值錢。**

## 參考資料

- [Self-RAG（arXiv:2310.11511）](https://arxiv.org/abs/2310.11511)
- [Adaptive-RAG（arXiv:2403.14403）](https://arxiv.org/abs/2403.14403)
- [FLARE: Active Retrieval Augmented Generation（arXiv:2305.06983）](https://arxiv.org/abs/2305.06983)
- [Corrective RAG / CRAG（arXiv:2401.15884）](https://arxiv.org/abs/2401.15884)
- [HyDE（arXiv:2212.10496）](https://arxiv.org/abs/2212.10496)
- [Step-Back Prompting（arXiv:2310.06117）](https://arxiv.org/abs/2310.06117)
- [RAG-Fusion（arXiv:2402.03367）](https://arxiv.org/abs/2402.03367)
- [IRCoT: Interleaving Retrieval with Chain-of-Thought（arXiv:2212.10509）](https://arxiv.org/abs/2212.10509)
- [ReAct（arXiv:2210.03629）](https://arxiv.org/abs/2210.03629)
- [Plan-and-Solve Prompting（arXiv:2305.04091）](https://arxiv.org/abs/2305.04091)
- [LLMLingua（arXiv:2310.05736）](https://arxiv.org/abs/2310.05736)
- [LongLLMLingua（arXiv:2310.06839）](https://arxiv.org/abs/2310.06839)
- [Agentic RAG Survey（arXiv:2501.09136）](https://arxiv.org/abs/2501.09136)
- [DeepRAG（arXiv:2502.01142）](https://arxiv.org/abs/2502.01142)
- [Anthropic — Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [Azure AI Search — Hybrid search scoring (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)
- [LangGraph — Agentic RAG tutorial](https://langchain-ai.github.io/langgraph/tutorials/rag/langgraph_agentic_rag/)
