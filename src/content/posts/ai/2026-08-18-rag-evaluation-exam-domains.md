---
title: "RAG 與檢索評估的考點交集：四張證照重複考什麼，還有一張大家以為它考、其實沒有"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, rag, retrieval, evaluation, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 17
tldr: "真正把 RAG 與檢索評估當考點的是四張：AWS AIF-C01（第 2、3 章合計 52%，RAG、向量儲存、FM 評估指標全在裡面）、AWS AIP-C01（第 1 章 31% 裡有 11 個技能點落在向量儲存與 RAG）、NVIDIA NCP-AAI（Knowledge Integration 10% ＋ Evaluation and Tuning 13%）、微軟 AI-500（Develop 30–35% 裡的「多 agent RAG 架構」）。Google PMLE 只貢獻一條 LLM-as-a-judge，而 Claude CCDV-F——那張大家最容易假設它考 RAG 的開發者證照——八個領域裡一條檢索考點都沒有，Eval 只佔 2.6%。附 AIF 與 AIP 的同廠雙級別對照、四家名詞對照表、獨有考點清單與練習專案。"
description: "跨證照的 RAG 與檢索評估考點整理：比對 AWS AIF-C01 與 AIP-C01、NVIDIA NCP-AAI、微軟 AI-500 四份官方 exam guide 的重疊與分歧，說明 Google PMLE 只有一條相關目標、Claude CCDV-F 完全不考檢索，附同廠雙級別對照與四家名詞對照表。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-rag-evaluation-exam-domains-en)
>
> 本文是從官方資料建出來的備考材料，不是應考實錄 —— 作者沒有報考這些考試。所有「考什麼」都指回各家官方 exam guide 或 blueprint，來源逐條列在文末。查證日期：2026-08-18。

這是 [AI 證照備考系列](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)的技術深潛篇第二篇，接在[多 agent 架構的考點交集](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)之後。做法一樣：**把「RAG 與檢索評估」這個被重複考的主題抽出來，一次講完交集，再標出不能互相取代的部分。**

但這個主題有一件事得放在最前面講：**選錯證照，這塊完全不會被考到。**

## 哪幾張，考點各在哪

| 證照 | RAG／檢索相關 domain | 權重 | 這張的角度 |
|---|---|---|---|
| [AWS AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide) | 2. Fundamentals of GenAI | 24% | token、chunking、embedding、向量、context engineering、FM 生命週期 |
| 同上 | 3. Applications of Foundation Models | **28%** | RAG 與 Knowledge Bases、向量儲存服務、客製化成本取捨、FM 評估指標 |
| 同上 | 5. Security, Compliance, and Governance | 14% | 幻覺偵測與 grounding（v1.1 新增的 5.1.5） |
| [AWS AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide) | 1. FM Integration, Data Management, and Compliance | **31%** | 1.4 向量儲存 ＋ 1.5 檢索與 RAG，是全系列最密的一塊 |
| 同上 | 4. Operational Efficiency and Optimization | 12% | 檢索速度、混合搜尋自訂評分、語意快取 |
| 同上 | 5. Testing, Validation, and Troubleshooting | 11% | RAG 評估、LLM-as-a-Judge、embedding 品質診斷 |
| [NVIDIA NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide) | Knowledge Integration and Data Handling | 10% | 檢索管線（RAG、嵌入搜尋、混合式）、向量庫最佳化 |
| 同上 | Evaluation and Tuning | 13% | 評估管線、任務 benchmark、準確度與延遲取捨 |
| [微軟 AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide) | Develop 塊裡的「多 agent RAG 架構」 | 30–35% 的一部分 | chunking、embedding 品質、檢索精準度三個詞並列 |
| [NVIDIA NCA-GENL](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide)（旁證） | Core ML and AI Knowledge 的條目層 | 30% 的一部分 | 為 RAG 整理與嵌入資料集、選模型做文字嵌入 |
| [Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide) | 2. Collaborating to manage data and models | ~16% | **只有一條**：用 LLM-as-a-judge 評估 GenAI 方案 |
| [Claude CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide) | — | — | **八個領域裡沒有任何檢索考點** |

### 先修掉一個誤解：Claude 的開發者證照不考 RAG

CCDV-F 是最容易被假設「應該會考 RAG」的一張 —— 它是 Anthropic 四張認證裡給工程師的那張，官方 Intended Audience 寫的是用 Claude Agent SDK 建 agent、透過 API 整合、建自訂工具與 MCP server 的人。做 LLM 應用的人幾乎都在做 RAG，所以直覺會補上這一塊。

**但官方 blueprint 的八個領域是這樣**：

| 領域 | 比重 |
|---|---|
| Applications and Integration | 33.1% |
| Model Selection and Optimization | 16.8% |
| Agents and Workflows | 14.7% |
| Prompt and Context Engineering | 11.0% |
| Tools and MCPs | 10.6% |
| Security and Safety | 8.1% |
| Claude Code | 3.1% |
| Eval, Testing, and Debugging | **2.6%** |

**沒有一個領域或子領域寫到 RAG、檢索、向量或 embedding。** 而且評估那塊 —— 也就是這個主題的另一半 —— 只有 **2.6%**，是八個領域裡最小的一個。

它跟本篇主題唯一的接點是 **Prompt and Context Engineering 那 11.0%**：工具輸出修剪、compaction、用 subagent 做 context 隔離、prompt caching 與 token 預算。**那是「檢索回來之後怎麼塞進 context」，不是「怎麼檢索」。** 這些內容在第七節會出現，但不足以讓 CCDV-F 成為一張 RAG 證照。

**這個結論只能推到 blueprint 為止**：官方沒有列出檢索目標，不代表題目裡不會出現 RAG 這個詞當情境背景。但**你不能靠準備 RAG 去拿這張的分數**，因為權重表上沒有它的位置。

**同理，PMLE 也不是。** [官方 exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer) 六章的 considerations 裡，唯一相關的一條是第 2 章的「**用 LLM-as-a-judge 評估 GenAI 方案**」。沒有 chunking、沒有向量庫、沒有檢索目標。它有 Agent Platform Feature Store，但那是 ML 特徵的儲存與服務，跟向量檢索是兩件事 —— 這組名詞是備考時最容易混掉的一對。

**所以這篇的四張是**：AIF-C01、AIP-C01、NCP-AAI、AI-500。PMLE 以一條目標的身分出現在第五節，NCA-GENL 當旁證。

## 同一家、兩個級別：AIF-C01 與 AIP-C01 差在哪

這兩張是本篇最有價值的對照，因為**同一個廠商、同一套 Bedrock 生態，但對 RAG 的要求完全不同級別**。

| | AIF-C01（foundational，$100） | AIP-C01（professional，$300） |
|---|---|---|
| 官方預設經驗 | 「使用但不一定要會建」，六個月接觸 | 兩年生產級應用開發 ＋ 一年 GenAI 實作 |
| RAG 出現在 | 第 3 章 28% 的條目：**RAG 與 Bedrock Knowledge Bases** | 第 1 章 31% 的兩個完整任務（1.4 ＋ 1.5） |
| 向量儲存 | 列**服務名稱**：OpenSearch Service、Aurora、Neptune、RDS for PostgreSQL | 列**設計決策**：階層組織、metadata 框架、分片與多索引、增量更新與排程刷新 |
| chunking | 第 2 章的名詞（token、chunking、embedding、向量並列） | 三種具體實作 ＋ 除錯情境（動態 chunking、截斷錯誤） |
| 評估 | **指標名稱**：ROUGE、BLEU、BERTScore、LLM-as-a-judge、Bedrock Model Evaluation | **評估流程**：檢索品質測試、自動化品質閘門、golden dataset、A/B 與 canary |
| 進階檢索 | 不考 | 混合搜尋、**Bedrock reranker**、查詢擴展／分解／轉換 |
| 題型 | 單選、複選、**ordering、matching** | 只有單選與複選 |

**一句話總結兩者的分界**：AIF-C01 考的是**你能不能把 RAG 講清楚並排出成本順序**，AIP-C01 考的是**你能不能把它建起來並在壞掉時修好**。

最能說明這件事的是**客製化方式的成本取捨**。AIF-C01 第 3 章明列五種要你排序：**預訓練、微調、in-context learning、RAG、模型蒸餾**。這是選型題。AIP-C01 完全不考這個排序 —— 它假設你已經選了 RAG，直接跳到「那你的索引怎麼分片、來源文件改了之後多久同步」。

**另一個反直覺的差異**：**ROUGE、BLEU、BERTScore 這三個指標只有 AIF-C01 點名**，AIP-C01 的 5.1 講的是相關性、事實正確性、一致性、流暢度這種品質維度，加上 LLM-as-a-Judge 與檢索品質測試。**foundational 那張反而更像傳統 NLP 評估課**，professional 那張已經走到管線與閘門。準備 AIP-C01 的人如果沒讀過 AIF-C01 的考綱，會漏掉那三個縮寫。

**Neptune 也是**：AIF-C01 的向量儲存服務清單裡有 Neptune（圖資料庫），AIP-C01 的 1.4／1.5 沒有。同一家的兩份考綱在服務清單上不完全相容，兩張都要考的人別假設高階那張是低階的超集。

**要點回指**：AIF-C01 第 2 章（24%）＋ 第 3 章（28%），兩章合計 52%；AIP-C01 第 1 章（31%）。

## 交集：四張都在考的八件事

前四節是檢索機制（AIF-C01 到名詞層、AIP-C01 到實作層、NCP-AAI 到管線層、AI-500 到三個關鍵詞）；後四節是評估與取捨，交集最寬，PMLE 與 NCA-GENL 也在裡面。

**只準備一張的話，後四節投報率最高**，因為它在每張都出現。

### 一、chunking 是被點名的動詞，不是背景知識

AIP-C01 的 1.5 把 chunking 拆成三種具體實作：**Bedrock 內建 chunking、Lambda 固定大小、階層式**。這是幾份材料裡唯一把切法逐個列出來的。

其他家的等價考點：

- **AIF-C01**：第 2 章把 **token、chunking、embedding、向量**四個詞並列在同一條目標裡，是概念層的認知要求
- **AI-500**：「多 agent RAG 架構（chunking、embedding 品質、檢索精準度）」—— 三個詞並列，等於直接告訴你這三件事是一組
- **NCP-AAI**：Knowledge Integration 那 10% 寫「檢索管線（RAG、嵌入搜尋、混合式）」，chunking 沒被單獨點名，含在管線裡
- **NCA-GENL**：條目層寫「**為 RAG 整理與嵌入內容資料集**」

**AIP-C01 還把 chunking 考進除錯題**：第 5.2 明列 **context window 溢位、動態 chunking、截斷錯誤**，以及「向量化與 chunking 修正」。**同一件事在第 1 章考設計、在第 5 章考救火** —— 代表題目會用「檢索結果被截斷」這種症狀反過來問你切法有什麼問題。

站內的 [chunking 策略](/posts/ai/2026-03-12-chunking-strategies)與 [contextual retrieval](/posts/ai/2026-03-12-contextual-retrieval) 有各切法的實作差異，本篇不重複。

**要點回指**：AIP-C01 第 1 章（31%）1.5 ＋ 第 5 章（11%）5.2、AIF-C01 第 2 章（24%）、AI-500 Develop（30–35%）、NCP-AAI Knowledge Integration（10%）、NCA-GENL Core ML（30% 的條目層）。

### 二、embedding 選型是「選模型」也是「診斷」

AIP-C01 的 1.5 寫得最細：**Amazon Titan embeddings、維度與領域適配、Lambda 批次 embedding**。三個關鍵字對應三件不同的事 —— 選哪個模型、維度與領域是否匹配、大量文件怎麼批次跑。

- **AIF-C01**：embedding 與向量是第 2 章的基礎名詞，要求的是能解釋而不是能調校
- **NCA-GENL**：「**選模型建立文字嵌入**」是條目層的獨立一條
- **AI-500**：只寫「embedding 品質」四個字，但它跟 chunking、檢索精準度並列，是同一條技能
- **NCP-AAI**：寫「嵌入搜尋」，重點在搜尋不在選型

**AIP-C01 一樣把它考進除錯**：5.2 的「檢索問題」明列 **embedding 品質診斷、drift 監控**。**embedding drift 這個詞只有 AIP-C01 有** —— 它要求你知道 embedding 模型換版或資料分布改變之後，既有索引會失效。

站內的 [BGE-M3 embedding 模型選型](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)與[繁中 embedding 的 RAG 失效](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures)可以補「領域適配」那條在中文語境的具體樣貌。

**要點回指**：AIP-C01 第 1 章 1.5 ＋ 第 5 章 5.2、AIF-C01 第 2 章（24%）、AI-500 Develop、NCA-GENL Core ML、NCP-AAI Knowledge Integration。

### 三、向量儲存：從「列服務」到「做設計」

**AIP-C01 的 1.4 是整個系列裡對向量儲存要求最高的一條考綱**，官方列的是產品組合而不是原理：Bedrock Knowledge Bases 的階層組織、OpenSearch Service 與 Neural plugin、RDS 搭 S3 文件庫、DynamoDB 搭向量庫、**metadata 框架**（S3 物件 metadata、自訂屬性、標籤）、**高效能索引（OpenSearch 分片、多索引、階層式索引）**、與文件管理系統整合、**資料維護（增量更新、即時變更偵測、同步流程、排程刷新）**。1.5 再補上部署面：OpenSearch、**Aurora pgvector**、Bedrock Knowledge Bases 託管向量庫。

**AIF-C01 的對應是一份服務清單**：OpenSearch Service、Aurora、Neptune、RDS for PostgreSQL。**認得出哪些 AWS 服務能當向量儲存**就夠，不要求你設計索引。

**NCP-AAI 的對應只有一句**：「**向量資料庫的設定與最佳化**」。它把整塊壓成一條，這是它平台中立的代價 —— 準備時你得自己挑一套向量庫去練，官方不會告訴你練哪個。NCA-GENL 更淺，只在「Python 的自然語言套件（spaCy、NumPy、**向量資料庫**）」裡帶到名詞。

**PMLE 在這裡是空的**，前面說過的 Feature Store 不算。

**最容易被低估的是資料維護那條**：增量更新、即時變更偵測、同步流程、排程刷新這四個都是營運題，不是建置題。多數人建過向量庫但沒處理過「來源文件改了之後索引怎麼跟上」，而 AIP-C01 明確要考。站內的[向量資料庫比較](/posts/ai/2026-03-12-vector-database-comparison)與[知識管線的 RAG 品質控制](/posts/ai/2026-04-18-knowledge-pipeline-rag-quality-control)對應這塊。

**要點回指**：AIP-C01 第 1 章（31%）1.4 ＋ 1.5、AIF-C01 第 3 章（28%）、NCP-AAI Knowledge Integration（10%）、NCA-GENL Core ML（30% 的條目層）。

### 四、混合檢索、reranker 與查詢處理

AIP-C01 的 1.5 把進階檢索列成兩條：**進階搜尋（關鍵字＋向量混合、Bedrock reranker 模型）**，以及**查詢處理（查詢擴展、分解、轉換）**。第 4.2 再從效能角度考一次：**檢索速度（索引最佳化、查詢前處理、混合搜尋自訂評分）**。

NCP-AAI 只有一個詞對應：檢索管線的「**混合式**」。**reranker 在 AIF-C01、NCP-AAI、NCA-GENL、AI-500、PMLE 的官方措辭裡都找不到** —— 這是 AIP-C01 獨有的具名考點，也是這一節裡 foundational 與 professional 落差最大的地方。

AIP-C01 還有一條別家沒有的**存取機制**：function calling、**用 MCP client 查詢向量庫**、標準化檢索 API。把 MCP 拉進檢索層這件事只有它考 —— 值得注意的是 AIF-C01 與 AI-500 都考 MCP，但考的是 agent 與工具的連接，不是查詢向量庫。

站內對應：[混合檢索 BM25 + 向量 + RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)、[cross-encoder reranking](/posts/ai/2026-03-12-cross-encoder-reranking)、[多查詢擴展](/posts/ai/2026-03-12-multi-query-expansion)。

**要點回指**：AIP-C01 第 1 章 1.5 ＋ 第 4 章（12%）4.2、NCP-AAI Knowledge Integration（10%）。

### 五、檢索精準度怎麼量：RAG 評估與 LLM-as-a-judge

**這是全篇覆蓋最廣的一節，六份材料全部命中。**

- **AIF-C01** 第 3 章：FM 評估的方法與指標 —— **human-in-the-loop、benchmark、Bedrock Model Evaluation、ROUGE／BLEU／BERTScore／LLM-as-a-judge**，並且明列「**評估用 FM 建的應用（RAG、agent、workflow）**」與**業務對齊指標**（任務完成率、使用者滿意度、每次互動成本，v1.1 新增的 3.4.5）
- **AIP-C01** 5.1：**RAG 評估與 LLM-as-a-Judge**、人類回饋；**檢索品質測試（相關性評分、脈絡匹配、檢索延遲）**；品質指標（相關性、事實正確性、一致性、流暢度）；Bedrock Model Evaluations、A/B 與 canary、**自動化品質閘門**
- **NCP-AAI** Evaluation and Tuning（13%）：評估管線與任務 benchmark、跨任務與資料集比較
- **AI-500**：**針對記憶、知識、工具、prompt 分別做評估**，以及持續改善的 **LLM-as-a-judge 框架**
- **PMLE** 第 2 章：「**用 LLM-as-a-judge 評估 GenAI 方案**」—— 這一條就是它對本主題的全部貢獻
- **NCA-GENL** Experimentation（22%）：「如何執行、評估與詮釋實驗，包含 AI 模型評估」

**LLM-as-a-judge 是唯一六份材料都寫出來的名詞。** 如果整篇只記一件事，記這個。

**四個切法值得分開記**，因為考法不同：

| 切法 | 誰考 | 題目長相 |
|---|---|---|
| 指標名稱層（ROUGE／BLEU／BERTScore） | **AIF-C01 獨有** | 給一個評估任務問該用哪個指標 |
| 品質維度層（相關性／事實正確性／一致性／流暢度） | AIP-C01 | 給情境問該量哪個維度 |
| 元件層（記憶／知識／工具／prompt 分別評） | AI-500 | 給一個壞掉的系統問該先評哪一塊 |
| 應用層（評估 RAG／agent／workflow 這種組合系統） | AIF-C01、AIP-C01 | 問「模型好但系統壞」該怎麼定位 |

**AIP-C01 的「檢索品質測試」那條要單獨拉出來**：相關性評分、脈絡匹配、檢索延遲三者並列，代表官方把**延遲當成檢索品質的一部分**，不是另一個維度。這跟多數人的直覺不同。

站內的 [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks)、[self-reflection 與 LLM-as-judge](/posts/ai/2026-03-12-self-reflection-llm-as-judge)、[語意相似度與檢索相關性的落差](/posts/ai/2026-06-04-semantic-similarity-retrieval-relevance-gap)是這節的實作背景，本篇不重寫。

**要點回指**：AIF-C01 第 3 章（28%）、AIP-C01 第 5 章（11%）5.1、NCP-AAI Evaluation and Tuning（13%）、AI-500 Evaluate（20–25%）、PMLE 第 2 章（~16%）、NCA-GENL Experimentation（22%）。

### 六、人在迴圈：標註、回饋與人工審查

自動評估不夠，這點四家都同意，但要求的東西不同：

- **AIF-C01**：**human-in-the-loop 就寫在 FM 評估那條的第一個位置**；第 4 章另有「**以人為本的設計（使用者回饋機制、AI 決策透明度）**」與偵測工具（標註品質分析、人工稽核、子群分析）
- **AIP-C01** 5.1：**使用者回饋介面、評分系統、標註流程**；3.4 另有「LLM-as-a-judge 自動評估」與人類判斷並列
- **NCP-AAI**：Evaluation and Tuning 裡的「**結構化使用者回饋的蒐集與整合**」，加上獨立成 5% 的 Human-AI Interaction and Oversight
- **AI-500**：「**在 Foundry 裡設計人工審查流程**」是評估塊的明列技能
- **NCA-GENL**：Experimentation 那 22% 的官方定義直接寫「**在標註或 RLHF 中使用人類受試者**」

**要注意措辭差異**：AIF-C01 要的是**認知**（知道 human-in-the-loop 是評估方法之一），AIP-C01 要的是**介面與流程**（你要設計出可用的回饋收集機制），NCA-GENL 要的是**人類受試者的實驗方法**（更偏研究倫理與實驗設計）。三者不能互相替代。

**要點回指**：AIF-C01 第 3 章（28%）＋ 第 4 章（14%）、AIP-C01 第 5 章 5.1 ＋ 第 3 章（20%）3.4、NCP-AAI Evaluation（13%）＋ Human-AI Interaction（5%）、AI-500 Evaluate（20–25%）、NCA-GENL Experimentation（22%）。

### 七、延遲、成本與準確度的三角

- **NCP-AAI** 把它寫成一條技能：「**準確度與延遲效率的取捨調校**」
- **AIP-C01** 拆得最細。4.1 成本：token 估算與追蹤、**context window 最佳化**、**prompt 壓縮與 context pruning**、**依查詢複雜度分層使用 FM**、**語意快取、結果指紋、邊緣快取、確定性請求雜湊、prompt caching**。4.2 效能：**延遲最佳化的 Bedrock 模型**、平行請求、串流、benchmark、吞吐量、**temperature 與 top-k／top-p 的選擇**
- **AIF-C01** 用概念題涵蓋同一件事：第 2 章的 **token 計價模型及其對成本與推論效能的影響**（v1.1 新增的 2.1.4）與 **context engineering 在 FM 應用中的角色**（2.1.5）；第 3 章的 FM 選擇準則明列**成本、延遲、輸入輸出長度、prompt caching**
- **PMLE** 第 1 章：「**針對成本、延遲、可用性最佳化 Gemini 應用**」

**AIF-C01 的 token 計價那條特別值得拿去用**，即使你不考這張：它要求的是「同樣一個任務，換模型或壓縮 prompt 之後成本差多少」這種可量化的判斷，而這正是 RAG 系統上線後最先被問到的問題。

**這裡也是 CCDV-F 唯一沾到邊的地方**：它的 Prompt and Context Engineering（11.0%）考 token 預算與成本建模、**prompt caching 與 cache check-pointing**、工具輸出修剪與 compaction、用 subagent 做 context 隔離。**「工具輸出修剪」與 AIP-C01 的「context pruning」是同一件事的兩個名字**，而 **cache check-pointing 是 CCDV-F 獨有的詞**。但如前所述，這些是 context 管理不是檢索。

站內的[語意快取](/posts/ai/2026-03-12-semantic-caching)與 [RAG 成本最佳化](/posts/ai/2026-03-12-rag-cost-optimization)對應這節。

**要點回指**：AIP-C01 第 4 章（12%）4.1 ＋ 4.2、AIF-C01 第 2 章（24%）＋ 第 3 章（28%）、NCP-AAI Evaluation and Tuning（13%）、PMLE 第 1 章（~13%）。

### 八、輸出端與上線後：grounding、幻覺率與 drift

檢索系統的輸出端與上線監控，是四家分歧最有意思的一節 —— **每家盯的東西都不一樣**：

| 證照 | 官方要你做什麼 |
|---|---|
| AIF-C01（5.1.5，v1.1 新增） | **幻覺偵測與 grounding：RAG grounding、輸出驗證、信心分數** —— 官方把 RAG 直接寫成 grounding 手段 |
| AIP-C01（4.3） | token 用量、prompt 有效性、**幻覺率**、回應品質；異常偵測（token 暴衝、**回應漂移**）；**Bedrock Model Invocation Logs**；**向量庫營運監控**；用 **golden dataset 偵測幻覺**、輸出 diff、推理路徑追蹤 |
| NCP-AAI（Run/Monitor/Maintain） | 監控儀表板與可靠性指標、日誌與異常追蹤、**持續與前版做 benchmark** |
| AI-500 | **sliding-window amnesia、summary drift、vector-only recall、entity continuity** 四種 context window 失效模式 |
| PMLE（第 6 章） | **training-serving skew、data drift、concept drift、feature attribution drift** 四種，用 Model Monitoring |

**AIF-C01 的 5.1.5 是這幾份裡唯一把 RAG 明確定位成「幻覺的解法」的一條**，而且它把 grounding、輸出驗證、信心分數三件事綁在一起 —— AIP-C01 的第 3.1 也有等價的組合拳（Knowledge Base grounding 加事實查核、信心分數、JSON Schema 結構化輸出），但它放在安全章而不是治理章。**同一個技巧在兩張的章節歸屬不同**，讀考綱時別照章節標題找。

**五家都在講 drift，講的卻不是同一種 drift。** PMLE 的四種是統計分布的漂移（傳統 ML 監控），AIP-C01 的「回應漂移」與「embedding drift」是生成與檢索層的，AI-500 的四種是 context window 的失效模式。**考試裡看到 drift 這個字，先確認是哪一層。**

**golden dataset 只有 AIP-C01 點名**，而 **AI-500 的 vector-only recall** 是這幾份材料裡唯一一個直接描述「只靠向量檢索會漏掉什麼」的具名失效模式 —— 對做 RAG 的人，這個詞比它出現在多 agent 考綱裡更有用。

**NCP-AAI 的權重要標一個坑**：Run, Monitor, and Maintain 這塊**官方網頁寫 5%、官方 PDF study guide 寫 7%**，兩份都在 nvidia.com。同一份表的 Deployment and Scaling 也對不上（網頁 13%、PDF 5%）。準備時當成不確定區間，別挑一個當事實。

站內的 [RAG 可觀測性與 tracing](/posts/ai/2026-03-12-rag-observability-tracing)、[RAG 失效模式](/posts/ai/2026-03-12-rag-failure-modes)、[RAG A/B 測試](/posts/ai/2026-03-12-rag-ab-testing)對應這節。

**要點回指**：AIF-C01 第 5 章（14%）5.1.5、AIP-C01 第 4 章（12%）4.3 ＋ 第 3 章（20%）3.1、NCP-AAI Run/Monitor/Maintain（5–7%，兩版矛盾）、AI-500 Evaluate（20–25%）、PMLE 第 6 章（~13%）。

## 同一件事，四家四個名字

| 概念 | AWS（AIF-C01／AIP-C01） | NVIDIA（NCP-AAI／NCA-GENL） | 微軟（AI-500） | Google（PMLE） |
|---|---|---|---|---|
| 文件切分 | 名詞層 chunking／三種實作 ＋ 動態 chunking 除錯 | 含在「檢索管線」裡、「為 RAG 整理資料集」 | chunking（與 embedding 品質、檢索精準度並列） | **不考** |
| 向量化 | embedding 與向量名詞／Titan embeddings、維度與領域適配、embedding 品質診斷 | 嵌入搜尋、「選模型建立文字嵌入」 | embedding 品質 | **不考**（Feature Store 不是這個） |
| 向量儲存 | 服務清單（OpenSearch／Aurora／Neptune／RDS）／設計決策（分片、多索引、metadata 框架、增量更新） | 「向量資料庫的設定與最佳化」一句話 | （未單獨列出） | **不考** |
| 進階檢索 | 不考／關鍵字＋向量混合、**Bedrock reranker**、查詢擴展與分解與轉換 | 「混合式」一個詞 | 檢索精準度 | **不考** |
| 評估指標 | **ROUGE／BLEU／BERTScore**／相關性、事實正確性、一致性、流暢度 | 任務 benchmark、跨資料集比較 | 記憶／知識／工具／prompt 分別評估 | **不考** |
| LLM 評審 | LLM-as-a-judge（兩張都有） | 評估管線 | LLM-as-a-judge 框架 | **LLM-as-a-judge**（唯一相關目標） |
| 人在迴圈 | human-in-the-loop 認知／回饋介面、評分系統、標註流程 | 結構化回饋蒐集、Human-AI Oversight 5% | Foundry 人工審查流程 | 負責任 AI 與偏誤監控 |
| 成本控制 | token 計價模型、prompt caching／語意快取、context pruning、分層 FM | 準確度與延遲取捨調校 | 平行度與速率限制 | 針對成本、延遲、可用性最佳化 Gemini 應用 |
| 幻覺處理 | **RAG grounding、輸出驗證、信心分數**／grounding ＋ 事實查核 ＋ 結構化輸出 | 偏誤與毒性緩解 | vector-only recall 等四種失效模式 | Model Armor |
| 上線監控 | 不考／幻覺率、回應漂移、golden dataset、向量庫營運監控 | 監控儀表板、與前版 benchmark | 四種 context window 失效模式 | 四種 drift、Model Monitoring |

**Anthropic 不在這張表上，那本身就是結論**：CCDV-F 的八個領域在這十列裡只填得出「成本控制」一格（token 預算、prompt caching、cache check-pointing、compaction）。

**這張表最該看的是「不考」那些格。** 它們不是我沒查到，是官方 considerations／blueprint 裡確實沒有 —— 你在 PMLE 的準備時間裡讀 chunking 與向量庫，考試不會回報你。

## 不能互相取代的部分

**AIF-C01 獨有**：**ROUGE／BLEU／BERTScore** 三個指標、**五種客製化方式的成本排序**（預訓練／微調／in-context learning／RAG／模型蒸餾）、把 **Neptune** 列進向量儲存服務、**token 計價模型**、**業務對齊指標**（任務完成率、使用者滿意度、每次互動成本）、**Generative AI Security Scoping Matrix**、prompt 風險四件套（曝露、poisoning、hijacking、jailbreaking）。**加上 ordering 與 matching 兩種題型** —— 這兩種部分答對不給分，AIP-C01 沒有。

**AIP-C01 獨有**：Bedrock reranker 模型、metadata 框架（S3 物件 metadata／自訂屬性／標籤）、OpenSearch 分片與多索引與階層式索引、Aurora pgvector、**用 MCP client 查詢向量庫**、增量更新與即時變更偵測與排程刷新、**embedding 品質診斷與 drift 監控**、**golden dataset 偵測幻覺**、語意快取與結果指紋與確定性請求雜湊、**檢索品質測試的三個維度**、自動化品質閘門、Bedrock Agent evaluations。**這張是唯一能靠它一張把 RAG 補完的。**

**NCP-AAI 獨有**：那 7% 的 NVIDIA Platform Implementation —— **NeMo Guardrails、NIM microservices、NeMo Agent Toolkit、TensorRT-LLM、Triton Inference Server**；加上「對結構化與非結構化知識的即時存取與推理」與知識圖譜關聯推理。除了那 7%，其餘九個領域的措辭是這幾份裡**廠商中立度最高的**，可以當通用詞彙表。

**AI-500 獨有**：**vector-only recall** 等四種 context window 失效模式的具名、**針對記憶／知識／工具／prompt 分別評估**、把 RAG 放進多 agent 脈絡（「供多 agent 消費的知識整合」）。

**PMLE 獨有**：**四種 drift 的區分**（training-serving skew、data drift、concept drift、feature attribution drift）與 **Model Monitoring**、**Model Armor**。這些跟檢索無關，但跟「AI 系統上線後怎麼盯」高度相關。

## 一個練習專案能蓋掉多少

這份清單對應上面八節，**做完能蓋掉交集，蓋不掉獨有那節**：

1. 同一份文件庫用**三種切法**各建一次索引（固定大小、階層式、依語意邊界），量同一組問題的召回差異 →（一）
2. 換一個 **embedding 模型**重跑，把「換模型之後既有索引為什麼失效」實際踩一次 →（二）
3. 建**兩套向量儲存**（一套託管、一套自管），比較 metadata 過濾與**增量更新**的差別；刻意改一份來源文件，看索引多久跟上 →（三）
4. 加上**關鍵字＋向量的混合檢索**與一個 **reranker**，分別量 top-k 的變化 →（四）
5. 建一組 **golden dataset**，同時用 **LLM-as-a-judge** 與 **ROUGE／BERTScore** 跑一次，看兩種指標在同一批答案上排序是否一致 →（五）
6. 做一個**人工標註介面**（哪怕只是一張表單），把人的評分跟 judge 的評分對起來看落差 →（六）
7. 加**語意快取**與 **prompt caching**，量成本下降多少、命中錯誤的比例多少；順便把「換模型或壓 prompt 之後每次互動成本差多少」算出來 →（七）
8. 上線後盯四件事：**幻覺率**、**embedding drift**、向量庫查詢延遲、信心分數低於門檻的比例，各設一條告警 →（八）

**第 5 步是這份清單裡最划算的一步**，因為它同時蓋掉 AIF-C01 的指標題與 AIP-C01 的品質閘門題，而多數人只做過其中一種。

補獨有考點的最短路徑：AWS 線讀 [AIF-C01 官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) 的第 3 章與 [AIP-C01 官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html) 的 1.4／1.5／5.1；NVIDIA 線那 7% 只能讀自家產品文件或買 DLI 課（[Evaluating RAG and Semantic Search Systems](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-32+V1) 是五門裡最便宜的一門，$30／3 小時，直接對應 Evaluation and Tuning）；微軟線讀 [AI-500 study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)；Google 線讀 Model Monitoring 與 Model Armor 文件。

## 只讀一份的話，讀哪一份

**看你要哪一層。**

**要完整的檢索檢核表：[AIP-C01 的官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)。** 它的 1.4 與 1.5 是這幾份材料裡唯一把 RAG 從資料進場到檢索出場逐條列完的 —— 27 個技能點裡的 11 個落在這兩條，[AIP-C01 那篇](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)依技能點比例把它換算成整張考試的 15% 到 18%（**那是依比例推算，不是官方數字，官方只公布章節權重**）。它是免費公開的 HTML，不需報名，而且把別家沒命名的東西命名了（embedding drift、golden dataset、檢索品質測試的三個維度）。

**要最短的詞彙表：[AIF-C01 的官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)。** 第 2、3 章合計 52%，而且它是這幾份裡唯一把評估指標的縮寫逐個列出來的。讀完成本遠低於 AIP-C01，卻能把整個主題的名詞掃過一遍。**但要注意版本**：v1.1（2026-04-30）新增七條目標，包含 token 計價、context engineering、agentic AI 與 MCP、幻覺偵測與 grounding，[改版紀錄頁](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)有逐條對照 —— 舊版整理文幾乎都缺這七條。

**兩者共同的偏誤**：都繞著 Bedrock 生態，名詞是 AWS 的。想要中立版本，讀 [NCP-AAI 的十個領域描述](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/) —— Knowledge Integration 與 Evaluation and Tuning 那兩塊的措辭不綁產品。

站內想一次補完 RAG 方法論的話，[RAG patterns 完整指南](/posts/ai/2026-03-14-rag-patterns-complete-guide)是入口。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| AIF-C01 考綱版本 | **v1.1（2026-04-30 發布）**，新增七條目標 | revisions 頁每次更新 |
| AIF-C01 五章權重 | 20 / 24 / 28 / 14 / 14 | 每次改版 |
| AIP-C01 五章權重 | 31 / 26 / 20 / 12 / 11 | 每次改版 |
| AIP-C01 考綱內容 | 已含 Bedrock AgentCore（2026-03 refresh） | 每次 AWS re:Invent 之後 |
| NCP-AAI 報名 | Coming soon，尚未開放 | 每月 |
| NCP-AAI 權重矛盾 | 網頁合計 98%、PDF 合計 92%，兩項數字不同 | 開放報名時 |
| AI-500 狀態 | 仍是 beta，官方部落格寫 GA 預計 2026/10 | 每月 |
| PMLE 是否加入檢索考點 | 目前 considerations 只有一條 LLM-as-a-judge | Google Cloud Next 之後 |
| CCDV-F 是否加入檢索考點 | 目前 blueprint 八個領域皆無 | 每次 guide 改版 |

## 參考資料

- [AIF-C01 官方 exam guide（五章權重與全部目標）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html)
- [AIF-C01 exam guide 改版紀錄（v1.0 → v1.1 逐條對照）](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/aif-01-revisions.html)
- [AWS Certified AI Practitioner 官方認證頁](https://aws.amazon.com/certification/certified-ai-practitioner/)
- [AIP-C01 官方 exam guide（五章權重與全部技能點）](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS Certified Generative AI Developer – Professional 官方認證頁](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [NCP-AAI 官方認證頁（十個領域與權重表）](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [NCA-GENL 官方認證頁（規格與 blueprint）](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NVIDIA DLI — Evaluating RAG and Semantic Search Systems](https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-32+V1)
- [微軟 AI-500 官方 study guide（含「多 agent RAG 架構」那條）](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [Google Professional ML Engineer 官方考試指南（用來確認它只有一條 LLM-as-a-judge）](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Claude Certified Developer – Foundations 官方認證頁（含 exam guide 下載，用來確認它不考檢索）](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification)
- [AWS Skill Builder — AIF-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01)
- [AWS Skill Builder — AIP-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [多 agent 架構的考點交集（本系列技術深潛篇第一篇）](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains)
- [AWS AIF-C01 備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [AWS AIP-C01 備考路徑](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
- [NVIDIA NCP-AAI 備考路徑](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide)
- [微軟 AI-500 備考路徑](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide)
- [NVIDIA NCA-GENL 備考路徑](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [Claude Certified Developer（CCDV-F）備考路徑](/posts/ai/2026-08-18-claude-certified-developer-prep-guide)
- [RAG patterns 完整指南](/posts/ai/2026-03-14-rag-patterns-complete-guide)
- [chunking 策略](/posts/ai/2026-03-12-chunking-strategies)
- [contextual retrieval](/posts/ai/2026-03-12-contextual-retrieval)
- [BGE-M3 embedding 模型選型](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)
- [繁中 embedding 的 RAG 失效](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures)
- [向量資料庫比較](/posts/ai/2026-03-12-vector-database-comparison)
- [混合檢索 BM25 + 向量 + RRF](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)
- [cross-encoder reranking](/posts/ai/2026-03-12-cross-encoder-reranking)
- [多查詢擴展](/posts/ai/2026-03-12-multi-query-expansion)
- [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks)
- [self-reflection 與 LLM-as-judge](/posts/ai/2026-03-12-self-reflection-llm-as-judge)
- [語意相似度與檢索相關性的落差](/posts/ai/2026-06-04-semantic-similarity-retrieval-relevance-gap)
- [RAG A/B 測試](/posts/ai/2026-03-12-rag-ab-testing)
- [語意快取](/posts/ai/2026-03-12-semantic-caching)
- [RAG 成本最佳化](/posts/ai/2026-03-12-rag-cost-optimization)
- [RAG 可觀測性與 tracing](/posts/ai/2026-03-12-rag-observability-tracing)
- [RAG 失效模式](/posts/ai/2026-03-12-rag-failure-modes)
- [知識管線的 RAG 品質控制](/posts/ai/2026-04-18-knowledge-pipeline-rag-quality-control)
