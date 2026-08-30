---
title: "AWS GenAI Developer Professional（AIP-C01）備考路徑：整張考試都在考別人的模型怎麼整合"
date: 2026-08-18
type: guide
category: ai
tags: [certification, aws, generative-ai, rag, agents, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 2
tldr: "AIP-C01 是 AWS 唯一專攻 GenAI 應用開發的 professional 級證照，官方明確排除模型訓練、進階 ML 與特徵工程——它考的是把別人的基礎模型整合進生產系統。五章權重 31/26/20/12/11，最重的第 1 章有將近一半的技能點落在向量儲存與 RAG。2026 年 3 月的改版加入 Bedrock AgentCore，beta 已於 3/31 結束，更早的教材全部過期。官方規格：$300、180 分鐘、75 題（65 題計分）、及格 750、效期 3 年，考過會同時續掉 AIF-C01、MLA-C01 與 Data Engineer – Associate。"
description: "AWS Certified Generative AI Developer – Professional（AIP-C01）備考指南，依官方 exam guide 的五章權重逐章拆解 RAG、向量儲存、agentic AI、guardrails、成本延遲最佳化與評估的考點，附十週時程換算依據、官方點名的服務清單、續期圖與重考規則。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄 —— 作者沒有報考這張考試。所有「考什麼」都指回[官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)，所有「怎麼準備」都指回 AWS 官方訓練資源，不含考古題。查證日期：2026-08-18。

AIP-C01 在本系列裡是特別的一張：它是**唯一一張把「訓練模型」明確排除在外的 professional 級 AI 證照**。官方 exam guide 的排除清單只有三行，但這三行決定了整張考試的性質：

> Model development and training; Advanced ML techniques; Data engineering and feature engineering.

不考建模、不考進階 ML、不考資料與特徵工程。**它考的是拿別人的基礎模型，把它整合成一個能上線的系統** —— RAG、向量庫、agent、guardrails、成本與延遲、評估與除錯。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 這張適合誰

**官方建議的經驗值寫得很具體**：

> 2 or more years of experience building production-grade applications on AWS or with open-source technologies, general AI/ML or data engineering experience, and 1 year of hands-on experience implementing GenAI solutions.

兩年生產級應用開發加一年 GenAI 實作。這不是客套 —— 光第 1 章的 27 個技能點裡就有 11 個落在向量儲存設計與檢索機制，沒有真的建過 RAG 系統的人會在這章大量失血。

**適合**：已經在做 LLM 應用、agent 或 RAG，想把散落的實作經驗系統化並取得憑證的人。特別是**用 Bedrock 的團隊** —— 這張幾乎是 Bedrock 生態的全景考試。

**不適合**：想證明 ML 工程能力的人（那是 MLA-C01，兩張的 in-scope 幾乎不重疊）；或還沒實際做過 RAG 與 agent 的人 —— 這張沒有速成路徑。

**續期效率是它獨有的優勢**：依[官方 recertification 頁](https://aws.amazon.com/certification/recertification/)，考過 AIP-C01 會同時把 **AIF-C01、MLA-C01 與 Data Engineer – Associate** 各續三年。它自己則只能靠重考 AIP-C01 續期。整條 AWS AI 線上，這是續期投報率最高的一張。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 費用 | $300 |
| 時間 | 180 分鐘 |
| 題數 | 75 題，其中 **65 題計分、10 題不計分** |
| 題型 | 單選與複選（**沒有** AIF-C01 那種 ordering 與 matching） |
| 及格 | 量尺分數 **750**（範圍 100–1,000），補償計分 |
| 猜題 | 官方明寫「Unanswered questions are scored as incorrect. There is no penalty for guessing.」—— **不會就猜，不要留白** |
| 效期 | 3 年 |
| 語言 | 英文、日文、韓文、簡體中文（**沒有繁中**） |
| 先修 | 無 |

及格線 750 是本系列三張 AWS 證照裡最高的（AIF 700、MLA 720、AIP 750）。

## 五章權重

| 章節 | 比重 |
|---|---|
| 1. Foundation Model Integration, Data Management, and Compliance | **31%** |
| 2. Implementation and Integration | 26% |
| 3. AI Safety, Security, and Governance | 20% |
| 4. Operational Efficiency and Optimization for GenAI Applications | 12% |
| 5. Testing, Validation, and Troubleshooting | 11% |

**第 1、2 章合計 57%**。把時間照這個比例配，不要被第 3 章的安全治理嚇到 —— 它 20% 確實不低，但第 1 章一章就抵它一章半。

## 逐章準備

### 第 1 章：FM 整合、資料管理與合規（31%，最重）

官方把這章拆成六個任務，其中兩個是整張考試的核心。

**1.1 需求分析與方案設計**：架構設計、用 Bedrock 做技術 PoC、依 AWS Well-Architected Framework 與 **Generative AI Lens** 建立標準化元件。

**1.2 FM 選擇與設定**：依 benchmark、能力、限制選模型；**動態換模型的架構**（Lambda、API Gateway、AppConfig）；韌性設計（Step Functions circuit breaker、**Bedrock Cross-Region Inference**、跨區部署、優雅降級）；客製化生命週期（SageMaker AI 微調部署、**LoRA／adapter**、Model Registry 版控、回滾、模型退役）。

**1.3 資料驗證與處理管線**：Glue Data Quality、SageMaker Data Wrangler、Lambda、CloudWatch；多模態（Bedrock 多模態模型、SageMaker Processing、Transcribe）；模型專屬的輸入格式（Bedrock API 的 JSON、對話格式）。

**1.4 向量儲存設計**：Bedrock Knowledge Bases 的階層組織、OpenSearch Service 與 Neural plugin、RDS 搭 S3 文件庫、DynamoDB 搭向量庫、metadata 框架（S3 物件 metadata、自訂屬性、標籤）、**高效能索引（OpenSearch 分片、多索引、階層式索引）**、與文件管理系統整合、資料維護（增量更新、即時變更偵測、同步流程、排程刷新）。

**1.5 檢索機制與 RAG**：chunking（Bedrock 內建、Lambda 固定大小、階層式）；embedding 選擇（**Amazon Titan embeddings**、維度與領域適配、Lambda 批次 embedding）；向量搜尋部署（OpenSearch、**Aurora pgvector**、Bedrock Knowledge Bases 託管向量庫）；**進階搜尋（關鍵字＋向量混合、Bedrock reranker 模型）**；查詢處理（查詢擴展、分解、轉換）；存取機制（function calling、**用 MCP client 查詢向量庫**、標準化檢索 API）。

**1.6 Prompt 工程與治理**：Bedrock Prompt Management 的角色定義、Bedrock Guardrails；互動式脈絡（Step Functions 澄清流程、Comprehend 意圖、DynamoDB 對話歷史）；**prompt 治理**（參數化模板、審核流程、S3 儲存庫、CloudTrail、CloudWatch Logs）；prompt 的 QA 與回歸測試；**Bedrock Prompt Flows** 的 prompt 鏈、條件分支、可重用元件。

**怎麼準備**：1.4 與 1.5 加起來是 27 個技能點裡的 11 個 —— **依權重推算大約佔整張考試的 15% 到 18%**（這是我依技能點比例換算的，官方只公布章節權重）。實作上建議把一套 RAG 從頭做到尾：Bedrock Knowledge Bases 建一次、Aurora pgvector 建一次，親手比較兩者在 metadata 過濾與增量更新上的差別。**混合搜尋與 reranker 是新內容**，光讀不會有感覺。

### 第 2 章：實作與整合（26%）

**2.1 agentic AI 與工具整合**（7 個技能點，本章最重）：**Strands Agents** 與 **AWS Agent Squad** 做多 agent；**MCP** 處理 agent 與工具的互動；記憶與狀態管理；用 Step Functions 實作 ReAct 與 chain-of-thought；**防護機制**（停止條件、Lambda timeout、IAM 資源邊界、circuit breaker）；模型組合與協調；human-in-the-loop（Step Functions 審核核可、API Gateway 回饋）；**MCP server 部署在 Lambda（輕量無狀態）或 ECS（複雜工具）**。

**2.2 部署策略**：Lambda 隨選呼叫、**Bedrock provisioned throughput**、SageMaker endpoint 混合；容器部署依記憶體／GPU／token 吞吐調校；**model cascading** 與小型任務專用模型。

**2.3 企業整合**：既有 API 整合、事件驅動鬆耦合；API Gateway 微服務、Lambda webhook、EventBridge；身分聯合、RBAC、最小權限存取 FM；**AWS Outposts 與 Wavelength** 處理資料落地與邊緣；**CI/CD 與 GenAI gateway 架構**（CodePipeline、CodeBuild、自動化測試、安全掃描、回滾、集中式抽象層）。

**2.4 FM API 整合**：Bedrock 同步 API、SDK 搭 SQS 非同步；**Bedrock streaming API**、WebSocket／SSE、chunked transfer；韌性（SDK 指數退避、API Gateway 速率限制、fallback、**X-Ray**）；**智慧模型路由**（靜態、Step Functions 依內容、依指標）。

**2.5 應用整合與開發工具**：API Gateway 處理串流與 token 上限；**AWS Amplify** UI 元件、OpenAPI、Bedrock Prompt Flows 無程式碼；**Bedrock Data Automation**；**Amazon Q Developer** 生成與重構程式碼；CloudWatch Logs Insights 搭 X-Ray 除錯。

**怎麼準備**：這章的 agent 內容跟站內的 [Agent 生產線系列](/posts/ai/2026-08-10-agent-security-harness-layer)脈絡相通，但**考試要的是 AWS 的具體實作對應** —— 知道「多 agent 要用什麼」不夠，要知道 Strands Agents 與 Agent Squad 各自的定位、MCP server 什麼時候放 Lambda 什麼時候放 ECS。

### 第 3 章：AI 安全、資安與治理（20%）

**3.1 輸入輸出安全控制**：Bedrock Guardrails 的輸入過濾與回應過濾；自訂審核（Step Functions／Lambda）；**降低幻覺**（Knowledge Base grounding 加事實查核、信心分數、語意相似度、**JSON Schema 結構化輸出**）；縱深防禦（Comprehend 前置過濾、模型端 guardrail、Lambda 後處理、API Gateway 回應過濾）；**prompt injection 與 jailbreak 偵測**、輸入清洗、安全分類器、自動化對抗測試。

**3.2 資料安全與隱私**：VPC endpoint、IAM、**Lake Formation**、CloudWatch；PII 偵測用 **Comprehend 與 Macie**、Bedrock 原生隱私功能、S3 Lifecycle 保留；遮罩與匿名化。

**3.3 治理與合規**：SageMaker AI 的程式化 **model card**、Glue 資料血緣、metadata 標籤、CloudWatch 決策日誌；Glue Data Catalog 來源註冊、CloudTrail 稽核；持續監控（誤用、drift、政策違規偵測、**偏誤 drift 監控**、token 層級遮蔽、回應記錄、輸出政策過濾）。

**3.4 負責任 AI**：透明度（推理過程呈現、信心指標、來源歸屬、**Bedrock agent tracing**）；公平性（CloudWatch 公平性指標、用 Prompt Management／Prompt Flows 做 A/B、**LLM-as-a-judge 自動評估**）；政策合規（由政策生成 guardrail、model card 記錄限制、Lambda 合規檢查）。

**怎麼準備**：**Bedrock Guardrails 在這章被點名六次**（3.1.1、3.1.2、3.1.4、3.2.2、3.2.3、3.4.3），是全章密度最高的單一產品，值得專門實作一輪。幻覺處理那條特別注意：官方要的是**組合拳**（grounding + 事實查核 + 信心分數 + 結構化輸出），不是單一技巧。

### 第 4 章：營運效率與最佳化（12%）

**4.1 成本最佳化**：token 估算與追蹤、context window 最佳化、回應長度控制、**prompt 壓縮與 context pruning**；成本能力取捨、**依查詢複雜度分層使用 FM**、性價比；批次、容量規劃、自動擴展、provisioned throughput 最佳化；**語意快取、結果指紋、邊緣快取、確定性請求雜湊、prompt caching**。

**4.2 效能與延遲**：預先計算、**延遲最佳化的 Bedrock 模型**、平行請求、串流回應、benchmark；檢索速度（索引最佳化、查詢前處理、混合搜尋自訂評分）；吞吐量（token 處理最佳化、批次推論、併發管理）；**temperature 與 top-k／top-p 的選擇**、A/B 測試；API 呼叫剖析與向量庫查詢最佳化。

**4.3 監控與可觀測性**：CloudWatch 追蹤 token 用量、prompt 有效性、**幻覺率**、回應品質；異常偵測（token 暴衝、回應漂移）；**Bedrock Model Invocation Logs**；成本異常偵測；**工具呼叫的可觀測性與多 agent 協調追蹤**；向量庫營運監控；用 golden dataset 偵測幻覺、輸出 diff、推理路徑追蹤。

**怎麼準備**：這章只佔 12% 但實務價值最高，而且**語意快取與 prompt caching 是多數人沒實作過的** —— 這兩個直接決定 LLM 應用的成本結構，建議至少各做一次。

### 第 5 章：測試、驗證與除錯（11%）

**5.1 評估**（9 個技能點）：品質指標（相關性、事實正確性、一致性、流暢度）；**Bedrock Model Evaluations**、A/B 與 canary、多模型評估、token 效率與延遲品質比；使用者回饋介面、評分系統、標註流程；持續評估、回歸測試、**自動化品質閘門**；**RAG 評估與 LLM-as-a-Judge**、人類回饋；檢索品質測試（相關性評分、脈絡匹配、檢索延遲）；**Bedrock Agent evaluations**、任務完成率、工具使用效果、多步推理品質；部署驗證（合成使用者流程、幻覺率與語意漂移檢查）。

**5.2 除錯**：context window 溢位、動態 chunking、截斷錯誤；FM API 整合失敗；prompt 測試框架與版本比較；檢索問題（embedding 品質診斷、drift 監控、向量化與 chunking 修正）；prompt 維護（CloudWatch Logs 找 prompt 混淆、X-Ray prompt 可觀測性、schema 驗證）。

**怎麼準備**：評估這塊跟站內的 [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks)重疊度高，可以先看那篇建立方法論，再對回 Bedrock 的具體工具。

## 十週時程與換算依據

**換算方式**：這張是 professional 級、且第 1、2 章有大量必須動手才會的內容（RAG 全鏈、多 agent、MCP server 部署）。時程照權重配比，再對需要實作的章節加時。相較 [AIF-C01 的四週](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)（知識型、無實作章節），這張的內容量與實作量都是兩倍以上。

以每週 8–10 小時、共十週估算：

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀官方 exam guide + 官方 practice question set | 先確認自己缺哪一塊 |
| 第 2–4 週 | **第 1 章（31%）** —— 第 2 週 FM 選擇與資料管線、第 3 週向量儲存、第 4 週 RAG 與 prompt 治理 | 最重的一章，且 1.4／1.5 需要實際建 RAG |
| 第 5–6 週 | **第 2 章（26%）** —— 第 5 週 agentic AI 與 MCP，第 6 週部署與 API 整合 | 2.1 一個任務就 7 個技能點 |
| 第 7–8 週 | 第 3 章（20%） | Guardrails 實作一輪 + 治理概念 |
| 第 9 週 | 第 4 章（12%）+ 第 5 章（11%） | 兩章合計 23%，且主題相通（監控與評估） |
| 第 10 週 | 全書複習 + 再做一次 practice questions | 收尾 |

**沒有一年以上 GenAI 實作經驗的話，這個時程不成立。** 官方建議的門檻在這張特別實在 —— 第 1、2 章要的是「你建過並且踩過坑」，不是「你讀過」。這種情況下先去做一個真的 RAG 加 agent 專案，比排十週讀書計畫有效。

**失敗成本**：AWS [重考政策](https://aws.amazon.com/certification/policies/after-testing/)是沒過等 14 天、次數無上限，但這張 **$300** 是本系列最貴的，試錯成本比 AIF-C01 高三倍。時程建議抓滿，不要用「先考一次看看」的心態。

**官方材料優先序**：[Exam Prep Plan（AIP-C01）](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01)（16 項、14 小時 43 分）→ **Official Practice Question Set**（48 分鐘）→ **AWS Generative AI Developer Advanced Learning Plan（含 Labs）**（22 項、45 小時 20 分，實作份量最重）。Official Pretest（3 小時）標示為 Subscription。另有三天的實體課程 *Advanced Generative AI Development on AWS*，涵蓋 Bedrock Knowledge Bases 檢索增強與 AgentCore 的 agentic AI。

## 判斷教材是否過期

這張考試在 2026 年 3 月做過一次 refresh。[官方公告](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/)（2025-10-14 發布、2026-03-17 編輯）寫：

> To align with the rapid pace of AI innovation, the standard version of the exam has been refreshed to reflect changes in AWS services, including the addition of Amazon Bedrock AgentCore. The last day to take the beta version of the exam is March 31, 2026.

**判斷法**：翻教材目錄找 **Bedrock AgentCore、Strands Agents、AWS Agent Squad、MCP、Bedrock reranker、Kiro**。這些一個都沒提到，就是 2026 年 3 月以前的東西。另一個訊號是它寫「Amazon SageMaker」而不是現行的「Amazon SageMaker AI」。

## 考完之後

**效期 3 年，只有一條續期路徑**：重考 AIP-C01。可用 AWS Certification Account 的**五折券**，所以是 $150。

**但它會續掉三張別的。** 考過 AIP-C01 同時把 AIF-C01、MLA-C01、Data Engineer – Associate 各推後三年 —— 如果你手上有這幾張，AIP-C01 的實際價值不只是多一張證照。

**考過之後兩年內不能重考同一張。**

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-08-18 查證） | 什麼時候要重查 |
|---|---|---|
| 考綱內容 | 已含 Bedrock AgentCore（2026-03 refresh） | 每次 AWS re:Invent 之後 |
| 五章權重 | 31 / 26 / 20 / 12 / 11 | 每次改版 |
| 費用與題數 | $300、75 題（65 計分）、180 分鐘 | 每季 |
| 續期路徑 | 只能重考，但可續掉 AIF／MLA／DEA | 每半年 |
| 語言 | 英日韓與簡中，無繁中 | 每半年 |

## 參考資料

- [AWS Certified Generative AI Developer – Professional 官方認證頁](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AIP-C01 官方 exam guide（HTML）](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS 公告：擴充 AI 認證組合（含 AgentCore refresh 與 beta 結束日）](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/)
- [AWS Skill Builder — AIP-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01)
- [AWS Recertification（續期路徑與五折券）](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing（重考政策）](https://aws.amazon.com/certification/policies/after-testing/)

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks)
