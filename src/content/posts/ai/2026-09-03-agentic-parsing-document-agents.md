---
title: "Agentic Parsing：讓 Agent 決定怎麼解析文件"
date: 2026-09-03
category: ai
type: deep-dive
tags: [agentic-parsing, document-parsing, ocr, rag, multi-agent, vision-language-model]
lang: zh-TW
tldr: "傳統文件解析用固定 pipeline 一體適用，但合約、財報、技術手冊各需不同策略。Agentic Parsing 讓 LLM agent 觀察文件後動態選工具——AgenticOCR 只解析需要的區域（視覺 token 省 70%+）、ParseBench 2,000 頁企業文件實測最佳方案也只拿 84.9%，沒有銀彈。"
description: "整理 Agentic Parsing 的設計思路：從固定 pipeline 到 agent 動態調度，涵蓋 AgenticOCR、ParseBench、DocLens、MADP 等關鍵論文，以及與 ColPali Visual RAG 的互補關係。"
series:
  name: "文件解析實戰"
  order: 7
draft: false
---

> 🌏 [English version](/en/posts/ai/2026-09-03-agentic-parsing-document-agents-en)

文件解析的前幾篇聊了[三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)、[文字抽取](/posts/ai/2026-08-06-pdf-text-extraction-libraries)、[模型推斷結構](/posts/ai/2026-08-06-document-parsing-layout-ocr)。結論都指向同一件事：沒有一條固定 pipeline 能通吃所有文件。這篇要介紹的 Agentic Parsing，就是把「選哪條路」的決策交給 agent。

## 固定 Pipeline 的瓶頸

傳統文件解析是一條串列管線：OCR → 版面分析 → 文字抽取 → chunking → embedding。每一步用固定的工具和參數，不管輸入是什麼。

問題在三個地方：

**一、文件類型差異太大。** 合約是密排雙欄文字、財報是大量數字表格、技術手冊有混合圖文和巢狀清單。同一個 layout model 對合約做得好，碰到 25 欄的規格比較表就爛掉——依 [ParseBench](https://arxiv.org/abs/2604.08538)（LlamaIndex，2026）在 2,078 頁企業文件上的評測，14 種方法裡沒有任何一種在五個維度（表格、圖表、內容忠實度、語意格式、視覺定位）上全面領先。

**二、全頁解析是浪費。** 使用者問「B1 方案的代償條件」，但 pipeline 把整份 80 頁 PDF 全部 OCR 一遍。依 [AgenticOCR](https://arxiv.org/abs/2602.24134)（2026）的觀察，全頁解析不只浪費算力，還會把大量無關內容塞進 generator 的 context，稀釋關鍵證據、增加幻覺風險。

**三、錯誤無法自我修正。** 固定管線是 one-shot 的——第一步 OCR 認錯了，後面所有步驟都在壞掉的基礎上繼續跑。沒有 feedback loop。

## Agentic Parsing 的核心思路

讓 LLM agent 在解析過程中扮演調度者。agent 先觀察文件，判斷類型和結構，再動態選擇工具和策略。

概念上有三種層次：

### 選擇性解析：只解析需要的部分

AgenticOCR（[arXiv:2602.24134](https://arxiv.org/abs/2602.24134)，2026）的做法：先看低解析度的縮圖，識別「感興趣區域」（Regions of Interest），只對這些區域做高解析度 OCR。用 GRPO 強化學習訓練 agent 學會「看哪裡」。

這把 OCR 從被動的前處理變成主動的感知——「parsing only what you need」。在 MMLongBench-Doc 上達到 expert-level 效能，同時大幅減少視覺 token 預算。

### 多 Agent 協作：拆解複雜文件

長文件靠單一 agent 不夠。幾個有代表性的框架：

**DocLens**（[arXiv:2511.11552](https://arxiv.org/abs/2511.11552)，Google，2025）用兩個 agent 組成「透鏡模組」：Page Navigator 從整份文件定位到相關頁面，Element Localizer 在頁面內定位到具體的表格或圖片。搭配 Gemini-2.5-Pro，在 MMLongBench-Doc 和 FinRAGBench-V 上超越人類專家——特別是在視覺導向和「無法回答」的查詢上。

**MADP**（[arXiv:2605.17159](https://arxiv.org/abs/2605.17159)，2026）用多 agent pipeline 做可持續的文件處理，把分類、解析、驗證拆給不同 agent。

**Doc-Researcher**（[arXiv:2510.21603](https://arxiv.org/abs/2510.21603)，2025）和 **ARIAL**（[arXiv:2511.18192](https://arxiv.org/abs/2511.18192)，2025）分別從多模態和精確定位的角度切入：前者整合多種解析工具的輸出，後者專注文件 VQA 的 grounding 問題。

### 自適應資訊抽取：根據文件調整策略

**AgenticIE**（[arXiv:2509.11773](https://arxiv.org/abs/2509.11773)，2025）處理的是法規文件的資訊抽取。這類文件結構複雜（巢狀條款、交叉引用、附錄），固定的 NER / RE pipeline 很難涵蓋。AgenticIE 讓 agent 根據文件的實際結構決定抽取策略。

## Benchmark：目前做到多好？

ParseBench（[arXiv:2604.08538](https://arxiv.org/abs/2604.08538)，LlamaIndex，2026）是第一個專為 AI agent 設計的文件解析 benchmark。2,078 頁人工驗證的企業文件，涵蓋保險、金融、政府三個領域。

14 種方法的評測結果：

| 方法 | 整體分數 | 特點 |
|---|---|---|
| LlamaParse Agentic | **84.9%** | 最高，但非所有維度最強 |
| 其他 13 種 | 各有擅長 | 沒有全面領先者 |

五個維度（表格、圖表、內容忠實度、語意格式、視覺定位）呈現「破碎的能力分布」——每個方法都有強項和弱項。這說明 agentic 的路線本身是對的：與其找一個全能工具，不如讓 agent 根據文件特性選工具。

## 商業落地

2026 年已經有幾個可用的 agentic 解析產品：

**LlamaParse** 把解析模式分成四級：Fast（1 credit/頁）、Cost Effective（3 credits/頁）、Agentic（10 credits/頁，約 $0.0125）、Agentic Plus（45 credits/頁，約 $0.056）。Agentic 模式用多模態 VLM 推斷版面結構。

**LandingAI ADE**（Agentic Document Extraction）基於 Document Pre-trained Transformers（DPT-2），2025 年推出。

**IDP Accelerator**（[arXiv 2026-02](https://idp-software.com/guides/agentic-document-processing/)）是開源框架，四個組件：多模態分類器、多模態 LLM 抽取、MCP 分析模組、LLM 規則驗證。醫療場景實測：分類準確率 98%、處理延遲減少 80%、營運成本降低 77%。

## 與 Visual RAG（ColPali）的互補

[ColPali](/posts/ai/2026-03-12-colbert-late-interaction) 的做法是跳過文字解析，直接把 PDF 頁面渲染成圖片，用 vision-language model 產生 patch-level embedding。表格結構 100% 保留。

Agentic Parsing 走另一條路：保留文字，但讓 agent 選最佳解析方式。

兩者互補而非競爭：

| 面向 | ColPali / Visual RAG | Agentic Parsing |
|---|---|---|
| 表格保留 | 100%（圖片就是原始結構） | 依 parser 品質，需後處理 |
| 文字可搜尋 | ❌（BM25 不可用） | ✅ |
| 儲存成本 | ~100× | 正常 |
| 需要 GPU | 是 | 部分方法不需要 |
| 適合場景 | 表格密集、版面複雜 | 混合文件、需要文字語意 |

依 [Document Parsing Unveiled](https://arxiv.org/abs/2410.21169)（2024）的 survey，未來趨勢是兩者融合：agent 先判斷頁面類型，表格密集頁用 visual embedding，文字密集頁用傳統解析。

## 整體來說

Agentic Parsing 的核心取捨是用更多推理成本換取更高的解析品質——agent 每做一次「觀察→決策→行動」循環，就多花一些 LLM token，但能避免固定 pipeline 在非典型文件上的系統性失敗。

目前的限制很明確：ParseBench 最好的方案也只有 84.9%，五個維度沒有全能選手。Agentic 模式的成本是 Fast 模式的 10-45 倍。要不要用，取決於文件的價值和多樣性——高價值合約和財報值得用 agent 解析，大量格式統一的收據用固定 pipeline 就夠了。

方向是確定的：文件解析正在從「一條 pipeline 跑到底」變成「agent 根據文件調度工具」。這跟 RAG 從 [固定 retrieval](/posts/ai/2026-03-12-corrective-rag-crag) 到 [Agentic RAG](/posts/ai/2026-03-12-agentic-rag-react-loop) 的演進是同一個模式。

## 參考資料

- [AgenticOCR: Parsing Only What You Need for Efficient Retrieval-Augmented Generation](https://arxiv.org/abs/2602.24134)（arXiv:2602.24134，2026）
- [AgenticIE: An Adaptive Agent for Information Extraction from Complex Regulatory Documents](https://arxiv.org/abs/2509.11773)（arXiv:2509.11773，2025）
- [ParseBench: A Document Parsing Benchmark for AI Agents](https://arxiv.org/abs/2604.08538)（arXiv:2604.08538，LlamaIndex，2026）
- [Document Parsing Unveiled: Techniques, Challenges, and Prospects](https://arxiv.org/abs/2410.21169)（arXiv:2410.21169，2024）
- [ARIAL: An Agentic Framework for Document VQA with Precise Grounding](https://arxiv.org/abs/2511.18192)（arXiv:2511.18192，2025）
- [DocLens: A Tool-Augmented Multi-Agent Framework for Long Visual Document Understanding](https://arxiv.org/abs/2511.11552)（arXiv:2511.11552，Google，2025）
- [MADP: A Multi-Agent Pipeline for Sustainable Document Processing](https://arxiv.org/abs/2605.17159)（arXiv:2605.17159，2026）
- [Doc-Researcher: A Unified System for Multimodal Document Understanding](https://arxiv.org/abs/2510.21603)（arXiv:2510.21603，2025）
- [Hybrid OCR-LLM Framework for Enterprise-Scale Document Processing](https://arxiv.org/abs/2510.10138)（arXiv:2510.10138，2025）
- [ColPali: Efficient Document Retrieval with Vision Language Models](https://arxiv.org/abs/2407.01449)（arXiv:2407.01449，ICLR 2025）
- [LlamaParse — Document Parsing for LLM and Agent Pipelines](https://developers.llamaindex.ai/llamaparse/parse/guides/tiers/)
- [LandingAI ADE — Agentic Document Extraction](https://landing.ai/llms/best-document-parsing-apis-2026)
- [IDP Accelerator — Agentic Document Processing Guide](https://idp-software.com/guides/agentic-document-processing/)
- [文件解析三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)（站內）
- [解析層：當結構要用模型推斷](/posts/ai/2026-08-06-document-parsing-layout-ocr)（站內）
- [ColBERT 與 ColPali](/posts/ai/2026-03-12-colbert-late-interaction)（站內）
- [CRAG：檢索失敗時自動放寬條件重試](/posts/ai/2026-03-12-corrective-rag-crag)（站內）
- [Agentic RAG：讓 LLM 自己決定要不要再搜尋一次](/posts/ai/2026-03-12-agentic-rag-react-loop)（站內）
