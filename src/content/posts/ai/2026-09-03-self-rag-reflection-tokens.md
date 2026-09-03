---
title: "Self-RAG：用 Reflection Token 讓模型自己決定要不要檢索"
date: 2026-09-03
type: deep-dive
category: ai
tags: [self-rag, adaptive-retrieval, reflection-tokens, rag, retrieval-augmented-generation]
lang: zh-TW
tldr: "Self-RAG 在 LLM 裡訓練四種 reflection token（Retrieve / IsREL / IsSUP / IsUSE），讓模型在生成過程中自主決定何時檢索、檢索結果是否相關、生成是否有據可查。ICLR 2024 Oral（top 1%），7B 模型在多個 QA benchmark 超越 ChatGPT 和 Llama2-chat + RAG。代價是必須 fine-tune，無法用在 API-only 模型。"
description: "Self-RAG 的 reflection token 機制、訓練流程、推理時行為控制、與 CRAG / FLARE / Adaptive-RAG / Agentic RAG 的定位差異，以及實務限制。"
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-03-self-rag-reflection-tokens-en)

RAG 系統有一個根本矛盾：標準 RAG 每次都檢索，浪費在不需要外部知識的 query 上；不檢索又會在需要事實根據時產生幻覺。Self-RAG（Asai et al., ICLR 2024 Oral, top 1%）的解法是把「要不要檢索」這個決定交給模型自己——不靠外部 controller，不靠 pipeline 規則，而是在模型詞彙表裡加入四種 reflection token，讓生成過程本身就包含自我批判。

## 在 Adaptive Retrieval 光譜中的位置

從「何時檢索」的角度看，RAG 技術構成一個光譜：

| 方法 | 觸發機制 | 決策者 | 需要 fine-tune |
|---|---|---|---|
| Standard RAG | 每次都檢索 | 無（固定行為） | 否 |
| [CRAG](/posts/ai/2026-03-12-corrective-rag-crag) | 檢索結果品質低時重試 | 外部 evaluator | 否 |
| FLARE | 生成中低信心 token 觸發 | token 機率 | 否 |
| **Self-RAG** | **模型自主產生 [Retrieve] token** | **模型自身** | **是** |
| [Adaptive-RAG](/posts/ai/2026-03-12-query-classification-adaptive-routing) | 外部 classifier 按查詢複雜度路由 | 外部 classifier | 是（classifier） |
| [Agentic RAG](/posts/ai/2026-03-12-agentic-rag-react-loop) | 完整 agent 迴圈 | LLM agent | 否 |

Self-RAG 的獨特之處在於把檢索決策和品質判斷**內化到模型本身**。CRAG 是 pipeline 層的後處理（檢索結果進 LLM 之前攔截），FLARE 靠 token 機率做啟發式判斷，Adaptive-RAG 用外部 classifier 路由——Self-RAG 不需要這些外掛，模型生成的 token 序列本身就包含了「要不要檢索」和「生成品質如何」的判斷。

## 四種 Reflection Token

Self-RAG 的核心是四種特殊 token，在訓練時加入模型詞彙表：

**1. [Retrieve]：要不要檢索？**

模型在生成每個片段前，先產出 `[Retrieve=Yes]` 或 `[Retrieve=No]`。簡單的常識問題（「Twitter、Instagram、WhatsApp 哪個不同？」）直接 `[Retrieve=No]` 跳過檢索；需要事實根據的問題才觸發檢索。依論文數據，Self-RAG 在 PubHealth 資料集上只有約 40% 的生成片段觸發檢索，其餘直接生成——對比 Standard RAG 100% 檢索。

**2. [IsREL]：檢索結果相關嗎？**

檢索到文件後，模型判斷 `[IsREL=Relevant]` 或 `[IsREL=Irrelevant]`。不相關的段落直接丟棄，不會污染後續生成。

**3. [IsSUP]：生成有被支持嗎？**

生成片段後，模型自我評估該片段是否被檢索到的文件支持：`[IsSUP=Fully Supported]`、`[Partially Supported]` 或 `[No Support]`。

**4. [IsUSE]：整體有用嗎？**

最後評估整體回應品質，給出 1-5 分的效用評分。

這四種 token 不是 prompt engineering——它們是模型詞彙表的一部分，訓練時學會在正確的位置產生正確的判斷。依 IBM 的 Self-RAG 教學（IBM Think, 2026），推理時模型自然地在生成過程中穿插這些 token，不需要額外的 orchestration 邏輯。

## 訓練流程

Self-RAG 的訓練分兩階段，涉及三個角色：

**Critic 訓練**：用 GPT-4 為 150K 筆 instruction-output 資料標註 reflection token（每種 token 各收集訓練資料），在此基礎上 fine-tune 一個 Critic 模型，學會判斷何時該檢索、檢索結果是否相關、生成是否有據。

**Generator 訓練**：Critic 標註完整的訓練資料（原始文字 + 檢索段落 + reflection token），然後用標準的 next-token prediction 訓練 Generator。Generator 學會在生成自然語言的同時，在正確位置產出 reflection token。

整個流程用 Llama2-7B 和 13B 作為基礎模型。訓練資料 150K 筆。Critic 對每種 reflection token 的預測準確率：`[Retrieve]` 93.8%、`[IsSUP]` 93.5%、`[IsREL]` 80.2%、`[IsUSE]` 73.5%。

## 推理時的行為控制

Self-RAG 最有趣的特性之一是**推理時不需要重新訓練就能調整行為**。透過調整 reflection token 的權重，可以在不同目標之間取捨：

- **提高引用精確度**：加大 `[IsSUP]` 的權重，模型更嚴格地檢查證據支持
- **提高流暢度**：降低 `[IsSUP]` 權重，讓模型更自由地生成
- **調整檢索頻率**：設定 `[Retrieve]` 的閾值，在效率和準確度之間取捨

依論文 Figure 3(c)，在 PopQA 資料集上，檢索頻率從 0.1 到 1.0 的範圍內，模型準確度隨檢索頻率增加而提高，但到 0.4 之後增益趨緩。這讓部署者可以根據延遲和品質需求找到最佳平衡點。

## Benchmark 表現

Self-RAG 在六個任務上的實測結果（依 ICLR 2024 論文數據）：

| 任務 | 指標 | Self-RAG 13B | ChatGPT | Llama2-chat 13B |
|---|---|---|---|---|
| PopQA（開放域 QA） | accuracy | 55.8% | 29.3% | 14.7% |
| TriviaQA | accuracy | 69.3% | — | 47.0% |
| PubHealth（事實驗證） | accuracy | 74.5% | 72.0% | 49.5% |
| ARC-Challenge（推理） | accuracy | 73.1% | — | 29.4% |
| ASQA（長文生成） | citation precision | 70.3% | — | — |
| Biography | factuality | 80.0% | 71.0% | — |

幾個值得注意的數據點：

- Self-RAG 7B 在四個任務上**超越 ChatGPT**，用的參數量遠小於 GPT-3.5
- 只有 2% 的正確預測來自非檢索段落（對比 Alpaca/Llama2 baseline 的 15-20%）——模型學會了在需要時才依賴檢索
- 從 50K 增加到 150K 訓練資料，PopQA 準確度從 45.5% 提升到 55.8%，論文指出進一步增加資料可能帶來更多提升

## 與 CRAG 的互補

CRAG 和 Self-RAG 解決的問題不同，可以疊加使用。依 EduinX 的分析（2026），CRAG 論文中實測的 Self-CRAG（結合兩者）在 PopQA 上比單獨 Self-RAG 準確度高 20%，在 biography 任務上高 36.9%。

差異在哪：
- **CRAG**：改善**進入模型的證據品質**（pre-generation middleware）
- **Self-RAG**：改善**模型如何推理證據**（during-generation self-reflection）

對多數團隊的建議路徑：先上 CRAG（不需 fine-tune、無訓練成本），有需要再加 Self-RAG。

## 實務限制

**必須 fine-tune**：這是最大的門檻。Self-RAG 的 reflection token 需要訓練進模型，無法透過 prompt 模擬。這意味著它**不適用於 API-only 模型**（Claude、GPT-4、Gemini）——你無法在這些模型裡加入自訂的特殊 token。

**訓練成本**：需要先用 GPT-4 產生 Critic 訓練資料（150K 筆），再分別訓練 Critic 和 Generator。對中小團隊來說門檻不低。

**推理開銷**：reflection token 增加了生成長度。每個片段多出 4 個判斷 token，加上 segment-wise beam search（論文用的解碼策略），推理速度比標準生成慢。

**模型綁定**：目前公開的實作基於 Llama2-7B 和 13B。換基礎模型需要重新走完整個訓練流程。

**LangGraph 的替代路徑**：依 LangChain 團隊的文件（2024），可以用 LangGraph 實作類似 Self-RAG 的 flow engineering——用 graph 節點模擬檢索決策和品質判斷——但這本質上是用 pipeline 編排取代了模型內建的能力，效果不同。

## 後續發展

Self-RAG 發表後催生了幾條延伸路線：

**Self-BioRAG**（arXiv:2401.15269, 2024）：把 Self-RAG 的框架特化到生醫領域。用 domain-specific 的 Critic 和生醫文獻語料訓練，在 biomedical QA 任務上進一步提升。

**Adaptive-RAG**（Jeong et al., NAACL 2024）：用外部 classifier 取代 Self-RAG 的內建 reflection token，根據查詢複雜度路由到 no-retrieval / single-retrieval / multi-hop。更 modular、不需 fine-tune 基礎模型，但也失去了 Self-RAG「模型自身知道自己需不需要檢索」的特性。

**PFE-SELF-RAG**（Pareto Front Efficient Self-RAG）：針對 Self-RAG 多個評估指標（IsREL、IsSUP、IsUSE）之間的權衡做 Pareto 最佳化，避免手動調整權重。

## 整體來說

Self-RAG 的核心洞察是：與其用外部系統管理「何時檢索」和「生成品質如何」，不如讓模型自己學會這些判斷。這很優雅，但也是它最大的限制——需要 fine-tune 意味著它無法應用在大多數團隊依賴的 API 模型上。

依 Atlan（2026）的整理，Self-RAG 適合的場景是：**factuality-critical 的應用，你有能力和資源做 fine-tune，而且需要模型自己控制檢索頻率**。不符合這些條件的團隊，CRAG（pipeline 層）或 Adaptive-RAG（classifier 路由）是更實用的選擇。

這也反映了 adaptive retrieval 整個領域的趨勢：從「每次都檢索」到「智慧地決定何時檢索」，有多條技術路線在競爭——Self-RAG 是其中最 model-centric 的一條。

## 參考資料

- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection (arXiv:2310.11511, ICLR 2024 Oral)](https://arxiv.org/abs/2310.11511)
- [Self-RAG 官方網站](https://selfrag.github.io)
- [Self-RAG GitHub（Akari Asai et al.）](https://github.com/akariasai/self-rag)
- [Self-RAG 7B 模型（Hugging Face）](https://huggingface.co/selfrag/selfrag_llama2_7b)
- [IBM Think: Self-RAG Tutorial（2026）](https://www.ibm.com/think/tutorials/build-self-rag-agent-langgraph-granite)
- [Self-BioRAG (arXiv:2401.15269)](https://arxiv.org/abs/2401.15269)
- [Adaptive-RAG: Learning to Adapt Retrieval-Augmented LLMs through Question Complexity (arXiv:2403.14403, NAACL 2024)](https://arxiv.org/abs/2403.14403)
- [FLARE: Active Retrieval Augmented Generation (arXiv:2305.06983, EMNLP 2023)](https://arxiv.org/abs/2305.06983)
- [LangChain: Self-Reflective RAG with LangGraph](https://www.langchain.com/blog/agentic-rag-with-langgraph)
- [Atlan: 12 Advanced RAG Techniques（2026）](https://atlan.com/know/advanced-rag-techniques)
- [CRAG：檢索失敗時，自動放寬條件重試](/posts/ai/2026-03-12-corrective-rag-crag)
- [Agentic RAG：讓 LLM 自己決定要不要再搜尋一次](/posts/ai/2026-03-12-agentic-rag-react-loop)
