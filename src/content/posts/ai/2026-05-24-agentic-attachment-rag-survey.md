---
title: "上傳檔案就自動 embedding 是個壞預設：Adaptive / Agentic RAG 與 Agentic Parsing 論文導讀"
date: 2026-05-24
category: ai
type: deep-dive
tags: [rag, agentic-rag, adaptive-rag, tool-use, llm-agent, agentic-parsing, document-parsing]
lang: zh-TW
tldr: "把『使用者上傳檔案就自動切 chunk、embedding』設為預設行為，等於替 LLM 預先做了一個它本來可以自己做的決定。從 Self-RAG (2310.11511)、Adaptive-RAG (2403.14403) 到 AgenticOCR (2602.24134) 這條學術線索，正在把『要不要 retrieve、要不要 parse、怎麼切 chunk』三層決策權，從 ingestion pipeline 往後推到對話時的 agent。"
description: "從 30 篇論文整理 Adaptive RAG、Self-RAG、Agentic RAG、Agentic Parsing 的關係，討論為什麼『上傳即 embedding』是錯的預設、以及把 retrieval 與 parser 都包成 function tool 給 LLM 調用的設計依據。"
draft: false
---

使用者上傳一份檔案到聊天介面，系統該做什麼？

多數 RAG 產品的答案是：立刻切 chunk、embedding、寫向量庫。等對話進行到使用者問問題時，retrieval 也跟著自動觸發。這條 pipeline 從上傳那一刻起就被固定下來。

但這個預設替 LLM 做了一個它本來可以自己做的決定 —— 「這個檔案要不要 embedding？要不要 RAG？還是直接讀全文就好？」一份 200 字的 markdown 跟一份 300 頁的掃描 PDF，需要的處理方式不一樣；同一份檔案，使用者問「幫我總結」跟問「第 47 頁的表格數字是多少」也不一樣。把這些決策固定在 ingestion 時做，就等於沒做。

這篇整理三條學術線索 —— **Adaptive RAG**（要不要 retrieve）、**Agentic RAG**（把 retrieval 變成 tool）、**Agentic Parsing**（連 parser 也讓 agent 挑） —— 說明為什麼另一個合理的預設是：**檔案上傳時什麼都不做，把 read / ingest / parse 全部包成 function tool 給 LLM，由它在對話當下決定**。

## Adaptive RAG：retrieval 是 LLM 的選項，不是預設動作

Adaptive RAG 的核心命題：不是每個 query 都該 retrieve。簡單的事實題、模型已知的常識、純算術，retrieve 反而會引入雜訊。

Jeong et al. 在 NAACL 2024 提出的 **Adaptive-RAG**（arxiv 2403.14403）訓練一個 classifier，把 query 路由到三種策略：

- `no-retrieval`：模型直接回答
- `single-step retrieval`：一次 retrieve
- `multi-step retrieval`：多輪 retrieve + 推理

依該論文的數據，這個分流相對 always-retrieve 在 multi-hop QA 上能維持 accuracy 並顯著降低 latency 與成本。

更前一年的 **Self-RAG**（Asai et al., ICLR 2024, arxiv 2310.11511）則把這個決策內化進模型本身，用 `[Retrieve]` / `[IsRel]` / `[IsSup]` / `[IsUse]` 四種 reflection tokens 讓 LLM 在生成過程中自行決定「要不要 retrieve」「retrieve 結果有沒有用」。

兩篇的共同訊息：**retrieve 是一個值得做決策的動作，不是免費的預設**。Self-RAG 的解法是內化進模型，Adaptive-RAG 是外掛 classifier，而 2026 年更自然的做法是 —— 用 function calling 讓 LLM 自己決定要不要呼叫 retrieval tool。

## Agentic RAG：把 retrieval 包成 tool

Singh et al. 在 2025 年的 survey **Agentic Retrieval-Augmented Generation**（arxiv 2501.09136）把 RAG 的演進切成三段：

| 世代 | 特徵 |
|---|---|
| **Naive RAG** | 固定 pipeline：query → retrieve → generate |
| **Modular RAG** | 加上 rewrite / rerank / filter 等可替換模組 |
| **Agentic RAG** | retrieval 變成 agent 的 tool；多輪推理、自我修正、planner / reflector pattern |

依該 survey 的歸納，agentic RAG 有三個核心元件：**Planner**（決定下一步做什麼）、**Tool Invocation**（包含 retrieval、parsing、web search 等）、**Control Policy**（什麼時候停、怎麼處理錯誤）。

對應到實作，function calling 已成為主流介面。Bhatt et al. 的 reasoning agentic RAG survey（arxiv 2506.10408）指出：

> For Agentic RAG, function calling provides a straightforward and structured way for the LLM agent to invoke a search API when its internal knowledge is insufficient.

這條線最值得注意的是失敗模式。Kim et al. 2025 年的論文 **Mitigating Sub-optimal Agentic Searches By Reducing Uncertainty**（arxiv 2505.17281）發現：agent 在不確定時會「亂搜」—— 一次 retrieve 拿到空結果後繼續硬呼叫 retrieval tool，導致 latency 翻倍而 accuracy 不變。解法是讓 agent 在 retrieve 前評估「這次 retrieve 有沒有意義」。

這個觀察直接呼應一個工程現實：tool description 寫得不夠強，LLM 就會亂選 tool。

## Agentic Parsing：parser 也讓 agent 挑（2025–2026 新興）

如果 retrieve 不該是預設動作，那 parse 呢？傳統 pipeline 是上傳時就跑 OCR / layout 偵測 / table extraction，產生 chunks 後 embed 進向量庫。但這個 pre-processing 的選擇是固定的 —— 無論使用者之後問什麼，parser 已經決定好了。

Lu et al. 2026 年的 **AgenticOCR: Parsing Only What You Need for Efficient Retrieval**（arxiv 2602.24134）直接挑戰這個預設：

> AgenticOCR transforms OCR from a static pre-processing step into a query-driven, agentic process.

口號是 "parse only what you need"。Agent 拿到 query 之後才決定要 OCR 哪幾頁、要不要做 table 抽取、要不要呼叫 vision-LLM。對掃描 PDF 這類 OCR 成本不便宜的場景，依該論文的實驗，能在維持下游 QA accuracy 的前提下大幅降低 token / 計算成本。

更早一點的 **AgenticIE**（arxiv 2509.11773）把同樣思路套到 information extraction：把 OCR、PDF parser、layout 偵測都包成 tool，由 agent 根據「使用者意圖（key-value pair vs QA）+ 文件 modality（掃描 vs 數位）」動態選 parser。**ARIAL**（arxiv 2511.18192）則展示了 document VQA 場景，把 query 拆解成 OCR / retrieval / grounding 三類 tool call。

要評估這條線是否真的優於傳統 pipeline，**ParseBench**（arxiv 2604.08538）給了量化答案：在 document parsing benchmark 上，LlamaParse 的 agentic 版本以 80.62% 領先傳統 Azure pipeline 的 73.8%。Doc-Researcher（arxiv 2510.21603）則整理了不同 parsing strategy 的 cost / quality tradeoff 表。

## 三層觀念的串接

把這三條線疊起來，會看到一個一致的方向：

```
Adaptive RAG       →  要不要 retrieve
       ↓
AgenticOCR         →  要不要 parse、parse 哪一段
       ↓
Adaptive Chunking  →  怎麼切 chunk
（arxiv 2603.25333）
```

三層決策的共同模式：**從「ingestion 時系統決定」往後推到「對話時 agent 決定」**。把以下函式都包成 function tool：

```python
# 給 LLM 的 tool 集合
tools = [
    read_attachment_full_text,   # 小檔 / plain text 走 long-context
    ingest_attachment,           # 大檔 / binary → 觸發 RAG indexing
    parse_with_ocr,              # 掃描 PDF
    parse_with_layout,           # 結構化 PDF
    parse_table,                 # Excel / table-heavy
    query_files,                 # 已 indexed 後的 retrieval
    retrieve_text_nodes,
]
```

`ingest_attachment` 後系統觸發背景 indexing，完成後重新 invoke agent —— 這個 control flow 對應 Agentic RAG survey 的 Tool Invocation + Control Policy。

## Long-context vs RAG：什麼時候不該 RAG

「預設不做 embedding」需要回答的第一個質疑：那大檔怎麼辦？這個問題的學術依據是 Li et al. 在 EMNLP 2024 的 **Self-Route**（arxiv 2407.16833）。論文比較了 long-context (LC) 與 RAG 在多個 QA benchmark 上的表現，主要結論：

> LC generally outperforms RAG on long-context tasks, while RAG is significantly cheaper. Self-Route, which lets the LLM decide between LC and RAG, achieves comparable performance to LC at significantly reduced cost.

Self-Route 的設計就是讓 LLM 自己判斷 query 該走 LC 還是 RAG。這正是「上傳時什麼都不做、讓 agent 在對話時決定」的學術版本。

反方意見也要列：NVIDIA 的 **OP-RAG**（arxiv 2409.01666）指出即使 context 變長到能塞下整份文件，保留 chunk 原始順序的 RAG 仍能 outperform 直接塞 long-context。Google 的另一篇 **Long-Context LLMs Meet RAG**（arxiv 2410.05983）則發現 retrieved 的 hard negatives 反而會傷害 long-context LLM 的表現 —— 這從另一個角度說明「不該預設 retrieve」。

## 工程現實：tool description 是 contract，不是 README

把 retrieval 與 parser 都包成 tool 之後，會踩到一個新的工程問題：LLM 怎麼知道該選哪個 tool？

Chen et al. 2026 年的 **Learning to Rewrite Tool Descriptions**（arxiv 2602.20426）用實驗驗證了一件直覺：tool description 的措辭，可以量化地影響 LLM 的 tool selection accuracy。同團隊的 **Learning to Ask**（arxiv 2409.00557）則歸納了四種「instruction issue」造成 tool 使用失敗，最常見的是「條件式建議被當成可選項」。

實務上的差別：

```python
# 舊：條件式建議 — LLM 會自己判斷
"if the file is larger or in a binary format, call ingest_attachment instead"

# 新：明確規則 — 沒有條件判斷餘地
"ONLY supports: txt, md, csv, tsv, json, yaml, yml, log. "
"PDF, doc, docx, pptx, xlsx, html, images, and all other binary or non-plain-text formats "
"are REJECTED by this tool; call ingest_attachment for those."
```

另一個模式是「description 預警 + return value 強化」—— 同一個指令在 tool description 與 tool 回傳值各說一次，依 **Many-Tier Instruction Hierarchy**（arxiv 2604.09443）的觀察，重複指令能降低 LLM 偏離率。

## 整體來說

從 Self-RAG (2023) 到 AgenticOCR (2026)，這條學術線索的核心訊息一致：**ingestion 不該預先做出本來該交給 agent 的決策**。Retrieval、parsing、chunking 三層都適用這個原則。

對 production 系統的取捨：

- **適合**：附件種類多（plain text / PDF / Excel / 圖片掃描混用）、使用者意圖差異大（摘要 vs 精確抽取 vs Q&A）、想省 ingestion 成本的場景
- **不適合**：附件高度同質（例如純客服 FAQ）、retrieval pattern 固定（永遠都要全文檢索）、latency 對「第一次互動」極敏感的場景
- **共通注意**：tool description 寫法直接影響成敗，必須當 contract 寫；agent 多輪 retry 要設停損條件，避免 sub-optimal search 失敗模式

最少必讀清單：Self-RAG (2310.11511)、Adaptive-RAG (2403.14403)、Self-Route (2407.16833)、Agentic RAG Survey (2501.09136)，加上 parser 線的 AgenticOCR (2602.24134)。八篇之內把這個 design space 走完。

## 參考資料

### Adaptive RAG / Self-RAG

- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection (Asai et al., 2023)](https://arxiv.org/abs/2310.11511)
- [Adaptive-RAG: Learning to Adapt Retrieval-Augmented LLMs through Question Complexity (Jeong et al., 2024)](https://arxiv.org/abs/2403.14403)
- [RetrievalQA: Assessing Adaptive Retrieval-Augmented Generation (ACL 2024 Findings)](https://arxiv.org/abs/2402.16457)
- [Lightweight Query Routing for Adaptive RAG (2026)](https://arxiv.org/abs/2604.03455)
- [R³AG: Retriever Routing for Retrieval-Augmented Generation (2026)](https://arxiv.org/abs/2604.22849)

### Agentic RAG

- [Agentic Retrieval-Augmented Generation: A Survey (Singh et al., 2025)](https://arxiv.org/abs/2501.09136)
- [A Survey on Reasoning Agentic RAG (Bhatt et al., 2025)](https://arxiv.org/abs/2506.10408)
- [SoK: Agentic Retrieval-Augmented Generation (2026)](https://arxiv.org/abs/2603.07379)
- [Mitigating Sub-optimal Agentic Searches By Reducing Uncertainty (2025)](https://arxiv.org/abs/2505.17281)
- [Benchmarking Agentic Information Seeking for RAG (2025)](https://arxiv.org/abs/2505.15872)

### Corrective RAG

- [CRAG: Corrective Retrieval Augmented Generation (Yan et al., 2024)](https://arxiv.org/abs/2401.15884)
- [ChunkRAG: LLM-Chunk Filtering Method (2024)](https://arxiv.org/abs/2410.19572)

### Long-context vs RAG

- [Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach (Li et al., EMNLP 2024)](https://arxiv.org/abs/2407.16833)
- [Long Context vs. RAG for LLMs: An Evaluation and Revisits (2024)](https://arxiv.org/abs/2501.01880)
- [In Defense of RAG in the Era of Long-Context LLMs / OP-RAG (NVIDIA, 2024)](https://arxiv.org/abs/2409.01666)
- [Long-Context LLMs Meet RAG: Overcoming Challenges for Long Inputs in RAG (Google, 2024)](https://arxiv.org/abs/2410.05983)

### Agentic Parsing

- [AgenticOCR: Parsing Only What You Need for Efficient Retrieval (2026)](https://arxiv.org/abs/2602.24134)
- [AgenticIE: An Adaptive Agent for Information Extraction from Documents (2025)](https://arxiv.org/abs/2509.11773)
- [ARIAL: An Agentic Framework for Document VQA with Precise Grounding (2025)](https://arxiv.org/abs/2511.18192)
- [DocLens: A Tool-Augmented Multi-Agent Framework for Long Document Understanding (2025)](https://arxiv.org/abs/2511.11552)
- [Doc-Researcher: A Unified System for Multimodal Document Understanding (2025)](https://arxiv.org/abs/2510.21603)
- [ParseBench: A Document Parsing Benchmark for AI Agents (2026)](https://arxiv.org/abs/2604.08538)
- [Document Parsing Unveiled: Techniques, Challenges, and Prospects (2024 survey)](https://arxiv.org/abs/2410.21169)
- [Optimizing Chunking-Method Selection for RAG / Adaptive Chunking (2026)](https://arxiv.org/abs/2603.25333)
- [Hybrid OCR-LLM Framework for Enterprise-Scale Document Processing (2025)](https://arxiv.org/abs/2510.10138)

### Tool Description / Tool Selection

- [Learning to Rewrite Tool Descriptions for Reliable LLM-Agent Tool Use (2026)](https://arxiv.org/abs/2602.20426)
- [Learning to Ask: When LLM Agents Meet Unclear Instruction (2024)](https://arxiv.org/abs/2409.00557)
- [Many-Tier Instruction Hierarchy in LLM Agents (2026)](https://arxiv.org/abs/2604.09443)
