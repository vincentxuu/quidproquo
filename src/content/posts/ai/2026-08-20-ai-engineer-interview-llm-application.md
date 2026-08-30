---
title: "LLM Application Design 面試攻略：從 RAG 到 Agent 架構"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, llm, rag, agent]
lang: zh-TW
type: deep-dive
description: "拆解 AI Engineer 面試中 LLM 應用設計環節——RAG pipeline、agent 架構、context engineering、guardrails、evaluation。"
tldr: "LLM Application Design 是 2025-2026 面試最熱的新題型。核心考點：RAG pipeline 的 chunking/retrieval/reranking 設計、agent 架構的 tool-use 與 planning loop、context window 管理策略、guardrails 與 safety 設計、以及 LLM 應用的評估方法。面試官特別看重你有沒有踩過坑。"
series:
  name: "AI Engineer 面試準備"
  order: 6
---

## 為什麼這是新題型

兩年前 ML system design 面試考的是推薦系統和詐欺偵測。2025 年之後，越來越多公司加入一輪專門考 LLM 應用設計——不是考你怎麼訓練模型，而是考你怎麼用 LLM API 組裝一個能上線的系統。AI-native 公司（Anthropic、OpenAI、Cohere）幾乎必考，大廠的 AI team 也開始出這類題目。

這輪面試的特點是沒有標準答案。面試官想聽的是你做過什麼、踩過什麼坑、怎麼在 latency/cost/quality 三者之間取捨。如果你只能講理論（「RAG 就是先 retrieve 再 generate」）但說不出具體的工程決策（「我用 512 token 的 chunk 搭配 100 token 的 overlap，因為我們的文件是技術文檔，段落之間有強依賴」），這一輪會很難過。

## RAG Pipeline 設計

RAG 是面試最高頻的 LLM 應用主題。面試官通常會問「設計一個能回答公司內部文件問題的系統」，然後一層層追問細節。

### Chunking

面試時要能說出三種主流策略的取捨：

- **固定長度切分**（如 512 tokens）：最簡單，適合結構均勻的文件。問題是會切斷語意完整的段落。
- **語意切分**（按段落、章節、或用 embedding 相似度找斷點）：保留語意完整性，但 chunk 大小不均勻，可能影響 retrieval 品質。
- **遞迴切分**（先按大結構切，再對過長的 chunk 做二次切分）：實務中最常用的折衷方案。

面試加分的回答：提到 overlap 的設計（通常 10-20% 的重疊）、metadata 保留（每個 chunk 帶上來源文件名、頁碼、章節標題），以及為什麼 chunk size 需要和 embedding model 的訓練長度匹配。

### Embedding 選型

面試官可能會問你怎麼選 embedding model。核心考量：

- **維度與成本**：高維度的 embedding（如 1536d）檢索品質通常較好，但儲存和計算成本更高。
- **多語言能力**：如果資料包含中文，需要選支援多語言的模型。
- **領域適配**：通用 embedding 在特定領域（法律、醫療）的效果可能不好，需要考慮是否 fine-tune。

### Retrieval + Reranking

兩階段檢索是面試常考的架構：先用向量搜尋（ANN）從幾十萬筆文件中快速召回 top-k（如 50 筆），再用 cross-encoder reranker 精排出最終的 top-n（如 5 筆）。面試時解釋清楚為什麼需要兩階段——向量搜尋快但粗糙（只看 embedding 相似度），cross-encoder 慢但精準（能看 query 和 document 的交互關係）。

進階話題：hybrid search（同時用向量搜尋和 BM25 關鍵字搜尋，用 reciprocal rank fusion 合併結果）。面試官很喜歡聽你解釋什麼情況下純語意搜尋會失敗（例如搜尋特定的錯誤碼或產品型號）。

## Agent 架構

Agent 題型通常是「設計一個能自動完成 X 任務的系統」，例如自動寫測試、自動做客服、或自動做資料分析。

### Tool-use

Agent 的核心是讓 LLM 決定什麼時候呼叫什麼工具。面試時要能講清楚：

- **工具定義**：怎麼設計工具的 schema（名稱、描述、參數），讓 LLM 能正確理解何時該用。描述寫得不好，LLM 就會亂呼叫。
- **工具數量的取捨**：工具越多，LLM 選錯的機率越高。實務上超過 15-20 個工具就需要做工具路由（先判斷類別，再從子集中選工具）。
- **錯誤處理**：工具呼叫失敗時的 retry 策略和 fallback 機制。

### Planning Loop

面試官會追問 agent 怎麼規劃多步驟任務。兩種主流模式：

- **ReAct**（Reasoning + Acting）：LLM 交替進行推理和行動，每一步看到前一步的結果再決定下一步。簡單可靠，但 token 消耗高。
- **Plan-then-execute**：先讓 LLM 產生完整計畫，再依序執行。效率高但計畫可能在執行中失效，需要 replan 機制。

### Memory Management

長時間運行的 agent 需要記憶管理。面試時能講出 working memory（當前對話 context）和 long-term memory（向量化的歷史互動）的區別，以及 context window 快滿時的壓縮策略（summary、sliding window、重要度排序後丟棄），就算到位了。

## Context Engineering

Context engineering 是 2025-2026 新出現的概念，指的是怎麼精心組裝送進 LLM 的 context。面試會考這個因為它直接影響應用品質。

重點包括：

- **Prompt 結構**：system prompt 放指令和角色定義，user prompt 放具體請求，assistant prefill 引導格式。三者的分工要清楚。
- **Context window 預算管理**：總 token 數有限，要在 system prompt、few-shot examples、retrieved documents、conversation history 之間分配。面試時能說出一個具體的分配方案（如「system prompt 占 10%，retrieved docs 占 50%，history 占 30%，留 10% 給 output」）會很加分。
- **Lost in the middle 問題**：LLM 對 context 中間部分的注意力較弱。重要資訊放在開頭和結尾，或用明確的 XML/Markdown 標記結構化。

## Guardrails & Safety

面試官越來越常問安全相關的設計，尤其是 AI-native 公司。

- **Input validation**：偵測 prompt injection（使用者嘗試覆寫 system prompt）、PII 過濾（個資不該進入 LLM）。面試時提到分層防禦——先用規則過濾明顯的攻擊模式，再用一個輕量的分類器偵測更細緻的注入。
- **Output validation**：內容過濾（有害內容偵測）、格式驗證（確認 JSON/結構化輸出格式正確）、事實核查（用 retrieval 結果交叉比對 LLM 的回答）。
- **Hallucination mitigation**：降低幻覺的三個實務做法——限制模型只能根據提供的 context 回答（grounded generation）、要求模型標注引用來源、在 generation 後做 faithfulness check。

## Evaluation

LLM 應用的評估是面試常考的難題，因為沒有像傳統 ML 那樣清楚的 metric。

- **Offline evaluation**：用 golden dataset（人工標注的問答對）測試。衡量 retrieval 品質（recall@k、MRR）和 generation 品質（faithfulness、relevance、completeness）。LLM-as-judge（用另一個 LLM 打分）越來越常用，但要注意 position bias 和 self-preference bias。
- **Online evaluation**：A/B testing 看使用者行為（thumbs up/down、follow-up question rate、task completion rate）。面試時能區分「使用者覺得好」和「答案客觀正確」兩個不同的維度。
- **Continuous monitoring**：追蹤 retrieval 命中率、latency、token cost、使用者回報 hallucination 的比率。設定 alert 閾值，品質下降時自動告警。

## 常見題型與面試策略

面試時最常見的三種題型：

1. **「設計一個 RAG 系統」**：從 chunking 講到 serving，重點在你怎麼決定每一層的設計。
2. **「設計一個 customer support agent」**：考 tool-use 設計、conversation management、escalation 邏輯。
3. **「你們的 LLM 應用上線後品質下降，怎麼 debug？」**：考你的 evaluation 和 monitoring 思維。

面試策略：先花兩分鐘確認需求（使用者是誰、QPS 多少、latency 預算、錯誤的代價有多高），再從 data flow 畫起（資料怎麼進來 → 怎麼處理 → 怎麼送進 LLM → 怎麼驗證 output → 怎麼監控）。不要一開始就跳進「我要用什麼 model」——面試官想看的是你的系統思維，不是你對某個 API 的熟悉程度。

## 面試模擬題

### 題目

「設計一個 RAG-based customer support system，需要處理多語言、多產品線，並且能在回答不確定時自動 escalate 給人類客服。」

**來源**：Anthropic 面試（改編）　**難度**：進階　**環節**：onsite system design

### 拆解思路

1. **先釐清問題**：多語言是幾種？多產品線代表知識庫要隔離還是共享？QPS 多少？「不確定」的定義是什麼——confidence score 低、還是偵測到 hallucination？
2. **建立框架**：從 data flow 畫起——文件攝入 → chunking → embedding → retrieval → reranking → LLM generation → output validation → escalation trigger。
3. **深入核心**：核心 trade-off 是 **precision vs recall of escalation**——太容易 escalate 會淹沒人類客服，太少會讓錯誤答案送出去。這裡要設計一個 multi-signal confidence system。
4. **收尾**：提到 evaluation 怎麼做（golden set + LLM-as-judge + 人類客服的回饋 loop），以及 monitoring 看什麼（escalation rate、resolution rate、CSAT）。

### 範例回答（面試時可以這樣講）

> **架構概述。** 我會設計一個三層 pipeline。第一層是 retrieval：每個產品線有獨立的向量索引（避免跨產品污染），用 hybrid search（BM25 + dense embedding）做初檢，reranker 做精排。多語言的處理放在 query 端——用多語言 embedding model（如 BGE-M3），讓使用者用任何語言查詢都能命中英文或中文的原始文件，不做翻譯。
>
> **生成與驗證。** 第二層是 LLM generation，system prompt 包含產品線上下文和回答規範（例如不能編造退款政策）。第三層是 output validation——我會用三個訊號來決定要不要 escalate：retrieval confidence（top-k 的相似度分數低於閾值）、LLM 自我評估（prompt 要求模型標注 confidence level）、以及 guardrail 檢查（有沒有偏離 retrieved context 的 hallucination）。三個訊號用加權投票，任兩個 flag 就 escalate。
>
> **Escalation 與監控。** Escalation 不是簡單的「轉人工」——要把 retrieval context、LLM 的生成過程、和 confidence 訊號一起傳給人類客服，讓他們不用從零開始。監控重點是 escalation rate（目標 < 15%）和 false negative rate（送出去但被使用者標記錯誤的比例）。上線後用 A/B test 調整 confidence 閾值。

### 自我核對清單

| 核對項目 | 有提到？ |
|---------|---------|
| 產品線知識庫隔離策略 | |
| 多語言的處理方式（query 端 vs 文件端） | |
| Retrieval + reranking 的雙層設計 | |
| Escalation 的多訊號判斷機制 | |
| Escalation 時傳遞 context 給人類客服 | |
| Monitoring 指標（escalation rate、false negative rate） | |
| 加分：A/B test 調整 confidence 閾值 | |

## 參考資料

- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/agent-guidelines) — Agent 架構的 tool-use 設計、planning loop 與 error handling 的官方建議
- [LangChain — RAG from Scratch](https://github.com/langchain-ai/rag-from-scratch) — RAG pipeline 從 chunking 到 reranking 的實作教程，涵蓋 hybrid search 與 context engineering
- [Chip Huyen — Building A Generative AI Platform](https://huyenchip.com/2024/07/25/genai-platform.html) — LLM 應用的系統設計全景，涵蓋 evaluation、guardrails 與生產環境監控
- [Anthropic — Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering) — LLM 應用設計面試中 context engineering 與 prompt structure 的官方最佳實踐
- [RAGAS — RAG Assessment Framework](https://docs.ragas.io/) — RAG pipeline evaluation 的開源框架，涵蓋 LLM application 面試中常問的 faithfulness 與 relevancy 指標
