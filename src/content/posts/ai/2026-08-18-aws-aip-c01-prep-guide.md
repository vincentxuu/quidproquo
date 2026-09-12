---
title: "AWS GenAI Developer Professional（AIP-C01）備考指南：考綱、教材與四步準備法"
date: 2026-08-18
type: guide
category: ai
tags: [certification, aws, generative-ai, rag, agents, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 2
tldr: "AIP-C01 考的是把基礎模型整合成可上線的 AWS 應用：RAG、agent、安全治理、成本與評估。本文依官方五章考綱，整理前置能力自評、四步準備法、教材選擇與實作驗收，附十週安排、AI 輔考範本及應考提醒。先做診斷，再用同一個 RAG 加 agent 專案補齊弱項。"
description: "AWS AIP-C01 備考指南：依官方考綱整理五章考點、四步準備法、Skill Builder 與第三方教材比較、RAG／agent 實作驗收、錯題整理及 AI 輔考範本，釐清 beta 心得與現行考試規格的差別。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)

本文依官方資料與具名考生心得整理，不是應考實錄；作者沒有報考這張考試。「考什麼」以[官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)為準；讀書順序、實作驗收與時間配置是本文建議。查證日期：2026-09-12。

AIP-C01 的重點是**把基礎模型整合成能上線的應用**。它把模型開發與訓練、進階 ML、資料與特徵工程列為不要求考生執行的工作。這不代表可以跳過所有相關知識：[第 1 章](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain1.html)仍包含微調模型的部署與生命週期、LoRA／adapter，以及 GenAI 輸入資料處理。

準備時要抓住這個分界：不用以模型研究或從零訓練為主線，卻要會判斷什麼時候需要客製化模型、如何串接資料，以及怎麼驗證整套系統。RAG、agent、guardrails、成本與延遲、評估與除錯，都是同一個應用的不同面向。

各家證照的價格、效期與門檻對照見站內的[2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)，本文不重複。

## 這張適合誰

官方建議具備兩年以上生產級應用開發經驗（AWS 或開源技術），並有一般 AI／ML 或資料工程背景，以及一年 GenAI 實作經驗。這是目標考生的描述，**不是報名資格限制**，也不能把年資直接換成備考週數。

**適合**已經做過 LLM 應用、agent 或 RAG，想把實作經驗整理成 AWS 架構判斷能力的人。若目標偏向模型訓練與 ML pipeline，先比較 MLA-C01 的考綱；兩張有雲端、安全與部署的共通基礎，主線不同。

### 前置能力自評

官方列出的 AWS 基礎包括運算、儲存、網路、安全與身分管理、部署與 IaC、監控及成本最佳化。把它們換成下面幾個自評問題，比只問「我有沒有考過 SAA」具體：

| 能力 | 開始備考前，試著做到 |
|---|---|
| AWS 應用開發 | 畫出 API Gateway、Lambda、S3 與資料庫的資料流，指出失敗時查哪裡 |
| 身分與網路 | 解釋應用角色如何取得模型、文件與工具的存取權，以及哪些請求應走私有網路 |
| 部署與營運 | 用熟悉的 IaC 工具重建環境，能回滾版本、查日誌與追蹤費用 |
| GenAI 實作 | 建過能附來源的 RAG，能分辨「沒找到資料」和「找到卻答錯」 |
| Agent 整合 | 接過外部工具，知道如何處理逾時、權限拒絕與需要人工核可的動作 |

只有 AWS 基礎不足，就補對應的雲端課程；只缺 Bedrock 經驗，就把既有 RAG 移植一次。兩邊都陌生，可先用 [AIF-C01 指南](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)建立詞彙與服務地圖，再回來做專案。**不用為了報考 AIP 而先集滿其他證照**，官方認證頁明確說沒有指定先修證照。

## 官方規格速覽

| 項目 | 內容 |
|---|---|
| 費用 | US$300；實際幣別、稅費與折扣以報名頁為準 |
| 時間 | 180 分鐘 |
| 題數 | 75 題，其中 **65 題計分、10 題不計分** |
| 題型 | 單選與複選（**沒有** AIF-C01 那種 ordering 與 matching） |
| 及格 | 量尺分數 **750**（範圍 100–1,000），補償計分 |
| 猜題 | 未作答算錯；猜錯不額外扣分，**不要留白** |
| 效期 | 3 年 |
| 語言 | 英文、日文、韓文、簡體中文（**沒有繁中**） |
| 先修 | 無 |

750 是量尺分數，**不是答對 75%**。官方採整體補償計分，不要求每章各自及格；複選題則要選齊所有正確選項才給分。

## 五章權重

| 章節 | 比重 |
|---|---|
| 1. Foundation Model Integration, Data Management, and Compliance | **31%** |
| 2. Implementation and Integration | 26% |
| 3. AI Safety, Security, and Governance | 20% |
| 4. Operational Efficiency and Optimization for GenAI Applications | 12% |
| 5. Testing, Validation, and Troubleshooting | 11% |

**第 1、2 章合計 57%**，可先建立 RAG 與整合能力；第 3 章的安全治理，以及第 4、5 章的營運與評估，要跟著實作一起練。官方只公布章節權重，**任務或技能點的條數不能換算成出題比例**。

## 逐章準備

### 第 1 章：FM 整合、資料管理與合規（31%，最重）

官方把這章拆成六個任務。以下依序整理，實作先從向量儲存與檢索接起。

**1.1 需求分析與方案設計**：架構設計、用 Bedrock 做技術 PoC、依 AWS Well-Architected Framework 與 **Generative AI Lens** 建立標準化元件。

**1.2 FM 選擇與設定**：依 benchmark、能力、限制選模型；**動態換模型的架構**（Lambda、API Gateway、AppConfig）；韌性設計（Step Functions circuit breaker、**Bedrock Cross-Region Inference**、跨區部署、優雅降級）；客製化生命週期（SageMaker AI 微調部署、**LoRA／adapter**、Model Registry 版控、回滾、模型退役）。

**1.3 資料驗證與處理管線**：Glue Data Quality、SageMaker Data Wrangler、Lambda、CloudWatch；多模態（Bedrock 多模態模型、SageMaker Processing、Transcribe）；模型專屬的輸入格式（Bedrock API 的 JSON、對話格式）。

**1.4 向量儲存設計**：Bedrock Knowledge Bases 的階層組織、OpenSearch Service 與 Neural plugin、RDS 搭 S3 文件庫、DynamoDB 搭向量庫、metadata 框架（S3 物件 metadata、自訂屬性、標籤）、**高效能索引（OpenSearch 分片、多索引、階層式索引）**、與文件管理系統整合、資料維護（增量更新、即時變更偵測、同步流程、排程刷新）。

**1.5 檢索機制與 RAG**：chunking（Bedrock 內建、Lambda 固定大小、階層式）；embedding 選擇（**Amazon Titan embeddings**、維度與領域適配、Lambda 批次 embedding）；向量搜尋部署（OpenSearch、**Aurora pgvector**、Bedrock Knowledge Bases 託管向量庫）；**進階搜尋（關鍵字＋向量混合、Bedrock reranker 模型）**；查詢處理（查詢擴展、分解、轉換）；存取機制（function calling、**用 MCP client 查詢向量庫**、標準化檢索 API）。

**1.6 Prompt 工程與治理**：Bedrock Prompt Management 的角色定義、Bedrock Guardrails；互動式脈絡（Step Functions 澄清流程、Comprehend 意圖、DynamoDB 對話歷史）；**prompt 治理**（參數化模板、審核流程、S3 儲存庫、CloudTrail、CloudWatch Logs）；prompt 的 QA 與回歸測試；**Bedrock Prompt Flows** 的 prompt 鏈、條件分支、可重用元件。

**怎麼準備**：把 RAG 做到能比較設計取捨。先用 Bedrock Knowledge Bases 建好檢索，再挑一段以 Aurora pgvector 自行實作，對照 metadata 過濾、增量更新與維運責任。用相同問題比較 chunking、混合搜尋與 reranker；每次只改一個變因，保留查回的片段與答案。這些是實作安排，不代表各技能有相同配分。

### 第 2 章：實作與整合（26%）

**2.1 agentic AI 與工具整合**（多 agent、工具與狀態管理）：**Strands Agents** 與 **AWS Agent Squad** 做多 agent；**MCP** 處理 agent 與工具的互動；記憶與狀態管理；用 Step Functions 實作 ReAct 與 chain-of-thought；**防護機制**（停止條件、Lambda timeout、IAM 資源邊界、circuit breaker）；模型組合與協調；human-in-the-loop（Step Functions 審核核可、API Gateway 回饋）；**MCP server 部署在 Lambda（輕量無狀態）或 ECS（複雜工具）**。

**2.2 部署策略**：Lambda 隨選呼叫、**Bedrock provisioned throughput**、SageMaker endpoint 混合；容器部署依記憶體／GPU／token 吞吐調校；**model cascading** 與小型任務專用模型。

**2.3 企業整合**：既有 API 整合、事件驅動鬆耦合；API Gateway 微服務、Lambda webhook、EventBridge；身分聯合、RBAC、最小權限存取 FM；**AWS Outposts 與 Wavelength** 處理資料落地與邊緣；**CI/CD 與 GenAI gateway 架構**（CodePipeline、CodeBuild、自動化測試、安全掃描、回滾、集中式抽象層）。

**2.4 FM API 整合**：Bedrock 同步 API、SDK 搭 SQS 非同步；**Bedrock streaming API**、WebSocket／SSE、chunked transfer；韌性（SDK 指數退避、API Gateway 速率限制、fallback、**X-Ray**）；**智慧模型路由**（靜態、Step Functions 依內容、依指標）。

**2.5 應用整合與開發工具**：API Gateway 處理串流與 token 上限；**AWS Amplify** UI 元件、OpenAPI、Bedrock Prompt Flows 無程式碼；**Bedrock Data Automation**；**Amazon Q Developer** 生成與重構程式碼；CloudWatch Logs Insights 搭 X-Ray 除錯。

**怎麼準備**：這章的 agent 內容跟站內的 [Agent 生產線系列](/posts/ai/2026-08-10-agent-security-harness-layer)脈絡相通，但**考試要的是 AWS 的具體實作對應** —— 知道「多 agent 要用什麼」不夠，要知道 Strands Agents 與 Agent Squad 各自的定位、MCP server 什麼時候放 Lambda 什麼時候放 ECS。

**AgentCore 要讀到能分工。** 依[官方概覽](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)，可先把 Runtime 對應到執行與隔離、Gateway 對應到工具接入、Identity 對應到身分與憑證、Memory 對應到跨互動脈絡、Observability 對應到追蹤除錯。練習把這些能力放進上面的 agent 資料流，解釋哪些交給託管服務、哪些仍由應用負責。服務持續新增功能，不代表每個新功能都已成為考點，範圍仍回到 exam guide。

### 第 3 章：AI 安全、資安與治理（20%）

**3.1 輸入輸出安全控制**：Bedrock Guardrails 的輸入過濾與回應過濾；自訂審核（Step Functions／Lambda）；**降低幻覺**（Knowledge Base grounding 加事實查核、信心分數、語意相似度、**JSON Schema 結構化輸出**）；縱深防禦（Comprehend 前置過濾、模型端 guardrail、Lambda 後處理、API Gateway 回應過濾）；**prompt injection 與 jailbreak 偵測**、輸入清洗、安全分類器、自動化對抗測試。

**3.2 資料安全與隱私**：VPC endpoint、IAM、**Lake Formation**、CloudWatch；PII 偵測用 **Comprehend 與 Macie**、Bedrock 原生隱私功能、S3 Lifecycle 保留；遮罩與匿名化。

**3.3 治理與合規**：SageMaker AI 的程式化 **model card**、Glue 資料血緣、metadata 標籤、CloudWatch 決策日誌；Glue Data Catalog 來源註冊、CloudTrail 稽核；持續監控（誤用、drift、政策違規偵測、**偏誤 drift 監控**、token 層級遮蔽、回應記錄、輸出政策過濾）。

**3.4 負責任 AI**：透明度（推理過程呈現、信心指標、來源歸屬、**Bedrock agent tracing**）；公平性（CloudWatch 公平性指標、用 Prompt Management／Prompt Flows 做 A/B、**LLM-as-a-judge 自動評估**）；政策合規（由政策生成 guardrail、model card 記錄限制、Lambda 合規檢查）。

**怎麼準備**：替同一個 RAG 加入有害內容、個資與越權查詢案例，分別檢查內容過濾、資料授權與稽核紀錄。JSON Schema 能檢查格式，不能保證答案真實；grounding 與事實查核仍要另外驗證。也不要把模型自行給的信心分數當成正確率。

### 第 4 章：營運效率與最佳化（12%）

**4.1 成本最佳化**：token 估算與追蹤、context window 最佳化、回應長度控制、**prompt 壓縮與 context pruning**；成本能力取捨、**依查詢複雜度分層使用 FM**、性價比；批次、容量規劃、自動擴展、provisioned throughput 最佳化；**語意快取、結果指紋、邊緣快取、確定性請求雜湊、prompt caching**。

**4.2 效能與延遲**：預先計算、**延遲最佳化的 Bedrock 模型**、平行請求、串流回應、benchmark；檢索速度（索引最佳化、查詢前處理、混合搜尋自訂評分）；吞吐量（token 處理最佳化、批次推論、併發管理）；**temperature 與 top-k／top-p 的選擇**、A/B 測試；API 呼叫剖析與向量庫查詢最佳化。

**4.3 監控與可觀測性**：CloudWatch 追蹤 token 用量、prompt 有效性、**幻覺率**、回應品質；異常偵測（token 暴衝、回應漂移）；**Bedrock Model Invocation Logs**；成本異常偵測；**工具呼叫的可觀測性與多 agent 協調追蹤**；向量庫營運監控；用 golden dataset 偵測幻覺、輸出 diff、推理路徑追蹤。

**怎麼準備**：先分清**語意快取與 [prompt caching](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)**：前者重用相似請求的結果，後者重用模型處理共用 prompt 前綴的計算。用重複問題與重複前綴各測一輪，記錄 token 用量、延遲與答案品質，並檢查快取如何失效、是否隔離不同使用者的資料。

### 第 5 章：測試、驗證與除錯（11%）

**5.1 評估**（9 個技能點）：品質指標（相關性、事實正確性、一致性、流暢度）；**Bedrock Model Evaluations**、A/B 與 canary、多模型評估、token 效率與延遲品質比；使用者回饋介面、評分系統、標註流程；持續評估、回歸測試、**自動化品質閘門**；**RAG 評估與 LLM-as-a-Judge**、人類回饋；檢索品質測試（相關性評分、脈絡匹配、檢索延遲）；**Bedrock Agent evaluations**、任務完成率、工具使用效果、多步推理品質；部署驗證（合成使用者流程、幻覺率與語意漂移檢查）。

**5.2 除錯**：context window 溢位、動態 chunking、截斷錯誤；FM API 整合失敗；prompt 測試框架與版本比較；檢索問題（embedding 品質診斷、drift 監控、向量化與 chunking 修正）；prompt 維護（CloudWatch Logs 找 prompt 混淆、X-Ray prompt 可觀測性、schema 驗證）。

**怎麼準備**：評估這塊跟站內的 [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks)重疊度高，可以先看那篇建立方法論，再對回 Bedrock 的具體工具。

## 準備方式

沿用 [AWS 認證頁的四步流程](https://aws.amazon.com/certification/certified-generative-ai-developer-professional/)：了解考試 → 補強知識 → 複習練習 → 評估準備度。AIP 要把這四步接到同一個可操作的專案，否則很容易看完課卻仍不會判斷架構。

### 需要多少時間？

原版十週計畫可當排程範本，不能當通過所需時間的統計。**先看能力缺口，再排週數**：

| 目前背景 | 準備重點 |
|---|---|
| 已用 Bedrock 維運 RAG 與 agent | 先做診斷，補未接觸的任務、治理與長情境題 |
| 做過其他平台的 GenAI 應用 | 把既有設計對應到 AWS，補 IAM、部署、監控與服務限制 |
| 有 AWS 經驗，但只做過 prompt demo | 先完成下方實作，再決定考試日期 |
| AWS 與 GenAI 都陌生 | 先補基礎；不要直接套十週倒數 |

早期的 [Christian Greciano beta 心得](https://christiangreciano.com/blog/posts/2026/1/0013_how-i-passed-aws-aip-genai-dev-pro-beta/)仍有參考價值：他已有四張 AWS 證照，卻因準備與練習不足而在考場時間吃緊，最後以 760 分通過。但 beta 有不同題數與時間，**不能拿它描述標準版體驗**。

### 標準版考生怎麼準備、考得怎樣

以下四篇都是在標準版開始提供後發表的第一人稱紀錄；前三篇明示應試或通過時間，第四篇則明示已取得 AIP。它們是少量、有明確背景的樣本，能幫你看見差異，不能推算「平均需要幾週」或某教材的通過率。

| 考生與時間 | 背景與做法 | 可採用的教訓 |
|---|---|---|
| [motuneko253，2026-04-18 應試](https://qiita.com/motuneko253/items/01c898cf9627b33143c4) | 已有多張 AWS 證照，含 SAP；準備不到一週，以 CloudLicense 題組複習，805 分通過 | 這是資深 AWS 應試者的下限案例，不能移植成新手的一週計畫；他自己認為既有架構判斷能力有助於排除明顯不合適的選項。 |
| [豆蔵，2026-04-20](https://developer.mamezou-tech.com/blogs/2026/04/20/aws_certified_generative_ai_developer/) | beta 曾失敗，標準版重新準備後通過；著重考綱、Bedrock 周邊服務、長情境的「需求與限制」拆解 | 有既有證照也可能被長題幹、同時滿足可擴展性／安全／成本的取捨卡住。把限制寫成清單，再選架構，比背服務名稱可靠。 |
| [ohway_death，2026-06-22](https://qiita.com/ohway_death/items/f8994cf316b212f4c2b1) | AWS 經驗四年，正用 CDK、GenAI 與 Step Functions 開發；5 月先用 SimuLearn、官方題與課程，6 月再做兩套題組並回查文件 | 他按每題兩分鐘、保留半小時複查，實際卻在 160 分鐘才完成全部題目、留下 25 題標記。標準版的計時演練必須留在計畫中，不能只做不計時題。 |
| [AsiaQuest 櫻井，2026-07-24](https://techblog.asia-quest.jp/202607/aws-generative-ai-developer-aip-exam-guide) | 有 AI／基礎設施實務與 AWS 全證照背景；以 Skill Builder 題目、模擬考和 Black Belt 補服務用法 | 實務能縮短「服務在系統裡怎麼連」的理解，但這位作者也有很強的既有 AWS 背景。把官方練習和工作中沒碰過的服務並列補足，較適合一般讀者採用。 |

四人的背景落差很大，卻有兩個一致訊號。第一，**標準版仍是長情境下的架構取捨題**：先找資料駐留、權限、成本、延遲、營運責任等限制，再比較選項。第二，**實務經驗不是用來免讀，而是讓你能把服務選擇接回資料流、失敗處理與監控**。這也解釋為什麼「一週通過」與「需要多輪計時練習」可以同時成立。

把這些心得放進你的計畫時，採用做法，不複製時程：先做一輪限時題找弱項；每一題回查考綱或官方文件；再用一個能留下日誌、成本和安全拒絕紀錄的專案補弱。個人心得對實際題目範圍的描述只作學習線索，最終以官方 exam guide 為準。

### 第一步：了解考試，留下診斷紀錄

讀 [exam guide](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)，把每個 task 標成「做過」「能解釋」「不熟」。接著做官方 **Practice Question Set**，先不翻解答，記錄哪些答案是猜的。猜對也算待補，不要只收錯題。

每個弱點要能回到具體任務，例如「1.5 檢索」「2.1 工具整合」「5.2 除錯」。若問題是看不懂 IAM 條件，就補 IAM；若是不知道檢索失敗怎麼排查，就回去查實作日誌。不要因為錯了一題，重新從整門課第一堂看起。

### 第二步：補強知識，選一條主線

**官方路徑**：[AIP-C01 Exam Prep Plan](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01)適合當範圍檢查表。AWS 公告確認它包含章節課程、練習評量及 SimuLearn 實作；更需要人帶著操作，可看官方 [Advanced Generative AI Development on AWS](https://skillbuilder.aws/learn/YACQQYH17K/advanced-generative-ai-development-on-aws/1QJSMSPUVB)課程，涵蓋 Knowledge Bases、AgentCore 與企業整合。

**偏好影片加示範**：可比較 [Frank Kane／Stéphane Maarek 的 AIP-C01 課程](https://www.udemy.com/course/ultimate-aws-certified-generative-ai-developer-professional/)。目前課程頁列出 AgentCore、Strands、Agent Squad、RAG、評估與完整模擬考。這是供應商公布的內容，本文沒有完課評測；先試看弱項章節，再決定是否購買，不需要同時買多門主課程。

**實作主線：做一個能查文件、呼叫工具的企業助理。** 以下是本文依考綱設計的練習，不是 AWS 官方 lab 或真題：

| 練習 | 做什麼 | 驗收時留下什麼 |
|---|---|---|
| RAG 與資料更新 | 文件匯入 Knowledge Bases，對照不同 chunking 與檢索設定；加入更新與刪除文件案例 | 問題、預期來源、查回片段、答案與同步結果；能解釋為何漏查 |
| Agent 與工具 | 接一個唯讀查詢工具，再加需要核可的寫入動作；模擬逾時、拒絕與重複請求 | 工具輸入輸出、權限邊界、停止條件；重試不會造成重複寫入 |
| 安全與治理 | 測試個資、有害內容、文件中的惡意指令與跨使用者查詢 | 各層攔截或拒絕紀錄，確認沒洩漏其他使用者資料 |
| 成本與評估 | 在固定題組比較模型、prompt 或快取設定，一次只改一項 | 任務成功率、來源支持程度、token 用量、延遲與回歸結果 |

先做出最小可重現版本，再擴充。用自己的 AWS 帳號實作，開始前設定 [AWS Budgets 預算提醒](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)，結束後清掉不用的端點、向量庫與儲存資源；預算提醒本身不會自動停止收費。

### 第三步：複習與練習，把服務名稱換成判斷規則

AIF 的「情境配對服務」到了 AIP，需要再說明**為什麼另一個看似可行的選項不符合限制**。以下是練習判斷的切入點，不是遇到關鍵字就選固定答案：

| 情境 | 優先檢查的取捨 |
|---|---|
| 企業知識常變動，答案必須附來源 | 檢索、同步與權限是否滿足需求，再判斷是否還需要模型客製化 |
| Agent 要執行有副作用的工具 | 在工具執行層驗權限、核可與重複請求；不能只靠 prompt 告訴它小心 |
| 回答變慢 | 分開量檢索、模型與工具時間，再決定索引、模型、串流或併發的改善方向 |
| API 正常，但答案不可靠 | 檢查找回的證據、prompt、模型輸出與評估標準；HTTP 成功不是任務成功 |
| 需要追查異常操作與回答 | 分清 API 稽核、應用日誌、模型互動紀錄與端到端追蹤各能回答什麼 |

需要更多練習時，[Tutorials Dojo AIP-C01](https://portal.tutorialsdojo.com/courses/aws-certified-generative-ai-developer-professional-aip-c01-practice-exams/)提供 review、timed、分章與隨機模式，附解釋與參考連結。可以先用 review mode 查缺口，再換 timed mode；這些是供應商功能說明，不代表本文驗證過它與真實考題的相似度。

錯題筆記不用抄整題，留下這張表就夠：

| 對應任務 | 我漏看的限制 | 為何原選項不合適 | 下次怎麼判斷 | 官方依據／重測結果 |
|---|---|---|---|---|
| 2.1 工具整合 | 寫入前必須核可 | 只加內容過濾，沒有擋住工具執行 | 先找動作的授權與核可位置 | 回查文件，重跑拒絕案例 |

長題幹先讀最後的要求，找出「最低成本」「最少維運」「資料不得離開指定區域」等限制，再回頭讀完整情境。複選題要逐一驗證所有選項；不能找到第一個合理答案就停。

### 第四步：評估準備度

目前 AIP 官方認證頁在第四步列的是 **Official Pretest**；不要直接照搬 AIF 資源表，假定兩張的課程與評量名稱完全一樣。再用尚未做過的完整題組計時，檢查讀題節奏。

本文建議在報名前確認：

- 能解釋正確答案，也能說出其餘選項違反哪個限制。
- 面對沒看過的題目，仍能從需求推出設計，而不是記得選項位置。
- 五章都有補弱紀錄；第 4、5 章不是只在考前翻過一次。
- 實作能重現檢索失敗、工具逾時與安全拒絕，並找到對應紀錄。
- 計時練習能完成，還有時間檢查不確定題。

重做熟悉題組的高分只能表示記得答案，不能當成準備完成。第三方正確率也無法直接換算成 AWS 的 750 量尺分數。

### AI 輔考：用來追問推理，不當答案來源

可以把已查核的官方考綱與自己的錯題摘要交給 AI，請它扮演考官。這是本文建議的用法，沒有宣稱能提高多少分。範本：

```text
只依我提供的 AWS 官方資料，針對 task 1.5 與 2.1 各設計一題原創情境題。
一次問一題，先不要給答案。等我回答後：
1. 指出我忽略的需求或限制。
2. 逐一解釋各選項何時適用、在本題為何不適用。
3. 標註支持判斷的來源段落；資料不足就說不足，不補造服務能力。
4. 改動一個限制後再問我，確認我能重新推理。
不要重建或宣稱提供真實考題。
```

把 AI 產出的「服務限制」「API 行為」逐項回查官方文件。錯題卡只放自己整理的概念與原創例子；不要上傳公司資料或受限制的題庫全文。考前再請它抽問容易混淆的設計取捨，比要求它生成一份很長的總整理更容易發現缺口。

### 資源一覽：每種工具負責一件事

| 資源 | 用途 | 選用提醒 |
|---|---|---|
| 官方 exam guide | 範圍與任務清單 | 公開文件；用來核對所有教材 |
| Official Practice Question Set | 初次熟悉官方題目風格 | 由 AIP Exam Prep 入口進入；不是完整考試 |
| AIP Exam Prep Plan | 補課與章節複習主線 | 各項課程的免費／訂閱標示以登入後為準 |
| Builder Labs、Cloud Quest、Jam | 引導式實作或挑戰 | AWS 認證頁列為練習方式；挑與弱項相關的活動 |
| SimuLearn | 情境判斷與動手練習 | 官方公告確認納入 AIP 準備路徑 |
| Official Pretest | 最後檢查準備度 | 現行 AIP 認證頁第四步列出的評量 |
| Kane／Maarek 課程 | 影片、示範與模擬考 | 付費選項；先試看，查現行課綱與售價 |
| Tutorials Dojo | 分章複習與計時練習 | 付費選項；把解答連結用來查證，不只背答案 |

本次 Skill Builder 分類頁未回傳可讀的課程明細，因此不沿用舊版精確到分鐘的總時數、項目數與訂閱價格。上表中的官方資源用途以 AWS 認證頁與公告為據，購買前再確認登入後的實際內容與費用。

### 十週安排範本

以下以每週約 8–10 小時安排，是給已有基礎者的讀書計畫，**不是 AWS 建議時數或考生平均值**。除了各週主題，從第一個 lab 起就保留日誌、成本與評估紀錄：

| 週次 | 主題 | 完成條件 |
|---|---|---|
| 第 1 週 | 考綱、官方練習題、前置補課 | 做出按 task 分類的弱點清單 |
| 第 2–3 週 | 第 1 章：模型、資料、RAG 與 prompt | 留下一組檢索設計比較與資料更新紀錄 |
| 第 4–5 週 | 第 2 章：agent、工具、部署與 API | 能重現逾時、權限拒絕及核可流程 |
| 第 6–7 週 | 第 3 章：安全、隱私與治理 | 重跑惡意輸入、個資與越權案例 |
| 第 8 週 | 第 4 章：成本、延遲與監控 | 比較設定改動的成本與品質，找出瓶頸 |
| 第 9 週 | 第 5 章：評估、回歸與除錯 | 用固定題組攔下退步版本，定位失敗原因 |
| 第 10 週 | Pretest、完整計時與補弱 | 回看錯題原因，確認仍有哪些任務不熟 |

若實作驗收還沒完成，就延長對應週次。把第 4、5 章各留一週，是為了避免監控與除錯被壓縮成考前最後一晚；它們也應貫穿前面的實作。

## 應考前與考試當天

- **語言與加時**：AIP 目前沒有繁體中文。非英語母語者選英文考試，可依 [Before Testing](https://aws.amazon.com/certification/policies/before-testing/)在報名前申請 ESL +30；不要假定選其他語言也適用。
- **身分核驗**：報名姓名需與證件相符。依所在地與測驗方式確認證件要求；若沒有應試國家合格的政府證件，官方另有護照及第二證件規定，以預約通知為準。
- **考場或線上監考**：官方提供 Pearson VUE 考場與線上選項。選線上就先完成預約通知要求的系統與環境檢查，選考場就先確認交通及報到時間。
- **時間分配**：以標準版規格換算，平均每題約 2.4 分鐘；這是總時間的算術平均，還沒扣複查時間。卡住先選目前最合理答案並標記，避免後面的題目留白。
- **成績通知**：官方通常在考後五個工作天內提供結果；涉及安全或技術審查時例外。不要把別人當晚收到徽章的時間當成保證。

## 判斷教材是否過期

[AWS 公告](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/)在 2026-03-17 的更新中確認：標準版加入 Bedrock AgentCore，beta 最後應試日為 2026-03-31。

**舊教材不等於整套作廢。** RAG、IAM、評估與成本取捨仍可沿用；需要補的是現行考綱的缺口。選教材時做三件事：

- 對照五章任務，特別檢查 AgentCore、Strands Agents、Agent Squad、MCP 與工具安全是否有內容，而不只是出現在宣傳標題。
- 看範例是否仍符合現行服務限制、模型支援與部署方式；有疑問就回官方文件確認。
- 把 beta 心得的題數、時間與考點印象分開標記，不拿來取代標準版規格。

教材只寫 SageMaker、沒有加 AI，頂多是命名沒有更新，**不能單憑名稱判斷整套過期**。買課前先試看最不熟的章節，確認它真的示範失敗處理、評估與取捨。

## 考完之後

依 [AWS 續期規則](https://aws.amazon.com/certification/recertification/)，AIP-C01 效期為三年，續期方式是通過最新版本的同一張考試。若帳號有可用五折券，以目前美元定價計算，折後考試費是 US$150；實際結帳金額仍看報名頁。

考過 AIP-C01 也能續期你**已持有且仍有效**的 AIF-C01、MLA-C01 與 Data Engineer – Associate。效期從完成續期行動當天起算三年，不是在原到期日後再加三年，也不會直接授予你尚未取得的證照。

[重考政策](https://aws.amazon.com/certification/policies/after-testing/)規定：未通過須等十四個日曆天，每次重考須重新付費；通過後兩年內不能重考同一考試。若改成新的 exam guide **及新的考試代碼**，可報考新版，不能把所有考綱微調都當成例外。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-09-12 查證） | 什麼時候要重查 |
|---|---|---|
| 考綱內容 | 已含 Bedrock AgentCore（2026-03 refresh） | 每次 AWS re:Invent 之後 |
| 五章權重 | 31 / 26 / 20 / 12 / 11 | 每次改版 |
| 費用與題數 | $300、75 題（65 計分）、180 分鐘 | 每季 |
| 續期路徑 | 只能重考，但可續掉 AIF／MLA／DEA | 每半年 |
| 語言 | 英日韓與簡中，無繁中 | 每半年 |

## 更新紀錄

- 2026-09-12：補入四份標準版後的獨立考生紀錄，明確區分 beta 與標準版，將一週通過等個案放回其 AWS 背景與應試條件，而非當作一般時程。
- 2026-09-12：參照 AIF-C01 指南補上前置自評、四步準備法、教材比較、實作驗收、錯題與 AI 輔考範本、應考提醒；調整十週安排，移除技能條數換算配分與舊教材全部失效的說法，釐清微調範圍及續期規則，同步英文版。

## 參考資料

- [AWS Certified Generative AI Developer – Professional 官方認證頁](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AIP-C01 官方 exam guide（HTML）](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01.html)
- [AWS 公告：擴充 AI 認證組合（含 AgentCore refresh 與 beta 結束日）](https://aws.amazon.com/blogs/training-and-certification/big-news-aws-expands-ai-certification-portfolio-and-updates-security-certification/)
- [AWS Skill Builder — AIP-C01 Exam Prep](https://skillbuilder.aws/category/exam-prep/generative-ai-developer-professional-AIP-C01)
- [AWS Recertification（續期路徑與五折券）](https://aws.amazon.com/certification/recertification/)
- [AWS Certification — After Testing（重考政策）](https://aws.amazon.com/certification/policies/after-testing/)

- [AIP-C01 Domain 1：FM、資料與檢索](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain1.html)
- [AIP-C01 Domain 2：Agent 與應用整合](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain2.html)
- [AIP-C01 Domain 3：安全與治理](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain3.html)
- [AIP-C01 Domain 4：效率與監控](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain4.html)
- [AIP-C01 Domain 5：評估與除錯](https://docs.aws.amazon.com/aws-certification/latest/ai-professional-01/ai-professional-01-domain5.html)
- [Bedrock AgentCore 官方概覽](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/what-is-bedrock-agentcore.html)
- [Bedrock prompt caching：前綴重用與模型支援](https://docs.aws.amazon.com/bedrock/latest/userguide/prompt-caching.html)
- [AWS Budgets：預算通知與動作](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)
- [AWS Before Testing：ESL 與身分核驗](https://aws.amazon.com/certification/policies/before-testing/)
- [Frank Kane／Stéphane Maarek AIP-C01 課程](https://www.udemy.com/course/ultimate-aws-certified-generative-ai-developer-professional/) — 課程內容依供應商頁面，非本文完課評測
- [Tutorials Dojo AIP-C01 練習題](https://portal.tutorialsdojo.com/courses/aws-certified-generative-ai-developer-professional-aip-c01-practice-exams/) — 練習模式依供應商說明
- [Christian Greciano：AIP-C01 beta 應考心得](https://christiangreciano.com/blog/posts/2026/1/0013_how-i-passed-aws-aip-genai-dev-pro-beta/) — 個人經驗，非標準版配分證據

**標準版考生心得**

- [motuneko253：AIP-C01 合格體驗記](https://qiita.com/motuneko253/items/01c898cf9627b33143c4) — 2026-04-18 應試、805 分；資深 AWS 證照背景
- [豆蔵：AWS Generative AI Developer 合格與 W 全冠](https://developer.mamezou-tech.com/blogs/2026/04/20/aws_certified_generative_ai_developer/) — 2026-04 標準版通過，含 beta 失敗後的復盤
- [ohway_death：AIP-C01 受驗記](https://qiita.com/ohway_death/items/f8994cf316b212f4c2b1) — 2026-06 標準版的學習、計時與通過紀錄
- [AsiaQuest：AIP-C01 攻略方法](https://techblog.asia-quest.jp/202607/aws-generative-ai-developer-aip-exam-guide) — 2026-07 的取得者經驗與 Skill Builder／Black Belt 準備方式

**站內相關**

- [2026 年工程師 AI 證照有哪些](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)
- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [Google PMLE 備考路徑](/posts/ai/2026-08-18-google-pmle-prep-guide)
- [RAG 評估框架](/posts/ai/2026-03-12-rag-evaluation-frameworks)
