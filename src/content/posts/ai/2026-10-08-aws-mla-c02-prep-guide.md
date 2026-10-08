---
title: "AWS Machine Learning Engineer Associate（MLA-C02）備考路徑：107 條技能裡有 45 條是新加的"
date: 2026-10-08
type: guide
category: ai
tags: [certification, aws, mlops, machine-learning, rag, career]
lang: zh-TW
series:
  name: "AI 證照備考"
  order: 30
tldr: "MLA-C02 自 2026 年 9 月 29 日起取代 MLA-C01。四章權重 28 / 24 / 24 / 24，章節名稱都加上了 AI 或 FM：官方對照表列出 45 條新增技能，內容是向量資料庫、embedding、RAG、基礎模型的選擇與微調、agent 的部署與監控，另刪掉 7 條。目前是英文 beta（考試代碼 ME1-C02、170 分鐘、85 題、$75）；正式版依考試指南是 65 題、及格 720、效期 3 年，日文、韓文、簡中要等正式上線，沒有繁體中文。"
description: "AWS Certified Machine Learning Engineer – Associate（MLA-C02）備考指南，依官方 exam guide 的四章權重拆解，整理 MLA-C01 到 C02 的新增與刪除內容、beta 與正式版的規格差異、八週時程的換算依據，以及舊教材還能用多少。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-10-08-aws-mla-c02-prep-guide-en)
>
> 本文是從官方資料建出來的備考路徑，不是應考實錄，作者沒有報考這張考試。所有「考什麼」都指回 [AWS 官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html)，不含考古題。查證日期：2026-10-08。

AWS 的 ML Engineer Associate 換版了。依官方的[新舊對照頁](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/mla-02-comparison.html)，MLA-C01 用到 2026 年 9 月 28 日，MLA-C02 從 9 月 29 日開始。四章的權重幾乎沒動，但每一章的名稱都多了「AI」或「FM」兩個字，這次改版的方向就在那兩個字裡：它不再只是 SageMaker 上的傳統 ML 考試。

這張與另外兩張 AWS AI 證照的取捨，見站內的 [AWS 三張 AI 證照怎麼選](/posts/ai/2026-08-19-aws-certifications-which-one)。

## 這張適合誰

官方 exam guide 的目標考生描述：

> The target candidate should have at least 1 year of experience using Amazon SageMaker AI, Amazon Bedrock, and other AWS services for ML engineering… The candidate should have experience with both traditional ML and generative AI (GenAI).

另外要有一年後端、DevOps、資料工程或資料科學這類相關職務的經驗。

**適合**：在 AWS 上負責把模型送上線並維運的工程師，而且手上同時有傳統 ML 模型與生成式 AI 應用。

**不適合**：只做生成式 AI 應用、不碰模型訓練的人，那比較接近 [AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)。官方也列了四項不在目標考生範圍內的工作：設計完整的端到端 AI 與 ML 方案、訂定最佳實務與 ML 策略、整合大量服務或新工具、深入兩個以上的 ML 領域。也就是說它考執行，不考架構決策。

其他雲的對應考試是微軟的 [AI-300](/posts/ai/2026-10-08-microsoft-ai-300-prep-guide) 與 [Google PMLE](/posts/ai/2026-08-18-google-pmle-prep-guide)。

## 官方規格速覽

beta 與正式版的規格不同，分開列：

| 項目 | beta（現在能報名的） | 正式版（依 exam guide） |
|---|---|---|
| 考試代碼 | ME1-C02 | MLA-C02 |
| 時間 | 170 分鐘 | 官方尚未公布（MLA-C01 是 130 分鐘） |
| 題數 | 85 題 | **65 題**（50 題計分 + 15 題不計分） |
| 費用 | **$75 USD**（beta 價） | **$150 USD**（[官方價目表](https://aws.amazon.com/certification/policies/before-testing/)的 Associate 級定價） |
| 及格 | 不適用正式版的及格線 | **720**（量尺 100–1,000） |
| 語言 | 僅英文 | 英文，另加日文、韓文、簡體中文 |
| 題型 | 單選、複選 | 單選、複選 |
| 效期 | 3 年 | 3 年 |

beta 欄取自[官方認證頁](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)，正式版欄取自 exam guide。**沒有繁體中文**，本系列的 AWS 證照裡只有 AIF-C01 有。

計分方式是補償計分，exam guide 寫「you do not need to achieve a passing score in each section」，單章不設門檻，只看總分。複選題要全對才得分，答錯不倒扣。

## 四章權重

| 章 | MLA-C02 | MLA-C01 |
|---|---|---|
| 1. Data Preparation for ML and AI | **28%** | 28% |
| 2. ML Model and Foundation Model (FM) Development | 24% | 26% |
| 3. Deployment and Orchestration of ML and AI Workflows | 24% | 22% |
| 4. Operating, Monitoring, and Securing ML and AI Solutions | 24% | 24% |

第二章降 2%、第三章升 2%，其餘不變。真正的變化在章節底下的技能條目。

## C01 到 C02：加了什麼、刪了什麼

官方對照頁逐條列出。四章現在共 **107 條技能**，其中 **45 條是 C02 新增的**：

| 章 | 現有技能數 | 其中新增 |
|---|---|---|
| 第一章 | 25 | 10 |
| 第二章 | 27 | 11 |
| 第三章 | 30 | **15** |
| 第四章 | 25 | 9 |

新增最多的是第三章（部署與編排）。

**刪掉的 7 條**：把資料載入訓練資源的設定（EFS、FSx）；用自訂資料集微調預訓練模型的舊寫法；縮小模型（剪枝、壓縮）；用 SageMaker Neo 做邊緣裝置最佳化；自帶容器（BYOC）；用 EventBridge 監控基礎架構；容量問題的除錯。

**判斷舊教材還能用多少**：C01 的教材大約蓋得住六成的條目（107 條裡有 62 條不是新增的），但缺的那四成集中在生成式 AI，而且舊教材會教已刪除的 SageMaker Neo 與 BYOC。

## 逐章準備

### 第一章：Data Preparation for ML and AI（28%，最重）

**官方考什麼**，三個 task：

- **蒐集與儲存資料**：從 S3、RDS、DynamoDB、OpenSearch 等來源擷取；依成本、效能與合規選儲存；串流擷取（Kinesis、Flink、Kafka）；資料格式（Parquet、JSON、CSV、ORC）；**設定可擴展的向量資料庫**（OpenSearch Service、RDS 搭配 pgvector、S3）；擷取文字、圖片、音訊等多種資料；寫入 SageMaker Feature Store。
- **轉換與特徵工程**：Glue、DataBrew、EMR 上的 Spark、Data Wrangler；特徵工程（標準化、分箱、對數轉換）；**設定並使用 embedding 模型**；**為 RAG 準備文件**（chunking 策略、metadata 擷取）；遮蔽與匿名化；**為基礎模型的微調、持續預訓練與蒸餾準備資料**。
- **資料品質與偏差**：驗證資料品質；標註；辨識並緩解偏差；處理類別不平衡；**驗證 AI 訓練資料的完整性**（prompt 與回應的配對驗證、內容安全篩檢）；清理資料。

**怎麼準備**：這章一半是傳統資料工程，一半是 RAG 的前處理。練習：拿同一批文件，一邊走 Glue 到 Feature Store 的路，一邊走 chunking 到 embedding 再進向量資料庫的路，兩條都做一次。

### 第二章：ML Model and Foundation Model (FM) Development（24%）

**官方考什麼**：

- **選模型與做法**：**依任務需求從 Amazon Bedrock 挑基礎模型**；辨識微調策略；**在自建、受管服務、預訓練模型與基礎模型之間取捨**；**選 RAG 架構模式**；模型效能、訓練時間、延遲與成本的取捨；用 AWS AI 服務（Textract、Rekognition、Comprehend、Transcribe）解決特定問題。
- **訓練與客製**：SageMaker AI 內建演算法與 script mode；超參數最佳化（automatic model tuning）；縮短訓練時間（early stopping、分散式訓練）；**防止過擬合、欠擬合與災難性遺忘**；**客製技巧（依任務的 prompt engineering、微調）**；最佳化檢索元件與 embedding 模型。
- **評估**：可重現的實驗（SageMaker AI 上的 MLflow、Bedrock evaluations、Bedrock Prompt Management）；基準與漂移偵測；shadow variant；解釋模型輸出；**人工評估框架**；**NLP 評估指標（BLEU、ROUGE、BERTScore、語意相似度）**；**LLM-as-a-judge**；**RAG 系統監控，含檢索準確度評估**。

**怎麼準備**：評估那組是新增內容最密的地方。四個 NLP 指標要能各說出「量的是什麼、什麼情況下會失準」。RAG 的評估方法在站內的 [RAG 與檢索評估的考點交集](/posts/ai/2026-08-18-rag-evaluation-exam-domains)整理過。

### 第三章：Deployment and Orchestration of ML and AI Workflows（24%）

**官方考什麼**：

- **部署基礎架構**：選運算環境與部署目標；多模型或多容器部署；即時與批次推論；**基礎模型的部署選項**；把 AWS 以外建的模型部署進來（Bedrock Custom Model Import）；**部署並設定 agent，含與其他服務的整合與 agent 通訊協定**；RAG 的檢索策略與 reranking。
- **佈建與設定資源**：隨需與佈建資源的取捨；容器；VPC 內的 SageMaker AI 端點；自動擴展的指標選擇；**建立並管理 Bedrock knowledge base**；檢索 pipeline；**agent 的狀態管理**；GPU 工作負載的擴展；**部署 agentic workflow 的基礎架構**。
- **CI/CD 與編排**：自動化部署與回復；CodeBuild、CodeCommit、CodeDeploy、CodePipeline、CodeConnections；重新訓練的機制；模型版本管理（SageMaker Model Registry）；**管理 prompt（Bedrock Prompt Management）**；**agent 的自動化部署 pipeline 與版本管理**；**prompt 測試**；**RAG 系統更新與 knowledge base 重新整理的 pipeline 編排**。

**怎麼準備**：這章新增了 15 條，agent 的條目主要在這裡。練習：做一個接 Bedrock knowledge base 的 agent，用 CodePipeline 部署它，然後改一次 prompt、發一個新版本、再回復。

### 第四章：Operating, Monitoring, and Securing ML and AI Solutions（24%）

**官方考什麼**：

- **監控**：CloudWatch 的生成式 AI 可觀測性、Bedrock Model Evaluation、漂移偵測；資料分布變化；A/B 測試；**agent 的效能與協調監控**（協調失敗偵測、串流被截斷、工具失敗）。
- **成本與效能**：推論執行個體家族的選擇；CloudWatch、**Bedrock AgentCore Observability**、X-Ray；儀表板；購買選項；**基礎模型推論的成本**；**agent 的資源消耗**；**AI 特有的成本型態**（token 用量、embedding 運算成本、向量資料庫儲存）。
- **資安**：CI/CD 的程式碼與映像檔弱點掃描；最小權限；IAM 政策與角色；CloudTrail 與 Config；VPC 隔離；**存取基礎模型的憑證類型**（Bedrock API key、IAM 憑證）；**Bedrock Guardrails**。

**怎麼準備**：成本那組與站內的[成本、延遲與可用性的考點交集](/posts/ai/2026-08-18-genai-cost-latency-exam-domains)重疊。練習：把第三章做的 agent 接上 CloudWatch 與 AgentCore Observability，找出一次完整呼叫的 token 用量與最慢的步驟。

## 八週時程與換算依據

**換算方式**：107 條技能，四章各 25 到 30 條，分布平均，所以每章給差不多的時間。它要求同時有傳統 ML 與生成式 AI 的實作經驗，兩邊都得動手，以每週 6–8 小時估算是八週。

| 週次 | 內容 | 依據 |
|---|---|---|
| 第 1 週 | 通讀 exam guide 與新舊對照頁，標出自己不熟的新增條目 | 45 條新增是舊經驗補不到的 |
| 第 2–3 週 | 第一章（28%） | 最重，傳統資料工程與 RAG 前處理各一半 |
| 第 4–5 週 | 第二章（24%） | 評估那組新增最密 |
| 第 6 週 | 第三章（24%） | 做一個 agent 並用 pipeline 部署 |
| 第 7 週 | 第四章（24%） | 監控、成本、資安接在同一個專案上 |
| 第 8 週 | 官方練習題與補弱 | 認證頁列了官方的練習題組、前測與練習考試 |

只做過傳統 ML 的人，把時間往第三、四章的 agent 與基礎模型條目挪；只做過生成式 AI 的人，把時間往第一、二章的特徵工程與訓練挪。

官方的備考入口是 [AWS Skill Builder 的 MLA-C02 考試準備頁](https://skillbuilder.aws/category/exam-prep/machine-learning-engineer-associate-MLA-C02)。

**失敗成本**：依 AWS 的[重考政策](https://aws.amazon.com/certification/policies/after-testing/)，沒過要等 14 個日曆天，每次重新付費。**beta 的規則不同**：依 AWS 的[考前政策](https://aws.amazon.com/certification/policies/before-testing/)，beta 版只能考一次，沒過要等正式版上線才能再考。所以 beta 省下的 $75 是用「只有一次機會」換的，還沒準備好的人等正式版比較划算。

## 這張的已知陷阱

1. **beta 與正式版的規格不一樣。** beta 是 85 題、170 分鐘，exam guide 寫的正式版是 65 題。認證頁說明 beta 多出來的題目是統計評估用的，不計分，時間也因此加長。考綱兩者相同，以 exam guide 為準。
2. **兩個代碼是同一張。** MLA-C02 是新版認證的名稱，ME1-C02 是目前 beta 的考試代碼，認證頁兩個並列。
3. **beta 的成績不是當場出。** 認證頁寫 beta 成績通常在考完後 5 個工作天內提供；exam guide 另註明正式版的及格判定方式不適用 beta 版。
4. **非英文考生現在沒有新版可考。** 日文、韓文、簡體中文的 MLA-C01 會留到 C02 正式上線為止，C02 的這三種語言也要到正式上線才有。
5. **舊教材會教已刪除的內容。** SageMaker Neo、BYOC、模型壓縮已從考綱移除，而向量資料庫、Bedrock、agent 是舊教材沒有的。

## 考完之後：三年效期

效期三年。續期可以重考最新版的 MLA，或考過 AIP-C01；而考過最新版 MLA 也能把 AIF-C01 一起續掉。完整的續期關係圖在 [AWS 三張 AI 證照怎麼選](/posts/ai/2026-08-19-aws-certifications-which-one)。

## 會過期的東西（下次複查看這裡）

| 項目 | 現況（2026-10-08 查證） | 什麼時候要重查 |
|---|---|---|
| 考試狀態 | 英文 beta，代碼 ME1-C02 | 每月，直到正式上線 |
| 正式版的價格 | $150（Associate 級定價） | 每半年 |
| 正式版的考試時間 | 官方尚未公布 | 正式上線時 |
| 四章權重 | 28 / 24 / 24 / 24 | 每次改版 |
| 技能條目數 | 107 條，其中 45 條新增 | 每次改版 |
| 其他語言 | 日、韓、簡中待正式上線；無繁中 | 正式上線時 |

## 參考資料

- [AWS Certified Machine Learning Engineer – Associate 認證頁](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/)
- [MLA-C02 官方 exam guide](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/machine-learning-engineer-associate-02.html)
- [MLA-C01 與 MLA-C02 對照頁（新增、刪除與重新分類）](https://docs.aws.amazon.com/aws-certification/latest/machine-learning-engineer-associate-02/mla-02-comparison.html)
- [AWS Skill Builder：MLA-C02 考試準備](https://skillbuilder.aws/category/exam-prep/machine-learning-engineer-associate-MLA-C02)
- [AWS Certification：考前政策（價目表與 beta 考試規則）](https://aws.amazon.com/certification/policies/before-testing/)
- [AWS Certification：考後政策（重考）](https://aws.amazon.com/certification/policies/after-testing/)

**站內相關**

- [AWS 三張 AI 證照怎麼選](/posts/ai/2026-08-19-aws-certifications-which-one)
- [AWS GenAI Developer Professional（AIP-C01）備考指南](/posts/ai/2026-08-18-aws-aip-c01-prep-guide)
- [AWS AI Practitioner（AIF-C01）備考路徑](/posts/ai/2026-08-18-aws-aif-c01-prep-guide)
- [微軟 AI-300 備考路徑](/posts/ai/2026-10-08-microsoft-ai-300-prep-guide)
- [RAG 與檢索評估的考點交集](/posts/ai/2026-08-18-rag-evaluation-exam-domains)
